import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as h}from"./iframe-DVKHzp_v.js";import{c as m}from"./cn-2dOUpm6k.js";import"./preload-helper-CyvMmb0J.js";const v="_card_140fi_1",x="_subtle_140fi_19",f="_header_140fi_23",l={card:v,default:"_default_140fi_15",subtle:x,header:f},a=h.forwardRef(({header:r,variant:n="default",children:o,className:c,...u},p)=>e.jsxs("div",{ref:p,className:m(l.card,l[n],c),...u,children:[r&&e.jsx("div",{className:l.header,children:r}),o]}));a.displayName="Card";a.__docgenInfo={description:"",methods:[],displayName:"Card",props:{header:{required:!1,tsType:{name:"ReactNode"},description:""},variant:{required:!1,tsType:{name:"union",raw:"'default' | 'subtle'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'subtle'"}]},description:"",defaultValue:{value:"'default'",computed:!1}}},composes:["HTMLAttributes"]};const T={title:"Components/Card",component:a,tags:["autodocs"],parameters:{docs:{description:{component:'A boxed surface for grouping related content. Optional `header` slot renders a small caps label above the body. `variant="subtle"` switches the background from the default surface (white) to the secondary surface (light gray).'}}},argTypes:{variant:{control:"select",options:["default","subtle"]}},decorators:[r=>e.jsx("div",{style:{width:"320px",padding:"24px"},children:e.jsx(r,{})})]},s={render:()=>e.jsx(a,{children:e.jsx("p",{children:"A basic card with only body content and no header."})})},d={render:()=>e.jsx(a,{header:"Included",children:e.jsxs("ul",{children:[e.jsx("li",{children:"GET /v1/assets/*"}),e.jsx("li",{children:"GET /v1/metadata/*"}),e.jsx("li",{children:"Cache invalidation via SNS"})]})})},t={render:()=>e.jsx(a,{variant:"subtle",header:"Included",children:e.jsxs("ul",{children:[e.jsx("li",{children:"GET /v1/assets/*"}),e.jsx("li",{children:"GET /v1/metadata/*"}),e.jsx("li",{children:"Cache invalidation via SNS"})]})})},i={decorators:[r=>e.jsx("div",{style:{width:"640px",padding:"24px"},children:e.jsx(r,{})})],render:()=>e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--ds-space-scale-md)"},children:[e.jsx(a,{variant:"subtle",header:"Included",children:e.jsxs("ul",{children:[e.jsx("li",{children:"GET /v1/assets/*"}),e.jsx("li",{children:"GET /v1/metadata/*"}),e.jsx("li",{children:"Cache invalidation via SNS"})]})}),e.jsx(a,{header:"Excluded",children:e.jsxs("ul",{children:[e.jsx("li",{children:"WebSocket streams"}),e.jsx("li",{children:"POST/PUT operations"})]})})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <Card>
      <p>A basic card with only body content and no header.</p>
    </Card>
}`,...s.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Card header="Included">
      <ul>
        <li>GET /v1/assets/*</li>
        <li>GET /v1/metadata/*</li>
        <li>Cache invalidation via SNS</li>
      </ul>
    </Card>
}`,...d.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <Card variant="subtle" header="Included">
      <ul>
        <li>GET /v1/assets/*</li>
        <li>GET /v1/metadata/*</li>
        <li>Cache invalidation via SNS</li>
      </ul>
    </Card>
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  decorators: [Story => <div style={{
    width: '640px',
    padding: '24px'
  }}>
        <Story />
      </div>],
  render: () => <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--ds-space-scale-md)'
  }}>
      <Card variant="subtle" header="Included">
        <ul>
          <li>GET /v1/assets/*</li>
          <li>GET /v1/metadata/*</li>
          <li>Cache invalidation via SNS</li>
        </ul>
      </Card>
      <Card header="Excluded">
        <ul>
          <li>WebSocket streams</li>
          <li>POST/PUT operations</li>
        </ul>
      </Card>
    </div>
}`,...i.parameters?.docs?.source}}};const y=["Default","WithHeader","Subtle","TwoColumn"];export{s as Default,t as Subtle,i as TwoColumn,d as WithHeader,y as __namedExportsOrder,T as default};
