// Schema animato e mini-diagrammi: Soffiaggio (Thompson 2007, pp. 22–29).
// Schema principale: estrusione-soffiaggio (EBM). Fasi: 1 estrusione del parison, 2 chiusura e taglio,
// 3 soffiaggio, 4 apertura, 5 rifilatura.
'use strict';
const C = require('../componenti');
const { anim, stampo, pezzo, freccia, etichetta } = C;

const CX = 340;
// semiprofilo della bottiglia: [r, y]
const PROF = [[15, 150], [15, 180], [58, 206], [60, 214], [60, 290], [52, 304], [0, 306]];
function contorno(prof, cx, k = 1) {
  const dx = prof.map(([r, y]) => `${cx + r * k},${y}`);
  const sx = prof.slice().reverse().map(([r, y]) => `${cx - r * k},${y}`);
  return `M${dx.join(' L')} L${sx.join(' L')} Z`;
}
const interno = PROF.map(([r, y], i) => [Math.max(0, r - 5), i === 0 ? 150 : Math.min(y, 300)]);
const BOTTIGLIA = contorno(PROF, CX) + ' ' + contorno(interno, CX);

function schema(id) {
  return `
<!-- Estrusore e testa con mandrino -->
<rect x="30" y="44" width="250" height="40" class="macchina"/>
${etichetta({ testo: 'Estrusore (vite e cilindro)', tx: 30, ty: 34 })}
${stampo({ id, x: 280, y: 30, w: 120, h: 80 })}
<rect x="${CX - 15}" y="70" width="30" height="40" class="cavita"/>
<rect x="${CX - 6}" y="70" width="12" height="40" class="m-stampo contorno"/>
${etichetta({ testo: 'Testa e mandrino', tx: 410, ty: 52 })}

<!-- Parison: tubo estruso che scende -->
<path d="M${CX - 15},110 H${CX + 15} V320 H${CX - 15} Z M${CX - 9},110 H${CX + 9} V320 H${CX - 9} Z" fill-rule="evenodd" class="m-fuso contorno"${anim({ sy: [1, 1, 1, 1, 1], op: [1, 1, 0, 0, 0] }, { sy: 0.05, op: 1 }, [CX, 110])}/>
${etichetta({ testo: 'Parison', tx: 360, ty: 128, extra: anim({ op: [1, 1, 0, 0, 0] }, { op: 1 }) })}

<!-- Bottiglia soffiata -->
<path d="${BOTTIGLIA}" fill-rule="evenodd" class="m-fuso contorno"${anim({ sx: [0.25, 0.25, 1, 1, 1], op: [0, 0, 1, 0, 0] }, { sx: 0.25, op: 0 }, [CX, 230])}/>
<g${anim({ op: [0, 0, 0, 1, 1] }, { op: 0 })}>
  <path d="${BOTTIGLIA}" fill-rule="evenodd" class="m-finito sezionato contorno"/>
</g>
<!-- bave sopra e sotto, tolte in fase 5 -->
<g${anim({ op: [0, 0, 0, 1, 0] }, { op: 0 })}>
  <rect x="${CX - 15}" y="306" width="30" height="16" class="m-finito contorno"/>
  ${etichetta({ testo: 'Bava', tx: CX + 24, ty: 322 })}
</g>
<g${anim({ op: [0, 0, 1, 0, 0] })}>
  ${[[-30, 240], [30, 240], [0, 270]].map(([dx, y]) => freccia({ id, x1: CX + dx * 0.4, y1: y, x2: CX + dx * 1.5, y2: y })).join('')}
</g>

<!-- Stampo in due metà -->
<g${anim({ tx: [-90, 0, 0, -90, -90] })}>
  <path d="M${CX - 110},140 H${CX} V${150} ${PROF.map(([r, y]) => `L${CX - r},${y}`).join(' ')} V330 H${CX - 110} Z" fill="url(#${id}-tratteggio)" class="contorno"/>
</g>
<g${anim({ tx: [90, 0, 0, 90, 90] })}>
  <path d="M${CX + 110},140 H${CX} V${150} ${PROF.map(([r, y]) => `L${CX + r},${y}`).join(' ')} V330 H${CX + 110} Z" fill="url(#${id}-tratteggio)" class="contorno"/>
  ${etichetta({ testo: 'Stampo in due metà', tx: CX + 120, ty: 160 })}
</g>

<!-- Coltello -->
<g${anim({ tx: [0, -110, -110, 0, 0], op: [0, 1, 0, 0, 0] }, { tx: 0, op: 0 })}>
  <path d="M${CX + 70},134 H${CX + 130} V146 H${CX + 70} L${CX + 60},140 Z" class="m-stampo contorno"/>
  ${etichetta({ testo: 'Coltello', tx: CX + 80, ty: 126 })}
</g>

<!-- Ugello di soffiaggio -->
<g${anim({ ty: [-60, -60, 0, -60, -60] }, { ty: -60 })}>
  <rect x="${CX - 6}" y="96" width="12" height="70" class="scuro"/>
  <g${anim({ op: [0, 0, 1, 0, 0] })}>${freccia({ id, x1: CX, y1: 100, x2: CX, y2: 175 })}</g>
</g>
${etichetta({ testo: 'Ugello di soffiaggio (aria)', tx: 470, ty: 120, extra: anim({ op: [0, 0, 1, 0, 0] }) })}

<!-- Rifilatrice -->
<g${anim({ ty: [0, 0, 0, 0, -18], op: [0, 0, 0, 0, 1] }, { ty: 0, op: 0 })}>
  <rect x="${CX - 40}" y="326" width="80" height="12" class="m-stampo contorno"/>
  ${etichetta({ testo: 'Rifilatrice profilata', tx: CX + 50, ty: 352 })}
</g>
`;
}

const bott = (k = 1, h = 1) => {
  const p = [[6, 10], [6, 22], [24, 34], [25, 38], [25, 38 + 50 * h], [21, 44 + 50 * h], [0, 45 + 50 * h]].map(([r, y]) => [r * k, y]);
  return contorno(p, 80);
};

const coppie = {
  capacita: {
    ok: ['Capacità adatta al processo', 'Flacone piccolo prodotto per iniezione-soffiaggio, entro il limite di 1 litro.', () => `${pezzo({ d: bott(0.8, 0.8) })}${etichetta({ testo: 'IBM ≤ 1 l', tx: 80, ty: 106, ancora: 'middle' })}`],
    ko: ['Capacità fuori dal campo del processo', 'Tanica grande richiesta all\'iniezione-soffiaggio, che arriva solo a 1 litro: serve l\'estrusione-soffiaggio.', () => `${pezzo({ d: bott(2.2, 1.1) })}${etichetta({ testo: 'IBM: 10 l?', tx: 80, ty: 106, ancora: 'middle' })}`],
  },
  bava: {
    ok: ['Nessuna bava (IBM e ISBM)', 'Nell\'iniezione-soffiaggio e nell\'iniezione-stiro-soffiaggio il pezzo esce senza bisogno di rifilatura.', () => pezzo({ d: bott(1.4) })],
    ko: ['Bava da rifilare (EBM)', 'Lo stampo pizzica il tubo sul fondo e in alto: resta una bava da togliere con una rifilatrice.', () => `${pezzo({ d: bott(1.4) })}<rect x="74" y="96" width="12" height="10" class="m-finito contorno"/><circle cx="80" cy="100" r="11" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  collo: {
    ok: ['Collo e spessore precisi: IBM', 'Quando contano filettatura del collo e spessore delle pareti si sceglie l\'iniezione-soffiaggio, che stampa il collo a iniezione.', () => `${pezzo({ d: bott(1.4) })}<rect x="72" y="8" width="16" height="16" fill="none" stroke="var(--ok)" stroke-width="2.5"/>`],
    ko: ['Collo di precisione con EBM', 'L\'estrusione-soffiaggio controlla meno collo e spessori.', () => `${pezzo({ d: bott(1.4) })}<rect x="72" y="8" width="16" height="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  ibm: ['Iniezione-soffiaggio (IBM)', 'Tavola rotante: il pre-forma viene stampato a iniezione su un nucleo, ruotato di 120° nello stampo di soffiaggio e poi estratto.', (id) => `
    <circle cx="110" cy="62" r="46" fill="none" stroke="var(--testo-2)" stroke-dasharray="4 3"/>
    ${[[110, 16, 'pre-forma'], [150, 86, 'soffiaggio'], [70, 86, 'estrazione']].map(([x, y, t]) => `<rect x="${x - 10}" y="${y - 10}" width="20" height="20" fill="url(#${id}-tratteggio)" class="contorno"/>${etichetta({ testo: t, tx: x, ty: y + 24, ancora: 'middle' })}`).join('')}
    ${C.rotazione({ id, cx: 110, cy: 62, r: 16 })}`],
  isbm: ['Iniezione-stiro-soffiaggio (ISBM)', 'Il pre-forma viene allungato da un\'asta di stiro mentre l\'aria lo gonfia: le catene del polimero si orientano e il contenitore è più resistente e trasparente.', (id) => `
    <path d="M30,20 h14 v40 a7,7 0 0 1 -14,0 z" class="m-fuso contorno"/>
    ${freccia({ id, x1: 60, y1: 50, x2: 95, y2: 50 })}
    <path d="${contorno([[6, 10], [6, 20], [24, 32], [24, 100], [0, 104]], 150)}" class="m-finito contorno"/>
    <rect x="148" y="4" width="4" height="96" class="scuro"/>
    ${etichetta({ testo: 'asta di stiro', tx: 160, ty: 14 })}`],
};

module.exports = { viewBox: '0 0 820 370', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
