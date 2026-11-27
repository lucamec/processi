// Schema animato e mini-diagrammi: Zincatura a caldo (Thompson 2007, pp. 368–371).
// A sinistra il pezzo inclinato che entra nello zinco fuso; a destra gli strati del rivestimento.
// Fasi: 1 sgrassaggio e decapaggio, 2 flussaggio, 3 immersione nello zinco, 4 estrazione.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const ZN = '#c8ccd2';

function schema(id) {
  return `
<!-- vasca dello zinco fuso -->
<path d="M60,150 V330 H400 V150" fill="none" stroke="var(--testo)" stroke-width="5"/>
<rect x="66" y="170" width="328" height="156" fill="${ZN}" fill-opacity="0.8"/>
${etichetta({ testo: 'Zinco fuso a 450 °C', tx: 70, ty: 350 })}
<!-- pezzo inclinato di 30° -->
<g${anim({ ty: [-130, -130, 0, -130] }, { ty: -130 })}>
  <g transform="rotate(30 230 180)">
    <rect x="120" y="170" width="220" height="24" fill="#8a7a6a" class="contorno"${anim({ op: [0, 1, 0, 0] }, { op: 1 })}/>
    <rect x="120" y="170" width="220" height="24" fill="#9aa6b2" class="contorno"${anim({ op: [1, 0, 1, 0] }, { op: 0 })}/>
    <rect x="116" y="166" width="228" height="32" fill="none" stroke-width="6" style="stroke:var(--finito)"${anim({ op: [0, 0, 0, 1] }, { op: 0 })}/>
  </g>
</g>
${etichetta({ testo: 'Pezzo appeso a circa 30° per far defluire i bagni', tx: 60, ty: -50 })}
<g${anim({ op: [1, 0, 0, 0] })}>${etichetta({ testo: 'soda caustica calda, due bagni di acido cloridrico, lavaggio a 80 °C', tx: 60, ty: -28 })}</g>
<g${anim({ op: [0, 1, 0, 0] })}>${etichetta({ testo: 'flusso di cloruro di zinco e ammonio: superficie pronta per lo zinco', tx: 60, ty: -28 })}</g>
<g${anim({ op: [0, 0, 1, 0] })}>${etichetta({ testo: 'immersione fino a 10 minuti: lo zinco si lega al ferro', tx: 60, ty: -28 })}</g>
<g${anim({ op: [0, 0, 0, 1] })}>${freccia({ id, x1: 300, y1: 140, x2: 300, y2: 90 })}${etichetta({ testo: 'estrazione lenta: lo zinco in eccesso ricade nel bagno', tx: 60, ty: -28 })}</g>

<!-- strati del rivestimento -->
<rect x="480" y="90" width="280" height="230" fill="none" stroke="var(--testo)" stroke-dasharray="4 3"/>
<rect x="490" y="250" width="260" height="60" fill="#9aa6b2" class="contorno"/>
${etichetta({ testo: 'Acciaio', tx: 600, ty: 290 })}
<g${anim({ sy: [0, 0, 1, 1] }, { sy: 0 }, [490, 250])}>
  <rect x="490" y="220" width="260" height="30" fill="#8a96a2" class="contorno"/>
  <rect x="490" y="190" width="260" height="30" fill="#a8b2bc" class="contorno"/>
  <rect x="490" y="160" width="260" height="30" fill="${ZN}" class="contorno"/>
</g>
<g${anim({ op: [0, 0, 1, 1] })}>
  ${etichetta({ testo: 'leghe zinco-ferro, durissime', tx: 500, ty: 214 })}
  ${etichetta({ testo: 'zinco puro', tx: 500, ty: 180 })}
  ${etichetta({ testo: 'Rivestimento di 50–150 µm', tx: 500, ty: 120 })}
</g>
`;
}

const coppie = {
  sfiati: {
    ok: ['Fori di scolo e sfiato', 'Tubi e cavità devono avere fori che lascino entrare e uscire i bagni e lo zinco.', () => `<rect x="20" y="50" width="120" height="30" fill="none" stroke="var(--testo)" stroke-width="5"/><circle cx="30" cy="80" r="5" fill="#eef1f4" stroke="var(--testo)"/><circle cx="130" cy="50" r="5" fill="#eef1f4" stroke="var(--testo)"/>`],
    ko: ['Tubi sigillati e angoli ciechi', 'Volumi chiusi intrappolano aria e liquidi che, a 450 °C, possono esplodere.', () => `<rect x="20" y="50" width="120" height="30" fill="none" stroke="var(--testo)" stroke-width="5"/><path d="M80,40 l6,-12 l4,10 l8,-8" fill="none" stroke="var(--ko)" stroke-width="2.5"/><circle cx="80" cy="65" r="22" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  temperatura: {
    ok: ['Pezzi che reggono 450 °C', 'Il bagno è a 450 °C: tutte le parti devono sopportarlo.', () => `<rect x="30" y="50" width="100" height="40" fill="#9aa6b2" class="contorno"/><rect x="26" y="46" width="108" height="48" fill="none" stroke="#c8ccd2" stroke-width="5"/>`],
    ko: ['Parti sensibili al calore', 'Componenti con parti che non reggono la temperatura del bagno vanno zincati prima del montaggio o non zincati.', () => `<rect x="30" y="50" width="100" height="40" fill="#9aa6b2" class="contorno"/><rect x="60" y="40" width="40" height="14" class="m-grezzo contorno"/><circle cx="80" cy="46" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  pulizia: {
    ok: ['Superfici pulite', 'Scorie di saldatura, grasso e vernice vanno tolti prima: preparazione e composizione dell\'acciaio decidono la qualità.', () => `<rect x="20" y="60" width="120" height="30" fill="#9aa6b2" class="contorno"/><rect x="20" y="52" width="120" height="8" fill="#c8ccd2"/>`],
    ko: ['Vernice o scoria residua', 'Dove resta vernice o scoria lo zinco non si lega e il rivestimento ha lacune.', () => `<rect x="20" y="60" width="120" height="30" fill="#9aa6b2" class="contorno"/><rect x="20" y="52" width="50" height="8" fill="#c8ccd2"/><rect x="70" y="54" width="30" height="6" fill="#c0392b"/><rect x="100" y="52" width="40" height="8" fill="#c8ccd2"/><circle cx="85" cy="56" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  centrifuga: ['Zincatura centrifuga', 'I pezzi piccoli si immergono in cestelli e poi si centrifugano: lo zinco in eccesso viene espulso e il rivestimento, un po\' più sottile, è uniforme. Utile per viti, bulloni e minuteria.', (id) => `
    <path d="M60,40 V100 H160 V40" fill="none" stroke="var(--testo)" stroke-width="4"/>
    ${[80, 100, 120, 140].map((x, i) => `<rect x="${x - 6}" y="${70 + (i % 2) * 12}" width="12" height="18" fill="#c8ccd2" class="contorno"/>`).join('')}
    ${C.rotazione({ id, cx: 110, cy: 26, r: 14 })}`],
  mascheratura: ['Mascheratura', 'La zincatura copre tutta la superficie; nastri resistenti al calore, grasso o vernice proteggono le zone da escludere. Alcuni corpi cavi si possono zincare solo all\'esterno, con tecniche speciali.', () => `
    <rect x="20" y="50" width="180" height="40" fill="#c8ccd2" class="contorno"/><rect x="80" y="46" width="60" height="48" fill="#5b8fd1" fill-opacity="0.8"/>`],
};

module.exports = { viewBox: '0 -70 820 430', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
