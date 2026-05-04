import{w as d}from"./decorators-zVX3PuHo.js";import{r as u,d as n,m as h}from"./iframe-Dh8KDhUC.js";import{j as o}from"./jsx-runtime-u17CrQMm.js";import{c as f}from"./cn-2dOUpm6k.js";import{S as w}from"./SearchInput-C_dcOvCc.js";import"./preload-helper-BiPwfwAp.js";import"./Icon-vWsfamG2.js";const g="_positioner_7z1tf_1",S="_bar_7z1tf_14",_="_searchInput_7z1tf_35",s={positioner:g,bar:S,searchInput:_},a=u.forwardRef(({shortcutHint:i,onClear:p,className:c,...m},l)=>o.jsx("div",{className:s.positioner,children:o.jsx("div",{className:f(s.bar,c),children:o.jsx(w,{ref:l,shortcutHint:i,onClear:p,className:s.searchInput,...m})})}));a.displayName="FloatingSearch";a.__docgenInfo={description:"",methods:[],displayName:"FloatingSearch",props:{shortcutHint:{required:!1,tsType:{name:"string"},description:""},onClear:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""}},composes:["Omit"]};const j={title:"Components/FloatingSearch",component:a,tags:["autodocs"],parameters:{layout:"fullscreen"}},r={parameters:{viewport:{options:n}},args:{placeholder:"Search tasks...",shortcutHint:"⌘K"}},e={parameters:{viewport:{options:n}},args:{placeholder:"Search tasks..."}},t={args:{placeholder:"Search tasks...",shortcutHint:"⌘K"},decorators:[d("mobile")],parameters:{viewport:{options:h}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      options: desktopViewports
    }
  },
  args: {
    placeholder: 'Search tasks...',
    shortcutHint: '⌘K'
  }
}`,...r.parameters?.docs?.source}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      options: desktopViewports
    }
  },
  args: {
    placeholder: 'Search tasks...'
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    placeholder: 'Search tasks...',
    shortcutHint: '⌘K'
  },
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions
    }
  }
}`,...t.parameters?.docs?.source}}};const H=["Default","WithoutShortcut","MobileViewport"];export{r as Default,t as MobileViewport,e as WithoutShortcut,H as __namedExportsOrder,j as default};
