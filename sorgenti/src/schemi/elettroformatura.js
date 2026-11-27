// Schema animato e mini-diagrammi: Elettroformatura (Thompson 2007, pp. 140–143).
// Fasi: 1 mandrino, 2 strato conduttivo d'argento, 3 deposizione nel bagno, 4 distacco e rifinitura.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

const MANDRINO = 'M460,110 H520 V290 H460 Q440,270 452,250 Q470,230 452,210 Q440,190 452,170 Q470,150 452,130 Q440,120 460,110 Z';
const FACCIA = 'M460,110 Q440,120 452,130 Q470,150 452,170 Q440,190 452,210 Q470,230 452,250 Q440,270 460,290';

function schema(id) {
  return `
<!-- vasca con elettrolita -->
<path d="M200,60 V320 H640 V60" fill="none" stroke="var(--testo)" stroke-width="4"/>
<rect x="203" y="90" width="434" height="228" fill="var(--flusso)" fill-opacity=".12"${anim({ op: [0, 0, 1, 0] }, { op: 0 })}/>
${etichetta({ testo: 'Vasca con soluzione elettrolitica', tx: 200, ty: 346 })}
<!-- anodi in cestello -->
<g${anim({ op: [0, 0, 1, 0] }, { op: 0 })}>
  <rect x="250" y="110" width="50" height="170" fill="none" stroke="var(--testo)" stroke-width="2" stroke-dasharray="5 3"/>
  ${[0, 1, 2, 3, 4, 5].map((i) => `<circle cx="${262 + (i % 2) * 24}" cy="${130 + i * 26}" r="9" fill="#b87333" stroke="var(--testo)"/>`).join('')}
  ${etichetta({ testo: 'Anodi di rame (+)', tx: 220, ty: 100 })}
  ${[150, 200, 250].map((y) => freccia({ id, x1: 310, y1: y, x2: 430, y2: y })).join('')}
  ${etichetta({ testo: 'ioni metallici', tx: 330, ty: 140 })}
</g>
<!-- mandrino in silicone su supporto -->
<path d="${MANDRINO}" class="macchina"/>
<rect x="520" y="100" width="20" height="200" class="scuro"/>
${etichetta({ testo: 'Mandrino (calco in silicone)', tx: 560, ty: 120 })}
<path d="${FACCIA}" fill="none" stroke="#c0c4c8" stroke-width="5"${anim({ op: [0, 1, 1, 0] }, { op: 0 })}/>
${etichetta({ testo: 'polvere d\'argento conduttiva', tx: 560, ty: 160, extra: anim({ op: [0, 1, 0, 0] }) })}
<!-- strato metallico che cresce -->
<path d="${FACCIA}" fill="none" stroke-linejoin="round" style="stroke:var(--fuso)"${anim({ sw: [0, 0, 16, 16], op: [0, 0, 1, 0] }, { sw: 0, op: 0 })}/>
<g${anim({ tx: [0, 0, 0, -120], op: [0, 0, 0, 1] }, { op: 0 })}><path d="${FACCIA}" fill="none" stroke-width="16" stroke-linejoin="round" style="stroke:var(--finito)"/>${etichetta({ testo: 'copia esatta, spessore uniforme', tx: 330, ty: 300 })}</g>
${etichetta({ testo: 'corrente continua (−)', tx: 560, ty: 300, extra: anim({ op: [0, 0, 1, 0] }) })}
`;
}

const ln = (d, w = 8, col = 'finito') => `<path d="${d}" fill="none" stroke-width="${w}" stroke-linejoin="round" style="stroke:var(--${col})"/>`;
const coppie = {
  spessore: {
    ok: ['Progettare per spessore uniforme', 'Lo strato cresce uguale su tutta la superficie: rilievi, nervature e incavi non cambiano tempo né costo.', () => ln('M10,80 Q40,40 70,80 T130,80 H150')],
    ko: ['Pareti di spessore diverso', 'Non si ottengono spessori diversi in punti diversi: la parete è uniforme.', () => `${ln('M10,80 Q40,40 70,80', 4)}${ln('M70,80 Q100,110 130,80 H150', 14)}<circle cx="70" cy="80" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  dimensione: {
    ok: ['Entro la vasca (di solito 2 m²)', 'La dimensione massima dipende dalla vasca: di norma fino a 2 m², in casi rari fino a 16 m².', () => `<rect x="30" y="20" width="100" height="80" fill="none" stroke="var(--testo-2)"/>${ln('M50,70 Q80,40 110,70', 6)}`],
    ko: ['Pezzo più grande della vasca', 'Nei pezzi enormi la tolleranza scende a 500 micron e la formatura dura settimane.', () => `<rect x="40" y="30" width="80" height="60" fill="none" stroke="var(--testo-2)"/>${ln('M10,70 Q80,10 150,70', 6)}<circle cx="80" cy="30" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  rientri: {
    ok: ['Rientri con mandrino flessibile', 'Con mandrini in gomma semiflessibile si ottengono forme intricate e rientri con un solo mandrino.', () => `${ln('M20,30 V80 Q20,100 40,100 H120 Q140,100 140,80 V30 L128,40', 6)}<path d="M28,30 V78 Q28,92 42,92 H118 Q132,92 132,78 V30 Z" class="macchina"/>`],
    ko: ['Rientri con mandrino rigido', 'Un mandrino rigido resta intrappolato nel rientro: va sciolto o resta dentro (incapsulamento).', () => `${ln('M20,30 V80 Q20,100 40,100 H120 Q140,100 140,80 V30 L128,40', 6)}<path d="M28,30 V78 Q28,92 42,92 H118 Q132,92 132,78 V30 Z" class="scuro"/><circle cx="130" cy="38" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  incapsulamento: ['Incapsulamento in metallo', 'Il mandrino (per esempio un intaglio in legno) viene coperto interamente da uno strato metallico uniforme e resta dentro: unisce un materiale economico alle qualità decorative e di resistenza di rame o nichel.', () => `
    <path d="M40,100 Q60,30 110,40 Q170,50 180,100 Z" fill="#b08a5a" stroke="var(--testo)"/>
    <path d="M40,100 Q60,30 110,40 Q170,50 180,100" fill="none" stroke="var(--finito)" stroke-width="7"/>
    ${etichetta({ testo: 'legno rivestito di rame', tx: 110, ty: 122, ancora: 'middle' })}`],
};

module.exports = { viewBox: '0 40 820 320', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 128 } };
