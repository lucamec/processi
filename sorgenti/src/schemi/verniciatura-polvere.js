// Schema animato e mini-diagrammi: Verniciatura a polvere (Thompson 2007, pp. 356–359).
// Spruzzatura elettrostatica, vista dall'alto: la polvere carica segue il campo e avvolge il pezzo a terra.
// Fasi: 1 preparazione, 2 spruzzatura, 3 cottura, 4 raffreddamento.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const traiett = ['M240,200 Q420,200 520,200', 'M240,190 Q400,120 520,170', 'M240,210 Q400,280 520,230', 'M240,185 Q420,40 590,140 Q620,180 600,200', 'M240,215 Q420,360 590,260 Q620,220 600,200'];

function schema(id) {
  return `
<!-- pezzo a terra -->
<rect x="520" y="140" width="80" height="120" class="m-stampo contorno"/>
<rect x="516" y="136" width="88" height="128" fill="none" stroke-width="6" style="stroke:#d9c8c0"${anim({ op: [0, 1, 0, 0] }, { op: 0 })}/>
<rect x="516" y="136" width="88" height="128" fill="none" stroke-width="6" style="stroke:var(--fuso)"${anim({ op: [0, 0, 1, 0] }, { op: 0 })}/>
<rect x="516" y="136" width="88" height="128" fill="none" stroke-width="6" style="stroke:var(--finito)"${anim({ op: [0, 0, 0, 1] }, { op: 0 })}/>
<line x1="560" y1="260" x2="560" y2="310" stroke="var(--testo)" stroke-width="2"/><path d="M544,310 H576 M550,316 H570 M556,322 H564" stroke="var(--testo)" stroke-width="2"/>
${etichetta({ testo: 'Pezzo a terra', tx: 620, ty: 300 })}
<!-- pistola con carica negativa -->
<path d="M100,180 H220 L240,190 V210 L220,220 H100 Z" class="m-stampo contorno"/>
${etichetta({ testo: 'Pistola: carica la polvere (−)', tx: 60, ty: 160 })}
<!-- linee di traiettoria e particelle -->
<g${anim({ op: [0, 1, 0, 0] }, { op: 0 })}>
  ${traiett.map((d) => `<path d="${d}" fill="none" stroke="var(--fuso)" stroke-width="1.5" stroke-dasharray="2 6"/>`).join('')}
  ${[[300, 200], [400, 200], [320, 172], [420, 152], [320, 228], [420, 248], [470, 92], [470, 308], [590, 150], [590, 250]].map((q) => `<circle cx="${q[0]}" cy="${q[1]}" r="5" style="fill:var(--fuso)"/>`).join('')}
  ${etichetta({ testo: 'la polvere carica è attratta dal pezzo e lo avvolge anche sul retro', tx: 200, ty: 340 })}
</g>
<!-- bagni di preparazione -->
<g${anim({ op: [1, 0, 0, 0] })}>
  ${[0, 1, 2].map((i) => `<rect x="${380 + i * 70}" y="40" width="60" height="50" style="fill:var(--flusso)" fill-opacity="0.25" stroke="var(--testo)"/>`).join('')}
  ${etichetta({ testo: 'bagni di pulizia, sgrassaggio e fosfatazione allo zinco', tx: 200, ty: 340 })}
</g>
<!-- forno -->
<g${anim({ op: [0, 0, 1, 0] })}>
  <rect x="490" y="110" width="140" height="180" fill="none" stroke="var(--fuso)" stroke-width="3" stroke-dasharray="8 5"/>
  ${etichetta({ testo: 'forno a circa 200 °C per 30 minuti: la polvere fonde e reticola', tx: 200, ty: 340 })}
</g>
<g${anim({ op: [0, 0, 0, 1] })}>${etichetta({ testo: 'rivestimento lucido, uniforme e resistente', tx: 200, ty: 340 })}</g>
`;
}

const coppie = {
  faraday: {
    ok: ['Forme aperte', 'Con la spruzzatura elettrostatica ogni parte del pezzo deve essere esposta al flusso di polvere.', () => `<rect x="30" y="40" width="100" height="50" fill="none" stroke="var(--finito)" stroke-width="6"/>`],
    ko: ['Angoli chiusi e griglie fitte', 'Incavi e griglie creano un effetto "gabbia di Faraday": la polvere non entra; meglio il letto fluido.', () => `<path d="M30,90 V40 H130 V90" fill="none" stroke="var(--testo)" stroke-width="4"/>${[50, 70, 90, 110].map((x) => `<line x1="${x}" y1="40" x2="${x}" y2="90" stroke="var(--testo)" stroke-width="3"/>`).join('')}<circle cx="80" cy="70" r="18" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  calore: {
    ok: ['Materiali che reggono la cottura', 'Il pezzo deve sopportare circa 200 °C in forno; altrimenti si usano le vernici liquide.', () => `<rect x="30" y="50" width="100" height="40" class="m-stampo contorno"/><rect x="26" y="46" width="108" height="48" fill="none" stroke="var(--finito)" stroke-width="5"/>`],
    ko: ['Materiali sensibili al calore', 'Molte plastiche e materiali misti non resistono alla temperatura di cottura.', () => `<path d="M30,90 Q50,50 80,70 Q110,90 130,50" fill="none" stroke="var(--grezzo)" stroke-width="12"/><circle cx="80" cy="70" r="22" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  preparazione: {
    ok: ['Superficie preparata', 'La finitura riflette la superficie: pulizia, mordenzatura e, all\'esterno, zincatura prima della polvere.', () => `<rect x="30" y="60" width="100" height="30" class="m-stampo contorno"/><rect x="30" y="56" width="100" height="4" fill="#9aa6b2"/><rect x="30" y="50" width="100" height="6" style="fill:var(--finito)"/>`],
    ko: ['Acciaio non protetto all\'esterno', 'Senza zincatura la ruggine si forma sotto la polvere, che si gonfia e si sfoglia.', () => `<rect x="30" y="60" width="100" height="30" class="m-stampo contorno"/><path d="M30,56 H60 Q70,44 80,56 H130" fill="none" style="stroke:var(--finito)" stroke-width="6"/><ellipse cx="70" cy="58" rx="10" ry="4" fill="#9a5a30"/><circle cx="70" cy="54" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  letto: ['Letto fluido', 'L\'aria soffiata in una vasca rende la polvere fluida come un liquido; il pezzo, spesso preriscaldato, si immerge e si ricopre. Strati spessi, ottimo sulle griglie; limitato dalla vasca, adatto alla produzione di massa.', () => `
    <rect x="40" y="56" width="140" height="56" fill="#d9c8c0" stroke="var(--testo)"/>${[60, 90, 120, 150].map((x) => `<path d="M${x},108 v-30" stroke="var(--flusso)" stroke-width="2" stroke-dasharray="3 3"/>`).join('')}
    <rect x="96" y="20" width="28" height="60" class="m-stampo contorno"/><rect x="92" y="54" width="36" height="30" fill="none" stroke="var(--fuso)" stroke-width="4"/>`],
  termoplastiche: ['Polveri termoplastiche', 'PE, PP, PA, PVC e fluoropolimeri non reticolano: fondono e scorrono sulla superficie, poi solidificano. Si applicano spesso a letto fluido, anche in strati spessi.', () => `
    <rect x="30" y="70" width="160" height="30" class="m-stampo contorno"/>
    <path d="M30,70 q20,-14 40,0 t40,0 t40,0 t40,0" fill="none" style="stroke:var(--finito)" stroke-width="10"/>`],
  finiture: ['Finiture speciali', 'Colori illimitati, anche metallizzati, puntinati, testurizzati e finto legno; additivi per resistenza UV, chimica, termica o antimicrobica.', () => `
    ${[0, 1, 2].map((i) => `<rect x="${24 + i * 64}" y="30" width="56" height="70" fill="${['#8a9aa6', '#3f8f8a', '#9a6a3a'][i]}" class="contorno"/>`).join('')}
    ${[[40, 50], [56, 70], [44, 86], [110, 46], [126, 72]].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="2" fill="#fff"/>`).join('')}
    ${[40, 54, 68, 82].map((y) => `<path d="M156,${y} q12,6 24,0" fill="none" stroke="#6a4a2a"/>`).join('')}`],
};

module.exports = { viewBox: '0 20 820 340', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
