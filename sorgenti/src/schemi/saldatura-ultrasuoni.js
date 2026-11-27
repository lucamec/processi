// Schema animato e mini-diagrammi: Saldatura a ultrasuoni (Thompson 2007, pp. 302–307).
// Sezione di un giunto con direttore di energia fra sonotrodo e incudine.
// Fasi: 1 posizionamento, 2 contatto del sonotrodo, 3 vibrazione, 4 mantenimento.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

function schema(id) {
  return `
<!-- incudine con il pezzo inferiore -->
<path d="M220,250 H600 V320 H220 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
<rect x="260" y="226" width="300" height="24" class="m-grezzo contorno"/>
${etichetta({ testo: 'Incudine e pezzo inferiore', tx: 610, ty: 300 })}
<!-- pezzo superiore con il direttore di energia (triangolo) -->
<g${anim({ ty: [0, 0, 8, 8] }, { ty: -30 })}>
  <rect x="260" y="190" width="300" height="24" class="m-grezzo contorno"/>
  <path d="M396,214 L410,226 L424,214 Z" class="m-grezzo contorno"${anim({ sy: [1, 1, 0.1, 0.1] }, { sy: 1 }, [410, 214])}/>
</g>
${etichetta({ testo: 'Direttore di energia: nervatura triangolare stampata', tx: 20, ty: 180, px: 400, py: 220 })}
<!-- zona fusa e piccola bava -->
<rect x="380" y="220" width="60" height="8" style="fill:var(--fuso)"${anim({ op: [0, 0, 1, 0] }, { op: 0 })}/>
<rect x="380" y="220" width="60" height="8" style="fill:var(--finito)"${anim({ op: [0, 0, 0, 1] }, { op: 0 })}/>
<!-- convertitore, booster, sonotrodo -->
<g${anim({ ty: [-60, 0, 8, 8], vy: [0, 0, 3, 0] }, { ty: -90, vy: 0 })}>
  <rect x="370" y="20" width="80" height="50" class="macchina"/>
  <rect x="380" y="70" width="60" height="30" fill="#5b8fd1" class="contorno"/>
  <path d="M376,100 H444 L434,186 H386 Z" class="m-stampo contorno"/>
</g>
${etichetta({ testo: 'Convertitore piezoelettrico, booster e sonotrodo', tx: 470, ty: 46 })}
<g${anim({ op: [0, 1, 1, 1] })}>${freccia({ id, x1: 470, y1: 120, x2: 470, y2: 170 })}</g>
<g${anim({ op: [0, 0, 1, 0] })}>${etichetta({ testo: 'vibrazioni a 15–40 kHz: l\'attrito fonde il direttore in meno di 1 s', tx: 20, ty: 350 })}</g>
<g${anim({ op: [0, 0, 0, 1] })}>${etichetta({ testo: 'le vibrazioni si fermano, la pressione resta: giunto omogeneo', tx: 20, ty: 350 })}</g>
<g${anim({ op: [1, 0, 0, 0] })}>${etichetta({ testo: 'il pezzo superiore si centra da solo su quello inferiore', tx: 20, ty: 350 })}</g>
`;
}

const coppie = {
  direttore: {
    ok: ['Direttore di energia o giunto a taglio', 'Il contatto ridotto concentra l\'energia: direttore triangolare per i materiali amorfi, giunto a taglio per i semicristallini. Meno energia, meno bava, ciclo più breve.', () => `<rect x="20" y="40" width="120" height="20" class="m-grezzo contorno"/><path d="M70,60 L80,72 L90,60 Z" class="m-grezzo contorno"/><rect x="20" y="72" width="120" height="20" class="m-grezzo contorno"/>`],
    ko: ['Superfici piatte a contatto', 'Due facce piane accostate disperdono l\'energia: giunto più debole e saldatura più lenta (va bene solo per sovrapposizioni semplici, come i tubetti).', () => `<rect x="20" y="40" width="120" height="20" class="m-grezzo contorno"/><rect x="20" y="60" width="120" height="20" class="m-grezzo contorno"/><circle cx="80" cy="60" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  distanza: {
    ok: ['Giunto vicino al sonotrodo', 'I materiali semicristallini e i pezzi poco rigidi smorzano le vibrazioni: il giunto deve stare entro 5 mm dal punto di contatto.', () => `<rect x="60" y="10" width="40" height="30" class="m-stampo contorno"/><rect x="20" y="40" width="120" height="16" class="m-grezzo contorno"/><rect x="20" y="56" width="120" height="16" class="m-grezzo contorno"/>${C.etichetta({ testo: '≤ 5 mm', tx: 104, ty: 34 })}`],
    ko: ['Giunto lontano in un pezzo cedevole', 'In un materiale che smorza, l\'energia non arriva a un giunto lontano dal sonotrodo.', () => `<rect x="60" y="10" width="40" height="20" class="m-stampo contorno"/><path d="M20,30 H140 V100 H20 Z" class="m-grezzo contorno"/><line x1="20" y1="94" x2="140" y2="94" stroke="var(--testo)"/><circle cx="80" cy="94" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  bava: {
    ok: ['Bava nascosta o raccolta', 'Si forma un po\' di bava: si riduce nascondendo il giunto o prevedendo vani che la raccolgano.', () => `<path d="M20,40 H140 V60 H90 V76 H70 V60 H20 Z" class="m-grezzo contorno"/><path d="M60,76 H100 V96 H60 Z" class="m-grezzo contorno"/><rect x="66" y="70" width="6" height="6" style="fill:var(--finito)"/>`],
    ko: ['Bava sul lato in vista', 'Senza accorgimenti la bava esce sulla superficie visibile.', () => `<rect x="20" y="40" width="120" height="20" class="m-grezzo contorno"/><rect x="20" y="64" width="120" height="20" class="m-grezzo contorno"/><path d="M60,60 h40 v4 h-40 Z M60,60 l-6,2 l6,2 Z" style="fill:var(--ko)"/><circle cx="56" cy="62" r="11" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  taglio: ['Giunto a taglio', 'Un gradino riduce il contatto a una linea sottile; premendo, lo spallamento scende lungo tutto il giunto. È il giunto migliore per i semicristallini.', () => `
    <path d="M40,30 H180 V54 H150 V80 H70 V54 H40 Z" class="m-grezzo contorno"/>
    <path d="M60,60 H160 V100 H60 Z" class="m-grezzo contorno"/>
    <rect x="66" y="56" width="6" height="24" style="fill:var(--fuso)"/><rect x="148" y="56" width="6" height="24" style="fill:var(--fuso)"/>`],
  inserto: ['Inserimento', 'Il sonotrodo spinge un inserto metallico in un foro della plastica, che fonde attorno e lo blocca.', () => `
    <rect x="40" y="50" width="140" height="60" class="m-grezzo contorno"/>
    <rect x="96" y="30" width="28" height="56" class="m-stampo contorno"/><rect x="92" y="60" width="36" height="26" style="fill:var(--fuso)" opacity="0.5"/>`],
  punti: ['Saldatura a punti', 'Una punta vibrante attraversa il foglio superiore e salda localmente i due strati, senza fori preparati.', () => `
    <rect x="30" y="56" width="160" height="16" class="m-grezzo contorno"/><rect x="30" y="72" width="160" height="16" class="m-grezzo contorno"/>
    <path d="M100,10 H120 V52 L110,64 L100,52 Z" class="m-stampo contorno"/><ellipse cx="110" cy="72" rx="12" ry="8" style="fill:var(--fuso)"/>`],
};

module.exports = { viewBox: '0 10 820 360', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
