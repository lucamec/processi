// Schema animato e mini-diagrammi: Anodizzazione (Thompson 2007, pp. 360–363).
// A sinistra la vasca elettrolitica; a destra l'ingrandimento dello strato di ossido poroso.
// Fasi: 1 pulizia e mordenzatura, 2 anodizzazione, 3 colorazione, 4 fissaggio.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const PORI = [500, 530, 560, 590, 620, 650, 680, 710];

function schema(id) {
  return `
<!-- vasca -->
<path d="M60,110 V320 H380 V110" fill="none" stroke="var(--testo)" stroke-width="5"/>
<rect x="66" y="130" width="308" height="186" style="fill:var(--flusso)" fill-opacity="0.18"/>
<rect x="100" y="90" width="20" height="200" class="scuro"/><rect x="320" y="90" width="20" height="200" class="scuro"/>
${etichetta({ testo: 'Catodo (−)', tx: 60, ty: 80 })}
<rect x="190" y="70" width="60" height="210" fill="#c8d0d8" class="contorno"/>
${etichetta({ testo: 'Pezzo in alluminio: anodo (+)', tx: 170, ty: 56 })}
<g${anim({ op: [0, 1, 0, 0] }, { op: 0 })}>${[150, 180, 210, 240, 270].map((y, i) => `<circle cx="${180 - (i % 2) * 6}" cy="${y}" r="4" fill="none" stroke="var(--flusso)" stroke-width="2"/><circle cx="${260 + (i % 2) * 6}" cy="${y + 10}" r="4" fill="none" stroke="var(--flusso)" stroke-width="2"/>`).join('')}</g>
${etichetta({ testo: 'Elettrolita: acido solforico diluito', tx: 70, ty: 345 })}

<!-- ingrandimento dello strato -->
<rect x="470" y="70" width="290" height="250" fill="none" stroke="var(--testo)" stroke-dasharray="4 3"/>
<rect x="480" y="240" width="270" height="70" fill="#c8d0d8" class="contorno"/>
${etichetta({ testo: 'Metallo base', tx: 600, ty: 300 })}
<!-- ossido poroso che cresce -->
<g${anim({ sy: [0, 1, 1, 1] }, { sy: 0 }, [480, 240])}>
  <rect x="480" y="150" width="270" height="90" fill="#e8ebee" class="contorno"/>
  ${PORI.map((x) => `<rect x="${x}" y="150" width="10" height="76" fill="#ffffff" stroke="var(--testo)" stroke-width="0.5"/>`).join('')}
</g>
<g${anim({ op: [0, 0, 1, 1] }, { op: 0 })}>${PORI.map((x) => `<rect x="${x + 1}" y="196" width="8" height="30" fill="#8a5a2a"/>`).join('')}</g>
<g${anim({ op: [0, 0, 0, 1] }, { op: 0 })}><rect x="480" y="140" width="270" height="12" style="fill:var(--finito)"/></g>
${etichetta({ testo: 'Strato di ossido (5–35 µm)', tx: 480, ty: 130 })}
<g${anim({ op: [1, 0, 0, 0] })}>${etichetta({ testo: 'bagni alcalini e acidi: mordenzatura opaca o brillantatura lucida', tx: 20, ty: 30 })}</g>
<g${anim({ op: [0, 1, 0, 0] })}>${etichetta({ testo: 'l\'ossigeno reagisce con il metallo e forma un ossido poroso (5 µm in ~15 minuti)', tx: 20, ty: 30 })}</g>
<g${anim({ op: [0, 0, 1, 0] })}>${etichetta({ testo: 'colorazione: sali di cobalto depositati nei pori, o un colorante', tx: 20, ty: 30 })}</g>
<g${anim({ op: [0, 0, 0, 1] })}>${etichetta({ testo: 'fissaggio in acqua calda (98 °C): i pori si chiudono', tx: 20, ty: 30 })}</g>
`;
}

const coppie = {
  scolo: {
    ok: ['Pezzi che sgocciolano', 'È un processo a immersione: i liquidi devono poter defluire, quindi i pezzi si montano leggermente inclinati e senza sacche.', () => `<path d="M20,40 H140 V60 H20 Z" fill="#c8d0d8" class="contorno" transform="rotate(8 80 50)"/><path d="M136,72 q2,8 0,14" fill="none" stroke="var(--flusso)" stroke-width="3"/>`],
    ko: ['Cavità chiuse', 'Una cavità senza fori di scolo trattiene i bagni e li trascina in quello successivo.', () => `<path d="M30,30 H130 V100 H30 Z M50,30 V80 H110 V30" fill="#c8d0d8" class="contorno" fill-rule="evenodd"/><rect x="52" y="58" width="56" height="20" style="fill:var(--flusso)" fill-opacity="0.5"/><circle cx="80" cy="68" r="22" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  lotto: {
    ok: ['Metallo dello stesso lotto', 'L\'aspetto dipende dalla finitura di laminazione e dalla lega: i pezzi vanno presi dallo stesso lotto.', () => `<rect x="20" y="40" width="56" height="50" fill="#8a7a5a" class="contorno"/><rect x="84" y="40" width="56" height="50" fill="#8a7a5a" class="contorno"/>`],
    ko: ['Lotti o leghe diversi, saldature', 'Composizioni diverse danno colori diversi: un problema per le saldature e per gli assemblaggi di lotti diversi.', () => `<rect x="20" y="40" width="56" height="50" fill="#8a7a5a" class="contorno"/><rect x="84" y="40" width="56" height="50" fill="#a8946a" class="contorno"/><circle cx="80" cy="65" r="18" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  quote: {
    ok: ['Quote critiche concordate', 'Lo strato aumenta le dimensioni ma consuma circa metà del suo spessore di metallo; la pulizia di solito compensa. Per le quote critiche si consulta l\'anodizzatore.', () => `<rect x="30" y="50" width="100" height="40" fill="#c8d0d8" class="contorno"/><rect x="30" y="44" width="100" height="6" style="fill:var(--finito)"/>${C.etichetta({ testo: '±', tx: 140, ty: 52 })}`],
    ko: ['Accoppiamenti stretti senza margine', 'Su un accoppiamento preciso lo strato può cambiare il gioco, soprattutto nei materiali teneri che si mordenzano più in fretta.', () => `<rect x="30" y="40" width="100" height="50" fill="#c8d0d8" class="contorno"/><rect x="60" y="56" width="40" height="34" fill="#eef1f4" stroke="var(--testo)"/><rect x="62" y="52" width="36" height="38" fill="#9aa6b2" class="contorno"/><circle cx="80" cy="60" r="20" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  dura: ['Anodizzazione dura', 'Strati fino a 50 µm, più resistenti all\'usura e al calore, per applicazioni impegnative; solo gli strati sottili restano molto lucidi.', () => `
    <rect x="30" y="70" width="160" height="34" fill="#c8d0d8" class="contorno"/><rect x="30" y="30" width="160" height="40" fill="#6a7480" class="contorno"/>`],
  elettrolitica: ['Colorazione elettrolitica', 'Sali di cobalto (o di stagno) depositati nei pori: grigio, bronzo, oro e nero per interferenza della luce, molto stabili ai raggi UV, anche per esterni, con garanzie fino a 30 anni.', () => `
    <rect x="30" y="70" width="160" height="34" fill="#c8d0d8" class="contorno"/><rect x="30" y="40" width="160" height="30" fill="#e8ebee" class="contorno"/>
    ${[50, 80, 110, 140, 170].map((x) => `<rect x="${x}" y="56" width="8" height="14" fill="#5a4a2a"/>`).join('')}`],
  immersione: ['Colorazione per immersione', 'Lo strato poroso si tinge in un bagno di colore prima del fissaggio: la gamma più ampia (rosso, verde, blu…), ma meno stabile alla luce e quindi da interni.', () => `
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${24 + i * 36}" y="30" width="30" height="70" fill="${['#c0392b', '#3f8f8a', '#3b6fd1', '#d4a636', '#1d232b'][i]}" class="contorno"/>`).join('')}`],
};

module.exports = { viewBox: '0 10 820 350', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
