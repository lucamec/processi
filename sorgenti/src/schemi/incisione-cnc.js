// Schema animato e mini-diagrammi: Incisione CNC (Thompson 2007, pp. 396–399).
// Sezione di una lastra di PMMA sul piano della macchina, con la punta che incide e il colore.
// Fasi: 1 fissaggio e azzeramento, 2 incisione, 3 colore, 4 pulizia.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const PMMA = '#daf0f4', ROSSO = '#b8323a', FONDO = '#eef1f4'; // FONDO: mini-diagrammi
const SOLCHI = [260, 330, 400, 470, 540];

function schema(id) {
  return `
<rect x="120" y="270" width="580" height="30" class="m-stampo contorno"/>
${etichetta({ testo: 'Piano della macchina', tx: 590, ty: 320 })}
<rect x="200" y="264" width="420" height="6" fill="#d9c27a"/>
${etichetta({ testo: 'Film adesivo', tx: 40, ty: 330, px: 200, py: 267 })}
<g${anim({ ty: [-60, 0, 0, 0] }, { ty: -60 })}>
  <rect x="200" y="214" width="420" height="50" fill="${PMMA}" class="contorno"/>
  ${SOLCHI.map((x, i) => `<path d="M${x - 12},214 L${x},232 L${x + 12},214 Z" fill="#8fa9b0"${anim({ op: [0, i < 3 ? 1 : 0, 1, 1] }, { op: 0 })}/>`).join('')}
  ${SOLCHI.map((x) => `<path d="M${x - 12},214 L${x},232 L${x + 12},214 Z" fill="${ROSSO}"${anim({ op: [0, 0, 1, 1] }, { op: 0 })}/>`).join('')}
</g>
${etichetta({ testo: 'PMMA 10 mm', tx: 40, ty: 240, px: 200, py: 240 })}
<!-- utensile -->
<g${anim({ tx: [420, 160, 0, 0], ty: [-40, 0, -80, -80], op: [1, 1, 0, 0] }, { tx: 420, ty: -40 })}>
  <rect x="190" y="60" width="60" height="110" class="m-macchina contorno"/>
  <path d="M212,170 H228 L222,206 L220,214 L218,206 Z" fill="#6a7078" class="contorno"/>
</g>
<g${anim({ op: [1, 0, 0, 0] })}>${etichetta({ testo: 'Lastre fissate con film adesivo; la punta si azzera sullo spigolo in alto a destra', tx: 140, ty: 360 })}</g>
<g${anim({ op: [0, 1, 0, 0] })}>${etichetta({ testo: 'Punta in tungsteno da 0,3 mm, a linee rette: 1–50 mm/s secondo materiale e profondità', tx: 140, ty: 360 })}</g>
<g${anim({ op: [0, 0, 1, 0] })}>
  <path d="M180,196 L640,196" style="stroke:var(--testo)" stroke-width="5"/>
  ${etichetta({ testo: 'Vernice alla cellulosa a racla: 20 minuti di asciugatura per colore', tx: 140, ty: 360 })}
</g>
<g${anim({ op: [0, 0, 0, 1] })}>${etichetta({ testo: 'Pulito l\'eccesso: il colore cancella i segni del taglio', tx: 140, ty: 360 })}</g>
${freccia({ id, x1: 660, y1: 120, x2: 700, y2: 120 })}${freccia({ id, x1: 660, y1: 120, x2: 660, y2: 80 })}
${etichetta({ testo: 'x, y, z', tx: 670, ty: 70 })}
`;
}

const coppie = {
  punta: {
    ok: ['Punta adatta ai raggi', 'Punte piccole (0,3 mm o meno) riproducono dettagli e raggi interni stretti.', () => `<rect x="20" y="50" width="120" height="40" fill="${PMMA}" class="contorno"/><path d="M50,50 L56,62 L62,50 Z" fill="${FONDO}"/><path d="M90,50 L96,62 L102,50 Z" fill="${FONDO}"/>`],
    ko: ['Punta troppo grande', 'Una punta grande lavora più in fretta ma perde definizione: va trovato un compromesso.', () => `<rect x="20" y="50" width="120" height="40" fill="${PMMA}" class="contorno"/><path d="M40,50 Q76,90 112,50 Z" fill="${FONDO}"/><circle cx="76" cy="62" r="18" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  caratteri: {
    ok: ['Testi convertiti in tracciati', 'I caratteri vanno forniti come contorni vettoriali.', () => `<text x="80" y="78" text-anchor="middle" font-size="34" font-weight="700" fill="none" stroke="var(--testo)" stroke-width="1.5">Aa</text>`],
    ko: ['Font non convertito', 'Altrimenti nel passaggio il carattere può essere sostituito da un altro.', () => `<text x="80" y="78" text-anchor="middle" font-size="30" font-family="monospace" fill="var(--testo)">Aa</text><circle cx="80" cy="66" r="26" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  scala: {
    ok: ['Dettaglio fine su aree piccole', 'Dettagli molto fini sono possibili, con tempi brevi se l\'area è contenuta.', () => `<rect x="50" y="40" width="60" height="50" fill="${PMMA}" class="contorno"/>${[52, 60, 68, 76].map((y) => `<line x1="60" y1="${y}" x2="100" y2="${y}" stroke="var(--testo)"/>`).join('')}`],
    ko: ['Grandi aree a dettaglio fine', 'Incisioni grandi con dettagli minuti richiedono molto più tempo.', () => `<rect x="20" y="30" width="120" height="70" fill="${PMMA}" class="contorno"/>${Array.from({ length: 14 }, (_, i) => `<line x1="28" y1="${36 + i * 4.5}" x2="132" y2="${36 + i * 4.5}" stroke="var(--testo)" stroke-width="0.8"/>`).join('')}<circle cx="80" cy="66" r="28" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  retro: ['Incisione sul retro', 'Nei materiali trasparenti si incide il retro del pezzo: l\'incisione si vede attraverso lo spessore.', () => `
    <rect x="40" y="40" width="140" height="50" fill="${PMMA}" class="contorno"/>
    ${[70, 110, 150].map((x) => `<path d="M${x - 8},90 L${x},80 L${x + 8},90 Z" fill="${ROSSO}"/>`).join('')}
    <circle cx="110" cy="20" r="6" fill="none" stroke="var(--testo)"/><line x1="110" y1="26" x2="110" y2="38" stroke="var(--testo)" stroke-dasharray="3 2"/>`],
  cinque: ['A 5 assi', 'Le macchine a 5 assi incidono superfici 3D e disegni più complessi, ma costano di più.', () => `
    <path d="M20,100 Q110,30 200,100 Z" fill="${PMMA}" class="contorno"/>
    <rect x="100" y="10" width="20" height="40" class="m-macchina contorno" transform="rotate(20 110 50)"/>`],
  profilo: ['Percorso a contorno', 'Invece delle linee rette la punta può seguire il profilo del disegno; la scelta dipende dalla forma.', () => `
    <rect x="20" y="30" width="180" height="70" fill="${PMMA}" class="contorno"/>
    <ellipse cx="110" cy="65" rx="60" ry="24" fill="none" stroke="var(--testo)" stroke-width="2"/><ellipse cx="110" cy="65" rx="45" ry="16" fill="none" stroke="var(--testo)" stroke-width="2"/><ellipse cx="110" cy="65" rx="30" ry="8" fill="none" stroke="var(--testo)" stroke-width="2"/>`],
};

module.exports = { viewBox: '0 40 820 340', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
