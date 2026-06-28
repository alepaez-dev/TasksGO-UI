import{j as t}from"./jsx-runtime-u17CrQMm.js";import{r as w}from"./iframe-DLrEaXTF.js";import{c as l}from"./cn-2dOUpm6k.js";import{I as c}from"./Icon-CHwQqk5x.js";const q="_list_1tlsp_1",I="_header_1tlsp_6",h="_options_1tlsp_15",j="_emptyState_1tlsp_27",N="_option_1tlsp_15",O="_optionSelected_1tlsp_52",C="_dot_1tlsp_56",R="_dotActive_1tlsp_63",S="_dotInactive_1tlsp_67",T="_optionIcon_1tlsp_72",L="_optionPrefix_1tlsp_77",D="_optionLabel_1tlsp_89",E="_checkIcon_1tlsp_106",A="_actionWrapper_1tlsp_111",P="_action_1tlsp_111",e={list:q,header:I,options:h,emptyState:j,option:N,optionSelected:O,dot:C,dotActive:R,dotInactive:S,optionIcon:T,optionPrefix:L,optionLabel:D,checkIcon:E,actionWrapper:A,action:P};function W(n,o){if(n.icon)return t.jsx(c,{name:n.icon,size:"sm",className:e.optionIcon,style:n.iconColor?{"--selector-icon-color":n.iconColor}:void 0});if(n.prefix)return t.jsx("span",{className:e.optionPrefix,children:n.prefix});const a=n.value===o;return t.jsx("span",{className:l(e.dot,a?e.dotActive:e.dotInactive)})}function d(n,o){if(!(n instanceof HTMLElement))return;const a=o==="next"?n.nextElementSibling:n.previousElementSibling;a instanceof HTMLElement&&a.focus()}const m=w.forwardRef(({options:n,value:o,onSelect:a,header:p,emptyState:u,action:s,listboxId:v,renderOptionIndicator:g,className:y,"aria-label":f,..._},x)=>{const b=g??(r=>W(r,o)),k=r=>i=>{switch(i.key){case"Enter":case" ":i.preventDefault(),a(r);break;case"ArrowDown":i.preventDefault(),d(i.target,"next");break;case"ArrowUp":i.preventDefault(),d(i.target,"prev");break}};return t.jsxs("div",{ref:x,className:l(e.list,y),..._,children:[p&&t.jsx("div",{className:e.header,children:p}),n.length===0&&u&&t.jsx("div",{className:e.emptyState,children:u}),t.jsx("div",{id:v,role:"listbox",className:e.options,"aria-label":f,children:n.map(r=>{const i=r.value===o;return t.jsxs("div",{role:"option",tabIndex:0,"aria-selected":i,className:l(e.option,i&&e.optionSelected),onClick:()=>a(r.value),onKeyDown:k(r.value),children:[b(r),t.jsx("span",{className:e.optionLabel,children:r.label}),i&&t.jsx(c,{name:"check_circle",size:"sm",className:e.checkIcon})]},r.value)})}),s&&t.jsx("div",{className:e.actionWrapper,children:t.jsxs("button",{type:"button",className:e.action,onClick:s.onClick,children:[t.jsx(c,{name:s.icon,size:"sm"}),t.jsx("span",{children:s.label})]})})]})});m.displayName="OptionList";m.__docgenInfo={description:"",methods:[],displayName:"OptionList",props:{options:{required:!0,tsType:{name:"union",raw:`| readonly DotOption[]
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
}`,elements:[{name:"Readonly",elements:[{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}],raw:"Readonly<{ value: string; label: string }>"},{name:"signature",type:"object",raw:`{
  icon?: never;
  iconColor?: never;
  prefix?: never;
}`,signature:{properties:[{key:"icon",value:{name:"never",required:!1}},{key:"iconColor",value:{name:"never",required:!1}},{key:"prefix",value:{name:"never",required:!1}}]}}]},{name:"intersection",raw:`OptionBase & {
  icon: IconName;
  iconColor?: string;
  prefix?: never;
}`,elements:[{name:"Readonly",elements:[{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}],raw:"Readonly<{ value: string; label: string }>"},{name:"signature",type:"object",raw:`{
  icon: IconName;
  iconColor?: string;
  prefix?: never;
}`,signature:{properties:[{key:"icon",value:{name:"unknown",required:!0}},{key:"iconColor",value:{name:"string",required:!1}},{key:"prefix",value:{name:"never",required:!1}}]}}]},{name:"intersection",raw:`OptionBase & {
  prefix: string;
  icon?: never;
  iconColor?: never;
}`,elements:[{name:"Readonly",elements:[{name:"signature",type:"object",raw:"{ value: string; label: string }",signature:{properties:[{key:"value",value:{name:"string",required:!0}},{key:"label",value:{name:"string",required:!0}}]}}],raw:"Readonly<{ value: string; label: string }>"},{name:"signature",type:"object",raw:`{
  prefix: string;
  icon?: never;
  iconColor?: never;
}`,signature:{properties:[{key:"prefix",value:{name:"string",required:!0}},{key:"icon",value:{name:"never",required:!1}},{key:"iconColor",value:{name:"never",required:!1}}]}}]}]},name:"option"}],return:{name:"ReactNode"}}},description:""},"aria-label":{required:!0,tsType:{name:"string"},description:""}},composes:["Omit"]};export{m as O};
