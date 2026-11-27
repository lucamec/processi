// Schema animato e mini-diagrammi: Avvolgimento di filamenti (Thompson 2007, pp. 222–227).
// Vista dall'alto del mandrino (caso studio dell'albero di trasmissione).
// Fasi: 1 aggancio della fibra impregnata, 2 strati elicoidali, 3 strati circonferenziali, 4 nastratura,
// 5 polimerizzazione ed estrazione del mandrino.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

const zig = (x0, y0, y1) => { let d = `M${x0},${y0}`, y = y0; for (let x = x0 + 70; x <= 630; x += 70) { y = y === y0 ? y1 : y0; d += ` L${x},${y}`; } return d; };
const ELICA = `${zig(210, 250, 150)} ${zig(210, 150, 250)}`;
const ANELLI = Array.from({ length: 51 }, (_, i) => `M${210 + i * 8},150 V250`).join(' ');
const steso = (d, stile, w, valori, extra = '') => `<path d="${d}" pathLength="100" stroke-dasharray="100 100" fill="none" stroke-width="${w}" style="${stile}"${extra}${anim({ dash: valori }, { dash: 100 })}/>`;

function schema(id) {
  return `
<line x1="90" y1="200" x2="740" y2="200" class="asse"/>
<!-- testa motrice e contropunta -->
<rect x="90" y="140" width="60" height="120" class="macchina"/>
${C.rotazione({ id, cx: 120, cy: 200, r: 18 })}
<g${anim({ op: [1, 1, 1, 1, 0] }, { op: 1 })}><rect x="670" y="170" width="70" height="60" class="macchina"/></g>
${etichetta({ testo: 'Testa motrice', tx: 60, ty: 128 })}

<!-- mandrino con estremità coniche -->
<g${anim({ tx: [0, 0, 0, 0, 480] }, { tx: 0 })}>
  <rect x="150" y="190" width="40" height="20" class="m-stampo contorno"/><rect x="640" y="190" width="30" height="20" class="m-stampo contorno"/>
  <path d="M180,174 L200,150 H620 L640,174 V226 L620,250 H200 L180,226 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
</g>
${etichetta({ testo: 'Mandrino rimovibile', tx: 640, ty: 290, px: 610, py: 250 })}

<!-- fibra: elica, anelli, nastro -->
<g${anim({ op: [1, 1, 1, 1, 0] }, { op: 1 })}>
  ${steso(ELICA, 'stroke:var(--fuso)', 4, [100, 0, 0, 0, 0])}
  ${steso(ANELLI, 'stroke:var(--fuso)', 3, [100, 100, 0, 0, 0])}
  ${steso('M206,200 H614', 'stroke:#ffffff;opacity:0.55', 100, [100, 100, 100, 0, 0])}
</g>
<g${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}>
  <path d="M202,150 H618 V250 H202 Z" class="m-finito sezionato contorno"/>
  ${etichetta({ testo: 'tubo in carbonio, il mandrino si sfila', tx: 300, ty: 290 })}
</g>

<!-- carrello: testa guidafilo, ruota nel bagno di resina, bobina -->
<g${anim({ tx: [0, 400, 0, 400, 400] }, { tx: 0 })}>
  <line x1="210" y1="250" x2="210" y2="296" stroke="var(--fuso)" stroke-width="3"${anim({ op: [1, 1, 1, 0, 0] }, { op: 1 })}/>
  <rect x="196" y="292" width="28" height="22" class="scuro"/>
  <rect x="186" y="318" width="48" height="20" style="fill:var(--fuso)" opacity="0.35" stroke="var(--testo)"/>
  <circle cx="210" cy="324" r="10" class="m-stampo contorno"/>
  <circle cx="250" cy="330" r="12" class="m-grezzo contorno"/>
</g>
${etichetta({ testo: 'Testa guidafilo, bagno di resina e bobina sul carrello', tx: 40, ty: 360 })}
<g${anim({ op: [0, 1, 0, 0, 0] })}>${etichetta({ testo: 'strati elicoidali: resistenza a torsione e lungo l\'asse', tx: 250, ty: 110 })}</g>
<g${anim({ op: [0, 0, 1, 0, 0] })}>${etichetta({ testo: 'strati circonferenziali (circa 90°)', tx: 250, ty: 110 })}</g>
<g${anim({ op: [0, 0, 0, 1, 0] })}>${etichetta({ testo: 'nastro di plastica che spreme la resina in eccesso', tx: 250, ty: 110 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${etichetta({ testo: 'forno fino a 200 °C per 4 ore', tx: 250, ty: 110 })}</g>
`;
}

const ln = (d, col = 'finito', w = 5) => `<path d="${d}" fill="none" stroke-width="${w}" stroke-linejoin="round" style="stroke:var(--${col})"/>`;
const coppie = {
  raggio: {
    ok: ['Spigoli esterni con raggio ≥ 20 mm', 'Sotto i 20 mm di raggio sugli spigoli esterni le prestazioni peggiorano; gli spigoli interni non hanno limite.', () => `<rect x="30" y="20" width="100" height="90" rx="22" fill="none" stroke="var(--finito)" stroke-width="6"/>${C.etichetta({ testo: 'R ≥ 20 mm', tx: 80, ty: 70, ancora: 'middle' })}`],
    ko: ['Spigoli esterni vivi', 'La fibra tesa su uno spigolo vivo perde resistenza.', () => `<rect x="30" y="20" width="100" height="90" rx="3" fill="none" stroke="var(--finito)" stroke-width="6"/><circle cx="130" cy="20" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  estremita: {
    ok: ['Estremità del mandrino coniche', 'Con angoli bassi le estremità rastremate permettono di tirare la fibra senza che scivoli lungo il mandrino.', () => `<path d="M20,46 L40,30 H120 L140,46 V84 L120,100 H40 L20,84 Z" class="m-stampo contorno"/>${ln('M40,100 L70,30 L100,100 L120,40', 'fuso', 3)}`],
    ko: ['Estremità diritte con angoli bassi', 'Senza rastremazione la fibra stesa a basso angolo scivola sui bordi.', () => `<rect x="30" y="30" width="100" height="70" class="m-stampo contorno"/>${ln('M30,90 L80,40 L130,90', 'fuso', 3)}<circle cx="130" cy="90" r="11" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  angolo: {
    ok: ['Angolo della fibra progettato', 'L\'angolo, regolabile da quasi 0° a 90°, decide se lo strato resiste lungo l\'asse, a torsione o in senso circonferenziale: si calcola con l\'analisi agli elementi finiti.', () => `<rect x="20" y="40" width="120" height="50" class="m-grezzo contorno"/>${ln('M20,90 L45,40 L70,90 L95,40 L120,90 L140,50', 'finito', 3)}${[30, 50, 70, 90, 110, 130].map((x) => `<line x1="${x}" y1="40" x2="${x}" y2="90" stroke="var(--finito)" stroke-width="2"/>`).join('')}`],
    ko: ['Pezzo usato per un altro scopo', 'Le proprietà sono studiate per un\'applicazione: un pezzo non si può scambiare con uno progettato per carichi diversi.', () => `<rect x="20" y="40" width="120" height="50" class="m-grezzo contorno"/>${[30, 50, 70, 90, 110, 130].map((x) => `<line x1="${x}" y1="40" x2="${x}" y2="90" stroke="var(--finito)" stroke-width="2"/>`).join('')}<path d="M10,65 H20 M140,65 H150" stroke="var(--ko)" stroke-width="3"/><circle cx="80" cy="65" r="30" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  umido: ['Avvolgimento a umido', 'Il fascio di fibre passa in un bagno di resina epossidica prima di arrivare al mandrino.', () => `
    <rect x="20" y="70" width="80" height="34" style="fill:var(--fuso)" opacity="0.35" stroke="var(--testo)"/>
    <circle cx="60" cy="72" r="16" class="m-stampo contorno"/>
    ${ln('M10,40 Q60,50 60,56 Q70,40 200,30', 'fuso', 3)}
    <rect x="150" y="14" width="60" height="40" class="m-stampo contorno"/>`],
  preimpregnato: ['Avvolgimento di pre-impregnato', 'Il fascio di carbonio è già impregnato di resina e si avvolge direttamente sul mandrino, senza altra preparazione.', () => `
    <circle cx="50" cy="62" r="34" class="m-grezzo contorno"/><circle cx="50" cy="62" r="10" class="m-stampo contorno"/>
    ${ln('M84,62 H150', 'fuso', 4)}
    <rect x="150" y="34" width="60" height="56" class="m-stampo contorno"/>`],
  liner: ['Avvolgimento su liner', 'La fibra si avvolge su un liner cavo che resta nel pezzo: si ottengono recipienti chiusi, come i serbatoi in pressione, a tenuta di acqua, aria e gas.', (id) => `
    <path d="M40,40 Q40,20 70,20 H150 Q180,20 180,40 V80 Q180,104 150,104 H70 Q40,104 40,80 Z" fill="none" stroke="var(--fuso)" stroke-width="6"/>
    <path d="M48,44 Q48,28 72,28 H148 Q172,28 172,44 V78 Q172,96 148,96 H72 Q48,96 48,78 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    <rect x="180" y="52" width="24" height="20" class="m-stampo contorno"/>`],
};

module.exports = { viewBox: '0 80 820 300', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
