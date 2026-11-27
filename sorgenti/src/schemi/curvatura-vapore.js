// Schema animato e mini-diagrammi: Curvatura a vapore (Thompson 2007, pp. 198–201).
// Curvatura manuale su sagoma fissa con nastro di tensione, vista di lato.
// Fasi: 1 ammollo e vaporizzazione, 2 carico sulla sagoma, 3 curvatura, 4 essiccazione, 5 sformatura.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

// sagoma semicircolare, centro (410,230), raggio 120; pezzo spesso 14 (asse a r = 127)
const PIATTO = 'M178,103 H642';
const CURVO = 'M283,260 V230 A127,127 0 0 1 537,230 V260';
const NASTRO_P = 'M172,92 H648';
const NASTRO_C = 'M272,268 V230 A138,138 0 0 1 548,230 V268';
const pz = (d, col, extra = '') => `<path d="${d}" fill="none" stroke-width="14" style="stroke:var(--${col})"${extra}/>`;

function schema(id) {
  return `
<!-- sagoma fissa -->
<path d="M290,230 A120,120 0 0 1 530,230 V300 H290 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
<rect x="250" y="300" width="320" height="14" class="macchina"/>
${etichetta({ testo: 'Sagoma fissa (dima)', tx: 600, ty: 300 })}

<!-- 1: ammollo e vapore -->
<g${anim({ op: [1, 0, 0, 0, 0] }, { op: 1 })}>
  <rect x="160" y="70" width="500" height="66" rx="10" fill="none" stroke="var(--flusso)" stroke-width="3"/>
  ${[220, 320, 420, 520, 600].map((x) => `<path d="M${x},128 q8,-8 0,-16 q-8,-8 0,-16" fill="none" stroke="var(--flusso)" stroke-width="2.5"/>`).join('')}
  ${etichetta({ testo: 'Vapore a 104 °C e 0,6 bar, 1–3 ore', tx: 170, ty: 56 })}
</g>

<!-- pezzo di massello -->
${pz(PIATTO, 'grezzo', anim({ op: [0, 0, 0, 0, 0] }, { op: 1 }))}
${pz(PIATTO, 'fuso', anim({ op: [1, 1, 0, 0, 0] }, { op: 0 }))}
<g${anim({ ty: [0, 0, 0, 0, -50] }, { ty: 0 })}>
  ${pz(CURVO, 'fuso', anim({ op: [0, 0, 1, 0, 0] }, { op: 0 }))}
  ${pz(CURVO, 'finito', anim({ op: [0, 0, 0, 1, 1] }, { op: 0 }))}
</g>
${etichetta({ testo: 'Pezzo di massello già profilato', tx: 40, ty: 170, px: 200, py: 108, extra: anim({ op: [1, 1, 0, 0, 0] }, { op: 1 }) })}

<!-- nastro di tensione con fermi alle estremità -->
<g${anim({ op: [0, 1, 0, 0, 0] }, { op: 0 })}>
  <path d="${NASTRO_P}" fill="none" stroke-width="4" style="stroke:var(--testo)"/>
  <rect x="164" y="88" width="10" height="24" class="scuro"/><rect x="646" y="88" width="10" height="24" class="scuro"/>
</g>
<g${anim({ op: [0, 0, 1, 1, 0] }, { op: 0 })}>
  <path d="${NASTRO_C}" fill="none" stroke-width="4" style="stroke:var(--testo)"/>
  <rect x="268" y="264" width="24" height="10" class="scuro"/><rect x="528" y="264" width="24" height="10" class="scuro"/>
</g>
<g${anim({ op: [0, 1, 1, 0, 0] }, { op: 0 })}>${etichetta({ testo: 'Nastro di tensione: il lato esterno non si allunga', tx: 470, ty: 56 })}</g>
<!-- morsetto centrale -->
<g${anim({ op: [0, 1, 1, 1, 0] }, { op: 0 })}><rect x="396" y="66" width="28" height="22" class="scuro"/></g>

<!-- 3: curvatura -->
<g${anim({ op: [0, 0, 1, 0, 0] })}>
  ${freccia({ id, x1: 200, y1: 150, x2: 250, y2: 230 })}${freccia({ id, x1: 620, y1: 150, x2: 570, y2: 230 })}
  ${etichetta({ testo: 'due operatori piegano il pezzo sulla sagoma', tx: 40, ty: 340 })}
</g>
<!-- 4: essiccazione -->
<g${anim({ op: [0, 0, 0, 1, 0] })}>
  <rect x="230" y="40" width="360" height="290" rx="8" fill="none" stroke="var(--fuso)" stroke-width="3" stroke-dasharray="8 6"/>
  ${etichetta({ testo: 'Camera di essiccazione: 80 °C fino a 2 giorni', tx: 240, ty: 26 })}
</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${etichetta({ testo: 'tolto dalla sagoma, il pezzo mantiene la curva', tx: 480, ty: 160 })}</g>
`;
}

const ln = (d, w = 10, col = 'finito') => `<path d="${d}" fill="none" stroke-width="${w}" stroke-linecap="round" style="stroke:var(--${col})"/>`;
const coppie = {
  profilatura: {
    ok: ['Profilare prima di curvare', 'Rastremature e sagomature si fanno sul pezzo diritto: è molto più semplice ed economico.', (id) => `<path d="M15,50 L145,44 L145,64 L15,58 Z" class="m-grezzo contorno"/>${ln('M30,108 Q80,70 130,108', 8)}${C.freccia({ id, x1: 80, y1: 70, x2: 80, y2: 84 })}`],
    ko: ['Sagomare il pezzo già curvo', 'Lavorare un pezzo curvato è difficile e costoso; dopo si fanno solo piccoli ritocchi e i profili dei giunti.', () => `${ln('M20,100 Q80,10 140,100', 14, 'grezzo')}<circle cx="80" cy="56" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  sezione: {
    ok: ['Sezione quadrata o tonda', 'Sono le sezioni più facili da curvare; una rastrematura che assottiglia il pezzo nella curva stretta aiuta.', () => `<rect x="30" y="40" width="36" height="36" class="m-finito contorno"/><circle cx="114" cy="58" r="20" class="m-finito contorno"/>`],
    ko: ['Profilo complesso o ondulato', 'Forme complesse e ondulazioni nella sezione diventano punti deboli.', () => `<path d="M30,40 H70 L60,56 L74,76 H30 Z" class="m-finito contorno"/><path d="M96,58 q8,-20 16,0 t16,0 t16,0" fill="none" stroke="var(--finito)" stroke-width="8"/><circle cx="66" cy="60" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  ancoraggio: {
    ok: ['Estremità ancorate', 'Le parti curvate vanno fissate all\'assieme, altrimenti col tempo si raddrizzano.', () => `${ln('M30,100 V50 Q30,20 60,20 Q90,20 90,50 V100')}<rect x="20" y="100" width="120" height="10" class="m-stampo contorno"/>`],
    ko: ['Curva stretta con estremità libera', 'Come il manico di un ombrello: se l\'estremità non è fissata la curva si apre lentamente.', () => `${ln('M110,10 V70 Q110,100 80,100 Q56,100 52,80')}<path d="M52,80 L44,60" fill="none" stroke="var(--ko)" stroke-width="2" stroke-dasharray="4 3"/><circle cx="52" cy="80" r="11" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  trazione: {
    ok: ['Curvatura per compressione', 'Il nastro sul lato esterno impedisce l\'allungamento: il legno ammorbidito si comprime all\'interno della curva.', () => `${ln('M30,100 V60 A50,50 0 0 1 130,60 V100', 12, 'finito')}<path d="M18,100 V60 A62,62 0 0 1 142,60 V100" fill="none" stroke="var(--testo)" stroke-width="3"/>`],
    ko: ['Curvatura senza nastro', 'Il legno si comprime ma si strappa subito se viene allungato oltre l\'1% della lunghezza.', () => `${ln('M30,100 V60 A50,50 0 0 1 130,60 V100', 12, 'finito')}<path d="M66,16 l6,10 l-8,6" fill="none" stroke="var(--ko)" stroke-width="2.5"/><circle cx="68" cy="22" r="13" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  manuale: ['Curvatura manuale', 'Per curve su più assi: il pezzo, bloccato nel nastro di tensione, viene piegato a mano sulla sagoma e fissato con morsetti.', (id) => `
    <path d="M60,100 V60 A50,50 0 0 1 160,60 V100 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${ln('M52,104 V60 A58,58 0 0 1 168,60 V104', 9, 'fuso')}
    <path d="M44,104 V60 A66,66 0 0 1 176,60 V104" fill="none" stroke="var(--testo)" stroke-width="2.5"/>`],
  circolare: ['Curvatura circolare', 'Assistita a macchina, su un solo asse: forma anelli chiusi come telai di sedute e braccioli; il pezzo resta sotto tensione per non allungare le fibre esterne.', (id) => `
    <circle cx="110" cy="62" r="40" fill="url(#${id}-tratteggio)" class="contorno"/>
    <path d="M110,14 A48,48 0 1 1 70,34" fill="none" stroke="var(--fuso)" stroke-width="9"/>
    ${C.rotazione({ id, cx: 110, cy: 62, r: 16 })}`],
  aperta: ['Curvatura aperta', 'Assistita a macchina, su un solo asse: per profili con estremità aperte, come uno schienale; una sagoma mobile ruota e preme il pezzo su quella fissa.', (id) => `
    <path d="M30,40 Q110,100 190,40 V30 Q110,86 30,30 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${ln('M26,46 Q110,110 194,46', 8, 'fuso')}
    ${C.freccia({ id, x1: 110, y1: 122, x2: 110, y2: 96 })}`],
};

module.exports = { viewBox: '0 0 820 360', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
