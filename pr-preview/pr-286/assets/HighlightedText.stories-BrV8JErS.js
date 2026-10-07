import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as h}from"./iframe-BsOfj63y.js";import{H as c}from"./HighlightedText-DlzOHvAo.js";import{B as l}from"./Badge-BQdpqhof.js";import{T as g}from"./TimelineGroup-BqlqzsSm.js";import{T as m}from"./TimelineEvent-DKXnD9C6.js";import"./preload-helper-BXxMBR1D.js";import"./cn-2dOUpm6k.js";import"./Icon-DDE8Bo2Y.js";const p="needs",k={title:"Components/HighlightedText",component:c,tags:["autodocs"],parameters:{docs:{description:{component:"Marks every whitespace-separated term of `query` wherever it appears in `text`, ignoring case. Query characters match literally, so `c++` marks `C++` and `a.b` does not match `axb`. Takes `text` as a string and returns a fragment, so it drops inline into a sentence, a `Badge` or a row. The mark inherits font family, size and weight from its container, and sets its own background and text colour. Term splitting is shared with the activity filter; that filter matches across every field of a row at once while this component sees one string, so wrap every field you display."}}},argTypes:{text:{control:"text"},query:{control:"text"}},args:{text:"Jordan D. added label needs-qa",query:"jordan"},decorators:[r=>e.jsx("div",{style:{width:620,fontFamily:"var(--ds-font-family-sans)",fontSize:"var(--ds-text-timeline-event-font-size)",color:"var(--ds-color-text-secondary)"},children:e.jsx(r,{})})]},a={},s={args:{text:"Build #1847 passed on QA-01",query:"qa build"}},t={args:{text:"needs-qa",query:"needs"},parameters:{docs:{description:{story:"Matching is substring, not word-boundary, so only the matched run of a label is marked."}}}},n={args:{text:"use C++ or a.b here",query:"c++"},parameters:{docs:{description:{story:"`c++` marks `C++`; `a.b` does not match `axb`."}}}},o={args:{text:"Alex M. assigned this ticket",query:"jordan"}},d={render:r=>e.jsx(l,{variant:"progress",children:e.jsx(c,{...r})}),args:{text:"needs-qa",query:"needs"}};function x(){const[r,u]=h.useState(!0);return e.jsxs("ul",{style:{listStyle:"none",margin:0,padding:24,background:"var(--ds-color-surface-secondary)",display:"flex",flexDirection:"column",gap:"var(--ds-space-timeline-event-row-gap)"},children:[e.jsx(g,{count:2,summary:e.jsxs(e.Fragment,{children:[e.jsx("b",{children:"Jordan D."})," performed 2 updates"]}),meta:"· labels, sprint · 1d 2h ago",matchLabel:"1 of 2 match",open:r,onOpenChange:u,children:e.jsxs(m,{variant:"nested",icon:"tag",timestamp:"1d 2h ago",onPin:()=>{},children:["added label"," ",e.jsx(l,{variant:"progress",children:e.jsx(c,{text:"needs-qa",query:p})})]})}),e.jsxs(m,{icon:"science",timestamp:"40m ago",onPin:()=>{},children:[e.jsx("b",{children:"Mike R."})," asked"," ",e.jsx(c,{text:"What TTL are we defaulting to? QA needs a number.",query:p})]})]})}const i={render:()=>e.jsx(x,{}),parameters:{docs:{description:{story:'A search for "needs" across an expanded run and a standalone event, with the match count and a Pin on every hit.'}}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:"{}",...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    text: 'Build #1847 passed on QA-01',
    query: 'qa build'
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    text: 'needs-qa',
    query: 'needs'
  },
  parameters: {
    docs: {
      description: {
        story: 'Matching is substring, not word-boundary, so only the matched run of a label is marked.'
      }
    }
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    text: 'use C++ or a.b here',
    query: 'c++'
  },
  parameters: {
    docs: {
      description: {
        story: '\`c++\` marks \`C++\`; \`a.b\` does not match \`axb\`.'
      }
    }
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    text: 'Alex M. assigned this ticket',
    query: 'jordan'
  }
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: args => <Badge variant="progress">
      <HighlightedText {...args} />
    </Badge>,
  args: {
    text: 'needs-qa',
    query: 'needs'
  }
}`,...d.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <SearchResultsFeed />,
  parameters: {
    docs: {
      description: {
        story: 'A search for "needs" across an expanded run and a standalone event, with the match count and a Pin on every hit.'
      }
    }
  }
}`,...i.parameters?.docs?.source}}};const A=["Default","MultipleTerms","PartOfAWord","SpecialCharacters","NoMatch","InABadge","InSearchResults"];export{a as Default,d as InABadge,i as InSearchResults,s as MultipleTerms,o as NoMatch,t as PartOfAWord,n as SpecialCharacters,A as __namedExportsOrder,k as default};
