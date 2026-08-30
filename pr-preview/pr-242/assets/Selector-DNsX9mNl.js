import{j as i}from"./jsx-runtime-u17CrQMm.js";import{r as s}from"./iframe-XQFivrMG.js";import{c as b}from"./cn-2dOUpm6k.js";import{I as R}from"./Icon-C1Fa8sFl.js";import{O as K}from"./OptionList-D42QUPZ9.js";function W(){const[n,c]=s.useState(null),[m,o]=s.useState(!1),t=s.useCallback(l=>c(l),[]);return s.useEffect(()=>{if(!n||typeof ResizeObserver>"u"||typeof MutationObserver>"u")return;const l=()=>o(n.scrollWidth-n.clientWidth>1),u=new ResizeObserver(l);u.observe(n);const d=new MutationObserver(l);return d.observe(n,{characterData:!0,childList:!0,subtree:!0}),()=>{u.disconnect(),d.disconnect()}},[n]),[t,m]}const $="_selector_1rvgn_1",H="_trigger_1rvgn_7",F="_triggerPrefix_1rvgn_24",G="_triggerIcon_1rvgn_30",J="_label_1rvgn_35",Q="_chevron_1rvgn_51",U="_inlineTrigger_1rvgn_56",X="_dropdown_1rvgn_71",Y="_dropdownEnd_1rvgn_86",a={selector:$,trigger:H,triggerPrefix:F,triggerIcon:G,label:J,chevron:Q,inlineTrigger:U,dropdown:X,dropdownEnd:Y},x=s.forwardRef(({options:n,value:c,onValueChange:m,open:o=!1,onOpenChange:t,placeholder:l="Select…",triggerPrefix:u,header:d,emptyState:N,action:p,dropdownAlign:_="stretch",variant:T="default",showChevron:C=!0,renderTriggerLabel:v,renderOptionIndicator:h,className:I,"aria-label":w,...j},O)=>{const g=s.useRef(null),r=n.find(e=>e.value===c),S=n.some(e=>e.icon!==void 0),D=n.some(e=>e.prefix!==void 0),f=T==="inline",[E,P]=W(),V=s.useCallback(e=>{if(!e)return;const y=e.querySelector('[aria-selected="true"]');y&&y.scrollIntoView?.({block:"nearest"});const q=e.ownerDocument.activeElement;if(q&&e.contains(q))return;const M=e.querySelector("input, textarea"),A=e.querySelector('[role="option"]');(M??y??A)?.focus()},[]),B=e=>{e.key==="ArrowDown"||e.key==="Enter"||e.key===" "?o||(e.preventDefault(),t?.(!0)):e.key==="Escape"&&o&&(e.preventDefault(),t?.(!1))};function k(e){return D&&e.prefix?`${e.prefix} · ${e.label}`:e.label}function z(){return r?v?v(r):k(r):l}const L=r&&!v&&P?k(r):void 0;return i.jsxs("div",{ref:O,className:b(a.selector,I),...j,children:[i.jsxs("button",{ref:g,type:"button",className:b(a.trigger,f&&a.inlineTrigger),"aria-haspopup":"listbox","aria-expanded":o,"aria-label":w,onClick:()=>t?.(!o),onKeyDown:B,children:[u&&i.jsx("span",{className:a.triggerPrefix,children:u}),S&&r?.icon&&i.jsx(R,{name:r.icon,size:"sm",className:a.triggerIcon,style:r.iconColor?{"--selector-icon-color":r.iconColor}:void 0}),i.jsx("span",{ref:E,className:a.label,title:L,children:z()}),C&&i.jsx(R,{name:f?"expand_more":"unfold_more",size:f?"sm":"md",className:a.chevron})]}),o&&i.jsx("div",{ref:V,role:"presentation",className:b(a.dropdown,_==="end"&&a.dropdownEnd),onKeyDown:e=>{e.key==="Escape"&&!e.defaultPrevented&&(e.preventDefault(),t?.(!1),g.current?.focus())},children:i.jsx(K,{options:n,value:c,"aria-label":w??"Options",header:d,emptyState:N,renderOptionIndicator:h,action:p?{...p,onClick:()=>{p.onClick(),t?.(!1)}}:void 0,onSelect:e=>{m?.(e),t?.(!1),g.current?.focus()}})})]})});x.displayName="Selector";x.__docgenInfo={description:"",methods:[],displayName:"Selector",props:{options:{required:!0,tsType:{name:"union",raw:`| readonly DotOption[]
| readonly IconOption[]
| readonly PrefixOption[]`,elements:[{name:"unknown"},{name:"unknown"},{name:"unknown"}]},description:""},value:{required:!1,tsType:{name:"string"},description:""},onValueChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(value: string) => void",signature:{arguments:[{type:{name:"string"},name:"value"}],return:{name:"void"}}},description:""},open:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},onOpenChange:{required:!1,tsType:{name:"signature",type:"function",raw:"(open: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"open"}],return:{name:"void"}}},description:""},placeholder:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:"'Select\\u2026'",computed:!1}},triggerPrefix:{required:!1,tsType:{name:"ReactNode"},description:""},header:{required:!1,tsType:{name:"ReactNode"},description:""},emptyState:{required:!1,tsType:{name:"ReactNode"},description:""},action:{required:!1,tsType:{name:"Readonly",elements:[{name:"signature",type:"object",raw:`{
  label: string;
  icon: IconName;
  onClick: () => void;
}`,signature:{properties:[{key:"label",value:{name:"string",required:!0}},{key:"icon",value:{name:"unknown",required:!0}},{key:"onClick",value:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}},required:!0}}]}}],raw:`Readonly<{
  label: string;
  icon: IconName;
  onClick: () => void;
}>`},description:""},dropdownAlign:{required:!1,tsType:{name:"union",raw:"'stretch' | 'end'",elements:[{name:"literal",value:"'stretch'"},{name:"literal",value:"'end'"}]},description:"",defaultValue:{value:"'stretch'",computed:!1}},variant:{required:!1,tsType:{name:"union",raw:"'default' | 'inline'",elements:[{name:"literal",value:"'default'"},{name:"literal",value:"'inline'"}]},description:"",defaultValue:{value:"'default'",computed:!1}},showChevron:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"true",computed:!1}},renderTriggerLabel:{required:!1,tsType:{name:"signature",type:"function",raw:"(option: SelectorOption) => ReactNode",signature:{arguments:[{type:{name:"union",raw:"DotOption | IconOption | PrefixOption",elements:[{name:"intersection",raw:`OptionBase & {
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
}`,signature:{properties:[{key:"prefix",value:{name:"string",required:!0}},{key:"icon",value:{name:"never",required:!1}},{key:"iconColor",value:{name:"never",required:!1}}]}}]}]},name:"option"}],return:{name:"ReactNode"}}},description:""},renderOptionIndicator:{required:!1,tsType:{name:"signature",type:"function",raw:"(option: SelectorOption) => ReactNode",signature:{arguments:[{type:{name:"union",raw:"DotOption | IconOption | PrefixOption",elements:[{name:"intersection",raw:`OptionBase & {
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
}`,signature:{properties:[{key:"prefix",value:{name:"string",required:!0}},{key:"icon",value:{name:"never",required:!1}},{key:"iconColor",value:{name:"never",required:!1}}]}}]}]},name:"option"}],return:{name:"ReactNode"}}},description:""}},composes:["HTMLAttributes"]};export{x as S};
