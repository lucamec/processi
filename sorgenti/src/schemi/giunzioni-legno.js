// Schema animato e mini-diagrammi: Giunzioni del legno (Thompson 2007, pp. 324–331).
// Schema principale: tenone e mortasa fra gamba e traverso (caso studio del tavolo), in sezione.
// Fasi: 1 taglio del tenone, 2 mortasa, 3 colla, 4 montaggio.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const LEGNO = '#d8b98a', SCURO = '#b8935a';
const FONDO = '#eef1f4';

function schema(id) {
  return `
<!-- gamba con la mortasa -->
<rect x="200" y="40" width="120" height="300" fill="${LEGNO}" class="contorno"/>
${Array.from({ length: 6 }, (_, i) => `<line x1="${212 + i * 18}" y1="44" x2="${214 + i * 18}" y2="336" stroke="${SCURO}" stroke-width="1.5"/>`).join('')}
<rect x="260" y="150" width="60" height="80" fill="${FONDO}" class="contorno"${anim({ op: [0, 1, 1, 1] }, { op: 0 })}/>
<g${anim({ op: [1, 0, 0, 0], tx: [0, 140, 140, 140], ty: [0, -160, -160, -160] }, { op: 1, tx: 0, ty: 0 })}><rect x="260" y="150" width="60" height="80" fill="${LEGNO}" stroke="var(--ko)" stroke-dasharray="4 3"/></g>
${etichetta({ testo: 'Gamba: mortasa larga al massimo 1/3 dello spessore', tx: 20, ty: 30 })}
<!-- traverso con il tenone -->
<g${anim({ tx: [0, 0, 0, -180] }, { tx: 0 })}>
  <rect x="560" y="130" width="220" height="120" fill="${LEGNO}" class="contorno"/>
  ${Array.from({ length: 5 }, (_, i) => `<line x1="562" y1="${142 + i * 22}" x2="778" y2="${144 + i * 22}" stroke="${SCURO}" stroke-width="1.5"/>`).join('')}
  <rect x="500" y="150" width="60" height="80" fill="${LEGNO}" class="contorno"/>
  <rect x="500" y="150" width="60" height="80" style="fill:var(--fuso)" fill-opacity="0.55"${anim({ op: [0, 0, 1, 0] }, { op: 0 })}/>
  <g${anim({ op: [0, 0, 0, 0], ty: [60, 60, 60, 60] }, { op: 1, ty: 0 })}>
    <rect x="500" y="130" width="60" height="20" fill="${LEGNO}" stroke="var(--ko)" stroke-dasharray="4 3"/><rect x="500" y="230" width="60" height="20" fill="${LEGNO}" stroke="var(--ko)" stroke-dasharray="4 3"/>
  </g>
</g>
${etichetta({ testo: 'Traverso: tenone tagliato alla sega a nastro', tx: 460, ty: 300 })}
<g${anim({ op: [0, 1, 0, 0] })}>${etichetta({ testo: 'la mortasatrice scava un foro quadro (punta dentro uno scalpello)', tx: 20, ty: 370 })}</g>
<g${anim({ op: [0, 0, 1, 0] })}>${etichetta({ testo: 'colla PVA: distribuisce il carico su tutto il giunto, invisibile', tx: 20, ty: 370 })}</g>
<g${anim({ op: [0, 0, 0, 1] })}>${freccia({ id, x1: 640, y1: 100, x2: 560, y2: 100 })}${etichetta({ testo: 'montaggio: il giunto più robusto fra gamba e telaio', tx: 20, ty: 370 })}</g>
<g${anim({ op: [1, 0, 0, 0] })}>${etichetta({ testo: 'si tolgono le guance attorno al tenone', tx: 20, ty: 370 })}</g>
`;
}

const L = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${LEGNO}" class="contorno"/>`;
const coppie = {
  terzo: {
    ok: ['Mortasa non oltre 1/3 dello spessore', 'Mortase e scanalature non più larghe di un terzo dello spessore: resta abbastanza legno attorno al giunto.', () => `${L(40, 20, 80, 90)}<rect x="67" y="40" width="26" height="50" fill="${FONDO}" class="contorno"/>`],
    ko: ['Mortasa troppo larga', 'Pareti sottili attorno al foro si spaccano.', () => `${L(40, 20, 80, 90)}<rect x="48" y="40" width="64" height="50" fill="${FONDO}" class="contorno"/><circle cx="46" cy="64" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  testa: {
    ok: ['Colla su fibra lunga', 'La testa del legno (fibra di testa) è la faccia più debole per ogni fissaggio: lap, pettine e code di rondine incollano fibra lunga.', () => `${L(20, 40, 120, 20)}${L(60, 60, 80, 20)}`],
    ko: ['Testa a testa senza rinforzi', 'Il giunto di testa incolla una faccia di fibra di testa su una piccola superficie: è il più debole; va rinforzato con spine, biscotti o ferramenta.', () => `${L(20, 50, 60, 24)}${L(82, 50, 60, 24)}<circle cx="81" cy="62" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  movimento: {
    ok: ['Giunto che asseconda il legno', 'Il legno ritira e si gonfia con l\'umidità e si torce: il giunto deve limitare torsioni e imbarcamenti, come le testate trasversali sui piani di tavole.', () => `${L(20, 30, 120, 60)}<rect x="20" y="30" width="16" height="60" fill="${SCURO}" class="contorno"/><rect x="124" y="30" width="16" height="60" fill="${SCURO}" class="contorno"/>`],
    ko: ['Piano libero di imbarcarsi', 'Un piano di tavole senza testate tende a imbarcarsi.', () => `<path d="M20,50 Q80,30 140,50 V80 Q80,60 20,80 Z" fill="${LEGNO}" class="contorno"/><circle cx="80" cy="44" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  spine: ['Testa a testa con spine o biscotti', 'Il giunto più semplice ed economico, rinforzato da spine in faggio o betulla o da biscotti nascosti nell\'interfaccia: tipico dei mobili in kit e delle grandi serie.', () => `
    ${L(20, 40, 90, 40)}${L(112, 40, 90, 40)}<rect x="90" y="52" width="44" height="8" fill="${SCURO}" class="contorno"/><rect x="90" y="64" width="44" height="8" fill="${SCURO}" class="contorno"/>`],
  quartabuono: ['A quartabuono', 'Due tavole tagliate a 45°: più elegante del giunto di testa, nasconde la fibra di testa e dà continuità alla venatura.', () => `
    <path d="M30,20 H110 L80,50 H30 Z" fill="${LEGNO}" class="contorno"/><path d="M80,50 L110,20 V110 H80 Z" fill="${LEGNO}" class="contorno"/>`],
  pettine: ['A pettine e a coda di rondine', 'Il pettine moltiplica la superficie di colla, per cassetti e scatole; la coda di rondine ha incastri inclinati che resistono allo sfilamento, ideale per i cassetti tirati dal fronte.', () => `
    <path d="M30,20 H80 V40 H60 L66,56 H80 V72 H66 L60,88 H80 V104 H30 Z" fill="${LEGNO}" class="contorno"/>
    <path d="M80,40 H60 L66,56 H80 Z M80,72 H66 L60,88 H80 Z" fill="${SCURO}" class="contorno"/>
    <path d="M120,20 H190 V104 H120 V88 H140 V72 H120 V56 H140 V40 H120 Z" fill="${LEGNO}" class="contorno"/>`],
  scanalatura: ['A scanalatura (housing)', 'Un incastro a metà del pezzo, comune per mensole e mobili: tutto l\'assieme si incolla e si serra in una sola volta.', () => `
    ${L(30, 20, 30, 90)}${L(160, 20, 30, 90)}<rect x="44" y="56" width="132" height="14" fill="${SCURO}" class="contorno"/>`],
  allungamento: ['Giunti di allungamento e allargamento', 'Ammorsature, maschio e femmina, giunti a M e a dita uniscono tavole in pannelli più larghi o in profili continui, aumentando la superficie incollata; i giunti a M e a dita sono a macchina.', () => `
    <path d="M20,40 H100 L110,50 L100,60 L110,70 L100,80 H20 Z" fill="${LEGNO}" class="contorno"/><path d="M200,40 H100 L110,50 L100,60 L110,70 L100,80 H200 Z" fill="${SCURO}" class="contorno"/>`],
};

module.exports = { viewBox: '0 10 820 380', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
