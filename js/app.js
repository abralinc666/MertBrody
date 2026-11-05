(() => {
  const cfg = window.LOVELYTG_CONFIG;
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  let period = "monthly";
  const money = n => new Intl.NumberFormat("tr-TR").format(n) + " " + cfg.currency;

  function renderPlans(){
    const wrap = $("#plans");
    wrap.innerHTML = cfg.plans.map(p => `
      <article class="plan ${p.featured ? "featured" : ""}">
        ${p.featured ? '<span class="popular">EN ÇOK TERCİH EDİLEN</span>' : ""}
        <span class="plan-tag">${p.tag}</span><h3>${p.name}</h3><p class="plan-desc">${p.description}</p>
        <div class="price">${money(p.prices[period])}<small> ${cfg.periods[period].suffix}</small></div>
        <p class="price-note">${period === "yearly" ? "Yıllık lisans ücreti" : period === "weekly" ? "7 günlük lisans ücreti" : "Aylık lisans ücreti"}</p>
        <hr><ul>${p.features.map(f=>`<li>${f}</li>`).join("")}</ul>
        <button class="btn ${p.featured ? "btn-primary" : "btn-outline"} choose-plan" data-plan="${p.id}">Bu paketi seç <span>↗</span></button>
      </article>`).join("");
    const select = $("#orderPlan");
    const previous = select.value;
    select.innerHTML = cfg.plans.map(p=>`<option value="${p.id}">${p.name} — ${money(p.prices[period])} / ${cfg.periods[period].label}</option>`).join("");
    if(cfg.plans.some(p=>p.id===previous)) select.value=previous;
  }
  renderPlans();
  $$(".billing-switch button").forEach(btn=>btn.addEventListener("click",()=>{
    period=btn.dataset.period;
    $$(".billing-switch button").forEach(b=>b.classList.toggle("active",b===btn));
    renderPlans();
  }));
  $("#plans").addEventListener("click",e=>{
    const b=e.target.closest("[data-plan]"); if(!b)return;
    $("#orderPlan").value=b.dataset.plan; $("#order").scrollIntoView({behavior:"smooth"});
  });

  $("#bankName").textContent=cfg.bank.name;
  $("#ibanValue").textContent=cfg.bank.iban;
  $("#cryptoNetwork").textContent=cfg.crypto.network;
  $("#walletValue").textContent=cfg.crypto.wallet;
  $$(".payment-tabs button").forEach(btn=>btn.addEventListener("click",()=>{
    const crypto=btn.dataset.method==="crypto";
    $$(".payment-tabs button").forEach(b=>b.classList.toggle("active",b===btn));
    $("#ibanPanel").classList.toggle("hidden",crypto);
    $("#cryptoPanel").classList.toggle("hidden",!crypto);
  }));
  function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2200)}
  $$("[data-copy]").forEach(btn=>btn.addEventListener("click",async()=>{
    const value=btn.dataset.copy==="iban"?cfg.bank.iban:cfg.crypto.wallet;
    try{await navigator.clipboard.writeText(value);toast("Bilgi panoya kopyalandı.");}
    catch{toast("Kopyalama desteklenmiyor. Bilgiyi seçerek kopyalayın.");}
  }));
  $("#orderForm").addEventListener("submit",e=>{
    e.preventDefault();
    const data=new FormData(e.currentTarget);
    const p=cfg.plans.find(x=>x.id===data.get("plan"));
    const text=[
      "LOVELYTG LİSANS TALEBİ",
      "İsim: "+data.get("customer"),
      "İletişim: "+data.get("contact"),
      "Paket: "+p.name,
      "Süre: "+cfg.periods[period].label,
      "Tutar: "+money(p.prices[period]),
      "Ödeme: "+data.get("method"),
      "Not: "+(data.get("note")||"-")
    ].join("\n");
    $("#formResult").textContent="Talep metni hazırlandı. Kopyalayarak satış/yönetim ekibine iletebilirsin.\n\n"+text;
    if(navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(()=>toast("Talep metni kopyalandı.")).catch(()=>{});
  });
  $("#year").textContent=new Date().getFullYear();
  const menu=$("#menuToggle"), nav=$("#nav");
  menu.addEventListener("click",()=>{const open=nav.classList.toggle("open");menu.setAttribute("aria-expanded",String(open));});
  $$("#nav a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menu.setAttribute("aria-expanded","false")}));

  if(window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    gsap.from(".hero-copy > *",{y:24,opacity:0,duration:.8,stagger:.1,ease:"power3.out"});
    gsap.from(".dashboard",{y:35,opacity:0,rotateY:-10,duration:1.1,ease:"power3.out",delay:.2});
    gsap.utils.toArray(".feature-card,.steps article,.plan").forEach(el=>{
      gsap.from(el,{y:28,opacity:0,duration:.7,ease:"power2.out",scrollTrigger:undefined,
        onComplete:()=>{}});
    });
    // Simple IntersectionObserver reveal keeps GSAP optional and avoids ScrollTrigger dependency.
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){gsap.to(entry.target,{y:0,opacity:1,duration:.65,ease:"power2.out"});observer.unobserve(entry.target);}
    }),{threshold:.12});
    $$(".feature-card,.steps article,.plan,.section-head,.payment-panel,.order-form,.faq details").forEach(el=>{
      gsap.set(el,{y:22,opacity:0});observer.observe(el);
    });
    gsap.to(".float-card",{y:-9,duration:2,repeat:-1,yoyo:true,ease:"sine.inOut"});
  }
})();