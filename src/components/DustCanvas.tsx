import { useEffect, useRef } from 'react';

export default function DustCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const cv = canvasRef.current;
    if (rm || !cv) return;

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

    const ctx = cv.getContext('2d');
    if (!ctx) return;

    let W = 0;
    let H = 0;
    const resize = () => {
      if (!cv) return;
      W = cv.width = cv.offsetWidth;
      H = cv.height = cv.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const P: Array<{
      x: number;
      y: number;
      r: number;
      s: number;
      g: boolean;
      a: number;
    }> = [];

    for (let i = 0; i < 70; i++) {
      P.push({
        x: Math.random(),
        y: Math.random(),
        r: Math.random() * 1.8 + 0.4,
        s: Math.random() * 0.0004 + 0.0001,
        g: Math.random() < 0.4,
        a: Math.random() * 6,
      });
    }

    let frameId = 0;
    let timerId = 0;

    const drawFrame = (t: number) => {
      if (!document.documentElement.classList.contains('intro')) {
        ctx.clearRect(0, 0, W, H);
        P.forEach((p) => {
          p.y -= p.s * 16;
          if (p.y < 0) p.y = 1;
          const o = 0.25 + 0.35 * Math.sin(t / 900 + p.a);
          const px = p.x * W + Math.sin(t / 2000 + p.a) * 14;
          const py = p.y * H;
          const c = p.g ? '194,161,95' : '47,184,79';
          ctx.fillStyle = `rgba(${c},${o * 0.14})`;
          ctx.beginPath();
          ctx.arc(px, py, p.r * 4, 0, 6.283);
          ctx.fill();
          ctx.fillStyle = `rgba(${c},${o})`;
          ctx.beginPath();
          ctx.arc(px, py, p.r, 0, 6.283);
          ctx.fill();
        });
      }
      if (isSoftwareGl) {
        timerId = window.setTimeout(() => {
          frameId = requestAnimationFrame(drawFrame);
        }, 120);
      } else {
        frameId = requestAnimationFrame(drawFrame);
      }
    };

    frameId = requestAnimationFrame(drawFrame);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
      clearTimeout(timerId);
    };
  }, []);

  return <canvas id="dust" ref={canvasRef} aria-hidden="true" />;
}
