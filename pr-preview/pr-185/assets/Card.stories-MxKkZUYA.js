import{j as e}from"./jsx-runtime-u17CrQMm.js";import{C as a}from"./Card-CNwwDDtK.js";import"./iframe-C1HCbXXg.js";import"./preload-helper-BBAYyWMF.js";import"./cn-2dOUpm6k.js";const u={title:"Components/Card",component:a,tags:["autodocs"],parameters:{docs:{description:{component:'A boxed surface for grouping related content. Optional `header` slot renders a small caps label above the body. `variant="subtle"` switches the background from the default surface (white) to the secondary surface (light gray).'}}},argTypes:{variant:{control:"select",options:["default","subtle"]}},decorators:[t=>e.jsx("div",{style:{width:"320px",padding:"24px"},children:e.jsx(t,{})})]},r={render:()=>e.jsx(a,{children:e.jsx("p",{children:"A basic card with only body content and no header."})})},s={render:()=>e.jsx(a,{header:"Included",children:e.jsxs("ul",{children:[e.jsx("li",{children:"GET /v1/assets/*"}),e.jsx("li",{children:"GET /v1/metadata/*"}),e.jsx("li",{children:"Cache invalidation via SNS"})]})})},d={render:()=>e.jsx(a,{variant:"subtle",header:"Included",children:e.jsxs("ul",{children:[e.jsx("li",{children:"GET /v1/assets/*"}),e.jsx("li",{children:"GET /v1/metadata/*"}),e.jsx("li",{children:"Cache invalidation via SNS"})]})})},i={decorators:[t=>e.jsx("div",{style:{width:"640px",padding:"24px"},children:e.jsx(t,{})})],render:()=>e.jsxs("div",{style:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"var(--ds-space-scale-md)"},children:[e.jsx(a,{variant:"subtle",header:"Included",children:e.jsxs("ul",{children:[e.jsx("li",{children:"GET /v1/assets/*"}),e.jsx("li",{children:"GET /v1/metadata/*"}),e.jsx("li",{children:"Cache invalidation via SNS"})]})}),e.jsx(a,{header:"Excluded",children:e.jsxs("ul",{children:[e.jsx("li",{children:"WebSocket streams"}),e.jsx("li",{children:"POST/PUT operations"})]})})]})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <Card>
      <p>A basic card with only body content and no header.</p>
    </Card>
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <Card header="Included">
      <ul>
        <li>GET /v1/assets/*</li>
        <li>GET /v1/metadata/*</li>
        <li>Cache invalidation via SNS</li>
      </ul>
    </Card>
}`,...s.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <Card variant="subtle" header="Included">
      <ul>
        <li>GET /v1/assets/*</li>
        <li>GET /v1/metadata/*</li>
        <li>Cache invalidation via SNS</li>
      </ul>
    </Card>
}`,...d.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};const h=["Default","WithHeader","Subtle","TwoColumn"];export{r as Default,d as Subtle,i as TwoColumn,s as WithHeader,h as __namedExportsOrder,u as default};
