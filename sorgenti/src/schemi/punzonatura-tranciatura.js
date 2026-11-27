// Schema animato e mini-diagrammi: Punzonatura e tranciatura (Thompson 2007, pp. 260–265).
// Sezione di punzone, premilamiera e matrice. Fasi: 1 carico, 2 bloccaggio, 3 punzonatura,
// 4 ritorno ed espulsione dello sfrido, 5 sbavatura.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const FONDO = '#eef1f4';

function schema(id) {
  return `
<!-- matrice (con gioco leggermente maggiore del punzone) -->
<path d="M180,236 H372 V330 H180 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
<path d="M448,236 H640 V330 H448 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
${etichetta({ testo: 'Matrice', tx: 660, ty: 300 })}

<!-- lamiera: entra, viene forata -->
<g${anim({ tx: [0, 0, 0, 0, 0] }, { tx: -260 })}>
  <rect x="120" y="222" width="580" height="14" class="m-grezzo contorno"${anim({ op: [1, 1, 1, 1, 0] }, { op: 1 })}/>
  <rect x="120" y="222" width="580" height="14" class="m-finito contorno"${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}/>
  <rect x="376" y="222" width="68" height="14" fill="${FONDO}"${anim({ op: [0, 0, 1, 1, 1] }, { op: 0 })}/>
  <g${anim({ op: [0, 0, 1, 1, 0] }, { op: 0 })}><path d="M376,236 l-6,8 l6,0 Z M444,236 l6,8 l-6,0 Z" style="fill:var(--ko)"/></g>
</g>
${etichetta({ testo: 'Lamiera (fino a 5 mm)', tx: 20, ty: 210, px: 130, py: 226 })}
<!-- sfrido che cade -->
<rect x="378" y="222" width="64" height="14" class="m-grezzo contorno"${anim({ op: [0, 1, 1, 0, 0], ty: [0, 0, 70, 120, 120] }, { op: 0, ty: 0 })}/>
<g${anim({ op: [0, 0, 0, 1, 0] })}>${etichetta({ testo: 'lo sfrido cade e si ricicla; sul bordo restano arrotondamento e bava', tx: 20, ty: 360 })}</g>

<!-- premilamiera -->
<g${anim({ ty: [-40, 0, 0, -40, -40] }, { ty: -40 })}>
  <path d="M290,200 H372 V220 H290 Z M448,200 H530 V220 H448 Z" class="m-stampo contorno"/>
</g>
${etichetta({ testo: 'Premilamiera', tx: 560, ty: 190 })}
<!-- punzone temprato -->
<g${anim({ ty: [-80, -40, 36, -80, -80] }, { ty: -80 })}>
  <rect x="330" y="40" width="160" height="40" class="macchina"/>
  <rect x="378" y="80" width="64" height="140" fill="url(#${id}-tratteggio)" class="contorno"/>
  <g${anim({ op: [0, 0, 1, 0, 0] })}>${freccia({ id, x1: 410, y1: -10, x2: 410, y2: 36 })}</g>
</g>
${etichetta({ testo: 'Punzone temprato', tx: 520, ty: 70 })}
<g${anim({ op: [0, 1, 0, 0, 0] })}>${etichetta({ testo: 'premilamiera e matrice serrano il pezzo', tx: 20, ty: 360 })}</g>
<g${anim({ op: [0, 0, 1, 0, 0] })}>${etichetta({ testo: 'il metallo si frattura fra i bordi di punzone e matrice', tx: 20, ty: 360 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${etichetta({ testo: 'la bava si toglie con rettifica e lucidatura', tx: 20, ty: 360 })}</g>
`;
}

const coppie = {
  larghezza: {
    ok: ['Fori e ponticelli non più stretti dello spessore', 'Il punzone non deve essere più stretto dello spessore, e il materiale che resta fra i fori deve essere più largo dello spessore.', () => `<rect x="20" y="50" width="120" height="16" class="m-finito contorno"/><rect x="44" y="50" width="26" height="16" fill="${FONDO}"/><rect x="92" y="50" width="26" height="16" fill="${FONDO}"/>`],
    ko: ['Foro o ponticello troppo sottile', 'Un punzone più sottile dello spessore si rompe; un ponticello troppo stretto si deforma.', () => `<rect x="20" y="50" width="120" height="16" class="m-finito contorno"/><rect x="50" y="50" width="30" height="16" fill="${FONDO}"/><rect x="84" y="50" width="30" height="16" fill="${FONDO}"/><circle cx="82" cy="58" r="13" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  fissaggi: {
    ok: ['Fori di fissaggio lontani dal bordo', 'I punti di fissaggio vanno arretrati il più possibile per la massima resistenza.', () => `<rect x="20" y="30" width="120" height="70" class="m-finito contorno"/><circle cx="50" cy="65" r="8" fill="${FONDO}" stroke="var(--testo)"/><circle cx="110" cy="65" r="8" fill="${FONDO}" stroke="var(--testo)"/>`],
    ko: ['Fori a filo del bordo', 'Un foro troppo vicino al bordo indebolisce il pezzo.', () => `<rect x="20" y="30" width="120" height="70" class="m-finito contorno"/><circle cx="28" cy="65" r="8" fill="${FONDO}" stroke="var(--testo)"/><circle cx="28" cy="65" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  bava: {
    ok: ['Bava sul lato nascosto o da lucidare', 'La bava resta sul lato d\'uscita del punzone: si sceglie il verso (nel caso studio si punzona dal retro) o la si nasconde in un incavo.', () => `<rect x="20" y="50" width="120" height="16" class="m-finito contorno"/><rect x="66" y="50" width="28" height="16" fill="${FONDO}"/><path d="M66,66 l-4,6 h4 Z M94,66 l4,6 h-4 Z" style="fill:var(--testo)"/>${C.etichetta({ testo: 'retro', tx: 80, ty: 96, ancora: 'middle' })}`],
    ko: ['Bava sul lato in vista', 'Sul lato a vista bordi arrotondati e bave impediscono una lucidatura perfetta.', () => `<rect x="20" y="50" width="120" height="16" class="m-finito contorno"/><rect x="66" y="50" width="28" height="16" fill="${FONDO}"/><path d="M66,50 l-4,-6 h4 Z M94,50 l4,-6 h-4 Z" style="fill:var(--ko)"/><circle cx="80" cy="46" r="20" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  tranciatura: ['Tranciatura', 'Si ritaglia una forma esterna in un colpo solo: il pezzo è ciò che cade, il foglio forato è lo sfrido. I pezzi restano legati al foglio da linguette.', () => `
    <rect x="20" y="40" width="180" height="16" class="m-grezzo contorno"/><rect x="80" y="40" width="60" height="16" fill="${FONDO}"/>
    <rect x="80" y="80" width="60" height="16" class="m-finito contorno"/>`],
  roditura: ['Roditura (nibbling)', 'Oltre 85 mm di diametro un solo utensile costa troppo: tanti colpi sovrapposti di un punzone piccolo seguono il contorno.', () => `
    <circle cx="110" cy="62" r="46" fill="none" stroke="var(--testo)" stroke-dasharray="3 3"/>
    ${Array.from({ length: 16 }, (_, i) => { const a = i / 16 * Math.PI * 2; return `<circle cx="${110 + 46 * Math.cos(a)}" cy="${62 + 46 * Math.sin(a)}" r="9" fill="${FONDO}" stroke="var(--finito)" stroke-width="2"/>`; }).join('')}`],
  intaglio: ['Intaglio (notching)', 'Si asporta materiale dal bordo esterno del pezzo.', () => `
    <path d="M20,30 H200 V100 H20 Z" class="m-finito contorno"/>
    <path d="M90,30 H130 V56 H90 Z" fill="${FONDO}" stroke="var(--testo)"/>`],
};

module.exports = { viewBox: '0 20 820 360', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
