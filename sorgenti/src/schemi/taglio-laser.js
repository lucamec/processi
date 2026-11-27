// Schema animato e mini-diagrammi: Taglio laser (Thompson 2007, pp. 248–253).
// Sezione di un foglio sul piano aspirato, con la testa di taglio. Sequenza del caso studio del modello
// architettonico: 1 carico, 2 messa a fuoco, 3 incisione di linee, 4 tagli interni, 5 profilo esterno.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const FONDO = '#eef1f4';

function schema(id) {
  return `
<!-- piano aspirato -->
<rect x="130" y="246" width="560" height="14" class="macchina"/>
${Array.from({ length: 14 }, (_, i) => `<rect x="${140 + i * 39}" y="238" width="6" height="8" class="scuro"/>`).join('')}
${etichetta({ testo: 'Piano aspirato', tx: 700, ty: 258 })}

<!-- foglio: sfondo, parte che si stacca -->
<g${anim({ ty: [0, 0, 0, 0, 0] }, { ty: -60 })}><rect x="140" y="222" width="540" height="16" class="m-grezzo contorno"/></g>
<rect x="268" y="222" width="10" height="5" fill="${FONDO}"${anim({ op: [0, 0, 1, 1, 1] }, { op: 0 })}/>
<rect x="392" y="222" width="6" height="16" fill="${FONDO}"${anim({ op: [0, 0, 0, 1, 1] }, { op: 0 })}/>
<g${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}><rect x="216" y="222" width="6" height="16" fill="${FONDO}"/><rect x="560" y="222" width="6" height="16" fill="${FONDO}"/></g>
<g${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}>${etichetta({ testo: 'tagli perpendicolari, bordo lucido, solco stretto', tx: 300, ty: 290 })}</g>
${etichetta({ testo: 'Foglio (0,2–40 mm)', tx: 20, ty: 214, px: 150, py: 226 })}

<!-- testa: specchio, lente, ugello con gas di assistenza -->
<rect x="40" y="40" width="80" height="34" class="macchina"/>
${etichetta({ testo: 'Sorgente laser', tx: 30, ty: 30 })}
<g${anim({ tx: [0, 0, 0, 120, 290] }, { tx: 0 })}>
  <line x1="120" y1="57" x2="262" y2="57" stroke="var(--fuso)" stroke-width="3"${anim({ op: [0, 1, 1, 1, 1] }, { op: 0 })}/>
  <rect x="256" y="44" width="28" height="26" class="m-stampo contorno" transform="rotate(45 270 57)"/>
  <g${anim({ ty: [0, 40, 40, 40, 40] }, { ty: 0 })}>
    <path d="M250,90 H290 V140 L278,170 H262 L250,140 Z" class="m-stampo contorno"/>
    <ellipse cx="270" cy="112" rx="18" ry="5" style="fill:var(--flusso)" opacity="0.6"/>
    <path d="M262,57 V112 L270,180 L278,112 V57" style="fill:var(--fuso)" fill-opacity="0.55"${anim({ op: [0, 1, 1, 1, 1] }, { op: 0 })}/>
  </g>
</g>
${etichetta({ testo: 'Specchio, lente e ugello con gas di assistenza', tx: 400, ty: 26 })}

<g${anim({ op: [0, 1, 0, 0, 0] })}>${freccia({ id, x1: 310, y1: 110, x2: 310, y2: 150 })}${etichetta({ testo: 'la lente si alza o abbassa per mettere a fuoco sulla superficie', tx: 330, ty: 140 })}</g>
<g${anim({ op: [0, 0, 1, 0, 0] })}>${etichetta({ testo: 'prima passata, potenza bassa: linee incise in superficie', tx: 330, ty: 140 })}</g>
<g${anim({ op: [0, 0, 0, 1, 0] })}>${etichetta({ testo: 'poi i profili interni, a tutto spessore', tx: 440, ty: 140 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${etichetta({ testo: 'per ultimo il profilo esterno', tx: 600, ty: 140 })}</g>
`;
}

const ln = (d, col = 'finito', w = 4) => `<path d="${d}" fill="none" stroke-width="${w}" stroke-linejoin="round" style="stroke:var(--${col})"/>`;
const coppie = {
  linee: {
    ok: ['Linee unite in un percorso continuo', 'Il laser segue le linee da punto a punto: i tratti vanno uniti in polilinee, così il taglio procede senza interruzioni.', () => ln('M20,90 L40,30 H120 L140,90 Z')],
    ko: ['Linee spezzate o duplicate', 'Una linea doppia viene trattata come un altro taglio e allunga il lavoro; i tratti staccati interrompono il percorso.', () => `${ln('M20,90 L40,30 H120')}${ln('M124,34 L140,90 H24')}<path d="M44,34 H116" fill="none" stroke="var(--ko)" stroke-width="2" stroke-dasharray="4 3" transform="translate(0,-6)"/><circle cx="122" cy="32" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  profondita: {
    ok: ['Incisione meno profonda che larga', 'Le incisioni raster arrivano a circa 40 µm; un canale profondo resta pulito finché la profondità non supera la larghezza.', () => `<rect x="20" y="50" width="120" height="40" class="m-grezzo contorno"/><rect x="60" y="50" width="40" height="14" fill="${FONDO}"/>`],
    ko: ['Canale più profondo che largo', 'Il materiale non riesce a uscire e il bordo del taglio viene di cattiva qualità.', () => `<rect x="20" y="40" width="120" height="60" class="m-grezzo contorno"/><rect x="72" y="40" width="16" height="48" fill="${FONDO}"/><circle cx="80" cy="80" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  riflessione: {
    ok: ['Acciaio e materiali poco riflettenti', 'Gli acciai si tagliano meglio di alluminio e rame, che riflettono luce ed energia termica.', (id) => `<rect x="20" y="70" width="120" height="16" class="m-stampo contorno"/>${C.freccia({ id, x1: 80, y1: 10, x2: 80, y2: 66 })}`],
    ko: ['Leghe molto riflettenti', 'Alluminio e rame richiedono laser potenti (1–2 kW) e l\'alluminio lascia una zona termicamente alterata più ampia.', (id) => `<rect x="20" y="70" width="120" height="16" class="m-stampo contorno"/>${C.freccia({ id, x1: 70, y1: 10, x2: 80, y2: 64 })}<path d="M80,66 L120,14" fill="none" stroke="var(--ko)" stroke-width="2.5" stroke-dasharray="5 3"/>`],
  },
};

const varianti = {
  co2: ['Laser CO₂', 'Lunghezza d\'onda infrarossa di 10 µm; con 150 W è adatto alle plastiche, che lascia con il bordo lucido. Il fascio arriva all\'ugello con specchi fissi.', (id) => `
    <rect x="20" y="20" width="60" height="26" class="macchina"/><line x1="80" y1="33" x2="150" y2="33" stroke="var(--fuso)" stroke-width="3"/>
    <rect x="144" y="22" width="20" height="20" class="m-stampo contorno" transform="rotate(45 154 32)"/>
    <line x1="154" y1="42" x2="154" y2="96" stroke="var(--fuso)" stroke-width="3"/><rect x="40" y="98" width="160" height="10" class="m-grezzo contorno"/>`],
  ndyag: ['Laser Nd:YAG', 'Lunghezza d\'onda di 1 µm, più versatile: il fascio può viaggiare in fibra ottica flessibile, così la testa ruota e taglia su 5 assi.', () => `
    <path d="M20,30 Q90,10 120,60 Q140,90 150,70" fill="none" stroke="var(--fuso)" stroke-width="4"/>
    <rect x="140" y="52" width="24" height="30" class="m-stampo contorno" transform="rotate(-30 152 67)"/>
    <path d="M40,110 Q110,60 200,110" fill="none" stroke="var(--grezzo)" stroke-width="10"/>`],
  raster: ['Incisione raster', 'Con una piccola parte della potenza il laser incide loghi, immagini e testi, fino a circa 40 µm; per esempio scopre l\'alluminio sotto l\'anodizzazione.', () => `
    <rect x="20" y="40" width="180" height="50" class="m-finito contorno"/>
    ${Array.from({ length: 6 }, (_, i) => `<line x1="60" y1="${50 + i * 6}" x2="${120 + (i % 3) * 20}" y2="${50 + i * 6}" stroke="#d9dde2" stroke-width="3"/>`).join('')}`],
};

module.exports = { viewBox: '0 10 820 300', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
