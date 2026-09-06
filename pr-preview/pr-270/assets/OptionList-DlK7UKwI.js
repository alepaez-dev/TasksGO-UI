import{j as t}from"./jsx-runtime-u17CrQMm.js";import{r as y}from"./iframe-BRfk_XGe.js";import{c as p}from"./cn-2dOUpm6k.js";import{I as d}from"./Icon-CYyrjMm8.js";const h="_list_syjoj_1",I="_header_syjoj_6",R="_options_syjoj_15",O="_emptyState_syjoj_27",C="_option_syjoj_15",D="_optionSelected_syjoj_52",T="_dot_syjoj_56",S="_dotActive_syjoj_63",L="_dotInactive_syjoj_67",W="_optionIcon_syjoj_72",E="_optionPrefix_syjoj_77",P="_optionText_syjoj_89",A="_optionWithDescription_syjoj_96",M="_optionDescription_syjoj_100",$="_optionLabel_syjoj_107",z="_optionMeta_syjoj_123",B="_checkIcon_syjoj_131",H="_actionWrapper_syjoj_136",K="_action_syjoj_136",e={list:h,header:I,options:R,emptyState:O,option:C,optionSelected:D,dot:T,dotActive:S,dotInactive:L,optionIcon:W,optionPrefix:E,optionText:P,optionWithDescription:A,optionDescription:M,optionLabel:$,optionMeta:z,checkIcon:B,actionWrapper:H,action:K};function U(i,a){if(i.icon)return t.jsx(d,{name:i.icon,size:"sm",className:e.optionIcon,style:i.iconColor?{"--selector-icon-color":i.iconColor}:void 0});if(i.prefix)return t.jsx("span",{className:e.optionPrefix,children:i.prefix});const o=i.value===a;return t.jsx("span",{className:p(e.dot,o?e.dotActive:e.dotInactive)})}function v(i,a){if(!(i instanceof HTMLElement))return;const o=a==="next"?i.nextElementSibling:i.previousElementSibling;o instanceof HTMLElement&&o.focus()}const g=y.forwardRef(({options:i,value:a,onSelect:o,header:u,emptyState:m,action:s,listboxId:j,renderOptionIndicator:f,className:_,"aria-label":x,...b},k)=>{const N=f??(n=>U(n,a)),q=y.useId(),w=n=>r=>{switch(r.key){case"Enter":case" ":r.preventDefault(),o(n);break;case"ArrowDown":r.preventDefault(),v(r.target,"next");break;case"ArrowUp":r.preventDefault(),v(r.target,"prev");break}};return t.jsxs("div",{ref:k,className:p(e.list,_),...b,children:[u&&t.jsx("div",{className:e.header,children:u}),i.length===0&&m&&t.jsx("div",{className:e.emptyState,children:m}),t.jsx("div",{id:j,role:"listbox",className:e.options,"aria-label":x,children:i.map((n,r)=>{const c=n.value===a,l=n.description?`${q}-${r}-desc`:void 0;return t.jsxs("div",{role:"option",tabIndex:0,"aria-selected":c,"aria-label":n.prefix==null?n.label:`${n.prefix} ${n.label}`,"aria-describedby":l,className:p(e.option,c&&e.optionSelected,l!=null&&e.optionWithDescription),onClick:()=>o(n.value),onKeyDown:w(n.value),children:[N(n),t.jsxs("span",{className:e.optionText,children:[t.jsx("span",{className:e.optionLabel,children:n.label}),l!=null&&t.jsx("span",{id:l,className:e.optionDescription,children:n.description})]}),n.meta!=null&&!c&&t.jsx("span",{className:e.optionMeta,children:n.meta}),c&&t.jsx(d,{name:"check_circle",size:"sm",className:e.checkIcon})]},n.value)})}),s&&t.jsx("div",{className:e.actionWrapper,children:t.jsxs("button",{type:"button",className:e.action,onClick:s.onClick,children:[t.jsx(d,{name:s.icon,size:"sm"}),t.jsx("span",{children:s.label})]})})]})});g.displayName="OptionList";g.__docgenInfo={description:"",methods:[],displayName:"OptionList",props:{options:{required:!0,tsType:{name:"union",raw:`| readonly DotOption[]
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
}`,signature:{properties:[{key:"prefix",value:{name:"string",required:!0}},{key:"icon",value:{name:"never",required:!1}},{key:"iconColor",value:{name:"never",required:!1}}]}}]}]},name:"option"}],return:{name:"ReactNode"}}},description:""},"aria-label":{required:!0,tsType:{name:"string"},description:""}},composes:["Omit"]};export{g as O};
