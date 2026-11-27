// Schema animato e mini-diagrammi: Verniciatura a spruzzo (Thompson 2007, pp. 350–355).
// Sezione di una superficie con gli strati di verniciatura e la pistola a gravità.
// Fasi: 1 preparazione e mascheratura, 2 primer, 3 carteggiatura, 4 finitura, 5 essiccazione.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

const strato = (y, h, col, valori, op = '') => `<rect x="160" y="${y}" width="420" height="${h}" style="fill:${col}"${anim({ sy: valori }, { sy: 0 }, [160, y + h])}${op}/>`;

function schema(id) {
  return `
<!-- supporto -->
<rect x="160" y="250" width="420" height="50" fill="url(#${id}-tratteggio)" class="contorno"/>
${etichetta({ testo: 'Supporto', tx: 600, ty: 290 })}
<!-- stucco, primer, finitura -->
${strato(244, 6, '#d8d2c4', [1, 1, 1, 1, 1])}
${strato(230, 14, '#b8bec6', [0, 1, 0.75, 0.75, 0.75])}
${strato(206, 14, 'var(--finito)', [0, 0, 0, 1, 1])}
<rect x="160" y="203" width="80" height="36" style="fill:var(--flusso)" fill-opacity="0.7"${anim({ op: [1, 1, 1, 1, 0] }, { op: 0 })}/>
${etichetta({ testo: 'Mascheratura', tx: 20, ty: 200, px: 170, py: 210 })}
${etichetta({ testo: 'Strati di 5–100 µm', tx: 600, ty: 220 })}
<!-- pistola a gravità con nuvola -->
<g${anim({ op: [0, 1, 0, 1, 0], tx: [0, 160, 0, 160, 0] }, { op: 0, tx: 0 })}>
  <path d="M300,40 h40 v30 h-40 Z" class="m-stampo contorno"/>
  <path d="M290,70 H350 V100 H290 Z" class="m-stampo contorno"/><rect x="300" y="100" width="14" height="40" class="scuro"/>
  <path d="M320,104 L270,190 H370 Z" style="fill:var(--fuso)" fill-opacity="0.3"/>
  <circle cx="320" cy="56" r="0" />
</g>
<g${anim({ op: [0, 1, 0, 1, 0] })}>${etichetta({ testo: 'Pistola: aria compressa (~3,45 bar) nebulizza la vernice in passate sovrapposte del 50%', tx: 20, ty: 30 })}</g>
<!-- carteggiatura -->
<g${anim({ op: [0, 0, 1, 0, 0], vx: [0, 0, 60, 0, 0] }, { op: 0, vx: 0 })}><rect x="360" y="200" width="70" height="28" class="m-grezzo contorno"/></g>
<g${anim({ op: [0, 0, 1, 0, 0] })}>${etichetta({ testo: 'si carteggia il primer: la finitura mostra ogni difetto', tx: 20, ty: 30 })}</g>
<g${anim({ op: [1, 0, 0, 0, 0] })}>${etichetta({ testo: 'giunti stuccati e levigati, zone protette con nastro', tx: 20, ty: 30 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${etichetta({ testo: 'si toglie la mascheratura; asciugatura e indurimento (almeno 12 ore)', tx: 20, ty: 30 })}</g>
<g${anim({ op: [0, 1, 0, 1, 0] })}>${freccia({ id, x1: 220, y1: 160, x2: 470, y2: 160 })}</g>
`;
}

const coppie = {
  vista: {
    ok: ['Superfici in vista diretta', 'Lo spruzzo arriva in linea retta: superfici aperte si coprono in modo uniforme.', (id) => `<path d="M20,90 H140" stroke="var(--finito)" stroke-width="6"/>${C.freccia({ id, x1: 80, y1: 20, x2: 80, y2: 80 })}`],
    ko: ['Sottosquadri e incavi profondi', 'Incavi profondi e sottosquadri si verniciano a fatica; resta sempre dell\'overspray.', (id) => `<path d="M20,40 H60 V100 H100 V40 H140" fill="none" stroke="var(--testo)" stroke-width="4"/><path d="M60,96 H100" stroke="var(--finito)" stroke-width="2" stroke-dasharray="3 3"/>${C.freccia({ id, x1: 30, y1: 14, x2: 70, y2: 60 })}<circle cx="80" cy="92" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  preparazione: {
    ok: ['Superficie preparata', 'Una superficie stuccata, carteggiata e con primer adatto: la finitura lucida e intensa nasce da qui.', () => `<rect x="20" y="70" width="120" height="20" class="m-stampo contorno"/><rect x="20" y="62" width="120" height="8" fill="#b8bec6"/><rect x="20" y="54" width="120" height="8" style="fill:var(--finito)"/>`],
    ko: ['Difetti sotto la finitura', 'La mano finale mette in risalto ogni imperfezione; porosità e forellini fanno sfogliare la vernice e corrodere il pezzo.', () => `<path d="M20,70 q10,-6 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 V90 H20 Z" class="m-stampo contorno"/><path d="M20,62 q10,-6 20,0 t20,0 t20,0 t20,0 t20,0 t20,0" fill="none" style="stroke:var(--finito)" stroke-width="6"/><circle cx="80" cy="62" r="18" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  strati: {
    ok: ['Strati sottili e regolari', 'Mani sottili sovrapposte, con il giusto diluente, si distendono senza difetti.', () => `${[0, 1, 2].map((i) => `<rect x="20" y="${60 - i * 6}" width="120" height="6" style="fill:var(--finito)" opacity="${0.6 + i * 0.2}"/>`).join('')}<rect x="20" y="66" width="120" height="20" class="m-stampo contorno"/>`],
    ko: ['Buccia d\'arancia, colature, granulosità', 'Troppo materiale bagnato cola; troppo secco resta granuloso; un cattivo scorrimento dà la buccia d\'arancia.', () => `<rect x="20" y="66" width="120" height="20" class="m-stampo contorno"/><path d="M20,60 q10,-6 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 V66 H20 Z" style="fill:var(--finito)"/><path d="M90,66 q4,14 0,22" stroke="var(--finito)" stroke-width="6" fill="none"/><circle cx="92" cy="78" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  scaglie: ['Base e trasparente con scaglie', 'Una base uniforme fa da fondo; sopra, un trasparente con scaglie di colore, metalliche, perlescenti, dicroiche o termocromiche dà un colore profondo e lucido.', () => `
    <rect x="20" y="80" width="180" height="20" class="m-stampo contorno"/><rect x="20" y="66" width="180" height="14" fill="#3a2a6a"/>
    <rect x="20" y="40" width="180" height="26" fill="#c8b8f0" fill-opacity="0.4" stroke="var(--testo)" stroke-width="0.5"/>
    ${[30, 55, 80, 105, 130, 155, 180].map((x, i) => `<rect x="${x}" y="${46 + (i % 3) * 6}" width="10" height="3" fill="#7a4ae0" transform="rotate(${i * 20} ${x} 50)"/>`).join('')}`],
  smalto: ['Smalto vetroso', 'Uno strato di vetro fuso sul pezzo ad alta temperatura: solo per materiali ad alto punto di fusione, come metalli e ceramiche.', () => `
    <rect x="20" y="70" width="180" height="30" class="m-stampo contorno"/><rect x="20" y="58" width="180" height="12" fill="#5b8fd1" fill-opacity="0.8"/>
    ${[50, 110, 170].map((x) => `<path d="M${x},40 q4,-8 0,-14" fill="none" stroke="var(--fuso)" stroke-width="2"/>`).join('')}`],
  effetti: ['Effetti decorativi', 'Sfumature e marmorizzati spruzzando o trascinando materiali sulla mano fresca; craquelé con una vernice che si crepa sopra un colore contrastante; floccato spruzzando fibre su un adesivo; maschere e sagome per motivi e scritte.', () => `
    <rect x="20" y="30" width="180" height="70" fill="#1d232b"/>
    ${[0, 1, 2, 3, 4].map((i) => `<path d="M${30 + i * 36},30 l8,20 l-6,14 l10,18 l-4,18" fill="none" stroke="#d4a636" stroke-width="2"/>`).join('')}`],
};

module.exports = { viewBox: '0 10 820 320', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
