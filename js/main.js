import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { getReply, WELCOME } from "./chat.js";

// ---------------------------------------------------------------------
//  DOM
// ---------------------------------------------------------------------
const $ = (id) => document.getElementById(id);
const canvas = $("scene");
const stage = $("stage");
const loaderEl = $("loader");
const bubbleEl = $("speechBubble");

// file:// ile açılırsa modeller yüklenemez → kullanıcıyı uyar
if (location.protocol === "file:") {
  showLoaderError(
    "Bu site <b>yerel bir sunucu</b> ile açılmalı (tarayıcı güvenliği 3D modellerin doğrudan yüklenmesine izin vermiyor).<br><br>" +
      "Windows: <code>baslat.bat</code> dosyasına çift tıkla.<br>" +
      "Mac/Linux: terminalde <code>sh baslat.sh</code><br><br>" +
      "Sonra tarayıcıda <code>http://localhost:8000</code> adresini aç."
  );
}

function showLoaderError(html) {
  const e = $("loaderError");
  e.innerHTML = html;
  e.classList.remove("hidden");
}

// ---------------------------------------------------------------------
//  RENDERER / SAHNE / KAMERA
// ---------------------------------------------------------------------
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d0820);
scene.fog = new THREE.Fog(0x0d0820, 7, 16);

const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environmentIntensity = 0.35;

const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 60);
camera.position.set(0, 1.6, 4.2);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 2.2;
controls.maxDistance = 6;
controls.minPolarAngle = Math.PI * 0.25;
controls.maxPolarAngle = Math.PI * 0.55;
controls.minAzimuthAngle = -Math.PI * 0.45;
controls.maxAzimuthAngle = Math.PI * 0.45;
controls.target.set(0, 1.1, 0);

// Post-processing (neon parlaması)
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.5, 0.88);
composer.addPass(bloom);
composer.addPass(new OutputPass());

// ---------------------------------------------------------------------
//  IŞIKLAR
// ---------------------------------------------------------------------
scene.add(new THREE.HemisphereLight(0x8a6cff, 0x1a0b2e, 0.6));

const key = new THREE.SpotLight(0xffd2b0, 60, 12, Math.PI / 5, 0.5, 1.5);
key.position.set(1.6, 3.6, 3.2);
key.target.position.set(0, 1, 0);
key.castShadow = true;
key.shadow.mapSize.set(1024, 1024);
key.shadow.bias = -0.0004;
scene.add(key, key.target);

const pinkLight = new THREE.PointLight(0xff2d78, 18, 8, 1.6);
pinkLight.position.set(2.2, 2.2, -1.2);
scene.add(pinkLight);

const blueLight = new THREE.PointLight(0x2f6bff, 16, 8, 1.6);
blueLight.position.set(-2.4, 1.6, -0.6);
scene.add(blueLight);

const rim = new THREE.DirectionalLight(0xb48cff, 1.2);
rim.position.set(-1, 3, -3);
scene.add(rim);

// ---------------------------------------------------------------------
//  ODA (yayıncı odası)
// ---------------------------------------------------------------------
buildRoom();

function neonMat(hex, power = 2.2) {
  const c = new THREE.Color(hex).multiplyScalar(power);
  return new THREE.MeshBasicMaterial({ color: c, toneMapped: false });
}

function buildRoom() {
  const room = new THREE.Group();
  scene.add(room);

  // Zemin
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 14),
    new THREE.MeshStandardMaterial({ color: 0x1a1230, roughness: 0.35, metalness: 0.2 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  room.add(floor);

  // Halı
  const rug = new THREE.Mesh(
    new THREE.CircleGeometry(1.6, 48),
    new THREE.MeshStandardMaterial({ color: 0x2b1a4d, roughness: 0.95 })
  );
  rug.rotation.x = -Math.PI / 2;
  rug.position.y = 0.005;
  rug.receiveShadow = true;
  room.add(rug);

  // Duvarlar
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x241944, roughness: 0.85 });
  const back = new THREE.Mesh(new THREE.PlaneGeometry(14, 6), wallMat);
  back.position.set(0, 3, -2.6);
  back.receiveShadow = true;
  room.add(back);
  const left = new THREE.Mesh(new THREE.PlaneGeometry(10, 6), wallMat);
  left.rotation.y = Math.PI / 2;
  left.position.set(-4, 3, 1);
  room.add(left);
  const right = left.clone();
  right.rotation.y = -Math.PI / 2;
  right.position.x = 4;
  room.add(right);

  // Neon halka (arka duvar)
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.035, 16, 100), neonMat(0xff2d78));
  ring.position.set(1.7, 2.3, -2.55);
  room.add(ring);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.025, 16, 100), neonMat(0x22e3ff));
  ring2.position.copy(ring.position);
  room.add(ring2);

  // Neon yazı tabelası
  const sign = makeNeonSign();
  sign.position.set(-1.7, 2.45, -2.55);
  room.add(sign);

  // LED şeritler
  const strip = new THREE.Mesh(new THREE.BoxGeometry(14, 0.04, 0.04), neonMat(0x8b5cff, 2.5));
  strip.position.set(0, 0.06, -2.56);
  room.add(strip);
  const stripTop = strip.clone();
  stripTop.material = neonMat(0xff2d78, 1.6);
  stripTop.position.y = 4.2;
  room.add(stripTop);

  // Raflar + objeler
  const shelfMat = new THREE.MeshStandardMaterial({ color: 0x3a2a22, roughness: 0.7 });
  for (const [x, y] of [[-2.6, 1.3], [-2.6, 1.9], [2.9, 1.15]]) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.05, 0.35), shelfMat);
    shelf.position.set(x, y, -2.4);
    shelf.castShadow = true;
    room.add(shelf);
  }
  // Altın plaket
  const plaque = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.55, 0.04),
    new THREE.MeshStandardMaterial({ color: 0xd8a640, metalness: 1, roughness: 0.25 })
  );
  plaque.position.set(-2.85, 1.61, -2.45);
  room.add(plaque);
  const play = new THREE.Mesh(new THREE.CircleGeometry(0.1, 3), new THREE.MeshStandardMaterial({ color: 0x7a5a20, metalness: 1, roughness: 0.3 }));
  play.position.set(-2.85, 1.61, -2.425);
  room.add(play);

  // Saksı bitkileri
  room.add(makePlant(-2.25, 1.325, -2.4, 0.6));
  room.add(makePlant(-2.4, 1.925, -2.4, 0.5));
  room.add(makePlant(2.6, 1.175, -2.4, 0.55));
  room.add(makePlant(-3.2, 0, -1.6, 1.4));
  room.add(makePlant(3.3, 0, -1.2, 1.2));

  // Mikrofon (karakterin solunda, izleyicinin sağında)
  room.add(makeMic());
}

function makeNeonSign() {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 400;
  const g = c.getContext("2d");
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = "900 190px Rubik, Arial Black, sans-serif";
  g.shadowColor = "#ff2d78"; g.shadowBlur = 40;
  g.fillStyle = "#ffd0e4";
  g.fillText("BÖCEK", 512, 150);
  g.font = "700 90px Rubik, Arial, sans-serif";
  g.shadowColor = "#22e3ff";
  g.fillStyle = "#d8fbff";
  g.fillText("● CANLI", 512, 310);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, color: new THREE.Color(1.8, 1.8, 1.8) });
  return new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.78), mat);
}

function makePlant(x, y, z, s) {
  const grp = new THREE.Group();
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.09, 0.2, 20),
    new THREE.MeshStandardMaterial({ color: 0xece6f5, roughness: 0.5 })
  );
  pot.position.y = 0.1;
  pot.castShadow = true;
  grp.add(pot);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x2f8a4a, roughness: 0.6 });
  for (let i = 0; i < 9; i++) {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), leafMat);
    leaf.scale.set(0.6, 2.2, 0.25);
    const a = (i / 9) * Math.PI * 2;
    leaf.position.set(Math.cos(a) * 0.06, 0.32 + (i % 3) * 0.04, Math.sin(a) * 0.06);
    leaf.rotation.set(Math.sin(a) * 0.5, 0, -Math.cos(a) * 0.5);
    leaf.castShadow = true;
    grp.add(leaf);
  }
  grp.position.set(x, y, z);
  grp.scale.setScalar(s);
  return grp;
}

function makeMic() {
  const grp = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: 0x111116, metalness: 0.8, roughness: 0.35 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.04, 32), metal);
  base.position.y = 0.02;
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.3, 12), metal);
  pole.position.y = 0.67;
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.7, 12), metal);
  arm.rotation.x = Math.PI / 2.6;
  arm.rotation.z = 0.4;
  arm.position.set(-0.13, 1.42, 0.25);
  const mic = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.2, 8, 16), metal);
  mic.rotation.x = Math.PI / 2.4;
  mic.rotation.z = 0.4;
  mic.position.set(-0.27, 1.55, 0.5);
  const grill = new THREE.Mesh(new THREE.SphereGeometry(0.072, 16, 12), new THREE.MeshStandardMaterial({ color: 0x2a2a33, metalness: 0.9, roughness: 0.6 }));
  grill.position.set(-0.3, 1.6, 0.6);
  const glow = new THREE.Mesh(new THREE.TorusGeometry(0.072, 0.008, 8, 32), neonMat(0xff2d78, 2));
  glow.position.copy(mic.position);
  glow.rotation.copy(mic.rotation);
  for (const m of [base, pole, arm, mic, grill]) { m.castShadow = true; grp.add(m); }
  grp.add(glow);
  grp.position.set(1.25, 0, 0.35);
  return grp;
}

// ---------------------------------------------------------------------
//  MODELLER: koltuk + böcek
// ---------------------------------------------------------------------
const seat = new THREE.Group(); // koltuk + karakter birlikte döner (koltuk sallanması)
scene.add(seat);

let model = null;
const B = {}; // kemikler (bones) isimle
const base = {}; // oturma pozundaki temel rotasyonlar
let headAnchor = null; // konuşma balonu için başın üst noktası

const manager = new THREE.LoadingManager();
const progress = { bocek: 0, koltuk: 0 };
function updateProgress() {
  const p = Math.round((progress.bocek * 0.33 + progress.koltuk * 0.67) * 100);
  $("progressBar").style.width = p + "%";
  $("progressText").textContent = "%" + p;
}

const loader = new GLTFLoader(manager);
const loadGLB = (url, keyName) =>
  new Promise((resolve, reject) => {
    loader.load(
      url,
      resolve,
      (e) => {
        if (e.lengthComputable) progress[keyName] = e.loaded / e.total;
        else progress[keyName] = Math.min(0.95, e.loaded / (keyName === "koltuk" ? 30.7e6 : 14.8e6));
        updateProgress();
      },
      reject
    );
  });

Promise.all([loadGLB("models/bocek.glb", "bocek"), loadGLB("models/koltuk.glb", "koltuk")])
  .then(([bocekGltf, koltukGltf]) => {
    progress.bocek = progress.koltuk = 1;
    updateProgress();
    setupScene(bocekGltf.scene, koltukGltf.scene);
    loaderEl.classList.add("done");
    setTimeout(() => botSay(WELCOME, "wave"), 700);
  })
  .catch((err) => {
    console.error(err);
    showLoaderError(
      "3D modeller yüklenemedi 😢<br>Siteyi <code>baslat.bat</code> / <code>baslat.sh</code> ile yerel sunucuda açtığından ve <code>models</code> klasörünün yerinde olduğundan emin ol."
    );
  });

// --- Kemik yardımcıları ------------------------------------------------
const _qa = new THREE.Quaternion();
const _qb = new THREE.Quaternion();
const _qR = new THREE.Quaternion();
const _va = new THREE.Vector3();
const _vb = new THREE.Vector3();
const AX = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) };

// Kemiğin ebeveyninin, model köküne göre dünya rotasyonu
function parentQuatInModel(bone, out) {
  bone.parent.updateWorldMatrix(true, false);
  bone.parent.getWorldQuaternion(out);
  model.getWorldQuaternion(_qb);
  return out.premultiply(_qb.invert());
}

// Model uzayında verilen R rotasyonunu kemiğe uygula
function applyModelRot(bone, R) {
  const p = parentQuatInModel(bone, _qa);
  const pInv = p.clone().invert();
  bone.quaternion.premultiply(p).premultiply(R).premultiply(pInv);
  bone.updateWorldMatrix(false, true);
}

// Kemiği, çocuğuna doğru olan yönü "dir" olacak şekilde çevir (model uzayında)
function aim(name, childName, dir) {
  const b = B[name], c = B[childName];
  if (!b || !c) return;
  model.updateWorldMatrix(true, true);
  b.getWorldPosition(_va);
  c.getWorldPosition(_vb);
  model.worldToLocal(_va);
  model.worldToLocal(_vb);
  const cur = _vb.sub(_va).normalize();
  _qR.setFromUnitVectors(cur, dir.clone().normalize());
  applyModelRot(b, _qR);
}

// Model uzayında bir eksen etrafında döndür
function rot(name, axis, angle) {
  const b = B[name];
  if (!b || angle === 0) return;
  applyModelRot(b, new THREE.Quaternion().setFromAxisAngle(axis, angle));
}

const v = (x, y, z) => new THREE.Vector3(x, y, z);

// Oturma pozu (karakter +Z yönüne bakıyor, karakterin solu = +X)
function applySittingPose() {
  // Gövde: hafif geriye yaslanmış
  aim("Hips", "Spine", v(0, 1, -0.18));
  aim("Spine", "Spine1", v(0, 1, -0.08));
  aim("Spine1", "Spine2", v(0, 1, 0));
  aim("Spine2", "Neck", v(0, 1, 0.1));
  aim("Neck", "Head", v(0, 1, 0.15));
  aim("Head", "HeadTop_End", v(0, 1, 0.02));

  // Bacaklar: uyluklar öne, baldırlar aşağı
  aim("LeftUpLeg", "LeftLeg", v(0.2, -0.03, 1));
  aim("LeftLeg", "LeftFoot", v(0.06, -1, 0.1));
  aim("LeftFoot", "LeftToeBase", v(0.08, -0.5, 1));
  aim("LeftToeBase", "LeftToe_End", v(0.05, -0.1, 1));
  aim("RightUpLeg", "RightLeg", v(-0.2, -0.03, 1));
  aim("RightLeg", "RightFoot", v(-0.06, -1, 0.1));
  aim("RightFoot", "RightToeBase", v(-0.08, -0.5, 1));
  aim("RightToeBase", "RightToe_End", v(-0.05, -0.1, 1));

  // Sol kol: kolçakta / kucakta dinleniyor
  aim("LeftArm", "LeftForeArm", v(0.35, -1, 0.3));
  aim("LeftForeArm", "LeftHand", v(0.12, -0.15, 1));
  aim("LeftHand", "LeftHandMiddle1", v(0.05, -0.3, 1));

  // Sağ kol: izleyiciyi gösteriyor (resimdeki gibi)
  aim("RightArm", "RightForeArm", v(-0.35, -0.85, 0.55));
  aim("RightForeArm", "RightHand", v(-0.08, 0.4, 1));
  aim("RightHand", "RightHandMiddle1", v(0, 0.3, 1));
}

const ANIM_BONES = [
  "Hips", "Spine", "Spine1", "Spine2", "Neck", "Head",
  "LeftArm", "LeftForeArm", "RightArm", "RightForeArm", "RightHand",
];

function setupScene(bocek, koltuk) {
  model = bocek;
  model.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
      o.frustumCulled = false;
    }
    // "mixamorig:Hips" → GLTFLoader ":" karakterini siler → "mixamorigHips"
    const key = o.name.replace(/^mixamorig:?/, "");
    if (key && !B[key]) B[key] = o;
  });

  // 1) Pozu model orijindeyken ver
  scene.add(model);
  model.updateWorldMatrix(true, true);
  applySittingPose();
  model.updateWorldMatrix(true, true);

  for (const n of ANIM_BONES) if (B[n]) base[n] = B[n].quaternion.clone();

  // 2) Ölçüleri hesapla
  const hips = B.Hips.getWorldPosition(new THREE.Vector3());
  let footY = Infinity;
  for (const n of ["LeftFoot", "RightFoot", "LeftToe_End", "RightToe_End", "LeftToeBase", "RightToeBase"]) {
    if (B[n]) footY = Math.min(footY, B[n].getWorldPosition(new THREE.Vector3()).y);
  }
  if (!isFinite(footY)) footY = hips.y - 0.6;
  const legDrop = hips.y - footY + 0.04; // kalçadan taban altına

  // Koltuk modeli: oturak üstü y≈-0.15, zemin y≈-0.95, sırtlık önü z≈-0.23, ön yüz +Z
  const SEAT_TOP = -0.15, FLOOR = -0.95, BACK_Z = -0.23;
  const buttOffset = 0.1; // kalça ekleminin oturağın üstündeki yüksekliği
  let s = (legDrop - buttOffset) / (SEAT_TOP - FLOOR);
  s = THREE.MathUtils.clamp(s, 0.65, 1.25);

  koltuk.scale.setScalar(s);
  koltuk.position.y = -FLOOR * s;
  koltuk.traverse((o) => {
    if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; }
  });
  seat.add(koltuk);

  const seatTopY = (SEAT_TOP - FLOOR) * s;
  const hipsTargetZ = BACK_Z * s + 0.2;
  model.position.set(-hips.x, seatTopY + buttOffset - hips.y, hipsTargetZ - hips.z);
  seat.add(model); // seat grubuna taşı (dünya dönüşümü sıfır olduğundan konum korunur)
  model.updateWorldMatrix(true, true);

  // Başın üst noktası (balon için)
  headAnchor = new THREE.Object3D();
  (B.HeadTop_End || B.Head).add(headAnchor);

  // Kamerayı karaktere göre ayarla
  const headPos = (B.Head || B.Hips).getWorldPosition(new THREE.Vector3());
  const topPos = headAnchor.getWorldPosition(new THREE.Vector3());
  const midY = (seatTopY + topPos.y) / 2;
  controls.target.set(0, midY, 0);
  const dist = Math.max(3.2, (topPos.y - 0) * 1.55);
  camera.position.set(0.35, midY + 0.35, dist);
  key.target.position.set(0, headPos.y * 0.8, 0);
  controls.update();
}

// ---------------------------------------------------------------------
//  ANİMASYON
// ---------------------------------------------------------------------
const clock = new THREE.Clock();
const mouse = new THREE.Vector2(0, 0);
const look = new THREE.Vector2(0, 0);
let talking = false;
let talkAmt = 0;
let action = null; // { type, start, dur }

stage.addEventListener("pointermove", (e) => {
  const r = stage.getBoundingClientRect();
  mouse.set(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1));
});

function startAction(type) {
  if (!type) return;
  const durs = { wave: 2.4, dance: 4.5, laugh: 2.0, nod: 1.4, point: 2.0, shy: 2.4 };
  action = { type, start: clock.elapsedTime, dur: durs[type] || 2 };
}

// 0→1→0 yumuşak zarf
function envelope(a, t) {
  const p = (t - a.start) / a.dur;
  if (p >= 1) return -1;
  const fadeIn = Math.min(1, p / 0.15);
  const fadeOut = Math.min(1, (1 - p) / 0.2);
  return Math.min(fadeIn, fadeOut);
}

function animateCharacter(t, dt) {
  if (!model) return;

  // Temel poza dön
  for (const n of ANIM_BONES) if (base[n]) B[n].quaternion.copy(base[n]);

  talkAmt += ((talking ? 1 : 0) - talkAmt) * Math.min(1, dt * 6);
  look.lerp(mouse, Math.min(1, dt * 3));

  let env = 0, type = null;
  if (action) {
    env = envelope(action, t);
    if (env < 0) { action = null; env = 0; } else type = action.type;
  }
  const A = (name) => (type === name ? env : 0);

  // Nefes alma
  const breath = Math.sin(t * 1.7);
  rot("Spine1", AX.x, breath * 0.02);
  rot("Spine2", AX.x, breath * 0.015);

  // Dans: gövde sallanır
  const dance = A("dance");
  rot("Spine", AX.z, Math.sin(t * 7) * 0.13 * dance);
  rot("Spine1", AX.y, Math.sin(t * 3.5) * 0.15 * dance);

  // Gülme: gövde titrer, kafa geriye
  const laugh = A("laugh");
  rot("Spine2", AX.x, (Math.sin(t * 28) * 0.035 - 0.08) * laugh);

  // Utanma: hafif yana eğilme
  const shy = A("shy");
  rot("Spine2", AX.z, 0.08 * shy);

  // Kafa: fareyi takip + konuşma hareketi
  const yaw = look.x * 0.45 + Math.sin(t * 0.5) * 0.06;
  const pitch = -look.y * 0.22;
  rot("Neck", AX.y, yaw * 0.4);
  rot("Head", AX.y, yaw * 0.6 + Math.sin(t * 3.5) * 0.25 * dance);
  rot("Head", AX.x, pitch +
    talkAmt * (Math.sin(t * 11) * 0.045 + Math.sin(t * 6.7) * 0.03) +
    A("nod") * Math.sin(t * 9) * 0.18 +
    Math.sin(t * 7) * 0.12 * dance - 0.25 * laugh + 0.12 * shy);
  rot("Head", AX.z, talkAmt * Math.sin(t * 2.8) * 0.05 + 0.15 * shy + Math.sin(t * 7) * 0.12 * dance);

  // Sağ kol: konuşurken jest, el sallama, gösterme
  const wave = A("wave");
  const point = A("point");
  rot("RightArm", AX.x, -talkAmt * (0.12 + Math.sin(t * 4.2) * 0.12) - point * 0.35);
  rot("RightArm", AX.z, -2.1 * wave - (1.1 + Math.sin(t * 7) * 0.5) * dance);
  rot("RightForeArm", AX.z, Math.sin(t * 11) * 0.55 * wave);
  rot("RightForeArm", AX.y, talkAmt * Math.sin(t * 5) * 0.25);
  rot("RightHand", AX.x, talkAmt * Math.sin(t * 6.3) * 0.2);

  // Sol kol: dansta havaya
  rot("LeftArm", AX.z, (1.1 + Math.sin(t * 7 + Math.PI) * 0.5) * dance + 0.15 * laugh);
  rot("LeftForeArm", AX.x, -Math.sin(t * 7) * 0.4 * dance);

  // Koltuk hafifçe döner (oyuncu koltuğu)
  seat.rotation.y = Math.sin(t * 0.35) * 0.1 + Math.sin(t * 3.5) * 0.35 * dance;
  seat.position.y = Math.abs(Math.sin(t * 7)) * 0.03 * dance;
}

// Konuşma balonunu başın üstünde tut
const _proj = new THREE.Vector3();
function updateBubble() {
  if (!headAnchor || bubbleEl.classList.contains("hidden")) return;
  headAnchor.getWorldPosition(_proj);
  _proj.y += 0.12;
  _proj.project(camera);
  const r = stage.getBoundingClientRect();
  let x = (_proj.x * 0.5 + 0.5) * r.width;
  let y = (-_proj.y * 0.5 + 0.5) * r.height;
  const bw = bubbleEl.offsetWidth, bh = bubbleEl.offsetHeight;
  x = THREE.MathUtils.clamp(x, bw / 2 + 10, r.width - bw / 2 - 10);
  y = THREE.MathUtils.clamp(y, bh + 70, r.height - 10);
  bubbleEl.style.left = x + "px";
  bubbleEl.style.top = y + "px";
}

// ---------------------------------------------------------------------
//  BOYUT / DÖNGÜ
// ---------------------------------------------------------------------
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  composer.setSize(w, h);
  bloom.setSize(w, h);
  camera.aspect = w / h;
  // dar ekranda biraz uzaklaş
  camera.fov = w / h < 0.8 ? 50 : 38;
  camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage);
resize();

renderer.setAnimationLoop(() => {
  const dt = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  animateCharacter(t, dt);
  controls.update();
  composer.render();
  updateBubble();
});

// ---------------------------------------------------------------------
//  SOHBET ARAYÜZÜ
// ---------------------------------------------------------------------
const messagesEl = $("messages");
const form = $("chatForm");
const input = $("chatInput");
const sendBtn = form.querySelector(".send-btn");
let voiceOn = true;
let busy = false;
let bubbleTimer = null;

function addMessage(text, who) {
  const el = document.createElement("div");
  el.className = "msg " + who;
  el.innerHTML = `
    <div class="mini-avatar">${who === "bot" ? "🪲" : "🙂"}</div>
    <div><div class="who">${who === "bot" ? "BöcekAdam" : "Sen"}</div><div class="bubble"></div></div>`;
  el.querySelector(".bubble").textContent = text;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return el;
}

function showTyping() {
  const el = document.createElement("div");
  el.className = "msg bot typing";
  el.innerHTML = `<div class="mini-avatar">🪲</div><div class="bubble"><span></span><span></span><span></span></div>`;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return el;
}

function botSay(text, act) {
  addMessage(text, "bot");
  startAction(act);

  bubbleEl.textContent = text;
  bubbleEl.classList.remove("hidden");
  clearTimeout(bubbleTimer);

  talking = true;
  const fallbackDur = Math.max(1800, text.length * 60);
  const finish = () => {
    talking = false;
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(() => bubbleEl.classList.add("hidden"), 1500);
  };

  if (voiceOn && speak(text, finish)) {
    // konuşma bitince finish çağrılır; emniyet için zaman aşımı
    bubbleTimer = setTimeout(finish, fallbackDur + 6000);
  } else {
    bubbleTimer = setTimeout(finish, fallbackDur);
  }
}

// Tarayıcının Türkçe sesiyle konuştur (varsa)
function speak(text, onEnd) {
  if (!("speechSynthesis" in window)) return false;
  const voices = speechSynthesis.getVoices();
  const tr = voices.find((vv) => vv.lang && vv.lang.toLowerCase().startsWith("tr"));
  if (!tr) return false;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ""));
  u.voice = tr;
  u.lang = tr.lang;
  u.pitch = 1.35;
  u.rate = 1.08;
  u.onend = onEnd;
  u.onerror = onEnd;
  speechSynthesis.speak(u);
  return true;
}
if ("speechSynthesis" in window) speechSynthesis.getVoices(); // sesleri önceden yükle

function handleUserMessage(text) {
  text = text.trim();
  if (!text || busy) return;
  busy = true;
  sendBtn.disabled = true;
  addMessage(text, "user");
  spawnHearts(2);

  const typing = showTyping();
  const delay = 600 + Math.random() * 700;
  setTimeout(() => {
    typing.remove();
    const { text: reply, action: act } = getReply(text);
    botSay(reply, act);
    busy = false;
    sendBtn.disabled = false;
  }, delay);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  handleUserMessage(input.value);
  input.value = "";
});

$("quickReplies").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-q]");
  if (b) handleUserMessage(b.dataset.q);
});

$("voiceBtn").addEventListener("click", (e) => {
  voiceOn = !voiceOn;
  e.currentTarget.textContent = voiceOn ? "🔊" : "🔇";
  e.currentTarget.classList.toggle("off", !voiceOn);
  if (!voiceOn && "speechSynthesis" in window) speechSynthesis.cancel();
});

// ---------------------------------------------------------------------
//  CANLI YAYIN SÜSLERİ
// ---------------------------------------------------------------------
const heartsEl = $("hearts");
const HEARTS = ["❤️", "💜", "💖", "💗", "🩷", "💙"];
function spawnHearts(n = 1) {
  for (let i = 0; i < n; i++) {
    setTimeout(() => {
      const h = document.createElement("div");
      h.className = "heart";
      h.textContent = HEARTS[Math.floor(Math.random() * HEARTS.length)];
      h.style.right = 20 + Math.random() * 30 + "px";
      h.style.setProperty("--dx", (Math.random() * -80 + 20) + "px");
      heartsEl.appendChild(h);
      setTimeout(() => h.remove(), 2700);
    }, i * 120);
  }
}

let likes = 412700;
$("heartBtn").addEventListener("click", () => {
  spawnHearts(3);
  likes += 3;
  $("likeCount").textContent = (likes / 1000).toFixed(1) + "K";
  if (Math.random() < 0.25) startAction("shy");
});

$("followBtn").addEventListener("click", (e) => {
  const b = e.currentTarget;
  const f = b.classList.toggle("following");
  b.textContent = f ? "✓ Takip ediliyor" : "+ Takip Et";
  if (f) botSay("Ooo takip için eyvallah kral! Böcek ailesine hoş geldin 🪲💜", "wave");
});

// İzleyici sayısı canlı gibi oynasın
let viewers = 24800;
setInterval(() => {
  viewers += Math.round((Math.random() - 0.45) * 60);
  $("viewerCount").textContent = (viewers / 1000).toFixed(1) + "K";
  if (Math.random() < 0.35) spawnHearts(1);
}, 2500);
