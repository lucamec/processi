// Schema animato e mini-diagrammi: Metallizzazione sottovuoto (Thompson 2007, pp. 372–375).
// Sezione della camera a vuoto vista dall'alto: elettrodi al centro, pezzi su supporti rotanti.
// Fasi: 1 strato di base, 2 carico e vuoto, 3 vaporizzazione, 4 trasparente protettivo.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const ANG = [0, 60, 120, 180, 240, 300];

function schema(id) {
  const pezzi = (fill, extra) => ANG.map((a) => { const r = a * Math.PI / 180; return `<rect x="${400 + 130 * Math.cos(r) - 14}" y="${200 + 130 * Math.sin(r) - 20}" width="28" height="40" rx="4" fill="${fill}" class="contorno"${extra}/>`; }).join('');
  return `
<!-- camera a vuoto -->
<circle cx="400" cy="200" r="175" fill="none" stroke="var(--testo)" stroke-width="6"/>
${etichetta({ testo: 'Camera a vuoto (~10⁻³ mbar)', tx: 590, ty: 40 })}
<!-- telaio rotante con i pezzi -->
<g${anim({ rot: [0, 120, 360, 360] }, { rot: 0 }, [400, 200])}>
  <circle cx="400" cy="200" r="130" fill="none" stroke="var(--stampo)" stroke-width="3" stroke-dasharray="6 5"/>
  ${pezzi('#3a2a2a', anim({ op: [1, 1, 0, 0] }, { op: 0 }))}
  ${pezzi('#d9dde2', anim({ op: [0, 0, 1, 0] }, { op: 0 }))}
  ${pezzi('var(--finito)', anim({ op: [0, 0, 0, 1] }, { op: 0 }))}
</g>
${etichetta({ testo: 'Supporti rotanti', tx: 600, ty: 340 })}
<!-- elettrodi con filo di alluminio -->
<rect x="380" y="186" width="40" height="28" class="scuro"/>
<path d="M384,200 q4,-8 8,0 t8,0 t8,0 t8,0" fill="none" stroke="#d9dde2" stroke-width="3"/>
<g${anim({ op: [0, 0, 1, 0], sx: [0, 0, 1, 1], sy: [0, 0, 1, 1] }, { op: 0, sx: 0, sy: 0 }, [400, 200])}>
  <circle cx="400" cy="200" r="110" fill="#ffffff" fill-opacity="0.4" stroke="#d9dde2" stroke-width="2" stroke-dasharray="3 4"/>
</g>
${etichetta({ testo: 'Elettrodi e filo di alluminio al 95%', tx: 20, ty: 200, px: 380, py: 200 })}
<g${anim({ op: [1, 0, 0, 0] })}>${etichetta({ testo: 'vernice di base spruzzata e cotta: superficie liscia e adesione', tx: 20, ty: -10 })}</g>
<g${anim({ op: [0, 1, 0, 0] })}>${etichetta({ testo: 'si fa il vuoto, circa 30 minuti', tx: 20, ty: -10 })}</g>
<g${anim({ op: [0, 0, 1, 0] })}>${etichetta({ testo: 'una scarica vaporizza il metallo, che si condensa sui pezzi', tx: 20, ty: -10 })}</g>
<g${anim({ op: [0, 0, 0, 1] })}>${etichetta({ testo: 'trasparente protettivo, anche colorato, cotto in forno', tx: 20, ty: -10 })}</g>
`;
}

const coppie = {
  superficie: {
    ok: ['Superficie liscia prima del rivestimento', 'Il film metallico è liscio solo quanto il pezzo: gli effetti, anche invecchiati, si fanno prima della metallizzazione.', () => `<rect x="20" y="60" width="120" height="30" class="m-grezzo contorno"/><rect x="20" y="54" width="120" height="6" fill="#d9dde2" stroke="var(--testo)" stroke-width="0.5"/>`],
    ko: ['Difetti del pezzo', 'Il rivestimento sottilissimo copia ogni imperfezione.', () => `<path d="M20,60 q15,-8 30,0 t30,0 t30,0 t30,0 V90 H20 Z" class="m-grezzo contorno"/><path d="M20,56 q15,-8 30,0 t30,0 t30,0 t30,0" fill="none" stroke="#d9dde2" stroke-width="4"/><circle cx="80" cy="56" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  vista: {
    ok: ['Forme aperte, pezzi in rotazione', 'Il metallo arriva in linea retta: i pezzi ruotano per un rivestimento uniforme.', (id) => `<rect x="60" y="40" width="40" height="50" class="m-stampo contorno"/>${C.rotazione({ id, cx: 80, cy: 65, r: 30 })}`],
    ko: ['Sottosquadri profondi', 'Incavi profondi e sottosquadri possono restare senza metallo.', () => `<path d="M30,40 H130 V90 H110 V60 H50 V90 H30 Z" class="m-stampo contorno"/><circle cx="80" cy="76" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  umidita: {
    ok: ['Materiali secchi e stabili', 'Metalli, plastiche rigide e flessibili, resine, compositi, ceramiche e vetro sono adatti.', () => `<rect x="30" y="50" width="100" height="40" fill="#cfe3ea" class="contorno"/><rect x="30" y="44" width="100" height="6" fill="#d9dde2"/>`],
    ko: ['Fibre naturali', 'L\'umidità delle fibre naturali rende molto difficile fare il vuoto.', () => `${[0, 1, 2, 3].map((i) => `<path d="M30,${50 + i * 10} q25,-6 50,0 t50,0" fill="none" stroke="#b8935a" stroke-width="5"/>`).join('')}<circle cx="80" cy="65" r="24" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  colorato: ['Trasparente colorato', 'Il trasparente che protegge il film si può colorare per imitare alluminio anodizzato, cromo, argento, oro, rame o canna di fucile.', () => `
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${24 + i * 36}" y="30" width="30" height="70" rx="4" fill="${['#c8ccd2', '#e0e4ea', '#d4a636', '#c27a4a', '#4a5058'][i]}" class="contorno"/>`).join('')}`],
  funzionale: ['Rivestimenti funzionali', 'Con la vaporizzazione al plasma si costruiscono strati di 10–30 µm per schermature elettromagnetiche, resistenza all\'usura, riflessione della luce o barriera al vapore.', () => `
    <rect x="20" y="70" width="180" height="30" class="m-grezzo contorno"/><rect x="20" y="50" width="180" height="20" fill="#9aa6b2" class="contorno"/>
    ${[40, 80, 120, 160].map((x) => `<path d="M${x},20 l10,8 l-10,8 l10,8" fill="none" stroke="var(--fuso)" stroke-width="2"/>`).join('')}`],
  argon: ['In atmosfera di argon', 'Sostituendo il vuoto con l\'argon il rivestimento è più energico, ma il processo è specialistico e più costoso.', () => `
    <circle cx="110" cy="62" r="50" fill="#c8b8f0" fill-opacity="0.3" stroke="var(--testo)" stroke-width="3"/>
    ${[[90, 40], [130, 50], [100, 80], [125, 85], [80, 62]].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#7a4ae0"/>`).join('')}`],
};

module.exports = { viewBox: '0 -30 820 420', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
