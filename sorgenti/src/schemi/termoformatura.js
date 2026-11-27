// Schema animato e mini-diagrammi: Termoformatura (Thompson 2007, pp. 30–35).
// Schema principale: formatura sottovuoto su stampo maschio.
// Fasi: 1 riscaldamento, 2 bolla, 3 lo stampo sale, 4 vuoto, 5 raffreddamento e rifilatura.
'use strict';
const C = require('../componenti');
const { anim, stampo, freccia, calore, etichetta } = C;

const PIANO = 'M200,150 H620';
const BOLLA = 'M200,150 H240 C300,30 520,30 580,150 H620';
const APPOGGIO = 'M200,150 H240 C268,96 296,72 330,70 H490 C524,72 552,96 580,150 H620';
const FORMATO = 'M200,150 H312 L322,76 Q324,70 332,70 H488 Q496,70 498,76 L508,150 H620';
const linea = (d, cls, extra = '') => `<path d="${d}" fill="none" stroke-width="7" stroke-linejoin="round" style="stroke:var(--${cls})"${extra}/>`;

function schema(id) {
  return `
<!-- Riscaldatore -->
<g${anim({ ty: [0, -120, -120, -120, -120], op: [1, 0, 0, 0, 0] }, { ty: 0, op: 1 })}>
  <rect x="230" y="14" width="360" height="30" class="macchina"/>
  ${[270, 350, 430, 510].map((x) => calore({ id, x, y: 52, lungo: 40 })).join('')}
  ${etichetta({ testo: 'Riscaldatore', tx: 600, ty: 34 })}
</g>

<!-- Stampo maschio con canali dell'aria: sale nel foglio in fase 3 -->
<g${anim({ ty: [110, 110, 0, 0, 110] }, { ty: 110 })}>
  <path d="M312,150 L322,76 Q324,70 332,70 H488 Q496,70 498,76 L508,150 V250 H312 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
  ${[360, 410, 460].map((x) => `<line x1="${x}" y1="74" x2="${x}" y2="240" stroke="#ffffff" stroke-width="3"/>`).join('')}
  <rect x="290" y="250" width="240" height="18" class="macchina"/>
  <g${anim({ op: [0, 0, 0, 1, 0] })}>${[360, 410, 460].map((x) => freccia({ id, x1: x, y1: 150, x2: x, y2: 236, tipo: 'vuoto' })).join('')}</g>
</g>

<!-- Foglio: freddo → caldo → bolla → appoggiato → formato → raffreddato -->
${linea(PIANO, 'grezzo', anim({ op: [0, 0, 0, 0, 0] }, { op: 1 }))}
${linea(PIANO, 'fuso', anim({ op: [1, 0, 0, 0, 0] }, { op: 0 }))}
${linea(BOLLA, 'fuso', anim({ op: [0, 1, 0, 0, 0] }, { op: 0 }))}
${linea(APPOGGIO, 'fuso', anim({ op: [0, 0, 1, 0, 0] }, { op: 0 }))}
${linea(FORMATO, 'fuso', anim({ op: [0, 0, 0, 1, 0] }, { op: 0 }))}
<g${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}>
  ${linea(FORMATO, 'finito')}
  <line x1="300" y1="132" x2="300" y2="168" stroke="var(--ko)" stroke-width="3" stroke-dasharray="4 3"/>
  <line x1="520" y1="132" x2="520" y2="168" stroke="var(--ko)" stroke-width="3" stroke-dasharray="4 3"/>
  ${etichetta({ testo: 'linee di rifilatura', tx: 530, ty: 128 })}
</g>
<g${anim({ op: [0, 1, 0, 0, 0] })}>${[330, 410, 490].map((x) => freccia({ id, x1: x, y1: 200, x2: x, y2: 120 })).join('')}
  ${etichetta({ testo: 'aria: il foglio si gonfia a bolla', tx: 470, ty: 220 })}</g>

<!-- Telaio di bloccaggio -->
${[[196, 236], [584, 624]].map(([a, b]) => stampo({ id, x: a, y: 138, w: b - a, h: 8 }) + stampo({ id, x: a, y: 154, w: b - a, h: 8 })).join('')}
${etichetta({ testo: 'Telaio di bloccaggio', tx: 40, ty: 132, px: 200, py: 142 })}
${etichetta({ testo: 'Foglio termoplastico', tx: 40, ty: 182, px: 205, py: 152 })}
${etichetta({ testo: 'Stampo maschio', tx: 640, ty: 250, px: 512, py: 220 })}
${etichetta({ testo: 'Vuoto ≈ 0,96 bar', tx: 640, ty: 290, extra: anim({ op: [0, 0, 0, 1, 0] }) })}
`;
}

const lin = (d, cls) => `<path d="${d}" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--${cls})"/>`;
const coppie = {
  profondita: {
    ok: ['Profondità non oltre il diametro', 'Coppa poco profonda: il foglio si stira senza assottigliarsi troppo.', () => `${lin('M10,40 H40 C40,95 120,95 120,40 H150', 'finito')}${C.etichetta({ testo: 'h ≤ d', tx: 80, ty: 108, ancora: 'middle' })}`],
    ko: ['Profondità maggiore del diametro', 'Un pozzetto stretto e profondo assottiglia troppo la parete sul fondo.', () => `${lin('M10,20 H60 V104 H100 V20 H150', 'finito')}<circle cx="80" cy="104" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  sformo: {
    ok: ['Sformo di 2° sullo stampo maschio', 'Raffreddandosi il foglio si ritira (fino al 2%) e stringe lo stampo: le pareti inclinate permettono di sfilarlo.', (id) => `<path d="M40,100 L52,30 H108 L120,100 Z" fill="url(#${id}-tratteggio)" class="contorno"/>${lin('M10,100 H36 L48,24 H112 L124,100 H150', 'finito')}${C.etichetta({ testo: '2°', tx: 128, ty: 60 })}`],
    ko: ['Pareti verticali sullo stampo maschio', 'Senza sformo il pezzo, ritirandosi, si blocca sullo stampo.', (id) => `<path d="M46,100 V30 H114 V100 Z" fill="url(#${id}-tratteggio)" class="contorno"/>${lin('M10,100 H42 V24 H118 V100 H150', 'finito')}${C.etichetta({ testo: '0°', tx: 124, ty: 60 })}`],
  },
  spigoli: {
    ok: ['Spigoli raccordati', 'Raggi ampi: il materiale si stira in modo più uniforme.', () => lin('M10,100 H30 Q40,30 70,28 H90 Q120,30 130,100 H150', 'finito')],
    ko: ['Spigoli vivi e angoli triedri', 'Negli spigoli vivi e dove si incontrano tre spigoli il foglio si assottiglia troppo e diventa debole.', () => `${lin('M10,100 H40 V28 H120 V100 H150', 'finito')}<circle cx="40" cy="28" r="9" fill="none" stroke="var(--ko)" stroke-width="2.5"/><circle cx="120" cy="28" r="9" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  punzone: {
    ok: ['Profili profondi con punzone ausiliario', 'Il punzone spinge e stira il foglio prima del vuoto: lo spessore resta sufficiente anche sul fondo.', (id) => `<rect x="62" y="6" width="36" height="58" class="m-stampo contorno"/>${lin('M10,30 H40 L60,90 H100 L120,30 H150', 'finito')}`],
    ko: ['Profilo profondo senza punzone', 'Il foglio si stira solo vicino ai bordi e sul fondo si assottiglia fino a strapparsi.', () => `${lin('M10,30 H40 L60,90 H100 L120,30 H150', 'finito')}<circle cx="80" cy="90" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  lato: {
    ok: ['Lato a contatto con lo stampo nascosto', 'Il lato che tocca lo stampo ha una finitura peggiore: si progetta il pezzo perché resti all\'interno.', (id) => `<path d="M40,100 L52,40 H108 L120,100 Z" fill="url(#${id}-tratteggio)" class="contorno"/>${lin('M10,100 H36 L48,34 H112 L124,100 H150', 'finito')}${C.etichetta({ testo: 'esterno liscio', tx: 80, ty: 26, ancora: 'middle' })}`],
    ko: ['Lato dello stampo in vista', 'Se la faccia a contatto con lo stampo è quella visibile, si vedono i difetti di superficie.', () => `${lin('M10,100 H36 L48,34 H112 L124,100 H150', 'finito')}<line x1="48" y1="44" x2="112" y2="44" stroke="var(--ko)" stroke-width="2" stroke-dasharray="2 3"/>`],
  },
  sottosquadri: {
    ok: ['Sottosquadro con inserto rimovibile', 'Un inserto nello stampo forma il sottosquadro e si toglie a mano con il pezzo; in alternativa si fresa o si salda.', (id) => `<path d="M40,100 L52,30 H108 L120,100 Z" fill="url(#${id}-tratteggio)" class="contorno"/><rect x="108" y="56" width="14" height="14" class="m-stampo contorno"/>${lin('M10,100 H36 L48,24 H112 L118,52 L126,52 L126,74 L118,74 L124,100 H150', 'finito')}`],
    ko: ['Sottosquadro su stampo in un pezzo', 'Uno stampo unico con un rientro trattiene il pezzo: non si estrae.', (id) => `<path d="M40,100 L52,30 H108 V52 H120 V74 L120,100 Z" fill="url(#${id}-tratteggio)" class="contorno"/>${lin('M10,100 H36 L48,24 H112 V48 H126 V78 L124,100 H150', 'finito')}`],
  },
};

const varianti = {
  pressione: ['Formatura a pressione', 'Il foglio caldo è spinto nello stampo da aria compressa (circa 6,9 bar), non solo aspirato.', (id) => `
    <rect x="30" y="10" width="160" height="26" class="macchina"/>
    ${[70, 110, 150].map((x) => freccia({ id, x1: x, y1: 36, x2: x, y2: 66 })).join('')}
    <path d="M20,60 H50 L60,104 H160 L170,60 H200 V116 H20 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${lin('M20,58 H52 L62,100 H158 L168,58 H200', 'fuso')}`],
  punzone: ['Formatura con punzone ausiliario', 'Un punzone spinge il foglio dentro lo stampo femmina e lo stira prima del vuoto, per profili profondi.', (id) => `
    <rect x="90" y="8" width="40" height="66" class="m-stampo contorno"/>
    <path d="M20,40 H60 V116 H160 V40 H200 V120 H20 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${lin('M20,38 H64 L90,74 H130 L156,38 H200', 'fuso')}`],
  doppia: ['Termoformatura a doppia lastra', 'Due fogli vengono formati uno sopra l\'altro e poi pressati insieme: il calore residuo li salda e si ottiene un corpo cavo.', (id) => `
    <path d="M20,8 H200 V36 H170 L160,52 H60 L50,36 H20 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    <path d="M20,116 H200 V88 H170 L160,72 H60 L50,88 H20 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${lin('M20,38 H50 L60,55 H160 L170,38 H200', 'fuso')}${lin('M20,86 H50 L60,69 H160 L170,86 H200', 'fuso')}`],
};

module.exports = { viewBox: '0 0 820 300', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
