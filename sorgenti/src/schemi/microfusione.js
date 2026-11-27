// Schema animato e mini-diagrammi: Microfusione a cera persa (Thompson 2007, pp. 130–135).
// Fasi: 1 modelli in cera e albero, 2 rivestimento ceramico, 3 deceratura e cottura, 4 colata, 5 rottura del guscio.
'use strict';
const C = require('../componenti');
const { anim, calore, etichetta } = C;

const ALBERO = 'M392,60 H428 L420,86 V300 H400 V86 Z M330,126 H400 V150 H330 Z M420,126 H490 V150 H420 Z M330,226 H400 V250 H330 Z M420,226 H490 V250 H420 Z M318,118 h24 v40 h-24 Z M478,118 h24 v40 h-24 Z M318,218 h24 v40 h-24 Z M478,218 h24 v40 h-24 Z';
const PEZZI = 'M318,118 h24 v40 h-24 Z M478,118 h24 v40 h-24 Z M318,218 h24 v40 h-24 Z M478,218 h24 v40 h-24 Z M330,126 H400 V150 H330 Z M420,126 H490 V150 H420 Z M330,226 H400 V250 H330 Z M420,226 H490 V250 H420 Z';

function schema(id) {
  return `
<!-- guscio ceramico: cresce a ogni immersione -->
<path d="${ALBERO}" fill="none" stroke-linejoin="round" style="stroke:var(--stampo)"${anim({ sw: [0, 22, 22, 22, 0], op: [0, 1, 1, 1, 0] }, { sw: 0, op: 0 })}/>
<path d="${ALBERO}" class="cavita"${anim({ op: [0, 1, 1, 1, 0] }, { op: 0 })}/>
${etichetta({ testo: 'Guscio ceramico (7–15 strati)', tx: 560, ty: 120, px: 512, py: 130, extra: anim({ op: [0, 1, 1, 1, 0] }) })}
<!-- cera -->
<path d="${ALBERO}" class="m-grezzo contorno"${anim({ op: [1, 1, 0, 0, 0] }, { op: 1 })}/>
${etichetta({ testo: 'Albero di modelli in cera', tx: 560, ty: 220, px: 502, py: 230, extra: anim({ op: [1, 1, 0, 0, 0] }, { op: 1 }) })}
<!-- metallo che riempie dal basso -->
<clipPath id="${id}-livello" clipPathUnits="userSpaceOnUse"><rect x="300" y="50" width="220" height="260"${anim({ sy: [0, 0, 0, 1, 1] }, { sy: 0 }, [0, 310])}/></clipPath>
<g clip-path="url(#${id}-livello)"><path d="${ALBERO}" class="m-fuso contorno"${anim({ op: [1, 1, 1, 1, 0] }, { op: 1 })}/></g>
<g${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}>
  <path d="M392,60 H428 L420,86 V300 H400 V86 Z" class="m-finito contorno" opacity=".35"/>
  <g transform="translate(0 20)"><path d="${PEZZI}" class="m-finito contorno"/></g>
  ${etichetta({ testo: 'pezzi separati dal canale', tx: 560, ty: 280 })}
</g>
<!-- forno di cottura (fase 3) e colata (fase 4) -->
<g${anim({ op: [0, 0, 1, 0, 0] })}>
  <rect x="290" y="40" width="240" height="280" rx="12" fill="none" stroke="var(--testo-2)" stroke-width="2" stroke-dasharray="7 5"/>
  ${[330, 410, 490].map((x) => calore({ id, x, y: 350, lungo: 26, dir: -1 })).join('')}
  ${etichetta({ testo: 'cera fusa in autoclave, guscio cotto a 1095 °C', tx: 40, ty: 340 })}
</g>
<g${anim({ op: [0, 0, 0, 1, 0] })}>
  <path d="M370,4 H440 L432,36 H378 Z" class="macchina"/><line x1="410" y1="36" x2="410" y2="62" stroke="var(--fuso)" stroke-width="6"/>
  ${etichetta({ testo: 'colata nel guscio ancora rovente', tx: 460, ty: 24 })}
</g>
`;
}

const pz = (d) => `<path d="${d}" class="m-finito contorno"/>`;
const coppie = {
  pareti: {
    ok: ['Pareti adatte alla lega', 'Alluminio e zinco: di solito 2–3 mm (fino a 1,5 mm). Acciaio e leghe di rame: oltre 3 mm (2 mm su piccole zone).', () => `${pz('M15,40 H145 V90 H15 Z M27,52 H133 V90 H27 Z')}${C.etichetta({ testo: 'Al 2–3 mm · acciaio > 3 mm', tx: 80, ty: 106, ancora: 'middle' })}`],
    ko: ['Pareti troppo sottili per la lega', 'Una parete d\'acciaio sottile come quella di un getto in alluminio rischia di non riempirsi.', () => `${pz('M15,40 H145 V90 H15 Z M19,44 H141 V90 H19 Z')}<circle cx="145" cy="70" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  filetti: {
    ok: ['Filetti interni e fori ciechi lunghi dopo', 'Filettature interne e fori ciechi lunghi si ottengono solo con lavorazioni successive.', () => `${pz('M20,30 H140 V100 H20 Z')}<rect x="70" y="30" width="20" height="50" class="cavita contorno"/>${C.etichetta({ testo: 'lavorato dopo', tx: 80, ty: 22 })}`],
    ko: ['Foro cieco lungo nel getto', 'Un foro cieco lungo e stretto non si forma bene nella fusione.', () => `${pz('M20,30 H140 V100 H20 Z')}<rect x="76" y="30" width="8" height="64" class="cavita contorno"/><circle cx="80" cy="90" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  nervature: {
    ok: ['Nervature contro la deformazione', 'Come per gli altri getti, si nervano e rinforzano le parti per evitare deformazioni nel raffreddamento.', () => pz('M10,90 H150 V100 H10 Z M40,90 V60 H48 V90 Z M76,90 V60 H84 V90 Z M112,90 V60 H120 V90 Z')],
    ko: ['Lastra sottile senza rinforzi', 'Raffreddandosi una lastra sottile e libera tende a imbarcarsi.', () => `${pz('M10,90 H150 V100 H10 Z')}<path d="M10,88 Q80,66 150,88" fill="none" stroke="var(--ko)" stroke-width="2" stroke-dasharray="4 3"/>`],
  },
};

const varianti = {
  prototipo: ['Modelli da prototipazione rapida', 'Invece della cera iniettata si usano modelli in cera stampati in 3D, modelli plastici cavi, acrilici o lavorati di macchina: utili per prototipi e pezzi unici.', () => `
    ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="70" y="${100 - i * 12}" width="80" height="10" class="m-grezzo contorno"/>`).join('')}
    ${etichetta({ testo: 'modello costruito a strati', tx: 110, ty: 122, ancora: 'middle' })}`],
  solubili: ['Anime in cera solubile', 'Le forme interne complesse si ottengono con parti in cera solubile, stampate a parte e sovrastampate con cera normale; poi si sciolgono in acqua.', () => `
    <rect x="50" y="30" width="120" height="70" class="m-grezzo contorno"/>
    <rect x="80" y="50" width="60" height="30" fill="var(--flusso)" fill-opacity=".3" stroke="var(--flusso)" stroke-width="2"/>
    ${etichetta({ testo: 'cera solubile', tx: 110, ty: 122, ancora: 'middle' })}`],
};

module.exports = { viewBox: '0 0 820 370', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 128 } };
