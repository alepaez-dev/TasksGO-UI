const a=/^(javascript|data|vbscript):/i,i=/[\x00-\x1f]/g;function n(t){const s=t.replace(i,"").trim();return a.test(s)?"#":t}export{n as s};
