import { useEffect, useRef, useState } from 'react';
import { auIntro, setSnd } from '../utils/audio';

interface IntroOverlayProps {
  onComplete: () => void;
  onEnableSound: () => void;
}

export default function IntroOverlay({
  onComplete,
  onEnableSound,
}: IntroOverlayProps) {
  const [visible, setVisible] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') return false;
    const rm = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if (rm) return false;
    try {
      const seen =
        sessionStorage.getItem('ag') === '1' &&
        window.location.hash !== '#intro';
      if (seen) return false;
    } catch {
      // ignore storage errors
    }
    return true;
  });

  const [soundActivated, setSoundActivated] = useState(false);
  const t0Ref = useRef<number>(
    typeof performance !== 'undefined' ? performance.now() : 0
  );
  const completedRef = useRef(false);

  const finishIntro = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    document.documentElement.style.overflow = '';
    document.documentElement.classList.remove('intro');
    try {
      sessionStorage.setItem('ag', '1');
    } catch {
      // ignore storage errors
    }
    setVisible(false);
    onComplete();
  };

  useEffect(() => {
    if (!visible) {
      finishIntro();
      return;
    }

    t0Ref.current = performance.now();
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.classList.add('intro');

    const endTimer = window.setTimeout(() => {
      finishIntro();
    }, 9800);

    return () => {
      window.clearTimeout(endTimer);
      document.documentElement.style.overflow = '';
      document.documentElement.classList.remove('intro');
    };
  }, [visible]);

  if (!visible) return null;

  const handleActivateSound = () => {
    setSnd(true);
    setSoundActivated(true);
    onEnableSound();
    const elapsed = (performance.now() - t0Ref.current) / 1000;
    auIntro(elapsed);
  };

  return (
    <div id="intro" aria-hidden="true">
      <div className="h hl"></div>
      <div className="h hr"></div>
      <svg className="ck" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          className="gl"
          pathLength={1}
          points="50,0 53,12 48,25 54,38 47,52 53,66 48,80 52,92 50,100"
        />
        <polyline
          pathLength={1}
          points="50,0 53,12 48,25 54,38 47,52 53,66 48,80 52,92 50,100"
        />
      </svg>
      <div className="il">
        <svg className="pl" viewBox="0 0 100 20" preserveAspectRatio="none">
          <path
            className="gl"
            pathLength={1}
            d="M0 10H34L38 10L41 2L45 18L49 5L52 10H100"
          />
          <path
            pathLength={1}
            d="M0 10H34L38 10L41 2L45 18L49 5L52 10H100"
          />
        </svg>
        <svg className="vl" viewBox="0 0 100 100">
          <path
            pathLength={1}
            d="M10 14H90L50 88Z M30 30H70L50 64Z"
          />
        </svg>
        <div className="it">AGAVÊ</div>
        <div className="is">SAÚDE E PERFORMANCE</div>
      </div>
      <div className="fr"></div>
      <button
        id="isnd"
        type="button"
        disabled={soundActivated}
        onClick={handleActivateSound}
      >
        {soundActivated ? 'Som ativado' : 'Ativar som'}
      </button>
      <button id="skip" type="button" onClick={finishIntro}>
        Pular
      </button>
    </div>
  );
}
