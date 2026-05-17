import{j as e}from"./jsx-runtime-u17CrQMm.js";import{r as v}from"./iframe-DZhgU6rE.js";import{c as g}from"./cn-2dOUpm6k.js";import{I as r}from"./Icon-J8EZSlhq.js";import"./preload-helper-cRWhBNr-.js";const x="_row_1eq4a_1",C="_clickable_1eq4a_11",I="_statusBadge_1eq4a_26",j="_passed_1eq4a_48",T="_failed_1eq4a_52",E="_pending_1eq4a_56",A="_label_1eq4a_60",D="_meta_1eq4a_65",S="_actionIcon_1eq4a_75",q="_srOnly_1eq4a_89",a={row:x,clickable:C,statusBadge:I,passed:j,failed:T,pending:E,label:A,meta:D,actionIcon:S,srOnly:q},F={passed:"Passed",failed:"Failed",pending:"Pending"},t=v.forwardRef(({status:s,label:h,meta:u,onClick:b,onKeyDown:f,className:_,...k},y)=>{const i=b!=null,w=n=>{f?.(n),!n.defaultPrevented&&i&&(n.key==="Enter"||n.key===" ")&&(n.preventDefault(),n.currentTarget.click())};return e.jsxs("div",{ref:y,...k,className:g(a.row,i&&a.clickable,_),onClick:b,onKeyDown:w,role:i?"button":void 0,tabIndex:i?0:void 0,children:[e.jsxs("span",{className:g(a.statusBadge,a[s]),"aria-hidden":"true",children:[s==="passed"&&e.jsx(r,{name:"check",size:"xs"}),s==="failed"&&e.jsx(r,{name:"close",size:"xs"}),s==="pending"&&e.jsx(r,{name:"more_horiz",size:"xs"})]}),e.jsxs("span",{className:a.srOnly,children:[F[s],":"]}),e.jsx("span",{className:a.label,children:h}),u!=null&&e.jsx("span",{className:a.meta,children:u}),i&&e.jsx(r,{name:"open_in_new",size:"sm",className:a.actionIcon})]})});t.displayName="ChecklistRow";t.__docgenInfo={description:"",methods:[],displayName:"ChecklistRow",props:{status:{required:!0,tsType:{name:"union",raw:"'passed' | 'failed' | 'pending'",elements:[{name:"literal",value:"'passed'"},{name:"literal",value:"'failed'"},{name:"literal",value:"'pending'"}]},description:""},label:{required:!0,tsType:{name:"string"},description:""},meta:{required:!1,tsType:{name:"ReactNode"},description:""}},composes:["HTMLAttributes"]};const P={title:"Components/ChecklistRow",component:t,tags:["autodocs"],parameters:{docs:{description:{component:"A single line in a verification or scenario checklist: a status indicator, a label, and an optional meta slot for trailing text such as a verifier name or a failure tag."}}},argTypes:{status:{control:"select",options:["passed","failed","pending"]}},decorators:[s=>e.jsx("div",{style:{width:"480px",padding:"24px"},children:e.jsx(s,{})})]},o={args:{status:"passed",label:"Cache hit ratio check on US-East-1 staging",meta:"Verified by JD"}},l={args:{status:"failed",label:"Invalidation latency under 200ms",meta:"FAILED"}},c={args:{status:"pending",label:"Browser-side TTL override persistence",meta:"Not verified"}},d={args:{status:"passed",label:"WAF integration compatibility"}},p={args:{status:"failed",label:"Invalidation latency under 200ms",meta:"FAILED",onClick:()=>{window.open("https://example.com/failures/invalidation-latency","_blank")}},parameters:{docs:{description:{story:'When `onClick` is provided, the row becomes a keyboard-operable button (`role="button"`, Tab-focusable, Enter/Space activates). The trailing `open_in_new` icon appears on hover or focus to indicate that activating the row opens its details in a new tab.'}}}},m={render:()=>e.jsxs("div",{children:[e.jsx(t,{status:"passed",label:"Cache hit ratio check on US-East-1 staging",meta:"Verified by JD",onClick:()=>{}}),e.jsx(t,{status:"failed",label:"Invalidation latency under 200ms",meta:"FAILED",onClick:()=>{}}),e.jsx(t,{status:"pending",label:"Browser-side TTL override persistence",meta:"Not verified",onClick:()=>{}}),e.jsx(t,{status:"passed",label:"WAF integration compatibility",meta:"Verified by JD",onClick:()=>{}})]})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'passed',
    label: 'Cache hit ratio check on US-East-1 staging',
    meta: 'Verified by JD'
  }
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'failed',
    label: 'Invalidation latency under 200ms',
    meta: 'FAILED'
  }
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'pending',
    label: 'Browser-side TTL override persistence',
    meta: 'Not verified'
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'passed',
    label: 'WAF integration compatibility'
  }
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    status: 'failed',
    label: 'Invalidation latency under 200ms',
    meta: 'FAILED',
    onClick: () => {
      window.open('https://example.com/failures/invalidation-latency', '_blank');
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'When \`onClick\` is provided, the row becomes a keyboard-operable button (\`role="button"\`, Tab-focusable, Enter/Space activates). The trailing \`open_in_new\` icon appears on hover or focus to indicate that activating the row opens its details in a new tab.'
      }
    }
  }
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div>
      <ChecklistRow status="passed" label="Cache hit ratio check on US-East-1 staging" meta="Verified by JD" onClick={() => {}} />
      <ChecklistRow status="failed" label="Invalidation latency under 200ms" meta="FAILED" onClick={() => {}} />
      <ChecklistRow status="pending" label="Browser-side TTL override persistence" meta="Not verified" onClick={() => {}} />
      <ChecklistRow status="passed" label="WAF integration compatibility" meta="Verified by JD" onClick={() => {}} />
    </div>
}`,...m.parameters?.docs?.source}}};const J=["Passed","Failed","Pending","WithoutMeta","Clickable","AllStatuses"];export{m as AllStatuses,p as Clickable,l as Failed,o as Passed,c as Pending,d as WithoutMeta,J as __namedExportsOrder,P as default};
