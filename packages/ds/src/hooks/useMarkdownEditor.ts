import {
  useLayoutEffect,
  useRef,
  useState,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from 'react';
import {
  applyMarkdownAction,
  type MarkdownAction,
} from '../utils/markdown/applyMarkdownAction';

export interface UseMarkdownEditorOptions {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  onImageUpload?: (file: File) => Promise<string>;
}

export interface UseMarkdownEditorResult {
  wordCount: number;
  isUploading: boolean;
  textareaRef: RefObject<HTMLTextAreaElement | null>;
  applyAction: (action: MarkdownAction) => void;
  insertImageFiles: (files: readonly File[]) => void;
}

function escapeAltText(name: string): string {
  // newlines and brackets would break the ![alt](url) syntax this becomes alt text for
  return name.replace(/[\r\n]+/g, ' ').replace(/[\\[\]]/g, '\\$&');
}

function baseName(name: string): string {
  const withoutExtension = name.replace(/\.[^./\\]+$/, '') || name;
  return escapeAltText(withoutExtension);
}

function replaceFirst(
  haystack: string,
  needle: string,
  replacement: string,
): string {
  const index = haystack.indexOf(needle);
  if (index === -1) return haystack;
  return (
    haystack.slice(0, index) +
    replacement +
    haystack.slice(index + needle.length)
  );
}

export function useMarkdownEditor({
  value,
  setValue,
  onImageUpload,
}: UseMarkdownEditorOptions): UseMarkdownEditorResult {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const pendingSelection = useRef<[number, number] | null>(null);
  const uploadCounter = useRef(0);
  const [uploadingCount, setUploadingCount] = useState(0);

  useLayoutEffect(() => {
    const selection = pendingSelection.current;
    const textarea = textareaRef.current;
    if (selection && textarea) {
      textarea.focus();
      textarea.setSelectionRange(selection[0], selection[1]);
      pendingSelection.current = null;
    }
  }, [value]);

  const applyAction = (action: MarkdownAction) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const edit = applyMarkdownAction(action, {
      value: textarea.value,
      selectionStart: textarea.selectionStart,
      selectionEnd: textarea.selectionEnd,
    });
    pendingSelection.current = [edit.selectionStart, edit.selectionEnd];
    setValue(edit.value);
  };

  const insertImageFiles = (files: readonly File[]) => {
    if (files.length === 0) return;
    const uploads = files.map((file) => ({
      file,
      placeholder: `![Uploading ${escapeAltText(file.name)}…](#uploading-${++uploadCounter.current})`,
    }));
    const block = uploads.map((upload) => upload.placeholder).join('\n');
    const textarea = textareaRef.current;

    if (textarea) {
      const { selectionStart, selectionEnd } = textarea;
      const lead =
        selectionStart > 0 && textarea.value[selectionStart - 1] !== '\n'
          ? '\n'
          : '';
      const insert = `${lead}${block}\n`;
      const caret = selectionStart + insert.length;
      pendingSelection.current = [caret, caret];
      setValue(
        textarea.value.slice(0, selectionStart) +
          insert +
          textarea.value.slice(selectionEnd),
      );
    } else {
      setValue(
        (prev) =>
          `${prev}${prev && !prev.endsWith('\n') ? '\n' : ''}${block}\n`,
      );
    }

    if (!onImageUpload) return;

    uploads.forEach(({ file, placeholder }) => {
      setUploadingCount((count) => count + 1);
      Promise.resolve(onImageUpload(file))
        .then(
          (url) =>
            setValue((prev) =>
              replaceFirst(
                prev,
                placeholder,
                url ? `![${baseName(file.name)}](${url})` : '',
              ),
            ),
          () => setValue((prev) => replaceFirst(prev, placeholder, '')),
        )
        .finally(() => setUploadingCount((count) => count - 1));
    });
  };

  const trimmed = value.trim();
  const wordCount = trimmed === '' ? 0 : trimmed.split(/\s+/).length;

  return {
    wordCount,
    isUploading: uploadingCount > 0,
    textareaRef,
    applyAction,
    insertImageFiles,
  };
}
