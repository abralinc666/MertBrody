// Hafif 3D arka plan: dönen tel kafes + parçacık bulutu. WebGL yok / düşük cihaz / hareket azaltma → hiç yüklenmez.
const canvas = document.getElementById('hero-canvas');
const weak = matchMedia('(prefers-reduced-motion: reduce)').matches || (navigator.hardwareConcurrency || 4) < 4;
if (canvas && !weak) init().catch(() => canvas.remove());
else if (canvas) canvas.remove();

async function init() {
  const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
  camera.position.z = 7;

  const lime = 0xd7ff1f;
  const group = new THREE.Group();
  group.position.x = 2.2;
  scene.add(group);

  const wire = (r, d, o) => new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(r, d)),
    new THREE.LineBasicMaterial({ color: lime, transparent: true, opacity: o }));
  const outer = wire(2.4, 1, 0.55), inner = wire(1.3, 0, 0.9);
  group.add(outer, inner);

  const N = 420, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 3 + Math.random() * 3.5, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
    pos.set([r * Math.sin(p) * Math.cos(t), r * Math.sin(p) * Math.sin(t), r * Math.cos(p)], i * 3);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dots = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, transparent: true, opacity: 0.55 }));
  group.add(dots);

  const mouse = { x: 0, y: 0 };
  addEventListener('pointermove', (e) => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5; }, { passive: true });

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    group.position.x = w < 700 ? 0.8 : 2.2;
    camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(canvas);
  resize();

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 }).observe(canvas);

  const clock = new THREE.Clock();
  (function loop() {
    requestAnimationFrame(loop);
    if (!visible || document.hidden) return;
    const t = clock.getElapsedTime();
    outer.rotation.set(t * 0.12, t * 0.18, 0);
    inner.rotation.set(-t * 0.2, t * 0.14, 0);
    dots.rotation.y = t * 0.03;
    group.rotation.y += (mouse.x * 0.6 - group.rotation.y) * 0.04;
    group.rotation.x += (mouse.y * 0.4 - group.rotation.x) * 0.04;
    renderer.render(scene, camera);
  })();
}
