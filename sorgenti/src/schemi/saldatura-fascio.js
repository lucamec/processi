// Schema animato e mini-diagrammi: Saldatura a fascio, laser ed elettronico (Thompson 2007, pp. 288–293).
// Sezione trasversale di un giunto testa a testa saldato al laser con "keyhole".
// Fasi: 1 allineamento del giunto, 2 messa a fuoco, 3 keyhole, 4 solidificazione.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

function schema(id) {
  return `
<rect x="140" y="300" width="540" height="12" class="macchina"/>
<!-- lamiere spesse che si accostano -->
<g${anim({ tx: [0, 0, 0, 0] }, { tx: -40 })}><rect x="180" y="180" width="228" height="120" fill="url(#${id}-tratteggio)" class="contorno"/></g>
<g${anim({ tx: [0, 0, 0, 0] }, { tx: 40 })}><rect x="412" y="180" width="228" height="120" fill="url(#${id}-tratteggio)" class="contorno"/></g>
${etichetta({ testo: 'Giunto con tolleranze strette, allineato al fascio', tx: 20, ty: 340 })}
<!-- ZTA stretta -->
<rect x="396" y="180" width="28" height="120" style="fill:var(--fuso)" fill-opacity="0.2"${anim({ op: [0, 0, 1, 1] }, { op: 0 })}/>
<!-- keyhole e cordone -->
<path d="M404,180 L407,296 H413 L416,180 Z" style="fill:var(--fuso)"${anim({ op: [0, 0, 1, 0], sy: [0, 0, 1, 1] }, { op: 0, sy: 0 }, [410, 180])}/>
<path d="M402,180 L407,298 H413 L418,180 Z" class="m-finito contorno"${anim({ op: [0, 0, 0, 1] }, { op: 0 })}/>
<g${anim({ op: [0, 0, 1, 0] })}>${etichetta({ testo: 'keyhole: il calore arriva in profondità', tx: 470, ty: 250, px: 414, py: 250 })}</g>
<g${anim({ op: [0, 0, 0, 1] })}>${etichetta({ testo: 'saldatura stretta e profonda, ZTA ridotta', tx: 470, ty: 250, px: 418, py: 250 })}</g>

<!-- testa laser: lente e fascio -->
<g${anim({ ty: [-20, 0, 0, -20] }, { ty: -20 })}>
  <rect x="380" y="30" width="60" height="70" class="m-stampo contorno"/>
  <ellipse cx="410" cy="100" rx="26" ry="7" style="fill:var(--flusso)" opacity="0.6"/>
</g>
<path d="M396,104 L410,178 L424,104 Z" style="fill:var(--fuso)" fill-opacity="0.5"${anim({ op: [0, 1, 1, 0] }, { op: 0 })}/>
<g${anim({ op: [0, 1, 1, 0] })}><path d="M370,120 L392,160 M450,120 L428,160" stroke="var(--flusso)" stroke-width="2" stroke-dasharray="4 3"/></g>
${etichetta({ testo: 'Fascio laser e lente di focalizzazione', tx: 460, ty: 60 })}
<g${anim({ op: [0, 1, 0, 0] })}>${etichetta({ testo: 'punto di 0,1–1 mm, a fuoco sulla superficie; gas di protezione', tx: 380, ty: 130 })}</g>
<g${anim({ op: [1, 0, 0, 0] })}>${freccia({ id, x1: 120, y1: 240, x2: 170, y2: 240 })}${freccia({ id, x1: 700, y1: 240, x2: 650, y2: 240 })}</g>
`;
}

const coppie = {
  giunto: {
    ok: ['Giunto preciso e allineato', 'Per una buona saldatura testa a testa il giunto deve rispettare tolleranze strette ed essere allineato al fascio.', (id) => `<rect x="20" y="40" width="58" height="50" fill="url(#${id}-tratteggio)" class="contorno"/><rect x="82" y="40" width="58" height="50" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M80,10 V40" stroke="var(--fuso)" stroke-width="3"/>`],
    ko: ['Giunto con luce variabile', 'Il fascio sottile non colma un giunto largo o disallineato; per questi casi si usano ibridi laser-arco.', (id) => `<rect x="20" y="40" width="50" height="50" fill="url(#${id}-tratteggio)" class="contorno"/><rect x="92" y="46" width="48" height="50" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M80,10 V40" stroke="var(--fuso)" stroke-width="3"/><circle cx="81" cy="64" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  cricche: {
    ok: ['Metalli adatti', 'Acciai, rame, alluminio (serie 5000 e 6000), magnesio e titanio si saldano bene, pur con cautele per l\'alluminio riflettente e il titanio reattivo.', (id) => `<rect x="20" y="40" width="120" height="50" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M76,40 L78,90 H82 L84,40 Z" class="m-finito contorno"/>`],
    ko: ['Acciai ad alto carbonio', 'Il salto di temperatura fra zona fusa e metallo base può causare cricche in alcuni metalli, soprattutto negli acciai ad alto carbonio.', (id) => `<rect x="20" y="40" width="120" height="50" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M76,40 L78,90 H82 L84,40 Z" class="m-finito contorno"/><path d="M84,56 l8,4 l-4,6 l8,4" fill="none" stroke="var(--ko)" stroke-width="2"/><circle cx="90" cy="64" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  costo: {
    ok: ['Applicazioni specialistiche o di massa', 'Attrezzature costose e programmazione accurata ripagano solo con applicazioni speciali o grandi serie, dove la velocità conta.', () => `${[0, 1, 2, 3, 4].map((i) => `<rect x="${20 + i * 26}" y="50" width="20" height="30" class="m-finito contorno"/>`).join('')}`],
    ko: ['Pezzo unico semplice', 'Per un giunto semplice in pochi pezzi l\'arco è più conveniente.', () => `<rect x="60" y="50" width="40" height="30" class="m-finito contorno"/><circle cx="80" cy="65" r="26" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  ebw: ['Fascio elettronico (EBW)', 'Elettroni emessi da un catodo di tungsteno a oltre 2.000 °C, accelerati fino a due terzi della velocità della luce e focalizzati da bobine magnetiche, nel vuoto: fino a 30.000 W/mm², acciaio fino a 150 mm e alluminio fino a 450 mm.', () => `
    <path d="M90,6 H130 V40 L116,60 H104 L90,40 Z" class="m-stampo contorno"/>
    <ellipse cx="110" cy="70" rx="20" ry="6" fill="none" stroke="var(--flusso)" stroke-width="3"/>
    <path d="M110,60 V112" stroke="var(--flusso)" stroke-width="3"/>
    <rect x="20" y="4" width="180" height="114" fill="none" stroke="var(--testo)" stroke-dasharray="6 4"/>`],
  ridotta: ['EBW a pressione ridotta', 'Dagli anni Novanta un\'unità piccola crea un vuoto locale (1–10 mbar) e si sposta lungo il giunto: si salda in cantiere su pezzi troppo grandi per la camera.', () => `
    <rect x="20" y="80" width="180" height="30" class="m-stampo contorno"/>
    <path d="M80,40 H140 V78 H80 Z" fill="none" stroke="var(--testo)" stroke-width="3"/><path d="M110,10 V78" stroke="var(--flusso)" stroke-width="3"/>`],
  plastica: ['Laser su plastiche e tessuti', 'Il laser salda termoplastici (PP, PE, ABS, POM, PMMA) e, con un mezzo che assorbe l\'infrarosso stampato sul giunto, anche plastiche trasparenti e tessuti, con giunti ermetici e senza tracce.', () => `
    <rect x="20" y="60" width="180" height="16" fill="#cfe3ea" class="contorno"/><rect x="20" y="76" width="180" height="16" fill="#cfe3ea" class="contorno"/>
    <rect x="80" y="73" width="60" height="6" style="fill:var(--fuso)"/><path d="M110,10 V72" stroke="var(--fuso)" stroke-width="3"/>`],
  ibrido: ['Ibrido laser-arco', 'Laser ad alta potenza abbinato alla saldatura MIG: tollera variazioni della luce del giunto, migliora la qualità e la produttività, per esempio nei cantieri navali.', () => `
    <rect x="20" y="80" width="180" height="30" class="m-stampo contorno"/>
    <path d="M90,10 L106,78" stroke="var(--fuso)" stroke-width="3"/><path d="M150,20 L118,74" stroke="var(--testo)" stroke-width="10"/>`],
};

module.exports = { viewBox: '0 20 820 340', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
