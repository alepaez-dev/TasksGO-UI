import{j as r}from"./jsx-runtime-u17CrQMm.js";import{r as u}from"./iframe-DfuyBzhB.js";import{c as g}from"./cn-2dOUpm6k.js";import{I as f}from"./Icon-CK0pVxYt.js";const z="_selector_1iog7_1",V="_trigger_1iog7_5",W="_triggerPrefix_1iog7_22",H="_label_1iog7_28",$="_chevron_1iog7_43",G="_inlineTrigger_1iog7_48",U="_dropdown_1iog7_62",F="_dropdownEnd_1iog7_77",J="_header_1iog7_83",Q="_options_1iog7_92",X="_emptyState_1iog7_104",Y="_option_1iog7_92",Z="_optionSelected_1iog7_129",ee="_dot_1iog7_133",ne="_dotActive_1iog7_140",re="_optionIcon_1iog7_144",te="_optionPrefix_1iog7_149",oe="_dotInactive_1iog7_161",ie="_optionLabel_1iog7_166",ae="_checkIcon_1iog7_183",se="_actionWrapper_1iog7_188",le="_action_1iog7_188",n={selector:z,trigger:V,triggerPrefix:W,label:H,chevron:$,inlineTrigger:G,dropdown:U,dropdownEnd:F,header:J,options:Q,emptyState:X,option:Y,optionSelected:Z,dot:ee,dotActive:ne,optionIcon:re,optionPrefix:te,dotInactive:oe,optionLabel:ie,checkIcon:ae,actionWrapper:se,action:le};function q(t,i){if(!(t instanceof HTMLElement))return;const a=i==="next"?t.nextElementSibling:t.previousElementSibling;a instanceof HTMLElement&&a.focus()}const h=u.forwardRef(({options:t,value:i,onValueChange:a,open:s=!1,onOpenChange:l,placeholder:d="Select…",triggerPrefix:p,header:m,emptyState:w,action:v,dropdownAlign:j="stretch",variant:I="default",renderTriggerLabel:_,renderOptionIndicator:N,className:S,"aria-label":x,...C},R)=>{const y=u.useRef(null),c=t.find(e=>e.value===i),E=t.some(e=>e.icon!==void 0),T=t.some(e=>e.prefix!==void 0),b=I==="inline",D=u.useCallback(e=>{if(!e)return;const o=e.querySelector('[aria-selected="true"]');o&&o.scrollIntoView?.({block:"nearest"});const k=e.ownerDocument.activeElement;if(k&&e.contains(k))return;const B=e.querySelector("input, textarea"),M=e.querySelector('[role="option"]');(B??o??M)?.focus()},[]),O=e=>{e.key==="ArrowDown"||e.key==="Enter"||e.key===" "?s||(e.preventDefault(),l?.(!0)):e.key==="Escape"&&s&&(e.preventDefault(),l?.(!1))},L=e=>o=>{switch(o.key){case"Enter":case" ":o.preventDefault(),a?.(e),l?.(!1),y.current?.focus();break;case"ArrowDown":o.preventDefault(),q(o.target,"next");break;case"ArrowUp":o.preventDefault(),q(o.target,"prev");break;case"Escape":o.preventDefault(),l?.(!1),y.current?.focus();break}};function P(){return c?_?_(c):T&&c.prefix?`${c.prefix} · ${c.label}`:c.label:d}function A(e){if(e.icon)return r.jsx(f,{name:e.icon,size:"sm",className:n.optionIcon,style:e.iconColor?{"--selector-icon-color":e.iconColor}:void 0});if(e.prefix)return r.jsx("span",{className:n.optionPrefix,children:e.prefix});const o=e.value===i;return r.jsx("span",{className:g(n.dot,o?n.dotActive:n.dotInactive)})}const K=N??A;return r.jsxs("div",{ref:R,className:g(n.selector,S),...C,children:[r.jsxs("button",{ref:y,type:"button",className:g(n.trigger,b&&n.inlineTrigger),"aria-haspopup":"listbox","aria-expanded":s,"aria-label":x,onClick:()=>l?.(!s),onKeyDown:O,children:[p&&r.jsx("span",{className:n.triggerPrefix,children:p}),E&&c?.icon&&r.jsx(f,{name:c.icon,size:"sm",className:n.optionIcon,style:c.iconColor?{"--selector-icon-color":c.iconColor}:void 0}),r.jsx("span",{className:n.label,children:P()}),r.jsx(f,{name:b?"expand_more":"unfold_more",size:b?"sm":"md",className:n.chevron})]}),s&&r.jsxs("div",{ref:D,role:"presentation",className:g(n.dropdown,j==="end"&&n.dropdownEnd),onKeyDown:e=>{e.key==="Escape"&&!e.defaultPrevented&&(e.preventDefault(),l?.(!1),y.current?.focus())},children:[m&&r.jsx("div",{className:n.header,children:m}),t.length===0&&w&&r.jsx("div",{className:n.emptyState,children:w}),r.jsx("div",{role:"listbox",className:n.options,"aria-label":x??"Options",children:t.map(e=>{const o=e.value===i;return r.jsxs("div",{role:"option",tabIndex:0,"aria-selected":o,className:g(n.option,o&&n.optionSelected),onClick:()=>{a?.(e.value),l?.(!1)},onKeyDown:L(e.value),children:[K(e),r.jsx("span",{className:n.optionLabel,children:e.label}),o&&r.jsx(f,{name:"check_circle",size:b?"sm":"md",className:n.checkIcon})]},e.value)})}),v&&r.jsx("div",{className:n.actionWrapper,children:r.jsxs("button",{type:"button",className:n.action,onClick:()=>{v.onClick(),l?.(!1)},children:[r.jsx(f,{name:v.icon,size:"sm"}),r.jsx("span",{children:v.label})]})})]})]})});h.displayName="Selector";h.__docgenInfo={description:"",methods:[],displayName:"Selector",props:{options:{required:!0,tsType:{name:"union",raw:`| readonly DotOption[]
| readonly IconOption[]
| readonly PrefixOption[]`,elements:[{name:"unknown"},{name:"unknown"},{name:"unknown"}]},description:""},value:{required:!1,tsType:{name:"string"},description:""},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""},open:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onOpenChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(open: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"open"}],return:{name:"void"}}},description:""},placeholder:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Select\\u2026'",computed:!1}},triggerPrefix:{required:!1,tsType:{name:"ReactNode"},description:""},header:{required:!1,tsType:{name:"ReactNode"},description:""},emptyState:{required:!1,tsType:{name:"ReactNode"},description:""},action:{required:!1,tsType:{name:"Readonly",elements:[{name:"signature",type:"object",raw:`{
  label: string;
  icon: IconName;
  onClick: () => void;
}`,signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"icon",value:{name:"unknown",required:!0}},{key:"onClick",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!0}}]}}],raw:`Readonly<{
  label: string;
  icon: IconName;
  onClick: () => void;
}>`},description:""},dropdownAlign:{required:!1,tsType:{name:"union",raw:"'stretch' | 'end'",elements:[{name:"literal",value:"'stretch'"},{name:"literal",value:"'end'"}]},description:"",defaultValue:{value:"'stretch'",computed:!1}},variant:{required:!1,tsType:{name:"union",raw:"'default' | 'inline'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'inline'"}]},description:"",defaultValue:{value:"'default'",computed:!1}},renderTriggerLabel:{required:!1,tsType:{name:"signature",type:"function",raw:"(option: SelectorOption) => ReactNode",signature:{arguments:[{type:{name:"union",raw:"DotOption | IconOption | PrefixOption",elements:[{name:"intersection",raw:`OptionBase & {
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
}`,signature:{properties:[{key:"prefix",value:{name:"string",required:!0}},{key:"icon",value:{name:"never",required:!1}},{key:"iconColor",value:{name:"never",required:!1}}]}}]}]},name:"option"}],return:{name:"ReactNode"}}},description:""},renderOptionIndicator:{required:!1,tsType:{name:"signature",type:"function",raw:"(option: SelectorOption) => ReactNode",signature:{arguments:[{type:{name:"union",raw:"DotOption | IconOption | PrefixOption",elements:[{name:"intersection",raw:`OptionBase & {
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
}`,signature:{properties:[{key:"prefix",value:{name:"string",required:!0}},{key:"icon",value:{name:"never",required:!1}},{key:"iconColor",value:{name:"never",required:!1}}]}}]}]},name:"option"}],return:{name:"ReactNode"}}},description:""}},composes:["HTMLAttributes"]};function ce(t,i,a=!0){u.useEffect(()=>{if(!a)return;const s=l=>{t.current&&!t.current.contains(l.target)&&i()};return document.addEventListener("mousedown",s),()=>document.removeEventListener("mousedown",s)},[t,i,a])}function ge(){const[t,i]=u.useState(!1),a=u.useRef(null),s=u.useCallback(()=>i(!1),[]);return ce(a,s,t),{ref:a,open:t,onOpenChange:i}}function fe(...t){const[i,a]=u.useState(null),s=u.useRef({});u.useEffect(()=>{if(!i)return;const d=p=>{const m=s.current[i];m&&!m.contains(p.target)&&a(null)};return document.addEventListener("mousedown",d),()=>document.removeEventListener("mousedown",d)},[i]);const l={};for(const d of t)l[d]={ref:p=>{s.current[d]=p},open:i===d,onOpenChange:p=>a(p?d:null)};return l}export{h as S,fe as a,ge as u};
