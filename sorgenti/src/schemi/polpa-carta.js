// Schema animato e mini-diagrammi: Stampaggio della polpa di carta (Thompson 2007, pp. 202–205).
// Sezione: vasca dell'impasto, stampo maschio con rete e vuoto, stampo di trasferimento, nastro e forno.
// Fasi: 1 formatura per immersione, 2 emersione, 3 trasferimento sul nastro, 4 essiccazione in forno.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

const STAMPO = 'M210,60 H370 V100 H358 Q330,180 302,100 H278 Q250,180 222,100 H210 Z';
const RETE = 'M210,100 H222 Q250,180 278,100 H302 Q330,180 358,100 H370';
const GUSCIO = 'M206,106 H222 Q250,190 278,106 H302 Q330,190 358,106 H374';
const TRASF = 'M206,112 H222 Q250,196 278,112 H302 Q330,196 358,112 H374 V196 H206 Z';
const gu = (col) => `<path d="${GUSCIO}" fill="none" stroke-width="7" stroke-linejoin="round" style="stroke:var(--${col})"/>`;
const O = [290, 150];

function schema(id) {
  return `
<!-- vasca con l'impasto -->
<rect x="130" y="246" width="320" height="90" style="fill:var(--flusso)" opacity="0.18"/>
<path d="M120,220 V344 H460 V220" fill="none" stroke="var(--testo)" stroke-width="5"/>
${etichetta({ testo: 'Impasto di carta macerata e acqua, mescolato di continuo', tx: 40, ty: 364 })}

<!-- stampo maschio con rete e canali per il vuoto -->
<g${anim({ ty: [150, 0, 0, 0] }, { ty: 0 })}>
  <rect x="270" y="0" width="40" height="60" class="macchina"/>
  <path d="${STAMPO}" fill="url(#${id}-tratteggio)" class="contorno"/>
  <path d="${RETE}" fill="none" stroke="var(--testo)" stroke-width="2" stroke-dasharray="3 3"/>
  <g${anim({ op: [1, 1, 0, 0] }, { op: 0 })}>${gu('fuso')}</g>
  <g${anim({ op: [1, 1, 0, 0] }, { op: 0 })}>${freccia({ id, x1: 290, y1: 96, x2: 290, y2: 30 })}</g>
</g>
${etichetta({ testo: 'Stampo in alluminio con rete inox e fori', tx: 400, ty: 40, px: 372, py: 70 })}
<g${anim({ op: [1, 1, 0, 0] })}>${etichetta({ testo: 'il vuoto aspira l\'acqua: la polpa si deposita sullo stampo', tx: 410, ty: 140 })}</g>

<!-- stampo di trasferimento in poliuretano con il guscio: si capovolge e lo posa sul nastro -->
<g${anim({ op: [0, 0, 1, 0], tx: [0, 0, 270, 270], ty: [0, 0, 106, 30], rot: [0, 0, 180, 180] }, { op: 0, tx: 0, ty: 0, rot: 0 }, O)}>
  <path d="${TRASF}" class="m-grezzo contorno"/>
</g>
<g${anim({ tx: [0, 0, 270, 410], ty: [0, 0, 100, 100], rot: [0, 0, 180, 180] }, { tx: 0, ty: 0, rot: 0 }, O)}>
  <g${anim({ op: [0, 0, 1, 0] }, { op: 0 })}>${gu('fuso')}</g>
  <g${anim({ op: [0, 0, 0, 1] }, { op: 0 })}>${gu('finito')}</g>
</g>
<g${anim({ op: [0, 0, 1, 0] })}>${etichetta({ testo: 'Stampo di trasferimento (poliuretano, con vuoto)', tx: 470, ty: 110 })}</g>

<!-- nastro e forno -->
<rect x="470" y="300" width="340" height="12" class="scuro"/>
${[490, 560, 630, 700, 770].map((x) => `<circle cx="${x}" cy="320" r="7" class="m-stampo contorno"/>`).join('')}
<rect x="600" y="196" width="212" height="104" fill="none" stroke="var(--fuso)" stroke-width="3" stroke-dasharray="8 6"/>
${etichetta({ testo: 'Forno ad aria calda', tx: 660, ty: 186 })}
<g${anim({ op: [0, 0, 0, 1] })}>${etichetta({ testo: '200 °C per circa 15 minuti', tx: 600, ty: 350 })}</g>
`;
}

const ln = (d, col = 'finito', w = 6) => `<path d="${d}" fill="none" stroke-width="${w}" stroke-linejoin="round" style="stroke:var(--${col})"/>`;
const coppie = {
  sformo: {
    ok: ['Pareti inclinate, estrazione lungo un asse', 'Gli stampi si chiudono su un solo asse senza margini: il pezzo deve uscire lungo quell\'asse, con angoli di sformo adeguati.', (id) => `${ln('M15,40 H40 L55,100 H105 L120,40 H145')}${C.freccia({ id, x1: 80, y1: 90, x2: 80, y2: 30 })}`],
    ko: ['Pareti verticali o sottosquadri', 'Senza sformo, o con un rientro, il pezzo umido e cedevole non si stacca lungo l\'asse.', () => `${ln('M15,40 H45 V70 L35,85 V100 H125 V85 L115,70 V40 H145')}<circle cx="38" cy="78" r="11" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  nervature: {
    ok: ['Nervature e spessore', 'Non si aggiungono leganti: la resistenza viene da pareti più spesse e da nervature, che sostengono e ammortizzano il contenuto.', () => ln('M10,40 H30 L40,96 H60 L66,70 L72,96 H88 L94,70 L100,96 H120 L130,40 H150')],
    ko: ['Grande fondo piatto senza rinforzi', 'Appena formato il pezzo contiene ancora il 75% di acqua: una superficie ampia e piatta non si regge da sola.', () => `${ln('M10,40 H30 L40,90 H120 L130,40 H150')}<path d="M40,90 Q80,112 120,90" fill="none" stroke="var(--ko)" stroke-width="2" stroke-dasharray="4 3"/>`],
  },
  dettagli: {
    ok: ['Dettagli sul lato dello stampo', 'Essiccato all\'aria il pezzo è liscio solo sul lato a contatto con lo stampo: loghi e testi fini vanno lì, o si ottengono con la pressatura.', () => `${ln('M15,80 H145', 'finito', 10)}<text x="80" y="66" text-anchor="middle" class="etichetta">LOGO</text><line x1="15" y1="88" x2="145" y2="88" stroke="var(--testo)" stroke-width="2"/>${C.etichetta({ testo: 'lato stampo', tx: 80, ty: 108, ancora: 'middle' })}`],
    ko: ['Dettagli sul lato ruvido', 'Il lato libero è ruvido e non riproduce i dettagli fini.', () => `<path d="M15,80 l6,-4 l6,4 l6,-4 l6,4 l6,-4 l6,4 l6,-4 l6,4 l6,-4 l6,4 l6,-4 l6,4 l6,-4 l6,4 l6,-4 l6,4 l6,-4 l6,4 l6,-4 l6,4 V90 H15 Z" class="m-finito contorno"/><circle cx="80" cy="76" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  umido: ['Pressatura a umido', 'Il pezzo appena formato viene pressato: migliora la finitura e riduce la permeabilità; si possono imprimere loghi e testi.', (id) => `
    <path d="M40,30 H180 V54 H150 L140,74 H80 L70,54 H40 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${ln('M30,62 H66 L78,82 H142 L154,62 H190', 'fuso', 6)}
    <path d="M40,70 H66 L78,90 H142 L154,70 H180 V110 H40 Z" class="m-stampo contorno"/>`],
  caldo: ['Pressatura a caldo', 'Uno stampo caldo asciuga il pezzo in fretta e dà la superficie migliore; poiché la polpa si ritira asciugando possono servire fino a 4 set di stampi, e ogni set raddoppia circa il costo iniziale.', () => `
    ${[0, 1, 2].map((i) => `<rect x="${20 + i * 66}" y="${40 + i * 4}" width="${56 - i * 4}" height="${30 - i * 4}" class="m-stampo contorno"/>`).join('')}
    ${ln('M20,84 H196', 'finito', 5)}
    ${etichetta({ testo: 'set di stampi sempre più piccoli', tx: 110, ty: 110, ancora: 'middle' })}`],
  verticale: ['Immersione verticale', 'Le macchine a immersione verticale producono pezzi più profondi dei 165 mm ottenibili normalmente.', (id) => `
    <rect x="40" y="56" width="140" height="62" style="fill:var(--flusso)" opacity="0.2"/>
    <rect x="94" y="6" width="32" height="92" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${ln('M88,40 V104 H132 V40', 'fuso', 5)}
    ${C.freccia({ id, x1: 150, y1: 10, x2: 150, y2: 50 })}`],
};

module.exports = { viewBox: '0 0 820 380', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
