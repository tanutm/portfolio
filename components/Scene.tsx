"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const N = 16000;
const SECTIONS = 7;

function rnd(a = 0, b = 1) {
  return a + Math.random() * (b - a);
}
function gauss() {
  return (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 0.58;
}
function onSphere(r: number): [number, number, number] {
  const u = rnd(-1, 1), t = rnd(0, Math.PI * 2), s = Math.sqrt(1 - u * u);
  return [r * s * Math.cos(t), r * u, r * s * Math.sin(t)];
}

// Target shapes. Each returns N*3 floats.
function build(kind: number): Float32Array {
  const a = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    let p: [number, number, number] = [0, 0, 0];
    if (kind === 0) {
      // Hero: lattice shell with a dense inner core
      if (i % 5 === 0) p = onSphere(rnd(0.2, 2.2));
      else p = onSphere(3.3 + gauss() * 0.08);
    } else if (kind === 1) {
      // 352 operations: chaotic swarm
      const q = onSphere(Math.cbrt(Math.random()) * 5.2);
      p = [q[0] * 1.2, q[1], q[2]];
    } else if (kind === 2) {
      // 14 tools: ring of clusters around a core
      if (i % 8 === 0) p = onSphere(Math.cbrt(Math.random()) * 0.9);
      else {
        const k = i % 14, ang = (k / 14) * Math.PI * 2, R = 3.6;
        const c = [Math.cos(ang) * R, Math.sin(ang) * R * 0.55, Math.sin(ang * 2) * 0.6];
        const q = onSphere(Math.cbrt(Math.random()) * 0.42);
        p = [c[0] + q[0], c[1] + q[1], c[2] + q[2]];
        if (i % 9 === 0) {
          // spokes to core
          const t = Math.random();
          p = [c[0] * t, c[1] * t, c[2] * t];
        }
      }
    } else if (kind === 3) {
      // Review queue: funnel with a bright narrow outlet
      const t = Math.random(), y = 3.4 - t * 6.8;
      const r = 0.5 + 3.0 * Math.pow(1 - t, 1.6);
      const ang = rnd(0, Math.PI * 2) + t * 6;
      const rr = r * (0.85 + 0.15 * Math.random());
      p = [Math.cos(ang) * rr, y, Math.sin(ang) * rr];
    } else if (kind === 4) {
      // Internship: double helix pipeline
      const t = rnd(-1, 1), ang = t * 9.5 + (i % 2) * Math.PI;
      p = [t * 4.6, Math.cos(ang) * 1.5 + gauss() * 0.06, Math.sin(ang) * 1.5 + gauss() * 0.06];
      if (i % 7 === 0) p = [t * 4.6, rnd(-1.5, 1.5), 0];
    } else if (kind === 5) {
      // Foundations: stacked network layers
      const layer = i % 6, g = 16;
      const gx = (Math.floor(Math.random() * g) / (g - 1) - 0.5) * 5.6;
      const gy = (Math.floor(Math.random() * g) / (g - 1) - 0.5) * 5.6;
      p = [(layer - 2.5) * 1.5, gy + gauss() * 0.03, gx + gauss() * 0.03];
      if (i % 4 === 0) {
        const l2 = (layer + 1) % 6;
        const t = Math.random();
        p = [(layer - 2.5) * 1.5 + t * 1.5 * (l2 > layer ? 1 : -5), gy * (1 - t) , gx * (1 - t)];
      }
    } else {
      // Contact: converging orb with halo
      p = i % 3 === 0 ? onSphere(2.2 + gauss() * 0.03) : onSphere(Math.cbrt(Math.random()) * 1.1);
    }
    a[i * 3] = p[0];
    a[i * 3 + 1] = p[1];
    a[i * 3 + 2] = p[2];
  }
  return a;
}

const VERT = /* glsl */ `
attribute vec3 t0; attribute vec3 t1; attribute vec3 t2; attribute vec3 t3;
attribute vec3 t4; attribute vec3 t5; attribute vec3 t6; attribute float aRand;
uniform float uP; uniform float uTime; uniform float uSize; uniform float uPix;
uniform vec3 uColA; uniform vec3 uColB; uniform float uOffset;
varying vec3 vCol; varying float vAlpha;
vec3 getT(int k){
  if(k==0) return t0; if(k==1) return t1; if(k==2) return t2; if(k==3) return t3;
  if(k==4) return t4; if(k==5) return t5; return t6;
}
void main(){
  float p = clamp(uP, 0.0, 6.0);
  int i0 = int(floor(p)); int i1 = int(min(float(i0)+1.0, 6.0));
  float f = fract(p); if(i0==6) f=0.0;
  // stagger the morph per particle so it flows rather than snaps
  float s = smoothstep(0.0,1.0, clamp((f*1.6) - aRand*0.6, 0.0, 1.0));
  vec3 pos = mix(getT(i0), getT(i1), s);
  float turb = sin(f*3.14159) * (0.6 + aRand);
  pos += vec3(sin(uTime*0.7+aRand*40.0), cos(uTime*0.6+aRand*31.0), sin(uTime*0.5+aRand*17.0)) * (0.05 + 0.5*turb*aRand);
  pos.x += uOffset;
  vec4 mv = modelViewMatrix * vec4(pos,1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = max(1.6, uSize * uPix * (0.6 + aRand*1.2) * (10.0 / -mv.z));
  vCol = mix(uColA, uColB, aRand);
  vAlpha = 0.7 + 0.5*aRand;
}`;
const FRAG = /* glsl */ `
varying vec3 vCol; varying float vAlpha;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  a = pow(a, 1.4);
  gl_FragColor = vec4(vec3(1.0), a*vAlpha);
}`;

const PALETTES: [string, string][] = [
  ["#f4efe6", "#ff6a3d"],
  ["#9fb4d8", "#e9e4da"],
  ["#ff6a3d", "#fff3e0"],
  ["#e9e4da", "#ff5a2a"],
  ["#8fc1ff", "#f4efe6"],
  ["#c9d3e8", "#ff8b5c"],
  ["#fff3e0", "#ff6a3d"],
];

export default function Scene({ onSection }: { onSection: (p: number) => void }) {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mount.current!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const probe = document.createElement("canvas");
    if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) return;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    const pix = 1;
    renderer.setPixelRatio(1);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 11);

    const rt = new THREE.WebGLRenderTarget(64, 64, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter });
    const postScene = new THREE.Scene();
    const postCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const postMat = new THREE.ShaderMaterial({
      uniforms: { tD: { value: rt.texture }, uRes: { value: new THREE.Vector2(64, 64) }, uBg: { value: 0.3 } },
      vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
      fragmentShader: `varying vec2 vUv; uniform sampler2D tD; uniform vec2 uRes; uniform float uBg;
        float b2(vec2 a){ a=floor(a); return fract(a.x/2.0 + a.y*a.y*0.75); }
        float b4(vec2 a){ return b2(0.5*a)*0.25 + b2(a); }
        float b8(vec2 a){ return b4(0.5*a)*0.25 + b2(a); }
        void main(){
          float I = texture2D(tD, vUv).r;
          vec2 px = floor(vUv * uRes);
          float v = uBg + I * 0.8;
          float t = b8(px);
          float o = v > t ? 1.0 : 0.0;
          gl_FragColor = vec4(vec3(o), 1.0);
        }`,
      depthTest: false,
      depthWrite: false,
    });
    postScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMat));

    const geo = new THREE.BufferGeometry();
    const base = new Float32Array(N * 3);
    geo.setAttribute("position", new THREE.BufferAttribute(base, 3));
    for (let k = 0; k < SECTIONS; k++) geo.setAttribute("t" + k, new THREE.BufferAttribute(build(k), 3));
    const rand = new Float32Array(N);
    for (let i = 0; i < N; i++) rand[i] = Math.random();
    geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uP: { value: 0 }, uTime: { value: 0 }, uSize: { value: 3.2 }, uPix: { value: pix },
        uColA: { value: new THREE.Color(PALETTES[0][0]) }, uColB: { value: new THREE.Color(PALETTES[0][1]) },
        uOffset: { value: 0 },
      },
    });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    const group = new THREE.Group();
    group.add(pts);
    scene.add(group);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);

    const secEls = () => Array.from(document.querySelectorAll<HTMLElement>("[data-sec]"));
    let target = 0;
    const measure = () => {
      const els = secEls();
      if (!els.length) return;
      const y = window.scrollY + window.innerHeight * 0.5;
      let idx = 0;
      for (let i = 0; i < els.length; i++) if (y >= els[i].offsetTop) idx = i;
      const a = els[idx], b = els[idx + 1];
      const span = b ? b.offsetTop - a.offsetTop : a.offsetHeight;
      const frac = b ? Math.min(1, Math.max(0, (y - a.offsetTop) / span)) : 0;
      // hold each shape for the first part of its section, then morph
      const hold = 0.45;
      const m = frac < hold ? 0 : (frac - hold) / (1 - hold);
      target = Number.isFinite(idx + m) ? idx + m : 0;
    };
    window.addEventListener("scroll", measure, { passive: true });
    measure();

    let gx = 0, gy = 0, gs = 1;
    const resize = () => {
      const w = Math.max(1, window.innerWidth), h = Math.max(1, window.innerHeight);
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const cell = w > 900 ? 3 : 2;
      const rw = Math.ceil(w / cell), rh = Math.ceil(h / cell);
      rt.setSize(rw, rh);
      postMat.uniforms.uRes.value.set(rw, rh);
      mat.uniforms.uPix.value = 1 / cell;
      mat.uniforms.uOffset.value = 0;
      if (w > 900) { gx = 3.1; gy = -0.2; gs = 0.72; } else { gx = 0; gy = 4.4; gs = 0.9; }
      mat.uniforms.uSize.value = w > 900 ? 5.5 : 5.5;
      camera.position.z = w > 900 ? 11 : 20;
    };
    resize();
    window.addEventListener("resize", resize);
    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    let cur = 0, last = performance.now(), raf = 0, lastReport = -1;
    const cA = new THREE.Color(), cB = new THREE.Color(), tA = new THREE.Color(), tB = new THREE.Color();
    const loop = (now: number) => {
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now;
      cur += (target - cur) * (reduce ? 1 : 1 - Math.pow(0.0015, dt));
      if (!Number.isFinite(cur)) cur = 0;
      cur = Math.max(0, Math.min(SECTIONS - 1, cur));
      mat.uniforms.uP.value = cur;
      mat.uniforms.uTime.value = reduce ? 0 : now / 1000;

      const i0 = Math.max(0, Math.min(SECTIONS - 1, Math.floor(cur))), i1 = Math.min(SECTIONS - 1, i0 + 1), f = cur - i0;
      cA.set(PALETTES[i0][0]); tA.set(PALETTES[i1][0]); cA.lerp(tA, f);
      cB.set(PALETTES[i0][1]); tB.set(PALETTES[i1][1]); cB.lerp(tB, f);
      mat.uniforms.uColA.value.copy(cA);
      mat.uniforms.uColB.value.copy(cB);

      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      group.position.set(gx, gy, 0);
      group.scale.setScalar(gs);
      group.rotation.y = (reduce ? 0 : now / 1000 * 0.05) + mouse.x * 0.25 + cur * 0.35;
      group.rotation.x = mouse.y * 0.15 + Math.sin(cur) * 0.1;
      if (Math.abs(cur - lastReport) > 0.01) {
        lastReport = cur;
        onSection(cur);
      }
      renderer.setRenderTarget(rt);
      renderer.render(scene, camera);
      renderer.setRenderTarget(null);
      renderer.render(postScene, postCam);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", resize);
      ro.disconnect();
      rt.dispose();
      postMat.dispose();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [onSection]);

  return <div ref={mount} className="scene" aria-hidden="true" />;
}
