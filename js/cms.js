/* CMS: admin overrides in localStorage (bw_cms_v1) */
(()=>{
const KEY='bw_cms_v1';
const DEF_SETTINGS={minPlay:1000,siteName:'BrodyBet',adminPassHash:null};
function loadRaw(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch{return{}}}
function saveRaw(o){localStorage.setItem(KEY,JSON.stringify(o))}
function hashSync(s){let h=5381;for(const ch of String(s))h=((h<<5)+h+ch.charCodeAt(0))|0;return 's:'+(h>>>0).toString(16)}

window.CMS={
 KEY,
 defaultPass:'brodyadmin',
 hash:hashSync,
 load(){const o=loadRaw();
  if(!o.settings)o.settings={...DEF_SETTINGS};
  if(!o.settings.adminPassHash)o.settings.adminPassHash=hashSync(this.defaultPass);
  if(!Array.isArray(o.promotions))o.promotions=null;
  if(!Array.isArray(o.payments))o.payments=null;
  if(!Array.isArray(o.games))o.games=null;
  return o},
 save(o){saveRaw(o)},
 snapshot(C){if(!window.CATALOG_BASE)window.CATALOG_BASE=JSON.parse(JSON.stringify(C))},
 applyToCatalog(C){
  this.snapshot(C);
  const base=window.CATALOG_BASE,o=this.load();
  const out={...base,providers:base.providers,sports:base.sports,faq:base.faq};
  if(o.promotions)out.promotions=o.promotions.filter(p=>p&&p.active!==false);
  else out.promotions=(base.promotions||[]).map(p=>({...p,active:p.active!==false}));
  if(o.payments)out.payments=o.payments.filter(p=>p&&p.active!==false);
  else out.payments=(base.payments||[]).map(p=>({...p,active:true}));
  if(o.games){
   const map=new Map(o.games.map(g=>[g.id,g]));
   out.games=(base.games||[]).map(g=>({...g,...(map.get(g.id)||{})})).filter(g=>g.active!==false);
   o.games.filter(g=>g&&!(base.games||[]).some(x=>x.id===g.id)&&g.active!==false).forEach(g=>out.games.push(g));
  }else out.games=(base.games||[]).map(g=>({...g,active:g.active!==false}));
  out.settings={...DEF_SETTINGS,...(o.settings||{})};
  return out},
 getAllPromotions(C){const o=this.load();return o.promotions||(C.promotions||[]).map(p=>({...p,active:true}))},
 getAllPayments(C){const o=this.load();return o.payments||(C.payments||[]).map(p=>({...p,active:true}))},
 getAllGames(C){const o=this.load();if(o.games){const map=new Map(o.games.map(g=>[g.id,g]));return (C.games||[]).map(g=>({...g,...(map.get(g.id)||{})}))}return (C.games||[]).map(g=>({...g,active:true}))},
 setPromotions(list){const o=this.load();o.promotions=list;this.save(o)},
 setPayments(list){const o=this.load();o.payments=list;this.save(o)},
 setGames(list){const o=this.load();o.games=list;this.save(o)},
 setSettings(s){const o=this.load();o.settings={...o.settings,...s};this.save(o)},
 checkAdmin(pass){const o=this.load();return o.settings.adminPassHash===hashSync(pass)},
 setAdminPass(pass){this.setSettings({adminPassHash:hashSync(pass)})},
 seedFromCatalog(C){const o=this.load();let changed=false;
  if(!o.promotions){o.promotions=(C.promotions||[]).map(p=>({...p,active:true}));changed=true}
  if(!o.payments){o.payments=(C.payments||[]).map(p=>({...p,active:true}));changed=true}
  if(changed)this.save(o);return o}
};
})();
