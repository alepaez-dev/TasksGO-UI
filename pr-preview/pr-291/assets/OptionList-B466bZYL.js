import{j as t}from"./jsx-runtime-u17CrQMm.js";import{r as v}from"./iframe-CVzZUVgi.js";import{c as p}from"./cn-2dOUpm6k.js";import{I as d}from"./Icon-DkRXASfo.js";const w="_list_198o2_1",j="_header_198o2_6",R="_options_198o2_15",O="_emptyState_198o2_27",C="_option_198o2_15",D="_optionSelected_198o2_52",T="_dot_198o2_56",S="_dotActive_198o2_63",L="_dotInactive_198o2_67",W="_optionIcon_198o2_72",E="_optionPrefix_198o2_77",P="_optionText_198o2_89",A="_optionWithDescription_198o2_96",M="_optionIndicator_198o2_100",$="_optionDescription_198o2_110",z="_optionLabel_198o2_117",B="_optionMeta_198o2_133",H="_checkIcon_198o2_141",K="_actionWrapper_198o2_146",U="_action_198o2_146",e={list:w,header:j,options:R,emptyState:O,option:C,optionSelected:D,dot:T,dotActive:S,dotInactive:L,optionIcon:W,optionPrefix:E,optionText:P,optionWithDescription:A,optionIndicator:M,optionDescription:$,optionLabel:z,optionMeta:B,checkIcon:H,actionWrapper:K,action:U};function F(i,a){if(i.icon)return t.jsx(d,{name:i.icon,size:"sm",className:e.optionIcon,style:i.iconColor?{"--selector-icon-color":i.iconColor}:void 0});if(i.prefix)return t.jsx("span",{className:e.optionPrefix,children:i.prefix});const o=i.value===a;return t.jsx("span",{className:p(e.dot,o?e.dotActive:e.dotInactive)})}function g(i,a){if(!(i instanceof HTMLElement))return;const o=a==="next"?i.nextElementSibling:i.previousElementSibling;o instanceof HTMLElement&&o.focus()}const y=v.forwardRef(({options:i,value:a,onSelect:o,header:u,emptyState:m,action:s,listboxId:f,renderOptionIndicator:_,className:x,"aria-label":b,...k},N)=>{const q=_??(n=>F(n,a)),I=v.useId(),h=n=>r=>{switch(r.key){case"Enter":case" ":r.preventDefault(),o(n);break;case"ArrowDown":r.preventDefault(),g(r.target,"next");break;case"ArrowUp":r.preventDefault(),g(r.target,"prev");break}};return t.jsxs("div",{ref:N,className:p(e.list,x),...k,children:[u&&t.jsx("div",{className:e.header,children:u}),i.length===0&&m&&t.jsx("div",{className:e.emptyState,children:m}),t.jsx("div",{id:f,role:"listbox",className:e.options,"aria-label":b,children:i.map((n,r)=>{const c=n.value===a,l=n.description?`${I}-${r}-desc`:void 0;return t.jsxs("div",{role:"option",tabIndex:0,"aria-selected":c,"aria-label":n.prefix==null?n.label:`${n.prefix} ${n.label}`,"aria-describedby":l,className:p(e.option,c&&e.optionSelected,l!=null&&e.optionWithDescription),onClick:()=>o(n.value),onKeyDown:h(n.value),children:[t.jsx("span",{className:e.optionIndicator,children:q(n)}),t.jsxs("span",{className:e.optionText,children:[t.jsx("span",{className:e.optionLabel,children:n.label}),l!=null&&t.jsx("span",{id:l,className:e.optionDescription,children:n.description})]}),n.meta!=null&&!c&&t.jsx("span",{className:e.optionMeta,children:n.meta}),c&&t.jsx(d,{name:"check_circle",size:"sm",className:e.checkIcon})]},n.value)})}),s&&t.jsx("div",{className:e.actionWrapper,children:t.jsxs("button",{type:"button",className:e.action,onClick:s.onClick,children:[t.jsx(d,{name:s.icon,size:"sm"}),t.jsx("span",{children:s.label})]})})]})});y.displayName="OptionList";y.__docgenInfo={description:"",methods:[],displayName:"OptionList",props:{options:{required:!0,tsType:{name:"union",raw:`| readonly DotOption[]
| readonly IconOption[]
| readonly PrefixOption[]`,elements:[{name:"unknown"},{name:"unknown"},{name:"unknown"}]},description:""},value:{required:!1,tsType:{name:"string"},description:""},onSelect:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""},header:{required:!1,tsType:{name:"ReactNode"},description:""},emptyState:{required:!1,tsType:{name:"ReactNode"},description:""},action:{required:!1,tsType:{name:"Readonly",elements:[{name:"signature",type:"object",raw:`{
  label: string;
  icon: IconName;
  onClick: () => void;
}`,signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"icon",value:{name:"unknown",required:!0}},{key:"onClick",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!0}}]}}],raw:`Readonly<{
  label: string;
  icon: IconName;
  onClick: () => void;
}>`},description:""},listboxId:{required:!1,tsType:{name:"string"},description:""},renderOptionIndicator:{required:!1,tsType:{name:"signature",type:"function",raw:"(option: OptionListOption) => ReactNode",signature:{arguments:[{type:{name:"union",raw:"DotOption | IconOption | PrefixOption",elements:[{name:"intersection",raw:`OptionBase & {
  icon?: never;
  iconColor?: never;
  prefix?: never;
}`,elements:[{name:"Readonly",elements:[{name:"signature",type:"object",raw:`{
  value: string;
  label: string;
  description?: string;
  meta?: ReactNode;
}`,signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}},{key:"description",value:{name:"string",required:!1}},{key:"meta",value:{name:"ReactNode",required:!1}}]}}],raw:`Readonly<{
  value: string;
  label: string;
  description?: string;
  meta?: ReactNode;
}>`},{name:"signature",type:"object",raw:`{
  icon?: never;
  iconColor?: never;
  prefix?: never;
}`,signature:{properties:[{key:"icon",value:{name:"never",required:!1}},{key:"iconColor",value:{name:"never",required:!1}},{key:"prefix",value:{name:"never",required:!1}}]}}]},{name:"intersection",raw:`OptionBase & {
  icon: IconName;
  iconColor?: string;
  prefix?: never;
}`,elements:[{name:"Readonly",elements:[{name:"signature",type:"object",raw:`{
  value: string;
  label: string;
  description?: string;
  meta?: ReactNode;
}`,signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}},{key:"description",value:{name:"string",required:!1}},{key:"meta",value:{name:"ReactNode",required:!1}}]}}],raw:`Readonly<{
  value: string;
  label: string;
  description?: string;
  meta?: ReactNode;
}>`},{name:"signature",type:"object",raw:`{
  icon: IconName;
  iconColor?: string;
  prefix?: never;
}`,signature:{properties:[{key:"icon",value:{name:"unknown",required:!0}},{key:"iconColor",value:{name:"string",required:!1}},{key:"prefix",value:{name:"never",required:!1}}]}}]},{name:"intersection",raw:`OptionBase & {
  prefix: string;
  icon?: never;
  iconColor?: never;
}`,elements:[{name:"Readonly",elements:[{name:"signature",type:"object",raw:`{
  value: string;
  label: string;
  description?: string;
  meta?: ReactNode;
}`,signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}},{key:"description",value:{name:"string",required:!1}},{key:"meta",value:{name:"ReactNode",required:!1}}]}}],raw:`Readonly<{
  value: string;
  label: string;
  description?: string;
  meta?: ReactNode;
}>`},{name:"signature",type:"object",raw:`{
  prefix: string;
  icon?: never;
  iconColor?: never;
}`,signature:{properties:[{key:"prefix",value:{name:"string",required:!0}},{key:"icon",value:{name:"never",required:!1}},{key:"iconColor",value:{name:"never",required:!1}}]}}]}]},name:"option"}],return:{name:"ReactNode"}}},description:""},"aria-label":{required:!0,tsType:{name:"string"},description:""}},composes:["Omit"]};export{y as O};
