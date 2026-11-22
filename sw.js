const V='shf360-v1';
const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-180.png','icon-maskable-512.png'];
const EXT=['https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js','https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{
  const c=await caches.open(V);
  try{await c.addAll(CORE)}catch(_){}
  for(const u of EXT){try{await c.put(u,await fetch(u,{mode:'no-cors'}))}catch(_){}}
  self.skipWaiting();
})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
  for(const k of await caches.keys())if(k!==V)await caches.delete(k);
  await clients.claim();
})())});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  e.respondWith((async()=>{
    const c=await caches.open(V);
    const hit=await c.match(r);
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(()=>null);
    if(hit){try{e.waitUntil(net)}catch(_){}return hit}
    return (await net)||(r.mode==='navigate'?await c.match('index.html'):Response.error());
  })());
});
