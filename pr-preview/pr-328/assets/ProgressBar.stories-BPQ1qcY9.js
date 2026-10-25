import{j as r}from"./jsx-runtime-u17CrQMm.js";import{r as b}from"./iframe-BtXUanSo.js";import{c as j}from"./cn-2dOUpm6k.js";import"./preload-helper-DZD23-jt.js";const w="_track_p4cry_1",S="_fill_p4cry_9",B="_sm_p4cry_16",N="_md_p4cry_21",P="_neutral_p4cry_26",h="_success_p4cry_30",z="_warning_p4cry_34",T="_critical_p4cry_38",l={track:w,fill:S,sm:B,md:N,neutral:P,success:h,warning:z,critical:T},s=b.forwardRef(({value:e,max:i,size:p="sm",tone:u="neutral",className:d,style:g,...f},x)=>{const a=Number.isFinite(i)?Math.max(i,0):0,y=Number.isFinite(e)?e:0,m=Math.min(Math.max(y,0),a),_=a>0?Math.round(m/a*100):0,v={...g,"--ds-progress-bar-fill":`${_}%`};return r.jsx("span",{ref:x,role:"progressbar","aria-valuemin":0,"aria-valuemax":a,"aria-valuenow":m,className:j(l.track,l[p],l[u],d),style:v,...f,children:r.jsx("span",{className:l.fill})})});s.displayName="ProgressBar";s.__docgenInfo={description:"",methods:[],displayName:"ProgressBar",props:{value:{required:!0,tsType:{name:"number"},description:""},max:{required:!0,tsType:{name:"number"},description:""},"aria-label":{required:!0,tsType:{name:"string"},description:""},size:{required:!1,tsType:{name:"union",raw:"'sm' | 'md'",elements:[{name:"literal",value:"'sm'"},{name:"literal",value:"'md'"}]},description:"",defaultValue:{value:"'sm'",computed:!1}},tone:{required:!1,tsType:{name:"union",raw:"'neutral' | 'success' | 'warning' | 'critical'",elements:[{name:"literal",value:"'neutral'"},{name:"literal",value:"'success'"},{name:"literal",value:"'warning'"},{name:"literal",value:"'critical'"}]},description:"",defaultValue:{value:"'neutral'",computed:!1}}},composes:["Omit"]};const k={title:"Components/ProgressBar",component:s,tags:["autodocs"],argTypes:{value:{control:"number"},max:{control:"number"},size:{control:"select",options:["sm","md"]},tone:{control:"select",options:["neutral","success","warning","critical"]}},args:{value:3,max:5,"aria-label":"3 of 5 scenarios passing"}},t={},o={render:e=>r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--ds-space-scale-sm)"},children:[r.jsx(s,{...e,tone:"neutral","aria-label":"Neutral progress"}),r.jsx(s,{...e,tone:"success","aria-label":"Success progress"}),r.jsx(s,{...e,tone:"warning","aria-label":"Warning progress"}),r.jsx(s,{...e,tone:"critical","aria-label":"Critical progress"})]})},n={render:e=>r.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"var(--ds-space-scale-sm)"},children:[r.jsx(s,{...e,size:"sm","aria-label":"Small progress"}),r.jsx(s,{...e,size:"md","aria-label":"Medium progress"})]})},c={args:{value:0,max:0,"aria-label":"No scenarios yet"}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:"{}",...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--ds-space-scale-sm)'
  }}>
      <ProgressBar {...args} tone="neutral" aria-label="Neutral progress" />
      <ProgressBar {...args} tone="success" aria-label="Success progress" />
      <ProgressBar {...args} tone="warning" aria-label="Warning progress" />
      <ProgressBar {...args} tone="critical" aria-label="Critical progress" />
    </div>
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: args => <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--ds-space-scale-sm)'
  }}>
      <ProgressBar {...args} size="sm" aria-label="Small progress" />
      <ProgressBar {...args} size="md" aria-label="Medium progress" />
    </div>
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    value: 0,
    max: 0,
    'aria-label': 'No scenarios yet'
  }
}`,...c.parameters?.docs?.source}}};const V=["Default","Tones","Sizes","Empty"];export{t as Default,c as Empty,n as Sizes,o as Tones,V as __namedExportsOrder,k as default};
