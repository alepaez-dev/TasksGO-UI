import{Q as p}from"./QaEnvironmentCard-BHSvcjaZ.js";import{w as n}from"./decorators-CCFezws7.js";import{m as i}from"./iframe-CVzZUVgi.js";import"./jsx-runtime-u17CrQMm.js";import"./cn-2dOUpm6k.js";import"./useMediaQuery-C7UWylNC.js";import"./useFocusTrap-H4iKmxTn.js";import"./index-CGWiBLQm.js";import"./index-DBHJ8Tvt.js";import"./Icon-DkRXASfo.js";import"./StatusDot-EVGLS6Xo.js";import"./BottomSheet-DOjjdkKr.js";import"./OptionList-B466bZYL.js";import"./Selector-ixEl-OEV.js";import"./Button-fZic1x_i.js";import"./preload-helper-ArQRg3DF.js";const r=[{value:"qa1",label:"QA-01",reviewStatus:"In review",lastDeployment:"24 mins ago",healthVariant:"high",pipelineLabel:"Unstable",pipelineVariant:"high"},{value:"qa2",label:"QA-02",reviewStatus:"Reviewed",lastDeployment:"2 hours ago",healthVariant:"active",pipelineLabel:"Stable",pipelineVariant:"active"},{value:"staging",label:"STAGING",reviewStatus:"Pending check",lastDeployment:"1 day ago",healthVariant:"active",pipelineLabel:"Healthy",pipelineVariant:"active"}],k={title:"Components/QaEnvironmentCard",component:p,tags:["autodocs"],argTypes:{activeValue:{control:"select",options:r.map(s=>s.value)},switcherOpen:{control:"boolean"},environments:{control:!1},wideSelectorRef:{control:!1},onValueChange:{control:!1},onSwitcherOpenChange:{control:!1},promote:{control:!1},onManageEnvironments:{control:!1}},args:{environments:r,activeValue:"qa1",onValueChange:()=>{},switcherOpen:!1,onSwitcherOpenChange:()=>{},promote:{label:"Promote to Staging",onClick:()=>{}},onManageEnvironments:()=>{}}},e={},o={args:{promote:void 0}},t={decorators:[n("mobile")],parameters:{viewport:{options:i}}},a={decorators:[n("mobile")],parameters:{viewport:{options:i}},args:{switcherOpen:!0}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:"{}",...e.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    promote: undefined
  }
}`,...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions
    }
  }
}`,...t.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  decorators: [withDefaultViewport('mobile')],
  parameters: {
    viewport: {
      options: mobileViewportOptions
    }
  },
  args: {
    switcherOpen: true
  }
}`,...a.parameters?.docs?.source}}};const y=["Default","NoPromote","Stacked","StackedSheetOpen"];export{e as Default,o as NoPromote,t as Stacked,a as StackedSheetOpen,y as __namedExportsOrder,k as default};
