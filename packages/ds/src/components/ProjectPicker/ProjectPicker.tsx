import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { Avatar } from '../Avatar';
import { Icon } from '../Icon';
import { SearchInput } from '../SearchInput';
import { SectionHeader } from '../SectionHeader';
import { cn } from '../../utils/cn';
import styles from './ProjectPicker.module.css';

export interface ProjectPickerProject {
  value: string;
  label: string;
  initial: string;
  avatarColor?: string;
}

export interface ProjectPickerProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onSelect'
> {
  projects: readonly ProjectPickerProject[];
  value: string;
  onSelect: (value: string) => void;
  onBack: () => void;
  query: string;
  onQueryChange: (query: string) => void;
}

export const ProjectPicker = forwardRef<HTMLDivElement, ProjectPickerProps>(
  (
    {
      projects,
      value,
      onSelect,
      onBack,
      query,
      onQueryChange,
      className,
      ...rest
    },
    ref,
  ) => {
    const q = query.toLowerCase();
    const filtered = q
      ? projects.filter((p) => p.label.toLowerCase().includes(q))
      : projects;

    return (
      <div ref={ref} className={cn(styles.picker, className)} {...rest}>
        <div className={styles.top}>
          <div className={styles.header}>
            <button
              type="button"
              className={styles.backButton}
              onClick={onBack}
              aria-label="Back to menu"
            >
              <Icon name="chevron_left" size="sm" />
            </button>
            <SectionHeader headingLevel={3}>Switch Project</SectionHeader>
          </div>

          <div className={styles.search}>
            <SearchInput
              placeholder="Find project..."
              size="sm"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onClear={query ? () => onQueryChange('') : undefined}
              // 16px prevents iOS from zooming on focus
              style={{ fontSize: 16 }}
            />
          </div>
        </div>

        <ul className={styles.list} role="listbox" aria-label="Projects">
          {filtered.map((project) => {
            const selected = project.value === value;
            const avatarStyle: CSSProperties | undefined = project.avatarColor
              ? { backgroundColor: project.avatarColor }
              : undefined;

            return (
              <li
                key={project.value}
                role="option"
                aria-selected={selected}
                className={cn(styles.option, selected && styles.selected)}
                onClick={() => onSelect(project.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(project.value);
                  }
                }}
                tabIndex={0}
              >
                <Avatar
                  initial={project.initial}
                  variant="project"
                  aria-label={project.label}
                  style={avatarStyle}
                />
                <span className={styles.label}>{project.label}</span>
                {selected && (
                  <Icon
                    name="check_circle"
                    size="sm"
                    className={styles.check}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    );
  },
);

ProjectPicker.displayName = 'ProjectPicker';
