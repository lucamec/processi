// Schema animato e mini-diagrammi: Elettroerosione (Thompson 2007, pp. 254–259).
// Schema principale: elettroerosione a tuffo, in sezione. Fasi: 1 elettrodo, 2 immersione nel dielettrico,
// 3 sgrossatura, 4 finitura, 5 estrazione.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

const CAVITA = 'M330,200 V236 L360,270 H460 L490,236 V200 Z';
const RAME = '#c27a4a';

function schema(id) {
  return `
<clipPath id="${id}-scavo"><rect x="300" y="200" width="220" height="72"${anim({ sy: [0, 0, 0.8, 1, 1] }, { sy: 0 }, [300, 200])}/></clipPath>
<!-- vasca e dielettrico -->
<path d="M200,80 V330 H620 V80" fill="none" stroke="var(--testo)" stroke-width="6"/>
<rect x="206" y="96" width="408" height="230" style="fill:var(--flusso)" opacity="0.16"${anim({ sy: [0, 1, 1, 1, 0] }, { sy: 0 }, [206, 326])}/>
<g${anim({ op: [0, 1, 1, 1, 0] })}>${etichetta({ testo: 'Olio dielettrico', tx: 630, ty: 110 })}</g>
<!-- pezzo con la cavità che si forma -->
<rect x="250" y="200" width="320" height="110" fill="url(#${id}-tratteggio)" class="contorno"/>
<path d="${CAVITA}" fill="#dfe6f7" clip-path="url(#${id}-scavo)"/>
<path d="${CAVITA}" fill="none" stroke="var(--finito)" stroke-width="4" clip-path="url(#${id}-scavo)"${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}/>
<rect x="230" y="310" width="360" height="14" class="macchina"/>
${etichetta({ testo: 'Pezzo (+)', tx: 630, ty: 290, px: 570, py: 290 })}

<!-- elettrodo di rame (-) -->
<g${anim({ ty: [-110, -70, -14, 0, -150] }, { ty: -150 })}>
  <rect x="396" y="40" width="28" height="80" class="macchina"/>
  <rect x="300" y="120" width="220" height="76" fill="${RAME}" class="contorno"/>
  <path d="M330,196 V232 L360,266 H460 L490,232 V196 Z" fill="${RAME}" class="contorno"/>
  <g${anim({ op: [0, 0, 1, 1, 0], vx: [0, 0, 3, 2, 0] }, { op: 0, vx: 0 })}>
    ${[350, 380, 410, 440, 470].map((x, i) => `<path d="M${x},${i % 2 ? 268 : 262} l4,4 l-4,4 l4,4" fill="none" stroke="var(--fuso)" stroke-width="2.5"/>`).join('')}
  </g>
</g>
${etichetta({ testo: 'Elettrodo di rame (−), forma negativa della cavità', tx: 20, ty: 60 })}
<g${anim({ op: [0, 0, 1, 0, 0] })}>${etichetta({ testo: 'sgrossatura: migliaia di scintille al secondo, fino a 400 mm³/min', tx: 20, ty: 360 })}</g>
<g${anim({ op: [0, 0, 0, 1, 0] })}>${etichetta({ testo: 'finitura con un nuovo elettrodo, ~50 mm³/min: texture fine', tx: 20, ty: 360 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${etichetta({ testo: 'la cavità riproduce l\'elettrodo, già con la texture finale', tx: 20, ty: 360 })}</g>
`;
}

const coppie = {
  raggi: {
    ok: ['Raggi interni generosi', 'Si arriva a raggi interni di 30 µm, ma raggi più ampi evitano concentrazioni di tensione; di solito non serve superare 0,5 mm.', (id) => `<path d="M20,30 H80 Q100,30 100,50 V100 H20 Z" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M80,30 Q100,30 100,50" fill="none" stroke="var(--finito)" stroke-width="4"/>`],
    ko: ['Spigoli interni vivi ovunque', 'Possibili, ma concentrano le tensioni nel pezzo.', (id) => `<path d="M20,30 H100 V100 H20 Z" fill="url(#${id}-tratteggio)" class="contorno"/><circle cx="100" cy="30" r="11" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  profondita: {
    ok: ['Profondità adeguata al diametro', 'La profondità dipende dalla facilità con cui si lavano via i residui: conta il rapporto fra profondità e larghezza.', (id) => `<rect x="20" y="30" width="120" height="70" fill="url(#${id}-tratteggio)" class="contorno"/><rect x="50" y="30" width="60" height="34" fill="#dfe6f7" class="contorno"/>`],
    ko: ['Cavità molto profonda e stretta', 'Possibile, ma serve un lavaggio supplementare e il ciclo si allunga.', (id) => `<rect x="20" y="10" width="120" height="100" fill="url(#${id}-tratteggio)" class="contorno"/><rect x="72" y="10" width="16" height="92" fill="#dfe6f7" class="contorno"/><circle cx="80" cy="96" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  finitura: {
    ok: ['Texture fini su piccole aree', 'La finitura fine richiede velocità bassissime (fino a 2 mm³/min): conviene su superfici piccole.', (id) => `<rect x="20" y="40" width="120" height="50" fill="url(#${id}-tratteggio)" class="contorno"/><rect x="60" y="40" width="40" height="8" fill="#dfe6f7" stroke="var(--finito)" stroke-width="2"/>`],
    ko: ['Texture finissima su grandi superfici', 'Su un\'area grande il tempo di finitura diventa molto lungo.', (id) => `<rect x="20" y="40" width="120" height="50" fill="url(#${id}-tratteggio)" class="contorno"/><rect x="24" y="40" width="112" height="8" fill="#dfe6f7" stroke="var(--ko)" stroke-width="2"/><circle cx="80" cy="44" r="18" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  tuffo: ['Elettroerosione a tuffo', 'Un elettrodo di rame sagomato scende a spirale nel pezzo immerso in olio dielettrico: forma cavità, fori e texture. L\'elettrodo si consuma molto meno del pezzo (0,1%).', (id) => `
    <rect x="50" y="64" width="120" height="50" fill="url(#${id}-tratteggio)" class="contorno"/>
    <rect x="80" y="10" width="60" height="30" fill="${RAME}" class="contorno"/><path d="M90,40 V58 H130 V40 Z" fill="${RAME}" class="contorno"/>
    <path d="M90,64 V82 H130 V64" fill="#dfe6f7" stroke="var(--testo)"/>`],
  filo: ['Elettroerosione a filo', 'Un filo di rame o ottone (50–300 µm), teso fra due bobine e rinnovato di continuo, taglia profili interni ed esterni in acqua deionizzata; le guide mobili permettono pareti inclinate fino a 30°.', (id) => `
    <rect x="40" y="40" width="140" height="50" fill="url(#${id}-tratteggio)" class="contorno"/>
    <line x1="120" y1="10" x2="104" y2="118" stroke="${RAME}" stroke-width="3"/>
    <rect x="108" y="2" width="24" height="10" class="scuro"/><rect x="92" y="114" width="24" height="10" class="scuro"/>`],
  pacco: ['Taglio a filo di pezzi impilati', 'Senza forze sul pezzo, più lamiere sottili si impilano e si tagliano in una sola passata.', () => `
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="40" y="${40 + i * 10}" width="140" height="8" class="m-stampo contorno"/>`).join('')}
    <line x1="110" y1="20" x2="110" y2="110" stroke="${RAME}" stroke-width="3"/>`],
};

module.exports = { viewBox: '0 20 820 360', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
