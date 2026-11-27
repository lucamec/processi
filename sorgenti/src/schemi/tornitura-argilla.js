// Schema animato e mini-diagrammi: Tornitura dell'argilla (Thompson 2007, pp. 168–171).
// Sezione assiale sul tornio. Fasi: 1 centratura, 2 apertura, 3 tiraggio del cilindro, 4 modellatura, 5 rifinitura ed essiccazione.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

const CX = 410;
const sim = (half) => { // half: [[r, y]...] dal fondo all'orlo esterno e ritorno all'interno
  const dx = half.map(([r, y]) => `${CX + r},${y}`), sx = half.slice().reverse().map(([r, y]) => `${CX - r},${y}`);
  return `M${dx.join(' L')} L${sx.join(' L')} Z`;
};
const BLOCCO = sim([[0, 280], [80, 280], [72, 210], [40, 196], [0, 194]]);
const CIAMBELLA = sim([[0, 280], [90, 280], [86, 220], [70, 210], [56, 220], [30, 262], [0, 262]]);
const CILINDRO = sim([[0, 280], [62, 280], [62, 110], [50, 110], [50, 266], [0, 266]]);
const VASO = sim([[0, 280], [56, 280], [84, 220], [80, 160], [52, 120], [60, 104], [50, 104], [42, 120], [70, 160], [74, 220], [46, 266], [0, 266]]);

function schema(id) {
  return `
<!-- tornio -->
<rect x="290" y="280" width="240" height="16" class="m-stampo contorno"/>
<rect x="400" y="296" width="20" height="50" class="scuro"/>
<rect x="340" y="346" width="140" height="20" class="macchina"/>
<line x1="${CX}" y1="80" x2="${CX}" y2="300" class="asse"/>
${C.rotazione({ id, cx: 560, cy: 300, r: 20 })}
${etichetta({ testo: 'Tornio (motore elettrico o a pedale)', tx: 500, ty: 350 })}
<!-- argilla -->
<path d="${BLOCCO}" class="m-fuso contorno"${anim({ op: [1, 0, 0, 0, 0] }, { op: 1 })}/>
<path d="${CIAMBELLA}" class="m-fuso contorno"${anim({ op: [0, 1, 0, 0, 0] }, { op: 0 })}/>
<path d="${CILINDRO}" class="m-fuso contorno"${anim({ op: [0, 0, 1, 0, 0] }, { op: 0 })}/>
<path d="${VASO}" class="m-fuso contorno"${anim({ op: [0, 0, 0, 1, 0] }, { op: 0 })}/>
<path d="${VASO}" class="m-finito sezionato contorno"${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}/>
${etichetta({ testo: 'Argilla (sezione)', tx: 560, ty: 220 })}
<!-- mani del vasaio (schematiche) -->
<g${anim({ op: [1, 1, 1, 1, 0] }, { op: 1 })}>
  <g${anim({ ty: [0, 0, -120, -60, 0] }, { ty: 0 })}>
    <rect x="${CX + 100}" y="230" width="60" height="22" rx="10" class="macchina"/>
    <rect x="${CX - 160}" y="230" width="60" height="22" rx="10" class="macchina"/>
  </g>
</g>
<g${anim({ op: [0, 0, 1, 0, 0] })}>${freccia({ id, x1: 600, y1: 260, x2: 600, y2: 140 })}${etichetta({ testo: 'il vasaio tira l\'argilla verso l\'alto', tx: 606, ty: 200 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${etichetta({ testo: 'essiccato fino a "cuoio", rifilato, poi cotto', tx: 500, ty: 90 })}</g>
`;
}

const pz = (d) => `<path d="${d}" class="m-finito contorno"/>`;
const coppie = {
  simmetria: {
    ok: ['Forma a rivoluzione', 'Al tornio tutti i pezzi sono a simmetria di rotazione; manici, piedi e becchi si aggiungono dopo.', () => pz('M60,100 Q30,80 40,50 Q50,30 70,30 H90 Q110,30 120,50 Q130,80 100,100 Z')],
    ko: ['Forma asimmetrica', 'Le forme asimmetriche richiedono altre tecniche: modellazione a mano, intaglio o pressatura.', () => `${pz('M50,100 Q20,40 70,30 H90 Q140,60 110,100 Z')}<circle cx="120" cy="70" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  spessore: {
    ok: ['Spessore proporzionato alla dimensione', 'Le pareti vanno da 5 mm per i pezzi piccoli fino a 25 mm per quelli grandi.', () => `${pz('M30,100 V30 H42 V88 H118 V30 H130 V100 Z')}${C.etichetta({ testo: '5–25 mm', tx: 80, ty: 20, ancora: 'middle' })}`],
    ko: ['Pezzo grande a parete sottile', 'Pareti troppo sottili per la dimensione non reggono il proprio peso.', () => `${pz('M20,110 V10 H24 V106 H136 V10 H140 V110 Z')}<circle cx="22" cy="30" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  alti: {
    ok: ['Pezzi alti in due tornite', 'Per andare oltre l\'altezza di una tornita si tornisce una seconda parte senza fondo, la si capovolge e la si unisce alla prima.', () => `${pz('M40,110 V64 H120 V110 Z M50,104 H110 V64 H50 Z')}${pz('M44,64 V14 H116 V64 Z M54,64 V20 H106 V64 Z')}<line x1="30" y1="64" x2="130" y2="64" stroke="var(--testo-2)" stroke-dasharray="4 3"/>`],
    ko: ['Pezzo troppo alto in una tornita', 'Oltre un certo punto il cilindro non si può più tirare né sostenere.', () => `${pz('M60,112 V4 H100 V112 Z M66,106 H94 V4 H66 Z')}<circle cx="80" cy="12" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  unacottura: ['Cottura unica', 'Il pezzo smaltato a crudo si cuoce una sola volta, risparmiando energia; i pezzi delicati (tazze con manico) si cuociono prima in biscotto e poi con lo smalto.', () => `
    <rect x="40" y="20" width="140" height="90" rx="8" fill="none" stroke="var(--testo-2)" stroke-width="2" stroke-dasharray="6 4"/>
    <path d="M90,96 Q80,70 92,56 H128 Q140,70 130,96 Z" class="m-finito contorno"/>
    ${etichetta({ testo: 'forno', tx: 110, ty: 124, ancora: 'middle' })}`],
};

module.exports = { viewBox: '0 60 820 320', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 128 } };
