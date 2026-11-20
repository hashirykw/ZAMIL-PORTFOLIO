// figure.js: a hand-built 3D figure of Zamil for the HELLO block.
// Black Nexlyr polo with the blue trim, blue stripes and the Nexlyr mark, dark jeans, wavy hair,
// thick black glasses, and his Sony alpha held in both hands.
// It turns slowly on a round plinth; drag (or swipe) to spin it. Loaded only when the block comes near the screen.
import * as THREE from './vendor/three/three.min.js';
import { RoundedBoxGeometry } from './vendor/three/RoundedBoxGeometry.js';

export function mountFigure(box) {
  const canvas = document.createElement('canvas');
  canvas.className = 'fig3d';
  canvas.setAttribute('aria-hidden', 'true');
  box.appendChild(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 3 / 4, .1, 50);
  camera.position.set(0, 1.2, 6.6);
  camera.lookAt(0, 1.02, 0);

  /* light: soft studio key, a fill, a blue rim (the Nexlyr colour) and a red kicker (the page accent) */
  scene.add(new THREE.HemisphereLight(0xfff7ee, 0x3a3634, 1.25));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(2.2, 4.2, 3.2); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  Object.assign(key.shadow.camera, { left: -1.4, right: 1.4, top: 2.6, bottom: -.4, near: .5, far: 12 });
  key.shadow.radius = 3; key.shadow.bias = -.0006;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x2a8fe8, 2.2); rim.position.set(-3, 2.4, -2.6); scene.add(rim);
  const kick = new THREE.DirectionalLight(0xe3262b, .9); kick.position.set(3, .6, -3); scene.add(kick);

  /* materials */
  const M = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: .62, metalness: 0, ...o });
  const skin = M(0xdba886, { roughness: .55 });
  const polo = M(0x121214, { roughness: .82 });
  const blue = M(0x1b8be2, { roughness: .45, emissive: 0x0a3f78, emissiveIntensity: .25, side: THREE.DoubleSide });
  const jeans = M(0x24262d, { roughness: .9 });
  const jeansDeep = M(0x1b1c21, { roughness: .92 });
  const shoe = M(0x1a1a1c, { roughness: .6 });
  const sole = M(0xeae6de, { roughness: .7 });
  const grey = M(0x77767a, { roughness: .6 });
  const hair = M(0x1a1310, { roughness: .8 });
  const dark = M(0x111111, { roughness: .4 });
  const white = M(0xffffff, { roughness: .2 });
  const rimMat = M(0x0b0b0c, { roughness: .32 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x9fb4c4, roughness: .05, metalness: .2, transparent: true, opacity: .16, depthWrite: false });
  const ink = M(0x111111, { roughness: .9 });
  const red = M(0xe3262b, { roughness: .5 });
  const body = M(0x161617, { roughness: .5 });
  const rubber = M(0x232324, { roughness: .85 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x9a9a9c, metalness: .85, roughness: .3 });
  const lensGlass = new THREE.MeshStandardMaterial({ color: 0x0a1622, metalness: .9, roughness: .08, emissive: 0x0b2a44, emissiveIntensity: .35 });

  const fig = new THREE.Group();
  scene.add(fig);
  const add = (geo, mat, x = 0, y = 0, z = 0, parent = fig) => {
    const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
  };
  const lathe = (pts, seg = 40) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  const DOWN = V(0, -1, 0);
  // a group at a whose -y axis points at b, for limbs
  const bone = (parent, a, b) => {
    const g = new THREE.Group(); g.position.copy(a);
    const d = b.clone().sub(a); g.quaternion.setFromUnitVectors(DOWN, d.clone().normalize());
    parent.add(g); return { g, len: d.length() };
  };
  // small text label drawn on a canvas, for SONY and NEXLYR
  const label = (text, w, h, font, color = '#fff') => {
    const c = document.createElement('canvas'); c.width = 512; c.height = Math.round(512 * h / w);
    const x = c.getContext('2d');
    x.fillStyle = color; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = font.replace('{px}', Math.round(c.height * .78) + 'px'); x.fillText(text, c.width / 2, c.height / 2 + 2);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: .5, depthWrite: false }));
  };

  /* plinth */
  const plinth = add(new THREE.CylinderGeometry(.82, .86, .1, 64), ink, 0, -.05, 0); plinth.castShadow = false;
  add(new THREE.TorusGeometry(.84, .012, 8, 96), red, 0, 0, 0).rotation.x = Math.PI / 2;

  /* sneakers: dark upper, white sole */
  for (const s of [-1, 1]) {
    const sh = new THREE.Group(); sh.position.set(s * .15, 0, .04); sh.rotation.y = s * .1; fig.add(sh);
    add(new RoundedBoxGeometry(.18, .06, .4, 3, .025), sole, 0, .03, .02, sh);
    add(new RoundedBoxGeometry(.165, .11, .34, 4, .055), shoe, 0, .11, 0, sh);
    add(new RoundedBoxGeometry(.15, .07, .15, 3, .03), shoe, 0, .17, -.08, sh);
    add(new RoundedBoxGeometry(.05, .07, .03, 2, .01), grey, 0, .15, -.18, sh);
  }

  /* dark jeans: straight legs, a little break at the ankle */
  for (const s of [-1, 1]) {
    const leg = add(lathe([[0, 0], [.118, 0], [.128, .05], [.124, .2], [.128, .4], [.138, .6], [.15, .78], [.155, .9], [0, .9]]), jeans, s * .15, .15, 0);
    leg.rotation.z = s * .02;
    add(new THREE.TorusGeometry(.122, .014, 8, 32), jeansDeep, s * .15, .19, 0).rotation.x = Math.PI / 2;
  }
  add(lathe([[0, 0], [.29, 0], [.295, .1], [.28, .14], [0, .14]]), jeans, 0, .96, 0).scale.z = .62;

  /* polo: torso lathe, blue collar trim and placket, Nexlyr mark, blue stripes on the lower front */
  const torso = new THREE.Group(); torso.position.y = 1.02; fig.add(torso);
  const R = [[0, 0], [.31, 0], [.305, .1], [.29, .25], [.297, .4], [.305, .5], [.29, .58], [.24, .65], [.16, .7], [.1, .72], [0, .725]];
  const ZS = .7;
  add(lathe(R, 48), polo, 0, 0, 0, torso).scale.z = ZS;
  const rAt = y => { for (let i = 1; i < R.length; i++) { const [r1, y1] = R[i], [r0, y0] = R[i - 1]; if (y <= y1) return r0 + (r1 - r0) * (y - y0) / ((y1 - y0) || 1); } return .3; };
  // point on the shirt front at (x, y), and its turn to face outwards
  const onShirt = (x, y, lift = .004) => {
    const r = rAt(y), zz = ZS * Math.sqrt(Math.max(0, r * r - x * x));
    return { z: zz + lift, ry: Math.atan2(x / (r * r), zz / ((r * ZS) ** 2)) };
  };
  add(new RoundedBoxGeometry(.045, .2, .01, 2, .004), blue, 0, .55, onShirt(0, .55).z, torso);   // placket
  for (const y of [.6, .52]) add(new THREE.SphereGeometry(.009, 10, 8), dark, 0, y, onShirt(0, y).z + .008, torso);
  for (const s of [-1, 1]) {   // collar points with the blue edge
    const c = add(new RoundedBoxGeometry(.15, .1, .02, 2, .008), polo, s * .07, .67, .17, torso);
    c.rotation.set(-.3, 0, s * -.7);
    const tip = add(new RoundedBoxGeometry(.15, .012, .022, 1, .004), blue, s * .083, .64, .182, torso);
    tip.rotation.set(-.3, 0, s * -.7);
  }
  add(new THREE.TorusGeometry(.1, .022, 10, 36), polo, 0, .71, -.005, torso).rotation.x = Math.PI / 2;   // collar band
  add(new THREE.TorusGeometry(.106, .007, 8, 36), blue, 0, .725, -.005, torso).rotation.x = Math.PI / 2;

  const markTex = new THREE.TextureLoader().load('nexlyr-mark.png'); markTex.colorSpace = THREE.SRGBColorSpace; markTex.anisotropy = 4;
  const mp = onShirt(.15, .5, .006);
  const mark = new THREE.Mesh(new THREE.PlaneGeometry(.085, .085), new THREE.MeshStandardMaterial({ map: markTex, transparent: true, roughness: .5 }));
  mark.position.set(.15, .5, mp.z); mark.rotation.y = mp.ry; torso.add(mark);
  const word = label('NEXLYR', .11, .024, '700 {px} Archivo, Arial, sans-serif');
  const wp = onShirt(.15, .44, .006); word.position.set(.15, .44, wp.z); word.rotation.y = wp.ry; torso.add(word);

  [[.05, .14, .09], [.11, .2, .12], [.17, .27, .11], [.22, .16, .1], [.13, .09, .08], [.25, .33, .07]].forEach(([x, y, w]) => {
    const p = onShirt(x, y, .005);
    const st = add(new THREE.PlaneGeometry(w, .016), blue, x, y, p.z, torso);
    st.rotation.set(0, p.ry, .55); st.castShadow = false;
  });

  /* neck */
  add(new THREE.CylinderGeometry(.066, .076, .16, 24), skin, 0, .76, 0, torso);

  /* the Sony alpha, held at chest height with the lens towards the viewer */
  const cam = new THREE.Group(); cam.position.set(0, .3, .4); cam.rotation.x = -.06; cam.scale.setScalar(1.25); torso.add(cam);
  add(new RoundedBoxGeometry(.28, .16, .075, 3, .014), body, 0, 0, 0, cam);
  add(new RoundedBoxGeometry(.075, .15, .115, 3, .026), rubber, -.105, -.005, .022, cam);           // grip (his right hand)
  add(new RoundedBoxGeometry(.1, .065, .085, 3, .016), body, .012, .1, -.004, cam);                // viewfinder hump
  add(new RoundedBoxGeometry(.05, .01, .04, 1, .003), metal, .012, .137, -.004, cam);              // hot shoe
  add(new THREE.CylinderGeometry(.02, .02, .022, 20), body, -.075, .09, -.005, cam);               // dials
  add(new THREE.CylinderGeometry(.018, .018, .02, 20), body, .085, .09, -.005, cam);
  add(new THREE.CylinderGeometry(.012, .012, .016, 16), metal, -.11, .083, .05, cam);              // shutter button
  add(new RoundedBoxGeometry(.07, .05, .012, 2, .006), dark, .012, .1, -.05, cam);                  // eyecup
  const lens = new THREE.Group(); lens.position.set(.02, -.012, .037); lens.rotation.x = Math.PI / 2; cam.add(lens);
  add(new THREE.CylinderGeometry(.064, .064, .018, 40), metal, 0, .009, 0, lens);                   // mount
  add(new THREE.CylinderGeometry(.06, .062, .13, 40), body, 0, .08, 0, lens);                       // barrel
  add(new THREE.CylinderGeometry(.064, .064, .05, 40), rubber, 0, .1, 0, lens);                     // focus ring
  add(new THREE.CylinderGeometry(.061, .06, .012, 40), M(0x2b2b2c, { roughness: .4 }), 0, .15, 0, lens);
  const front = add(new THREE.CircleGeometry(.047, 40), lensGlass, 0, .1565, 0, lens); front.rotation.x = -Math.PI / 2;
  add(new THREE.CircleGeometry(.012, 20), M(0x5e86a8, { roughness: .05, metalness: .6 }), .015, .157, -.016, lens).rotation.x = -Math.PI / 2;   // glint
  const sony = label('SONY', .075, .02, '700 {px} Arial Black, Arial, sans-serif'); sony.position.set(.012, .052, .0385); cam.add(sony);
  const alpha = label('α', .022, .022, '400 {px} Georgia, serif'); alpha.position.set(.112, .045, .0385); cam.add(alpha);

  /* arms: short blue-trimmed sleeves, elbows bent, both hands on the camera */
  const hands = { [-1]: V(-.2, .3, .41), [1]: V(.2, .28, .415) };
  for (const s of [-1, 1]) {
    const sh = V(s * .3, .57, 0), el = V(s * .34, .2, .06), hd = hands[s];
    const up = bone(torso, sh, el);
    add(lathe([[0, .07], [.06, .06], [.095, .03], [.108, -.02], [.106, -.1], [.1, -.2], [0, -.2]], 28), polo, 0, 0, 0, up.g);
    add(new THREE.TorusGeometry(.098, .012, 8, 28), blue, 0, -.19, 0, up.g).rotation.x = Math.PI / 2;
    add(new THREE.CapsuleGeometry(.058, up.len - .16, 6, 16), skin, 0, -(up.len / 2 + .05), 0, up.g);
    add(new THREE.SphereGeometry(.058, 16, 12), skin, el.x, el.y, el.z, torso);
    const fo = bone(torso, el, hd);
    add(new THREE.CapsuleGeometry(.052, fo.len - .06, 6, 16), skin, 0, -fo.len / 2, 0, fo.g);
    add(new THREE.SphereGeometry(.064, 16, 12), skin, hd.x, hd.y, hd.z, torso).scale.set(.8, 1.05, 1.1);
    // fingers wrapped round the front of the body
    const f = add(new RoundedBoxGeometry(.075, .09, .032, 2, .014), skin, s * .165, s < 0 ? .29 : .275, .465, torso);
    f.rotation.set(0, s * .25, s * -.12);
  }
  add(new THREE.CapsuleGeometry(.012, .035, 4, 8), skin, -.14, .415, .45, torso).rotation.z = Math.PI / 2 - .2;   // right index on the shutter

  /* head: toy proportions, wavy hair with a fringe, thick black glasses */
  const head = new THREE.Group(); head.position.set(0, .99, .01); head.scale.setScalar(1.15); torso.add(head);
  add(new THREE.SphereGeometry(.2, 40, 32), skin, 0, 0, 0, head).scale.set(.88, 1.06, .95);
  for (const s of [-1, 1]) {
    add(new THREE.SphereGeometry(.042, 16, 12), skin, s * .172, -.02, -.01, head).scale.set(.5, 1, .8);   // ears
    const eye = add(new THREE.SphereGeometry(.022, 16, 12), dark, s * .068, .018, .168, head); eye.scale.set(1.15, .85, .6);
    add(new THREE.SphereGeometry(.006, 8, 6), white, s * .068 + .007, .025, .179, head);
    const brow = add(new RoundedBoxGeometry(.075, .022, .02, 2, .008), hair, s * .07, .08, .17, head); brow.rotation.z = s * -.08;
  }
  add(new THREE.SphereGeometry(.024, 14, 10), skin, 0, -.035, .19, head).scale.set(.9, 1.15, .9);   // nose
  add(new RoundedBoxGeometry(.05, .016, .012, 2, .006), M(0xb4766a), 0, -.108, .17, head);           // lips

  // glasses: thick rounded-square rims, a heavier top bar, bridge and arms
  for (const s of [-1, 1]) {
    const rimMesh = add(new THREE.TorusGeometry(.044, .011, 10, 36), rimMat, s * .07, .02, .195, head); rimMesh.scale.set(1.18, .98, 1);
    const ln = add(new THREE.CircleGeometry(.044, 32), glass, s * .07, .02, .193, head); ln.scale.set(1.18, .98, 1); ln.castShadow = false;
    add(new RoundedBoxGeometry(.11, .02, .016, 2, .006), rimMat, s * .072, .058, .196, head);
    add(new RoundedBoxGeometry(.03, .018, .014, 1, .005), rimMat, s * .14, .05, .19, head);   // hinge
    const arm = add(new RoundedBoxGeometry(.012, .014, .2, 1, .004), rimMat, s * .158, .045, .09, head); arm.rotation.y = s * -.04;
  }
  add(new RoundedBoxGeometry(.04, .012, .012, 1, .004), rimMat, 0, .035, .2, head);

  // hair: a cap, then curls over the top, sides and back, and a fringe over the forehead
  const cap = add(new THREE.SphereGeometry(.208, 36, 24, 0, Math.PI * 2, 0, Math.PI * .5), hair, 0, .035, -.02, head);
  cap.scale.set(.95, .98, 1.02); cap.rotation.x = -.32;
  add(new THREE.SphereGeometry(.2, 32, 20, 0, Math.PI * 2, Math.PI * .35, Math.PI * .4), hair, 0, -.01, -.05, head).scale.set(.95, 1.05, .9);
  let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 46; i++) {
    const az = rnd() * Math.PI * 2, el = -.5 + rnd() * 2.05;
    const d = V(Math.cos(el) * Math.sin(az), Math.sin(el), Math.cos(el) * Math.cos(az));
    if (d.z > .15 && el < .6) continue;            // keep the face clear
    if (el < 0 && d.z > -.3) continue;             // nothing hanging over the cheeks
    const r = .075 + rnd() * .03;
    const c = add(new THREE.SphereGeometry(r, 20, 14), hair, d.x * .19 * .95, .03 + d.y * .185, -.025 + d.z * .19, head);
    c.scale.set(1.05, .75 + rnd() * .2, 1); c.rotation.set(rnd() * .6, rnd() * 3, rnd() * .6);
  }
  // the fringe: soft waves falling forward over the forehead, heavier on his right
  [[-.115, .118, .11, .07, -.5], [-.055, .128, .135, .074, -.6], [.005, .13, .14, .074, -.65], [.065, .124, .13, .07, -.55], [.12, .11, .1, .064, -.45],
   [-.085, .092, .15, .05, -.9], [-.025, .1, .162, .05, -.95], [.04, .096, .158, .046, -.9]]
    .forEach(([x, y, z, r, rx]) => { const h = add(new THREE.SphereGeometry(r, 20, 14), hair, x, y, z, head); h.scale.set(1.15, .72, .9); h.rotation.x = rx; });
  for (const s of [-1, 1]) add(new THREE.SphereGeometry(.08, 20, 14), hair, s * .16, .02, -.035, head).scale.set(.6, 1.15, 1.1);   // volume over the ears

  /* interaction: slow turn, drag to spin with inertia */
  let angle = -.35, vel = 0, dragging = false, lastX = 0, lastT = 0;
  const autoSpeed = .32;   // radians per second
  canvas.style.touchAction = 'pan-y';
  canvas.addEventListener('pointerdown', e => { dragging = true; lastX = e.clientX; lastT = performance.now(); vel = 0; canvas.setPointerCapture(e.pointerId); box.classList.add('is-drag'); });
  canvas.addEventListener('pointermove', e => {
    if (!dragging) return;
    const now = performance.now(), dx = e.clientX - lastX;
    angle += dx * .012; vel = dx * .012 / Math.max(1, now - lastT) * 1000; lastX = e.clientX; lastT = now;
  });
  const up = () => { dragging = false; box.classList.remove('is-drag'); };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);

  /* size + render loop (paused off-screen) */
  const resize = () => {
    const w = box.clientWidth, h = box.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    camera.fov = w / h < .7 ? 28 : 26; camera.updateProjectionMatrix();
  };
  new ResizeObserver(resize).observe(box); resize();
  let running = false, raf = 0, prev = performance.now();
  const clock = performance.now();
  function frame(now) {
    const dt = Math.min(.05, (now - prev) / 1000); prev = now;
    if (!dragging) { vel *= Math.pow(.04, dt); angle += (autoSpeed + vel) * dt; }
    fig.rotation.y = angle;
    const t = (now - clock) / 1000;
    torso.position.y = 1.02 + Math.sin(t * 1.7) * .006;            // breathing
    head.rotation.z = Math.sin(t * .6) * .035;
    head.rotation.x = Math.sin(t * .45) * .03;
    renderer.render(scene, camera);
    raf = running ? requestAnimationFrame(frame) : 0;
  }
  new IntersectionObserver(es => {
    const on = es[0].isIntersecting;
    if (on && !running) { running = true; prev = performance.now(); raf = requestAnimationFrame(frame); box.classList.add('is-3d'); }
    else if (!on) { running = false; cancelAnimationFrame(raf); }
  }, { rootMargin: '120px' }).observe(box);

}
