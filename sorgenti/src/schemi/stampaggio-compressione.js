// Schema animato e mini-diagrammi: Stampaggio a compressione (Thompson 2007, pp. 44–49).
// Schema principale: plastica termoindurente con stampo a carrelli laterali (p. 48).
// Fasi: 1 carico, 2 chiusura e compressione, 3 polimerizzazione, 4 apertura ed estrazione.
'use strict';
const C = require('../componenti');
const { anim, stampo, pezzo, freccia, calore, etichetta } = C;

const PEZZO = 'M300,170 H316 V254 H504 V170 H520 V270 H300 Z';

function schema(id) {
  return `
<!-- Pressa: piano fisso -->
<rect x="200" y="300" width="420" height="22" class="macchina"/>
${etichetta({ testo: 'Piano fisso', tx: 630, ty: 316 })}

<!-- Stampo inferiore fisso -->
${stampo({ id, x: 300, y: 270, w: 220, h: 30 })}
${etichetta({ testo: 'Stampo inferiore', tx: 630, ty: 290 })}

<!-- Estrattore -->
<g${anim({ ty: [0, 0, 0, -44] }, { ty: 0 })}>
  <rect x="404" y="271" width="12" height="40" class="scuro"/>
</g>
${etichetta({ testo: 'Estrattore', tx: 330, ty: 345, px: 410, py: 312 })}

<!-- Carrelli laterali -->
<g${anim({ tx: [0, 0, 0, -60] }, { tx: 0 })}>${stampo({ id, x: 230, y: 150, w: 70, h: 150 })}</g>
<g${anim({ tx: [0, 0, 0, 60] }, { tx: 0 })}>${stampo({ id, x: 520, y: 150, w: 70, h: 150 })}</g>
${etichetta({ testo: 'Carrelli laterali', tx: 40, ty: 220, px: 232, py: 220 })}

<!-- Carica: pastiglia preriscaldata a circa 100 °C -->
<rect x="340" y="236" width="140" height="34" rx="6" class="m-grezzo contorno"${anim({ ty: [0, 0, 0, 0], op: [1, 0, 0, 0] }, { ty: -90, op: 1 })}/>
${etichetta({ testo: 'Pastiglia di polvere', tx: 40, ty: 262, px: 342, py: 252, extra: anim({ op: [1, 0, 0, 0] }, { op: 1 }) })}

<!-- Materiale che riempie la cavità e polimerizza -->
<clipPath id="${id}-flusso" clipPathUnits="userSpaceOnUse"><rect x="290" y="160" width="240" height="112"${anim({ sy: [0, 1, 1, 1] }, { sy: 0 }, [0, 272])}/></clipPath>
<g${anim({ ty: [0, 0, 0, -44] }, { ty: 0 })}>
  <g clip-path="url(#${id}-flusso)">${pezzo({ d: PEZZO, materiale: 'fuso', extra: anim({ op: [1, 1, 0, 0] }, { op: 1 }) })}</g>
  ${pezzo({ d: PEZZO, materiale: 'finito', extra: anim({ op: [0, 0, 1, 1] }, { op: 0 }) })}
</g>

<!-- Stampo superiore (punzone) e pistone -->
<g${anim({ ty: [-120, 0, 0, -120] }, { ty: -120 })}>
  <rect x="380" y="0" width="60" height="60" class="macchina"/>
  <path d="M230,60 H590 V100 H504 V254 H316 V100 H230 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
  <g${anim({ op: [0, 1, 1, 0] })}>${freccia({ id, x1: 410, y1: -40, x2: 410, y2: 2 })}</g>
</g>
${etichetta({ testo: 'Punzone (stampo superiore)', tx: 600, ty: 90 })}
${etichetta({ testo: 'Pistone idraulico', tx: 630, ty: 30 })}

<!-- Calore dai piani riscaldati -->
<g${anim({ op: [0.3, 1, 1, 0.3] })}>
  ${[260, 560].map((x) => calore({ id, x, y: 336, lungo: 30, dir: -1 })).join('')}
  ${etichetta({ testo: 'piani riscaldati: ≈ 115 °C fusione, 150 °C indurimento', tx: 40, ty: 380 })}
</g>
`;
}

const coppie = {
  spessore: {
    ok: ['Sezioni spesse svuotate', 'Le parti massicce vengono svuotate o completate con inserti: meno materiale e niente bolle.', () => pezzo({ d: 'M15,30 H145 V100 H15 Z M35,50 H70 V100 H35 Z M90,50 H125 V100 H90 Z' })],
    ko: ['Sezione piena molto spessa', 'Per la reazione esotermica le sezioni spesse tendono a formare bolle e altri difetti.', () => `${pezzo({ d: 'M15,30 H145 V100 H15 Z' })}${[[50, 60], [95, 72], [70, 85]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff" stroke="var(--ko)" stroke-width="2"/>`).join('')}`],
  },
  sfiati: {
    ok: ['Sfiati per i gas', 'Lo stampo ha sfiati e nervature studiate per far uscire i gas prodotti durante l\'indurimento.', (id) => `<path d="M10,20 H150 V100 H10 Z M30,40 H130 V80 H30 Z" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno"/>${pezzo({ d: 'M30,40 H130 V80 H30 Z' })}<rect x="128" y="57" width="22" height="5" class="cavita"/>${freccia({ id, x1: 130, y1: 60, x2: 156, y2: 60, tipo: 'vuoto' })}`],
    ko: ['Gas intrappolati', 'Senza sfiati i gas restano nella cavità e lasciano vuoti nel pezzo.', (id) => `<path d="M10,20 H150 V100 H10 Z M30,40 H130 V80 H30 Z" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno"/>${pezzo({ d: 'M30,40 H130 V80 H30 Z' })}<circle cx="118" cy="50" r="7" fill="#fff" stroke="var(--ko)" stroke-width="2"/>`],
  },
  altezza: {
    ok: ['Geometria a lastra', 'Con stampi multipli per lastre (come le tastiere in silicone) il materiale si distribuisce facilmente.', () => pezzo({ d: 'M10,70 H150 V84 H10 Z M30,56 H50 V70 H30 Z M70,56 H90 V70 H70 Z M110,56 H130 V70 H110 Z' })],
    ko: ['Cavità alta e stretta', 'In una cavità alta è praticamente impossibile spingere il materiale fino in fondo.', () => `${pezzo({ d: 'M10,90 H150 V100 H10 Z M74,10 H86 V90 H74 Z' })}<circle cx="80" cy="14" r="9" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  gomma: {
    ok: ['Gomma: sformo nullo e piccoli sottosquadri', 'La gomma è flessibile: si stira sul nucleo, quindi si può eliminare lo sformo e fare piccoli rientri.', () => pezzo({ d: 'M20,30 H140 V100 H124 V60 L118,50 H42 L36,60 V100 H20 Z' })],
    ko: ['Termoindurente rigido con sottosquadro', 'Un materiale rigido non si deforma: un rientro richiede carrelli laterali nello stampo.', () => `${pezzo({ d: 'M20,30 H140 V100 H124 V60 L118,50 H42 L36,60 V100 H20 Z' })}<circle cx="38" cy="56" r="9" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  gomma: ['Compressione della gomma', 'La gomma condizionata viene messa nello stampo inferiore; le due metà si chiudono sotto pressione e calore e dopo circa 10 minuti la gomma è vulcanizzata. Le linee di strappo staccano la bava in modo pulito.', (id) => `
    ${stampo({ id, x: 20, y: 10, w: 180, h: 34 })}${stampo({ id, x: 20, y: 76, w: 180, h: 34 })}
    <path d="M20,44 H200 V76 H20 Z" class="m-finito contorno"/>
    ${[50, 95, 140].map((x) => `<rect x="${x}" y="30" width="26" height="14" class="m-finito contorno"/>`).join('')}
    ${[46, 91, 136, 170].map((x) => `<line x1="${x}" y1="44" x2="${x}" y2="76" stroke="var(--ko)" stroke-width="2" stroke-dasharray="3 3"/>`).join('')}
    ${etichetta({ testo: 'linee di strappo', tx: 110, ty: 122, ancora: 'middle' })}`],
};

module.exports = { viewBox: '0 -80 820 470', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 128 } };
