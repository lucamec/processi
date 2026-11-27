// Schema animato e mini-diagrammi: Formatura superplastica (Thompson 2007, pp. 92–95).
// Schema principale: formatura in cavità. Fasi: 1 carico e riscaldamento, 2 pressione dell'aria,
// 3 formatura completa, 4 estrazione e rifilatura.
'use strict';
const C = require('../componenti');
const { anim, freccia, calore, etichetta } = C;

const PIANA = 'M216,168 H604';
const META = 'M216,168 H300 Q330,172 360,210 Q410,250 460,210 Q490,172 520,168 H604';
const FORMATA = 'M216,168 H300 Q310,168 314,178 L340,278 Q344,288 354,288 H466 Q476,288 480,278 L506,178 Q510,168 520,168 H604';
const lam = (d, col, extra = '') => `<path d="${d}" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--${col})"${extra}/>`;

function schema(id) {
  return `
<!-- stampo femmina riscaldato -->
<path d="M216,172 H298 Q308,172 312,182 L338,282 Q342,292 352,292 H468 Q478,292 482,282 L508,182 Q512,172 522,172 H604 V320 H216 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
${etichetta({ testo: 'Stampo (femmina)', tx: 620, ty: 300 })}
<g${anim({ op: [1, 1, 1, 0.3] })}>${[260, 410, 560].map((x) => calore({ id, x, y: 350, lungo: 26, dir: -1 })).join('')}${etichetta({ testo: '450–500 °C', tx: 620, ty: 350 })}</g>

<!-- lamiera di lega superplastica -->
${lam(PIANA, 'grezzo', anim({ op: [0, 0, 0, 0] }, { op: 1 }))}
${lam(PIANA, 'fuso', anim({ op: [1, 0, 0, 0] }, { op: 0 }))}
${lam(META, 'fuso', anim({ op: [0, 1, 0, 0] }, { op: 0 }))}
${lam(FORMATA, 'fuso', anim({ op: [0, 0, 1, 0] }, { op: 0 }))}
<g${anim({ ty: [0, 0, 0, -60], op: [0, 0, 0, 1] }, { op: 0 })}>${lam(FORMATA.replace('M216,168 H300', 'M290,168 H300').replace('H604', 'H530'), 'finito')}</g>
${etichetta({ testo: 'Lamiera di lega superplastica', tx: 30, ty: 150, px: 220, py: 166 })}

<!-- camera di pressione -->
<g${anim({ ty: [0, 0, 0, -90] }, { ty: -90 })}>
  <path d="M216,60 H604 V164 H576 V92 H244 V164 H216 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
  <g${anim({ op: [0, 1, 1, 0] })}>${[330, 410, 490].map((x) => freccia({ id, x1: x, y1: 100, x2: x, y2: 150 })).join('')}</g>
</g>
${etichetta({ testo: 'Camera di pressione', tx: 620, ty: 80 })}
${etichetta({ testo: 'aria 1–30 bar', tx: 620, ty: 110, extra: anim({ op: [0, 1, 1, 0] }) })}
`;
}

const ln = (d, w = 5, col = 'finito') => `<path d="${d}" fill="none" stroke-width="${w}" stroke-linejoin="round" style="stroke:var(--${col})"/>`;
const coppie = {
  lato: {
    ok: ['Lato a vista lontano dallo stampo', 'Come nella termoformatura, la faccia che non tocca lo stampo ha la finitura migliore.', (id) => `<path d="M10,30 H40 L60,90 H100 L120,30 H150 V108 H10 Z" fill="url(#${id}-tratteggio)" class="contorno"/>${ln('M10,28 H40 L60,88 H100 L120,28 H150')}${C.etichetta({ testo: 'lato a vista ↑', tx: 80, ty: 18, ancora: 'middle' })}`],
    ko: ['Lato dello stampo in vista', 'La faccia a contatto con lo stampo ha una finitura meno curata.', (id) => `<path d="M10,30 H40 L60,90 H100 L120,30 H150 V108 H10 Z" fill="url(#${id}-tratteggio)" class="contorno"/>${ln('M10,28 H40 L60,88 H100 L120,28 H150')}<line x1="60" y1="96" x2="100" y2="96" stroke="var(--ko)" stroke-width="2" stroke-dasharray="2 3"/>`],
  },
  profondi: {
    ok: ['Pezzi profondi: formatura a bolla', 'La bolla stira il materiale in modo uniforme prima della formatura: lo spessore resta quasi costante.', () => `${ln('M20,20 H50 V100 H110 V20 H140', 5)}`],
    ko: ['Pezzi profondi in cavità', 'La formatura in cavità è indicata soprattutto per pezzi grandi e poco profondi.', () => `${ln('M20,20 H50 V100 H110 V20 H140', 5)}<path d="M50,92 V100 H110 V92" fill="none" stroke="var(--ko)" stroke-width="2" stroke-dasharray="3 3"/><circle cx="80" cy="100" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  dimensioni: {
    ok: ['Entro i limiti della tecnica', 'In cavità: fino a 3000 × 2000 × 600 mm e 10 mm di spessore.', () => `${ln('M10,40 H40 Q80,90 120,40 H150')}${C.etichetta({ testo: '≤ 3000 × 2000 × 600', tx: 80, ty: 104, ancora: 'middle' })}`],
    ko: ['Oltre i limiti della tecnica', 'Ogni tecnica ha dimensioni massime; si possono superare solo per certe geometrie e leghe.', () => `${ln('M2,40 H20 Q80,110 140,40 H158')}<circle cx="80" cy="80" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  bolla: ['Formatura a bolla', 'La lamiera calda viene gonfiata a bolla, lo stampo sale e la pressione si inverte: adatta a pezzi profondi e complessi con spessore uniforme.', (id) => `
    ${ln('M20,70 H40 C60,10 160,10 180,70 H200', 4, 'fuso')}
    <path d="M70,124 V80 Q70,64 86,64 H134 Q150,64 150,80 V124 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${C.freccia({ id, x1: 110, y1: 126, x2: 110, y2: 100 })}`],
  contropressione: ['Formatura con contropressione', 'Come in cavità, ma l\'aria preme anche sul retro della lamiera: formatura più controllata e meno sollecitata, adatta a leghe "difficili" come la 7475.', (id) => `
    <path d="M20,70 H60 L80,110 H140 L160,70 H200 V124 H20 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${ln('M20,68 H62 Q90,100 110,100 Q130,100 158,68 H200', 4, 'fuso')}
    ${C.freccia({ id, x1: 90, y1: 20, x2: 90, y2: 60 })}${C.freccia({ id, x1: 130, y1: 120, x2: 130, y2: 104 })}`],
  diaframma: ['Formatura con diaframma', 'Un diaframma metallico sostiene la lamiera calda e la aiuta a scorrere: permette di formare anche leghe non superplastiche (2014, 2024, 2219, 6061).', (id) => `
    <path d="M20,70 H60 L80,110 H140 L160,70 H200 V124 H20 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${ln('M20,64 H62 L82,104 H138 L158,64 H200', 3, 'stampo-scuro')}${ln('M20,68 H62 L82,108 H138 L158,68 H200', 4, 'fuso')}
    ${etichetta({ testo: 'diaframma', tx: 30, ty: 50 })}`],
};

module.exports = { viewBox: '0 20 820 360', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 130 } };
