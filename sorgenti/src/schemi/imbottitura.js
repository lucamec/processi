// Schema animato e mini-diagrammi: Imbottitura e tappezzeria (Thompson 2007, pp. 338–343).
// Schema principale: cucitura a punto annodato (lockstitch), in sezione.
// Fasi: 1 l'ago attraversa, 2 il crochet prende il filo, 3 l'asola gira attorno alla spolina, 4 tensione e avanzamento.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const PELLE = '#8a5a3a';

function schema(id) {
  return `
<!-- strati da cucire sul piano, trasportati dalla griffa -->
<g${anim({ tx: [0, 0, 0, -40] }, { tx: 0 })}>
  <rect x="140" y="190" width="560" height="14" fill="${PELLE}" class="contorno"/>
  <rect x="140" y="204" width="560" height="14" fill="#b07a52" class="contorno"/>
  ${[260, 300, 340, 380].map((x) => `<line x1="${x}" y1="186" x2="${x + 40}" y2="186" stroke="var(--finito)" stroke-width="3"/><line x1="${x}" y1="222" x2="${x + 40}" y2="222" stroke="var(--finito)" stroke-width="3"/>`).join('')}
</g>
${etichetta({ testo: 'Strati di pelle o tessuto', tx: 20, ty: 180, px: 150, py: 196 })}
<rect x="140" y="218" width="560" height="14" class="macchina"/>
<!-- griffa -->
<g${anim({ ty: [0, 0, 0, -8], tx: [0, 0, 0, -40] }, { ty: 0, tx: 0 })}><path d="M430,232 l6,-8 l6,8 l6,-8 l6,8 l6,-8 l6,8 Z" class="scuro"/></g>
${etichetta({ testo: 'Griffa: fa avanzare il tessuto', tx: 520, ty: 260, px: 460, py: 232 })}
<!-- piedino premistoffa -->
<rect x="440" y="150" width="70" height="36" class="m-stampo contorno"/>
${etichetta({ testo: 'Piedino', tx: 530, ty: 160 })}
<!-- ago con filo superiore -->
<g${anim({ ty: [80, 75, 75, -40] }, { ty: -40 })}>
  <rect x="414" y="40" width="12" height="130" class="m-stampo contorno"/>
  <path d="M420,170 L416,180 H424 Z" class="m-stampo contorno"/>
  <line x1="420" y1="40" x2="420" y2="172" stroke="var(--fuso)" stroke-width="2"/>
</g>
${etichetta({ testo: 'Ago con il filo superiore', tx: 200, ty: 60 })}
<!-- crochet rotante e spolina -->
<circle cx="420" cy="300" r="34" fill="none" stroke="var(--testo)" stroke-width="3"/>
<circle cx="420" cy="300" r="14" class="m-grezzo contorno"/>
<g${anim({ rot: [0, 120, 300, 360] }, { rot: 0 }, [420, 300])}><path d="M420,266 l10,-6 l-4,10 Z" class="scuro"/></g>
${etichetta({ testo: 'Crochet rotante e spolina del filo inferiore', tx: 470, ty: 320 })}
<!-- asola del filo superiore -->
<path d="M420,250 Q450,280 420,300 Q390,320 420,334" fill="none" stroke="var(--fuso)" stroke-width="2.5"${anim({ op: [0, 1, 1, 0] }, { op: 0 })}/>
<g${anim({ op: [1, 0, 0, 0] })}>${etichetta({ testo: 'l\'ago attraversa gli strati e si ferma un istante', tx: 20, ty: 370 })}</g>
<g${anim({ op: [0, 1, 0, 0] })}>${etichetta({ testo: 'il crochet aggancia il filo superiore', tx: 20, ty: 370 })}</g>
<g${anim({ op: [0, 0, 1, 0] })}>${etichetta({ testo: 'l\'asola gira dietro al filo inferiore, tenuto in tensione dalla spolina', tx: 20, ty: 370 })}</g>
<g${anim({ op: [0, 0, 0, 1] })}>${freccia({ id, x1: 380, y1: 270, x2: 320, y2: 270 })}${etichetta({ testo: 'il filo si stringe nel punto; la griffa porta avanti il tessuto', tx: 20, ty: 370 })}</g>
`;
}

const coppie = {
  forma: {
    ok: ['Curve su un asse', 'La forma deve potersi coprire tagliando e cucendo il tessuto: le curve su un solo asse si rivestono facilmente.', () => `<path d="M20,90 Q80,30 140,90" fill="none" stroke="${PELLE}" stroke-width="10"/>`],
    ko: ['Curve su più assi con tessuto rigido', 'Le doppie curvature richiedono tessuti elastici o più pezzi cuciti insieme.', () => `<ellipse cx="80" cy="64" rx="56" ry="40" fill="${PELLE}" fill-opacity="0.4" stroke="${PELLE}" stroke-width="4"/><path d="M40,40 l10,10 M110,36 l-8,12 M60,96 l6,-10" stroke="var(--ko)" stroke-width="2.5"/><circle cx="80" cy="64" r="44" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  concavo: {
    ok: ['Concavità fissate', 'Le forme concave si rivestono fissando la copertura con un pannello, spilli, legacci o colla.', () => `<path d="M20,40 Q80,100 140,40" fill="none" stroke="${PELLE}" stroke-width="8"/><circle cx="80" cy="70" r="5" class="scuro"/><line x1="80" y1="70" x2="80" y2="104" stroke="var(--testo)" stroke-width="2"/>`],
    ko: ['Tessuto elastico su una concavità', 'Un tessuto elastico funziona solo sulle forme convesse: sulle concavità fa ponte e si stacca.', () => `<path d="M20,40 Q80,100 140,40" fill="none" stroke="var(--grezzo)" stroke-width="4" stroke-dasharray="4 3"/><path d="M20,40 H140" fill="none" stroke="${PELLE}" stroke-width="6"/><circle cx="80" cy="56" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  chiusura: {
    ok: ['Bordo aperto nascosto', 'La copertura si tende e si graffa su una faccia nascosta (sotto o dietro), poi coperta da un pannello rivestito a parte.', () => `<rect x="30" y="30" width="100" height="60" fill="${PELLE}" fill-opacity="0.5" stroke="${PELLE}" stroke-width="4"/><rect x="40" y="86" width="80" height="12" class="m-stampo contorno"/>`],
    ko: ['Graffe in vista', 'Bordi tagliati e graffe lasciati su una faccia visibile rovinano la finitura.', () => `<rect x="30" y="30" width="100" height="60" fill="${PELLE}" fill-opacity="0.5" stroke="${PELLE}" stroke-width="4"/>${[50, 70, 90, 110].map((x) => `<path d="M${x},40 v6 h8 v-6" fill="none" stroke="var(--testo)" stroke-width="2"/>`).join('')}<circle cx="80" cy="44" r="20" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  catena: ['Punto a catena e sopraggitto', 'Il punto a catena usa un solo filo, ma se si rompe si disfa; il sopraggitto rifinisce il bordo con più fili intrecciati e impedisce che sfilacci.', () => `
    <rect x="20" y="50" width="180" height="20" fill="#b07a52" class="contorno"/>
    ${[40, 70, 100, 130, 160].map((x) => `<path d="M${x},60 q15,-20 30,0" fill="none" stroke="var(--fuso)" stroke-width="2.5"/>`).join('')}
    ${[30, 50, 70, 90, 110, 130, 150, 170, 190].map((x) => `<path d="M${x},70 l10,-24" stroke="var(--finito)" stroke-width="2"/>`).join('')}`],
  tagliato: ['Espanso tagliato', 'L\'espanso si taglia e si incolla su una struttura, per esempio in legno laminato; il rivestimento si tende e si graffa sul supporto. Adatto a pezzi a spessore costante.', () => `
    <path d="M30,96 V40 H190 V96 Z" class="m-stampo contorno"/><rect x="40" y="30" width="140" height="30" fill="#f2e6b8" class="contorno"/>
    <path d="M34,26 H186 V64" fill="none" stroke="${PELLE}" stroke-width="5"/>`],
  rim: ['Espanso stampato (RIM)', 'Per forme complesse e ondulate l\'espanso si stampa attorno a una struttura metallica; la copertura cucita si incolla con colla attivata dal vapore, anche nei sottosquadri.', () => `
    <path d="M40,90 Q30,30 110,24 Q190,30 180,90 Z" fill="#f2e6b8" class="contorno"/>
    <path d="M36,92 Q24,26 110,18 Q196,26 184,92" fill="none" stroke="${PELLE}" stroke-width="5"/><path d="M70,80 Q110,50 150,80" fill="none" stroke="var(--testo)" stroke-width="3"/>`],
  molle: ['Molleggi', 'Molle legate a mano fino a 8 volte su cinghie (le più pregiate), unità prefabbricate inserite nel telaio, o molle ondulate a S fissate alle estremità. Gli espansi moderni le rendono spesso superflue.', () => `
    <rect x="20" y="90" width="180" height="16" class="m-grezzo contorno"/>
    <path d="M30,80 q10,-12 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0" fill="none" stroke="var(--testo)" stroke-width="3"/>
    ${[50, 110, 170].map((x) => `<path d="M${x},90 v-8 m-6,0 h12 m-12,-8 h12 m-12,-8 h12" stroke="var(--testo)" stroke-width="2"/>`).join('')}`],
};

module.exports = { viewBox: '0 20 820 360', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
