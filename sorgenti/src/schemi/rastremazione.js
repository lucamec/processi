// Schema animato e mini-diagrammi: Rastremazione (swaging) (Thompson 2007, pp. 104–109).
// Schema principale: rastremazione rotativa con punta chiusa. Fasi: 1 inserimento, 2 martellatura,
// 3 chiusura della punta, 4 estrazione.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

const TUBO = 'M120,176 H420 M120,224 H420';
const TUBO_IN = 'M120,182 H420 M120,218 H420';
const RASTR = 'M120,176 H380 L452,200 M120,224 H380 L452,200';
const RASTR_IN = 'M120,182 H380 L436,200 M120,218 H380 L436,200';
const parete = (a, b, col, extra = '') => `<g${extra}><path d="${a}" fill="none" stroke-width="5" style="stroke:var(--${col})"/><path d="${b}" fill="none" stroke-width="5" style="stroke:var(--${col})"/></g>`;

function schema(id) {
  return `
<line x1="80" y1="200" x2="720" y2="200" class="asse"/>
<!-- testa rotante con i martelli -->
<rect x="340" y="80" width="240" height="240" rx="18" class="macchina"/>
${C.rotazione({ id, cx: 620, cy: 110, r: 18 })}
${etichetta({ testo: 'Testa rotante', tx: 600, ty: 70 })}
<g${anim({ vy: [0, 7, 7, 0] })}>
  <path d="M370,100 H560 V172 H460 L376,172 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
</g>
<g${anim({ vy: [0, -7, -7, 0] })}>
  <path d="M370,300 H560 V228 H460 L376,228 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
</g>
<path d="M376,172 L456,196 H560 M376,228 L456,204 H560" fill="none" stroke="var(--testo-2)" stroke-dasharray="4 4"/>
${etichetta({ testo: 'Martelli-matrice (si aprono e chiudono a ogni giro)', tx: 340, ty: 350 })}

<!-- tubo: avanza nella matrice, si rastrema e si chiude in punta -->
<g${anim({ tx: [-80, 0, 0, -160] }, { tx: -80 })}>
  ${parete(TUBO, TUBO_IN, 'grezzo', anim({ op: [1, 0, 0, 0] }, { op: 1 }))}
  ${parete(RASTR, RASTR_IN, 'fuso', anim({ op: [0, 1, 0, 0] }, { op: 0 }))}
  <g${anim({ op: [0, 0, 1, 0] }, { op: 0 })}>${parete(RASTR, RASTR_IN, 'fuso')}<path d="M436,200 L452,200" stroke="var(--fuso)" stroke-width="10"/></g>
  <g${anim({ op: [0, 0, 0, 1] }, { op: 0 })}>${parete(RASTR, RASTR_IN, 'finito')}<path d="M436,200 L452,200" stroke="var(--finito)" stroke-width="10"/></g>
</g>
${etichetta({ testo: 'Tubo', tx: 60, ty: 160 })}
<g${anim({ op: [0, 1, 1, 0] })}>${freccia({ id, x1: 100, y1: 260, x2: 180, y2: 260 })}${etichetta({ testo: 'il tubo è spinto nella matrice', tx: 100, ty: 286 })}</g>
${etichetta({ testo: 'punta chiusa: gli ultimi 10 mm diventano pieni', tx: 460, ty: 30, extra: anim({ op: [0, 0, 1, 1] }) })}
`;
}

const ln = (d, w = 5, col = 'finito') => `<path d="${d}" fill="none" stroke-width="${w}" stroke-linejoin="round" style="stroke:var(--${col})"/>`;
const coppie = {
  angolo: {
    ok: ['Conicità fino a 30°', 'L\'angolo ideale non supera i 30°: più è piccolo, più è semplice, rapido ed economico.', () => `${ln('M10,40 H90 L150,60 M10,80 H90 L150,60')}${C.etichetta({ testo: '≤ 30°', tx: 100, ty: 30 })}`],
    ko: ['Conicità troppo brusca', 'Si arriva al massimo a 45°, e solo quando serve.', () => `${ln('M10,30 H100 L130,60 M10,90 H100 L130,60')}<circle cx="110" cy="60" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  lunghezza: {
    ok: ['Rastremature lunghe in più passate', 'Se la corsa della macchina è, per esempio, 350 mm, le conicità più lunghe si fanno in due o più fasi.', () => `${ln('M5,50 H40 L150,62 M5,74 H40 L150,62')}<line x1="95" y1="40" x2="95" y2="84" stroke="var(--testo-2)" stroke-dasharray="3 3"/>${C.etichetta({ testo: 'fase 1 · fase 2', tx: 95, ty: 104, ancora: 'middle' })}`],
    ko: ['Oltre la corsa in un\'unica passata', 'Una conicità più lunga della corsa non si ottiene in una sola operazione.', () => `${ln('M5,50 H20 L150,62 M5,74 H20 L150,62')}<circle cx="85" cy="62" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  fori: {
    ok: ['Fori e filetti dopo la rastremazione', 'La rastremazione allunga il metallo: fori e filettature si fanno come operazioni successive.', () => `${ln('M10,40 H90 L150,60 M10,80 H90 L150,60')}<circle cx="50" cy="60" r="6" fill="none" stroke="var(--finito)" stroke-width="3"/>`],
    ko: ['Fori fatti prima', 'Un foro fatto prima si deforma e si sposta mentre il metallo si allunga.', () => `${ln('M10,40 H90 L150,60 M10,80 H90 L150,60')}<ellipse cx="110" cy="60" rx="10" ry="4" fill="none" stroke="var(--ko)" stroke-width="3"/>`],
  },
};

const varianti = {
  rotativa: ['Rastremazione rotativa', 'Martelli che si aprono e chiudono mentre la testa gira ad alta velocità: conicità lungo il tubo e punte chiuse. È lo schema principale.', (id) => `
    <circle cx="110" cy="62" r="50" class="macchina"/>
    ${[0, 90, 180, 270].map((a) => `<rect x="100" y="16" width="20" height="30" fill="url(#${id}-tratteggio)" class="contorno" transform="rotate(${a} 110 62)"/>`).join('')}
    <circle cx="110" cy="62" r="10" class="m-fuso contorno"/>`],
  idraulica: ['Rastremazione idraulica', 'Almeno 5 segmenti di matrice premono insieme dall\'esterno o dall\'interno del tubo per ridurlo o espanderlo; il tubo ruota per una deformazione uniforme. Funziona anche su sezioni quadre e triangolari.', (id) => `
    ${ln('M10,50 H90 L120,40 H210 M10,74 H90 L120,84 H210', 4, 'fuso')}
    <path d="M120,10 H200 V36 H128 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${C.freccia({ id, x1: 70, y1: 110, x2: 115, y2: 110 })}
    ${etichetta({ testo: 'espansione', tx: 140, ty: 114 })}`],
};

module.exports = { viewBox: '0 10 820 360', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
