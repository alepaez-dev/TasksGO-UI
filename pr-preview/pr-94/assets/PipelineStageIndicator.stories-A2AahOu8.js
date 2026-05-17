import{j as a}from"./jsx-runtime-u17CrQMm.js";import{r as h}from"./iframe-wFk8X5sm.js";import{c as q}from"./cn-2dOUpm6k.js";import"./preload-helper-ByqWPYY-.js";const S="_group_8pans_1",A="_stage_8pans_7",y="_active_8pans_24",x="_disabled_8pans_31",_="_separator_8pans_35",s={group:S,stage:A,active:y,disabled:x,separator:_};function Q(e,t){if(e.length<=3)return e;const u=e[0],p=e[e.length-1],n=e.findIndex(v=>v.value===t),g=n>0&&n<e.length-1?n:Math.floor(e.length/2);return[u,e[g],p]}const b=h.forwardRef(({items:e,value:t,"aria-label":u,className:p,...n},g)=>{const v=Q(e,t);return a.jsx("div",{ref:g,role:"group","aria-label":u,className:q(s.group,p),...n,children:v.map((r,f)=>{const m=r.value===t;return a.jsxs(h.Fragment,{children:[f>0&&a.jsx("span",{className:s.separator,"aria-hidden":"true",children:"·····"}),a.jsx("span",{"aria-current":m?"step":void 0,"aria-disabled":r.disabled||void 0,className:q(s.stage,m&&s.active,r.disabled&&s.disabled),children:r.label})]},r.value)})})});b.displayName="PipelineStageIndicator";b.__docgenInfo={description:"",methods:[],displayName:"PipelineStageIndicator",props:{items:{required:!0,tsType:{name:"unknown"},description:""},value:{required:!0,tsType:{name:"string"},description:""},"aria-label":{required:!0,tsType:{name:"string"},description:""}},composes:["HTMLAttributes"]};const T={title:"Components/PipelineStageIndicator",component:b,tags:["autodocs"],parameters:{docs:{description:{component:'A read-only summary of pipeline stages with the active stage visually highlighted. The active value is decided by the consumer and announced via `aria-current="step"`. When more than three stages are provided, only the first, middle (closest to half of the length), and last are shown — pair with a popover or full list to expose the rest. When the active value would otherwise be hidden, it overrides the computed middle so it stays visible.'}}},decorators:[e=>a.jsx("div",{style:{padding:"24px"},children:a.jsx(e,{})})]},l={args:{items:[{value:"staging",label:"Staging"},{value:"prod",label:"Prod"}],value:"staging","aria-label":"Environment"}},o={args:{items:[{value:"qa1",label:"QA1"},{value:"qa2",label:"QA2"},{value:"prod",label:"Prod"}],value:"qa2","aria-label":"Environment"}},i={parameters:{docs:{description:{story:"With 4 stages, only first + middle (index 2, `Math.floor(4/2)`) + last are shown."}}},args:{items:[{value:"qa1",label:"QA1"},{value:"qa2",label:"QA2"},{value:"staging",label:"Staging"},{value:"prod",label:"Prod"}],value:"staging","aria-label":"Environment"}},d={parameters:{docs:{description:{story:"With 5 stages, only first + middle (index 2, `Math.floor(5/2)`) + last are shown."}}},args:{items:[{value:"qa1",label:"QA1"},{value:"qa2",label:"QA2"},{value:"qa3",label:"QA3"},{value:"staging",label:"Staging"},{value:"prod",label:"Prod"}],value:"qa3","aria-label":"Environment"}},c={args:{items:[{value:"qa1",label:"QA1"},{value:"qa2",label:"QA2",disabled:!0},{value:"prod",label:"Prod"}],value:"qa1","aria-label":"Environment"}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      value: 'staging',
      label: 'Staging'
    }, {
      value: 'prod',
      label: 'Prod'
    }],
    value: 'staging',
    'aria-label': 'Environment'
  }
}`,...l.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      value: 'qa1',
      label: 'QA1'
    }, {
      value: 'qa2',
      label: 'QA2'
    }, {
      value: 'prod',
      label: 'Prod'
    }],
    value: 'qa2',
    'aria-label': 'Environment'
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'With 4 stages, only first + middle (index 2, \`Math.floor(4/2)\`) + last are shown.'
      }
    }
  },
  args: {
    items: [{
      value: 'qa1',
      label: 'QA1'
    }, {
      value: 'qa2',
      label: 'QA2'
    }, {
      value: 'staging',
      label: 'Staging'
    }, {
      value: 'prod',
      label: 'Prod'
    }],
    value: 'staging',
    'aria-label': 'Environment'
  }
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  parameters: {
    docs: {
      description: {
        story: 'With 5 stages, only first + middle (index 2, \`Math.floor(5/2)\`) + last are shown.'
      }
    }
  },
  args: {
    items: [{
      value: 'qa1',
      label: 'QA1'
    }, {
      value: 'qa2',
      label: 'QA2'
    }, {
      value: 'qa3',
      label: 'QA3'
    }, {
      value: 'staging',
      label: 'Staging'
    }, {
      value: 'prod',
      label: 'Prod'
    }],
    value: 'qa3',
    'aria-label': 'Environment'
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    items: [{
      value: 'qa1',
      label: 'QA1'
    }, {
      value: 'qa2',
      label: 'QA2',
      disabled: true
    }, {
      value: 'prod',
      label: 'Prod'
    }],
    value: 'qa1',
    'aria-label': 'Environment'
  }
}`,...c.parameters?.docs?.source}}};const j=["TwoStages","ThreeStages","FourStagesAbbreviated","FiveStagesAbbreviated","WithDisabledStage"];export{d as FiveStagesAbbreviated,i as FourStagesAbbreviated,o as ThreeStages,l as TwoStages,c as WithDisabledStage,j as __namedExportsOrder,T as default};
