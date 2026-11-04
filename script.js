// ODA Studio — GSAP + ScrollTrigger + Three.js (progressive enhancement)
(() => {
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = $('.site-header'), menu = $('.menu-toggle'), pre = $('.preloader');

  menu?.addEventListener('click', () => {
    const open = header.classList.toggle('nav-open');
    menu.setAttribute('aria-expanded', String(open));
  });
  $$('.desktop-nav a').forEach(a => a.addEventListener('click', () => {
    header.classList.remove('nav-open'); menu?.setAttribute('aria-expanded', 'false');
  }));

  if (!window.gsap || !window.ScrollTrigger || RM) {
    pre?.remove(); $$('.reveal').forEach(e => e.style.opacity = 1); return;
  }
  gsap.registerPlugin(ScrollTrigger);

  // Kelime bazlı maskeli metin bölücü (em / br yapısını korur)
  const split = el => {
    const walk = n => [...n.childNodes].forEach(c => {
      if (c.nodeType === 3) {
        const f = document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(t => {
          if (!t.trim()) return f.append(t);
          const o = document.createElement('span'), i = document.createElement('span');
          o.className = 'w'; i.className = 'wi'; i.textContent = t; o.append(i); f.append(o);
        });
        c.replaceWith(f);
      } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
    });
    walk(el); el.dataset.split = 1; return $$('.wi', el);
  };

  // Three.js: shader tabanlı hero görseli (fare dalgası + kromatik kayma) + toz parçacıkları
  const initGL = () => {
    const wrap = $('.hero-image-wrap'), img = $('img', wrap), hero = $('.hero');
    if (!window.THREE) return null;
    try {
      const r = new THREE.WebGLRenderer({alpha: true, antialias: true});
      r.setPixelRatio(Math.min(devicePixelRatio, 1.6));
      const cv = r.domElement; cv.className = 'hero-gl'; wrap.prepend(cv);
      const scene = new THREE.Scene(), cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
      const U = {uTex: {value: null}, uTime: {value: 0}, uHover: {value: 0}, uShift: {value: 0}, uZoom: {value: 1.12},
        uMouse: {value: new THREE.Vector2(.5, .5)}, uRes: {value: new THREE.Vector2(1, 1)}, uImg: {value: new THREE.Vector2(1, 1)}};
      scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
        uniforms: U, depthTest: false,
        vertexShader: 'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
        fragmentShader: `uniform sampler2D uTex;uniform float uTime,uHover,uZoom,uShift;uniform vec2 uMouse,uRes,uImg;varying vec2 vUv;
        void main(){
          float k=max(uRes.x/uImg.x,uRes.y/uImg.y);
          vec2 uv=(vUv-.5)*uRes/(uImg*k)/uZoom+.5; uv.y+=uShift;
          vec2 m=vUv-uMouse; m.x*=uRes.x/uRes.y;
          float d=length(m), f=smoothstep(.4,0.,d)*uHover; vec2 dir=m/(d+1e-4);
          uv+=dir*f*.022*sin(d*22.-uTime*2.5);
          uv+=.003*vec2(sin(vUv.y*7.+uTime*.7),cos(vUv.x*6.+uTime*.6));
          vec2 ca=dir*f*.006;
          vec3 c=vec3(texture2D(uTex,uv+ca).r,texture2D(uTex,uv).g,texture2D(uTex,uv-ca).b);
          c=mix(vec3(dot(c,vec3(.299,.587,.114))),c,.74);
          gl_FragColor=vec4(c,1.);
        }`})));

      const N = 140, pos = new Float32Array(N * 3), sp = [];
      for (let i = 0; i < N; i++) { pos[i*3] = Math.random()*2-1; pos[i*3+1] = Math.random()*2-1; sp.push(.02 + Math.random()*.06, Math.random()*6.28); }
      const sc = document.createElement('canvas'); sc.width = sc.height = 64;
      const g = sc.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(255,244,220,1)'); gr.addColorStop(1, 'rgba(255,244,220,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const pts = new THREE.Points(pg, new THREE.PointsMaterial({map: new THREE.CanvasTexture(sc), size: 14, sizeAttenuation: false,
        transparent: true, opacity: .55, depthTest: false, blending: THREE.AdditiveBlending}));
      pts.frustumCulled = false; scene.add(pts);

      new THREE.TextureLoader().setCrossOrigin('anonymous').load(img.currentSrc || img.src, t => {
        t.minFilter = THREE.LinearFilter; t.generateMipmaps = false;
        U.uTex.value = t; U.uImg.value.set(t.image.width, t.image.height);
        cv.classList.add('is-ready'); img.style.opacity = 0;
      }, undefined, () => cv.remove());

      const fit = () => { const w = wrap.clientWidth, h = wrap.clientHeight; r.setSize(w, h, false); U.uRes.value.set(w, h); };
      new ResizeObserver(fit).observe(wrap); fit();

      let tx = .5, ty = .5, th = 0, on = true;
      hero.addEventListener('pointermove', e => {
        const b = wrap.getBoundingClientRect(); tx = (e.clientX - b.left) / b.width; ty = 1 - (e.clientY - b.top) / b.height;
        th = tx >= 0 && tx <= 1 && ty >= 0 && ty <= 1 ? 1 : 0;
      });
      hero.addEventListener('pointerleave', () => th = 0);
      new IntersectionObserver(([e]) => on = e.isIntersecting).observe(hero);

      gsap.ticker.add(t => {
        if (!on || !U.uTex.value) return;
        U.uTime.value = t;
        U.uMouse.value.x += (tx - U.uMouse.value.x) * .08; U.uMouse.value.y += (ty - U.uMouse.value.y) * .08;
        U.uHover.value += (th - U.uHover.value) * .06;
        const a = pg.attributes.position.array;
        for (let i = 0; i < N; i++) {
          a[i*3+1] += sp[i*2] * .02; a[i*3] += Math.sin(t * .5 + sp[i*2+1]) * .0006;
          if (a[i*3+1] > 1.05) a[i*3+1] = -1.05;
        }
        pg.attributes.position.needsUpdate = true;
        r.render(scene, cam);
      });
      gsap.to(U.uShift, {value: .045, ease: 'none', scrollTrigger: {trigger: hero, start: 'top top', end: 'bottom top', scrub: true}});
      return U;
    } catch (e) { console.info('3D efekt kullanılamıyor; statik görsel korunuyor.'); return null; }
  };
  const GL = initGL();

  // İlerleme çubuğu
  const bar = document.createElement('div'); bar.className = 'progress'; document.body.append(bar);
  gsap.to(bar, {scaleX: 1, ease: 'none', scrollTrigger: {start: 0, end: 'max', scrub: .2}});

  // Header: kaydırınca cam efekti, aşağı inerken gizlen
  let hidden = false;
  ScrollTrigger.create({start: 0, end: 'max', onUpdate: s => {
    const y = s.scroll(); header.classList.toggle('is-scrolled', y > 80);
    const h = s.direction === 1 && y > 700;
    if (h !== hidden) { hidden = h; gsap.to(header, {yPercent: h ? -100 : 0, duration: .5, ease: 'power3.out'}); }
  }});

  // Açılış zaman çizelgesi
  const heroWords = split($('.hero h1'));
  const tl = gsap.timeline({paused: true, defaults: {ease: 'expo.out'}});
  tl.to(pre, {yPercent: -100, duration: 1.2, ease: 'expo.inOut'})
    .add(() => document.documentElement.style.overflow = '', .8)
    .from('.hero-image-wrap', {clipPath: 'inset(10% 0 10% 100%)', duration: 1.8, ease: 'expo.inOut'}, .1)
    .from(heroWords, {yPercent: 115, rotate: 5, duration: 1.4, stagger: .08}, .55)
    .from('.hero-copy > :not(h1)', {y: 24, opacity: 0, duration: 1.1, stagger: .1}, .85)
    .from(header, {y: -20, opacity: 0, duration: 1}, 1)
    .from('.floating-note', {scale: 0, rotate: -90, duration: 1.4, ease: 'elastic.out(1,.6)'}, 1.3)
    .from('.image-caption,.vertical-label,.hero-scroll', {opacity: 0, y: 10, stagger: .1}, 1.4);
  if (GL) tl.from(GL.uZoom, {value: 1.6, duration: 2.4}, .1);
  $$('.hero-meta strong').forEach(el => {
    const n = parseInt(el.textContent), s = el.textContent.replace(/\d/g, ''), o = {v: 0};
    el.textContent = '0' + s;
    tl.to(o, {v: n, duration: 2, ease: 'power2.out', onUpdate: () => el.textContent = Math.round(o.v) + s}, 1.1);
  });

  // Preloader sayacı
  document.documentElement.style.overflow = 'hidden';
  const cnt = $('.pre-count'), pb = $('.pre-bar'), o = {v: 0};
  gsap.to(pb, {scaleX: 1, duration: 1.6, ease: 'power2.inOut'});
  gsap.to(o, {v: 100, duration: 1.6, ease: 'power2.inOut', onUpdate: () => cnt.textContent = Math.round(o.v), onComplete: () => tl.play()});

  // Başlıklar ve genel reveal
  $$('.intro h2,.section-heading h2,.services h2,.contact h2,.quote-inner p').forEach(el => {
    gsap.from(split(el), {yPercent: 115, rotate: 4, duration: 1.3, stagger: .06, ease: 'expo.out',
      scrollTrigger: {trigger: el, start: 'top 85%', once: true}});
  });
  $$('.reveal').forEach(el => {
    if (el.closest('.hero') || el.dataset.split) return;
    gsap.from(el, {y: 40, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: {trigger: el, start: 'top 90%', once: true}});
  });

  // Proje görselleri: maske açılışı + parallax
  $$('.project-image').forEach(el => {
    gsap.from(el, {clipPath: 'inset(0 0 100% 0)', duration: 1.4, ease: 'expo.out', scrollTrigger: {trigger: el, start: 'top 88%', once: true}});
    gsap.fromTo($('img', el), {yPercent: -7, scale: 1.2}, {yPercent: 7, ease: 'none',
      scrollTrigger: {trigger: el, start: 'top bottom', end: 'bottom top', scrub: true}});
  });

  // Hero: kaydırırken metin yukarı süzülür, yüzen not havada salınır
  gsap.to('.hero-copy', {yPercent: -10, ease: 'none', scrollTrigger: {trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true}});
  gsap.to('.floating-note', {y: -13, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut'});

  // Yalnızca fare kullanılan cihazlar: özel imleç, manyetik butonlar, fare paralaksı
  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    const c = document.createElement('div'); c.className = 'cursor'; c.innerHTML = '<span></span>'; document.body.append(c);
    const cx = gsap.quickTo(c, 'x', {duration: .5, ease: 'power3'}), cy = gsap.quickTo(c, 'y', {duration: .5, ease: 'power3'});
    addEventListener('pointermove', e => { cx(e.clientX); cy(e.clientY); });
    const hov = (sel, cls) => $$(sel).forEach(el => {
      el.addEventListener('pointerenter', () => c.classList.add(cls));
      el.addEventListener('pointerleave', () => c.classList.remove(cls));
    });
    hov('a,button', 'is-link'); hov('.project-image', 'is-view');

    $$('.contact-circle,.button,.header-cta').forEach(el => {
      const xt = gsap.quickTo(el, 'x', {duration: .6, ease: 'power3'}), yt = gsap.quickTo(el, 'y', {duration: .6, ease: 'power3'});
      el.addEventListener('pointermove', e => { const b = el.getBoundingClientRect(); xt((e.clientX - b.left - b.width / 2) * .3); yt((e.clientY - b.top - b.height / 2) * .3); });
      el.addEventListener('pointerleave', () => { xt(0); yt(0); });
    });

    const nx = gsap.quickTo('.floating-note', 'x', {duration: 1.2, ease: 'power3'}), lx = gsap.quickTo('.vertical-label', 'x', {duration: 1.2, ease: 'power3'});
    $('.hero').addEventListener('pointermove', e => { const k = e.clientX / innerWidth - .5; nx(k * -40); lx(k * 24); });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
})();
