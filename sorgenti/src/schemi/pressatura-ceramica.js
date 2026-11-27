// Schema animato e mini-diagrammi: Formatura a pressione della ceramica (Thompson 2007, pp. 176–181).
// Schema principale: calibratura (jiggering) di un piatto. Fasi: 1 carico della "frittella", 2 profilatura,
// 3 rifilatura del bordo, 4 essiccazione sullo stampo, 5 cottura.
'use strict';
const C = require('../componenti');
const { anim, calore, etichetta } = C;

const CX = 410;
const sim = (half) => { const dx = half.map(([r, y]) => `${CX + r},${y}`), sx = half.slice().reverse().map(([r, y]) => `${CX - r},${y}`); return `M${dx.join(' L')} L${sx.join(' L')} Z`; };
const FRITTELLA = sim([[0, 196], [150, 200], [150, 214], [0, 210]]);
const PIATTO = sim([[0, 210], [110, 206], [160, 186], [170, 186], [170, 196], [116, 216], [96, 218], [92, 226], [80, 226], [80, 220], [0, 222]]);
const RIFILATO = sim([[0, 210], [110, 206], [160, 186], [164, 186], [164, 196], [116, 216], [96, 218], [92, 226], [80, 226], [80, 220], [0, 222]]);

function schema(id) {
  return `
<!-- stampo maschio in gesso su supporto rotante -->
<path d="${sim([[0, 222], [80, 220], [96, 218], [116, 216], [170, 196], [186, 196], [186, 300], [0, 300]])}" fill="url(#${id}-tratteggio)" class="contorno" transform="translate(0 0)"/>
<rect x="390" y="300" width="40" height="40" class="scuro"/><rect x="300" y="340" width="220" height="16" class="macchina"/>
${C.rotazione({ id, cx: 600, cy: 320, r: 20 })}
${etichetta({ testo: 'Stampo in gesso rotante', tx: 600, ty: 290 })}
<!-- argilla -->
<path d="${FRITTELLA}" class="m-fuso contorno" transform="translate(0 -28)"${anim({ op: [1, 0, 0, 0, 0] }, { op: 1 })}/>
<path d="${PIATTO}" class="m-fuso contorno" transform="translate(0 -26)"${anim({ op: [0, 1, 0, 0, 0] }, { op: 0 })}/>
<path d="${RIFILATO}" class="m-fuso contorno" transform="translate(0 -26)"${anim({ op: [0, 0, 1, 1, 0] }, { op: 0 })}/>
<path d="${RIFILATO}" class="m-finito sezionato contorno" transform="translate(0 -26)"${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}/>
${etichetta({ testo: '"Frittella" di argilla', tx: 30, ty: 150, px: 270, py: 176, extra: anim({ op: [1, 0, 0, 0, 0] }, { op: 1 }) })}
<!-- braccio di calibratura con sagoma -->
<g${anim({ ty: [-80, 0, 0, -80, -80] }, { ty: -80 })}>
  <path d="M230,80 H590 V140 H580 L570,156 H556 L540,172 H520 L500,178 H500 L486,186 H468 L466,192 H460 V198 H360 V192 H354 L352,186 H334 L320,178 L300,172 H280 L264,156 H250 L240,140 H230 Z" class="m-stampo contorno"/>
  <rect x="380" y="20" width="60" height="60" class="macchina"/>
</g>
${etichetta({ testo: 'Braccio con sagoma profilata', tx: 600, ty: 70 })}
<g${anim({ op: [0, 0, 1, 0, 0] })}><line x1="582" y1="140" x2="582" y2="190" stroke="var(--ko)" stroke-width="3" stroke-dasharray="4 3"/>${etichetta({ testo: 'bordo rifilato in rotazione', tx: 600, ty: 180 })}</g>
<g${anim({ op: [0, 0, 0, 1, 0] })}>${etichetta({ testo: 'il pezzo asciuga sullo stampo fino allo stato "verde"', tx: 30, ty: 110 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${[300, 520].map((x) => calore({ id, x, y: 150, lungo: 26 })).join('')}${etichetta({ testo: 'cottura in biscotto a 1125 °C, poi smalto', tx: 30, ty: 110 })}</g>
`;
}

const pz = (d) => `<path d="${d}" fill-rule="evenodd" class="m-finito contorno"/>`;
const coppie = {
  simmetria: {
    ok: ['Calibratura: solo forme a rivoluzione', 'La calibratura si usa solo per geometrie simmetriche attorno a un asse; per forme ovali, quadrate o irregolari si usa la pressatura a stampo.', () => `<ellipse cx="80" cy="60" rx="60" ry="22" fill="none" stroke="var(--finito)" stroke-width="5"/><line x1="10" y1="60" x2="150" y2="60" class="asse"/>`],
    ko: ['Piatto quadrato in calibratura', 'Una forma non a rivoluzione non si ottiene con una sagoma che gira.', () => `<rect x="30" y="20" width="100" height="80" rx="10" fill="none" stroke="var(--finito)" stroke-width="5"/><circle cx="130" cy="20" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  ritiro: {
    ok: ['Stampo maggiorato del ritiro (circa 8%)', 'Il ritiro è nell\'ordine dell\'8%, secondo il materiale.', () => `<ellipse cx="80" cy="60" rx="66" ry="24" fill="none" stroke="var(--testo-2)" stroke-dasharray="4 3"/><ellipse cx="80" cy="60" rx="60" ry="22" fill="none" stroke="var(--finito)" stroke-width="5"/>${C.etichetta({ testo: '+8%', tx: 130, ty: 30 })}`],
    ko: ['Stampo alle misure finali', 'Dopo la cottura il pezzo risulta più piccolo del previsto.', () => `<ellipse cx="80" cy="60" rx="60" ry="22" fill="none" stroke="var(--ko)" stroke-dasharray="4 3"/><ellipse cx="80" cy="60" rx="54" ry="20" fill="none" stroke="var(--finito)" stroke-width="5"/>`],
  },
  dettagli: {
    ok: ['Dettagli pressati insieme al pezzo', 'Con la pressatura a stampo manici e decori si formano direttamente: meno assemblaggi e tagli.', () => pz('M30,40 H110 V100 H30 Z M110,52 Q140,52 140,70 Q140,88 110,88 V80 Q130,80 130,70 Q130,60 110,60 Z')],
    ko: ['Manico da attaccare a mano', 'Aggiungere manici e becchi a mano richiede più abilità e tempo.', () => `${pz('M30,40 H110 V100 H30 Z')}${pz('M118,52 Q148,52 148,70 Q148,88 118,88 V80 Q138,80 138,70 Q138,60 118,60 Z')}<circle cx="114" cy="70" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  calibratura: ['Calibratura (jiggering)', 'Stampo maschio in gesso: la sagoma forma la faccia esterna, lo stampo quella interna. È lo schema principale.', (id) => `<path d="M40,80 Q110,60 180,80 V110 H40 Z" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M40,80 Q110,60 180,80 L176,70 Q110,52 44,70 Z" class="m-fuso contorno"/><rect x="60" y="20" width="100" height="30" class="m-stampo contorno"/>`],
  jolleying: ['Calibratura in stampo femmina (jolleying)', 'Lo stampo forma la faccia esterna (per esempio di una tazza) e la sagoma quella interna.', (id) => `<path d="M60,20 H80 V90 H140 V20 H160 V110 H60 Z" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M80,20 H90 V80 H130 V20 H140 V90 H80 Z" class="m-fuso contorno"/><rect x="96" y="10" width="28" height="64" class="m-stampo contorno"/>`],
  pressa: ['Pressatura a stampo (ram pressing)', 'Stampi in due parti riscaldati pressano la pasta: il calore la indurisce subito e il pezzo si estrae immediatamente. Stampi 10–20 volte più cari, ma durano circa 10 000 cicli.', (id) => `<path d="M40,10 H180 V50 Q110,30 40,50 Z" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M40,110 H180 V64 Q110,44 40,64 Z" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M40,50 Q110,30 180,50 V64 Q110,44 40,64 Z" class="m-fuso contorno"/>`],
};

module.exports = { viewBox: '0 0 820 370', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
