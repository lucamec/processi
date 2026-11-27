// Schema animato e mini-diagrammi: Fusione centrifuga (Thompson 2007, pp. 144–147).
// Schema principale: colata orizzontale in stampo di silicone a più cavità, vista dall'alto.
// Fasi: 1 stampo chiuso sul piatto, 2 colata al centro in rotazione, 3 riempimento delle cavità, 4 apertura ed estrazione.
'use strict';
const C = require('../componenti');
const { anim, etichetta } = C;

const CX = 400, CY = 190;
function cavita() {
  const out = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * 360;
    out.push(`<g transform="rotate(${a} ${CX} ${CY})"><rect x="${CX + 22}" y="${CY - 5}" width="58" height="10" PLACEHOLDER/><circle cx="${CX + 100}" cy="${CY}" r="20" PLACEHOLDER/></g>`);
  }
  return out.join('');
}

function schema(id) {
  const vuote = cavita().replace(/PLACEHOLDER/g, 'class="cavita contorno"');
  const piene = cavita().replace(/PLACEHOLDER/g, 'class="m-fuso contorno"');
  const finite = cavita().replace(/PLACEHOLDER/g, 'class="m-finito contorno"');
  return `
<!-- stampo in silicone (vista dall'alto) che ruota -->
<g${anim({ rot: [0, 720, 1440, 1440] }, { rot: 0 }, [CX, CY])}>
  <circle cx="${CX}" cy="${CY}" r="150" fill="url(#${id}-tratteggio)" class="contorno"${anim({ op: [1, 1, 1, 0.25] }, { op: 1 })}/>
  ${vuote}
  <circle cx="${CX}" cy="${CY}" r="22" class="cavita contorno"/>
  <g${anim({ op: [0, 0, 1, 0] }, { op: 0 })}>${piene}<circle cx="${CX}" cy="${CY}" r="22" class="m-fuso contorno"/></g>
  <g${anim({ op: [0, 0, 0, 1] }, { op: 0 })}>${finite}</g>
</g>
<g${anim({ op: [0, 1, 0, 0] })}><circle cx="${CX}" cy="${CY}" r="22" class="m-fuso contorno"/>${etichetta({ testo: 'metallo versato nel canale centrale', tx: 570, ty: 60 })}</g>
${C.rotazione({ id, cx: 600, cy: 300, r: 22 })}
${etichetta({ testo: 'rotazione ad alta velocità', tx: 570, ty: 350 })}
${etichetta({ testo: 'Stampo in silicone (metà superiore)', tx: 570, ty: 110 })}
${etichetta({ testo: 'Cavità e canali radiali', tx: 570, ty: 150 })}
${etichetta({ testo: 'il metallo è spinto verso l\'esterno', tx: 570, ty: 190, extra: anim({ op: [0, 0, 1, 0] }) })}
`;
}

const pz = (d) => `<path d="${d}" class="m-finito contorno"/>`;
const coppie = {
  carichi: {
    ok: ['Pezzi non sollecitati, o rinforzati', 'Con bassa pressione e metalli bassofondenti i pezzi sono più porosi e meno resistenti: si aumentano gli spessori e si aggiungono nervature.', () => pz('M10,90 H150 V100 H10 Z M40,90 V58 H50 V90 Z M75,90 V58 H85 V90 Z M110,90 V58 H120 V90 Z')],
    ko: ['Parte sottile e sotto carico', 'Un pezzo sottile e senza rinforzi non sopporta carichi elevati.', () => `${pz('M10,90 H150 V96 H10 Z')}<path d="M10,92 Q80,118 150,92" fill="none" stroke="var(--ko)" stroke-width="2" stroke-dasharray="4 3"/>`],
  },
  spessore: {
    ok: ['Pareti fra 0,25 e 12 mm (silicone)', 'Negli stampi in silicone lo spessore va da 0,25 a 12 mm; i salti di spessore non creano problemi seri.', () => pz('M15,40 H145 V100 H120 V60 H40 V100 H15 Z')],
    ko: ['Oltre i 12 mm nello stampo in silicone', 'Spessori maggiori richiedono stampi metallici.', () => `${pz('M15,20 H145 V100 H15 Z')}<circle cx="80" cy="60" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  piombo: {
    ok: ['Peltro senza piombo per cibi e bevande', 'Metallo bianco e peltro sono leghe di piombo, salvo il peltro British Standard: per oggetti a contatto con cibi e bevande si evita il piombo.', () => `<path d="M50,20 H110 L104,100 H56 Z" class="m-finito contorno"/>${C.etichetta({ testo: 'senza piombo', tx: 80, ty: 106, ancora: 'middle' })}`],
    ko: ['Lega al piombo in un bicchiere', 'Il piombo, ingerito in quantità sufficiente, danneggia il sistema nervoso.', () => `<path d="M50,20 H110 L104,100 H56 Z" class="m-finito contorno"/><circle cx="80" cy="60" r="22" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  singola: ['Colata orizzontale, cavità singola', 'Per pezzi più grandi lo stampo contiene un solo pezzo attorno al canale centrale.', (id) => `<circle cx="110" cy="62" r="56" fill="url(#${id}-tratteggio)" class="contorno"/><circle cx="110" cy="62" r="34" class="m-fuso contorno"/><circle cx="110" cy="62" r="10" class="cavita contorno"/>`],
  verticale: ['Colata verticale a stampo aperto', 'Lo stampo metallico ruota attorno a un solo asse e il metallo forma uno strato sulla parete: tubi, volani, recipienti a pressione, vetro da tavola. Simile allo stampaggio rotazionale, ma su un asse.', (id) => `
    <path d="M60,10 V114 H160 V10 H146 V100 H74 V10 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    <path d="M74,20 V100 H146 V20 H136 V90 H84 V20 Z" class="m-fuso contorno"/>
    <line x1="110" y1="0" x2="110" y2="124" class="asse"/>`],
};

module.exports = { viewBox: '0 20 820 360', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 128 } };
