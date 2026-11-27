// Schema animato e mini-diagrammi: Saldatura a vibrazione (Thompson 2007, pp. 298–301).
// Sezione di una saldatrice lineare: piano superiore vibrante, piano inferiore che sale.
// Fasi: 1 carico, 2 chiusura, 3 vibrazione, 4 mantenimento, 5 apertura.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const ROSSO = '#c0392b';

function schema(id) {
  return `
<!-- piano superiore vibrante con il guscio (tenuto dal vuoto) -->
<g${anim({ vx: [0, 0, 8, 0, 0] }, { vx: 0 })}>
  <rect x="220" y="40" width="380" height="40" class="macchina"/>
  <path d="M240,80 H580 V100 H570 V180 H250 V100 H240 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
  <path d="M260,100 H560 V170 H260 Z" class="m-grezzo contorno"/>
  <path d="M252,170 H568 V182 H252 Z" class="m-grezzo contorno"/>
</g>
${etichetta({ testo: 'Piano superiore vibrante', tx: 620, ty: 64 })}
<g${anim({ op: [0, 0, 1, 0, 0] })}>${freccia({ id, x1: 640, y1: 130, x2: 690, y2: 130 })}${freccia({ id, x1: 690, y1: 150, x2: 640, y2: 150 })}${etichetta({ testo: 'oscillazione', tx: 640, ty: 110 })}</g>
<!-- piano inferiore che sale con il catarifrangente -->
<g${anim({ ty: [0, -30, -30, -30, 0] }, { ty: 0 })}>
  <path d="M252,214 H568 V226 H252 Z" fill="${ROSSO}" class="contorno"/>
  <path d="M262,226 H558 V246 H262 Z" fill="${ROSSO}" opacity="0.75" class="contorno"/>
  <path d="M240,226 H580 V320 H240 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
  <rect x="220" y="320" width="380" height="30" class="macchina"/>
  <g${anim({ op: [0, 0, 1, 1, 0] }, { op: 0 })}><rect x="252" y="208" width="316" height="8" style="fill:var(--fuso)"/></g>
  <g${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}><rect x="252" y="208" width="316" height="8" style="fill:var(--finito)"/></g>
</g>
${etichetta({ testo: 'Piano inferiore', tx: 620, ty: 300 })}
<g${anim({ op: [0, 1, 0, 0, 0] })}>${freccia({ id, x1: 200, y1: 300, x2: 200, y2: 250 })}${etichetta({ testo: 'il piano sale e preme i pezzi', tx: 20, ty: 330 })}</g>
<g${anim({ op: [0, 0, 1, 0, 0] })}>${etichetta({ testo: 'l\'attrito fonde il giunto in 2–3 secondi', tx: 20, ty: 330 })}</g>
<g${anim({ op: [0, 0, 0, 1, 0] })}>${etichetta({ testo: 'vibrazione ferma, pezzi allineati, pressione fino alla solidificazione', tx: 20, ty: 330 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${etichetta({ testo: 'i piani si aprono; il fanale saldato resta in quello superiore', tx: 20, ty: 330 })}</g>
`;
}

const coppie = {
  piano: {
    ok: ['Giunto piano', 'Il piano di vibrazione deve essere piatto, o inclinato al massimo di 10°, perché i pezzi possano scorrere e scaldarsi.', () => `<rect x="20" y="40" width="120" height="30" class="m-grezzo contorno"/><rect x="20" y="70" width="120" height="30" fill="#c0392b" class="contorno"/>`],
    ko: ['Giunto curvo o inclinato', 'Su un giunto molto inclinato la vibrazione non genera attrito uniforme.', () => `<path d="M20,70 Q80,20 140,70 V40 H20 Z" class="m-grezzo contorno"/><path d="M20,70 Q80,20 140,70 V100 H20 Z" fill="#c0392b" class="contorno"/><circle cx="80" cy="46" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  presa: {
    ok: ['Pezzi ben tenuti dall\'attrezzatura', 'I pezzi devono essere afferrati in modo da trasmettere l\'energia al giunto; le pareti lunghe vanno sostenute.', (id) => `<path d="M20,30 H140 V50 H130 V90 H30 V50 H20 Z" fill="url(#${id}-tratteggio)" class="contorno"/><rect x="34" y="50" width="92" height="40" class="m-grezzo contorno"/>`],
    ko: ['Pareti sottili non sostenute', 'Pareti sottili e lunghe si flettono invece di vibrare con l\'attrezzatura.', () => `<path d="M30,30 V100 M130,30 Q150,65 130,100" fill="none" stroke="var(--grezzo)" stroke-width="5"/><circle cx="140" cy="65" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  materiali: {
    ok: ['Stesso materiale', 'Si saldano materiali uguali; fanno eccezione ABS, PMMA e PC, che si uniscono fra loro.', () => `<rect x="20" y="40" width="120" height="30" class="m-grezzo contorno"/><rect x="20" y="70" width="120" height="30" class="m-grezzo contorno"/>${C.etichetta({ testo: 'PP + PP', tx: 80, ty: 108, ancora: 'middle' })}`],
    ko: ['Plastiche diverse', 'Due termoplastici diversi, in generale, non si mescolano in un giunto omogeneo.', () => `<rect x="20" y="40" width="120" height="30" class="m-grezzo contorno"/><rect x="20" y="70" width="120" height="30" class="m-finito contorno"/><circle cx="80" cy="70" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>${C.etichetta({ testo: 'PP + PA', tx: 80, ty: 108, ancora: 'middle' })}`],
  },
};

const varianti = {
  lineare: ['Vibrazione lineare', 'Moto alternato su un solo asse; pezzi fino a 500 × 1.500 mm, ma non adatta a pareti sottili e lunghe non sostenute.', (id) => `
    <rect x="40" y="30" width="140" height="30" class="m-grezzo contorno"/><rect x="40" y="64" width="140" height="30" fill="#c0392b" class="contorno"/>
    ${C.freccia({ id, x1: 110, y1: 18, x2: 170, y2: 18 })}${C.freccia({ id, x1: 110, y1: 18, x2: 50, y2: 18 })}`],
  orbitale: ['Vibrazione orbitale', 'Tre elettromagneti a 120° muovono l\'attrezzatura in un\'orbita costante, a 190–220 Hz: ogni punto descrive lo stesso piccolo cerchio. Serve meno pressione, adatta a parti delicate fino a 250 mm.', () => `
    <circle cx="110" cy="62" r="36" class="m-grezzo contorno"/>
    ${[0, 120, 240].map((a) => { const r = a * Math.PI / 180; return `<rect x="${110 + 52 * Math.cos(r) - 8}" y="${62 + 52 * Math.sin(r) - 8}" width="16" height="16" class="scuro"/>`; }).join('')}
    <circle cx="110" cy="62" r="8" fill="none" stroke="var(--fuso)" stroke-width="3"/>`],
  preriscaldo: ['Con preriscaldo', 'Scaldando il giunto prima della vibrazione, come nella saldatura a piastra calda, i giunti sono più puliti e producono meno residui, utile per esempio nei filtri.', () => `
    <rect x="40" y="20" width="140" height="26" class="m-grezzo contorno"/><rect x="40" y="78" width="140" height="26" fill="#c0392b" class="contorno"/>
    <rect x="30" y="54" width="160" height="16" style="fill:var(--fuso)" opacity="0.6"/>`],
};

module.exports = { viewBox: '0 20 820 340', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
