// Schema animato e mini-diagrammi: Piegatura alla pressa piegatrice (Thompson 2007, pp. 148–151).
// Schema principale: piegatura in aria. Fasi: 1 carico, 2 discesa del punzone, 3 piega completa, 4 ritorno ed estrazione.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

const PIANA = 'M250,206 H570';
const META = 'M271,126 L410,212 L549,126';
const PIEGA = 'M297,93 L410,216 L523,93';
const lam = (d, col, extra = '') => `<path d="${d}" fill="none" stroke-width="7" stroke-linejoin="round" style="stroke:var(--${col})"${extra}/>`;

function schema(id) {
  return `
<!-- matrice a V -->
<path d="M320,214 H372 L410,256 L448,214 H500 V300 H320 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
<rect x="300" y="300" width="220" height="18" class="macchina"/>
${etichetta({ testo: 'Matrice a V', tx: 520, ty: 280 })}
<!-- lamiera -->
${lam(PIANA, 'grezzo', anim({ op: [1, 0, 0, 0] }, { op: 1 }))}
${lam(META, 'fuso', anim({ op: [0, 1, 0, 0] }, { op: 0 }))}
${lam(PIEGA, 'fuso', anim({ op: [0, 0, 1, 0] }, { op: 0 }))}
<g${anim({ ty: [0, 0, 0, -40], op: [0, 0, 0, 1] }, { op: 0 })}>${lam(PIEGA, 'finito')}</g>
${etichetta({ testo: 'Lamiera', tx: 140, ty: 200, px: 250, py: 206, extra: anim({ op: [1, 0, 0, 0] }, { op: 1 }) })}
<!-- punzone -->
<g${anim({ ty: [-90, -6, 0, -90] }, { ty: -90 })}>
  <path d="M380,20 H440 V150 L410,206 L380,150 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
  <rect x="330" y="-10" width="160" height="30" class="macchina"/>
</g>
${etichetta({ testo: 'Punzone (pistone idraulico)', tx: 520, ty: 40 })}
<g${anim({ op: [0, 1, 1, 0] })}>${freccia({ id, x1: 410, y1: -60, x2: 410, y2: -16 })}</g>
${etichetta({ testo: 'il punzone scende solo quanto serve per l\'angolo voluto', tx: 140, ty: 350, extra: anim({ op: [0, 1, 1, 0] }) })}
`;
}

const ln = (d, w = 7, col = 'finito') => `<path d="${d}" fill="none" stroke-width="${w}" stroke-linejoin="round" style="stroke:var(--${col})"/>`;
const coppie = {
  raggio: {
    ok: ['Raggio interno ≥ 1 spessore (3 nei materiali duri)', 'Il raggio interno è circa pari allo spessore per i materiali duttili e a 3 volte per quelli duri.', () => ln('M20,100 H70 Q90,100 90,80 V20', 10)],
    ko: ['Raggio troppo stretto', 'Oltre la duttilità la superficie esterna della piega si strappa.', () => `${ln('M20,100 H90 V20', 10)}<circle cx="94" cy="104" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  rette: {
    ok: ['Pieghe rettilinee', 'La pressa piega solo lungo linee rette, una alla volta.', () => `<path d="M20,30 H140 V100 H20 Z" fill="none" stroke="var(--finito)" stroke-width="3"/><line x1="70" y1="30" x2="70" y2="100" stroke="var(--testo-2)" stroke-dasharray="4 3"/><line x1="110" y1="30" x2="110" y2="100" stroke="var(--testo-2)" stroke-dasharray="4 3"/>`],
    ko: ['Linea di piega curva', 'Una piega curva non si ottiene alla pressa: serve lo stampaggio.', () => `<path d="M20,30 H140 V100 H20 Z" fill="none" stroke="var(--finito)" stroke-width="3"/><path d="M60,30 Q100,65 60,100" fill="none" stroke="var(--ko)" stroke-width="3" stroke-dasharray="4 3"/>`],
  },
  collo: {
    ok: ['Profilo a U con punzone a collo d\'oca', 'Due pieghe a 90° vicine formano un sottosquadro: un punzone a collo d\'oca lo aggira e preme lungo tutta la piega.', (id) => `${ln('M40,30 V100 H120 V30', 7)}<path d="M64,0 H96 V40 Q70,50 84,70 L80,96 L76,70 Q60,50 64,40 Z" fill="url(#${id}-tratteggio)" class="contorno"/>`],
    ko: ['Profilo a U con punzone dritto', 'Un punzone dritto urta l\'ala già piegata.', (id) => `${ln('M40,30 V100 H120 V30', 7)}<path d="M110,0 H140 V60 L125,96 L110,60 Z" fill="url(#${id}-tratteggio)" class="contorno"/><circle cx="120" cy="40" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  fondo: ['Piegatura a fondo (coniatura)', 'Punzone e matrice a V accoppiati spingono la lamiera fino in fondo: più pressione, ma maggiore precisione.', (id) => `
    <path d="M40,60 H90 L110,90 L130,60 H180 V120 H40 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${ln('M60,32 L110,88 L160,32', 6, 'fuso')}<path d="M95,0 H125 V50 L110,84 L95,50 Z" fill="url(#${id}-tratteggio)" class="contorno"/>`],
  acuta: ['Matrici ad angolo acuto', 'Piegano la lamiera fino a 30°.', (id) => `
    <path d="M40,60 H96 L110,110 L124,60 H180 V120 H40 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${ln('M90,14 L110,104 L130,14', 6, 'fuso')}${etichetta({ testo: '30°', tx: 140, ty: 50 })}`],
  segmentata: ['Matrici segmentate', 'Piegano solo per tratti di lunghezza definita: più pieghe insieme.', () => `
    ${[30, 90, 150].map((x) => `<rect x="${x}" y="70" width="44" height="40" class="m-stampo contorno"/>`).join('')}
    ${ln('M20,60 H200', 5, 'finito')}`],
};

module.exports = { viewBox: '0 -70 820 440', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 128 } };
