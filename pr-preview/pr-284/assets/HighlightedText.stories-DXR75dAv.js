import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as v}from"./iframe-BAQvXxpj.js";import{B as j}from"./Badge-BQf8SRq1.js";import{T as w}from"./TimelineGroup-CRE5i-7t.js";import{T as q}from"./TimelineEvent-OkGl5XIA.js";import"./preload-helper-BztvBPQH.js";import"./cn-2dOUpm6k.js";import"./Icon-QZed7Mvw.js";function k(r){return r.toLowerCase().split(/\s+/).filter(Boolean)}const T="_mark_178bz_1",S={mark:T};function A(r,i){const c=k(i);if(c.length===0)return[];const o=[],a=[];for(let s=0;s<r.length;s+=1)for(const t of r[s].toLowerCase())o.push(t),a.push(s);const n=o.join(""),d=[];for(const s of c){let t=n.indexOf(s);for(;t!==-1;)d.push({start:a[t],end:a[t+s.length-1]+1}),t=n.indexOf(s,t+s.length)}d.sort((s,t)=>s.start-t.start||s.end-t.end);const m=[];for(const s of d){const t=m[m.length-1];t!==void 0&&s.start<=t.end?t.end=Math.max(t.end,s.end):m.push({...s})}return m}function l({text:r,query:i=""}){const c=A(r,i);if(c.length===0)return e.jsx(e.Fragment,{children:r});const o=[];let a=0;return c.forEach((n,d)=>{n.start>a&&o.push(r.slice(a,n.start)),o.push(e.jsx("mark",{className:S.mark,children:r.slice(n.start,n.end)},d)),a=n.end}),a<r.length&&o.push(r.slice(a)),e.jsx(e.Fragment,{children:o})}l.__docgenInfo={description:"",methods:[],displayName:"HighlightedText",props:{text:{required:!0,tsType:{name:"string"},description:""},query:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"''",computed:!1}}}};const b="needs",D={title:"Components/HighlightedText",component:l,tags:["autodocs"],parameters:{docs:{description:{component:"Marks every whitespace-separated term of `query` wherever it appears in `text`, ignoring case. Query characters match literally, so `c++` marks `C++` and `a.b` does not match `axb`. Takes `text` as a string and returns a fragment, so it drops inline into a sentence, a `Badge` or a row. The mark inherits font family, size and weight from its container, and sets its own background and text colour. Term splitting is shared with the activity filter; that filter matches across every field of a row at once while this component sees one string, so wrap every field you display."}}},argTypes:{text:{control:"text"},query:{control:"text"}},args:{text:"Jordan D. added label needs-qa",query:"jordan"},decorators:[r=>e.jsx("div",{style:{width:620,fontFamily:"var(--ds-font-family-sans)",fontSize:"var(--ds-text-timeline-event-font-size)",color:"var(--ds-color-text-secondary)"},children:e.jsx(r,{})})]},p={},u={args:{text:"Build #1847 passed on QA-01",query:"qa build"}},h={args:{text:"needs-qa",query:"needs"},parameters:{docs:{description:{story:"Matching is substring, not word-boundary, so only the matched run of a label is marked."}}}},g={args:{text:"use C++ or a.b here",query:"c++"},parameters:{docs:{description:{story:"`c++` marks `C++`; `a.b` does not match `axb`."}}}},f={args:{text:"Alex M. assigned this ticket",query:"jordan"}},x={render:r=>e.jsx(j,{variant:"progress",children:e.jsx(l,{...r})}),args:{text:"needs-qa",query:"needs"}};function C(){const[r,i]=v.useState(!0);return e.jsxs("ul",{style:{listStyle:"none",margin:0,padding:24,background:"var(--ds-color-surface-secondary)",display:"flex",flexDirection:"column",gap:"var(--ds-space-timeline-event-row-gap)"},children:[e.jsx(w,{count:2,summary:e.jsxs(e.Fragment,{children:[e.jsx("b",{children:"Jordan D."})," performed 2 updates"]}),meta:"· labels, sprint · 1d 2h ago",matchLabel:"1 of 2 match",open:r,onOpenChange:i,children:e.jsxs(q,{variant:"nested",icon:"tag",timestamp:"1d 2h ago",onPin:()=>{},children:["added label"," ",e.jsx(j,{variant:"progress",children:e.jsx(l,{text:"needs-qa",query:b})})]})}),e.jsxs(q,{icon:"science",timestamp:"40m ago",onPin:()=>{},children:[e.jsx("b",{children:"Mike R."})," asked"," ",e.jsx(l,{text:"What TTL are we defaulting to? QA needs a number.",query:b})]})]})}const y={render:()=>e.jsx(C,{}),parameters:{docs:{description:{story:'A search for "needs" across an expanded run and a standalone event, with the match count and a Pin on every hit.'}}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:"{}",...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    text: 'Build #1847 passed on QA-01',
    query: 'qa build'
  }
}`,...u.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
}`,...h.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
}`,...g.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    text: 'Alex M. assigned this ticket',
    query: 'jordan'
  }
}`,...f.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: args => <Badge variant="progress">
      <HighlightedText {...args} />
    </Badge>,
  args: {
    text: 'needs-qa',
    query: 'needs'
  }
}`,...x.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <SearchResultsFeed />,
  parameters: {
    docs: {
      description: {
        story: 'A search for "needs" across an expanded run and a standalone event, with the match count and a Pin on every hit.'
      }
    }
  }
}`,...y.parameters?.docs?.source}}};const I=["Default","MultipleTerms","PartOfAWord","SpecialCharacters","NoMatch","InABadge","InSearchResults"];export{p as Default,x as InABadge,y as InSearchResults,u as MultipleTerms,f as NoMatch,h as PartOfAWord,g as SpecialCharacters,I as __namedExportsOrder,D as default};
