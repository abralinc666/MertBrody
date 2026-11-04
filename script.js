// ODA Studio — GSAP entrance and scroll animations
(() => {
  const menu = document.querySelector('.menu-toggle');
  const header = document.querySelector('.site-header');
  menu?.addEventListener('click', () => {
    const open = header.classList.toggle('nav-open');
    menu.setAttribute('aria-expanded', String(open));
  });
  document.querySelectorAll('.desktop-nav a').forEach(a => a.addEventListener('click', () => {
    header.classList.remove('nav-open');
    menu?.setAttribute('aria-expanded', 'false');
  }));

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('.hero-copy > *', {y: 28, opacity: 0, duration: 1, stagger: .12, ease: 'power3.out', delay: .15});
    gsap.from('.hero-image-wrap img', {scale: 1.15, duration: 1.8, ease: 'power3.out', delay: .1});
    gsap.utils.toArray('.reveal').forEach(el => {
      if (el.closest('.hero')) return;
      gsap.from(el, {y: 35, opacity: 0, duration: .85, ease: 'power2.out',
        scrollTrigger: {trigger: el, start: 'top 88%', once: true}});
    });
    gsap.to('.floating-note', {y: -13, duration: 2.4, repeat: -1, yoyo: true, ease: 'sine.inOut'});
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.style.opacity = 1);
  }

  // Small Three.js ambient particle field, progressively enhanced.
  // The site remains fully usable if WebGL or the CDN is unavailable.
  const visual = document.querySelector('.hero-visual');
  if (window.THREE && visual && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    try {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, visual.clientWidth / visual.clientHeight, .1, 100);
      camera.position.z = 12;
      const renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
      renderer.setSize(visual.clientWidth, visual.clientHeight);
      renderer.domElement.className = 'ambient-canvas';
      renderer.domElement.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;opacity:.55';
      visual.appendChild(renderer.domElement);
      const count = 240, positions = new Float32Array(count * 3);
      for (let i=0;i<count;i++) {
        positions[i*3] = (Math.random()-.5)*18;
        positions[i*3+1] = (Math.random()-.5)*12;
        positions[i*3+2] = (Math.random()-.5)*8;
      }
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions,3));
      const material = new THREE.PointsMaterial({color:0xe8ddc8,size:.025,transparent:true,opacity:.65});
      const particles = new THREE.Points(geometry, material);
      scene.add(particles);
      let frame;
      const animate = () => {
        particles.rotation.y += .00035;
        particles.rotation.x += .00012;
        renderer.render(scene,camera);
        frame = requestAnimationFrame(animate);
      };
      animate();
      const resize = () => {
        camera.aspect = visual.clientWidth / visual.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(visual.clientWidth, visual.clientHeight);
      };
      window.addEventListener('resize', resize);
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) cancelAnimationFrame(frame); else animate();
      });
    } catch (e) { console.info('Ambient 3D effect unavailable; static design retained.'); }
  }
})();