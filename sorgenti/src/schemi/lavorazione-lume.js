// Schema animato e mini-diagrammi: Lavorazione del vetro alla fiamma (lume) (Thompson 2007, pp. 160–167).
// Sequenza del caso studio al banco: 1 riscaldo, 2 soffiatura, 3 foratura, 4 curvatura, 5 ricottura.
'use strict';
const C = require('../componenti');
const { anim, freccia, calore, etichetta } = C;

const TUBO = 'M100,186 H600 V214 H100 Z M100,192 H600 V208 H100 Z';
const BOLLA = 'M100,186 H330 Q350,140 400,140 Q450,140 470,186 H600 V214 H470 Q450,260 400,260 Q350,260 330,214 H100 Z M100,192 H334 Q352,150 400,150 Q448,150 466,192 H600 V208 H466 Q448,250 400,250 Q352,250 334,208 H100 Z';
const FORO = 'M100,186 H330 Q350,140 390,140 V150 Q352,150 334,192 H100 Z M410,140 Q450,140 470,186 H600 V214 H470 Q450,260 400,260 Q350,260 330,214 H100 V208 H334 Q352,250 400,250 Q448,250 466,208 H600 V192 H466 Q448,150 410,150 Z';
const CURVO = 'M100,186 H330 Q350,140 390,140 V150 Q352,150 334,192 H100 Z M410,140 Q450,140 470,186 Q500,186 520,206 L560,290 L534,302 L496,222 Q484,208 466,208 Q448,250 400,250 Q352,250 334,208 H100 V214 H330 Q350,260 400,260 Q450,260 470,214 Q474,214 478,216 L518,300 L494,312 L452,224 Z';
const g = (d, cls, extra = '') => `<path d="${d}" fill-rule="evenodd" class="${cls} contorno"${extra}/>`;

function schema(id) {
  return `
<!-- cannello: fiamma di gas naturale e ossigeno -->
<path d="M384,330 L400,272 L416,330 Z" class="m-fuso" opacity=".8"${anim({ op: [0.9, 0.9, 0.9, 0.9, 0] }, { op: 0.9 })}/>
<rect x="388" y="330" width="24" height="30" class="scuro"/>
${etichetta({ testo: 'Fiamma (fino a 1000 °C localmente)', tx: 430, ty: 350 })}

<!-- vetro: freddo resta com'è, caldo si forma facilmente -->
${g(TUBO, 'm-grezzo', anim({ op: [1, 0, 0, 0, 0] }, { op: 1 }))}
<rect x="350" y="186" width="100" height="28" class="m-fuso" opacity=".85"${anim({ op: [1, 0, 0, 0, 0] }, { op: 0 })}/>
${g(BOLLA, 'm-fuso', anim({ op: [0, 1, 0, 0, 0] }, { op: 0 }))}
${g(FORO, 'm-fuso', anim({ op: [0, 0, 1, 0, 0] }, { op: 0 }))}
${g(CURVO, 'm-fuso', anim({ op: [0, 0, 0, 1, 0] }, { op: 0 }))}
${g(CURVO, 'm-finito', anim({ op: [0, 0, 0, 0, 1] }, { op: 0 }))}
${etichetta({ testo: 'Tubo di vetro borosilicato', tx: 100, ty: 170, extra: anim({ op: [1, 0, 0, 0, 0] }, { op: 1 }) })}

<g${anim({ op: [0, 1, 0, 0, 0] })}>${freccia({ id, x1: 40, y1: 200, x2: 96, y2: 200 })}${etichetta({ testo: 'aria soffiata dal lato freddo', tx: 40, ty: 236 })}</g>
<g${anim({ op: [0, 0, 1, 0, 0] })}><line x1="400" y1="60" x2="400" y2="140" stroke="var(--testo)" stroke-width="5"/>${etichetta({ testo: 'Punta di tungsteno: apre un foro', tx: 420, ty: 80 })}</g>
<g${anim({ op: [0, 0, 0, 1, 0] })}>${etichetta({ testo: 'curvatura a mano', tx: 580, ty: 200 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>
  <rect x="80" y="110" width="520" height="220" rx="10" fill="none" stroke="var(--testo-2)" stroke-width="2" stroke-dasharray="7 5"/>
  ${[200, 400].map((x) => calore({ id, x, y: 360, lungo: 26, dir: -1 })).join('')}
  ${etichetta({ testo: 'Ricottura: circa 570 °C per 20 minuti, poi raffreddamento lento', tx: 90, ty: 100 })}
</g>
${etichetta({ testo: 'lavorare a 800–1200 °C (borosilicato)', tx: 40, ty: 60, extra: anim({ op: [1, 1, 1, 1, 0] }, { op: 1 }) })}
`;
}

const t2 = (d, cls = 'm-finito') => `<path d="${d}" fill-rule="evenodd" class="${cls} contorno"/>`;
const coppie = {
  dilatazione: {
    ok: ['Vetri con lo stesso coefficiente di dilatazione', 'Le parti unite devono dilatarsi e ritirarsi allo stesso modo.', () => `${t2('M10,50 H80 V70 H10 Z')}${t2('M80,50 H150 V70 H80 Z')}${C.etichetta({ testo: 'COE uguale', tx: 80, ty: 96, ancora: 'middle' })}`],
    ko: ['Vetri con coefficienti diversi', 'Le tensioni dovute alla diversa dilatazione fanno incrinare o esplodere il pezzo.', () => `${t2('M10,50 H80 V70 H10 Z')}${t2('M80,50 H150 V70 H80 Z', 'm-grezzo')}<path d="M80,40 L86,56 L76,64 L84,80" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  diametro: {
    ok: ['Al banco tubi fino a 30 mm', 'Oltre i 30 mm il vetraio non riesce a tenere e manipolare il pezzo: per diametri maggiori, fino a 415 mm, si lavora al tornio.', () => `${t2('M10,50 H150 V70 H10 Z M10,54 H150 V66 H10 Z')}${C.etichetta({ testo: '≤ 30 mm', tx: 80, ty: 96, ancora: 'middle' })}`],
    ko: ['Tubo grande lavorato al banco', 'Un tubo grande non si maneggia a mano: serve il tornio.', () => `${t2('M10,20 H150 V100 H10 Z M10,28 H150 V92 H10 Z')}<circle cx="80" cy="60" r="20" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  calore: {
    ok: ['Calore distribuito su un\'area ampia', 'Per una curva a U uniforme si scalda una zona estesa; tutte le parti vanno tenute a temperature simili.', () => `${t2('M20,20 V80 Q20,104 50,104 H110 Q140,104 140,80 V20 H128 V80 Q128,92 110,92 H50 Q32,92 32,80 V20 Z')}<path d="M30,112 H130" stroke="var(--fuso)" stroke-width="5"/>`],
    ko: ['Calore concentrato in un punto', 'Differenze di temperatura nel pezzo lo fanno incrinare; la curva viene irregolare.', () => `${t2('M20,20 V80 L56,104 H110 Q140,104 140,80 V20 H128 V80 Q128,92 110,92 H60 L32,74 V20 Z')}<circle cx="44" cy="92" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  soffiatura: ['Soffiatura', 'Si sigilla il tubo, si scalda una zona e si soffia dal lato freddo: la parte calda si gonfia in una bolla regolare.', () => t2('M10,50 H70 Q80,24 110,24 Q140,24 150,50 H210 V70 H150 Q140,96 110,96 Q80,96 70,70 H10 Z M10,56 H74 Q84,32 110,32 Q136,32 146,56 H210 V64 H146 Q136,88 110,88 Q84,88 74,64 H10 Z', 'm-fuso')],
  foratura: ['Foratura', 'Punte di tungsteno aprono un foro nel vetro caldo, poi allargato con un alesatore di tungsteno.', () => `${t2('M10,50 H210 V70 H10 Z M10,56 H100 V64 H10 Z M120,56 H210 V64 H120 Z', 'm-fuso')}<line x1="110" y1="10" x2="110" y2="52" stroke="var(--testo)" stroke-width="4"/>`],
  curvatura: ['Curvatura', 'Si scalda una zona e si piega a mano; l\'aria soffiata nel tubo fa da mandrino e impedisce che le pareti collassino.', () => t2('M10,40 H120 Q170,40 170,90 V120 H150 V90 Q150,60 120,60 H10 Z', 'm-fuso')],
  mandrino: ['Formatura su mandrino', 'Il vetro, alla temperatura giusta, si avvolge su un mandrino rivestito di grafite: per esempio una spirale. Se è troppo caldo si allunga invece di piegarsi.', () => `<rect x="20" y="54" width="180" height="12" class="scuro"/>${[30, 60, 90, 120, 150, 180].map((x) => `<ellipse cx="${x}" cy="60" rx="8" ry="22" fill="none" stroke="var(--fuso)" stroke-width="5"/>`).join('')}`],
};

module.exports = { viewBox: '0 40 820 340', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
