(()=>{"use strict";
const K="pixellink.v1",$=s=>document.querySelector(s),DEF=["WORK","TOOLS","RESEARCH","MUSIC","INSPIRATION","OTHER"];
let S={links:[],cats:[],threads:[],stacks:[],opts:{lookup:true,theme:"graphite"}},V={t:"all",id:null},ST="ALL",Q="";
try{const d=JSON.parse(localStorage.getItem(K));if(d&&Array.isArray(d.links))S=Object.assign(S,d,{opts:Object.assign(S.opts,d.opts)})}catch(e){}
const save=()=>{try{localStorage.setItem(K,JSON.stringify(S))}catch(e){toast("STORAGE FULL — EXPORT NOW")}};
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7),cats=()=>[...DEF,...S.cats];
const dlg=$("#dlg");let tt;
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),1800)}
function norm(raw){raw=raw.trim();if(!raw||/\s/.test(raw))return null;if(!/^[a-z][a-z0-9+.-]*:/i.test(raw)){if(/^[^/]*[.:]/.test(raw)||/^localhost/i.test(raw))raw="https://"+raw;else return null}
try{const u=new URL(raw);if(!/^https?:$/.test(u.protocol)||!u.hostname)return null;return u.href}catch(e){return null}}
const host=u=>new URL(u).hostname.replace(/^www\./,"");
const fmt=t=>new Date(t).toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"}).toUpperCase();
const inSet=(c,id)=>c.linkIds.includes(id);
function visible(){let a=S.links.slice();
if(V.t==="cat")a=a.filter(l=>l.cat===V.id);
if(V.t==="stack"){const s=S.stacks.find(x=>x.id===V.id);a=s?a.filter(l=>inSet(s,l.id)):[]}
if(V.t==="thread"){const s=S.threads.find(x=>x.id===V.id);a=s?s.linkIds.map(i=>S.links.find(l=>l.id===i)).filter(Boolean):[]}
if(ST==="ALL")a=a.filter(l=>l.state!=="ARCHIVED");else a=a.filter(l=>l.state===ST);
if(Q){const q=Q.toLowerCase().split(/\s+/);a=a.filter(l=>{const h=[l.name,l.title,l.domain,l.url,l.cat,l.note].join(" ").toLowerCase();return q.every(w=>h.includes(w))})}
if(V.t!=="thread")a.sort((x,y)=>y.at-x.at);return a}
function side(){const cnt=f=>S.links.filter(f).length,live=l=>l.state!=="ARCHIVED",nav=(t,id,n,c)=>`<button class="nav${V.t===t&&V.id===id?" on":""}" data-t="${t}" data-id="${esc(id||"")}">${esc(n)}<i>${c}</i></button>`;
$("#side").innerHTML=`<h3>LIBRARY</h3><div class="grp">${nav("all",null,"ALL",cnt(live))}${cats().map(c=>nav("cat",c,c,cnt(l=>l.cat===c&&live(l)))).join("")}</div>
<h3>STACKS <button data-new="stack" aria-label="New stack">+ NEW</button></h3><div class="grp">${S.stacks.map(s=>nav("stack",s.id,s.name,s.linkIds.length)).join("")}</div>
<h3>THREADS <button data-new="thread" aria-label="New thread">+ NEW THREAD</button></h3><div class="grp">${S.threads.map(s=>nav("thread",s.id,s.name,s.linkIds.length)).join("")}</div>`}
function row(l,i,th,c){const fav=`<span class="fav">${esc((l.name||"?")[0].toUpperCase())}</span>`;
const mem=[...S.stacks.filter(s=>inSet(s,l.id)).map(s=>"▪ "+s.name),...S.threads.filter(s=>inSet(s,l.id)).map(s=>"⟶ "+s.name)];
return`<article class="row" role="listitem" data-id="${l.id}"><div class="n">${String(i+1).padStart(2,"0")}</div><div class="fav" data-fav="${esc(l.domain)}">${fav}</div>
<div><div class="nm">${esc(l.name)}</div><div class="ti">${esc(l.title||l.domain)}</div><div class="dm">${esc(l.domain)}</div>${l.note?`<div class="nt">${esc(l.note)}</div>`:""}
<div class="tags"><span class="tag">${esc(l.cat)}</span><span class="tag">${fmt(l.at)}</span>${l.state!=="KEEP"?`<span class="tag${l.state==="UNREAD"?" s":""}">${l.state}</span>`:`<span class="tag s">KEEP</span>`}${mem.map(m=>`<span class="tag">${esc(m)}</span>`).join("")}</div></div>
<div class="act"><a class="btn pri" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer" data-open>OPEN</a><button class="a" data-a="copy">COPY</button><button class="a" data-a="edit">EDIT</button><button class="a" data-a="add">+ GROUP</button>
${th?`<button class="a" data-a="up" aria-label="Move up">↑</button><button class="a" data-a="dn" aria-label="Move down">↓</button><button class="a" data-a="rm">REMOVE</button>`:""}<button class="a danger" data-a="del">DELETE</button></div></article>`}
function render(){side();const cur=V.t==="stack"?S.stacks.find(x=>x.id===V.id):V.t==="thread"?S.threads.find(x=>x.id===V.id):null;if(V.t!=="all"&&V.t!=="cat"&&!cur)V={t:"all",id:null};
const L=visible(),th=V.t==="thread";
$("#vt").innerHTML=(V.t==="all"?"ALL LINKS":V.t==="cat"?V.id:(th?"THREAD · ":"STACK · ")+esc(cur.name))+` · ${L.length}`+(cur?`<button class="ghost" data-g="fill">ADD LINKS</button><button class="ghost" data-g="ren">RENAME</button><button class="ghost" data-g="drop">DELETE ${th?"THREAD":"STACK"}</button>`:"");
$("#states").innerHTML=["ALL","UNREAD","KEEP","ARCHIVED"].map(s=>`<button class="chip${ST===s?" on":""}" data-st="${s}">${s}</button>`).join("");
$("#cat").innerHTML=cats().map(c=>`<option${c===(V.t==="cat"?V.id:$("#cat").value||"OTHER")?" selected":""}>${esc(c)}</option>`).join("");
$("#list").className=th?"thread":"";
$("#list").innerHTML=L.length?L.map((l,i)=>row(l,i,th)).join(""):(S.links.length&&(Q||V.t!=="all"||ST!=="ALL")?`<div class="empty"><b>NOTHING MATCHES</b><span>Clear the search or switch view.</span></div>`:`<div class="empty"><b>NO LINKS YET</b><span>Paste your first URL above.</span></div>`);
document.documentElement.dataset.theme=S.opts.theme;
document.querySelectorAll("[data-fav]").forEach(e=>{const im=new Image(16,16);im.alt="";im.referrerPolicy="no-referrer";im.onload=()=>{e.innerHTML="";e.appendChild(im)};im.src="https://www.google.com/s2/favicons?sz=32&domain="+encodeURIComponent(e.dataset.fav)})}
async function lookup(l){if(!S.opts.lookup)return;const ac=new AbortController(),to=setTimeout(()=>ac.abort(),6000);
try{const r=await fetch("https://api.microlink.io/?url="+encodeURIComponent(l.url),{signal:ac.signal});const j=await r.json();const d=j&&j.data;if(d){const x=S.links.find(z=>z.id===l.id);if(x){if(d.title&&!x.edited)x.title=String(d.title).slice(0,300);if(d.publisher&&!x.edited)x.name=String(d.publisher).slice(0,60);save();render()}}}catch(e){}finally{clearTimeout(to)}}
function add(raw){const u=norm(raw);if(!u){toast("NOT A VALID HTTP/HTTPS URL");return false}
const ex=S.links.find(l=>l.url===u);if(ex){V={t:"all",id:null};ST="ALL";Q="";$("#q").value="";render();const e=document.querySelector(`[data-id="${ex.id}"]`);if(e){e.classList.add("flash");e.scrollIntoView({block:"center"})}toast("ALREADY SAVED");return true}
const d=host(u),l={id:uid(),url:u,domain:d,name:d.split(".").slice(-2,-1)[0]?.replace(/^./,c=>c.toUpperCase())||d,title:"",note:"",cat:$("#cat").value||"OTHER",state:"UNREAD",at:Date.now()};
S.links.push(l);const g=V.t==="stack"?S.stacks.find(x=>x.id===V.id):V.t==="thread"?S.threads.find(x=>x.id===V.id):null;if(g)g.linkIds.push(l.id);save();render();toast("SAVED");lookup(l);return true}
function ask(title,val,cb){dlg.innerHTML=`<form method="dialog"><h4>${title}</h4><label for="f">NAME</label><input type="text" id="f" maxlength="40" value="${esc(val)}" autocomplete="off"><div class="foot"><button class="btn" value="x">CANCEL</button><button class="btn pri" value="ok">DONE</button></div></form>`;dlg.showModal();$("#f").select();dlg.onclose=()=>{if(dlg.returnValue==="ok"&&$("#f")?.value.trim())cb($("#f").value.trim().toUpperCase())}}
function picker(g,kind){const list=S.links.filter(l=>l.state!=="ARCHIVED"||inSet(g,l.id));
dlg.innerHTML=`<form method="dialog"><h4>${kind} · ${esc(g.name)}</h4>${list.map(l=>`<label class="pick"><input type="checkbox" value="${l.id}"${inSet(g,l.id)?" checked":""}><span>${esc(l.name)} — ${esc(l.title||l.domain)}</span></label>`).join("")||"<p class='dm'>Save some links first.</p>"}<div class="foot"><button class="btn" value="x">CANCEL</button><button class="btn pri" value="ok">DONE</button></div></form>`;dlg.showModal();
dlg.onclose=()=>{if(dlg.returnValue!=="ok")return;const on=[...dlg.querySelectorAll("input:checked")].map(i=>i.value),keep=g.linkIds.filter(i=>on.includes(i));g.linkIds=[...keep,...on.filter(i=>!keep.includes(i))];save();render()}}
function groupMenu(l){const grp=(a,k)=>a.map(g=>`<label class="pick"><input type="checkbox" data-k="${k}" value="${g.id}"${inSet(g,l.id)?" checked":""}><span>${k==="s"?"STACK":"THREAD"} · ${esc(g.name)}</span></label>`).join("");
dlg.innerHTML=`<form method="dialog"><h4>ADD TO…</h4>${grp(S.stacks,"s")}${grp(S.threads,"t")}${S.stacks.length+S.threads.length?"":"<p class='dm'>Create a Stack or Thread from the sidebar first.</p>"}<div class="foot"><button class="btn" value="x">CANCEL</button><button class="btn pri" value="ok">DONE</button></div></form>`;dlg.showModal();
dlg.onclose=()=>{if(dlg.returnValue!=="ok")return;dlg.querySelectorAll("input[data-k]").forEach(i=>{const g=(i.dataset.k==="s"?S.stacks:S.threads).find(x=>x.id===i.value),h=inSet(g,l.id);if(i.checked&&!h)g.linkIds.push(l.id);if(!i.checked&&h)g.linkIds=g.linkIds.filter(z=>z!==l.id)});save();render()}}
function edit(l){dlg.innerHTML=`<form method="dialog"><h4>EDIT LINK</h4><label>NAME</label><input type="text" id="e1" value="${esc(l.name)}"><label>TITLE</label><input type="text" id="e2" value="${esc(l.title)}"><label>URL</label><input type="text" id="e3" value="${esc(l.url)}"><label>NOTE</label><textarea id="e4">${esc(l.note)}</textarea>
<label>CATEGORY</label><select id="e5">${cats().map(c=>`<option${c===l.cat?" selected":""}>${esc(c)}</option>`).join("")}</select><label>STATE</label><select id="e6">${["UNREAD","KEEP","ARCHIVED"].map(c=>`<option${c===l.state?" selected":""}>${c}</option>`).join("")}</select><div class="foot"><button class="btn" value="x">CANCEL</button><button class="btn pri" value="ok">SAVE</button></div></form>`;dlg.showModal();
dlg.onclose=()=>{if(dlg.returnValue!=="ok")return;const u=norm($("#e3").value);if(!u)return toast("INVALID URL — NOT CHANGED");Object.assign(l,{name:$("#e1").value.trim()||l.name,title:$("#e2").value.trim(),url:u,domain:host(u),note:$("#e4").value.trim(),cat:$("#e5").value,state:$("#e6").value,edited:true});save();render()}}
function del(id){S.links=S.links.filter(l=>l.id!==id);[...S.stacks,...S.threads].forEach(g=>g.linkIds=g.linkIds.filter(i=>i!==id));save();render();toast("DELETED")}
function settings(){dlg.innerHTML=`<form method="dialog"><h4>SETTINGS</h4><label>APPEARANCE</label><div class="set">${["graphite","black","paper"].map(t=>`<button type="button" class="chip${S.opts.theme===t?" on":""}" data-th="${t}">${t.toUpperCase()}</button>`).join("")}</div>
<label>TITLE LOOKUP</label><div class="set"><button type="button" class="chip${S.opts.lookup?" on":""}" data-lk="1">ON</button><button type="button" class="chip${S.opts.lookup?"":" on"}" data-lk="0">OFF</button></div><p class="dm" style="margin-top:6px">ON sends the saved URL to microlink.io to fetch the title. OFF keeps everything on-device.</p>
<label>CATEGORIES</label><div class="set">${S.cats.map(c=>`<button type="button" class="chip" data-rc="${esc(c)}">${esc(c)} ×</button>`).join("")}<button type="button" class="chip" data-ac="1">+ ADD</button></div>
<label>DATA</label><div class="set"><button type="button" class="btn" data-x="exp">EXPORT DATA</button><button type="button" class="btn" data-x="imp">IMPORT DATA</button><button type="button" class="btn danger" data-x="clr">CLEAR LOCAL DATA</button></div><input type="file" id="imf" accept=".json,application/json" hidden>
<div class="foot"><button class="btn pri" value="x">CLOSE</button></div></form>`;if(!dlg.open)dlg.showModal();dlg.onclose=null}
dlg.addEventListener("click",e=>{const b=e.target.closest("button"),t=e.target;if(t===dlg)return dlg.close("x");if(!b)return;
if(b.dataset.th){S.opts.theme=b.dataset.th;save();render();settings()}
if(b.dataset.lk){S.opts.lookup=b.dataset.lk==="1";save();settings()}
if(b.dataset.rc){S.cats=S.cats.filter(c=>c!==b.dataset.rc);S.links.forEach(l=>{if(l.cat===b.dataset.rc)l.cat="OTHER"});save();render();settings()}
if(b.dataset.ac)ask("NEW CATEGORY","",n=>{if(!cats().includes(n)){S.cats.push(n);save();render()}settings()});
if(b.dataset.x==="exp"){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify({app:"pixel-link",v:1,exported:new Date().toISOString(),links:S.links,cats:S.cats,threads:S.threads,stacks:S.stacks},null,2)],{type:"application/json"}));a.download="pixel-link-"+new Date().toISOString().slice(0,10)+".json";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),999);toast("EXPORTED")}
if(b.dataset.x==="imp")$("#imf").click();
if(b.dataset.x==="clr"&&confirm("Delete ALL links, stacks and threads on this device? Export first if unsure.")){S.links=[];S.cats=[];S.threads=[];S.stacks=[];save();render();dlg.close();toast("CLEARED")}});
dlg.addEventListener("change",e=>{if(e.target.id!=="imf")return;const f=e.target.files[0];if(!f)return;f.text().then(t=>{const d=JSON.parse(t);if(!d||!Array.isArray(d.links))throw 0;let n=0;const have=new Set(S.links.map(l=>l.url));
d.links.forEach(l=>{const u=norm(String(l.url||""));if(!u||have.has(u))return;have.add(u);n++;S.links.push({id:String(l.id||uid()),url:u,domain:host(u),name:String(l.name||host(u)),title:String(l.title||""),note:String(l.note||""),cat:String(l.cat||"OTHER"),state:["UNREAD","KEEP","ARCHIVED"].includes(l.state)?l.state:"KEEP",at:+l.at||Date.now()})});
const ids=new Set(S.links.map(l=>l.id)),mg=(a,b)=>(b||[]).forEach(g=>{if(!g||!g.name)return;let x=a.find(z=>z.id===g.id||z.name===g.name);if(!x)a.push(x={id:String(g.id||uid()),name:String(g.name),linkIds:[]});(g.linkIds||[]).forEach(i=>{if(ids.has(i)&&!x.linkIds.includes(i))x.linkIds.push(i)})});
mg(S.stacks,d.stacks);mg(S.threads,d.threads);(d.cats||[]).forEach(c=>{c=String(c).toUpperCase();if(!cats().includes(c))S.cats.push(c)});S.links.forEach(l=>{if(!cats().includes(l.cat))S.cats.push(l.cat)});save();render();toast(n+" LINKS IMPORTED")}).catch(()=>toast("NOT A PIXEL LINK EXPORT"))});
$("#gear").onclick=settings;
$("#url").addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.value.trim()){if(add(e.target.value))e.target.value=""}});
$("#url").addEventListener("paste",e=>{const t=(e.clipboardData.getData("text")||"").trim();if(norm(t)&&!/\n/.test(t)&&!e.target.value){/* leave pasted text visible; Enter commits */}});
$("#q").oninput=e=>{Q=e.target.value.trim();render()};
document.addEventListener("keydown",e=>{const typing=/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
if(e.key==="/"&&!typing&&!dlg.open){e.preventDefault();$("#q").focus()}
if(e.key==="Escape"&&document.activeElement===$("#q")){$("#q").value="";Q="";render();$("#url").focus()}
if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="v"&&!typing&&!dlg.open)$("#url").focus()});
document.addEventListener("click",e=>{const b=e.target.closest("button");if(!b||dlg.contains(b))return;
if(b.dataset.t){V={t:b.dataset.t,id:b.dataset.id||null};render()}
if(b.dataset.new){const k=b.dataset.new;ask(k==="stack"?"NEW STACK":"NEW THREAD","",n=>{const g={id:uid(),name:n,linkIds:[]};S[k+"s"].push(g);V={t:k,id:g.id};save();render();picker(g,k.toUpperCase())})}
if(b.dataset.st){ST=b.dataset.st;render()}
if(b.dataset.g){const g=(V.t==="stack"?S.stacks:S.threads).find(x=>x.id===V.id),k=V.t==="stack"?"STACK":"THREAD";
if(b.dataset.g==="fill")picker(g,k);if(b.dataset.g==="ren")ask("RENAME",g.name,n=>{g.name=n;save();render()});
if(b.dataset.g==="drop"&&confirm("Delete this "+k.toLowerCase()+"? The links themselves are kept.")){S[V.t+"s"]=S[V.t+"s"].filter(x=>x!==g);V={t:"all",id:null};save();render()}}
if(b.dataset.a){const r=b.closest(".row"),l=S.links.find(x=>x.id===r.dataset.id),a=b.dataset.a;
if(a==="copy")navigator.clipboard.writeText(l.url).then(()=>toast("URL COPIED"),()=>toast("COPY BLOCKED"));
if(a==="edit")edit(l);if(a==="add")groupMenu(l);if(a==="del")del(l.id);
if(a==="rm"||a==="up"||a==="dn"){const g=S.threads.find(x=>x.id===V.id),i=g.linkIds.indexOf(l.id),j=a==="up"?i-1:i+1;
if(a==="rm")g.linkIds.splice(i,1);else if(j>=0&&j<g.linkIds.length)[g.linkIds[i],g.linkIds[j]]=[g.linkIds[j],g.linkIds[i]];save();render()}}});
document.addEventListener("click",e=>{const a=e.target.closest("[data-open]");if(a){const l=S.links.find(x=>x.id===a.closest(".row").dataset.id);if(l&&l.state==="UNREAD"){l.state="KEEP";save();setTimeout(render,50)}}});
render();if("serviceWorker"in navigator&&location.protocol.startsWith("http"))navigator.serviceWorker.register("sw.js").catch(()=>{});
})();
