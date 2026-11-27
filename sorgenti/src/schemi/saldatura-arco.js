// Schema animato e mini-diagrammi: Saldatura ad arco (Thompson 2007, pp. 282–287).
// Schema principale: saldatura MIG vista di lato lungo il giunto. Fasi: 1 preparazione e messa a terra,
// 2 innesco dell'arco, 3 avanzamento con bagno protetto dal gas, 4 raffreddamento del cordone.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const cordone = (col, extra = '') => `<path d="M200,226 H600" pathLength="100" stroke-dasharray="100 100" stroke-width="12" stroke-linecap="round" fill="none" style="stroke:var(--${col})"${extra}/>`;

function schema(id) {
  return `
<!-- lamiere da unire e massa -->
<rect x="160" y="232" width="480" height="40" fill="url(#${id}-tratteggio)" class="contorno"/>
<rect x="120" y="272" width="560" height="12" class="macchina"/>
<rect x="640" y="240" width="40" height="24" class="scuro"/>
${etichetta({ testo: 'Morsetto di massa', tx: 600, ty: 310, px: 660, py: 264 })}
<!-- zona termicamente alterata -->
<rect x="200" y="232" width="400" height="18" style="fill:var(--fuso)" fill-opacity="0.18"${anim({ op: [0, 0, 1, 1] }, { op: 0 })}/>
<g${anim({ op: [0, 0, 0, 1] })}>${etichetta({ testo: 'zona termicamente alterata (ZTA) con tensioni residue', tx: 40, ty: 310, px: 260, py: 246 })}</g>
<!-- cordone: si deposita, poi si raffredda -->
${cordone('fuso', anim({ dash: [100, 100, 0, 0] }, { dash: 100 }))}
<path d="M200,226 H600" stroke-width="12" stroke-linecap="round" fill="none" style="stroke:var(--finito)"${anim({ op: [0, 0, 0, 1] }, { op: 0 })}/>
<!-- torcia MIG -->
<g${anim({ tx: [0, 0, 400, 400], ty: [-40, 0, 0, -60] }, { tx: 0, ty: -60 })}>
  <path d="M150,60 L190,170 H214 L180,60 Z" class="m-stampo contorno"/>
  <path d="M188,170 H216 L212,196 H192 Z" class="scuro"/>
  <line x1="202" y1="196" x2="202" y2="214" stroke="var(--grezzo)" stroke-width="3"/>
  <g${anim({ op: [0, 1, 1, 0] }, { op: 0 })}>
    <path d="M190,196 L170,224 H234 L214,196 Z" style="fill:var(--flusso)" opacity="0.25"/>
    <path d="M202,214 l-5,4 l8,2 l-6,5" fill="none" stroke="#ffffff" stroke-width="2.5"/>
    <circle cx="202" cy="222" r="9" style="fill:var(--fuso)" opacity="0.9"/>
  </g>
</g>
${etichetta({ testo: 'Torcia: filo-elettrodo continuo e gas di protezione', tx: 280, ty: 60 })}
<g${anim({ op: [0, 1, 0, 0] })}>${etichetta({ testo: 'l\'arco fra filo e pezzo fonde il giunto e il filo', tx: 280, ty: 150 })}</g>
<g${anim({ op: [0, 0, 1, 0] })}>${etichetta({ testo: 'il gas protegge il bagno di fusione dall\'aria', tx: 280, ty: 150 })}${freccia({ id, x1: 300, y1: 190, x2: 560, y2: 190 })}</g>
`;
}

const coppie = {
  accesso: {
    ok: ['Giunto raggiungibile', 'La saldatura richiede la vista diretta del giunto: saldatore o robot devono arrivarci.', (id) => `<path d="M20,90 H140 M80,90 V30" stroke="var(--testo)" stroke-width="8"/><path d="M84,86 l8,-8" stroke="var(--fuso)" stroke-width="6"/>${C.freccia({ id, x1: 130, y1: 30, x2: 96, y2: 74 })}`],
    ko: ['Giunto nascosto', 'Un giunto chiuso fra altre parti non si raggiunge con la torcia.', () => `<path d="M20,90 H140 M80,90 V30 M40,90 V50 H80" fill="none" stroke="var(--testo)" stroke-width="8"/><circle cx="72" cy="80" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  massa: {
    ok: ['Contatto di massa su metallo nudo', 'La corrente deve passare dal pezzo: il contatto di massa va su metallo pulito, vicino al giunto, lontano da parti delicate.', () => `<rect x="20" y="60" width="120" height="24" class="m-stampo contorno"/><rect x="118" y="50" width="20" height="16" class="scuro"/><path d="M128,50 V20" stroke="var(--testo)" stroke-width="3"/>`],
    ko: ['Pezzo verniciato o rivestito', 'Vernici e rivestimenti isolano il metallo e rendono la saldatura difficile o impossibile.', () => `<rect x="20" y="60" width="120" height="24" class="m-stampo contorno"/><rect x="20" y="54" width="120" height="6" style="fill:var(--finito)"/><rect x="118" y="40" width="20" height="14" class="scuro"/><circle cx="128" cy="56" r="13" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  materiali: {
    ok: ['Coppie di metalli compatibili', 'L\'acciaio al carbonio si salda all\'inox o alle leghe di nichel, l\'alluminio al magnesio.', (id) => `<rect x="20" y="50" width="60" height="30" class="m-stampo contorno"/><rect x="80" y="50" width="60" height="30" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M80,46 V84" stroke="var(--fuso)" stroke-width="6"/>`],
    ko: ['Titanio con altri metalli', 'Alcuni metalli, come il titanio, si saldano solo con lo stesso metallo.', (id) => `<rect x="20" y="50" width="60" height="30" class="m-stampo contorno"/><rect x="80" y="50" width="60" height="30" fill="url(#${id}-tratteggio)" class="contorno"/><circle cx="80" cy="65" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>${C.etichetta({ testo: 'Ti', tx: 40, ty: 104 })}`],
  },
};

const varianti = {
  mma: ['Elettrodo rivestito (MMA)', 'L\'elettrodo a bacchetta è rivestito di flusso, che fonde e forma gas e scoria protettivi. Portatile, adatto a cantieri e riparazioni; cordoni brevi e scoria da togliere fra una passata e l\'altra.', () => `
    <rect x="20" y="88" width="180" height="20" class="m-stampo contorno"/>
    <path d="M90,10 L110,80" stroke="var(--grezzo)" stroke-width="10"/><path d="M90,10 L110,80" stroke="var(--testo)" stroke-width="3"/>
    <path d="M60,88 Q90,80 112,86" stroke="#8a6a3a" stroke-width="8" fill="none"/>`],
  tig: ['TIG', 'Elettrodo di tungsteno non consumabile e gas inerte (argon, elio); il materiale d\'apporto è facoltativo. Preciso e pulito, ideale per lamiere sottili; è il processo principale per il titanio.', () => `
    <rect x="20" y="88" width="180" height="20" class="m-stampo contorno"/>
    <path d="M100,10 V70" stroke="var(--testo)" stroke-width="12"/><path d="M100,70 l-4,10 h8 Z" class="scuro"/>
    <path d="M150,40 L114,84" stroke="var(--grezzo)" stroke-width="3"/><circle cx="100" cy="86" r="7" style="fill:var(--fuso)"/>`],
  plasma: ['Plasma', 'Simile al TIG ma con un plasma a 3.000–6.000 °C: dal microplasma per reti e lamiere di 0,1 mm al "keyhole", che penetra fino a 6 mm in una passata.', () => `
    <rect x="20" y="88" width="180" height="20" class="m-stampo contorno"/>
    <path d="M86,10 H114 V60 L104,74 H96 L86,60 Z" class="m-stampo contorno"/><path d="M100,74 V104" stroke="var(--fuso)" stroke-width="5"/>`],
  sommerso: ['Arco sommerso (SAW)', 'L\'arco è coperto da uno strato di flusso granulare, posato davanti alla torcia e recuperato dietro: niente luce né spruzzi, rendimento termico del 50%. Solo in piano e meccanizzato.', () => `
    <rect x="20" y="88" width="180" height="20" class="m-stampo contorno"/>
    <path d="M40,88 Q110,62 180,88 Z" style="fill:var(--grezzo)"/><path d="M110,10 V70" stroke="var(--testo)" stroke-width="6"/>`],
};

module.exports = { viewBox: '0 20 820 310', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
