export interface TimeInterval {
  startMinutes: number;
  endMinutes: number;
}

export interface ClinicTimeInput {
  dayOfWeek: number; // 0 = Sunday .. 6 = Saturday
  minutesOfDay: number; // 0 .. 1439
}

export interface ClinicScheduleStatus {
  isOpen: boolean;
  label: string;
  dayOfWeek: number;
}

export interface DoctorProfile {
  id: string;
  name: string;
  fullName: string;
  crm: string;
  specialties: string;
  bio: string;
  image: string;
  alt: string;
  defaultInterest: string;
}

export const DOCTORS_DATA: DoctorProfile[] = [
  {
    id: 'dra-lysanne',
    name: 'Dra. Lysanne Amorim',
    fullName: 'Dra. Lysanne Rodrigues Amorim Viviani',
    crm: 'CRM-SP 153.382',
    specialties: 'Clínica Médica · Emagrecimento · Saúde Integrativa · Diagnóstico por Imagem',
    bio: 'Cuidado médico individualizado com foco em emagrecimento saudável, equilíbrio metabólico, saúde integrativa e diagnóstico preciso.',
    image: '/assets/agave/dra-lysanne.jpg',
    alt: 'Dra. Lysanne Amorim',
    defaultInterest: 'Emagrecimento',
  },
  {
    id: 'dr-henrique',
    name: 'Dr. Henrique Viviani',
    fullName: 'Dr. Henrique Viviani',
    crm: 'CRM-SP 153.340',
    specialties: 'Cardiologia · Nutrologia · Medicina de Precisão e Performance',
    bio: 'Avaliação cardiológica completa, nutrologia e protocolos personalizados para longevidade, saúde cardiovascular e alta performance.',
    image: '/assets/agave/dr-henrique.jpg',
    alt: 'Dr. Henrique Viviani',
    defaultInterest: 'Cardiologia',
  },
];

export const CLINIC_HOURS: TimeInterval[][] = [
  [], // 0: domingo
  [
    { startMinutes: 480, endMinutes: 720 },
    { startMinutes: 840, endMinutes: 1080 },
  ], // 1: segunda
  [
    { startMinutes: 480, endMinutes: 720 },
    { startMinutes: 840, endMinutes: 1080 },
  ], // 2: terça
  [
    { startMinutes: 480, endMinutes: 720 },
    { startMinutes: 840, endMinutes: 1080 },
  ], // 3: quarta
  [
    { startMinutes: 480, endMinutes: 720 },
    { startMinutes: 840, endMinutes: 1080 },
  ], // 4: quinta
  [
    { startMinutes: 480, endMinutes: 720 },
    { startMinutes: 840, endMinutes: 1080 },
  ], // 5: sexta
  [{ startMinutes: 480, endMinutes: 720 }], // 6: sábado
];

export const WEEKDAY_NAMES_PT = [
  'domingo',
  'segunda',
  'terça',
  'quarta',
  'quinta',
  'sexta',
  'sábado',
];

export function formatMinutesToHHMM(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
}

export function getSaoPauloTime(date: Date = new Date()): ClinicTimeInput {
  const parts: Record<string, string> = {};
  new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  })
    .formatToParts(date)
    .forEach((p) => {
      parts[p.type] = p.value;
    });

  const dayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const dayOfWeek = dayMap[parts.weekday] ?? 0;
  const hour = Number(parts.hour) % 24;
  const minute = Number(parts.minute) || 0;

  return {
    dayOfWeek,
    minutesOfDay: hour * 60 + minute,
  };
}

export function getClinicScheduleStatus(
  time: ClinicTimeInput = getSaoPauloTime()
): ClinicScheduleStatus {
  const { dayOfWeek, minutesOfDay } = time;
  const todayIntervals = CLINIC_HOURS[dayOfWeek] || [];

  let openInterval: TimeInterval | null = null;
  let nextOpen: { daysAhead: number; startMinutes: number } | null = null;

  for (const iv of todayIntervals) {
    if (minutesOfDay >= iv.startMinutes && minutesOfDay < iv.endMinutes) {
      openInterval = iv;
    } else if (iv.startMinutes > minutesOfDay && !nextOpen) {
      nextOpen = { daysAhead: 0, startMinutes: iv.startMinutes };
    }
  }

  for (let k = 1; k <= 7 && !nextOpen && !openInterval; k++) {
    const dayIntervals = CLINIC_HOURS[(dayOfWeek + k) % 7] || [];
    if (dayIntervals.length > 0) {
      nextOpen = { daysAhead: k, startMinutes: dayIntervals[0].startMinutes };
    }
  }

  if (openInterval) {
    return {
      isOpen: true,
      label: `Aberto agora · fecha às ${formatMinutesToHHMM(openInterval.endMinutes)}`,
      dayOfWeek,
    };
  }

  const fallback = nextOpen || { daysAhead: 1, startMinutes: 480 };
  const dayLabel =
    fallback.daysAhead === 0
      ? 'hoje'
      : fallback.daysAhead === 1
        ? 'amanhã'
        : WEEKDAY_NAMES_PT[(dayOfWeek + fallback.daysAhead) % 7];

  return {
    isOpen: false,
    label: `Fechado · abre ${dayLabel} às ${formatMinutesToHHMM(fallback.startMinutes)}`,
    dayOfWeek,
  };
}

export function isScheduleRowToday(rangeStr: string, dayOfWeek: number): boolean {
  const parts = rangeStr.split('-').map(Number);
  if (parts.length > 1) {
    return dayOfWeek >= parts[0] && dayOfWeek <= parts[1];
  }
  return dayOfWeek === parts[0];
}

export const WHATSAPP_NUMBER = '5519983236161';

export function buildWhatsAppMessage(name: string, interest: string): string {
  const trimmedName = name.trim();
  const cleanInterest = interest.trim() || 'Emagrecimento';
  return `Olá! ${trimmedName ? `Meu nome é ${trimmedName}. ` : ''}Gostaria de agendar uma consulta e saber mais sobre: ${cleanInterest}.`;
}

export function buildWhatsAppUrl(
  name: string,
  interest: string,
  phone: string = WHATSAPP_NUMBER
): string {
  const message = buildWhatsAppMessage(name, interest);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export interface StorySlideVisual {
  opacity: number;
  translateY: number;
  scale: number;
}

export function computeStoryScrollState(
  progress: number,
  totalSlides: number = 4
): { activeIndex: number; slides: StorySlideVisual[] } {
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const f = Math.min(clampedProgress * totalSlides, totalSlides - 0.001);
  const activeIndex = Math.floor(f);

  const slides: StorySlideVisual[] = [];
  for (let i = 0; i < totalSlides; i++) {
    const l = f - i;
    let o = Math.min(l * 4, (1 - l) * 4);
    if (i === 0) o = (1 - l) * 4;
    if (i === totalSlides - 1) o = l * 4;
    o = l < 0 || l > 1 ? 0 : Math.max(0, Math.min(1, o));

    slides.push({
      opacity: o,
      translateY: (0.5 - l) * 70,
      scale: 0.92 + 0.08 * o,
    });
  }

  return { activeIndex, slides };
}

export type DroneSceneMode = 'marquise' | 'mapa';

export interface DroneCameraPose {
  camX: number;
  camY: number;
  camZ: number;
  lookX: number;
  lookY: number;
  rollZ: number;
  focusDepth: number;
  spotIntensity: number;
}

export function computeDroneCameraPose(
  timeSec: number,
  scrollProgress: number,
  pointerX: number, // -0.5 .. 0.5
  pointerY: number, // -0.5 .. 0.5
  mode: DroneSceneMode = 'marquise',
  autoPilot: boolean = true,
  viewportAspect: number = 1.35
): DroneCameraPose {
  const sp = Math.min(1, Math.max(0, scrollProgress));
  const px = Math.min(0.6, Math.max(-0.6, pointerX));
  const py = Math.min(0.6, Math.max(-0.6, pointerY));

  // Scale Z distance back on narrower viewports so the full 16:10 facade width (729 + AGAVÊ) fits without clipping
  const safeAspect = Math.max(0.65, Math.min(2.4, viewportAspect || 1.35));
  const aspectFactor = Math.max(1, 1.38 / safeAspect);

  const phase = autoPilot && mode === 'marquise' ? timeSec * 0.45 : 0;
  const sweepX = (Math.sin(phase) * 0.28 + px * 0.42) / Math.sqrt(aspectFactor);
  const sweepY = Math.cos(phase * 0.75) * 0.16 - py * 0.34 + (sp - 0.5) * 0.18;
  const baseZ = 8.15 * aspectFactor;
  const dollyZ = baseZ - Math.sin(phase * 0.5) * 0.28 - sp * 0.22;

  return {
    camX: sweepX,
    camY: sweepY,
    camZ: Math.max(7.2, Math.min(13.5, dollyZ)),
    lookX: sweepX * 0.22 + 0.06,
    lookY: sweepY * 0.2 - 0.02,
    rollZ: -sweepX * 0.025,
    focusDepth: 0.62 + Math.sin(phase * 0.6) * 0.18,
    spotIntensity: 0.88 + 0.12 * Math.sin(timeSec * 1.8),
  };
}

export interface PatientReview {
  id: string;
  author: string;
  category: string;
  doctorTag: string;
  rating: number;
  highlight: string;
  quote: string;
  defaultInterest: string;
}

export const PATIENT_REVIEWS: PatientReview[] = [
  {
    id: 'rev-1',
    author: 'Marcelo T.',
    category: 'Cardiologia & Performance',
    doctorTag: 'Dr. Henrique Viviani',
    rating: 5,
    highlight: 'Clareza científica e evolução real',
    quote:
      'Atendimento impecável do início ao fim. O Dr. Henrique explica cada exame e protocolo com uma clareza rara, trazendo segurança e resultado real na saúde e na performance.',
    defaultInterest: 'Cardiologia',
  },
  {
    id: 'rev-2',
    author: 'Carolina M.',
    category: 'Emagrecimento & Saúde Integrativa',
    doctorTag: 'Dra. Lysanne Amorim',
    rating: 5,
    highlight: 'Escuta humana e plano sob medida',
    quote:
      'A Dra. Lysanne tem uma escuta humana e atenta a cada detalhe. O acompanhamento médico respeitou minha rotina e transformou minha disposição sem fórmulas prontas.',
    defaultInterest: 'Emagrecimento',
  },
  {
    id: 'rev-3',
    author: 'Fernanda R.',
    category: 'Cuidado Multidisciplinar',
    doctorTag: 'Equipe Agavê',
    rating: 5,
    highlight: 'Ambiente acolhedor e integrado',
    quote:
      'A clínica é linda, extremamente organizada e transmite paz desde a recepção na Rua 2. Você sente que toda a equipe conversa entre si para cuidar de você por inteiro.',
    defaultInterest: 'Outro assunto',
  },
  {
    id: 'rev-4',
    author: 'Rodrigo S.',
    category: 'Nutrologia & Medicina de Precisão',
    doctorTag: 'Dr. Henrique Viviani',
    rating: 5,
    highlight: 'Resultados medidos em exames',
    quote:
      'Procurei a Agavê para melhorar meu rendimento nos treinos e ajustar indicadores metabólicos. Evolução medida em números e muito profissionalismo em cada retorno.',
    defaultInterest: 'Performance, personal e Pilates',
  },
  {
    id: 'rev-5',
    author: 'Patrícia L.',
    category: 'Nutrição, Personal & Pilates',
    doctorTag: 'Equipe Agavê',
    rating: 5,
    highlight: 'Constância e acompanhamento próximo',
    quote:
      'Ter consulta médica, nutrição e Pilates alinhados no mesmo lugar fez toda a diferença para eu manter constância. Equipe super dedicada, atenciosa e pontual.',
    defaultInterest: 'Nutrição',
  },
  {
    id: 'rev-6',
    author: 'Eduardo V.',
    category: 'Diagnóstico & Longevidade',
    doctorTag: 'Corpo Clínico Agavê',
    rating: 5,
    highlight: 'Referência em saúde em Rio Claro',
    quote:
      'Profissionais atualizados com o que há de mais sério na medicina. Saí da consulta entendendo exatamente cada etapa do meu plano de saúde. Recomendo de olhos fechados.',
    defaultInterest: 'Cardiologia',
  },
];

