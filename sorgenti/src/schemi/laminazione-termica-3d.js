// Schema animato e mini-diagrammi: Laminazione termica 3D (Thompson 2007, pp. 228–231).
// Sezione dello stampo maschio regolabile (3DL). Fasi: 1 forma dello stampo, 2 film PET teso,
// 3 posa delle fibre, 4 secondo film e sottovuoto, 5 cura termica e sformatura.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

const yC = (x, off = 0) => { const t = (x - 180) / 460; return 200 - 220 * t * (1 - t) - off; };
const curva = (off) => `M180,${200 - off} Q410,${90 - off} 640,${200 - off}`;
const RAMS = [200, 260, 320, 380, 440, 500, 560, 620];

function schema(id) {
  return `
<rect x="150" y="320" width="520" height="14" class="macchina"/>
<!-- pistoni pneumatici: da piatti a sagomati -->
<g${anim({ op: [0, 0, 0, 0, 0] }, { op: 1 })}>${RAMS.map((x) => `<rect x="${x - 7}" y="200" width="14" height="120" class="m-stampo contorno"/>`).join('')}
  <path d="M180,200 H640" fill="none" stroke="var(--testo)" stroke-width="6"/></g>
<g${anim({ op: [1, 1, 1, 1, 1] }, { op: 0 })}>${RAMS.map((x) => `<rect x="${x - 7}" y="${yC(x)}" width="14" height="${320 - yC(x)}" class="m-stampo contorno"/>`).join('')}
  <path d="${curva(0)}" fill="none" stroke="var(--testo)" stroke-width="6"/></g>
${etichetta({ testo: 'Pistoni pneumatici che danno forma allo stampo (da file CAD)', tx: 40, ty: 352 })}

<g${anim({ ty: [0, 0, 0, 0, -50] }, { ty: 0 })}>
  <!-- film PET inferiore -->
  <path d="${curva(6)}" fill="none" stroke-width="4" style="stroke:var(--grezzo)"${anim({ op: [0, 1, 1, 1, 0] }, { op: 0 })}/>
  <!-- fibre in sezione, posate una alla volta -->
  ${RAMS.map((x, i) => `<circle cx="${x + 20}" cy="${yC(x + 20, 11)}" r="4.5" style="fill:var(--fuso)"${anim({ op: [0, 0, 1, 1, 0] }, { op: 0 })}/>`).join('')}
  <!-- film superiore e sacco del vuoto -->
  <path d="${curva(16)}" fill="none" stroke-width="4" style="stroke:var(--grezzo)"${anim({ op: [0, 0, 0, 1, 0] }, { op: 0 })}/>
  <path d="${curva(24)}" fill="none" stroke-width="2" stroke-dasharray="6 4" style="stroke:var(--flusso)"${anim({ op: [0, 0, 0, 1, 0] }, { op: 0 })}/>
  <!-- vela finita -->
  <path d="${curva(10)}" fill="none" stroke-width="14" style="stroke:var(--finito)"${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}/>
</g>
<g${anim({ op: [0, 1, 0, 0, 0] })}>${etichetta({ testo: 'Film PET adesivo, messo in tensione', tx: 470, ty: 80 })}</g>
<g${anim({ op: [0, 0, 0, 1, 0] })}>${etichetta({ testo: 'Secondo film; sottovuoto a circa 8,6 N/cm²', tx: 470, ty: 80 })}
  ${freccia({ id, x1: 300, y1: 70, x2: 300, y2: 110 })}${freccia({ id, x1: 520, y1: 70, x2: 520, y2: 110 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${etichetta({ testo: 'vela laminata: forma di volo senza cuciture', tx: 470, ty: 80 })}</g>

<!-- portale a 6 assi con testa di posa -->
<g${anim({ op: [0, 0, 1, 0, 0], tx: [0, 0, 420, 420, 420] }, { op: 0, tx: 0 })}>
  <rect x="180" y="10" width="40" height="70" class="scuro"/>
  <path d="M200,80 V${yC(200, 14)}" stroke="var(--fuso)" stroke-width="3"/>
</g>
<g${anim({ op: [0, 0, 1, 0, 0] })}>${etichetta({ testo: 'Testa di posa su portale a 6 assi: fibre lungo le linee di carico', tx: 40, ty: 104 })}</g>
<!-- 5: calore -->
<g${anim({ op: [0, 0, 0, 0, 1] })}>
  <rect x="300" y="20" width="220" height="24" fill="none" stroke="var(--fuso)" stroke-width="3" stroke-dasharray="6 4"/>
  ${etichetta({ testo: 'coperta riscaldante o infrarossi', tx: 530, ty: 36 })}
</g>
`;
}

const ln = (d, col = 'finito', w = 5) => `<path d="${d}" fill="none" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round" style="stroke:var(--${col})"/>`;
const coppie = {
  trazione: {
    ok: ['Strutture in trazione', 'Le vele sono progettate per lavorare in tensione: il processo è adatto a membrane tese.', (id) => `${ln('M20,30 Q80,70 140,30', 'finito', 5)}${C.freccia({ id, x1: 30, y1: 30, x2: 6, y2: 24 })}${C.freccia({ id, x1: 130, y1: 30, x2: 154, y2: 24 })}`],
    ko: ['Elementi compressi', 'Non è adatto a pezzi che devono resistere a compressione: la membrana si affloscia.', (id) => `${ln('M30,60 Q60,40 80,70 Q100,100 130,60', 'finito', 5)}${C.freccia({ id, x1: 6, y1: 60, x2: 26, y2: 60 })}${C.freccia({ id, x1: 154, y1: 60, x2: 134, y2: 60 })}<circle cx="80" cy="70" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  linee: {
    ok: ['Fibre lungo le linee di carico', 'Le fibre continue seguono le linee di sforzo previste, con curve morbide che collegano le zone sollecitate.', () => `<path d="M20,110 L80,10 L140,110 Z" class="m-grezzo contorno"/>${[0, 1, 2, 3, 4].map((i) => ln(`M80,14 Q${60 + i * 10},70 ${30 + i * 25},108`, 'finito', 2)).join('')}`],
    ko: ['Pannelli tagliati e cuciti', 'Nella velatura tradizionale i pannelli si tagliano e si cuciono: fibre interrotte e cuciture, vele più pesanti.', () => `<path d="M20,110 L80,10 L140,110 Z" class="m-grezzo contorno"/>${[40, 60, 80].map((y) => `<line x1="${80 - (y - 10) * 0.6}" y1="${y}" x2="${80 + (y - 10) * 0.6}" y2="${y}" stroke="var(--ko)" stroke-width="2" stroke-dasharray="4 3"/>`).join('')}`],
  },
  spessore: {
    ok: ['Spessore variabile secondo l\'uso', 'Lo spessore non è uniforme: varia con l\'applicazione, aggiungendo fibre dove servono.', () => `<path d="M10,70 Q80,30 150,70 L150,80 Q80,50 10,90 Z" class="m-finito contorno"/>`],
    ko: ['Spessore sotto il minimo', 'Lo spessore minimo è fissato dai due film PET più le fibre: non si scende oltre.', () => `${ln('M10,70 Q80,40 150,70', 'finito', 1.5)}<circle cx="80" cy="55" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  tdl: ['Laminazione 3D su stampo fisso (3DL)', 'Stampi maschi orizzontali fino a 400 m², sagomati da pistoni pneumatici; fibre posate da un portale a 6 assi, sottovuoto e cura col calore. Ciclo fino a 5 giorni.', (id) => `
    <path d="M20,90 Q110,30 200,90 V110 H20 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${ln('M20,84 Q110,24 200,84', 'fuso', 5)}
    <rect x="96" y="0" width="28" height="20" class="scuro"/>`],
  tdr: ['Laminazione 3D rotativa (3Dr)', 'Un solo tamburo rotante con circa 2000 attuatori che lo curvano in due direzioni: la vela si forma mentre il tamburo gira ed esce finita, più in fretta e a costo minore.', (id) => `
    <circle cx="110" cy="62" r="44" fill="url(#${id}-tratteggio)" class="contorno"/>
    <path d="M66,62 A44,44 0 0 1 154,62" fill="none" stroke="var(--fuso)" stroke-width="6"/>
    ${ln('M154,62 Q190,70 214,100', 'finito', 5)}
    ${C.rotazione({ id, cx: 110, cy: 62, r: 16 })}`],
};

module.exports = { viewBox: '0 0 820 370', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
