// Schema animato e mini-diagrammi: Rettifica, levigatura e lucidatura (Thompson 2007, pp. 376–383).
// A sinistra la mola sul pezzo; a destra il profilo della superficie ingrandito, che si appiattisce
// passando ad abrasivi sempre più fini. Fasi: 1 rettifica, 2 levigatura, 3 lucidatura opaca, 4 lucidatura a specchio.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const onda = (a) => { let d = 'M440,230'; for (let i = 0; i <= 32; i++) d += ` L${440 + i * 10},${230 - a * Math.sin(i * 1.7) * (0.6 + 0.4 * Math.cos(i * 0.9))}`; return d; };

function schema(id) {
  return `
<!-- pezzo e mola -->
<rect x="60" y="230" width="300" height="50" class="m-stampo contorno"/>
<rect x="40" y="280" width="340" height="14" class="macchina"/>
<g${anim({ tx: [120, -40, 120, -40] }, { tx: -40 })}>
  <circle cx="160" cy="180" r="48" class="contorno"${anim({ op: [1, 1, 1, 1] }, { op: 1 })} fill="#5a6068"/>
  <circle cx="160" cy="180" r="48" fill="#e8e0d0" class="contorno"${anim({ op: [0, 0, 0, 1] }, { op: 0 })}/>
  <circle cx="160" cy="180" r="10" class="scuro"/>
</g>
${C.rotazione({ id, cx: 220, cy: 90, r: 18 })}
${etichetta({ testo: 'Mola o nastro abrasivo ad alta velocità, con lubrificante', tx: 40, ty: 40 })}
<!-- profilo della superficie ingrandito -->
<rect x="430" y="150" width="340" height="140" fill="none" stroke="var(--testo)" stroke-dasharray="4 3"/>
<rect x="440" y="230" width="320" height="50" class="m-stampo"/>
<path d="${onda(30)}" fill="none" stroke="var(--testo)" stroke-width="2.5"${anim({ op: [1, 0, 0, 0] }, { op: 1 })}/>
<path d="${onda(15)}" fill="none" stroke="var(--testo)" stroke-width="2.5"${anim({ op: [0, 1, 0, 0] }, { op: 0 })}/>
<path d="${onda(7)}" fill="none" stroke="var(--testo)" stroke-width="2.5"${anim({ op: [0, 0, 1, 0] }, { op: 0 })}/>
<path d="${onda(1)}" fill="none" stroke-width="3" style="stroke:var(--finito)"${anim({ op: [0, 0, 0, 1] }, { op: 0 })}/>
${etichetta({ testo: 'Profilo della superficie (ingrandito)', tx: 440, ty: 140 })}
<g${anim({ op: [1, 0, 0, 0] })}>${etichetta({ testo: 'grana 80–100: Ra circa 2,5 µm', tx: 440, ty: 320 })}</g>
<g${anim({ op: [0, 1, 0, 0] })}>${etichetta({ testo: 'grana 180–220: Ra circa 1,25 µm', tx: 440, ty: 320 })}</g>
<g${anim({ op: [0, 0, 1, 0] })}>${etichetta({ testo: 'grana 240: Ra circa 0,6 µm', tx: 440, ty: 320 })}</g>
<g${anim({ op: [0, 0, 0, 1] })}>${etichetta({ testo: 'pasta lucidante: Ra circa 0,05 µm, a specchio', tx: 440, ty: 320 })}</g>
`;
}

const coppie = {
  forma: {
    ok: ['Superfici piane, cilindriche o coniche', 'Le operazioni di precisione lavorano con moti alternati o rotanti: sono limitate a superfici piane, cilindriche e coniche.', () => `<rect x="20" y="60" width="120" height="30" class="m-stampo contorno"/><path d="M20,56 H140" stroke="var(--finito)" stroke-width="4"/>`],
    ko: ['Forme libere in precisione', 'Le forme irregolari si lucidano solo a mano o con finiture estetiche, con costi e tempi molto più alti.', () => `<path d="M20,90 Q40,30 80,60 T140,40 V90 Z" class="m-stampo contorno"/><circle cx="80" cy="56" r="18" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  durezza: {
    ok: ['Materiali duri per finiture brillanti', 'L\'acciaio inox, molto duro, si lucida fino a fare da specchio.', () => `<rect x="20" y="50" width="120" height="40" fill="#dfe4ea" class="contorno"/><path d="M30,60 L60,80 M70,58 L100,82" stroke="#ffffff" stroke-width="4"/>`],
    ko: ['Metalli teneri', 'L\'alluminio, più tenero, non raggiunge la stessa lucentezza.', () => `<rect x="20" y="50" width="120" height="40" fill="#b8bec6" class="contorno"/><circle cx="80" cy="70" r="18" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  ordine: {
    ok: ['Lucidare il semilavorato', 'Spesso conviene lucidare lamiere o tubi prima di fabbricare il pezzo, ritoccando poi a mano i giunti.', () => `<rect x="20" y="40" width="120" height="16" fill="#dfe4ea" class="contorno"/><path d="M20,80 H70 V100 M70,80 H140" stroke="#dfe4ea" stroke-width="10"/><circle cx="70" cy="80" r="6" fill="none" stroke="var(--finito)" stroke-width="2"/>`],
    ko: ['Lucidare solo il pezzo finito', 'Lucidare a specchio un assieme complesso richiede molte ore di lavoro manuale.', () => `<path d="M30,100 V40 H80 V70 H130 V100 Z" fill="#dfe4ea" class="contorno"/><circle cx="80" cy="70" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  nastro: ['Levigatura a nastro', 'Nastri abrasivi su macchine fisse o portatili, per legno e metallo; nella versione rotativa il pezzo tubolare gira e riceve una satinatura uniforme.', (id) => `
    <rect x="30" y="20" width="160" height="30" rx="15" fill="none" stroke="#8a7a5a" stroke-width="6"/><circle cx="110" cy="90" r="24" class="m-stampo contorno"/>${C.rotazione({ id, cx: 110, cy: 90, r: 10 })}`],
  honing: ['Levigatura di precisione (honing)', 'Una pietra sagomata, coperta di abrasivo, lavora diametri interni ed esterni di pezzi a rivoluzione, per esempio le canne dei cilindri o le tenute ermetiche fra vetro e tappo.', (id) => `
    <rect x="50" y="30" width="120" height="70" fill="#cfe3ea" class="contorno"/><rect x="70" y="40" width="80" height="50" fill="#eef1f4" stroke="var(--testo)"/>
    <rect x="90" y="10" width="40" height="76" class="m-stampo contorno"/>${C.rotazione({ id, cx: 110, cy: 24, r: 10 })}`],
  lappatura: ['Lappatura', 'Blocchi rigidi o tamponi flessibili impregnati di abrasivo danno finiture finissime e controllabili su metalli duri e vetro, anche a motivi ripetuti.', () => `
    <rect x="20" y="70" width="180" height="30" fill="#dfe4ea" class="contorno"/>
    ${[50, 100, 150].map((x) => `<circle cx="${x}" cy="85" r="12" fill="none" stroke="#9aa6b2" stroke-width="2"/>`).join('')}
    <rect x="80" y="40" width="60" height="26" class="m-stampo contorno"/>`],
  vibro: ['Vibrofinitura a botte', 'I pezzi vibrano in un contenitore pieno di sassolini lisci e duri, come ciottoli sulla spiaggia: sbavatura di grandi quantità.', () => `
    <path d="M40,30 V100 H180 V30" fill="none" stroke="var(--testo)" stroke-width="4"/>
    ${Array.from({ length: 22 }, (_, i) => `<circle cx="${52 + (i % 11) * 12}" cy="${82 - Math.floor(i / 11) * 12}" r="5" fill="#b8bec6"/>`).join('')}
    <rect x="90" y="60" width="40" height="20" class="m-stampo contorno"/>`],
};

module.exports = { viewBox: '0 20 820 330', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
