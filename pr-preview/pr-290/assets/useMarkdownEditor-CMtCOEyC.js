import{r as a}from"./iframe-B2m80BDd.js";import{a as R}from"./applyMarkdownAction-ByhkuwHx.js";function E(t){return t.replace(/[\r\n]+/g," ").replace(/[\\[\]]/g,"\\$&")}function v(t){const o=t.replace(/\.[^./\\]+$/,"")||t;return E(o)}function x(t,o,u){const c=t.indexOf(o);return c===-1?t:t.slice(0,c)+u+t.slice(c+o.length)}function M({value:t,setValue:o,onImageUpload:u}){const c=a.useRef(null),d=a.useRef(null),S=a.useRef(0),[h,g]=a.useState(0);a.useLayoutEffect(()=>{const s=d.current,e=c.current;s&&e&&(e.focus(),e.setSelectionRange(s[0],s[1]),d.current=null)},[t]);const w=s=>{const e=c.current;if(!e)return;const i=R(s,{value:e.value,selectionStart:e.selectionStart,selectionEnd:e.selectionEnd});d.current=[i.selectionStart,i.selectionEnd],o(i.value)},C=s=>{if(s.length===0||!u)return;const e=s.map(n=>({file:n,placeholder:`![Uploading ${E(n.name)}…](#uploading-${++S.current})`})),i=e.map(n=>n.placeholder).join(`
`),l=c.current;if(l){const{selectionStart:n,selectionEnd:p}=l,f=`${n>0&&l.value[n-1]!==`
`?`
`:""}${i}
`,$=n+f.length;d.current=[$,$],o(l.value.slice(0,n)+f+l.value.slice(p))}else o(n=>`${n}${n&&!n.endsWith(`
`)?`
`:""}${i}
`);e.forEach(({file:n,placeholder:p})=>{g(r=>r+1),Promise.resolve(u(n)).then(r=>o(f=>x(f,p,r?`![${v(n.name)}](${r})`:"")),()=>o(r=>x(r,p,""))).finally(()=>g(r=>r-1))})},m=t.trim();return{wordCount:m===""?0:m.split(/\s+/).length,isUploading:h>0,textareaRef:c,applyAction:w,insertImageFiles:C}}export{M as u};
