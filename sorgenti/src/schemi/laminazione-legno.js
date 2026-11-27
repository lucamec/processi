// Schema animato e mini-diagrammi: Laminazione del legno (Thompson 2007, pp. 190–197).
// Schema principale: impiallacciature in stampo a due parti, a freddo (caso T46).
// Fasi: 1 strati incollati, 2 pressatura, 3 indurimento della colla, 4 sformatura e rifilatura CNC.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

const N = 7;
const strato = (i, forma) => {
  const y = 150 + i * 7;
  if (!forma) return `M220,${y} H600`;
  return `M220,${y + 40} Q300,${y + 40} 330,${y + 10} Q410,${y - 50} 490,${y + 10} Q520,${y + 40} 600,${y + 40}`;
};
const colori = (i) => (i === 0 || i === N - 1 ? 'var(--grezzo)' : i % 2 ? '#d9c08a' : '#b8935a');

function schema(id) {
  const piani = [], curvi = [];
  for (let i = 0; i < N; i++) {
    piani.push(`<path d="${strato(i, false)}" fill="none" stroke="${colori(i)}" stroke-width="6"/>`);
    curvi.push(`<path d="${strato(i, true)}" fill="none" stroke="${colori(i)}" stroke-width="6"/>`);
  }
  return `
<!-- stampo inferiore (matrice) -->
<path d="M200,${150 + N * 7 + 40} Q300,${150 + N * 7 + 40} 330,${150 + N * 7 + 10} Q410,${150 + N * 7 - 50} 490,${150 + N * 7 + 10} Q520,${150 + N * 7 + 40} 620,${150 + N * 7 + 40} V320 H200 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
${etichetta({ testo: 'Stampo inferiore (legno, OSB o compensato)', tx: 200, ty: 345 })}
<!-- strati di impiallacciatura -->
<g${anim({ op: [1, 0, 0, 0] }, { op: 1 })}>${piani.join('')}</g>
<g${anim({ op: [0, 1, 1, 0] }, { op: 0 })}>${curvi.join('')}</g>
<g${anim({ op: [0, 0, 0, 1] }, { op: 0 })}>${curvi.map((p) => p.replace(/stroke="[^"]+"/, 'style="stroke:var(--finito)"')).join('')}
  <line x1="250" y1="160" x2="250" y2="250" stroke="var(--ko)" stroke-width="3" stroke-dasharray="4 3"/><line x1="570" y1="160" x2="570" y2="250" stroke="var(--ko)" stroke-width="3" stroke-dasharray="4 3"/>
  ${etichetta({ testo: 'rifilato con fresatrice CNC a 5 assi', tx: 560, ty: 160 })}</g>
${etichetta({ testo: 'Fogli di impiallacciatura incollati (numero dispari, fibre incrociate)', tx: 160, ty: 130, extra: anim({ op: [1, 0, 0, 0] }, { op: 1 }) })}
<!-- stampo superiore (tampone) -->
<g${anim({ ty: [-110, 0, 0, -110] }, { ty: -110 })}>
  <path d="M200,60 H620 V${150 - 2 + 40} Q520,${150 - 2 + 40} 490,${150 - 2 + 10} Q410,${150 - 2 - 50} 330,${150 - 2 + 10} Q300,${150 - 2 + 40} 200,${150 - 2 + 40} Z" fill="url(#${id}-tratteggio)" class="contorno"/>
  <g${anim({ op: [0, 1, 1, 0] })}>${freccia({ id, x1: 410, y1: 0, x2: 410, y2: 56 })}</g>
</g>
${etichetta({ testo: 'Tampone premuto da una vite', tx: 590, ty: 60 })}
<g${anim({ op: [0, 0, 1, 0] })}>${etichetta({ testo: 'a freddo: 24 ore nello stampo', tx: 600, ty: 100 })}</g>
`;
}

const ln = (d, w, col) => `<path d="${d}" fill="none" stroke-width="${w}" style="stroke:${col}"/>`;
const coppie = {
  strati: {
    ok: ['Numero dispari di strati, simmetrico', 'Fogli incrociati in numero dispari, con impiallacciature esterne uguali: tensione e compressione si bilanciano e il pezzo non si imbarca.', () => [0, 1, 2, 3, 4].map((i) => `<rect x="20" y="${30 + i * 12}" width="120" height="10" fill="${i % 2 ? '#d9c08a' : '#b8935a'}" stroke="var(--testo)"/>`).join('')],
    ko: ['Strati asimmetrici', 'Una costruzione sbilanciata tende a svergolarsi e imbarcarsi.', () => `${[0, 1, 2, 3].map((i) => `<rect x="20" y="${30 + i * 12}" width="120" height="10" fill="${i < 3 ? '#d9c08a' : '#b8935a'}" stroke="var(--testo)" transform="rotate(${-4 + i * 2} 80 60)"/>`).join('')}<circle cx="135" cy="35" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  raggio: {
    ok: ['Fogli sottili per curve strette', 'Il raggio minimo dipende dallo spessore del singolo foglio, non dallo spessore totale: anche pezzi spessi fanno curve strette.', () => [0, 1, 2, 3, 4].map((i) => ln(`M20,${100 - i * 4} H60 A${20 + i * 4},${20 + i * 4} 0 0 0 ${80 + i * 4},${80 - i * 4 - 20 + 20} V10`, 3, i % 2 ? '#d9c08a' : '#b8935a')).join('')],
    ko: ['Strisce spesse per curve strette', 'Un foglio spesso piegato stretto si crepa.', () => `${ln('M20,100 H60 A20,20 0 0 0 80,80 V10', 14, '#b8935a')}<circle cx="74" cy="92" r="11" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  massello: {
    ok: ['Massello: curve ampie', 'La laminazione di legno massiccio permette solo curve graduali e di grande raggio.', () => [0, 1, 2].map((i) => ln(`M10,${90 - i * 12} Q80,${40 - i * 12} 150,${90 - i * 12}`, 10, i % 2 ? '#d9c08a' : '#b8935a')).join('')],
    ko: ['Massello con curva stretta', 'Le sezioni di massello non sopportano curve strette.', () => `${[0, 1, 2].map((i) => ln(`M30,${100 - i * 12} Q80,${-10 - i * 12} 130,${100 - i * 12}`, 10, i % 2 ? '#d9c08a' : '#b8935a')).join('')}<circle cx="80" cy="30" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  kerf: ['Taglio a kerf (kerfing)', 'Tagli paralleli profondi da un terzo a tre quarti dello spessore, sul lato interno della curva, rendono il legno flessibile; la laminazione blocca la curva. Utile anche per modelli, senza pressa né stampo.', () => `
    <path d="M20,90 Q110,10 200,90" fill="none" stroke="#b8935a" stroke-width="18"/>
    ${[40, 60, 80, 100, 120, 140, 160, 180].map((x) => { const t = (x - 20) / 180, y = 90 - 2 * 80 * t * (1 - t) * 1.25 + 9; return `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - 10}" stroke="#ffffff" stroke-width="2"/>`; }).join('')}`],
  massello: ['Laminazione di massello', 'Il legno si taglia in sezioni e si reincolla nella forma voluta, a freddo e di solito su un solo asse: elementi strutturali per l\'edilizia, meno soggetti a ritiro e svergolamento.', () => [0, 1, 2, 3].map((i) => ln(`M10,${100 - i * 10} Q110,${30 - i * 10} 210,${100 - i * 10}`, 9, i % 2 ? '#d9c08a' : '#b8935a')).join('')],
  sottovuoto: ['Impiallacciature sottovuoto', 'Gli strati si posano su uno stampo a una faccia e un sacco sottovuoto li preme; la colla si indurisce con calore a bassa tensione, radiante, a radiofrequenza o a temperatura ambiente.', (id) => `
    <path d="M10,110 V80 Q110,20 210,80 V110 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${[0, 1, 2].map((i) => ln(`M10,${76 - i * 5} Q110,${16 - i * 5} 210,${76 - i * 5}`, 4, i % 2 ? '#d9c08a' : '#b8935a')).join('')}
    ${ln('M6,72 Q110,0 214,72', 2, 'var(--flusso)')}`],
};

module.exports = { viewBox: '0 -60 820 420', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
