// Schema animato e mini-diagrammi: Laminazione dei compositi (Thompson 2007, pp. 206–217).
// Schema principale: laminazione a umido su stampo femmina a una faccia (caso studio della sedia Ribbon).
// Fasi: 1 distaccante, 2 gel coat, 3 stratificazione con rullo, 4 polimerizzazione, 5 sformatura e rifinitura.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

const curva = (dy, dyc) => `M200,${110 - dy} Q410,${310 - dyc} 620,${110 - dy}`;
// tracciato che si "disegna" da sinistra a destra: pathLength 100 e dashoffset 100 → 0
const steso = (d, stile, w, valori) => `<path d="${d}" pathLength="100" stroke-dasharray="100 100" fill="none" stroke-width="${w}" style="${stile}"${anim({ dash: valori }, { dash: 100 })}/>`;

function schema(id) {
  return `
<!-- stampo a una faccia: pelle in composito su telaio rigido -->
<path d="M150,110 H200 Q410,310 620,110 H670 V126 H630 Q410,346 190,126 H150 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
<rect x="170" y="126" width="14" height="190" class="macchina"/><rect x="636" y="126" width="14" height="190" class="macchina"/>
<rect x="300" y="240" width="14" height="76" class="macchina"/><rect x="506" y="240" width="14" height="76" class="macchina"/>
<rect x="150" y="316" width="520" height="12" class="macchina"/>
${etichetta({ testo: 'Stampo: pelle di 6–8 mm su telaio rigido', tx: 40, ty: 350 })}

<!-- 1: distaccante -->
${steso(curva(2, 4), 'stroke:var(--flusso)', 3, [0, 0, 0, 0, 0])}
<g${anim({ op: [1, 0, 0, 0, 0] })}>${etichetta({ testo: 'Distaccante a cera steso con un panno', tx: 470, ty: 300 })}</g>

<!-- 2: gel coat -->
<g${anim({ op: [1, 1, 1, 1, 0] }, { op: 1 })}>${steso(curva(5, 10), 'stroke:#e8e2d6', 5, [100, 0, 0, 0, 0])}
<g${anim({ op: [0, 1, 0, 0, 0] })}>${etichetta({ testo: 'Gel coat spruzzato o a pennello', tx: 470, ty: 300 })}</g>

<!-- 3: strati di fibra impregnati di resina -->
${[0, 1, 2].map((i) => steso(curva(10 + 6 * i, 20 + 12 * i), 'stroke:var(--fuso)', 6, [100, 100, 0, 0, 0])).join('')}</g>
<g${anim({ ty: [0, 0, 0, 0, -70] }, { ty: 0 })}>
  <g${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}>${[0, 1, 2].map((i) => `<path d="${curva(10 + 6 * i, 20 + 12 * i)}" fill="none" stroke-width="6" style="stroke:var(--finito)"/>`).join('')}
  <path d="${curva(5, 10)}" fill="none" stroke-width="5" style="stroke:var(--finito)"/></g>
</g>
<g${anim({ op: [0, 0, 1, 0, 0], tx: [0, 0, 220, 0, 0] }, { tx: -200, op: 0 })}>
  <circle cx="400" cy="152" r="12" class="m-stampo contorno"/><line x1="400" y1="152" x2="440" y2="90" stroke="var(--testo)" stroke-width="5"/>
</g>
<g${anim({ op: [0, 0, 1, 0, 0] })}>${etichetta({ testo: 'Fogli di fibra e resina; il rullo toglie l\'aria', tx: 470, ty: 300 })}</g>
<!-- 4: polimerizzazione -->
<g${anim({ op: [0, 0, 0, 1, 0] })}>${etichetta({ testo: 'La resina termoindurente polimerizza (circa 45 minuti nel caso studio)', tx: 250, ty: 40 })}</g>
<!-- 5: sformatura -->
<g${anim({ op: [0, 0, 0, 0, 1] })}>${freccia({ id, x1: 410, y1: 100, x2: 410, y2: 50 })}${etichetta({ testo: 'il pezzo si stacca, si rifila e si lucida', tx: 470, ty: 300 })}</g>
`;
}

const ln = (d, col = 'finito', w = 6) => `<path d="${d}" fill="none" stroke-width="${w}" stroke-linejoin="round" style="stroke:var(--${col})"/>`;
const strati = (n, sfalsa) => Array.from({ length: n }, (_, i) => { const x = sfalsa ? 60 + i * 14 : 80; return `<line x1="15" y1="${50 + i * 10}" x2="${x - 3}" y2="${50 + i * 10}" stroke="var(--fuso)" stroke-width="7"/><line x1="${x + 3}" y1="${50 + i * 10}" x2="145" y2="${50 + i * 10}" stroke="var(--fuso)" stroke-width="7"/>`; }).join('');
const coppie = {
  spessore: {
    ok: ['Parete fra 0,25 e 10 mm', 'Nella laminazione a umido lo spessore resta in questo intervallo: oltre, il calore della reazione diventa pericoloso.', () => `${ln('M15,70 H145', 'finito', 10)}${C.etichetta({ testo: '0,25–10 mm', tx: 80, ty: 100, ancora: 'middle' })}`],
    ko: ['Parete troppo spessa', 'Uno strato massiccio di resina sviluppa una reazione esotermica eccessiva.', () => `${ln('M15,66 H145', 'finito', 40)}<circle cx="80" cy="66" r="24" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  giunti: {
    ok: ['Giunti sfalsati', 'Ogni strato si sovrappone in un punto diverso: si forma un giunto a sovrapposizione sfalsato, più resistente.', () => strati(4, true)],
    ko: ['Giunti allineati', 'Interruzioni sovrapposte nello stesso punto creano una debolezza.', () => `${strati(4, false)}<circle cx="80" cy="65" r="22" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  anima: {
    ok: ['Anima leggera fra le pelli', 'Un\'anima a nido d\'ape o in schiuma aumenta rigidezza a flessione e torsione, e permette variazioni di spessore.', () => `${ln('M15,40 H145', 'finito', 6)}${ln('M15,96 H145', 'finito', 6)}${[0, 1, 2, 3, 4, 5].map((i) => `<path d="M${20 + i * 21},44 l10,12 v24 l-10,12 M${30 + i * 21},56 h11" fill="none" stroke="var(--testo)" stroke-width="1.5"/>`).join('')}`],
    ko: ['Laminato sottile senza anima', 'Una pelle sottile da sola si flette facilmente.', () => `${ln('M15,60 Q80,90 145,60', 'finito', 6)}<circle cx="80" cy="76" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  fibre: {
    ok: ['Fibre orientate secondo i carichi', 'La direzione della trama determina le proprietà meccaniche; per i pezzi ad alte prestazioni si calcola con l\'analisi agli elementi finiti.', () => `<rect x="20" y="30" width="120" height="70" class="m-grezzo contorno"/>${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="20" y1="${36 + i * 12}" x2="140" y2="${36 + i * 12}" stroke="var(--finito)" stroke-width="3"/>`).join('')}`],
    ko: ['Fibre disallineate', 'Anche una piccola rotazione della trama riduce sensibilmente la resistenza.', () => `<rect x="20" y="30" width="120" height="70" class="m-grezzo contorno"/>${[0, 1, 2, 3, 4, 5].map((i) => `<line x1="20" y1="${30 + i * 12}" x2="140" y2="${46 + i * 12}" stroke="var(--finito)" stroke-width="3"/>`).join('')}<circle cx="128" cy="48" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  umido: ['Laminazione a umido', 'Su stampo a una faccia, dopo il gel coat, i tessuti di fibra si impregnano di resina a pennello o a spruzzo e si rullano per eliminare la porosità. È la meno precisa.', (id) => `
    <path d="M20,40 Q110,120 200,40 V60 Q110,140 20,60 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${ln('M24,34 Q110,110 196,34', 'fuso', 6)}
    <circle cx="110" cy="62" r="10" class="m-stampo contorno"/>`],
  preimpregnato: ['Pre-impregnato (pre-preg)', 'Tessuti già impregnati con una quantità precisa di resina, coperti da film permeabile, membrana traspirante e film ermetico; si fa il vuoto e si cura in autoclave a 4,1 bar e 120 °C per 2 ore.', (id) => `
    <path d="M20,50 Q110,120 200,50 V70 Q110,140 20,70 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${ln('M24,44 Q110,110 196,44', 'fuso', 5)}
    <path d="M14,40 Q110,112 206,40" fill="none" stroke="var(--flusso)" stroke-width="2.5" stroke-dasharray="5 3"/>
    ${C.freccia({ id, x1: 110, y1: 4, x2: 110, y2: 30 })}`],
  rtm: ['Stampaggio per trasferimento di resina (RTM)', 'Stampi accoppiati, di solito metallici e preriscaldati: le fibre si dispongono nello stampo aperto, poi si chiude e si inietta la resina, o la si aspira col vuoto (infusione). Finitura su entrambi i lati.', (id) => `
    <rect x="30" y="10" width="160" height="40" fill="url(#${id}-tratteggio)" class="contorno"/>
    <rect x="30" y="64" width="160" height="40" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${ln('M30,57 H190', 'fuso', 8)}
    ${C.freccia({ id, x1: 10, y1: 57, x2: 30, y2: 57 })}`],
};

module.exports = { viewBox: '0 0 820 370', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
