// Schema animato e mini-diagrammi: Stampaggio a iniezione (Thompson 2007, pp. 50–63).
// Fasi: 1 plastificazione, 2 chiusura, 3 iniezione, 4 mantenimento e raffreddamento, 5 apertura ed estrazione.
'use strict';
const C = require('../componenti');
const { anim, stampo, pezzo, ugello, freccia, calore, etichetta } = C;

// Sezione del pezzo (bicchiere aperto verso destra), a stampo chiuso.
const PEZZO = 'M640,120 H545 V240 H640 V228 H557 V132 H640 Z';

function schema(id) {
  const apri = 110; // corsa di apertura del semistampo mobile
  return `
<g class="macchina-iniezione">
  <!-- Motore e pistone idraulico -->
  <rect x="8" y="150" width="44" height="60" class="macchina"/>
  ${etichetta({ testo: 'Motore + pistone', tx: 8, ty: 236 })}
  <g${anim({ op: [0, 0, 1, 1, 0] })}>
    ${freccia({ id, x1: 14, y1: 262, x2: 84, y2: 262 })}
    ${etichetta({ testo: 'Pressione di iniezione', tx: 92, ty: 267 })}
  </g>

  <!-- Tramoggia -->
  <path d="M95,55 L185,55 L150,150 L130,150 Z" class="macchina"/>
  <g class="granuli">
    ${[[120, 75], [140, 72], [160, 76], [130, 92], [150, 90], [140, 108], [135, 125], [145, 138], [110, 64], [170, 64]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" class="m-grezzo contorno"/>`).join('')}
  </g>
  ${etichetta({ testo: 'Tramoggia con granuli', tx: 192, ty: 52, px: 170, py: 70 })}

  <!-- Cilindro (sezione) -->
  <rect x="58" y="168" width="414" height="24" class="cavita"/>
  ${stampo({ id, x: 58, y: 150, w: 414, h: 18 })}
  ${stampo({ id, x: 58, y: 192, w: 414, h: 18 })}
  <rect x="130" y="149" width="20" height="20" class="cavita"/>
  ${[205, 285, 365].map((x) => `<rect x="${x}" y="141" width="44" height="9" class="scuro"/><rect x="${x}" y="210" width="44" height="9" class="scuro"/>`).join('')}
  ${[227, 307, 387].map((x) => calore({ id, x, y: 100, lungo: 34 })).join('')}
  ${etichetta({ testo: 'Fasce riscaldanti', tx: 262, ty: 92 })}
  ${etichetta({ testo: 'Cilindro (in sezione)', tx: 120, ty: 305, px: 130, py: 210 })}

  <!-- Accumulo di materiale fuso davanti alla vite -->
  <rect x="425" y="168" width="47" height="24" class="m-fuso"${anim({ sx: [1, 1, 0.02, 0.02, 0.02] }, null, [472, 180])}/>

  <!-- Vite: arretra mentre plastifica (fase 1), avanza come un pistone (fase 3) -->
  <g${anim({ tx: [-40, -40, 0, 0, 0] })}>
    <rect x="20" y="176" width="410" height="8" class="m-stampo contorno"/>
    <line x1="75" y1="180" x2="424" y2="180" stroke-width="22" stroke-dasharray="5 13" class="filetti"${anim({ dash: [-216, -216, -216, -216, -216] }, { dash: 0 })}/>
    <path d="M424,168 L466,180 L424,192 Z" class="m-stampo contorno"/>
  </g>
  ${etichetta({ testo: 'Vite di Archimede', tx: 290, ty: 262, px: 320, py: 190 })}

  <!-- Ugello -->
  ${ugello({ id, x: 500, y: 180, lungo: 28, alto: 40, foro: 8 })}
  <rect x="472" y="176" width="28" height="8" class="m-fuso"/>
  ${etichetta({ testo: 'Ugello', tx: 448, ty: 135, px: 486, py: 166 })}
</g>

<!-- Riempimento progressivo della cavità -->
<clipPath id="${id}-riempi" clipPathUnits="userSpaceOnUse">
  <rect x="500" y="90" width="145" height="180"${anim({ sx: [0, 0, 1, 1, 1] }, { sx: 0 }, [500, 180])}/>
</clipPath>

<!-- Semistampo fisso con canale di colata -->
${stampo({ id, x: 500, y: 90, w: 45, h: 180 })}
<rect x="500" y="176" width="45" height="8" class="cavita"/>
<g clip-path="url(#${id}-riempi)">
  <rect x="500" y="176" width="45" height="8" class="m-fuso"${anim({ op: [1, 1, 1, 0, 0] }, { op: 1 })}/>
  <rect x="500" y="176" width="45" height="8" class="m-finito"${anim({ op: [0, 0, 0, 1, 0] }, { op: 0 })}/>
</g>
${[[522, 112], [522, 248]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" class="m-flusso"${anim({ op: [0.25, 0.25, 0.25, 1, 0.25] })}/>`).join('')}
${etichetta({ testo: 'Semistampo fisso', tx: 470, ty: 292 })}

<!-- Gruppo mobile: semistampo, estrattori, piastra e pezzo -->
<g${anim({ tx: [apri, 0, 0, 0, apri] })}>
  ${stampo({ id, x: 545, y: 90, w: 135, h: 180 })}
  <path d="${PEZZO}" class="cavita"/>
  ${[[600, 104], [600, 256], [612, 180]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" class="m-flusso"${anim({ op: [0.25, 0.25, 0.25, 1, 0.25] })}/>`).join('')}
  <rect x="680" y="70" width="20" height="220" class="macchina"/>
  <rect x="700" y="170" width="100" height="20" class="macchina"/>
  <g${anim({ op: [0, 1, 1, 1, 0] })}>
    ${freccia({ id, x1: 790, y1: 60, x2: 712, y2: 60 })}
    ${etichetta({ testo: 'Forza di chiusura', tx: 640, ty: 48 })}
  </g>
  <g${anim({ tx: [0, 0, 0, 0, -100] }, { tx: 0 })}>
    <rect x="640" y="122" width="42" height="8" class="scuro"/>
    <rect x="640" y="230" width="42" height="8" class="scuro"/>
  </g>
  ${etichetta({ testo: 'Semistampo mobile', tx: 546, ty: 82 })}
  ${etichetta({ testo: 'Estrattori', tx: 655, ty: 322, px: 662, py: 238 })}
  <g${anim({ tx: [0, 0, 0, 0, -100] }, { tx: 0 })}>
    <g clip-path="url(#${id}-riempi)">
      ${pezzo({ d: PEZZO, materiale: 'fuso', extra: anim({ op: [1, 1, 1, 0, 0] }, { op: 1 }) })}
    </g>
    ${pezzo({ d: PEZZO, materiale: 'finito', extra: anim({ op: [0, 0, 0, 1, 1] }, { op: 0 }) })}
  </g>
</g>
<rect x="796" y="160" width="24" height="40" class="macchina"/>
`;
}

// ---------- Mini-diagrammi dei vincoli (corretto / da evitare) ----------
const coppie = {
  spessore: {
    ok: ['Pareti di spessore uniforme', 'Sezione a U con fondo e fianchi dello stesso spessore.', () => `${pezzo({ d: 'M20,25 H40 V75 H120 V25 H140 V95 H20 Z' })}`],
    ko: ['Pareti di spessore molto diverso', 'Sezione a U con fianchi sottili e fondo molto spesso: raffreddamento non uniforme e deformazione.', () => `${pezzo({ d: 'M20,25 H30 V55 H130 V25 H140 V95 H20 Z' })}<path d="M30,98 q50,10 100,0" class="flusso-linea tratteggiata"/>`],
  },
  ingresso: {
    ok: ['Ingresso nella sezione più spessa', 'Il materiale entra dalla parte spessa e finisce in quella sottile.', (id) => `${pezzo({ d: 'M20,40 H90 V30 H150 V80 H90 V70 H20 Z' })}${freccia({ id, x1: 150, y1: 98, x2: 120, y2: 84 })}<path d="M60,55 H30" class="flusso-linea tratteggiata"/>`],
    ko: ['Ingresso nella sezione sottile', 'Il materiale entra dalla parte sottile e deve riempire per ultima la parte spessa.', (id) => `${pezzo({ d: 'M20,40 H90 V30 H150 V80 H90 V70 H20 Z' })}${freccia({ id, x1: 8, y1: 98, x2: 24, y2: 74 })}<path d="M100,55 H140" class="flusso-linea tratteggiata"/>`],
  },
  sformo: {
    ok: ['Pareti inclinate (sformo)', 'Le pareti laterali sono leggermente inclinate: il pezzo si stacca dal nucleo.', (id) => `${pezzo({ d: 'M30,20 L42,20 L48,90 L112,90 L118,20 L130,20 L122,100 L38,100 Z' })}<path d="M50,20 L56,85 L104,85 L110,20 Z" class="m-stampo contorno" opacity=".85"/>${freccia({ id, x1: 80, y1: 40, x2: 80, y2: 6 })}${etichetta({ testo: '≥ 0,5°', tx: 118, ty: 12 })}`],
    ko: ['Pareti verticali (sformo nullo)', 'Pareti a 90°: il pezzo si incolla al nucleo e si sollecita in estrazione.', (id) => `${pezzo({ d: 'M30,20 L42,20 L42,90 L118,90 L118,20 L130,20 L130,100 L30,100 Z' })}<rect x="45" y="20" width="70" height="66" class="m-stampo contorno" opacity=".85"/>${freccia({ id, x1: 80, y1: 40, x2: 80, y2: 6 })}${etichetta({ testo: '0°', tx: 124, ty: 12 })}`],
  },
  spigoli: {
    ok: ['Spigoli raccordati', 'Angoli interni ed esterni con raggio: il flusso è regolare e le tensioni si distribuiscono.', () => pezzo({ d: 'M20,20 H50 V70 Q50,80 60,80 H140 V100 H50 Q20,100 20,70 Z' })],
    ko: ['Spigoli vivi', 'Angoli netti: le tensioni si concentrano nello spigolo interno.', () => `${pezzo({ d: 'M20,20 H50 V80 H140 V100 H20 Z' })}<circle cx="50" cy="80" r="9" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  nervature: {
    ok: ['Molte nervature basse', 'Diverse nervature poco profonde irrigidiscono la parete.', () => `${pezzo({ d: 'M10,80 H150 V94 H10 Z' })}${[30, 60, 90, 120].map((x) => pezzo({ d: `M${x},80 V58 H${x + 7} V80 Z` })).join('')}`],
    ko: ['Poche nervature alte', 'Una nervatura molto alta rispetto allo spessore della parete.', () => `${pezzo({ d: 'M10,80 H150 V94 H10 Z' })}${pezzo({ d: 'M74,80 V12 H86 V80 Z' })}`],
  },
  collegati: {
    ok: ['Sporgenze collegate alle pareti', 'La borchia è unita alla parete con nervature: niente sacche d\'aria.', () => `${pezzo({ d: 'M10,85 H150 V97 H10 Z M10,20 H22 V85 H10 Z' })}${pezzo({ d: 'M70,85 V40 H90 V85 Z' })}${pezzo({ d: 'M22,60 H70 V66 H22 Z' })}`],
    ko: ['Sporgenze isolate', 'Borchia staccata dalle pareti: possibili sacche d\'aria e punti di tensione.', () => `${pezzo({ d: 'M10,85 H150 V97 H10 Z M10,20 H22 V85 H10 Z' })}${pezzo({ d: 'M70,85 V40 H90 V85 Z' })}`],
  },
  giunzione: {
    ok: ['Linea di giunzione in zona nascosta', 'Spostando il punto di iniezione, la linea dove i fronti si riuniscono cade in una zona non critica.', (id) => `${pezzo({ d: 'M10,25 H150 V95 H10 Z' })}<circle cx="80" cy="60" r="12" class="cavita contorno"/>${freccia({ id, x1: 150, y1: 6, x2: 150, y2: 22 })}<line x1="80" y1="72" x2="80" y2="95" stroke="var(--ko)" stroke-width="2.5" stroke-dasharray="3 3"/>`],
    ko: ['Linea di giunzione in vista', 'Il flusso si divide attorno al foro e si riunisce in una zona visibile del pezzo.', (id) => `${pezzo({ d: 'M10,25 H150 V95 H10 Z' })}<circle cx="80" cy="60" r="12" class="cavita contorno"/>${freccia({ id, x1: 10, y1: 6, x2: 10, y2: 22 })}<line x1="92" y1="60" x2="150" y2="60" stroke="var(--ko)" stroke-width="2.5" stroke-dasharray="3 3"/>`],
  },
  sottosquadri: {
    ok: ['Sottosquadro con nucleo mobile', 'Un nucleo laterale retrattile (carrello) libera il sottosquadro prima dell\'estrazione.', (id) => `${pezzo({ d: 'M20,30 H140 V95 H20 Z M40,48 H120 V95 H40 Z' })}<rect x="140" y="55" width="18" height="16" class="m-stampo contorno"/>${pezzo({ d: 'M120,55 H140 V71 H120 Z', materiale: 'finito' })}${freccia({ id, x1: 150, y1: 82, x2: 158, y2: 82 })}`],
    ko: ['Sottosquadro senza nucleo mobile', 'Il dente blocca il pezzo nello stampo: non si può estrarre lungo la direzione di apertura.', (id) => `${pezzo({ d: 'M20,30 H140 V95 H20 Z M40,48 H120 V95 H40 Z' })}${pezzo({ d: 'M108,48 H120 V70 H108 Z' })}${freccia({ id, x1: 80, y1: 40, x2: 80, y2: 6 })}<line x1="100" y1="10" x2="125" y2="35" stroke="var(--ko)" stroke-width="3"/><line x1="125" y1="10" x2="100" y2="35" stroke="var(--ko)" stroke-width="3"/>`],
  },
};

// ---------- Schemi delle varianti ----------
const varianti = {
  gas: ['Iniezione assistita da gas', 'Cavità parzialmente riempita di plastica fusa; una bolla di gas spinge il materiale verso le estremità e lascia una sezione cava.', (id) => `
    ${stampo({ id, x: 10, y: 10, w: 200, h: 26 })}${stampo({ id, x: 10, y: 84, w: 200, h: 26 })}
    <rect x="10" y="36" width="200" height="48" class="cavita"/>
    <path d="M10,36 H170 Q186,60 170,84 H10 Z" class="m-fuso contorno"/>
    <path d="M10,48 H140 Q154,60 140,72 H10 Z" class="cavita" stroke="var(--flusso)" stroke-width="2"/>
    ${freccia({ id, x1: 20, y1: 60, x2: 120, y2: 60 })}
    ${etichetta({ testo: 'gas', tx: 26, ty: 56 })}`],
  multishot: ['Iniezione multicomponente', 'Due cavità nello stesso stampo; il piano girevole ruota di 180° e il secondo polimero viene iniettato sopra il primo già solidificato.', (id) => `
    ${stampo({ id, x: 10, y: 10, w: 90, h: 100 })}${stampo({ id, x: 120, y: 10, w: 90, h: 100 })}
    <rect x="30" y="40" width="50" height="22" class="m-finito contorno"/>
    <rect x="140" y="40" width="50" height="22" class="m-finito contorno"/><rect x="140" y="62" width="50" height="14" class="m-fuso contorno"/>
    ${etichetta({ testo: 'A', tx: 55, ty: 119, ancora: 'middle' })}${etichetta({ testo: 'A + B', tx: 165, ty: 119, ancora: 'middle' })}
    ${C.rotazione({ id, cx: 110, cy: 60, r: 16 })}
    ${etichetta({ testo: '180°', tx: 110, ty: 14, ancora: 'middle' })}`],
  imd: ['Decorazione in stampo', 'Una pellicola stampata è posta sulla parete della cavità; la plastica iniettata dietro la pellicola si lega a essa.', (id) => `
    ${stampo({ id, x: 10, y: 10, w: 200, h: 26 })}${stampo({ id, x: 10, y: 84, w: 200, h: 26 })}
    <rect x="10" y="36" width="200" height="48" class="cavita"/>
    <rect x="10" y="36" width="200" height="6" class="m-grezzo contorno"/>
    <path d="M10,42 H150 Q164,62 150,84 H10 Z" class="m-fuso contorno"/>
    ${freccia({ id, x1: 20, y1: 64, x2: 110, y2: 64 })}
    ${etichetta({ testo: 'pellicola stampata (giallo)', tx: 110, ty: 119, ancora: 'middle' })}`],
};

module.exports = {
  viewBox: '0 0 880 340',
  schema,
  mini: Object.fromEntries(Object.entries(coppie).map(([k, v]) => [k, { ok: v.ok, ko: v.ko }])),
  varianti,
  miniVariante: { w: 220, h: 124 },
};
