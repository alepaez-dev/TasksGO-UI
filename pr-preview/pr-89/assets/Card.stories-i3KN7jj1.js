import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as h}from"./iframe-DXVhVnM8.js";import{c as m}from"./cn-2dOUpm6k.js";import"./preload-helper-wuZ2h0jk.js";const v="_card_b2g1x_1",x="_subtle_b2g1x_15",j="_header_b2g1x_19",i={card:v,subtle:x,header:j},a=h.forwardRef(({header:r,variant:n="default",children:o,className:c,...u},p)=>e.jsxs("div",{ref:p,className:m(i.card,i[n],c),...u,children:[r&&e.jsx("div",{className:i.header,children:r}),o]}));a.displayName="Card";a.__docgenInfo={description:"",methods:[],displayName:"Card",props:{header:{required:!1,tsType:{name:"ReactNode"},description:""},variant:{required:!1,tsType:{name:"union",raw:"'default' | 'subtle'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'subtle'"}]},description:"",defaultValue:{value:"'default'",computed:!1}}},composes:["HTMLAttributes"]};const S={title:"Components/Card",component:a,tags:["autodocs"],parameters:{docs:{description:{component:'A boxed surface for grouping related content. Optional `header` slot renders a small caps label above the body. `variant="subtle"` switches the background from the default surface (white) to the secondary surface (light gray).'}}},argTypes:{variant:{control:"select",options:["default","subtle"]}},decorators:[r=>e.jsx("div",{style:{width:"320px",padding:"24px"},children:e.jsx(r,{})})]},s={render:()=>e.jsx(a,{children:e.jsx("p",{children:"A basic card with only body content and no header."})})},d={render:()=>e.jsx(a,{header:"Included",children:e.jsxs("ul",{children:[e.jsx("li",{children:"GET /v1/assets/*"}),e.jsx("li",{children:"GET /v1/metadata/*"}),e.jsx("li",{children:"Cache invalidation via SNS"})]})})},t={render:()=>e.jsx(a,{variant:"subtle",header:"Included",children:e.jsxs("ul",{children:[e.jsx("li",{children:"GET /v1/assets/*"}),e.jsx("li",{children:"GET /v1/metadata/*"}),e.jsx("li",{children:"Cache invalidation via SNS"})]})})},l={decorators:[r=>e.jsx("div",{style:{width:"640px",padding:"24px"},children:e.jsx(r,{})})],render:()=>e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--ds-space-scale-md)"},children:[e.jsx(a,{variant:"subtle",header:"Included",children:e.jsxs("ul",{children:[e.jsx("li",{children:"GET /v1/assets/*"}),e.jsx("li",{children:"GET /v1/metadata/*"}),e.jsx("li",{children:"Cache invalidation via SNS"})]})}),e.jsx(a,{header:"Excluded",children:e.jsxs("ul",{children:[e.jsx("li",{children:"WebSocket streams"}),e.jsx("li",{children:"POST/PUT operations"})]})})]})};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}};const T=["Default","WithHeader","Subtle","TwoColumn"];export{s as Default,t as Subtle,l as TwoColumn,d as WithHeader,T as __namedExportsOrder,S as default};
