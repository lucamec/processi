// Schema animato e mini-diagrammi: Prototipazione rapida (Thompson 2007, pp. 232–241).
// Schema principale: stereolitografia (SLA), in sezione. La parte già costruita è sotto il pelo della resina:
// una copia ritagliata (clipPath) mostra solo ciò che è sceso sotto la superficie.
// Fasi: 1 modello CAD sezionato, 2 supporti, 3 costruzione strato per strato, 4 estrazione e rimozione supporti,
// 5 pulizia e post-cura UV.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

const VASO = 'M350,130 C340,80 380,60 390,30 L392,-10 H428 L430,30 C440,60 480,80 470,130 Z';
const SUPP = Array.from({ length: 11 }, (_, i) => `M${360 + i * 10},130 V150`).join(' ');
const piatto = (col) => `<rect x="300" y="150" width="220" height="10" class="scuro"/><path d="${SUPP}" stroke="var(--testo)" stroke-width="2"/><path d="${VASO}" class="m-${col} contorno"/>`;

function schema(id) {
  return `
<clipPath id="${id}-sotto"><rect x="0" y="150" width="820" height="230"/></clipPath>
<!-- vasca -->
<path d="M200,110 V330 H620 V110" fill="none" stroke="var(--testo)" stroke-width="6"/>
${etichetta({ testo: 'Resina epossidica liquida sensibile ai raggi UV', tx: 210, ty: 346 })}

<!-- parte in costruzione (solo sotto il pelo della resina) -->
<g clip-path="url(#${id}-sotto)"><g${anim({ op: [1, 1, 1, 0, 0] }, { op: 1 })}>
  <g${anim({ ty: [0, 20, 160, -40, -40] }, { ty: 0 })}>${piatto('fuso')}</g>
</g></g>
<!-- parte estratta -->
<g${anim({ op: [0, 0, 0, 1, 1], ty: [0, 0, 0, -40, -40] }, { op: 0, ty: 0 })}>
  <rect x="300" y="150" width="220" height="10" class="scuro"${anim({ op: [1, 1, 1, 1, 0] }, { op: 1 })}/>
  <path d="${SUPP}" stroke="var(--testo)" stroke-width="2"${anim({ op: [1, 1, 1, 1, 0] }, { op: 1 })}/>
  <path d="${VASO}" class="m-fuso contorno"${anim({ op: [1, 1, 1, 1, 0] }, { op: 1 })}/>
  <path d="${VASO}" class="m-finito sezionato contorno"${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}/>
</g>
<rect x="206" y="150" width="408" height="176" style="fill:var(--grezzo)" opacity="0.28"/>
<line x1="206" y1="150" x2="614" y2="150" stroke="var(--flusso)" stroke-width="2"/>
<g${anim({ op: [1, 1, 1, 0, 0] })}>${etichetta({ testo: 'Piattaforma mobile', tx: 630, ty: 200, px: 520, py: 170 })}</g>

<!-- specchio e laser UV -->
<rect x="370" y="12" width="80" height="22" class="macchina"/>
${etichetta({ testo: 'Laser UV e specchio guidato da computer', tx: 470, ty: 26 })}
<g${anim({ op: [0, 1, 1, 0, 0], vx: [0, 0, 36, 0, 0] }, { op: 0, vx: 0 })}>
  <line x1="410" y1="34" x2="410" y2="148" stroke="var(--fuso)" stroke-width="3"/>
  <circle cx="410" cy="150" r="5" style="fill:var(--fuso)"/>
</g>
<!-- pala che rompe la tensione superficiale -->
<g${anim({ op: [0, 1, 1, 0, 0], vx: [0, 0, 160, 0, 0] }, { op: 0, vx: 0 })}>
  <rect x="402" y="140" width="16" height="12" class="m-stampo contorno"/>
</g>
<g${anim({ op: [0, 0, 1, 0, 0] })}>${etichetta({ testo: 'la pala livella la resina dopo ogni discesa', tx: 40, ty: 90 })}</g>

<!-- 1: modello CAD sezionato -->
<g${anim({ op: [1, 0, 0, 0, 0] })}>
  <g transform="translate(330,-20) scale(0.5)"><path d="${VASO}" fill="none" stroke="var(--flusso)" stroke-width="3"/>${Array.from({ length: 14 }, (_, i) => `<line x1="330" y1="${-6 + i * 10}" x2="490" y2="${-6 + i * 10}" stroke="var(--flusso)" stroke-width="1.5"/>`).join('')}</g>
  ${etichetta({ testo: 'modello CAD (.stl) diviso in sezioni', tx: 40, ty: 60 })}
</g>
<g${anim({ op: [0, 1, 0, 0, 0] })}>${etichetta({ testo: 'prima si costruisce la struttura di supporto a nido d\'ape', tx: 40, ty: 90 })}</g>
<g${anim({ op: [0, 0, 0, 1, 0] })}>${etichetta({ testo: 'il pezzo sgocciola, si stacca e si tolgono i supporti', tx: 40, ty: 90 })}</g>
<!-- 5: post-cura UV -->
<g${anim({ op: [0, 0, 0, 0, 1] })}>
  <rect x="340" y="44" width="140" height="14" fill="#8a5cf6" opacity="0.6"/>
  ${[360, 410, 460].map((x) => freccia({ id, x1: x, y1: 62, x2: x, y2: 80 })).join('')}
  ${etichetta({ testo: 'lavaggio con alcol isopropilico, poi 1 minuto di luce UV intensa', tx: 40, ty: 90 })}
</g>
`;
}

const ln = (d, col = 'finito', w = 5) => `<path d="${d}" fill="none" stroke-width="${w}" stroke-linejoin="round" style="stroke:var(--${col})"/>`;
const strati = (x, y, w, n, h) => Array.from({ length: n }, (_, i) => `<rect x="${x}" y="${y + i * h}" width="${w}" height="${h}" class="m-finito contorno"/>`).join('');
const coppie = {
  orientamento: {
    ok: ['Tubo costruito in verticale', 'L\'orientamento influisce su precisione e resistenza: un tubo costruito in piedi resta tondo.', () => `${strati(60, 14, 40, 10, 10)}${C.etichetta({ testo: 'tondo', tx: 120, ty: 64 })}`],
    ko: ['Tubo costruito in orizzontale', 'Costruito sdraiato, il tubo viene leggermente ovale.', () => `<ellipse cx="80" cy="64" rx="56" ry="40" fill="none" stroke="var(--finito)" stroke-width="10"/>${[30, 46, 62, 78, 94].map((y) => `<line x1="20" y1="${y}" x2="140" y2="${y}" stroke="var(--testo)" stroke-width="0.8"/>`).join('')}<circle cx="80" cy="24" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  piani: {
    ok: ['Grandi superfici piane inclinate', 'Una grande superficie piana si costruisce inclinata, per non accumulare tensioni.', () => `<g transform="rotate(-30 80 64)">${strati(20, 54, 120, 2, 10)}</g>`],
    ko: ['Grande piano costruito in orizzontale', 'Costruito piatto, accumula troppe tensioni e si imbarca.', () => `${ln('M15,70 Q80,48 145,70', 'finito', 12)}<circle cx="80" cy="58" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  cerniere: {
    ok: ['Cerniera integrale nel piano orizzontale', 'Le cerniere integrali si costruiscono in orizzontale: gli strati corrono lungo la cerniera e reggono le aperture ripetute.', () => `${strati(20, 50, 50, 2, 10)}${strati(90, 50, 50, 2, 10)}${ln('M70,64 Q80,72 90,64', 'finito', 3)}`],
    ko: ['Cerniera costruita in verticale', 'In verticale gli strati sono troppo corti: la cerniera cede presto.', () => `${strati(70, 10, 20, 10, 10)}<line x1="66" y1="60" x2="94" y2="60" stroke="var(--ko)" stroke-width="3"/><circle cx="80" cy="60" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  gradini: {
    ok: ['Finitura prevista', 'Costruendo a strati, sulle superfici molto inclinate restano gradini visibili: si prevede la finitura (sabbiatura, lucidatura, verniciatura).', () => ln('M20,100 Q80,20 140,100', 'finito', 8)],
    ko: ['Superficie inclinata lasciata grezza', 'Senza finitura i gradini degli strati restano visibili.', () => `${ln('M20,100 V90 H30 V80 H40 V70 H50 V58 H62 V46 H80 H98 V58 H110 V70 H120 V80 H130 V90 H140 V100', 'finito', 4)}<circle cx="45" cy="75" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  sla: ['Stereolitografia (SLA)', 'Un laser UV solidifica una resina epossidica liquida strato per strato (0,05–0,1 mm), sopra una struttura di supporto. È la tecnica più diffusa, con la migliore finitura e precisione.', () => `
    <rect x="40" y="40" width="140" height="74" style="fill:var(--grezzo)" opacity="0.35" stroke="var(--testo)"/>
    <path d="M90,40 C86,20 100,12 104,4 H116 C120,12 134,20 130,40 Z" class="m-fuso contorno" transform="translate(0,46)"/>
    <line x1="110" y1="0" x2="110" y2="40" stroke="var(--fuso)" stroke-width="3"/>`],
  sls: ['Sinterizzazione laser selettiva (SLS)', 'Un laser CO₂ fonde polvere di nylon in strati di 0,1 mm, in azoto con meno dell\'1% di ossigeno; la polvere non fusa sostiene i pezzi, che possono essere tanti, uno dentro l\'altro.', () => `
    <rect x="20" y="40" width="50" height="70" class="m-grezzo contorno"/><rect x="80" y="40" width="80" height="70" class="m-grezzo contorno"/><rect x="170" y="40" width="50" height="70" class="m-grezzo contorno"/>
    <rect x="96" y="60" width="20" height="30" class="m-fuso contorno"/><rect x="124" y="50" width="22" height="20" class="m-fuso contorno"/>
    <circle cx="80" cy="34" r="8" class="m-stampo contorno"/>`],
  dmls: ['Sinterizzazione laser diretta di metalli (DMLS)', 'Un laser CO₂ da 250 W sinterizza polveri metalliche su una piastra d\'acciaio; il pezzo è denso al 98%, abbastanza resistente per stampi e prototipi funzionali, e si stacca con l\'elettroerosione a filo.', (id) => `
    <rect x="50" y="92" width="120" height="20" fill="url(#${id}-tratteggio)" class="contorno"/>
    <path d="M70,92 V40 H150 V92 Z" class="m-stampo contorno"/>
    <line x1="110" y1="0" x2="110" y2="40" stroke="var(--fuso)" stroke-width="3"/>`],
};

module.exports = { viewBox: '0 -30 820 380', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
