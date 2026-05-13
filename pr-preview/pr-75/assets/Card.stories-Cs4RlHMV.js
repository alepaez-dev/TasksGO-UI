import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as m}from"./iframe-CAYDjyMx.js";import{c as h}from"./cn-2dOUpm6k.js";import"./preload-helper-CcCa7K8n.js";const v="_card_1m21e_1",x="_subtle_1m21e_16",j="_header_1m21e_20",i={card:v,subtle:x,header:j},a=m.forwardRef(({header:r,variant:n="default",children:o,className:c,...u},p)=>e.jsxs("div",{ref:p,className:h(i.card,i[n],c),...u,children:[r!==void 0&&e.jsx("div",{className:i.header,children:r}),o]}));a.displayName="Card";a.__docgenInfo={description:"",methods:[],displayName:"Card",props:{header:{required:!1,tsType:{name:"ReactNode"},description:""},variant:{required:!1,tsType:{name:"union",raw:"'default' | 'subtle'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'subtle'"}]},description:"",defaultValue:{value:"'default'",computed:!1}}},composes:["HTMLAttributes"]};const T={title:"Components/Card",component:a,tags:["autodocs"],parameters:{docs:{description:{component:'A boxed surface for grouping related content. Optional `header` slot renders a small caps label above the body. `variant="subtle"` switches the background from the default surface (white) to the secondary surface (light gray).'}}},argTypes:{variant:{control:"select",options:["default","subtle"]}},decorators:[r=>e.jsx("div",{style:{width:"320px",padding:"24px"},children:e.jsx(r,{})})]},s={render:()=>e.jsx(a,{children:e.jsx("p",{children:"A basic card with only body content and no header."})})},d={render:()=>e.jsx(a,{header:"Included",children:e.jsxs("ul",{children:[e.jsx("li",{children:"GET /v1/assets/*"}),e.jsx("li",{children:"GET /v1/metadata/*"}),e.jsx("li",{children:"Cache invalidation via SNS"})]})})},t={render:()=>e.jsx(a,{variant:"subtle",header:"Included",children:e.jsxs("ul",{children:[e.jsx("li",{children:"GET /v1/assets/*"}),e.jsx("li",{children:"GET /v1/metadata/*"}),e.jsx("li",{children:"Cache invalidation via SNS"})]})})},l={decorators:[r=>e.jsx("div",{style:{width:"640px",padding:"24px"},children:e.jsx(r,{})})],render:()=>e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--ds-space-scale-md)"},children:[e.jsx(a,{variant:"subtle",header:"Included",children:e.jsxs("ul",{children:[e.jsx("li",{children:"GET /v1/assets/*"}),e.jsx("li",{children:"GET /v1/metadata/*"}),e.jsx("li",{children:"Cache invalidation via SNS"})]})}),e.jsx(a,{header:"Excluded",children:e.jsxs("ul",{children:[e.jsx("li",{children:"WebSocket streams"}),e.jsx("li",{children:"POST/PUT operations"})]})})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}};const y=["Default","WithHeader","Subtle","TwoColumn"];export{s as Default,t as Subtle,l as TwoColumn,d as WithHeader,y as __namedExportsOrder,T as default};
