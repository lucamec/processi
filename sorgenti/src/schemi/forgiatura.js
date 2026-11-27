// Schema animato e mini-diagrammi: Forgiatura (Thompson 2007, pp. 114–119).
// Schema principale: stampaggio a caldo (drop forging) di un tappo. Fasi: 1 billetta a 1250 °C,
// 2 sbozzatura a stampo aperto, 3 stampaggio a stampo chiuso, 4 sbavatura.
'use strict';
const C = require('../componenti');
const { anim, calore, etichetta } = C;

const BILLETTA = 'M380,150 H440 V250 H380 Z';
const SBOZZO = 'M350,200 H470 V250 H350 Z';
const FORGIATO = 'M300,236 H340 V214 Q340,206 348,206 H472 Q480,206 480,214 V236 H520 V242 H480 V252 H340 V242 H300 Z';
const SBAVATO = 'M340,214 Q340,206 348,206 H472 Q480,206 480,214 V252 H340 Z';
const p = (d, mat, extra = '') => `<path d="${d}" class="m-${mat} contorno"${extra}/>`;

function schema(id) {
  return `
<!-- stampo inferiore: piano (fasi 1–2) e con cavità (fasi 3–4) -->
<rect x="250" y="252" width="320" height="70" fill="url(#${id}-tratteggio)" class="contorno"${anim({ op: [1, 1, 0, 0] }, { op: 1 })}/>
<path d="M250,242 H336 V252 H484 V242 H570 V322 H250 Z" fill="url(#${id}-tratteggio)" class="contorno"${anim({ op: [0, 0, 1, 1] }, { op: 0 })}/>
${etichetta({ testo: 'Stampo inferiore (incudine)', tx: 590, ty: 300 })}

<!-- pezzo -->
${p(BILLETTA, 'fuso', anim({ op: [1, 0, 0, 0] }, { op: 1 }))}
${p(SBOZZO, 'fuso', anim({ op: [0, 1, 0, 0] }, { op: 0 }))}
${p(FORGIATO, 'fuso', anim({ op: [0, 0, 1, 0] }, { op: 0 }))}
<g${anim({ op: [0, 0, 0, 1] }, { op: 0 })}>${p(SBAVATO, 'finito sezionato')}
  <path d="M300,236 H336 V242 H300 Z M484,236 H520 V242 H484 Z" class="m-finito contorno" opacity=".35"/>
  ${etichetta({ testo: 'bava tranciata', tx: 590, ty: 230 })}</g>
${etichetta({ testo: 'Billetta "rosso ciliegia" (≈ 1250 °C)', tx: 30, ty: 150, px: 378, py: 170, extra: anim({ op: [1, 0, 0, 0] }, { op: 1 }) })}
${etichetta({ testo: 'Bava', tx: 30, ty: 236, px: 300, py: 238, extra: anim({ op: [0, 0, 1, 0] }) })}
<g${anim({ op: [1, 0, 0, 0] })}>${[360, 460].map((x) => calore({ id, x, y: 120, lungo: 26 })).join('')}</g>

<!-- maglio con stampo superiore: piatto (fase 2), con cavità (fase 3) -->
<g${anim({ ty: [-110, 0, 0, -110], vy: [0, 14, 14, 0] }, { ty: -110 })}>
  <rect x="380" y="20" width="60" height="60" class="macchina"/>
  <rect x="250" y="80" width="320" height="70" fill="url(#${id}-tratteggio)" class="contorno"${anim({ op: [1, 1, 0, 0], ty: [0, 50, 0, 0] }, { op: 1 })}/>
  <path d="M250,80 H570 V236 H484 V214 Q484,202 472,202 H348 Q336,202 336,214 V236 H250 Z" fill="url(#${id}-tratteggio)" class="contorno"${anim({ op: [0, 0, 1, 1] }, { op: 0 })}/>
</g>
${etichetta({ testo: 'Maglio con stampo superiore', tx: 590, ty: 60 })}
`;
}

const pz = (d, extra = '') => `<path d="${d}" class="m-finito contorno"${extra}/>`;
const coppie = {
  sottosquadri: {
    ok: ['Nessun sottosquadro nello stampo', 'I sottosquadri non si forgiano: si ottengono con operazioni di forgiatura successive.', () => pz('M30,100 V60 L50,30 H110 L130,60 V100 Z')],
    ko: ['Sottosquadro nello stampo', 'Uno stampo chiuso non può liberare un rientro.', () => `${pz('M30,100 V60 L50,30 H110 L130,60 V100 H110 V80 H50 V100 Z M50,80 L40,90')}<circle cx="45" cy="86" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  raggi: {
    ok: ['Raggi ampi, più grandi nelle parti profonde', 'I raggi favoriscono il flusso del metallo e riducono l\'usura; il raggio minimo cresce con la profondità della sporgenza.', () => pz('M20,100 V70 Q20,60 30,60 H60 Q66,60 66,52 V24 Q66,16 74,16 H86 Q94,16 94,24 V52 Q94,60 100,60 H130 Q140,60 140,70 V100 Z')],
    ko: ['Spigoli vivi', 'Gli spigoli vivi ostacolano il flusso e consumano lo stampo.', () => `${pz('M20,100 V60 H66 V16 H94 V60 H140 V100 Z')}<circle cx="66" cy="60" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  sporgenze: {
    ok: ['Sporgenze fino a 6 volte lo spessore', 'Martellando o pressando si ottengono sporgenze profonde, fino a 6 volte lo spessore del materiale.', () => `${pz('M20,100 V84 H70 V30 H90 V84 H140 V100 Z')}${C.etichetta({ testo: 'h ≤ 6 s', tx: 100, ty: 50 })}`],
    ko: ['Sporgenza troppo alta e sottile', 'Oltre questo rapporto il metallo non riempie la cavità.', () => `${pz('M20,100 V90 H76 V6 H84 V90 H140 V100 Z')}<circle cx="80" cy="10" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  aperto: ['Stampaggio a stampo aperto', 'Con stampi piatti o a V l\'operatore riposiziona il pezzo a ogni colpo: per allungare (stiratura), accorciare e ingrossare (ricalcatura) o preparare il pezzo; alberi e barre fino a 3 m.', (id) => `
    <rect x="40" y="8" width="140" height="26" fill="url(#${id}-tratteggio)" class="contorno"/>
    <rect x="40" y="94" width="140" height="26" fill="url(#${id}-tratteggio)" class="contorno"/>
    <rect x="20" y="40" width="180" height="48" rx="8" class="m-fuso contorno"/>`],
  pressa: ['Forgiatura alla pressa', 'Come lo stampaggio a caldo, ma il metallo è spinto nella cavità da una pressione idraulica continua; si lavora anche a freddo per pezzi fino a 10 kg quasi finiti.', (id) => `
    <path d="M30,10 H190 V40 H140 V56 H80 V40 H30 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    <path d="M30,110 H190 V80 H140 V64 H80 V80 H30 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    <rect x="80" y="56" width="60" height="8" class="m-fuso"/>
    ${C.freccia({ id, x1: 110, y1: -6, x2: 110, y2: 8 })}`],
  rulli: ['Laminazione-forgiatura', 'Barre o piatti passano fra rulli sagomati che riducono la sezione per gradi: profili continui e anelli senza saldatura, fino a 8,5 m di diametro.', (id) => `
    <circle cx="110" cy="30" r="24" fill="url(#${id}-tratteggio)" class="contorno"/><circle cx="110" cy="96" r="24" fill="url(#${id}-tratteggio)" class="contorno"/>
    <path d="M10,48 H86 L110,56 H210 V70 H110 L86,78 H10 Z" class="m-fuso contorno"/>`],
};

module.exports = { viewBox: '0 -100 820 440', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
