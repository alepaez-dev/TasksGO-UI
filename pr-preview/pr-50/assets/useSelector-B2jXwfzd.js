import{j as r}from"./jsx-runtime-u17CrQMm.js";import{r as c}from"./iframe-BNPbE1qG.js";import{c as g}from"./cn-2dOUpm6k.js";import{I as f}from"./Icon-BoQtqx75.js";const W="_selector_1iog7_1",H="_trigger_1iog7_5",$="_triggerPrefix_1iog7_22",G="_label_1iog7_28",U="_chevron_1iog7_43",F="_inlineTrigger_1iog7_48",J="_dropdown_1iog7_62",Q="_dropdownEnd_1iog7_77",X="_header_1iog7_83",Y="_options_1iog7_92",Z="_emptyState_1iog7_104",ee="_option_1iog7_92",ne="_optionSelected_1iog7_129",re="_dot_1iog7_133",te="_dotActive_1iog7_140",oe="_optionIcon_1iog7_144",ie="_optionPrefix_1iog7_149",ae="_dotInactive_1iog7_161",se="_optionLabel_1iog7_166",le="_checkIcon_1iog7_183",ce="_actionWrapper_1iog7_188",ue="_action_1iog7_188",n={selector:W,trigger:H,triggerPrefix:$,label:G,chevron:U,inlineTrigger:F,dropdown:J,dropdownEnd:Q,header:X,options:Y,emptyState:Z,option:ee,optionSelected:ne,dot:re,dotActive:te,optionIcon:oe,optionPrefix:ie,dotInactive:ae,optionLabel:se,checkIcon:le,actionWrapper:ce,action:ue};function I(t,i){if(!(t instanceof HTMLElement))return;const a=i==="next"?t.nextElementSibling:t.previousElementSibling;a instanceof HTMLElement&&a.focus()}const j=c.forwardRef(({options:t,value:i,onValueChange:a,open:s=!1,onOpenChange:l,placeholder:d="Select…",triggerPrefix:p,header:m,emptyState:w,action:v,dropdownAlign:N="stretch",variant:S="default",renderTriggerLabel:_,renderOptionIndicator:C,className:R,"aria-label":x,...k},E)=>{const T=c.useId(),y=c.useRef(null),u=t.find(e=>e.value===i),q=`${k.id??T}-listbox`,D=t.some(e=>e.icon!==void 0),O=t.some(e=>e.prefix!==void 0),b=S==="inline",L=c.useCallback(e=>{if(!e)return;const o=e.querySelector('[aria-selected="true"]');o&&o.scrollIntoView?.({block:"nearest"});const h=e.ownerDocument.activeElement;if(h&&e.contains(h))return;const z=e.querySelector("input, textarea"),V=e.querySelector('[role="option"]');(z??o??V)?.focus()},[]),P=e=>{e.key==="ArrowDown"||e.key==="Enter"||e.key===" "?s||(e.preventDefault(),l?.(!0)):e.key==="Escape"&&s&&(e.preventDefault(),l?.(!1))},A=e=>o=>{switch(o.key){case"Enter":case" ":o.preventDefault(),a?.(e),l?.(!1),y.current?.focus();break;case"ArrowDown":o.preventDefault(),I(o.target,"next");break;case"ArrowUp":o.preventDefault(),I(o.target,"prev");break;case"Escape":o.preventDefault(),l?.(!1),y.current?.focus();break}};function K(){return u?_?_(u):O&&u.prefix?`${u.prefix} · ${u.label}`:u.label:d}function B(e){if(e.icon)return r.jsx(f,{name:e.icon,size:"sm",className:n.optionIcon,style:e.iconColor?{"--selector-icon-color":e.iconColor}:void 0});if(e.prefix)return r.jsx("span",{className:n.optionPrefix,children:e.prefix});const o=e.value===i;return r.jsx("span",{className:g(n.dot,o?n.dotActive:n.dotInactive)})}const M=C??B;return r.jsxs("div",{ref:E,className:g(n.selector,R),...k,children:[r.jsxs("button",{ref:y,type:"button",className:g(n.trigger,b&&n.inlineTrigger),"aria-haspopup":"listbox","aria-expanded":s,"aria-controls":s?q:void 0,"aria-label":x,onClick:()=>l?.(!s),onKeyDown:P,children:[p&&r.jsx("span",{className:n.triggerPrefix,children:p}),D&&u?.icon&&r.jsx(f,{name:u.icon,size:"sm",className:n.optionIcon,style:u.iconColor?{"--selector-icon-color":u.iconColor}:void 0}),r.jsx("span",{className:n.label,children:K()}),r.jsx(f,{name:b?"expand_more":"unfold_more",size:b?"sm":"md",className:n.chevron})]}),s&&r.jsxs("div",{ref:L,role:"presentation",className:g(n.dropdown,N==="end"&&n.dropdownEnd),onKeyDown:e=>{e.key==="Escape"&&!e.defaultPrevented&&(e.preventDefault(),l?.(!1),y.current?.focus())},children:[m&&r.jsx("div",{className:n.header,children:m}),t.length===0&&w&&r.jsx("div",{className:n.emptyState,children:w}),r.jsx("div",{id:q,role:"listbox",className:n.options,"aria-label":x??"Options",children:t.map(e=>{const o=e.value===i;return r.jsxs("div",{role:"option",tabIndex:0,"aria-selected":o,className:g(n.option,o&&n.optionSelected),onClick:()=>{a?.(e.value),l?.(!1)},onKeyDown:A(e.value),children:[M(e),r.jsx("span",{className:n.optionLabel,children:e.label}),o&&r.jsx(f,{name:"check_circle",size:b?"sm":"md",className:n.checkIcon})]},e.value)})}),v&&r.jsx("div",{className:n.actionWrapper,children:r.jsxs("button",{type:"button",className:n.action,onClick:()=>{v.onClick(),l?.(!1)},children:[r.jsx(f,{name:v.icon,size:"sm"}),r.jsx("span",{children:v.label})]})})]})]})});j.displayName="Selector";j.__docgenInfo={description:"",methods:[],displayName:"Selector",props:{options:{required:!0,tsType:{name:"union",raw:`| readonly DotOption[]
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
}`,signature:{properties:[{key:"prefix",value:{name:"string",required:!0}},{key:"icon",value:{name:"never",required:!1}},{key:"iconColor",value:{name:"never",required:!1}}]}}]}]},name:"option"}],return:{name:"ReactNode"}}},description:""}},composes:["HTMLAttributes"]};function de(t,i,a=!0){c.useEffect(()=>{if(!a)return;const s=l=>{t.current&&!t.current.contains(l.target)&&i()};return document.addEventListener("mousedown",s),()=>document.removeEventListener("mousedown",s)},[t,i,a])}function ve(){const[t,i]=c.useState(!1),a=c.useRef(null),s=c.useCallback(()=>i(!1),[]);return de(a,s,t),{ref:a,open:t,onOpenChange:i}}function ye(...t){const[i,a]=c.useState(null),s=c.useRef({});c.useEffect(()=>{if(!i)return;const d=p=>{const m=s.current[i];m&&!m.contains(p.target)&&a(null)};return document.addEventListener("mousedown",d),()=>document.removeEventListener("mousedown",d)},[i]);const l={};for(const d of t)l[d]={ref:p=>{s.current[d]=p},open:i===d,onOpenChange:p=>a(p?d:null)};return l}export{j as S,ye as a,ve as u};
