import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { computeDroneCameraPose, DroneSceneMode } from '../utils/schedule';

interface FacadeDroneShowcaseProps {
  scrollProgress?: number;
}

/**
 * Prepares the clean texture for the "729 Marquise" photo by cropping out the
 * rightmost 11.8% where Instagram Reels icons (heart 55 / comment 16) were overlaid,
 * while preserving the entire 729 overhang and AGAVÊ SAÚDE E PERFORMANCE sign.
 */
function buildCleanMarquiseCanvas(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 860;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Crop at 88.2% width so the white Reels heart/comment icons on the right edge are 100% excluded
  const safeCropWidth = Math.floor(img.naturalWidth * 0.882);
  ctx.filter = 'contrast(1.06) saturate(1.08) brightness(1.06)';
  ctx.drawImage(
    img,
    0,
    0,
    safeCropWidth,
    img.naturalHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );
  ctx.filter = 'none';

  return canvas;
}

/**
 * Prepares the texture for the "Chegada Agavê" vertical photo in a cinematic 3D frame,
 * keeping both the AGAVÊ SAÚDE E PERFORMANCE sign and the luxury car in the foreground visible.
 */
function buildArrivalCanvas(img: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1280;
  canvas.height = 860;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Ambient blurred travertine backdrop on the sides
  ctx.filter = 'blur(22px) brightness(0.72) saturate(0.95)';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  ctx.filter = 'none';

  // Draw the vertical photo preserving both the AGAVÊ sign at top and the luxury car at bottom
  const sy = Math.floor(img.naturalHeight * 0.06);
  const sh = Math.floor(img.naturalHeight * 0.90);
  const targetWidth = Math.floor(canvas.width * 0.82);
  const offsetX = Math.floor((canvas.width - targetWidth) * 0.5);

  ctx.filter = 'contrast(1.06) saturate(1.02) brightness(1.04)';
  ctx.drawImage(
    img,
    0,
    sy,
    img.naturalWidth,
    sh,
    offsetX,
    0,
    targetWidth,
    canvas.height
  );
  ctx.filter = 'none';

  return canvas;
}

/**
 * Generates a smooth architectural 3D depth map for either 'marquise' or 'chegada' mode.
 * Brighter pixels (closer to 255) project closer to the drone camera in 3D space.
 */
function buildDepthMapCanvas(mode: 'marquise' | 'chegada'): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 172;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.fillStyle = '#181818';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (mode === 'marquise') {
    // Base wall perspective gradient (closer on the center pillar, receding to left/right)
    const wallGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    wallGrad.addColorStop(0, '#383838');
    wallGrad.addColorStop(0.48, '#8c8c8c');
    wallGrad.addColorStop(1, '#545454');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 22, canvas.width, canvas.height - 22);

    // Recessed entrance door on bottom-left
    ctx.fillStyle = '#2b2b2b';
    ctx.fillRect(10, 82, 82, 90);

    // Travertine central column & AGAVÊ wall on right
    const travGrad = ctx.createLinearGradient(110, 45, 250, 140);
    travGrad.addColorStop(0, '#a8a8a8');
    travGrad.addColorStop(0.5, '#868686');
    travGrad.addColorStop(1, '#585858');
    ctx.fillStyle = travGrad;
    ctx.beginPath();
    ctx.moveTo(100, 50);
    ctx.lineTo(256, 85);
    ctx.lineTo(256, 172);
    ctx.lineTo(95, 172);
    ctx.closePath();
    ctx.fill();

    // Projecting 3D "729" overhang marquee box (projects strongly toward camera)
    const marqueeGrad = ctx.createLinearGradient(35, 6, 195, 92);
    marqueeGrad.addColorStop(0, '#ffffff');
    marqueeGrad.addColorStop(0.45, '#e2e2e2');
    marqueeGrad.addColorStop(1, '#9e9e9e');
    ctx.fillStyle = marqueeGrad;
    ctx.beginPath();
    ctx.moveTo(64, 2);
    ctx.lineTo(206, 78);
    ctx.lineTo(188, 102);
    ctx.lineTo(18, 66);
    ctx.closePath();
    ctx.fill();
  } else {
    // 'chegada' mode: AGAVÊ wall in perspective + foreground luxury car in bottom-right
    const bgWall = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgWall.addColorStop(0, '#6a6a6a');
    bgWall.addColorStop(0.6, '#525252');
    bgWall.addColorStop(1, '#3c3c3c');
    ctx.fillStyle = bgWall;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Raised 3D AGAVÊ emblem region
    ctx.fillStyle = '#7c7c7c';
    ctx.fillRect(72, 18, 168, 76);

    // Foreground luxury car silhouette (strong forward parallax)
    const carGrad = ctx.createLinearGradient(0, 88, canvas.width, canvas.height);
    carGrad.addColorStop(0, '#c8c8c8');
    carGrad.addColorStop(0.5, '#f0f0f0');
    carGrad.addColorStop(1, '#ffffff');
    ctx.fillStyle = carGrad;
    ctx.beginPath();
    ctx.moveTo(0, 120);
    ctx.quadraticCurveTo(95, 108, 165, 86);
    ctx.quadraticCurveTo(215, 68, 256, 64);
    ctx.lineTo(256, 172);
    ctx.lineTo(0, 172);
    ctx.closePath();
    ctx.fill();
  }

  // Blur depth map so 3D mesh displacement has smooth architectural bevels without tearing
  const blurred = document.createElement('canvas');
  blurred.width = canvas.width;
  blurred.height = canvas.height;
  const bctx = blurred.getContext('2d');
  if (bctx) {
    bctx.filter = 'blur(8px)';
    bctx.drawImage(canvas, 0, 0);
    bctx.filter = 'none';
  }
  return blurred;
}

const VERTEX_SHADER = `
  uniform sampler2D uDepthMap;
  uniform float uDepthScale;
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    vUv = uv;
    float d = texture2D(uDepthMap, uv).r;
    vDepth = d;
    vec3 displaced = position + normal * ((d - 0.45) * uDepthScale);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  uniform sampler2D uColorMap;
  uniform sampler2D uDepthMap;
  uniform float uTime;
  uniform float uSpotIntensity;
  uniform float uFocusDepth;
  uniform float uMode; // 0.0 = marquise, 1.0 = chegada
  varying vec2 vUv;
  varying float vDepth;

  void main() {
    // Subtle rack-focus / chromatic depth cue based on distance from focus plane
    float focusDiff = abs(vDepth - uFocusDepth);
    vec2 uvOffset = vec2(focusDiff * 0.0018, 0.0);

    vec4 baseSample = texture2D(uColorMap, vUv);
    float rChan = texture2D(uColorMap, clamp(vUv + uvOffset, 0.002, 0.998)).r;
    float bChan = texture2D(uColorMap, clamp(vUv - uvOffset, 0.002, 0.998)).b;
    vec3 color = vec3(rChan, baseSample.g, bChan);

    // Warm architectural spotlight glow under the 729 overhang in marquise mode
    if (uMode < 0.5) {
      vec2 s1 = vUv - vec2(0.365, 0.715);
      vec2 s2 = vUv - vec2(0.252, 0.595);
      vec2 s3 = vUv - vec2(0.520, 0.585);
      vec2 s4 = vUv - vec2(0.402, 0.495);

      float g1 = exp(-dot(s1, s1) * 180.0);
      float g2 = exp(-dot(s2, s2) * 180.0);
      float g3 = exp(-dot(s3, s3) * 180.0);
      float g4 = exp(-dot(s4, s4) * 180.0);

      float spots = (g1 + g2 + g3 + g4) * uSpotIntensity;
      vec3 warmGold = vec3(0.96, 0.79, 0.46);
      color += warmGold * spots * 0.34;

      // Subtle moving sunlight/gold sheen across the AGAVÊ sign
      float sheenPos = fract(uTime * 0.08);
      float sheenBand = exp(-pow((vUv.x * 0.7 + vUv.y * 0.3) - sheenPos, 2.0) * 45.0);
      color += vec3(0.76, 0.63, 0.37) * sheenBand * 0.08;
    } else {
      // Subtle specular reflection sweep across the car & AGAVÊ wall in chegada mode
      float sweep = sin(vUv.x * 6.0 - uTime * 0.9 + vUv.y * 3.0) * 0.5 + 0.5;
      color += vec3(0.76, 0.63, 0.37) * pow(sweep, 5.0) * 0.06;
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function FacadeDroneShowcase({
  scrollProgress = 0,
}: FacadeDroneShowcaseProps) {
  const [sceneMode, setSceneMode] = useState<DroneSceneMode>('marquise');
  const [autoPilot, setAutoPilot] = useState(true);
  const [texturesReady, setTexturesReady] = useState(false);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const modeRef = useRef<DroneSceneMode>(sceneMode);
  const autoPilotRef = useRef<boolean>(autoPilot);
  const scrollRef = useRef<number>(scrollProgress);

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const texturesRef = useRef<{
    marquiseColor?: THREE.CanvasTexture;
    marquiseDepth?: THREE.CanvasTexture;
    chegadaColor?: THREE.CanvasTexture;
    chegadaDepth?: THREE.CanvasTexture;
  }>({});

  useEffect(() => {
    modeRef.current = sceneMode;
    const mat = materialRef.current;
    const tex = texturesRef.current;
    if (!mat) return;

    if (sceneMode === 'marquise' && tex.marquiseColor && tex.marquiseDepth) {
      mat.uniforms.uColorMap.value = tex.marquiseColor;
      mat.uniforms.uDepthMap.value = tex.marquiseDepth;
      mat.uniforms.uMode.value = 0.0;
      mat.uniforms.uDepthScale.value = 1.05;
      mat.needsUpdate = true;
    } else if (
      sceneMode === 'chegada' &&
      tex.chegadaColor &&
      tex.chegadaDepth
    ) {
      mat.uniforms.uColorMap.value = tex.chegadaColor;
      mat.uniforms.uDepthMap.value = tex.chegadaDepth;
      mat.uniforms.uMode.value = 1.0;
      mat.uniforms.uDepthScale.value = 0.95;
      mat.needsUpdate = true;
    }
  }, [sceneMode]);

  useEffect(() => {
    autoPilotRef.current = autoPilot;
  }, [autoPilot]);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = stageRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const gl = renderer.getContext();
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const rendererName = dbg
      ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)
      : '';
    const isSoftwareGl = /SwiftShader|llvmpipe|Software|Basic Render/i.test(
      rendererName
    );

    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 2)
    );
    renderer.setClearColor(0x070a08, 1);

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 390;
    renderer.setSize(width, height, false);
    renderer.domElement.className = 'drone-canvas';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070a08, 0.035);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 50);
    camera.position.set(0, 0, 7.55);

    // Placeholder 1x1 canvas textures before real images finish loading
    const placeholderCanvas = document.createElement('canvas');
    placeholderCanvas.width = 4;
    placeholderCanvas.height = 4;
    const placeholderTex = new THREE.CanvasTexture(placeholderCanvas);

    const marquiseDepthCanvas = buildDepthMapCanvas('marquise');
    const chegadaDepthCanvas = buildDepthMapCanvas('chegada');
    const marquiseDepthTex = new THREE.CanvasTexture(marquiseDepthCanvas);
    const chegadaDepthTex = new THREE.CanvasTexture(chegadaDepthCanvas);
    texturesRef.current.marquiseDepth = marquiseDepthTex;
    texturesRef.current.chegadaDepth = chegadaDepthTex;

    const segsX = isSoftwareGl ? 40 : 96;
    const segsY = isSoftwareGl ? 28 : 64;
    const geometry = new THREE.PlaneGeometry(9.6, 7.2, segsX, segsY);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uColorMap: { value: placeholderTex },
        uDepthMap: { value: marquiseDepthTex },
        uDepthScale: { value: 1.05 },
        uTime: { value: 0 },
        uSpotIntensity: { value: 0.9 },
        uFocusDepth: { value: 0.6 },
        uMode: { value: 0.0 },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    });
    materialRef.current = material;

    const facadeMesh = new THREE.Mesh(geometry, material);
    scene.add(facadeMesh);

    // Floating 3D golden dust motes in the foreground air volume for drone depth perception
    const particleCount = isSoftwareGl ? 28 : 65;
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 8.5;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 5.2;
      pPositions[i * 3 + 2] = 0.8 + Math.random() * 2.8;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xc2a15f,
      size: 0.045,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Load both real facade photos and build clean CanvasTextures
    let cancelled = false;
    const loadImg = (src: string) =>
      new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    Promise.all([
      loadImg('/assets/agave/facade-729-raw.jpg'),
      loadImg('/assets/agave/facade-arrival.jpg'),
    ])
      .then(([imgMarquise, imgArrival]) => {
        if (cancelled) return;
        const cleanMarquise = buildCleanMarquiseCanvas(imgMarquise);
        const cleanArrival = buildArrivalCanvas(imgArrival);

        const texM = new THREE.CanvasTexture(cleanMarquise);
        texM.colorSpace = THREE.SRGBColorSpace;
        texM.minFilter = THREE.LinearFilter;
        texM.magFilter = THREE.LinearFilter;

        const texA = new THREE.CanvasTexture(cleanArrival);
        texA.colorSpace = THREE.SRGBColorSpace;
        texA.minFilter = THREE.LinearFilter;
        texA.magFilter = THREE.LinearFilter;

        texturesRef.current.marquiseColor = texM;
        texturesRef.current.chegadaColor = texA;

        if (modeRef.current === 'chegada') {
          material.uniforms.uColorMap.value = texA;
          material.uniforms.uDepthMap.value = chegadaDepthTex;
          material.uniforms.uMode.value = 1.0;
        } else {
          material.uniforms.uColorMap.value = texM;
          material.uniforms.uDepthMap.value = marquiseDepthTex;
          material.uniforms.uMode.value = 0.0;
        }
        material.needsUpdate = true;
        setTexturesReady(true);
      })
      .catch(() => {
        // Ignore image load errors gracefully
      });

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 520;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    let visible = true;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]) {
          visible = entries[0].isIntersecting;
        }
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    let rafId = 0;
    let timeoutId = 0;
    const startTime = performance.now();

    const afterDraw = isSoftwareGl
      ? () =>
          new Promise<void>((resolve) => {
            timeoutId = window.setTimeout(resolve, 16);
          })
      : () => Promise.resolve();

    async function loop(now: number) {
      if (cancelled) return;

      if (visible && !document.hidden && modeRef.current !== 'mapa') {
        const elapsedSec = (now - startTime) * 0.001;
        const ptr = pointerRef.current;
        ptr.x += (ptr.targetX - ptr.x) * 0.08;
        ptr.y += (ptr.targetY - ptr.y) * 0.08;

        const pose = computeDroneCameraPose(
          elapsedSec,
          scrollRef.current,
          ptr.x,
          ptr.y,
          modeRef.current,
          autoPilotRef.current
        );

        camera.position.set(pose.camX, pose.camY, pose.camZ);
        camera.lookAt(pose.lookX, pose.lookY, 0);
        camera.rotation.z = pose.rollZ;

        material.uniforms.uTime.value = elapsedSec;
        material.uniforms.uSpotIntensity.value = pose.spotIntensity;
        material.uniforms.uFocusDepth.value = pose.focusDepth;

        particles.rotation.y = Math.sin(elapsedSec * 0.25) * 0.08;
        particles.position.x = -pose.camX * 0.18;

        renderer.render(scene, camera);
        await afterDraw();
      }

      if (!cancelled) {
        rafId = requestAnimationFrame(loop);
      }
    }

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
      resizeObserver.disconnect();
      io.disconnect();
      geometry.dispose();
      material.dispose();
      pGeo.dispose();
      pMat.dispose();
      placeholderTex.dispose();
      marquiseDepthTex.dispose();
      chegadaDepthTex.dispose();
      texturesRef.current.marquiseColor?.dispose();
      texturesRef.current.chegadaColor?.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
    const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
    pointerRef.current.targetX = nx;
    pointerRef.current.targetY = ny;
  };

  const handlePointerLeave = () => {
    pointerRef.current.targetX = 0;
    pointerRef.current.targetY = 0;
  };

  return (
    <div className="drone-card reveal in" id="drone-showcase">
      <div className="drone-toolbar" role="tablist" aria-label="Visualização da clínica">
        <button
          type="button"
          role="tab"
          aria-selected={sceneMode === 'marquise'}
          className={`drone-tab${sceneMode === 'marquise' ? ' active' : ''}`}
          onClick={() => setSceneMode('marquise')}
        >
          Marquise 729
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={sceneMode === 'chegada'}
          className={`drone-tab${sceneMode === 'chegada' ? ' active' : ''}`}
          onClick={() => setSceneMode('chegada')}
        >
          Chegada 3D
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={sceneMode === 'mapa'}
          className={`drone-tab${sceneMode === 'mapa' ? ' active' : ''}`}
          onClick={() => setSceneMode('mapa')}
        >
          Mapa Rua 2
        </button>
      </div>

      <div
        className="drone-stage"
        ref={stageRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {sceneMode === 'mapa' && (
          <div className="drone-map-overlay">
            <svg
              viewBox="0 0 400 400"
              role="img"
              aria-label="Mapa ilustrativo: Rua 2, entre as avenidas 7 e 9"
            >
              <rect width="400" height="400" fill="#070a08" />
              <g fill="none" stroke="#c2a15f" strokeLinecap="round">
                <path d="M20 80H380" strokeWidth="1" opacity="0.3" />
                <path d="M20 140H380" strokeWidth="1" opacity="0.3" />
                <path d="M20 260H380" strokeWidth="1" opacity="0.3" />
                <path d="M20 320H380" strokeWidth="1" opacity="0.3" />
                <path d="M60 30V370" strokeWidth="1" opacity="0.3" />
                <path d="M330 30V370" strokeWidth="1" opacity="0.3" />
                <path
                  d="M20 340C120 300 200 360 380 290"
                  strokeWidth="1"
                  opacity="0.2"
                />
                <path d="M135 30V370" strokeWidth="1" opacity="0.8" />
                <path d="M255 30V370" strokeWidth="1" opacity="0.8" />
                <path d="M20 200H380" strokeWidth="1.2" opacity="1" />
              </g>
              <g textAnchor="middle">
                <text x="135" y="22">
                  AV. 7
                </text>
                <text x="255" y="22">
                  AV. 9
                </text>
                <text x="195" y="168" fontSize="12">
                  AGAVÊ · 729
                </text>
              </g>
              <text x="22" y="192">
                RUA 2
              </text>
              <path
                d="M195 174V190"
                stroke="#c2a15f"
                strokeWidth="1"
                fill="none"
              />
              <circle
                className="pulse"
                cx="195"
                cy="200"
                r="7"
                fill="none"
                stroke="#2fb84f"
                strokeWidth="2"
              />
              <circle cx="195" cy="200" r="11" fill="#2fb84f" opacity=".22" />
              <circle cx="195" cy="200" r="5.5" fill="#2fb84f" />
              <path d="M368 56l-6 14h12z" fill="#c2a15f" />
              <text x="368" y="48" textAnchor="middle">
                N
              </text>
            </svg>
          </div>
        )}
      </div>

      <div className="drone-caption">
        <span>
          {sceneMode === 'marquise'
            ? 'Marquise 729 · Mova o cursor ou toque para guiar a câmera 3D'
            : sceneMode === 'chegada'
              ? 'Chegada na Rua 2, 729 · Paralaxe tridimensional'
              : 'Localização no Centro de Rio Claro · Entre as avenidas 7 e 9'}
        </span>
        {texturesReady && sceneMode !== 'mapa' && (
          <button
            type="button"
            className="drone-pilot-btn"
            onClick={() => setAutoPilot((prev) => !prev)}
          >
            {autoPilot ? 'Voo Automático' : 'Controle Manual'}
          </button>
        )}
      </div>
    </div>
  );
}
