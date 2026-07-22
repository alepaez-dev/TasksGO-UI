import{j as n}from"./jsx-runtime-u17CrQMm.js";import{r as b}from"./iframe-BkxkAkzO.js";import{c as l}from"./cn-2dOUpm6k.js";import{I as c}from"./Icon-DjBeAuJY.js";const N="_list_11owf_1",q="_header_11owf_6",I="_options_11owf_15",h="_emptyState_11owf_27",j="_option_11owf_15",R="_optionSelected_11owf_52",O="_dot_11owf_56",C="_dotActive_11owf_63",S="_dotInactive_11owf_67",T="_optionIcon_11owf_72",L="_optionPrefix_11owf_77",D="_optionLabel_11owf_89",E="_optionMeta_11owf_106",A="_checkIcon_11owf_114",M="_actionWrapper_11owf_119",P="_action_11owf_119",e={list:N,header:q,options:I,emptyState:h,option:j,optionSelected:R,dot:O,dotActive:C,dotInactive:S,optionIcon:T,optionPrefix:L,optionLabel:D,optionMeta:E,checkIcon:A,actionWrapper:M,action:P};function W(t,o){if(t.icon)return n.jsx(c,{name:t.icon,size:"sm",className:e.optionIcon,style:t.iconColor?{"--selector-icon-color":t.iconColor}:void 0});if(t.prefix)return n.jsx("span",{className:e.optionPrefix,children:t.prefix});const i=t.value===o;return n.jsx("span",{className:l(e.dot,i?e.dotActive:e.dotInactive)})}function d(t,o){if(!(t instanceof HTMLElement))return;const i=o==="next"?t.nextElementSibling:t.previousElementSibling;i instanceof HTMLElement&&i.focus()}const m=b.forwardRef(({options:t,value:o,onSelect:i,header:u,emptyState:p,action:s,listboxId:v,renderOptionIndicator:f,className:y,"aria-label":g,..._},w)=>{const x=f??(a=>W(a,o)),k=a=>r=>{switch(r.key){case"Enter":case" ":r.preventDefault(),i(a);break;case"ArrowDown":r.preventDefault(),d(r.target,"next");break;case"ArrowUp":r.preventDefault(),d(r.target,"prev");break}};return n.jsxs("div",{ref:w,className:l(e.list,y),..._,children:[u&&n.jsx("div",{className:e.header,children:u}),t.length===0&&p&&n.jsx("div",{className:e.emptyState,children:p}),n.jsx("div",{id:v,role:"listbox",className:e.options,"aria-label":g,children:t.map(a=>{const r=a.value===o;return n.jsxs("div",{role:"option",tabIndex:0,"aria-selected":r,className:l(e.option,r&&e.optionSelected),onClick:()=>i(a.value),onKeyDown:k(a.value),children:[x(a),n.jsx("span",{className:e.optionLabel,children:a.label}),a.meta!=null&&!r&&n.jsx("span",{className:e.optionMeta,children:a.meta}),r&&n.jsx(c,{name:"check_circle",size:"sm",className:e.checkIcon})]},a.value)})}),s&&n.jsx("div",{className:e.actionWrapper,children:n.jsxs("button",{type:"button",className:e.action,onClick:s.onClick,children:[n.jsx(c,{name:s.icon,size:"sm"}),n.jsx("span",{children:s.label})]})})]})});m.displayName="OptionList";m.__docgenInfo={description:"",methods:[],displayName:"OptionList",props:{options:{required:!0,tsType:{name:"union",raw:`| readonly DotOption[]
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
}`,elements:[{name:"Readonly",elements:[{name:"signature",type:"object",raw:"{ value: string; label: string; meta?: ReactNode }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}},{key:"meta",value:{name:"ReactNode",required:!1}}]}}],raw:"Readonly<{ value: string; label: string; meta?: ReactNode }>"},{name:"signature",type:"object",raw:`{
  icon?: never;
  iconColor?: never;
  prefix?: never;
}`,signature:{properties:[{key:"icon",value:{name:"never",required:!1}},{key:"iconColor",value:{name:"never",required:!1}},{key:"prefix",value:{name:"never",required:!1}}]}}]},{name:"intersection",raw:`OptionBase & {
  icon: IconName;
  iconColor?: string;
  prefix?: never;
}`,elements:[{name:"Readonly",elements:[{name:"signature",type:"object",raw:"{ value: string; label: string; meta?: ReactNode }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}},{key:"meta",value:{name:"ReactNode",required:!1}}]}}],raw:"Readonly<{ value: string; label: string; meta?: ReactNode }>"},{name:"signature",type:"object",raw:`{
  icon: IconName;
  iconColor?: string;
  prefix?: never;
}`,signature:{properties:[{key:"icon",value:{name:"unknown",required:!0}},{key:"iconColor",value:{name:"string",required:!1}},{key:"prefix",value:{name:"never",required:!1}}]}}]},{name:"intersection",raw:`OptionBase & {
  prefix: string;
  icon?: never;
  iconColor?: never;
}`,elements:[{name:"Readonly",elements:[{name:"signature",type:"object",raw:"{ value: string; label: string; meta?: ReactNode }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}},{key:"meta",value:{name:"ReactNode",required:!1}}]}}],raw:"Readonly<{ value: string; label: string; meta?: ReactNode }>"},{name:"signature",type:"object",raw:`{
  prefix: string;
  icon?: never;
  iconColor?: never;
}`,signature:{properties:[{key:"prefix",value:{name:"string",required:!0}},{key:"icon",value:{name:"never",required:!1}},{key:"iconColor",value:{name:"never",required:!1}}]}}]}]},name:"option"}],return:{name:"ReactNode"}}},description:""},"aria-label":{required:!0,tsType:{name:"string"},description:""}},composes:["Omit"]};export{m as O};
