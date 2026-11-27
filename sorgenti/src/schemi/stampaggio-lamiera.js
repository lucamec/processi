// Schema animato e mini-diagrammi: Stampaggio della lamiera (Thompson 2007, pp. 82–87).
// Fasi: 1 carico del grezzo, 2 stampaggio, 3 estrazione, 4 rifilatura e bordatura.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

const GREZZO = 'M210,198 H610';
const VASSOIO = 'M210,198 H262 Q268,198 271,204 L284,236 Q286,240 292,240 H528 Q534,240 536,236 L549,204 Q552,198 558,198 H610';
const RIFILATO = 'M244,198 H262 Q268,198 271,204 L284,236 Q286,240 292,240 H528 Q534,240 536,236 L549,204 Q552,198 558,198 H576';
const lam = (d, col, extra = '') => `<path d="${d}" fill="none" stroke-width="5" stroke-linejoin="round" style="stroke:var(--${col})"${extra}/>`;

function schema(id) {
  return `
<!-- matrice (stampo inferiore) -->
<path d="M200,202 H260 L280,246 H540 L560,202 H620 V300 H200 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
${etichetta({ testo: 'Matrice', tx: 630, ty: 280 })}
<!-- estrattore (premilamiera) -->
<g${anim({ ty: [0, 0, -22, 0] }, { ty: 0 })}>
  <rect x="200" y="202" width="50" height="10" class="scuro"/><rect x="570" y="202" width="50" height="10" class="scuro"/>
</g>
${etichetta({ testo: 'Estrattore', tx: 40, ty: 214, px: 202, py: 208 })}

<!-- lamiera -->
${lam(GREZZO, 'grezzo', anim({ op: [1, 0, 0, 0] }, { op: 1 }))}
<g${anim({ ty: [0, 0, -22, 0] }, { ty: 0 })}>
  ${lam(VASSOIO, 'fuso', anim({ op: [0, 1, 0, 0] }, { op: 0 }))}
  ${lam(VASSOIO, 'finito', anim({ op: [0, 0, 1, 0] }, { op: 0 }))}
</g>
<g${anim({ op: [0, 0, 0, 1] }, { op: 0 })}>
  ${lam(RIFILATO, 'finito')}
  <circle cx="244" cy="194" r="6" fill="none" stroke="var(--finito)" stroke-width="4"/><circle cx="576" cy="194" r="6" fill="none" stroke="var(--finito)" stroke-width="4"/>
  ${etichetta({ testo: 'bordo rifilato e arrotolato', tx: 600, ty: 176 })}
</g>
${etichetta({ testo: 'Grezzo oliato (lamiera)', tx: 40, ty: 180, px: 212, py: 196, extra: anim({ op: [1, 0, 0, 0] }, { op: 1 }) })}

<!-- punzone -->
<g${anim({ ty: [-110, 0, -110, -110] }, { ty: -110 })}>
  <rect x="330" y="30" width="160" height="40" class="macchina"/>
  <path d="M270,70 H550 V194 L534,232 H286 L270,194 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
  <g${anim({ op: [0, 1, 0, 0] })}>${freccia({ id, x1: 410, y1: -20, x2: 410, y2: 28 })}</g>
</g>
${etichetta({ testo: 'Punzone', tx: 560, ty: 60 })}
`;
}

const ln = (d, col = 'finito', w = 5) => `<path d="${d}" fill="none" stroke-width="${w}" stroke-linejoin="round" style="stroke:var(--${col})"/>`;
const coppie = {
  sottosquadri: {
    ok: ['Rientri con ripresa laterale', 'Lo stampaggio lavora lungo un asse verticale: i rientri si fanno dopo, con utensili a carrello laterale.', (id) => `${ln('M10,30 H40 V90 H120 V30 H150')}<rect x="124" y="50" width="26" height="16" class="m-stampo contorno"/>${C.freccia({ id, x1: 150, y1: 75, x2: 126, y2: 75 })}`],
    ko: ['Rientro in un solo colpo verticale', 'Con un solo movimento verticale il punzone non può formare un rientro.', () => `${ln('M10,30 H40 V60 L30,70 V90 H130 V70 L120,60 V30 H150')}<circle cx="30" cy="66" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  riduzione: {
    ok: ['Riduzione del diametro per gradi', 'La prima operazione riduce il diametro del grezzo al massimo del 30%, le successive del 20%: si progetta il numero di stazioni.', () => `${ln('M10,40 H40 V70 H120 V40 H150')}${ln('M30,100 V80 H130 V100', 'grezzo', 3)}${C.etichetta({ testo: '−30% · −20% · …', tx: 80, ty: 24, ancora: 'middle' })}`],
    ko: ['Troppo profondo in un colpo', 'Oltre il limite il materiale si allunga troppo e si strappa.', () => `${ln('M10,20 H55 V100 H105 V20 H150')}<circle cx="80" cy="100" r="11" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  bordo: {
    ok: ['Bordo arrotolato o nervature', 'Un bordo arrotolato o un filo nel perimetro irrigidisce il pezzo: si può usare lamiera più sottile.', () => `${ln('M20,40 H40 L50,80 H110 L120,40 H140')}<circle cx="20" cy="36" r="6" fill="none" stroke="var(--finito)" stroke-width="4"/><circle cx="140" cy="36" r="6" fill="none" stroke="var(--finito)" stroke-width="4"/>`],
    ko: ['Bordo sottile e piatto', 'Senza bordo il piatto sembra fragile e si danneggia facilmente.', () => `${ln('M20,40 H40 L50,80 H110 L120,40 H140', 'finito', 2)}<circle cx="20" cy="40" r="9" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  ripresa: ['Operazioni di ripresa', 'Ulteriore stampaggio, piegatura, rullatura, nervatura o goffratura; con un rullo al posto del punzone e il pezzo in rotazione si forma un bordo continuo.', (id) => `
    <rect x="70" y="20" width="80" height="80" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${ln('M60,14 V106 H160 V14', 'finito', 5)}
    <circle cx="178" cy="60" r="14" class="m-stampo contorno"/>${C.freccia({ id, x1: 205, y1: 60, x2: 194, y2: 60 })}
    ${C.rotazione({ id, cx: 110, cy: 60, r: 16 })}`],
  progressivo: ['Stampo progressivo', 'Nelle grandi serie una serie di stampi lavora la lamiera in nastro continuo: a ogni stazione un\'operazione, poi il pezzo viene tranciato.', () => `
    ${ln('M10,60 H210', 'grezzo', 4)}
    ${[40, 100, 160].map((x, i) => `<rect x="${x - 18}" y="${60 - 6 * (i + 1)}" width="36" height="${6 * (i + 1)}" class="m-finito contorno"/>`).join('')}
    ${etichetta({ testo: 'stazione 1 · 2 · 3', tx: 110, ty: 100, ancora: 'middle' })}`],
  gomma: ['Stampo morbido in gomma', 'Un lato dello stampo è di gomma semirigida, che preme la lamiera sul punzone: costa meno ed è adatto alle piccole serie.', (id) => `
    <rect x="40" y="70" width="140" height="40" class="m-grezzo contorno"/>
    <rect x="80" y="30" width="60" height="44" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${ln('M30,66 H76 V76 H144 V66 H190', 'finito', 4)}
    ${etichetta({ testo: 'cuscino di gomma', tx: 110, ty: 124, ancora: 'middle' })}`],
};

module.exports = { viewBox: '0 -40 820 360', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 130 } };
