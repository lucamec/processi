// Schema animato e mini-diagrammi: Lavorazione CNC (Thompson 2007, pp. 182–189).
// Caso studio: seduta della sedia Windsor. Fasi: 1 fissaggio sottovuoto, 2 contorno (3 assi), 3 bordo profilato,
// 4 scavo della seduta, 5 fori inclinati (5 assi).
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

const GREZZO = 'M200,220 H620 V270 H200 Z';
const CONTORNATO = 'M230,220 H590 V270 H230 Z';
const BORDATO = 'M240,220 H580 Q590,220 590,232 V270 H230 V232 Q230,220 240,220 Z';
const SCAVATO = 'M240,220 H300 Q410,250 520,220 H580 Q590,220 590,232 V270 H230 V232 Q230,220 240,220 Z';
const legno = (d, extra = '') => `<path d="${d}" class="m-grezzo contorno"${extra}/>`;

function schema(id) {
  return `
<!-- tavola con morsa a vuoto -->
<rect x="170" y="270" width="480" height="24" class="macchina"/>
${[230, 290, 350, 410, 470, 530, 590].map((x) => `<rect x="${x}" y="270" width="8" height="8" class="cavita"/>`).join('')}
<g${anim({ op: [1, 0, 0, 0, 0] })}>${[260, 410, 560].map((x) => freccia({ id, x1: x, y1: 278, x2: x, y2: 312, tipo: 'vuoto' })).join('')}</g>
${etichetta({ testo: 'Morsa a vuoto: scanalature sotto il pezzo', tx: 170, ty: 330 })}
<!-- pezzo: grezzo incollato, contornato, bordato, scavato -->
${legno(GREZZO, anim({ op: [1, 0, 0, 0, 0] }, { op: 1 }))}
${legno(CONTORNATO, anim({ op: [0, 1, 0, 0, 0] }, { op: 0 }))}
${legno(BORDATO, anim({ op: [0, 0, 1, 0, 0] }, { op: 0 }))}
${legno(SCAVATO, anim({ op: [0, 0, 0, 1, 1] }, { op: 0 }))}
${[300, 360, 420, 480, 540].map((x) => `<line x1="${x}" y1="222" x2="${x}" y2="268" stroke="var(--testo-2)" stroke-width="1" opacity=".5"/>`).join('')}
${etichetta({ testo: 'Listelli di faggio incollati (bilanciano le tensioni del legno)', tx: 170, ty: 360 })}
<!-- fori inclinati (fase 5) -->
<g${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}>
  <path d="M276,270 L296,226 L306,230 L286,274 Z" class="cavita contorno"/><path d="M544,270 L524,226 L534,222 L554,266 Z" class="cavita contorno"/>
</g>

<!-- mandrino: si muove su X e Z (3 assi); in fase 5 la testa si inclina (5 assi) -->
<g${anim({ tx: [0, 170, -170, 0, 120], ty: [-60, 0, 0, 0, -10] }, { tx: 0, ty: -60 })}>
  <g${anim({ rot: [0, 0, 0, 0, -24] }, { rot: 0 }, [410, 110])}>
    <rect x="380" y="40" width="60" height="70" class="macchina"/>
    <rect x="396" y="110" width="28" height="40" class="m-stampo contorno"/>
    <rect x="404" y="150" width="12" height="${70}" class="scuro"${anim({ op: [1, 1, 0, 0, 1] }, { op: 1 })}/>
    <path d="M396,190 H424 Q430,214 410,220 Q390,214 396,190 Z" class="scuro"${anim({ op: [0, 0, 1, 1, 0] }, { op: 0 })}/>
  </g>
</g>
${etichetta({ testo: 'Mandrino con utensile', tx: 480, ty: 60 })}
<!-- assi -->
<g transform="translate(80 120)">
  <line x1="0" y1="0" x2="50" y2="0" stroke="var(--testo)" stroke-width="2" marker-end="url(#${id}-punta-scura)"/><text x="56" y="5" class="etichetta" font-size="14">X</text>
  <line x1="0" y1="0" x2="0" y2="-50" stroke="var(--testo)" stroke-width="2" marker-end="url(#${id}-punta-scura)"/><text x="-5" y="-56" font-size="14">Z</text>
  <circle cx="0" cy="0" r="4" fill="var(--testo)"/><text x="8" y="18" font-size="14">Y (verso chi guarda)</text>
</g>
${etichetta({ testo: '5 assi: X, Y, Z + 2 rotazioni della testa', tx: 40, ty: 200, extra: anim({ op: [0, 0, 0, 0, 1] }) })}
`;
}

const pz = (d) => `<path d="${d}" class="m-grezzo contorno"/>`;
const coppie = {
  fori: {
    ok: ['Fori inclinati con la macchina a 5 assi', 'La testa si inclina e fora con l\'angolo giusto per gambe e schienale.', () => `${pz('M10,60 H150 V100 H10 Z')}<path d="M40,100 L60,60 L70,64 L50,104 Z" class="cavita contorno"/><rect x="58" y="10" width="14" height="44" class="scuro" transform="rotate(25 65 32)"/>`],
    ko: ['Fori inclinati con la macchina a 3 assi', 'Una macchina a 3 assi fa solo fori verticali.', () => `${pz('M10,60 H150 V100 H10 Z')}<rect x="60" y="60" width="10" height="40" class="cavita contorno"/><rect x="58" y="10" width="14" height="44" class="scuro"/><circle cx="65" cy="80" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  legno: {
    ok: ['Tavole tagliate e reincollate', 'Le tavole si tagliano in listelli, si girano e si incollano: ogni listello bilancia le forze dei vicini e il pezzo non si imbarca.', () => `${[0, 1, 2, 3, 4, 5].map((i) => `<rect x="${12 + i * 23}" y="40" width="23" height="40" class="m-grezzo contorno"/><path d="M${14 + i * 23},${i % 2 ? 46 : 74} Q${23 + i * 23},60 ${33 + i * 23},${i % 2 ? 46 : 74}" fill="none" stroke="var(--testo-2)"/>`).join('')}`],
    ko: ['Tavola intera', 'Una tavola larga tende a imbarcarsi e a deformarsi.', () => `${pz('M12,48 Q80,30 150,48 V84 Q80,66 12,84 Z')}<path d="M12,40 Q80,20 150,40" fill="none" stroke="var(--ko)" stroke-dasharray="4 3" stroke-width="2"/>`],
  },
  finitura: {
    ok: ['Segni dell\'utensile tolti con la finitura', 'Secondo la velocità la fresa lascia segni visibili, che si riducono o eliminano con carteggiatura, rettifica o lucidatura.', () => pz('M10,50 Q80,90 150,50 V100 H10 Z')],
    ko: ['Superficie lasciata grezza di fresatura', 'Le passate dell\'utensile restano visibili sulla superficie.', () => `${pz('M10,50 Q80,90 150,50 V100 H10 Z')}${[30, 50, 70, 90, 110, 130].map((x) => `<line x1="${x}" y1="${50 + (x < 80 ? (x - 10) * 0.45 : (150 - x) * 0.45)}" x2="${x}" y2="${56 + (x < 80 ? (x - 10) * 0.45 : (150 - x) * 0.45)}" stroke="var(--ko)" stroke-width="2"/>`).join('')}`],
  },
};

const varianti = {
  tornio: ['Tornio CNC', 'Il pezzo gira e l\'utensile a punta singola lo taglia con un arco continuo: 2 assi (profondità e posizione). Così si fanno le gambe e i raggi dello schienale.', (id) => `
    <rect x="10" y="40" width="30" height="44" class="macchina"/><rect x="180" y="52" width="30" height="20" class="macchina"/>
    <path d="M40,50 H70 Q90,40 110,52 H180 V72 H110 Q90,84 70,74 H40 Z" class="m-grezzo contorno"/>
    <path d="M100,96 L112,76 L124,96 Z" class="scuro"/>${C.rotazione({ id, cx: 25, cy: 62, r: 14 })}`],
  tre: ['3 assi', 'X, Y orizzontali e Z verticale; un carosello di utensili cambia la fresa in un istante. Taglia contorni e superfici, ma i fori solo in verticale.', () => `
    <rect x="30" y="80" width="160" height="24" class="m-grezzo contorno"/>
    ${[50, 80, 110, 140, 170].map((x) => `<rect x="${x - 6}" y="20" width="12" height="30" class="scuro"/>`).join('')}
    ${etichetta({ testo: 'carosello utensili', tx: 110, ty: 14, ancora: 'middle' })}`],
};

module.exports = { viewBox: '0 0 820 380', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
