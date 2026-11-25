const V="tasmi-shell-v3";
const SHELL=["./","index.html","manifest.webmanifest","4-icon-192.png","5-icon-512.png","data/6-quran.json","data/7-nawawi.json","data/8-tafsir_muyassar.json","data/9-trans_en_sahih.json","data/adhkar.json"];
const RUNTIME=["cdn.jsdelivr.net","fonts.googleapis.com","fonts.gstatic.com","api.alquran.cloud"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("tasmi-shell")&&k!=V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!="GET")return;
  const u=new URL(r.url);
  if(u.origin==location.origin){
    if(r.mode=="navigate"||u.pathname.endsWith("/")||u.pathname.endsWith("index.html")){e.respondWith(fetch(r,{cache:"no-cache"}).then(x=>{if(x.ok){const y=x.clone();caches.open(V).then(c=>c.put("index.html",y))}return x}).catch(()=>caches.match("index.html")));return}
    e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(x=>{if(x.ok){const y=x.clone();caches.open(V).then(c=>c.put(r,y))}return x}).catch(()=>r.mode=="navigate"?caches.match("index.html"):Response.error())));
    return;
  }
  if(RUNTIME.includes(u.hostname)){
    e.respondWith(caches.open(V+"-rt").then(async c=>{const m=await c.match(r);if(m)return m;try{const x=await fetch(r);if(x.ok||x.type=="opaque")c.put(r,x.clone());return x}catch(err){return Response.error()}}));
  }
});
