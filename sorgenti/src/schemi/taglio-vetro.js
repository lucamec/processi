// Schema animato e mini-diagrammi: Taglio del vetro per incisione (Thompson 2007, pp. 276–279).
// Sezione di una lastra sotto la rotella in metallo duro. Fasi: 1 lubrificazione, 2 incisione,
// 3 separazione, 4 rifinitura del bordo.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

function schema(id) {
  return `
<rect x="140" y="250" width="540" height="14" class="macchina"/>
<!-- lastra: due metà che si separano lungo la cricca -->
<g${anim({ rot: [0, 0, -8, -8], tx: [0, 0, -10, -10] }, { rot: 0, tx: 0 }, [410, 250])}>
  <rect x="170" y="218" width="240" height="32" fill="#cfe3ea" class="contorno"/>
</g>
<g${anim({ rot: [0, 0, 8, 8], tx: [0, 0, 10, 10] }, { rot: 0, tx: 0 }, [410, 250])}>
  <rect x="410" y="218" width="240" height="32" fill="#cfe3ea" class="contorno"${anim({ op: [1, 1, 1, 0] }, { op: 1 })}/>
  <rect x="410" y="218" width="240" height="32" class="m-finito contorno"${anim({ op: [0, 0, 0, 1] }, { op: 0 })}/>
</g>
${etichetta({ testo: 'Lastra di vetro (0,5–20 mm)', tx: 20, ty: 210, px: 180, py: 222 })}
<!-- cricca mediana -->
<line x1="410" y1="218" x2="410" y2="230" stroke="var(--ko)" stroke-width="3"${anim({ op: [0, 1, 1, 0] }, { op: 0 })}/>
<g${anim({ op: [0, 1, 0, 0] })}>${etichetta({ testo: 'cricca mediana, profonda meno di 1 mm', tx: 440, ty: 300, px: 412, py: 228 })}</g>
<!-- testa con rotella -->
<g${anim({ ty: [-30, 0, -60, -60], tx: [0, 0, 0, 0] }, { ty: -60 })}>
  <rect x="396" y="110" width="28" height="70" class="macchina"/>
  <rect x="402" y="180" width="16" height="20" class="m-stampo contorno"/>
  <circle cx="410" cy="208" r="10" class="scuro"/>
</g>
${etichetta({ testo: 'Testa rotante con rotella in carburo di tungsteno', tx: 440, ty: 120 })}
<g${anim({ op: [1, 0, 0, 0] })}>
  <path d="M300,140 L380,196" stroke="var(--flusso)" stroke-width="2" stroke-dasharray="4 3"/>
  ${etichetta({ testo: 'un velo di lubrificante su rotella e vetro', tx: 140, ty: 130 })}
</g>
<g${anim({ op: [0, 1, 0, 0] })}>${freccia({ id, x1: 380, y1: 150, x2: 380, y2: 196 })}${etichetta({ testo: 'pressione leggera, ~100 m al minuto', tx: 140, ty: 160 })}</g>
<g${anim({ op: [0, 0, 1, 0] })}>${freccia({ id, x1: 300, y1: 300, x2: 300, y2: 266 })}${freccia({ id, x1: 520, y1: 300, x2: 520, y2: 266 })}${etichetta({ testo: 'una pressione fa correre la cricca in tutto lo spessore', tx: 140, ty: 330 })}</g>
<g${anim({ op: [0, 0, 0, 1] })}>${etichetta({ testo: 'se il bordo resta in vista, si lucida', tx: 140, ty: 330 })}</g>
`;
}

const ln = (d, col = 'finito', w = 4) => `<path d="${d}" fill="none" stroke-width="${w}" stroke-linejoin="round" style="stroke:var(--${col})"/>`;
const coppie = {
  esterni: {
    ok: ['Solo profili esterni', 'Si tagliano linee rette o curve di qualsiasi lunghezza, purché si possano staccare dal foglio: dischi, rettangoli, forme irregolari semplici.', () => `<rect x="20" y="20" width="120" height="90" fill="#cfe3ea" class="contorno"/><circle cx="80" cy="65" r="30" fill="none" style="stroke:var(--finito)" stroke-width="4"/>`],
    ko: ['Fori o forme interne', 'Una forma interna non si può staccare dal foglio.', () => `<rect x="20" y="20" width="120" height="90" fill="#cfe3ea" class="contorno"/><rect x="60" y="45" width="40" height="40" fill="#eef1f4" stroke="var(--testo)"/><circle cx="80" cy="65" r="30" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  bordi: {
    ok: ['Incisioni da bordo a bordo', 'Ogni incisione corre da un bordo all\'altro del foglio, o è una forma chiusa continua.', () => `<rect x="20" y="20" width="120" height="90" fill="#cfe3ea" class="contorno"/>${ln('M70,20 V110')}`],
    ko: ['Incisione che si ferma a metà', 'Una linea interrotta non guida la frattura: il vetro si rompe dove capita.', () => `<rect x="20" y="20" width="120" height="90" fill="#cfe3ea" class="contorno"/>${ln('M70,20 V64')}<path d="M70,64 L100,110" stroke="var(--ko)" stroke-width="2" stroke-dasharray="4 3"/><circle cx="70" cy="64" r="11" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  rientri: {
    ok: ['Forme convesse semplici', 'Profili convessi si staccano in un solo pezzo.', () => `<rect x="20" y="20" width="120" height="90" fill="#cfe3ea" class="contorno"/>${ln('M40,90 L60,40 H110 L120,90 Z')}`],
    ko: ['Rientranze e angoli acuti', 'Una mezzaluna o un angolo molto acuto difficilmente si staccano integri dal foglio.', () => `<rect x="20" y="20" width="120" height="90" fill="#cfe3ea" class="contorno"/>${ln('M60,30 A36,36 0 1 0 60,100 A26,26 0 1 1 60,30 Z')}<circle cx="64" cy="65" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  plotter: ['Plotter x-y a controllo numerico', 'La rotella segue il file CAD ad alta velocità: per pezzi unici o grandi serie, anche dischi fino a 5 mm di diametro nel vetro sottile.', () => `
    <rect x="20" y="30" width="180" height="80" fill="#cfe3ea" class="contorno"/>
    <rect x="20" y="16" width="180" height="10" class="scuro"/><rect x="100" y="16" width="20" height="30" class="macchina"/>
    <circle cx="110" cy="70" r="28" fill="none" stroke="#ffffff" stroke-width="2"/>`],
  mano: ['Taglio a mano', 'Utensili manuali per tagli lunghi e diritti, per prototipi a mano libera, con un compasso o lungo una sagoma; è la tecnica delle vetrate artistiche.', () => `
    <rect x="20" y="60" width="180" height="40" fill="#cfe3ea" class="contorno"/>
    <path d="M80,10 L104,54" stroke="var(--testo)" stroke-width="8" stroke-linecap="round"/><circle cx="106" cy="58" r="5" class="scuro"/>`],
  pinze: ['Rottura con pinze', 'I bordi diritti si staccano a mano; cerchi e forme si liberano con pinze che rompono il vetro fuori dalla forma, facendolo cedere lungo la cricca.', () => `
    <circle cx="90" cy="64" r="34" fill="#cfe3ea" class="contorno"/>
    <path d="M150,30 L180,64 L150,98" fill="none" stroke="var(--testo)" stroke-width="6"/>
    <path d="M124,64 H178" stroke="var(--testo)" stroke-width="3"/>`],
};

module.exports = { viewBox: '0 90 820 260', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
