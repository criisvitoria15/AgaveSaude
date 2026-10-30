import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatMinutesToHHMM,
  getClinicScheduleStatus,
  isScheduleRowToday,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  computeStoryScrollState,
  DOCTORS_DATA,
  PATIENT_REVIEWS,
  computeDroneCameraPose,
} from './schedule';

test('formatMinutesToHHMM formats minutes accurately', () => {
  assert.equal(formatMinutesToHHMM(480), '08:00');
  assert.equal(formatMinutesToHHMM(720), '12:00');
  assert.equal(formatMinutesToHHMM(840), '14:00');
  assert.equal(formatMinutesToHHMM(1080), '18:00');
});

test('getClinicScheduleStatus detects open morning and afternoon weekday shifts', () => {
  const mondayMorning = getClinicScheduleStatus({ dayOfWeek: 1, minutesOfDay: 9 * 60 });
  assert.equal(mondayMorning.isOpen, true);
  assert.equal(mondayMorning.label, 'Aberto agora · fecha às 12:00');

  const wednesdayLunch = getClinicScheduleStatus({ dayOfWeek: 3, minutesOfDay: 13 * 60 });
  assert.equal(wednesdayLunch.isOpen, false);
  assert.equal(wednesdayLunch.label, 'Fechado · abre hoje às 14:00');

  const fridayAfternoon = getClinicScheduleStatus({ dayOfWeek: 5, minutesOfDay: 16 * 60 });
  assert.equal(fridayAfternoon.isOpen, true);
  assert.equal(fridayAfternoon.label, 'Aberto agora · fecha às 18:00');
});

test('getClinicScheduleStatus handles Saturday afternoon and Sunday closed states', () => {
  const saturdayAfternoon = getClinicScheduleStatus({ dayOfWeek: 6, minutesOfDay: 15 * 60 });
  assert.equal(saturdayAfternoon.isOpen, false);
  assert.equal(saturdayAfternoon.label, 'Fechado · abre segunda às 08:00');

  const sundayMorning = getClinicScheduleStatus({ dayOfWeek: 0, minutesOfDay: 10 * 60 });
  assert.equal(sundayMorning.isOpen, false);
  assert.equal(sundayMorning.label, 'Fechado · abre amanhã às 08:00');
});

test('isScheduleRowToday matches weekday ranges and single days', () => {
  assert.equal(isScheduleRowToday('1-5', 3), true);
  assert.equal(isScheduleRowToday('1-5', 6), false);
  assert.equal(isScheduleRowToday('6', 6), true);
  assert.equal(isScheduleRowToday('0', 0), true);
});

test('buildWhatsAppMessage and buildWhatsAppUrl format message with or without name', () => {
  assert.equal(
    buildWhatsAppMessage('Maria', 'Cardiologia'),
    'Olá! Meu nome é Maria. Gostaria de agendar uma consulta e saber mais sobre: Cardiologia.'
  );
  assert.equal(
    buildWhatsAppMessage('   ', 'Emagrecimento'),
    'Olá! Gostaria de agendar uma consulta e saber mais sobre: Emagrecimento.'
  );
  const url = buildWhatsAppUrl('Henrique', 'Performance, personal e Pilates');
  assert.equal(url.startsWith('https://wa.me/5519983236161?text='), true);
});

test('computeStoryScrollState calculates active slide and opacity transitions', () => {
  const startState = computeStoryScrollState(0, 4);
  assert.equal(startState.activeIndex, 0);
  assert.equal(startState.slides[0].opacity, 1);
  assert.equal(startState.slides[1].opacity, 0);

  const endState = computeStoryScrollState(1, 4);
  assert.equal(endState.activeIndex, 3);
  assert.equal(endState.slides[3].opacity > 0.99, true);
});

test('DOCTORS_DATA contains verified CRM-SP credentials for both doctors', () => {
  assert.equal(DOCTORS_DATA.length, 2);
  const lysanne = DOCTORS_DATA.find((d) => d.id === 'dra-lysanne');
  const henrique = DOCTORS_DATA.find((d) => d.id === 'dr-henrique');
  assert.equal(lysanne?.crm, 'CRM-SP 153.382');
  assert.equal(henrique?.crm, 'CRM-SP 153.340');
});

test('computeDroneCameraPose returns bounded 3D camera coordinates and pulls back on narrow viewports', () => {
  const desktopPose = computeDroneCameraPose(2.5, 0.4, 0.2, -0.1, 'marquise', true, 1.38);
  assert.equal(desktopPose.camZ >= 7.2 && desktopPose.camZ <= 9.0, true);
  assert.equal(typeof desktopPose.rollZ, 'number');

  const mobilePose = computeDroneCameraPose(2.5, 0.4, 0.2, -0.1, 'marquise', true, 1.0);
  assert.equal(mobilePose.camZ > desktopPose.camZ, true);
  assert.equal(mobilePose.focusDepth >= 0 && mobilePose.focusDepth <= 1, true);
});

test('PATIENT_REVIEWS contains 6 five-star verified patient testimonials', () => {
  assert.equal(PATIENT_REVIEWS.length, 6);
  for (const rev of PATIENT_REVIEWS) {
    assert.equal(rev.rating, 5);
    assert.equal(rev.quote.length > 40, true);
    assert.equal(rev.author.length > 3, true);
  }
});
