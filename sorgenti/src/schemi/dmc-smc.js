// Schema animato e mini-diagrammi: Stampaggio di DMC e SMC (Thompson 2007, pp. 218–221).
// Sezione di uno stampo per compressione con inserto metallico (caso studio).
// Fasi: 1 carico, 2 stampaggio e cura, 3 sformatura con estrattori, 4 sbavatura.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

const PEZZO = 'M314,250 H506 V178 H488 V232 H332 V178 H314 Z';

function schema(id) {
  return `
<!-- stampo inferiore (fisso) -->
<path d="M254,310 H566 V178 H506 V250 H314 V178 H254 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
<rect x="234" y="310" width="352" height="16" class="macchina"/>
${etichetta({ testo: 'Stampo inferiore', tx: 590, ty: 300 })}
<!-- estrattori -->
<g${anim({ ty: [0, 0, -40, 0] }, { ty: 0 })}>
  <rect x="350" y="250" width="12" height="76" class="m-stampo contorno"/><rect x="458" y="250" width="12" height="76" class="m-stampo contorno"/>
</g>
${etichetta({ testo: 'Estrattori', tx: 40, ty: 300, px: 350, py: 300 })}

<!-- carica di DMC -->
<g${anim({ op: [1, 0, 0, 0] }, { op: 1 })}>
  <path d="M352,250 Q350,212 380,208 Q410,198 440,208 Q470,212 468,250 Z" class="m-grezzo contorno"/>
</g>
${etichetta({ testo: 'Carica pesata di DMC (resina + fibra corta)', tx: 40, ty: 160, px: 360, py: 214, extra: anim({ op: [1, 0, 0, 0] }, { op: 1 }) })}

<!-- pezzo, inserto e perno -->
<g${anim({ ty: [0, 0, -40, -40] }, { ty: 0 })}>
  <path d="${PEZZO}" class="m-fuso contorno"${anim({ op: [0, 1, 0, 0] }, { op: 0 })}/>
  <path d="${PEZZO}" class="m-finito sezionato contorno"${anim({ op: [0, 0, 1, 1] }, { op: 0 })}/>
  <g${anim({ op: [0, 1, 1, 0] }, { op: 0 })}><rect x="506" y="175" width="34" height="5" class="m-fuso"/><rect x="280" y="175" width="34" height="5" class="m-fuso"/></g>
  <rect x="398" y="206" width="24" height="38" class="m-stampo contorno"/>
  <rect x="405" y="244" width="10" height="46" class="scuro"${anim({ op: [1, 1, 1, 0] }, { op: 1 })}/>
</g>
${etichetta({ testo: 'Inserto su perno', tx: 600, ty: 230, px: 422, py: 220 })}
<g${anim({ op: [0, 0, 0, 1] })}>${etichetta({ testo: 'bava tolta, perno svitato', tx: 590, ty: 150 })}</g>

<!-- stampo superiore (pistone idraulico) -->
<g${anim({ ty: [-120, 0, -120, -120] }, { ty: -120 })}>
  <rect x="380" y="20" width="60" height="80" class="macchina"/>
  <path d="M254,100 H566 V178 H488 V232 H332 V178 H254 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
  <g${anim({ op: [0, 1, 0, 0] })}>${freccia({ id, x1: 600, y1: 90, x2: 600, y2: 150 })}</g>
</g>
${etichetta({ testo: 'Stampo superiore (pistone)', tx: 590, ty: 40 })}
<g${anim({ op: [0, 1, 0, 0] })}>${etichetta({ testo: 'plastifica a ~115 °C, polimerizza a 150 °C: 2–5 minuti', tx: 40, ty: 350 })}</g>
`;
}

const ln = (d, col = 'finito', w = 6) => `<path d="${d}" fill="none" stroke-width="${w}" stroke-linejoin="round" style="stroke:var(--${col})"/>`;
const coppie = {
  inserti: {
    ok: ['Inserti nella direzione di estrazione', 'Inserti e perni di centraggio sono allineati con la direzione di sformatura: il pezzo esce senza ostacoli.', (id) => `<rect x="30" y="50" width="100" height="40" class="m-finito contorno"/><rect x="72" y="30" width="16" height="40" class="m-stampo contorno"/>${C.freccia({ id, x1: 80, y1: 24, x2: 80, y2: 4 })}`],
    ko: ['Inserto trasversale', 'Un inserto di traverso blocca il pezzo nello stampo.', () => `<rect x="30" y="50" width="100" height="40" class="m-finito contorno"/><rect x="100" y="62" width="50" height="16" class="m-stampo contorno"/><circle cx="130" cy="70" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  spessore: {
    ok: ['Pareti ridotte, parti massicce svuotate', 'Meglio ridurre lo spessore (1–50 mm possibili) e svuotare le parti voluminose, o inserire elementi, per risparmiare materiale.', () => `<path d="M20,90 V40 H140 V90 H120 V60 H40 V90 Z" class="m-finito contorno"/>`],
    ko: ['Sezione troppo spessa', 'Le pareti spesse, per la reazione esotermica, tendono a formare bolle e altri difetti.', () => `<rect x="20" y="40" width="120" height="56" class="m-finito contorno"/><circle cx="60" cy="66" r="5" fill="none" stroke="var(--ko)" stroke-width="2"/><circle cx="96" cy="74" r="7" fill="none" stroke="var(--ko)" stroke-width="2"/><circle cx="80" cy="68" r="24" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  sfiati: {
    ok: ['Sfiati e nervature studiati', 'Durante la cura la resina libera gas: sfiati e nervature ben progettate li fanno uscire.', (id) => `<path d="M20,90 V50 H140 V90" fill="none" stroke="var(--finito)" stroke-width="6"/>${[50, 80, 110].map((x) => `<line x1="${x}" y1="50" x2="${x}" y2="80" stroke="var(--finito)" stroke-width="4"/>`).join('')}${C.freccia({ id, x1: 80, y1: 44, x2: 80, y2: 14 })}`],
    ko: ['Gas intrappolato', 'Senza vie di sfogo il gas resta nella cavità e limita dimensioni e qualità del pezzo.', () => `<path d="M20,90 V50 H140 V90" fill="none" stroke="var(--finito)" stroke-width="6"/><circle cx="80" cy="64" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/><circle cx="80" cy="64" r="3" style="fill:var(--ko)"/>`],
  },
};

const varianti = {
  dmc: ['DMC (dough molding compound)', 'Detto anche BMC: impasto di resina e fibre tagliate corte, compresso in forme massicce; i cambi di spessore non sono un problema.', () => `
    <path d="M60,90 Q56,50 100,46 Q140,42 150,70 Q160,92 120,96 Q70,100 60,90 Z" class="m-grezzo contorno"/>
    ${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="${76 + i * 12}" y1="${60 + (i % 3) * 10}" x2="${86 + i * 12}" y2="${66 + (i % 2) * 12}" stroke="var(--testo)" stroke-width="2"/>`).join('')}`],
  smc: ['SMC (sheet molding compound)', 'Fogli di resina con tessuti di fibra più lunga, compressi in componenti leggeri a spessore uniforme.', () => `
    ${[0, 1, 2].map((i) => `<rect x="${30 + i * 8}" y="${30 + i * 18}" width="150" height="12" class="m-grezzo contorno"/>`).join('')}
    ${ln('M40,110 H200', 'finito', 5)}`],
  pultrusione: ['Pultrusione', 'Processo simile per profili continui: la fibra viene tirata attraverso un bagno di resina termoindurente e una filiera, dove polimerizza.', (id) => `
    ${[0, 1, 2, 3].map((i) => `<line x1="10" y1="${44 + i * 10}" x2="120" y2="${56 + i * 2}" stroke="var(--grezzo)" stroke-width="2"/>`).join('')}
    <rect x="40" y="30" width="50" height="64" style="fill:var(--flusso)" opacity="0.25"/>
    <rect x="120" y="44" width="40" height="36" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${ln('M160,62 H210', 'finito', 14)}`],
};

module.exports = { viewBox: '0 0 820 370', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
