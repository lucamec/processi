// Schema animato e mini-diagrammi: Tornitura in lastra (Thompson 2007, pp. 78–81).
// Sezione assiale (asse orizzontale). Fasi: 1 caricamento del disco, 2 prime passate del rullo,
// 3 passate successive, 4 rifinitura e rifilatura.
'use strict';
const C = require('../componenti');
const { anim, etichetta, freccia } = C;

const MANDRINO = 'M230,95 H330 Q470,95 470,200 Q470,305 330,305 H230 Z';
const lam = (d, col, extra = '') => `<path d="${d}" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--${col})"${extra}/>`;
const DISCO = 'M478,60 V340';
const META = 'M478,200 Q478,128 440,108 L360,40 M478,200 Q478,272 440,292 L360,360';
const FINE = 'M478,200 Q476,90 330,89 H250 M478,200 Q476,310 330,311 H250';
const RIFILATO = 'M478,200 Q476,90 330,89 H270 M478,200 Q476,310 330,311 H270';

function schema(id) {
  return `
<line x1="140" y1="200" x2="620" y2="200" class="asse"/>
<!-- testa del tornio -->
<rect x="150" y="110" width="80" height="180" class="macchina"/>
${etichetta({ testo: 'Testa del tornio', tx: 30, ty: 104 })}
${C.rotazione({ id, cx: 190, cy: 200, r: 22 })}
<!-- mandrino -->
<path d="${MANDRINO}" fill="url(#${id}-tratteggio)" class="contorno"/>
${etichetta({ testo: 'Mandrino (forma interna)', tx: 30, ty: 330, px: 300, py: 300 })}
<!-- contropunta che blocca il disco -->
<rect x="484" y="176" width="26" height="48" class="m-stampo contorno"/><rect x="510" y="192" width="110" height="16" class="macchina"/>
${etichetta({ testo: 'Contropunta', tx: 530, ty: 240 })}

<!-- lamiera -->
${lam(DISCO, 'grezzo', anim({ op: [1, 0, 0, 0] }, { op: 1 }))}
${lam(META, 'fuso', anim({ op: [0, 1, 0, 0] }, { op: 0 }))}
${lam(FINE, 'fuso', anim({ op: [0, 0, 1, 0] }, { op: 0 }))}
${lam(RIFILATO, 'finito', anim({ op: [0, 0, 0, 1] }, { op: 0 }))}
${etichetta({ testo: 'Disco di lamiera', tx: 520, ty: 70, px: 482, py: 76, extra: anim({ op: [1, 0, 0, 0] }, { op: 1 }) })}

<!-- rullo di formatura -->
<g${anim({ tx: [80, 0, -110, 80], ty: [-40, 0, -14, -40] }, { tx: 80, ty: -40 })}>
  <circle cx="440" cy="86" r="18" fill="url(#${id}-tratteggio)" class="contorno"/>
  <line x1="440" y1="86" x2="500" y2="26" stroke="var(--testo)" stroke-width="6"/>
</g>
${etichetta({ testo: 'Rullo di formatura', tx: 560, ty: 30 })}
<g${anim({ op: [0, 1, 1, 0] })}>${freccia({ id, x1: 560, y1: 130, x2: 500, y2: 100 })}${etichetta({ testo: 'il rullo spinge la lamiera sul mandrino', tx: 520, ty: 150 })}</g>
<!-- rifilatura -->
<g${anim({ op: [0, 0, 0, 1] })}>
  <line x1="262" y1="70" x2="262" y2="108" stroke="var(--ko)" stroke-width="3" stroke-dasharray="4 3"/>
  <line x1="262" y1="292" x2="262" y2="330" stroke="var(--ko)" stroke-width="3" stroke-dasharray="4 3"/>
  ${etichetta({ testo: 'bordo rifilato', tx: 30, ty: 64, px: 262, py: 76 })}
</g>
`;
}

const ln = (d, w = 5) => `<path d="${d}" fill="none" stroke-width="${w}" stroke-linecap="round" style="stroke:var(--finito)"/>`;
const coppie = {
  simmetria: {
    ok: ['Forma a rivoluzione', 'Il processo ottiene solo pezzi assialsimmetrici: coni, cilindri, emisferi.', () => `<ellipse cx="80" cy="60" rx="55" ry="40" fill="none" stroke="var(--finito)" stroke-width="5"/><line x1="10" y1="60" x2="150" y2="60" class="asse"/>`],
    ko: ['Forma asimmetrica', 'Le forme non assialsimmetriche non si possono tornire in lastra.', () => `<path d="M30,90 Q30,20 90,25 Q140,30 130,80 Q100,100 30,90 Z" fill="none" stroke="var(--finito)" stroke-width="5"/><circle cx="125" cy="40" r="11" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  profondita: {
    ok: ['Diametro almeno doppio della profondità', 'La forma ideale è l\'emisfero: diametro ≥ 2 volte la profondità.', () => `${ln('M20,30 Q20,95 80,95 Q140,95 140,30')}${C.etichetta({ testo: 'D ≥ 2 h', tx: 80, ty: 22, ancora: 'middle' })}`],
    ko: ['Più profondo che largo', 'Si può fare, ma i costi crescono molto.', () => `${ln('M50,10 V90 Q50,105 80,105 Q110,105 110,90 V10')}${C.etichetta({ testo: 'h > D', tx: 130, ty: 60 })}`],
  },
  rientri: {
    ok: ['Rientro con mandrino scomponibile', 'Pareti parallele e rientri richiedono mandrini in più pezzi che si estraggono uno alla volta.', (id) => `<path d="M30,20 H80 V100 H50 Q30,100 30,80 Z" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M80,20 H130 V80 Q130,100 110,100 H80 Z" fill="url(#${id}-tratteggio)" class="contorno"/>${ln('M24,10 V80 Q24,106 50,106 H110 Q136,106 136,80 V30 L124,20')}`],
    ko: ['Rientro con mandrino unico', 'Con un mandrino in un solo pezzo il rientro trattiene il pezzo: non si sfila.', (id) => `<path d="M30,20 H130 V80 Q130,100 110,100 H50 Q30,100 30,80 Z" fill="url(#${id}-tratteggio)" class="contorno"/>${ln('M24,10 V80 Q24,106 50,106 H110 Q136,106 136,80 V30 L124,20')}<circle cx="126" cy="22" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  aria: ['Tornitura senza mandrino', 'La lamiera si forma "in aria", senza attrezzatura: costi di stampo nulli, manodopera più alta.', (id) => `
    <line x1="10" y1="62" x2="210" y2="62" class="asse"/>
    <rect x="10" y="40" width="40" height="44" class="macchina"/>
    ${ln('M50,62 Q90,20 160,14 M50,62 Q90,104 160,110', 5)}
    <circle cx="150" cy="24" r="10" fill="url(#${id}-tratteggio)" class="contorno"/>`],
  scomponibile: ['Mandrino scomponibile', 'Nel caso studio il mandrino si divide all\'interno del pezzo: si forma a mano un rientro sul collo e poi si estraggono i pezzi uno per uno.', (id) => `
    <line x1="10" y1="62" x2="210" y2="62" class="asse"/>
    <path d="M40,30 H110 V94 H40 Z" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M110,40 H170 V84 H110 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${ln('M34,24 H110 L120,34 H176 V90 H120 L110,100 H34', 4)}`],
};

module.exports = { viewBox: '0 0 820 380', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
