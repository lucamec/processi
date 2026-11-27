// Schema animato e mini-diagrammi: Strutture a telaio in legno (Thompson 2007, pp. 344–347).
// Montaggio di un pannello di parete in fabbrica, visto di fronte.
// Fasi: 1 taglio a misura, 2 posizionamento, 3 piastre chiodate, 4 pannello OSB, 5 messa in opera.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const PINO = '#e2c48e', OSB = '#c9a56b';
const RITTI = [220, 320, 420, 520, 620];

function schema(id) {
  const ritti = RITTI.map((x, i) => `<g${anim({ ty: [0, 0, 0, 0, 0] }, { ty: -40 - i * 12 })}><rect x="${x - 10}" y="100" width="20" height="200" fill="${PINO}" class="contorno"/></g>`).join('');
  return `
<rect x="160" y="320" width="520" height="16" class="macchina"/>
${etichetta({ testo: 'Banco di montaggio a controllo numerico', tx: 20, ty: 360 })}
<g${anim({ rot: [0, 0, 0, 0, -8] }, { rot: 0 }, [210, 310])}>
  <!-- correnti e ritti -->
  <g${anim({ ty: [0, 0, 0, 0, 0] }, { ty: -30 })}><rect x="210" y="80" width="420" height="20" fill="${PINO}" class="contorno"/><rect x="210" y="300" width="420" height="20" fill="${PINO}" class="contorno"/></g>
  ${ritti}
  <!-- piastre chiodate sui nodi -->
  <g${anim({ op: [0, 0, 1, 1, 1] }, { op: 0 })}>
    ${RITTI.map((x) => `<rect x="${x - 14}" y="86" width="28" height="22" fill="#9aa6b2" class="contorno"/><rect x="${x - 14}" y="292" width="28" height="22" fill="#9aa6b2" class="contorno"/>`).join('')}
  </g>
  <!-- pannello OSB -->
  <g${anim({ op: [0, 0, 0, 1, 1], ty: [0, 0, 0, 0, 0] }, { op: 0, ty: -60 })}>
    <rect x="210" y="80" width="420" height="240" fill="${OSB}" fill-opacity="0.85" class="contorno"/>
    ${Array.from({ length: 14 }, (_, i) => `<path d="M${230 + i * 28},${100 + (i % 3) * 60} l12,6 l-8,10" fill="none" stroke="#8a6a3a" stroke-width="2"/>`).join('')}
  </g>
</g>
<g${anim({ op: [1, 0, 0, 0, 0] })}>${etichetta({ testo: 'pezzi di pino classificati per resistenza, tagliati a misura', tx: 20, ty: 40 })}</g>
<g${anim({ op: [0, 1, 0, 0, 0] })}>${etichetta({ testo: 'il banco si regola e blocca ogni pezzo secondo il disegno', tx: 20, ty: 40 })}</g>
<g${anim({ op: [0, 0, 1, 0, 0] })}>${freccia({ id, x1: 720, y1: 60, x2: 640, y2: 90 })}${etichetta({ testo: 'piastre chiodate pressate sui nodi', tx: 580, ty: 40 })}</g>
<g${anim({ op: [0, 0, 0, 1, 0] })}>${etichetta({ testo: 'pannello OSB chiodato con pistole pneumatiche: dà rigidezza', tx: 20, ty: 40 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${etichetta({ testo: 'in cantiere i pannelli si montano velocemente: circa un piano al giorno', tx: 20, ty: 40 })}</g>
`;
}

const P = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${PINO}" class="contorno"/>`;
const coppie = {
  chiodo: {
    ok: ['Dal pezzo sottile al più spesso', 'Si chioda attraverso il pezzo più sottile dentro quello più spesso; circa due terzi del gambo devono entrare nel pezzo inferiore.', () => `${P(20, 40, 120, 16)}${P(20, 56, 120, 44)}<line x1="80" y1="30" x2="80" y2="86" stroke="var(--testo)" stroke-width="3"/><rect x="72" y="28" width="16" height="4" class="scuro"/>`],
    ko: ['Chiodo che entra poco', 'Se il chiodo attraversa il pezzo spesso ed entra poco in quello sottile, la presa è scarsa.', () => `${P(20, 40, 120, 44)}${P(20, 84, 120, 16)}<line x1="80" y1="30" x2="80" y2="92" stroke="var(--testo)" stroke-width="3"/><circle cx="80" cy="90" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  fibra: {
    ok: ['Chiodo trasversale alla fibra', 'Il legno è anisotropo: il chiodo divarica le fibre, che poi lo stringono. La presa migliore è attraverso la fibra.', () => `${P(20, 50, 120, 30)}${[56, 64, 72].map((y) => `<line x1="24" y1="${y}" x2="136" y2="${y}" stroke="#b8935a"/>`).join('')}<line x1="80" y1="34" x2="80" y2="78" stroke="var(--testo)" stroke-width="3"/>`],
    ko: ['Chiodo nella testa del legno', 'Chiodare nella fibra di testa dà la presa più debole.', () => `${P(50, 20, 60, 90)}${[60, 70, 80, 90, 100].map((x) => `<line x1="${x}" y1="24" x2="${x}" y2="106" stroke="#b8935a"/>`).join('')}<line x1="80" y1="6" x2="80" y2="50" stroke="var(--testo)" stroke-width="3"/><circle cx="80" cy="22" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  corrosione: {
    ok: ['Ferramenta inox all\'esterno', 'La ferramenta è di solito in acciaio al carbonio zincato; all\'esterno, soprattutto vicino al mare, si usa l\'inox.', () => `${P(20, 50, 120, 30)}<rect x="60" y="40" width="40" height="50" fill="#c8d0d8" class="contorno"/>`],
    ko: ['Acciaio che arrugginisce', 'La corrosione macchia il legno e alla fine fa cedere il giunto.', () => `${P(20, 50, 120, 30)}<rect x="60" y="40" width="40" height="50" fill="#9a5a30" class="contorno"/><path d="M80,90 q4,10 0,16" fill="none" stroke="#9a5a30" stroke-width="3"/><circle cx="80" cy="66" r="28" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  chiodi: ['Chiodatura dritta e obliqua', 'Per giunti a T e a sovrapposizione: il gambo divarica le fibre, che si richiudono attorno.', () => `
    ${P(20, 60, 180, 24)}${P(96, 10, 28, 50)}<line x1="110" y1="44" x2="110" y2="76" stroke="var(--testo)" stroke-width="3"/><line x1="92" y1="30" x2="112" y2="70" stroke="var(--testo)" stroke-width="3"/>`],
  piastre: ['Piastre chiodate', 'Lamiere d\'acciaio stampate con una fila di punte: entrano poco ma sono tante. Per giunti a T e di testa, senza sovrapposizioni.', () => `
    ${P(20, 50, 90, 28)}${P(110, 50, 90, 28)}<rect x="80" y="44" width="60" height="40" fill="#9aa6b2" class="contorno"/>${[90, 100, 110, 120, 130].map((x) => `<line x1="${x}" y1="48" x2="${x}" y2="80" stroke="var(--testo)" stroke-width="1"/>`).join('')}`],
  bulloni: ['Bulloni', 'Richiedono un preforo poco più largo del gambo, ma stringono il giunto dai due lati: sono più resistenti. Tipici dei giunti a sovrapposizione.', () => `
    ${P(20, 40, 180, 22)}${P(20, 62, 180, 22)}<rect x="104" y="30" width="12" height="64" class="scuro"/><rect x="96" y="26" width="28" height="8" class="scuro"/><rect x="96" y="90" width="28" height="8" class="scuro"/>`],
  connettori: ['Connettori a staffa', 'Elementi metallici piegati e chiodati, che sostengono le zone critiche dei giunti a T portanti, come un incastro a scanalatura; legano anche le travi a muratura e acciaio.', () => `
    ${P(20, 30, 40, 80)}${P(60, 56, 140, 26)}<path d="M54,50 H74 V88 H54" fill="none" stroke="#9aa6b2" stroke-width="6"/>`],
};

module.exports = { viewBox: '0 20 820 360', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
