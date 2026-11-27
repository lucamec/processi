// Schema animato e mini-diagrammi: Incisione fotochimica (Thompson 2007, pp. 392–395).
// Sezione di una targa in inox incisa su un solo lato (profondità esagerata).
// Fasi: 1 film fotosensibile, 2 esposizione UV, 3 sviluppo e ritocco, 4 incisione, 5 colore.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const FONDO = '#eef1f4', ROSSO = '#b8323a';
const AP = [[240, 300], [360, 380], [440, 540]];
const Y0 = 200, Y1 = 250, P = 14;

function filmSopra() {
  let d = '', x = 160;
  AP.forEach((a) => { d += `<rect x="${x}" y="${Y0 - 8}" width="${a[0] - x}" height="8" style="fill:var(--flusso)" fill-opacity="0.75"/>`; x = a[1]; });
  return d + `<rect x="${x}" y="${Y0 - 8}" width="${660 - x}" height="8" style="fill:var(--flusso)" fill-opacity="0.75"/>`;
}

function schema(id) {
  return `
<rect x="160" y="${Y0}" width="500" height="${Y1 - Y0}" class="m-grezzo contorno"/>
${AP.map((a) => `<rect x="${a[0]}" y="${Y0}" width="${a[1] - a[0]}" height="${P}" fill="${FONDO}"${anim({ sy: [0, 0, 0, 1, 1] }, { sy: 0 }, [a[0], Y0])}/>`).join('')}
${AP.map((a) => `<rect x="${a[0]}" y="${Y0}" width="${a[1] - a[0]}" height="${P}" fill="${ROSSO}"${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}/>`).join('')}
${etichetta({ testo: 'Targa in acciaio inox (profondità esagerata)', tx: 40, ty: 290, px: 200, py: Y1 })}

<!-- film: intero sui due lati, poi con le aperture sul lato inciso -->
<g${anim({ op: [1, 1, 0, 0, 0] }, { op: 1 })}>
  <rect x="160" y="${Y0 - 8}" width="500" height="8" style="fill:var(--flusso)" fill-opacity="0.45"/>
</g>
<g${anim({ op: [0, 0, 1, 1, 0] }, { op: 0 })}>${filmSopra()}</g>
<rect x="160" y="${Y1}" width="500" height="8" style="fill:var(--flusso)" fill-opacity="0.75"${anim({ op: [1, 1, 1, 1, 0] }, { op: 1 })}/>
<g${anim({ op: [1, 0, 0, 0, 0] })}>${etichetta({ testo: 'Pezzo sgrassato, film fotosensibile laminato a caldo sui due lati', tx: 160, ty: 150 })}</g>

<!-- 2: negativo e UV -->
<g${anim({ op: [0, 1, 0, 0, 0] })}>
  ${AP.map((a) => `<rect x="${a[0]}" y="172" width="${a[1] - a[0]}" height="6" fill="#1d232b"/>`).join('')}<rect x="150" y="172" width="520" height="6" fill="none" stroke="var(--testo)" stroke-width="1"/>
  ${[200, 410, 620].map((x) => freccia({ id, x1: x, y1: 112, x2: x, y2: 166 })).join('')}
  ${[260, 560].map((x) => freccia({ id, x1: x, y1: 320, x2: x, y2: 266 })).join('')}
  ${etichetta({ testo: 'Negativo su acetato; UV sui due lati: il retro indurisce tutto', tx: 160, ty: 96 })}
</g>
<g${anim({ op: [0, 0, 1, 0, 0] })}>${etichetta({ testo: 'Il film non esposto si scioglie; le piccole imperfezioni si ritoccano a mano', tx: 120, ty: 150 })}</g>

<!-- 4: ugelli oscillanti -->
<g${anim({ op: [0, 0, 0, 1, 0], vx: [0, 0, 0, 40, 0] }, { op: 0, vx: 0 })}>
  ${[260, 410, 560].map((x) => `<rect x="${x - 10}" y="110" width="20" height="18" class="scuro"/><path d="M${x - 6},128 L${x - 26},186 H${x + 26} L${x + 6},128 Z" style="fill:var(--fuso)" fill-opacity="0.3"/>`).join('')}
</g>
<g${anim({ op: [0, 0, 0, 1, 0] })}>${etichetta({ testo: 'Cloruro ferrico dagli ugelli oscillanti: 50–100 µm ogni 5 minuti', tx: 160, ty: 96 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${etichetta({ testo: 'Film tolto con soda caustica; oltre 150 µm gli incavi si riempiono di colore', tx: 120, ty: 150 })}</g>
`;
}

const coppie = {
  dettaglio: {
    ok: ['Dettagli oltre 0,15 mm', 'Si riproducono dettagli fino a circa 0,15 mm di diametro, se film e negativo sono puliti.', () => `<rect x="20" y="60" width="120" height="30" class="m-grezzo contorno"/>${[40, 60, 80, 100, 120].map((x) => `<rect x="${x - 4}" y="60" width="8" height="6" fill="${FONDO}"/>`).join('')}`],
    ko: ['Polvere sul film', 'Polvere e sporco sul film o sul negativo diventano difetti visibili sul pezzo finito.', () => `<rect x="20" y="60" width="120" height="30" class="m-grezzo contorno"/><rect x="20" y="52" width="120" height="8" style="fill:var(--flusso)" fill-opacity="0.6"/><circle cx="80" cy="56" r="3" fill="#1d232b"/><rect x="76" y="60" width="8" height="5" fill="${FONDO}"/><circle cx="80" cy="60" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  sottosquadro: {
    ok: ['Tempo d\'attacco controllato', 'Un\'esposizione giusta all\'acido dà fianchi netti sotto il bordo del film.', () => `<rect x="20" y="60" width="120" height="30" class="m-grezzo contorno"/><rect x="20" y="52" width="45" height="8" style="fill:var(--flusso)" fill-opacity="0.75"/><rect x="95" y="52" width="45" height="8" style="fill:var(--flusso)" fill-opacity="0.75"/><path d="M65,60 Q66,72 70,72 H90 Q94,72 95,60 Z" fill="${FONDO}"/>`],
    ko: ['Attacco troppo lungo', 'Un\'esposizione prolungata all\'acido scava sotto il film (sottosquadro).', () => `<rect x="20" y="60" width="120" height="30" class="m-grezzo contorno"/><rect x="20" y="52" width="45" height="8" style="fill:var(--flusso)" fill-opacity="0.75"/><rect x="95" y="52" width="45" height="8" style="fill:var(--flusso)" fill-opacity="0.75"/><path d="M50,60 Q50,82 62,82 H98 Q110,82 110,60 Z" fill="${FONDO}"/><circle cx="56" cy="66" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  colore: {
    ok: ['Colore in incavi profondi', 'Per riempire di colore servono almeno 150 µm di profondità.', () => `<rect x="20" y="50" width="120" height="40" class="m-grezzo contorno"/><rect x="50" y="50" width="60" height="16" fill="${ROSSO}"/>`],
    ko: ['Incavo troppo basso', 'Un\'incisione poco profonda non trattiene il colore.', () => `<rect x="20" y="50" width="120" height="40" class="m-grezzo contorno"/><rect x="50" y="50" width="60" height="4" fill="${ROSSO}"/><circle cx="80" cy="52" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  pasta: ['Pasta chimica', 'Per materiali molto spessi o superfici 3D: dopo la maschera, invece degli ugelli si stende una pasta che ha un effetto simile.', () => `
    <path d="M20,100 Q110,30 200,100 Z" class="m-grezzo contorno"/>
    <path d="M70,72 Q110,48 150,72" fill="none" style="stroke:var(--fuso)" stroke-width="6" stroke-linecap="round"/>`],
  vetro: ['Vetro e ceramica', 'Si incidono anche vetro, specchio, porcellana e ceramica, con film fotosensibili e prodotti chimici diversi.', () => `
    <rect x="20" y="40" width="180" height="60" fill="#cfe3ea" class="contorno"/>
    ${[50, 90, 130, 170].map((x) => `<rect x="${x - 10}" y="40" width="20" height="8" fill="#f4f7f8"/>`).join('')}`],
  strati: ['Più livelli e mezzetinte', 'Mascherature ripetute danno più livelli di profondità (ma più tempo); anche immagini a mezzatinta con retino visibile.', () => `
    <rect x="20" y="50" width="180" height="50" class="m-grezzo contorno"/>
    <rect x="50" y="50" width="120" height="10" fill="${FONDO}"/><rect x="80" y="60" width="60" height="10" fill="${FONDO}"/>`],
};

module.exports = { viewBox: '0 80 820 270', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
