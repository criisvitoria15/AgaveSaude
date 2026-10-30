import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroOrb3DProps {
  introDone: boolean;
  scrollProgressRef: React.MutableRefObject<number>;
}

export default function HeroOrb3D({
  introDone,
  scrollProgressRef,
}: HeroOrb3DProps) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const baseRef = useRef<HTMLDivElement | null>(null);
  const introDoneRef = useRef(introDone);

  useEffect(() => {
    introDoneRef.current = introDone;
  }, [introDone]);

  useEffect(() => {
    const box = boxRef.current;
    const mount = canvasMountRef.current;
    const hero = document.getElementById('hero');
    if (!box || !mount || !hero) return;

    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let R: THREE.WebGLRenderer | null = null;
    let frameId = 0;
    let timeoutId = 0;
    let resizeObs: ResizeObserver | null = null;
    let interObs: IntersectionObserver | null = null;

    function tex(
      w: number,
      h: number,
      fn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void
    ): THREE.CanvasTexture {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      if (ctx) fn(ctx, w, h);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }

    try {
      R = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
      R.setPixelRatio(
        isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.75)
      );
      R.outputColorSpace = THREE.SRGBColorSpace;
      R.toneMapping = THREE.ACESFilmicToneMapping;
      R.toneMappingExposure = 1.15;

      const cv = R.domElement;
      cv.setAttribute('aria-hidden', 'true');
      cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
      mount.innerHTML = '';
      mount.appendChild(cv);

      const S = new THREE.Scene();
      const C = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
      C.position.set(0, 0.6, 13.5);
      C.lookAt(0, -0.6, 0);

      const E = new THREE.Scene();
      E.background = new THREE.Color(0x070a08);
      const envLights: Array<
        [number, number, number, number, number, number, number]
      > = [
        [0xffd9a0, 7, 10, 3, -8, 6, 6],
        [0x2fb84f, 6, 3, 10, 9, 0, 2],
        [0xffffff, 4, 12, 2, 0, 9, -4],
        [0xc2a15f, 3, 8, 2, 0, -8, 6],
        [0x2fb84f, 2.5, 6, 3, -9, -3, -5],
      ];
      envLights.forEach((a) => {
        const m = new THREE.Mesh(
          new THREE.PlaneGeometry(a[2], a[3]),
          new THREE.MeshBasicMaterial({
            color: new THREE.Color(a[0]).multiplyScalar(a[1]),
            side: THREE.DoubleSide,
          })
        );
        m.position.set(a[4], a[5], a[6]);
        m.lookAt(0, 0, 0);
        E.add(m);
      });

      const pmrem = new THREE.PMREMGenerator(R);
      S.environment = pmrem.fromScene(E, 0.03).texture;
      pmrem.dispose();

      const gold = new THREE.MeshStandardMaterial({
        color: 0xd9b56a,
        metalness: 1,
        roughness: 0.22,
      });
      const emer = new THREE.MeshStandardMaterial({
        color: 0x0a3a1a,
        emissive: 0x2fb84f,
        emissiveIntensity: 1.2,
        metalness: 0.6,
        roughness: 0.3,
      });

      const world = new THREE.Group();
      S.add(world);
      const rings = new THREE.Group();
      world.add(rings);

      const glass = new THREE.Mesh(
        new THREE.SphereGeometry(2, 64, 48),
        new THREE.MeshPhysicalMaterial({
          color: 0x0d4a22,
          metalness: 0,
          roughness: 0.04,
          transparent: true,
          opacity: 0.3,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          envMapIntensity: 1.6,
          depthWrite: false,
        })
      );
      glass.renderOrder = 0;
      world.add(glass);

      const ring = (r: number, tb: number, m: THREE.Material) =>
        new THREE.Mesh(new THREE.TorusGeometry(r, tb, 14, 180), m);

      for (let i = 0; i < 4; i++) {
        const m = ring(2.03, 0.02, i % 2 ? gold : emer);
        m.rotation.y = (i * Math.PI) / 4;
        rings.add(m);
      }
      const eq = ring(2.03, 0.04, gold);
      eq.rotation.x = Math.PI / 2;
      rings.add(eq);

      [1, -1].forEach((y) => {
        const l = ring(1.73, 0.012, gold);
        l.rotation.x = Math.PI / 2;
        l.position.y = y;
        rings.add(l);
      });

      const beads: Array<{
        b: THREE.Mesh;
        a: number;
        r: number;
        s: number;
      }> = [];

      const orbitConfigs: Array<
        [
          number,
          number,
          THREE.Material,
          [number, number, number],
          number,
          number,
        ]
      > = [
        [2.75, 0.035, gold, [1.2, 0, -0.28], 0.9, 0xffffff],
        [2.4, 0.025, emer, [1.05, 0, 0.4], -1.3, 0xffd27a],
      ];

      orbitConfigs.forEach((o) => {
        const g = new THREE.Group();
        g.rotation.set(o[3][0], o[3][1], o[3][2]);
        g.add(ring(o[0], o[1], o[2]));
        const b = new THREE.Mesh(
          new THREE.SphereGeometry(0.09, 16, 16),
          new THREE.MeshBasicMaterial({ color: o[5] })
        );
        g.add(b);
        beads.push({ b, a: Math.random() * 6, r: o[0], s: o[4] });
        world.add(g);
      });

      const glow = tex(256, 256, (x, w, h) => {
        const g = x.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
        g.addColorStop(0, 'rgba(80,255,130,.9)');
        g.addColorStop(0.35, 'rgba(47,184,79,.35)');
        g.addColorStop(1, 'rgba(47,184,79,0)');
        x.fillStyle = g;
        x.fillRect(0, 0, w, h);
      });

      const hv = tex(512, 256, (x, w, h) => {
        x.font = '600 235px Georgia,"Cormorant Garamond",serif';
        x.textBaseline = 'middle';
        const a = x.measureText('H').width;
        const b = x.measureText('V').width;
        const x0 = (w - a - b - 10) / 2;
        x.shadowBlur = 40;
        x.shadowColor = '#c2a15f';
        x.fillStyle = '#e3b13c';
        x.fillText('H', x0, h / 2);
        x.shadowColor = '#2fb84f';
        x.fillStyle = '#22e060';
        x.fillText('V', x0 + a + 10, h / 2);
      });

      const sp = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glow,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0.22,
        })
      );
      sp.scale.set(4.6, 4.6, 1);
      sp.renderOrder = 1;
      world.add(sp);

      const dk = tex(128, 128, (x, w, h) => {
        const g = x.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
        g.addColorStop(0, 'rgba(2,12,6,.7)');
        g.addColorStop(0.6, 'rgba(2,12,6,.35)');
        g.addColorStop(1, 'rgba(2,12,6,0)');
        x.fillStyle = g;
        x.fillRect(0, 0, w, h);
      });

      const bk = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: dk,
          transparent: true,
          depthWrite: false,
        })
      );
      bk.scale.set(4.6, 4.6, 1);
      bk.renderOrder = 3;
      world.add(bk);

      const hs = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: hv,
          transparent: true,
          depthWrite: false,
          toneMapped: false,
        })
      );
      hs.scale.set(4.2, 2.1, 1);
      hs.renderOrder = 4;
      world.add(hs);

      const pl = new THREE.PointLight(0x2fb84f, 4, 10);
      world.add(pl);

      const ped = new THREE.Mesh(
        new THREE.CylinderGeometry(1.9, 2.1, 0.22, 64),
        new THREE.MeshStandardMaterial({
          color: 0x0b0f0c,
          metalness: 0.9,
          roughness: 0.25,
        })
      );
      ped.position.y = -3.05;
      world.add(ped);

      const rim = ring(2.0, 0.03, gold);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = -2.93;
      world.add(rim);

      const gd = new THREE.Mesh(
        new THREE.CircleGeometry(2.6, 48),
        new THREE.MeshBasicMaterial({
          map: glow,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          opacity: 0.7,
        })
      );
      gd.rotation.x = -Math.PI / 2;
      gd.position.y = -2.9;
      world.add(gd);

      S.add(new THREE.AmbientLight(0xffffff, 0.15));
      const dl = new THREE.DirectionalLight(0xffe2b0, 1.1);
      dl.position.set(-4, 6, 5);
      S.add(dl);

      const rs = () => {
        if (!box || !R) return;
        const w = box.clientWidth;
        const h = box.clientHeight;
        if (!w) return;
        R.setSize(w, h, false);
        C.aspect = w / h;
        C.updateProjectionMatrix();
      };
      rs();
      if (window.ResizeObserver) {
        resizeObs = new ResizeObserver(rs);
        resizeObs.observe(box);
      } else {
        window.addEventListener('resize', rs);
      }

      let ty = 0;
      let tx = 0;
      const onPointerMove = (e: PointerEvent) => {
        const r = hero.getBoundingClientRect();
        ty = ((e.clientX - r.left) / r.width - 0.5) * 0.6;
        tx = ((e.clientY - r.top) / r.height - 0.5) * 0.4;
      };
      hero.addEventListener('pointermove', onPointerMove);

      let vis = true;
      interObs = new IntersectionObserver((es) => {
        vis = es[0].isIntersecting;
      });
      interObs.observe(hero);

      R.render(S, C);
      box.classList.add('gl');
      if (baseRef.current) baseRef.current.style.display = 'none';

      const RM2 = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
      let t0 = performance.now();

      function afterDraw(cb: () => void) {
        if (!R) return;
        const gl = R.getContext() as WebGL2RenderingContext;
        if (!gl || typeof gl.fenceSync !== 'function') {
          timeoutId = window.setTimeout(cb, 80);
          return;
        }
        const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
        gl.flush();
        const poll = () => {
          const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
          if (state === gl.UNSIGNALED) {
            timeoutId = window.setTimeout(poll, 5);
          } else {
            if (sync) gl.deleteSync(sync);
            timeoutId = window.setTimeout(cb, 80);
          }
        };
        timeoutId = window.setTimeout(poll, 5);
      }

      const tick = () => {
        const now = performance.now();
        const dt = Math.min((now - t0) / 1000, 0.05);
        t0 = now;

        if (introDoneRef.current && vis && R) {
          if (!RM2) {
            rings.rotation.y += dt * 0.3;
            beads.forEach((o) => {
              o.a += dt * o.s;
              o.b.position.set(
                Math.cos(o.a) * o.r,
                Math.sin(o.a) * o.r,
                0
              );
            });
          }
          const spVal = scrollProgressRef.current || 0;
          C.position.z = 13.5 + spVal * 5;
          world.rotation.y += (ty + spVal * 2.2 - world.rotation.y) * 0.05;
          world.rotation.x += (tx - world.rotation.x) * 0.05;
          R.render(S, C);
        }

        if (isSoftwareGl) {
          afterDraw(tick);
        } else {
          frameId = requestAnimationFrame(tick);
        }
      };

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }

      return () => {
        cancelAnimationFrame(frameId);
        clearTimeout(timeoutId);
        hero.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('resize', rs);
        resizeObs?.disconnect();
        interObs?.disconnect();
        R?.dispose();
      };
    } catch (e) {
      console.warn('3D indisponível', e);
      return;
    }
  }, [scrollProgressRef]);

  return (
    <div className="hvis">
      <div className="orbwrap">
        <div className="orbbox" ref={boxRef}>
          <div className="orb" aria-hidden="true">
            <div className="core"></div>
            <div className="spin">
              <i className="m0"></i>
              <i className="m1"></i>
              <i className="m2"></i>
              <i className="m3"></i>
              <i className="eq"></i>
              <i className="la"></i>
              <i className="lb"></i>
            </div>
            <div className="spin2">
              <i></i>
              <i></i>
            </div>
            <b className="hv">
              <span className="g">H</span>V
            </b>
          </div>
          <div ref={canvasMountRef} />
        </div>
      </div>
      <div className="base" ref={baseRef}></div>
      <ul className="words">
        <li>Ciência</li>
        <li>Cuidado</li>
        <li>Estética</li>
        <li>Performance</li>
        <li>Longevidade</li>
      </ul>
    </div>
  );
}
