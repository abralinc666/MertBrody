// ODA Studio — Etkileşimli 3D oda (Three.js, harici model yok)
(() => {
  const stage = document.querySelector('.room-stage'), ui = document.querySelector('.room-ui');
  if (!stage) return;
  if (!window.THREE) { stage.insertAdjacentHTML('beforeend', '<p class="room-fallback">3D önizleme için WebGL gerekli.</p>'); return; }
  const T = THREE;
  const tw = (o, v, d = .9) => window.gsap ? gsap.to(o, {...v, duration: d, ease: 'power2.out'}) : Object.assign(o, v);
  const tint = (col, hex) => { const c = new T.Color(hex); tw(col, {r: c.r, g: c.g, b: c.b}); };
  const M = (c, o = {}) => new T.MeshStandardMaterial({color: c, roughness: .85, ...o});
  const B = (w, h, d) => new T.BoxGeometry(w, h, d), C = (a, b, h, s = 32) => new T.CylinderGeometry(a, b, h, s);
  const add = (p, g, m, x, y, z) => { const o = new T.Mesh(g, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; p.add(o); return o; };

  const cv = stage.querySelector('canvas');
  const r = new T.WebGLRenderer({canvas: cv, antialias: true});
  r.setPixelRatio(Math.min(devicePixelRatio, 1.8)); r.shadowMap.enabled = true; r.shadowMap.type = T.PCFSoftShadowMap;
  r.toneMapping = T.ACESFilmicToneMapping;
  const scene = new T.Scene(); scene.background = new T.Color(0xdfe3de);
  const cam = new T.PerspectiveCamera(38, 1, .1, 60);

  // Kabuk
  const wallM = M(0xe6dfd0), floorM = M(0xb89a74, {roughness: .6}), sofaM = M(0xc9b79c, {roughness: 1}), dark = M(0x2b2a26);
  add(scene, B(6, .1, 5), floorM, 0, -.05, 0);
  add(scene, B(6, 3, .1), wallM, 0, 1.5, -2.55);
  add(scene, B(.1, 3, 5), wallM, -3.05, 1.5, 0);
  // Pencere
  const winM = new T.MeshStandardMaterial({color: 0xffffff, emissive: 0xfff3d6, emissiveIntensity: 1});
  add(scene, B(1.9, 1.5, .06), dark, 1.3, 1.75, -2.49);
  new T.Mesh(new T.PlaneGeometry(1.7, 1.3), winM).position.set(1.3, 1.75, -2.455);
  const glass = new T.Mesh(new T.PlaneGeometry(1.7, 1.3), winM); glass.position.set(1.3, 1.75, -2.455); scene.add(glass);
  add(scene, B(.04, 1.3, .02), dark, 1.3, 1.75, -2.44); add(scene, B(1.7, .04, .02), dark, 1.3, 1.75, -2.44);
  // Tablo
  add(scene, B(1.4, .9, .04), dark, -.6, 1.9, -2.49);
  const art = new T.Mesh(new T.PlaneGeometry(1.28, .78), new T.MeshStandardMaterial({color: 0xb9a88c})); art.position.set(-.6, 1.9, -2.465); scene.add(art);
  const dot = new T.Mesh(new T.CircleGeometry(.24, 32), new T.MeshStandardMaterial({color: 0x82745e})); dot.position.set(-.45, 1.95, -2.46); scene.add(dot);
  // Halı + koltuk
  add(scene, C(1.6, 1.6, .02, 64), M(0xd8cdb8, {roughness: 1}), 0, .01, .2);
  const sofa = new T.Group(); sofa.position.set(-.6, 0, -1.85); scene.add(sofa);
  add(sofa, B(2.6, .5, 1), sofaM, 0, .25, 0); add(sofa, B(2.6, .55, .26), sofaM, 0, .78, -.38);
  add(sofa, B(.26, .62, 1), sofaM, -1.17, .47, 0); add(sofa, B(.26, .62, 1), sofaM, 1.17, .47, 0);
  add(sofa, B(.7, .12, .7), M(0xe4dccb, {roughness: 1}), .6, .56, .02).rotation.z = -.05;
  // Sehpa + vazo
  const woodM = M(0x8a6a4a, {roughness: .6});
  add(scene, C(.55, .55, .06), woodM, -.4, .42, .35); add(scene, C(.08, .08, .4), woodM, -.4, .2, .35);
  add(scene, C(.07, .1, .26), M(0xeee8da, {roughness: .4}), -.3, .58, .3);
  // Bitki
  add(scene, C(.25, .2, .4), M(0xa5694a), 2.3, .2, -1.8);
  [[0, .85, 0, .26], [.14, 1.15, .05, .22], [-.15, 1.05, -.06, .24], [.02, 1.4, -.04, .18], [-.1, .7, .14, .2]].forEach(([x, y, z, s]) =>
    add(scene, new T.SphereGeometry(s, 16, 12), M(0x4f6b43), 2.3 + x, y, -1.8 + z).scale.set(1, 1.3, 1));
  // Lamba (tıklanabilir)
  const lampG = new T.Group(); scene.add(lampG);
  const shadeM = new T.MeshStandardMaterial({color: 0xf3e6cc, emissive: 0xffc680, emissiveIntensity: 0, side: T.DoubleSide});
  add(lampG, C(.25, .28, .04), dark, -2.4, .02, -1.75); add(lampG, C(.02, .02, 1.6), dark, -2.4, .8, -1.75);
  add(lampG, C(.26, .36, .42, 28), shadeM, -2.4, 1.75, -1.75);
  const hit = add(lampG, new T.SphereGeometry(.6, 8, 8), new T.MeshBasicMaterial({transparent: true, opacity: 0, depthWrite: false}), -2.4, 1.5, -1.75); hit.castShadow = false;
  const lamp = new T.PointLight(0xffc680, 0, 8, 2); lamp.position.set(-2.4, 1.7, -1.75); scene.add(lamp);

  // Işıklar
  const sun = new T.DirectionalLight(0xfff1d6, 2.4); sun.position.set(4, 6, 3); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, {left: -6, right: 6, top: 6, bottom: -6}); sun.shadow.bias = -.0006; scene.add(sun);
  const hemi = new T.HemisphereLight(0xffffff, 0x8a8070, .9); scene.add(hemi);

  const modes = {
    day:   {bg: 0xdfe3de, sun: 0xfff1d6, si: 2.4, hi: .9,  win: 1,   lamp: 0,  pos: [4, 6, 3]},
    dusk:  {bg: 0xd9a77f, sun: 0xff9a55, si: 1.6, hi: .45, win: .6,  lamp: 6,  pos: [5, 2.4, 2.5]},
    night: {bg: 0x141821, sun: 0x6f86c8, si: .5,  hi: .2,  win: .12, lamp: 10, pos: [-3, 5, 4]}
  };
  let mode = 'day', lampOn = false;
  const setMode = k => {
    mode = k; const m = modes[k];
    tint(scene.background, m.bg); tint(sun.color, m.sun);
    tw(sun, {intensity: m.si}); tw(hemi, {intensity: m.hi}); tw(winM, {emissiveIntensity: m.win});
    tw(sun.position, {x: m.pos[0], y: m.pos[1], z: m.pos[2]});
    lampOn = m.lamp > 0; tw(lamp, {intensity: m.lamp});
  };
  const toggleLamp = () => { lampOn = !lampOn; tw(lamp, {intensity: lampOn ? Math.max(modes[mode].lamp, 7) : 0}); };

  // Kontrol paneli
  const hex = n => '#' + n.toString(16).padStart(6, '0');
  const groups = [
    ['Duvar', wallM.color, [['Krem', 0xe6dfd0], ['Adaçayı', 0xa9b59a], ['Toprak', 0xc08f6e], ['Gece mavisi', 0x3d4a5c]]],
    ['Zemin', floorM.color, [['Meşe', 0xb89a74], ['Ceviz', 0x6b4a33], ['Taş', 0xb9b5aa]]],
    ['Koltuk', sofaM.color, [['Kum', 0xc9b79c], ['Zeytin', 0x6e7350], ['Antrasit', 0x3b3b39], ['Pas', 0xa8603f]]]
  ];
  groups.forEach(([name, col, opts]) => {
    const g = document.createElement('div'); g.className = 'room-group';
    g.innerHTML = `<span class="room-label">${name} · <b>${opts[0][0]}</b></span><div class="room-opts"></div>`;
    const label = g.querySelector('b'), box = g.querySelector('.room-opts');
    opts.forEach(([n, c], i) => {
      const b = document.createElement('button'); b.className = 'sw' + (i ? '' : ' on'); b.style.background = hex(c); b.title = b.ariaLabel = n;
      b.onclick = () => { tint(col, c); label.textContent = n; box.querySelectorAll('.on').forEach(x => x.classList.remove('on')); b.classList.add('on'); };
      box.append(b);
    });
    ui.append(g);
  });
  const tg = document.createElement('div'); tg.className = 'room-group';
  tg.innerHTML = '<span class="room-label">Işık</span><div class="room-opts"></div>';
  [['day', 'Gündüz'], ['dusk', 'Gün batımı'], ['night', 'Gece']].forEach(([k, n], i) => {
    const b = document.createElement('button'); b.className = 'pill' + (i ? '' : ' on'); b.textContent = n;
    b.onclick = () => { setMode(k); tg.querySelectorAll('.pill.on').forEach(x => x.classList.remove('on')); b.classList.add('on'); };
    tg.lastChild.append(b);
  });
  const lb = document.createElement('button'); lb.className = 'pill'; lb.textContent = 'Lamba'; lb.onclick = toggleLamp; tg.lastChild.append(lb);
  ui.append(tg);

  // Kamera: sürükle-döndür, lambaya dokun
  let az = .75, el = .28, taz = az, tel = el, drag = null, moved = 0;
  const clamp = T.MathUtils.clamp, ray = new T.Raycaster(), mp = new T.Vector2(), tip = stage.querySelector('.room-tip');
  cv.addEventListener('pointerdown', e => { drag = {x: e.clientX, y: e.clientY}; moved = 0; cv.setPointerCapture(e.pointerId); tip?.classList.add('is-hidden'); });
  cv.addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY; moved += Math.abs(dx) + Math.abs(dy);
    taz = clamp(taz - dx * .006, .05, 1.5); tel = clamp(tel + dy * .004, .08, .6);
  });
  cv.addEventListener('pointerup', e => {
    if (drag && moved < 6) {
      const b = cv.getBoundingClientRect(); mp.set((e.clientX - b.left) / b.width * 2 - 1, -((e.clientY - b.top) / b.height * 2 - 1));
      ray.setFromCamera(mp, cam); if (ray.intersectObject(lampG, true).length) toggleLamp();
    }
    drag = null;
  });
  cv.addEventListener('pointercancel', () => drag = null);

  new ResizeObserver(() => {
    const w = stage.clientWidth, h = stage.clientHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix();
  }).observe(stage);

  // Yalnızca görünürken çiz
  let on = false, id = 0;
  const loop = t => {
    id = 0; if (!on) return; id = requestAnimationFrame(loop);
    az += (taz - az) * .08; el += (tel - el) * .08;
    const a = az + (drag ? 0 : Math.sin(t * .00035) * .07), d = 11.5;
    cam.position.set(Math.sin(a) * Math.cos(el) * d, 1.3 + Math.sin(el) * d, Math.cos(a) * Math.cos(el) * d);
    cam.lookAt(0, 1.1, 0);
    shadeM.emissiveIntensity = lamp.intensity * .12;
    r.render(scene, cam);
  };
  new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on && !id) id = requestAnimationFrame(loop); }, {rootMargin: '100px'}).observe(stage);
})();
