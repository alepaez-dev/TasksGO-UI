import{j as e}from"./jsx-runtime-u17CrQMm.js";import{m as V,r as S}from"./iframe-DBQXWgoM.js";import{M as h,u as j}from"./useMarkdownEditor-CY_AQDyu.js";import{M as L}from"./Markdown-WKevANo0.js";import"./preload-helper-C_1rgeVj.js";import"./cn-2dOUpm6k.js";import"./MarkdownToolbar-C7ehb6EU.js";import"./rovingIndex-BLt4otwy.js";import"./IconButton-BTccACLq.js";import"./Icon-GXhgzA4p.js";import"./sanitizeHref-a0N9eHv-.js";import"./Card-C4Z9olew.js";const P="_single_1r25c_1",M="_frame_1r25c_5",U="_split_1r25c_12",I="_previewPane_1r25c_20",T="_previewLabel_1r25c_27",r={single:P,frame:M,split:U,previewPane:I,previewLabel:T},u="https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Star_Wars_-_Darth_Vader.jpg/500px-Star_Wars_-_Darth_Vader.jpg",l=["## Description","","Introduce a caching layer at the edge for read-heavy routes, staged behind `edge_cache_v1`.","","## Why","","- Lower TTFB in AP-South-1","- Reduce database CPU during sync windows","","```scope","included:","- GET /v1/assets/*","- GET /v1/metadata/*","excluded:","- WebSocket streams","```","","## Reference","",`![Lord Vader](${u})`].join(`
`),t=({initialValue:w="",uploadsVader:g=!1,status:v,withPreview:f=!1})=>{const[d,p]=S.useState(w),c=g?()=>new Promise(E=>setTimeout(()=>E(u),700)):void 0,{wordCount:k,isUploading:y,textareaRef:_,applyAction:x,insertImageFiles:b}=j({value:d,setValue:p,onImageUpload:c}),m=e.jsx("div",{className:r.frame,children:e.jsx(h,{value:d,onChange:p,textareaRef:_,onAction:x,wordCount:k,status:v,isUploading:y,onInsertImageFiles:c?b:void 0})});return f?e.jsxs("div",{className:r.split,children:[m,e.jsxs("div",{className:r.previewPane,children:[e.jsx("div",{className:r.previewLabel,children:"Preview"}),e.jsx(L,{source:d})]})]}):e.jsx("div",{className:r.single,children:m})},q={title:"Components/MarkdownEditor",component:h,parameters:{layout:"padded",docs:{description:{component:'Freeform markdown editor surface: a formatting toolbar with a live word count and an auto-growing textarea. Chromeless by design — the consumer frames it (here, a bordered card). An optional `header` slot renders above the toolbar and stays pinned with it (sticky) while the editor is focused. Stateless and fully controlled via the `useMarkdownEditor` hook. It edits raw markdown only — the rendered "preview" is the separate `<Markdown>` component (see the **With Live Preview** story). Images are inserted via the toolbar (file picker), drag-drop, or paste; the consumer supplies `onImageUpload` to turn a file into a hosted URL (the Storybook mock resolves to a fixed image).'}}}},a={render:()=>e.jsx(t,{initialValue:l})},o={render:()=>e.jsx(t,{})},s={render:()=>e.jsx(t,{uploadsVader:!0,status:"saved"}),parameters:{docs:{description:{story:'Click the image button (or drag-drop / paste a file): the editor inserts an "Uploading…" placeholder, calls the consumer `onImageUpload`, and swaps in the returned URL. This mock always resolves to Lord Vader. The textarea shows the raw `![alt](url)` markdown — to see it rendered as an image, see **With Live Preview**.'}}}},n={render:()=>e.jsx(t,{initialValue:l,uploadsVader:!0,withPreview:!0}),parameters:{docs:{description:{story:"The two markdown components composed the way a consumer pairs them: `MarkdownEditor` edits the raw string on the left, `<Markdown>` renders the same string on the right. Edit the text or insert an image and the preview updates live — markdown images render as real images (the sample includes one)."}}}},i={render:()=>e.jsx(t,{initialValue:l,uploadsVader:!0}),parameters:{viewport:{options:V},docs:{description:{story:"On a narrow screen the formatting toolbar scrolls horizontally (swipe) instead of wrapping or clipping, the word count stays pinned to the right, and the markdown source flows full-width."}}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <StatefulEditor initialValue={sampleDoc} />
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <StatefulEditor />
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <StatefulEditor uploadsVader status="saved" />,
  parameters: {
    docs: {
      description: {
        story: 'Click the image button (or drag-drop / paste a file): the editor inserts an "Uploading…" placeholder, calls the consumer \`onImageUpload\`, and swaps in the returned URL. This mock always resolves to Lord Vader. The textarea shows the raw \`![alt](url)\` markdown — to see it rendered as an image, see **With Live Preview**.'
      }
    }
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <StatefulEditor initialValue={sampleDoc} uploadsVader withPreview />,
  parameters: {
    docs: {
      description: {
        story: 'The two markdown components composed the way a consumer pairs them: \`MarkdownEditor\` edits the raw string on the left, \`<Markdown>\` renders the same string on the right. Edit the text or insert an image and the preview updates live — markdown images render as real images (the sample includes one).'
      }
    }
  }
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <StatefulEditor initialValue={sampleDoc} uploadsVader />,
  parameters: {
    viewport: {
      options: mobileViewportOptions
    },
    docs: {
      description: {
        story: 'On a narrow screen the formatting toolbar scrolls horizontally (swipe) instead of wrapping or clipping, the word count stays pinned to the right, and the markdown source flows full-width.'
      }
    }
  }
}`,...i.parameters?.docs?.source}}};const H=["Default","Empty","WithImageUpload","WithLivePreview","Mobile"];export{a as Default,o as Empty,i as Mobile,s as WithImageUpload,n as WithLivePreview,H as __namedExportsOrder,q as default};
