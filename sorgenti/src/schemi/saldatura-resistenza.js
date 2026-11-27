// Schema animato e mini-diagrammi: Saldatura a resistenza (Thompson 2007, pp. 308–311).
// Schema principale: saldatura a punti, in sezione. Fasi: 1 carico, 2 serraggio, 3 passaggio di corrente,
// 4 mantenimento e rilascio.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const RAME = '#c27a4a';

function schema(id) {
  return `
<!-- lamiere sovrapposte -->
<rect x="160" y="196" width="360" height="18" class="m-stampo contorno"/>
<rect x="300" y="214" width="360" height="18" class="m-stampo contorno"/>
${etichetta({ testo: 'Due lamiere sovrapposte (di solito 0,5–5 mm)', tx: 20, ty: 180, px: 180, py: 200 })}
<!-- nocciolo di saldatura -->
<ellipse cx="410" cy="214" rx="30" ry="12" style="fill:var(--fuso)"${anim({ op: [0, 0, 1, 0], sx: [0, 0, 1, 1] }, { op: 0, sx: 0 }, [410, 214])}/>
<ellipse cx="410" cy="214" rx="30" ry="12" class="m-finito contorno"${anim({ op: [0, 0, 0, 1] }, { op: 0 })}/>
<g${anim({ op: [0, 0, 1, 1] })}>${etichetta({ testo: 'nocciolo di saldatura', tx: 470, ty: 270, px: 430, py: 220 })}</g>
<!-- elettrodo superiore (+) -->
<g${anim({ ty: [-60, 0, 0, -60] }, { ty: -60 })}>
  <rect x="384" y="60" width="52" height="90" fill="${RAME}" class="contorno"/>
  <path d="M384,150 H436 L424,194 H396 Z" fill="${RAME}" class="contorno"/>
</g>
${etichetta({ testo: 'Elettrodo (+) in rame', tx: 460, ty: 80 })}
<!-- elettrodo inferiore (−) -->
<g${anim({ ty: [60, 0, 0, 60] }, { ty: 60 })}>
  <path d="M396,234 H424 L436,278 H384 Z" fill="${RAME}" class="contorno"/>
  <rect x="384" y="278" width="52" height="70" fill="${RAME}" class="contorno"/>
</g>
${etichetta({ testo: 'Elettrodo (−)', tx: 460, ty: 330 })}
<g${anim({ op: [0, 1, 1, 0] })}>${freccia({ id, x1: 360, y1: 90, x2: 360, y2: 140 })}${freccia({ id, x1: 360, y1: 320, x2: 360, y2: 270 })}</g>
<g${anim({ op: [0, 0, 1, 0] })}>${etichetta({ testo: 'la corrente attraversa le lamiere: la resistenza le scalda e le fonde', tx: 20, ty: 360 })}</g>
<g${anim({ op: [0, 1, 0, 0] })}>${etichetta({ testo: 'gli elettrodi serrano le lamiere', tx: 20, ty: 360 })}</g>
<g${anim({ op: [0, 0, 0, 1] })}>${etichetta({ testo: 'sotto pressione il metallo si unisce; gli elettrodi si aprono', tx: 20, ty: 360 })}</g>
`;
}

const coppie = {
  accesso: {
    ok: ['Punto raggiungibile dal bordo', 'Gli elettrodi lavorano su un asse verticale: il punto deve essere accessibile da sopra e da sotto, e raggiungibile dal bordo del foglio.', () => `<rect x="20" y="56" width="120" height="10" class="m-stampo contorno"/><path d="M110,20 V52 M110,70 V100" stroke="${RAME}" stroke-width="10"/><path d="M110,20 H150 V100 H110" fill="none" stroke="var(--testo)" stroke-width="4"/>`],
    ko: ['Punto al centro di un pezzo chiuso', 'Se la pinza non arriva al punto dal bordo, o un lato è chiuso, non si salda (salvo elettrodi sagomati).', () => `<rect x="20" y="40" width="120" height="50" fill="none" stroke="var(--testo)" stroke-width="6"/><circle cx="80" cy="40" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  carico: {
    ok: ['Giunto sollecitato a taglio', 'I giunti a punti hanno alta resistenza al taglio: si progettano perché le lamiere scorrano, non si aprano.', (id) => `<rect x="20" y="50" width="80" height="10" class="m-stampo contorno"/><rect x="60" y="60" width="80" height="10" class="m-stampo contorno"/><ellipse cx="80" cy="60" rx="10" ry="5" style="fill:var(--finito)"/>${C.freccia({ id, x1: 40, y1: 40, x2: 10, y2: 40 })}${C.freccia({ id, x1: 120, y1: 80, x2: 150, y2: 80 })}`],
    ko: ['Giunto sollecitato a pelatura', 'Con noccioli piccoli e localizzati la resistenza alla pelatura è limitata.', (id) => `<path d="M20,40 Q70,40 80,58" fill="none" stroke="var(--stampo)" stroke-width="10"/><rect x="60" y="60" width="80" height="10" class="m-stampo contorno"/>${C.freccia({ id, x1: 30, y1: 30, x2: 30, y2: 6 })}<circle cx="80" cy="60" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  spessore: {
    ok: ['Lamiere sottili, anche di spessori diversi', 'Lo spessore di solito è 0,5–5 mm; si saldano anche lamiere di spessore diverso o più fogli sovrapposti, fino a 10 mm con un solo punto.', () => `<rect x="20" y="40" width="120" height="8" class="m-stampo contorno"/><rect x="20" y="48" width="120" height="14" class="m-stampo contorno"/><rect x="20" y="62" width="120" height="8" class="m-stampo contorno"/>`],
    ko: ['Pacco troppo spesso', 'Oltre circa 10 mm un punto singolo non attraversa più il pacco.', () => `${[0, 1, 2, 3, 4].map((i) => `<rect x="20" y="${20 + i * 18}" width="120" height="18" class="m-stampo contorno"/>`).join('')}<circle cx="80" cy="65" r="22" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  rilievi: ['A rilievi (projection)', 'Rilievi stampati su un pezzo, o un inserto, concentrano la corrente: più saldature in un colpo, con elettrodi larghi che si consumano poco.', () => `
    <rect x="30" y="20" width="160" height="24" fill="${RAME}" class="contorno"/>
    <rect x="40" y="60" width="140" height="10" class="m-stampo contorno"/>${[70, 110, 150].map((x) => `<path d="M${x - 8},60 Q${x},50 ${x + 8},60 Z" class="m-stampo contorno"/>`).join('')}
    <rect x="40" y="70" width="140" height="10" class="m-stampo contorno"/><rect x="30" y="80" width="160" height="24" fill="${RAME}" class="contorno"/>`],
  rulli: ['A rulli (seam)', 'Due elettrodi a rullo saldano in continuo una serie di noccioli sovrapposti: giunti ermetici per serbatoi, latte, radiatori.', () => `
    <circle cx="110" cy="30" r="24" fill="${RAME}" class="contorno"/><circle cx="110" cy="96" r="24" fill="${RAME}" class="contorno"/>
    <rect x="20" y="56" width="180" height="14" class="m-stampo contorno"/>
    ${[40, 56, 72, 88].map((x) => `<ellipse cx="${x}" cy="63" rx="10" ry="5" style="fill:var(--finito)"/>`).join('')}`],
  linea: ['Punti in linea con ruote', 'Ruote con un solo elettrodo sul bordo fanno un punto ogni volta che si allineano: punti in fila ad alta velocità.', () => `
    <circle cx="110" cy="30" r="24" class="m-stampo contorno"/><circle cx="110" cy="96" r="24" class="m-stampo contorno"/>
    <rect x="104" y="50" width="12" height="8" fill="${RAME}"/><rect x="104" y="68" width="12" height="8" fill="${RAME}"/>
    <rect x="20" y="58" width="180" height="10" class="m-stampo contorno"/>
    ${[40, 76, 146, 182].map((x) => `<ellipse cx="${x}" cy="63" rx="8" ry="4" style="fill:var(--finito)"/>`).join('')}`],
};

module.exports = { viewBox: '0 40 820 340', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
