/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import DustCanvas from './components/DustCanvas';
import FacadeDroneShowcase from './components/FacadeDroneShowcase';
import HeroOrb3D from './components/HeroOrb3D';
import IntroOverlay from './components/IntroOverlay';
import WhatsAppModal from './components/WhatsAppModal';
import {
  handleVisibilityAudio,
  isAudioOn,
  playScrollNote,
  setSnd,
} from './utils/audio';
import {
  computeStoryScrollState,
  DOCTORS_DATA,
  getClinicScheduleStatus,
  isScheduleRowToday,
  PATIENT_REVIEWS,
} from './utils/schedule';

const TYPEWRITER_PHRASES = [
  'Medicina de precisão em Rio Claro.',
  'Emagrecimento com acompanhamento médico.',
  'Performance conduzida com ciência.',
  'Cuidado individual, resultado real.',
];

export default function App() {
  const [introDone, setIntroDone] = useState(false);
  const [waOpen, setWaOpen] = useState(false);
  const [waInterest, setWaInterest] = useState('Emagrecimento');
  const [soundOn, setSoundOn] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const [locProgress, setLocProgress] = useState(0);
  const [scheduleStatus, setScheduleStatus] = useState(() =>
    getClinicScheduleStatus()
  );

  const heroRef = useRef<HTMLElement | null>(null);
  const progRef = useRef<HTMLDivElement | null>(null);
  const sstoryRef = useRef<HTMLElement | null>(null);
  const locRef = useRef<HTMLElement | null>(null);
  const scrollProgressRef = useRef<number>(0);
  const lastActRef = useRef<number>(-1);
  const typewriterStartedRef = useRef(false);

  const startTypewriter = useCallback(() => {
    if (typewriterStartedRef.current) return;
    typewriterStartedRef.current = true;

    const rm = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if (rm) {
      setTypewriterText(TYPEWRITER_PHRASES[0]);
      return;
    }

    let k = 0;
    let c = 0;
    let del = false;
    let timer = 0;

    function nextTick() {
      const phrase = TYPEWRITER_PHRASES[k];
      setTypewriterText(phrase.slice(0, c));
      if (!del && c < phrase.length) {
        c++;
        timer = window.setTimeout(nextTick, 55);
      } else if (!del) {
        del = true;
        timer = window.setTimeout(nextTick, 1900);
      } else if (c > 0) {
        c--;
        timer = window.setTimeout(nextTick, 24);
      } else {
        del = false;
        k = (k + 1) % TYPEWRITER_PHRASES.length;
        timer = window.setTimeout(nextTick, 300);
      }
    }

    nextTick();
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      startTypewriter();
    }, 8200);
    return () => window.clearTimeout(t);
  }, [startTypewriter]);

  const handleIntroComplete = useCallback(() => {
    setIntroDone(true);
    startTypewriter();
  }, [startTypewriter]);

  // Update clinic open/closed status every minute
  useEffect(() => {
    setScheduleStatus(getClinicScheduleStatus());
    const id = window.setInterval(() => {
      setScheduleStatus(getClinicScheduleStatus());
    }, 60000);
    return () => window.clearInterval(id);
  }, []);

  // Audio visibility suspend/resume
  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityAudio);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityAudio);
  }, []);

  // Pointer tilt, reveal observer, and scroll storytelling
  useEffect(() => {
    const rm = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    const hero = heroRef.current;

    const handleHeroPointerMove = (e: PointerEvent) => {
      if (!hero) return;
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--x', `${e.clientX - r.left}px`);
      hero.style.setProperty('--y', `${e.clientY - r.top}px`);

      if (!rm) {
        const ow = hero.querySelector('.orbbox') as HTMLElement | null;
        if (ow) {
          ow.style.setProperty(
            '--ry',
            `${((e.clientX - r.left) / r.width - 0.5) * 26}deg`
          );
          ow.style.setProperty(
            '--rx',
            `${-((e.clientY - r.top) / r.height - 0.5) * 20}deg`
          );
        }
      }
    };

    hero?.addEventListener('pointermove', handleHeroPointerMove);

    // 3D Tilt on cards & videos
    const tiltEls = Array.from(
      document.querySelectorAll<HTMLElement>('.pillars div, .vid, .gcard')
    );
    const tiltMoveHandlers = new Map<HTMLElement, (e: PointerEvent) => void>();
    const tiltLeaveHandlers = new Map<HTMLElement, () => void>();

    if (!rm) {
      tiltEls.forEach((el) => {
        el.classList.add('tilt');
        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`;
        };
        const onLeave = () => {
          el.style.transform = '';
        };
        tiltMoveHandlers.set(el, onMove);
        tiltLeaveHandlers.set(el, onLeave);
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerleave', onLeave);
      });
    }

    function typeH(el: HTMLElement) {
      if (el.dataset.typed === '1') return;
      el.dataset.typed = '1';
      const t = el.textContent || '';
      let i = 0;
      el.setAttribute('aria-label', t);
      (function n() {
        el.innerHTML = `${t.slice(0, i)}<span style="opacity:0">${t.slice(i)}</span>`;
        if (i++ < t.length) window.setTimeout(n, 32);
      })();
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((x) => {
          if (x.isIntersecting) {
            const target = x.target as HTMLElement;
            target.classList.add('in');
            io.unobserve(target);
            if (target.tagName === 'H2' && !rm) {
              typeH(target);
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    document
      .querySelectorAll('.reveal, .wipe')
      .forEach((el) => io.observe(el));

    let tk = false;
    function cine() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (progRef.current) {
        progRef.current.style.width = `${h > 0 ? (window.scrollY / h) * 100 : 0}%`;
      }

      if (!rm) {
        document.querySelectorAll<HTMLElement>('.par').forEach((p) => {
          const parent = p.parentNode as HTMLElement | null;
          if (!parent) return;
          const r = parent.getBoundingClientRect();
          const c = r.top + r.height / 2 - window.innerHeight / 2;
          p.style.transform = `translateY(${c * -0.07}px)`;
        });
      }

      if (hero) {
        const hp = Math.min(
          1,
          Math.max(0, window.scrollY / (hero.offsetHeight * 0.85))
        );
        scrollProgressRef.current = hp;
        hero.style.setProperty('--sp', String(hp));
      }

      const ss = sstoryRef.current;
      if (ss) {
        const sps = ss.querySelectorAll<HTMLElement>('.sp');
        const dots = ss.querySelectorAll<HTMLElement>('.sdots i');
        const r = ss.getBoundingClientRect();
        const p = Math.min(
          1,
          Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight))
        );
        const state = computeStoryScrollState(p, sps.length);

        sps.forEach((el, i) => {
          const vis = state.slides[i];
          if (!vis) return;
          el.style.opacity = String(vis.opacity);
          el.style.transform = `translateY(${vis.translateY}px) scale(${vis.scale})`;
        });

        dots.forEach((d, i) => {
          d.classList.toggle('on', i === state.activeIndex);
        });

        if (state.activeIndex !== lastActRef.current && p > 0 && p < 1) {
          playScrollNote(state.activeIndex);
        }
        lastActRef.current = state.activeIndex;
      }

      document
        .querySelectorAll<HTMLElement>('.wipe:not(.in), .reveal:not(.in)')
        .forEach((el) => {
          const q = el.getBoundingClientRect();
          if (q.top < window.innerHeight * 0.88 && q.bottom > 0) {
            el.classList.add('in');
            io.unobserve(el);
            if (el.tagName === 'H2' && !rm) {
              typeH(el);
            }
          }
        });

      if (locRef.current) {
        const lr = locRef.current.getBoundingClientRect();
        const lp = Math.min(
          1,
          Math.max(
            0,
            (window.innerHeight - lr.top) / (window.innerHeight + lr.height)
          )
        );
        setLocProgress(lp);
      }

      document.querySelectorAll<HTMLElement>('.vid').forEach((v) => {
        const q = v.getBoundingClientRect();
        const k = Math.min(
          1,
          Math.max(
            0,
            (window.innerHeight - q.top) / (window.innerHeight + q.height)
          )
        );
        v.style.setProperty('--z', (1.18 - 0.18 * Math.min(1, k * 1.6)).toFixed(3));
      });
    }

    const onScroll = () => {
      if (!tk) {
        tk = true;
        requestAnimationFrame(() => {
          tk = false;
          cine();
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', cine);
    cine();

    return () => {
      hero?.removeEventListener('pointermove', handleHeroPointerMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', cine);
      io.disconnect();
      tiltEls.forEach((el) => {
        const m = tiltMoveHandlers.get(el);
        const l = tiltLeaveHandlers.get(el);
        if (m) el.removeEventListener('pointermove', m);
        if (l) el.removeEventListener('pointerleave', l);
      });
    };
  }, []);

  const handleToggleSound = () => {
    const next = setSnd(!isAudioOn());
    setSoundOn(next);
  };

  const openWhatsAppModal = (e: React.MouseEvent, interest?: string) => {
    e.preventDefault();
    if (interest) {
      setWaInterest(interest);
    }
    setWaOpen(true);
  };

  const marqueeItems = [
    'Cardiologia',
    'Emagrecimento',
    'Protocolos injetáveis',
    'Personal e Pilates',
    'Nutrição',
    'Estética avançada',
    'Osteopatia',
    'Psicologia',
  ];

  return (
    <>
      <div className="prog" ref={progRef}></div>
      <DustCanvas />
      <IntroOverlay
        onComplete={handleIntroComplete}
        onEnableSound={() => setSoundOn(true)}
      />

      <nav>
        <a className="logo" href="#">
          AGAVÊ
        </a>
        <div className="links">
          <a href="#clinica">A clínica</a>
          <a href="#especialidades">Especialidades</a>
          <a href="#equipe">Equipe</a>
          <a href="#avaliacoes">Avaliações</a>
          <a href="#contato">Contato</a>
        </div>
        <div className="nav-actions">
          <a
            className="dl-html-btn"
            href="/agave-saude-rioclaro.html"
            download="Agave-Saude-e-Performance-Rio-Claro.html"
          >
            ⬇ Baixar HTML
          </a>
          <a className="cta" href="#contato" onClick={openWhatsAppModal}>
            Agendar consulta
          </a>
        </div>
      </nav>

      <header className="hero" id="hero" ref={heroRef}>
        <div className="hgrid">
          <div className="htext">
            <h1 className="big">
              Uma nova forma de viver a sua <em>melhor versão.</em>
            </h1>
            <p
              className="tw"
              aria-label="Medicina de precisão em Rio Claro"
            >
              <span id="tw">{typewriterText}</span>
              <i className="cur"></i>
            </p>
            <a className="btn" href="#contato" onClick={openWhatsAppModal}>
              Agendar consulta
            </a>
          </div>
          <HeroOrb3D
            introDone={introDone}
            scrollProgressRef={scrollProgressRef}
          />
        </div>
      </header>

      <div className="led"></div>

      <section
        className="sstory"
        aria-label="Nossos valores"
        ref={sstoryRef}
      >
        <div className="sstage">
          <div className="sglow"></div>
          <div className="sp">
            Ciência para <em>entender.</em>
          </div>
          <div className="sp">
            Cuidado para <em>acolher.</em>
          </div>
          <div className="sp">
            Performance para <em>evoluir.</em>
          </div>
          <div className="sp">
            Vida para <em>aproveitar.</em>
          </div>
          <div className="sdots" aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </div>
        </div>
      </section>

      <section className="story">
        <div className="wrap">
          <h2 className="reveal">Transformar vidas é o nosso propósito</h2>
          <div className="pair">
            <div
              className="frame fix wipe"
              style={{ aspectRatio: '1009/1271' }}
            >
              <div className="par">
                <img
                  src="/assets/agave/purpose-1.jpg"
                  alt="Dr. Henrique Viviani e Dra. Lysanne Amorim, da Agavê"
                />
              </div>
            </div>
            <div
              className="frame fix wipe"
              style={{ aspectRatio: '1080/1321' }}
            >
              <div className="par">
                <img
                  src="/assets/agave/purpose-2.jpg"
                  alt="Dr. Henrique e Dra. Lysanne em reunião na clínica Agavê"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="clinica">
        <div className="wrap about">
          <div className="reveal">
            <h2>Sua saúde é o nosso plano</h2>
            <p>
              A Agavê é muito mais do que uma clínica multidisciplinar: somos
              uma equipe especializada em cuidar da sua saúde e bem-estar como
              um todo, de maneira individualizada e personalíssima.
            </p>
            <p>
              Um ambiente acolhedor e seguro, com equipe que ouve, acolhe e
              acompanha cada etapa.
            </p>
          </div>
        </div>
      </section>

      <section className="mvv" id="valores">
        <div className="wrap">
          <h2 className="reveal">Missão, visão e valores</h2>
          <div className="mv reveal">
            <div className="box">
              <small>MISSÃO</small>
              <p>
                Cuidar da saúde e do bem-estar de cada pessoa como um todo, de
                maneira individualizada e personalíssima, com ciência,
                acolhimento e acompanhamento próximo.
              </p>
            </div>
            <div className="box">
              <small>VISÃO</small>
              <p>
                Ser a referência em saúde, performance e longevidade na região,
                transformando vidas por meio da medicina de precisão e do
                cuidado individualizado.
              </p>
            </div>
          </div>
          <div className="vals reveal">
            <div>
              <b>01</b>
              <h3>Ciência</h3>
              <p>Decisões baseadas em evidência e em exames.</p>
            </div>
            <div>
              <b>02</b>
              <h3>Cuidado</h3>
              <p>Escuta, acolhimento e acompanhamento em cada etapa.</p>
            </div>
            <div>
              <b>03</b>
              <h3>Individualização</h3>
              <p>Cada paciente é único e recebe um plano feito para ele.</p>
            </div>
            <div>
              <b>04</b>
              <h3>Performance</h3>
              <p>Metas claras e evolução que dá para medir.</p>
            </div>
            <div>
              <b>05</b>
              <h3>Longevidade</h3>
              <p>Saúde para viver bem hoje e nos próximos anos.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="spec" id="especialidades">
        <div className="wrap">
          <h2 className="reveal">
            Cuidado completo em todas as fases da sua vida
          </h2>
          <div className="cards reveal">
            <article
              className="gcard"
              onClick={(e) => openWhatsAppModal(e, 'Cardiologia')}
            >
              <svg viewBox="0 0 64 64">
                <path
                  pathLength={1}
                  d="M32 54C10 38 8 22 18 14c6-5 12-2 14 4 2-6 8-9 14-4 10 8 8 24-14 40z"
                />
                <path pathLength={1} d="M16 32h10l4-8 6 16 4-8h8" />
              </svg>
              <h3>Cardiologia</h3>
              <p>Consultas e exames para cuidar do coração.</p>
            </article>
            <article
              className="gcard"
              onClick={(e) => openWhatsAppModal(e, 'Emagrecimento')}
            >
              <svg viewBox="0 0 64 64">
                <path pathLength={1} d="M20 6C44 20 20 36 44 58" />
                <path pathLength={1} d="M44 6C20 20 44 36 20 58" />
                <path pathLength={1} d="M27 15h10M24 32h16M27 49h10" />
              </svg>
              <h3>Emagrecimento</h3>
              <p>Programa médico com acompanhamento individual.</p>
            </article>
            <article
              className="gcard"
              onClick={(e) => openWhatsAppModal(e, 'Nutrição')}
            >
              <svg viewBox="0 0 64 64">
                <path
                  pathLength={1}
                  d="M32 54C26 40 26 26 32 12c6 14 6 28 0 42z"
                />
                <path
                  pathLength={1}
                  d="M32 54C20 48 16 36 22 24c4 6 8 16 10 30z"
                />
                <path
                  pathLength={1}
                  d="M32 54c12-6 16-18 10-30-4 6-8 16-10 30z"
                />
                <path pathLength={1} d="M10 56h44" />
              </svg>
              <h3>Nutrição</h3>
              <p>Plano alimentar pensado para a sua rotina.</p>
            </article>
            <article
              className="gcard"
              onClick={(e) =>
                openWhatsAppModal(e, 'Performance, personal e Pilates')
              }
            >
              <svg viewBox="0 0 64 64">
                <circle pathLength={1} cx="40" cy="11" r="5" />
                <path pathLength={1} d="M36 20l-8 12 8 6-4 16" />
                <path pathLength={1} d="M28 32l-12 4" />
                <path pathLength={1} d="M36 20l10 10 8 2" />
                <path pathLength={1} d="M36 38l12 8" />
              </svg>
              <h3>Performance</h3>
              <p>Personal e Pilates, orientados à sua meta.</p>
            </article>
            <article
              className="gcard"
              onClick={(e) => openWhatsAppModal(e, 'Estética avançada')}
            >
              <svg viewBox="0 0 64 64">
                <path
                  pathLength={1}
                  d="M32 6l5 21 21 5-21 5-5 21-5-21-21-5 21-5z"
                />
              </svg>
              <h3>Estética avançada</h3>
              <p>Cuidado com a pele e a harmonia, com técnica e critério.</p>
            </article>
          </div>
          <div className="plinth" aria-hidden="true"></div>
        </div>
      </section>

      <div className="marq" aria-hidden="true">
        <div className="track">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <span key={idx}>{item}</span>
          ))}
        </div>
      </div>

      <section className="team" id="equipe">
        <div className="wrap">
          <h2 className="reveal">Conheça quem cuida de você</h2>
          <div className="docs">
            {DOCTORS_DATA.map((doc) => (
              <article className="doc-card reveal" key={doc.id}>
                <div className="vid">
                  <img src={doc.image} alt={doc.alt} />
                </div>
                <div className="doc-meta">
                  <div className="doc-head">
                    <h3>{doc.name}</h3>
                    <span className="doc-crm">{doc.crm}</span>
                  </div>
                  <p className="doc-spec">{doc.specialties}</p>
                  <p className="doc-bio">{doc.bio}</p>
                  <button
                    type="button"
                    className="btn doc-cta"
                    onClick={(e) => openWhatsAppModal(e, doc.defaultInterest)}
                  >
                    Agendar com {doc.name.split(' ').slice(0, 2).join(' ')}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="reviews" id="avaliacoes">
        <div className="wrap">
          <div className="rev-header reveal">
            <div className="rev-badge">
              <span className="rev-stars-inline" aria-hidden="true">
                ★★★★★
              </span>
              <span>4.9 · AVALIAÇÕES DE PACIENTES EM RIO CLARO</span>
            </div>
            <h2>Histórias reais de quem confia na Agavê</h2>
            <p className="rev-sub">
              Relatos de pacientes sobre o cuidado individualizado, a clareza
              científica e a estrutura da nossa clínica.
            </p>
          </div>

          <div className="rev-grid">
            {PATIENT_REVIEWS.map((rev) => (
              <article
                className="rev-card reveal"
                key={rev.id}
                onClick={(e) => openWhatsAppModal(e, rev.defaultInterest)}
              >
                <div className="rev-top">
                  <span
                    className="rev-stars"
                    aria-label={`${rev.rating} de 5 estrelas`}
                  >
                    {'★'.repeat(rev.rating)}
                  </span>
                  <span className="rev-tag">{rev.doctorTag}</span>
                </div>
                <h3 className="rev-title">{rev.highlight}</h3>
                <blockquote className="rev-quote">“{rev.quote}”</blockquote>
                <div className="rev-footer">
                  <strong className="rev-author">{rev.author}</strong>
                  <span className="rev-cat">{rev.category}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="loc" id="localizacao" ref={locRef}>
        <div className="n729" aria-hidden="true">
          729
        </div>
        <div className="lin">
          <div className="lleft">
            <div className="fcopy">
              <small>RIO CLARO, SP</small>
              <h2 className="reveal">Venha conhecer a Agavê</h2>
              <p>
                Um espaço pensado para receber você com cuidado, do primeiro
                passo à consulta.
              </p>
            </div>
            <div className="fcard reveal">
              <dl>
                <dt>ENDEREÇO</dt>
                <dd>
                  Rua 2, 729 · Centro, Rio Claro, SP
                  <span className="sub">
                    Entre as avenidas 7 e 9 · CEP 13500-150
                  </span>
                </dd>
                <dt>
                  HORÁRIO
                  <span
                    id="ostat"
                    className={`ostat${scheduleStatus.isOpen ? ' on' : ''}`}
                  >
                    {scheduleStatus.label}
                  </span>
                </dt>
                <dd>
                  <ul className="hours">
                    <li
                      data-d="1-5"
                      className={
                        isScheduleRowToday('1-5', scheduleStatus.dayOfWeek)
                          ? 'today'
                          : ''
                      }
                    >
                      <span>Segunda a sexta</span>
                      <span>08:00–12:00 · 14:00–18:00</span>
                    </li>
                    <li
                      data-d="6"
                      className={
                        isScheduleRowToday('6', scheduleStatus.dayOfWeek)
                          ? 'today'
                          : ''
                      }
                    >
                      <span>Sábado</span>
                      <span>08:00–12:00</span>
                    </li>
                    <li
                      data-d="0"
                      className={
                        isScheduleRowToday('0', scheduleStatus.dayOfWeek)
                          ? 'today'
                          : ''
                      }
                    >
                      <span>Domingo</span>
                      <span>Fechada</span>
                    </li>
                  </ul>
                </dd>
              </dl>
              <div className="btns">
                <a
                  className="btn"
                  href="https://www.google.com/maps/search/?api=1&query=Rua+2+729+Rio+Claro+SP"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Como chegar
                </a>
                <button
                  className="btn"
                  type="button"
                  data-wa=""
                  onClick={openWhatsAppModal}
                >
                  Agendar pelo WhatsApp
                </button>
              </div>
            </div>
          </div>
          <div className="fmap reveal">
            <svg
              viewBox="0 0 400 400"
              role="img"
              aria-label="Mapa ilustrativo: Rua 2, entre as avenidas 7 e 9"
            >
              <rect width="400" height="400" fill="rgba(7, 10, 8, 0.72)" />
              <g fill="none" stroke="#c2a15f" strokeLinecap="round">
                <path
                  className="l"
                  pathLength={1}
                  d="M20 80H380"
                  strokeWidth="1"
                  opacity="0.3"
                  style={{ transitionDelay: '1s' }}
                />
                <path
                  className="l"
                  pathLength={1}
                  d="M20 140H380"
                  strokeWidth="1"
                  opacity="0.3"
                  style={{ transitionDelay: '1s' }}
                />
                <path
                  className="l"
                  pathLength={1}
                  d="M20 260H380"
                  strokeWidth="1"
                  opacity="0.3"
                  style={{ transitionDelay: '1s' }}
                />
                <path
                  className="l"
                  pathLength={1}
                  d="M20 320H380"
                  strokeWidth="1"
                  opacity="0.3"
                  style={{ transitionDelay: '1s' }}
                />
                <path
                  className="l"
                  pathLength={1}
                  d="M60 30V370"
                  strokeWidth="1"
                  opacity="0.3"
                  style={{ transitionDelay: '1s' }}
                />
                <path
                  className="l"
                  pathLength={1}
                  d="M330 30V370"
                  strokeWidth="1"
                  opacity="0.3"
                  style={{ transitionDelay: '1s' }}
                />
                <path
                  className="l"
                  pathLength={1}
                  d="M20 340C120 300 200 360 380 290"
                  strokeWidth="1"
                  opacity="0.2"
                  style={{ transitionDelay: '1s' }}
                />
                <path
                  className="l"
                  pathLength={1}
                  d="M135 30V370"
                  strokeWidth="1"
                  opacity="0.8"
                  style={{ transitionDelay: '1.6s' }}
                />
                <path
                  className="l"
                  pathLength={1}
                  d="M255 30V370"
                  strokeWidth="1"
                  opacity="0.8"
                  style={{ transitionDelay: '1.6s' }}
                />
                <path
                  className="l"
                  pathLength={1}
                  d="M20 200H380"
                  strokeWidth="1.2"
                  opacity="1"
                  style={{ transitionDelay: '2.2s' }}
                />
              </g>
              <g textAnchor="middle">
                <text x="135" y="22">
                  AV. 7
                </text>
                <text x="255" y="22">
                  AV. 9
                </text>
                <text x="195" y="168" fontSize="12">
                  AGAVÊ
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
            <small>Mapa ilustrativo</small>
          </div>
        </div>
      </section>

      <section className="final" id="contato">
        <h2 className="reveal">Seu primeiro passo começa aqui</h2>
        <button
          className="btn reveal"
          type="button"
          data-wa=""
          onClick={openWhatsAppModal}
        >
          Agendar pelo WhatsApp
        </button>
        <p
          className="reveal"
          style={{ color: 'var(--mute)', marginTop: '28px' }}
        >
          Rua 2, 729, entre avenidas 7 e 9 · Rio Claro, SP
        </p>
      </section>

      <button
        className={`snd${soundOn ? ' on' : ''}`}
        id="snd"
        type="button"
        aria-pressed={soundOn}
        aria-label="Ativar ou desativar o som"
        onClick={handleToggleSound}
      >
        <svg viewBox="0 0 24 24">
          <path d="M4 9.500h3.500L12 5.500v13l-4.500-4H4z" />
          <path
            className="w"
            d="M15.500 9a4.500 4.500 0 0 1 0 6M18 6.500a8 8 0 0 1 0 11"
          />
          <path className="x" d="M16 9.500l5 5M21 9.500l-5 5" />
        </svg>
      </button>

      <WhatsAppModal
        isOpen={waOpen}
        onToggle={setWaOpen}
        selectedInterest={waInterest}
      />

      <footer>
        <div>
          © 2026 Agavê Saúde e Performance · Rio Claro, SP ·{' '}
          <a
            href="https://www.instagram.com/agavesaude/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'var(--gold)' }}
          >
            @agavesaude
          </a>
        </div>
        <div className="footer-crm">
          Corpo Clínico: Dra. Lysanne Amorim (CRM-SP 153.382) · Dr. Henrique
          Viviani (CRM-SP 153.340)
        </div>
        <div className="footer-dl">
          <a
            className="btn dl-footer-btn"
            href="/agave-saude-rioclaro.html"
            download="Agave-Saude-e-Performance-Rio-Claro.html"
          >
            ⬇ Baixar Site Completo em HTML (.html)
          </a>
        </div>
      </footer>
    </>
  );
}
