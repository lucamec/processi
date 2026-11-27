// Schema animato e mini-diagrammi: Pressofusione (Thompson 2007, pp. 124–129).
// Schema principale: alta pressione a camera fredda. Fasi: 1 dosaggio, 2 iniezione, 3 solidificazione,
// 4 apertura ed estrazione, 5 sbavatura.
'use strict';
const C = require('../componenti');
const { anim, stampo, pezzo, freccia, etichetta } = C;

const PEZZO = 'M600,130 H520 V270 H600 V256 H534 V144 H600 Z';
const CANALE = 'M470,196 H520 V204 H470 Z';

function schema(id) {
  return `
<!-- cilindro di iniezione (camera fredda) -->
<rect x="180" y="184" width="290" height="32" class="cavita"/>
${stampo({ id, x: 180, y: 170, w: 290, h: 14 })}${stampo({ id, x: 180, y: 216, w: 290, h: 14 })}
<rect x="300" y="168" width="40" height="18" class="cavita"/>
${etichetta({ testo: 'Cilindro di iniezione', tx: 190, ty: 260 })}
<!-- metallo nel cilindro -->
<g${anim({ tx: [0, 120, 120, 120, 120], op: [1, 0, 0, 0, 0] }, { op: 0 })}><rect x="340" y="190" width="120" height="24" class="m-fuso"/></g>
<!-- pistone -->
<g${anim({ tx: [0, 125, 125, 0, 0] }, { tx: 0 })}>
  <rect x="190" y="186" width="148" height="28" class="m-stampo contorno"/><rect x="80" y="194" width="110" height="12" class="macchina"/>
</g>
${etichetta({ testo: 'Pistone', tx: 80, ty: 180 })}
<g${anim({ op: [0, 1, 1, 0, 0] })}>${freccia({ id, x1: 60, y1: 240, x2: 140, y2: 240 })}${etichetta({ testo: 'alta pressione', tx: 60, ty: 262 })}</g>
<!-- crogiolo (fase 1) -->
<g${anim({ op: [1, 0, 0, 0, 0] }, { op: 1 })}>
  <path d="M290,70 H360 L350,120 H300 Z" class="macchina"/><rect x="304" y="96" width="42" height="20" class="m-fuso"/>
  <line x1="320" y1="120" x2="320" y2="186" stroke="var(--fuso)" stroke-width="6"/>
  ${etichetta({ testo: 'Crogiolo: dose di alluminio fuso', tx: 370, ty: 90 })}
</g>

<!-- semistampo fisso -->
${stampo({ id, x: 470, y: 90, w: 50, h: 220 })}
<rect x="470" y="196" width="50" height="8" class="cavita"/>
${etichetta({ testo: 'Stampo fisso', tx: 460, ty: 330 })}
<clipPath id="${id}-riempi" clipPathUnits="userSpaceOnUse"><rect x="470" y="90" width="140" height="220"${anim({ sx: [0, 1, 1, 1, 1] }, { sx: 0 }, [470, 200])}/></clipPath>
<g clip-path="url(#${id}-riempi)"><path d="${CANALE}" class="m-fuso"${anim({ op: [1, 1, 0, 0, 0] }, { op: 1 })}/></g>
<path d="${CANALE}" class="m-finito"${anim({ op: [0, 0, 1, 0, 0] }, { op: 0 })}/>

<!-- gruppo mobile -->
<g${anim({ tx: [0, 0, 0, 110, 110] }, { tx: 0 })}>
  <path d="M520,90 H660 V310 H520 Z ${PEZZO}" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno"/>
  ${[[560, 110], [560, 290], [580, 200]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" class="m-flusso"${anim({ op: [0.25, 0.25, 1, 0.25, 0.25] })}/>`).join('')}
  <rect x="660" y="70" width="22" height="260" class="macchina"/>
  ${etichetta({ testo: 'Stampo mobile', tx: 540, ty: 80 })}
  <g${anim({ tx: [0, 0, 0, -40, -40] }, { tx: 0 })}><rect x="600" y="130" width="60" height="8" class="scuro"/><rect x="600" y="262" width="60" height="8" class="scuro"/></g>
  <g${anim({ tx: [0, 0, 0, -40, -40] }, { tx: 0 })}>
    <g clip-path="url(#${id}-riempi)">${pezzo({ d: PEZZO, materiale: 'fuso', extra: anim({ op: [1, 1, 0, 0, 0] }, { op: 1 }) })}</g>
    ${pezzo({ d: PEZZO, materiale: 'finito', extra: anim({ op: [0, 0, 1, 1, 1] }, { op: 0 }) })}
    <g${anim({ op: [0, 0, 0, 1, 0] }, { op: 0 })}><rect x="506" y="194" width="16" height="12" class="m-finito contorno"/>${etichetta({ testo: 'bava e canali da tranciare', tx: 480, ty: 360 })}</g>
  </g>
</g>
${etichetta({ testo: 'Canali di raffreddamento ad acqua', tx: 550, ty: 36, extra: anim({ op: [0, 0, 1, 0, 0] }) })}
`;
}

const pz = (d) => `<path d="${d}" class="m-finito contorno"/>`;
const coppie = {
  sformo: {
    ok: ['Sformo di circa 1,5°', 'Come nello stampaggio a iniezione, le pareti hanno uno sformo; di solito 1,5° basta.', (id) => `<path d="M10,20 H150 V100 H10 Z M45,100 L52,40 H108 L115,100 Z" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno"/>${pz('M45,100 L52,40 H108 L115,100 Z')}${C.etichetta({ testo: '1,5°', tx: 118, ty: 70 })}`],
    ko: ['Pareti senza sformo', 'Senza sformo il getto fatica a staccarsi dallo stampo d\'acciaio.', (id) => `<path d="M10,20 H150 V100 H10 Z M48,100 V40 H112 V100 Z" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno"/>${pz('M48,100 V40 H112 V100 Z')}${C.etichetta({ testo: '0°', tx: 118, ty: 70 })}`],
  },
  dimensione: {
    ok: ['Pezzi piccoli e medi', 'Il processo conviene soprattutto per pezzi piccoli: oltre i 9 kg lo stampo d\'acciaio diventa enorme e costoso.', () => `${pz('M50,50 H110 V90 H50 Z')}${C.etichetta({ testo: '≤ 9 kg', tx: 80, ty: 108, ancora: 'middle' })}`],
    ko: ['Pezzo molto grande', 'Per getti grandi e pesanti conviene la fusione in sabbia.', () => `${pz('M5,20 H155 V100 H5 Z')}${C.etichetta({ testo: '> 9 kg', tx: 80, ty: 66, ancora: 'middle' })}`],
  },
  fori: {
    ok: ['Fori ottenuti nello stampo', 'I fori formati direttamente nel getto riducono materiale e lavorazioni.', (id) => `${pz('M15,40 H145 V90 H15 Z')}<circle cx="55" cy="65" r="10" class="cavita contorno"/><circle cx="105" cy="65" r="10" class="cavita contorno"/>`],
    ko: ['Carrelli e anime ovunque', 'Ogni carrello laterale o anima aumenta molto il costo dello stampo: va giustificato da un vantaggio (resistenza, spessori ridotti).', (id) => `${pz('M15,40 H145 V90 H15 Z')}<rect x="145" y="55" width="14" height="20" class="m-stampo contorno"/><rect x="0" y="55" width="14" height="20" class="m-stampo contorno"/><circle cx="80" cy="65" r="22" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  alta: ['Alta pressione', 'Il metallo è spinto ad alta pressione da un pistone; nel metodo a camera calda è pompato direttamente dal forno, in quello a camera fredda un crogiolo lo versa nel cilindro. Pareti sottili e dettagli fini. È lo schema principale.', (id) => `
    <rect x="20" y="50" width="110" height="24" class="m-fuso contorno"/><rect x="0" y="54" width="30" height="16" class="m-stampo contorno"/>
    <rect x="130" y="20" width="70" height="84" fill="url(#${id}-tratteggio)" class="contorno"/>${C.freccia({ id, x1: 40, y1: 100, x2: 100, y2: 100 })}`],
  bassa: ['Bassa pressione', 'Lo stampo sta sopra il forno: la pressione del gas spinge il metallo su per un tubo nella cavità, con poca turbolenza e buone proprietà meccaniche. Adatta a pezzi simmetrici attorno a un asse verticale, come i cerchi in lega.', (id) => `
    <rect x="50" y="70" width="120" height="50" class="macchina"/><rect x="56" y="88" width="108" height="28" class="m-fuso"/>
    <rect x="104" y="40" width="12" height="50" class="m-fuso contorno"/>
    <path d="M40,10 H180 V40 H40 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${C.freccia({ id, x1: 150, y1: 80, x2: 150, y2: 96 })}`],
  gravita: ['Fusione in conchiglia (per gravità)', 'Come la fusione in sabbia, ma con stampi d\'acciaio permanenti, manuali o automatici; stampi e impianti costano meno ed è adatta a serie brevi.', (id) => `
    <path d="M60,10 H90 V30 H60 Z" class="macchina"/><line x1="75" y1="30" x2="75" y2="46" stroke="var(--fuso)" stroke-width="6"/>
    <path d="M30,46 H190 V120 H30 Z M60,46 H90 V60 H150 V100 H60 Z" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno"/>`],
};

module.exports = { viewBox: '0 20 820 360', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 128 } };
