import{j as a}from"./jsx-runtime-u17CrQMm.js";import{r as d}from"./iframe-D6-YU4nw.js";import{c as p}from"./cn-2dOUpm6k.js";import{I as w}from"./Icon-_WrJETSe.js";import{O as B}from"./OptionList-B3Hr0P4t.js";const V="_selector_1qdtz_1",A="_trigger_1qdtz_5",K="_triggerPrefix_1qdtz_22",L="_triggerIcon_1qdtz_28",M="_label_1qdtz_33",$="_chevron_1qdtz_48",H="_inlineTrigger_1qdtz_53",F="_dropdown_1qdtz_67",G="_dropdownEnd_1qdtz_82",r={selector:V,trigger:A,triggerPrefix:K,triggerIcon:L,label:M,chevron:$,inlineTrigger:H,dropdown:F,dropdownEnd:G},q=d.forwardRef(({options:o,value:m,onValueChange:b,open:i=!1,onOpenChange:t,placeholder:k="Select…",triggerPrefix:g,header:x,emptyState:_,action:s,dropdownAlign:R="stretch",variant:C="default",renderTriggerLabel:v,renderOptionIndicator:j,className:I,"aria-label":f,...N},T)=>{const l=d.useRef(null),n=o.find(e=>e.value===m),h=o.some(e=>e.icon!==void 0),O=o.some(e=>e.prefix!==void 0),u=C==="inline",S=d.useCallback(e=>{if(!e)return;const c=e.querySelector('[aria-selected="true"]');c&&c.scrollIntoView?.({block:"nearest"});const y=e.ownerDocument.activeElement;if(y&&e.contains(y))return;const z=e.querySelector("input, textarea"),P=e.querySelector('[role="option"]');(z??c??P)?.focus()},[]),D=e=>{e.key==="ArrowDown"||e.key==="Enter"||e.key===" "?i||(e.preventDefault(),t?.(!0)):e.key==="Escape"&&i&&(e.preventDefault(),t?.(!1))};function E(){return n?v?v(n):O&&n.prefix?`${n.prefix} · ${n.label}`:n.label:k}return a.jsxs("div",{ref:T,className:p(r.selector,I),...N,children:[a.jsxs("button",{ref:l,type:"button",className:p(r.trigger,u&&r.inlineTrigger),"aria-haspopup":"listbox","aria-expanded":i,"aria-label":f,onClick:()=>t?.(!i),onKeyDown:D,children:[g&&a.jsx("span",{className:r.triggerPrefix,children:g}),h&&n?.icon&&a.jsx(w,{name:n.icon,size:"sm",className:r.triggerIcon,style:n.iconColor?{"--selector-icon-color":n.iconColor}:void 0}),a.jsx("span",{className:r.label,children:E()}),a.jsx(w,{name:u?"expand_more":"unfold_more",size:u?"sm":"md",className:r.chevron})]}),i&&a.jsx("div",{ref:S,role:"presentation",className:p(r.dropdown,R==="end"&&r.dropdownEnd),onKeyDown:e=>{e.key==="Escape"&&!e.defaultPrevented&&(e.preventDefault(),t?.(!1),l.current?.focus())},children:a.jsx(B,{options:o,value:m,"aria-label":f??"Options",header:x,emptyState:_,renderOptionIndicator:j,action:s?{...s,onClick:()=>{s.onClick(),t?.(!1)}}:void 0,onSelect:e=>{b?.(e),t?.(!1),l.current?.focus()}})})]})});q.displayName="Selector";q.__docgenInfo={description:"",methods:[],displayName:"Selector",props:{options:{required:!0,tsType:{name:"union",raw:`| readonly DotOption[]
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
}`,signature:{properties:[{key:"prefix",value:{name:"string",required:!0}},{key:"icon",value:{name:"never",required:!1}},{key:"iconColor",value:{name:"never",required:!1}}]}}]}]},name:"option"}],return:{name:"ReactNode"}}},description:""}},composes:["HTMLAttributes"]};export{q as S};
