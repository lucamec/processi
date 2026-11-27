// Schema animato e mini-diagrammi: Stampa a trasferimento ad acqua (Thompson 2007, pp. 408–411).
// Sezione della vasca con il film galleggiante; il pezzo scende e il film lo avvolge.
// Fasi: 1 fondo, 2 film sull'acqua, 3 attivatore, 4 immersione, 5 risciacquo e lacca.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const ACQUA = '#bcd9ec', FILM = '#6b7a3a', PEZZO = '#c8ccd0';

function schema(id) {
  return `
<!-- vasca -->
<path d="M180,170 V330 H640 V170" fill="none" class="contorno" stroke-width="3"/>
<rect x="182" y="190" width="456" height="138" fill="${ACQUA}"/>
${etichetta({ testo: 'Acqua a 30–40 °C', tx: 660, ty: 300 })}
<!-- film -->
<g${anim({ op: [0, 1, 1, 0, 0], sx: [0.2, 1, 1, 1, 1] }, { op: 0, sx: 0.2 }, [410, 190])}>
  <rect x="260" y="186" width="300" height="4" fill="${FILM}"/>
</g>
<g${anim({ op: [0, 1, 1, 1, 0] }, { op: 0 })}><rect x="246" y="176" width="10" height="20" class="scuro"/><rect x="564" y="176" width="10" height="20" class="scuro"/></g>
${etichetta({ testo: 'Film in PVOH con l\'inchiostro, fra due paratie', tx: 470, ty: 150, px: 520, py: 186 })}
<!-- attivatore -->
<g${anim({ op: [0, 0, 1, 0, 0], tx: [0, 0, 160, 160, 160] }, { op: 0, tx: 0 })}>
  <rect x="270" y="90" width="20" height="30" class="m-stampo contorno"/>
  <path d="M275,120 L240,184 H320 L285,120 Z" fill="#e8ecef" fill-opacity="0.7"/>
</g>
<!-- pezzo -->
<g${anim({ ty: [0, 0, 0, 110, 0] }, { ty: 0 })}>
  <line x1="410" y1="40" x2="410" y2="100" stroke="var(--testo)" stroke-width="3"/>
  <path d="M350,100 H470 Q470,160 410,160 Q350,160 350,100 Z" fill="${PEZZO}" class="contorno"/>
  <path d="M350,100 Q350,160 410,160 Q470,160 470,100" fill="none" stroke="${FILM}" stroke-width="5"${anim({ op: [0, 0, 0, 1, 1] }, { op: 0 })}/>
  <path d="M346,100 Q346,164 410,164 Q474,164 474,100" fill="none" stroke="var(--flusso)" stroke-width="2"${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}/>
</g>
${etichetta({ testo: 'Pezzo con fondo coprente', tx: 490, ty: 80 })}
<g${anim({ op: [1, 0, 0, 0, 0] })}>${etichetta({ testo: 'Il pezzo riceve un fondo coprente, che corregge i difetti e fa da sfondo agli inchiostri', tx: 120, ty: 370 })}</g>
<g${anim({ op: [0, 1, 0, 0, 0] })}>${etichetta({ testo: 'Il film riposa 45 secondi sull\'acqua: il PVOH inizia a sciogliersi', tx: 120, ty: 370 })}</g>
<g${anim({ op: [0, 0, 1, 0, 0] })}>${etichetta({ testo: 'L\'attivatore rende l\'inchiostro gelatinoso: da qui conta ogni secondo', tx: 120, ty: 370 })}</g>
<g${anim({ op: [0, 0, 0, 1, 0] })}>${etichetta({ testo: 'Immerso inclinato, il pezzo è avvolto dall\'inchiostro spinto dalla pressione dell\'acqua', tx: 120, ty: 370 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${etichetta({ testo: 'Risciacquato, riceve una lacca trasparente opaca o lucida', tx: 120, ty: 370 })}</g>
${freccia({ id, x1: 410, y1: 30, x2: 410, y2: 60 })}
`;
}

const coppie = {
  forma: {
    ok: ['Curve dolci', 'Superfici piane, curve dolci e pieghe su un solo asse sono le più semplici; si stampano anche cinque facce di un cubo.', () => `<path d="M20,90 Q80,40 140,90 Z" fill="${PEZZO}" class="contorno"/><path d="M20,90 Q80,40 140,90" fill="none" stroke="${FILM}" stroke-width="4"/>`],
    ko: ['Coni e spigoli vivi', 'Coni e spigoli vivi sono i più difficili: il motivo si riproduce peggio che sulle superfici piane.', () => `<path d="M30,95 L80,30 L130,95 Z" fill="${PEZZO}" class="contorno"/><circle cx="80" cy="36" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  aria: {
    ok: ['Sfogo per l\'aria', 'Recessi profondi, fori e sottosquadri devono avere un’uscita per l’aria in alto; l’angolo d’immersione giusto aiuta.', () => `<path d="M20,40 V90 H140 V40 H100 V70 H60 V40 Z" fill="${PEZZO}" class="contorno"/><path d="M80,70 V20" stroke="var(--flusso)" stroke-width="2" stroke-dasharray="3 2"/>`],
    ko: ['Bolla intrappolata', 'Senza sfogo resta una bolla e l\'inchiostro non tocca la superficie.', () => `<path d="M20,90 V40 H140 V90 H100 V60 H60 V90 Z" fill="${PEZZO}" class="contorno"/><circle cx="80" cy="76" r="12" fill="#fff" stroke="var(--testo)"/><circle cx="80" cy="76" r="20" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  posizione: {
    ok: ['Motivi continui', 'Il processo è adatto a motivi che coprono la superficie: venature, marmo, mimetico.', () => `<rect x="20" y="40" width="120" height="50" fill="${PEZZO}" class="contorno"/>${[30, 55, 80, 105].map((x, i) => `<path d="M${x},40 Q${x + 12},65 ${x},90" fill="none" stroke="#8a6a42" stroke-width="${2 + i % 2}"/>`).join('')}`],
    ko: ['Grafiche da posizionare', 'La grafica non si colloca con precisione: numeri di un pannello di comando vanno stampati in altro modo.', () => `<rect x="20" y="40" width="120" height="50" fill="${PEZZO}" class="contorno"/><text x="62" y="74" font-size="22" fill="var(--testo)">1 2</text><circle cx="80" cy="66" r="24" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  imitazione: ['Imitazione di materiali', 'Venature di legno, marmo, pelle di serpente, fibra di carbonio: per pezzi che nel materiale vero sarebbero troppo costosi o impossibili.', () => `
    <rect x="30" y="40" width="160" height="50" fill="#b08a5a" class="contorno"/>
    ${[50, 80, 110, 140, 170].map((x) => `<path d="M${x},40 Q${x + 16},65 ${x - 6},90" fill="none" stroke="#6e4f2e" stroke-width="2"/>`).join('')}`],
  mascherato: ['Due immersioni con mascheratura', 'Pezzi troppo complessi si mascherano e si stampano in due metà; l\'inchiostro non aderisce a sé stesso e la giunzione è netta.', () => `
    <rect x="30" y="40" width="80" height="50" fill="${FILM}" class="contorno"/><rect x="110" y="40" width="80" height="50" fill="${PEZZO}" class="contorno"/>
    <line x1="110" y1="34" x2="110" y2="96" stroke="var(--testo)" stroke-dasharray="3 2"/>`],
  decoro: ['Grafiche decorative', 'Motivi geometrici, bandiere, fotografie o grafiche proprie, stampati in digitale: colori pieni o sfumati allo stesso costo.', () => `
    <rect x="30" y="40" width="160" height="50" fill="#fff" class="contorno"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="${40 + i * 38}" y="50" width="30" height="30" fill="${['#4c62d9', '#f06a1d', '#3f8f8a', '#b8323a'][i]}"/>`).join('')}`],
};

module.exports = { viewBox: '0 20 820 370', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
