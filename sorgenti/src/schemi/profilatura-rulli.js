// Schema animato e mini-diagrammi: Profilatura a rulli (Thompson 2007, pp. 110–113).
// Vista laterale della linea + sezioni del profilo alle stazioni. Fasi: 1 svolgimento dal coil,
// 2 prime stazioni, 3 stazioni finali, 4 taglio a misura.
'use strict';
const C = require('../componenti');
const { anim, etichetta } = C;

const ST = [260, 360, 460, 560];
const ANG = [15, 40, 65, 90];
function sezione(cx, cy, a, col) {
  const r = (a * Math.PI) / 180, L = 34;
  const x2 = cx + L * Math.cos(Math.PI - r), y2 = cy - L * Math.sin(r);
  return `<path d="M${cx + 34},${cy} H${cx} L${x2.toFixed(1)},${y2.toFixed(1)}" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--${col})"/>`;
}

function schema(id) {
  return `
<!-- coil -->
<circle cx="110" cy="230" r="56" class="m-grezzo contorno"/><circle cx="110" cy="230" r="16" class="macchina"/>
${etichetta({ testo: 'Coil di nastro', tx: 60, ty: 316 })}
<!-- nastro che scorre -->
<line x1="150" y1="200" x2="700" y2="200" stroke="var(--grezzo)" stroke-width="6"/>
<line x1="150" y1="200" x2="700" y2="200" stroke="#ffffff" stroke-width="2" stroke-dasharray="6 14"${anim({ dash: [-200, -400, -600, -600] }, { dash: 0 })}/>
<!-- stazioni: coppie di rulli -->
${ST.map((x, i) => `<g>
  <circle cx="${x}" cy="174" r="22" fill="url(#${id}-tratteggio)" class="contorno"/><circle cx="${x}" cy="226" r="22" fill="url(#${id}-tratteggio)" class="contorno"/>
  ${sezione(x - 10, 110, ANG[i], 'fuso').replace('<path', `<path${anim({ op: i < 2 ? [0.15, 1, 1, 1] : [0.15, 0.15, 1, 1] }, { op: 0.15 })}`)}
  ${etichetta({ testo: `${ANG[i]}°`, tx: x, ty: 140, ancora: 'middle' })}
</g>`).join('')}
${etichetta({ testo: 'Stazioni di rulli progressivi (di solito 8 o più)', tx: 240, ty: 290 })}
${etichetta({ testo: 'sezione del profilo a ogni stazione', tx: 240, ty: 62 })}

<!-- taglio a misura -->
<g${anim({ ty: [0, 0, 0, 22] }, { ty: 0 })}><rect x="640" y="150" width="14" height="40" class="scuro"/></g>
${etichetta({ testo: 'Taglio a misura', tx: 620, ty: 136 })}
<g${anim({ tx: [0, 0, 0, 80], op: [0, 0, 0, 1] }, { op: 0 })}>
  ${sezione(700, 250, 90, 'finito')}
  <line x1="660" y1="200" x2="760" y2="200" stroke="var(--finito)" stroke-width="6"/>
</g>
`;
}

const ln = (d, w = 6, col = 'finito') => `<path d="${d}" fill="none" stroke-width="${w}" stroke-linejoin="round" style="stroke:var(--${col})"/>`;
const coppie = {
  raggio: {
    ok: ['Raggio di piega ≥ spessore', 'Le pieghe hanno un raggio uguale o maggiore dello spessore del materiale.', () => ln('M20,100 H70 Q90,100 90,80 V20', 8)],
    ko: ['Piega a spigolo vivo', 'Un raggio inferiore allo spessore non si ottiene a rulli.', () => `${ln('M20,100 H90 V20', 8)}<circle cx="90" cy="100" r="11" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  bordo: {
    ok: ['Piega ad almeno 3 spessori dal bordo', 'Lontano dal bordo del nastro la piega si forma correttamente.', () => `${ln('M20,40 H110 V100', 6)}${C.etichetta({ testo: '≥ 3 s', tx: 116, ty: 80 })}`],
    ko: ['Piega troppo vicina al bordo', 'Troppo vicino al bordo la piega può non formarsi.', () => `${ln('M20,40 H135 V50', 6)}<circle cx="135" cy="44" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  simmetria: {
    ok: ['Profilo simmetrico', 'I rulli premono in modo uniforme: i profili simmetrici sono più semplici e meno soggetti a incurvarsi.', () => ln('M20,30 V90 H140 V30', 6)],
    ko: ['Profilo molto asimmetrico', 'Un profilo sbilanciato tende a incurvarsi o a imbarcarsi lungo la lunghezza.', () => `${ln('M20,60 V90 H140 V10', 6)}<path d="M150,15 Q160,60 150,105" fill="none" stroke="var(--ko)" stroke-width="2" stroke-dasharray="4 3"/>`],
  },
};

const varianti = {
  complessi: ['Profili complessi', 'Con più stazioni in sequenza si ottengono sottosquadri (angoli ciechi), pieghe strette e orli ripiegati.', () => `
    ${ln('M30,100 V40 H90 V70 H70 V60', 5)}${ln('M120,100 V40 H190 V52 H176', 5)}
    ${etichetta({ testo: 'angolo cieco · orlo', tx: 110, ty: 122, ancora: 'middle' })}`],
  scatolati: ['Profili chiusi saldati', 'Tubi e profili scatolati vengono saldati lungo la giunzione, perché sono formati per mantenere la forma chiusa.', () => `
    <rect x="70" y="30" width="80" height="70" fill="none" stroke="var(--finito)" stroke-width="6"/>
    <line x1="110" y1="22" x2="110" y2="38" stroke="var(--ko)" stroke-width="3"/>
    ${etichetta({ testo: 'saldatura della giunzione', tx: 110, ty: 122, ancora: 'middle' })}`],
};

module.exports = { viewBox: '0 40 820 300', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 130 } };
