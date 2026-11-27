// Schema animato e mini-diagrammi: Saldatura a piastra calda (Thompson 2007, pp. 320–323).
// Sezione di due metà stampate fra gli utensili superiore e inferiore.
// Fasi: 1 carico, 2 riscaldamento, 3 ritiro della piastra, 4 saldatura, 5 raffreddamento ed estrazione.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

function schema(id) {
  return `
<!-- utensile superiore con la metà superiore -->
<g${anim({ ty: [-60, -12, -60, 0, -100] }, { ty: -60 })}>
  <path d="M240,40 H580 V110 H240 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
  <path d="M260,110 H560 V150 H540 V126 H280 V150 H260 Z" class="m-grezzo contorno"/>
  <path d="M256,150 H284 V156 H256 Z M536,150 H564 V156 H536 Z" style="fill:var(--fuso)"${anim({ op: [0, 1, 1, 0, 0] }, { op: 0 })}/>
</g>
<!-- utensile inferiore con la metà inferiore -->
<g${anim({ ty: [60, 12, 60, 0, 0] }, { ty: 60 })}>
  <path d="M260,170 H280 V194 H540 V170 H560 V210 H260 Z" class="m-grezzo contorno"/>
  <path d="M240,210 H580 V280 H240 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
  <path d="M256,164 H284 V170 H256 Z M536,164 H564 V170 H536 Z" style="fill:var(--fuso)"${anim({ op: [0, 1, 1, 0, 0] }, { op: 0 })}/>
</g>
${etichetta({ testo: 'Metà stampate, tenute dal vuoto negli utensili', tx: 20, ty: 330 })}
<!-- giunto saldato e bava -->
<g${anim({ op: [0, 0, 0, 1, 1] }, { op: 0 })}>
  <path d="M256,154 H284 V166 H256 Z M536,154 H564 V166 H536 Z" style="fill:var(--fuso)"${anim({ op: [0, 0, 0, 1, 0] }, { op: 0 })}/>
  <path d="M256,154 H284 V166 H256 Z M536,154 H564 V166 H536 Z" class="m-finito"${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}/>
  <circle cx="252" cy="160" r="4" style="fill:var(--fuso)"/><circle cx="568" cy="160" r="4" style="fill:var(--fuso)"/>
</g>
<!-- piastra calda -->
<g${anim({ tx: [0, 0, 620, 620, 620] }, { tx: 620 })}>
  <rect x="200" y="152" width="420" height="16" class="m-stampo contorno"/>
  <rect x="200" y="152" width="420" height="16" style="fill:var(--fuso)" fill-opacity="0.35"/>
</g>
${etichetta({ testo: 'Piastra calda (alluminio con PTFE)', tx: 580, ty: 140 })}
<g${anim({ op: [0, 1, 0, 0, 0] })}>${etichetta({ testo: '50–100 °C sopra la fusione: le facce del giunto plastificano', tx: 20, ty: 360 })}</g>
<g${anim({ op: [0, 0, 1, 0, 0] })}>${etichetta({ testo: 'gli utensili si separano e la piastra esce', tx: 20, ty: 360 })}</g>
<g${anim({ op: [0, 0, 0, 1, 0] })}>${freccia({ id, x1: 620, y1: 30, x2: 620, y2: 90 })}${etichetta({ testo: 'spinta assiale: il materiale si mescola e forma una piccola bava', tx: 20, ty: 360 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${etichetta({ testo: 'raffreddato, il pezzo resta nell\'utensile inferiore', tx: 20, ty: 360 })}</g>
`;
}

const coppie = {
  asse: {
    ok: ['Giunto accessibile su un asse', 'La piastra deve raggiungere tutto il giunto lungo un solo asse; il giunto può essere complesso, con saldature interne ed esterne.', () => `<path d="M20,40 H140 V60 H120 V50 H40 V60 H20 Z" class="m-grezzo contorno"/><path d="M20,66 H140 V90 H20 Z" class="m-grezzo contorno"/><path d="M80,20 V36" stroke="var(--fuso)" stroke-width="3"/>`],
    ko: ['Giunti su assi diversi', 'Un giunto su un altro asse richiede una seconda operazione.', () => `<path d="M20,50 H100 V100 H20 Z" class="m-grezzo contorno"/><path d="M100,30 H140 V100 H100 Z" class="m-grezzo contorno"/><circle cx="100" cy="40" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/><circle cx="60" cy="50" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  area: {
    ok: ['Interfaccia allargata', 'La resistenza cresce con la superficie del giunto: una sezione a T o ad angolo retto la aumenta.', () => `<path d="M60,20 H100 V56 H130 V66 H30 V56 H60 Z" class="m-grezzo contorno"/><path d="M30,70 H130 V80 H100 V110 H60 V80 H30 Z" class="m-grezzo contorno"/>`],
    ko: ['Parete sottile di testa', 'Una semplice parete sottile accostata di testa offre poca superficie.', () => `<rect x="70" y="20" width="20" height="45" class="m-grezzo contorno"/><rect x="70" y="68" width="20" height="45" class="m-grezzo contorno"/><circle cx="80" cy="66" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  bava: {
    ok: ['Bava nascosta da una flangia', 'La bava spesso non si rifila: una flangia attorno al giunto la nasconde.', () => `<path d="M20,40 H140 V60 H20 Z" class="m-grezzo contorno"/><path d="M20,64 H140 V84 H20 Z" class="m-grezzo contorno"/><path d="M14,40 H22 V84 H14 Z M138,40 H146 V84 H138 Z" class="m-grezzo contorno"/><circle cx="26" cy="62" r="3" style="fill:var(--fuso)"/>`],
    ko: ['Bava su una superficie in vista', 'Senza flangia la bava resta visibile lungo il giunto.', () => `<path d="M20,40 H140 V60 H20 Z" class="m-grezzo contorno"/><path d="M20,64 H140 V84 H20 Z" class="m-grezzo contorno"/><circle cx="18" cy="62" r="4" style="fill:var(--fuso)"/><circle cx="142" cy="62" r="4" style="fill:var(--fuso)"/><circle cx="142" cy="62" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  profilata: ['Piastra profilata', 'La piastra, di solito piana, si sagoma per giunti tridimensionali; con le stesse attrezzature si saldano termoplastici diversi cambiando solo la temperatura.', () => `
    <path d="M20,40 H80 Q110,70 140,40 H200 V54 H140 Q110,84 80,54 H20 Z" class="m-stampo contorno"/>
    <path d="M20,40 H80 Q110,70 140,40 H200 V54 H140 Q110,84 80,54 H20 Z" style="fill:var(--fuso)" fill-opacity="0.35"/>`],
  senzacontatto: ['Senza contatto', 'Per plastiche molto appiccicose il calore arriva per convezione, senza toccare: meno efficace e poco pratico su giunti complessi. Il PTFE degrada oltre 270 °C, quindi il contatto è adatto a plastiche a bassa fusione come PP e PE.', () => `
    <rect x="30" y="54" width="160" height="16" class="m-stampo contorno"/><rect x="30" y="54" width="160" height="16" style="fill:var(--fuso)" fill-opacity="0.35"/>
    <rect x="50" y="16" width="120" height="24" class="m-grezzo contorno"/><rect x="50" y="84" width="120" height="24" class="m-grezzo contorno"/>
    ${[70, 110, 150].map((x) => `<path d="M${x},50 q4,-4 0,-8" fill="none" stroke="var(--fuso)" stroke-width="2"/>`).join('')}`],
};

module.exports = { viewBox: '0 20 820 360', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
