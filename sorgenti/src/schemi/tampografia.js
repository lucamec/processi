// Schema animato e mini-diagrammi: Tampografia (Thompson 2007, pp. 404–407).
// A sinistra il cliché inciso, a destra il pezzo curvo; il tampone in silicone fa la spola.
// Fasi: 1 preparazione, 2 prelievo, 3 trasferimento, 4 stampa, 5 finito.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const INK = '#1d232b', SIL = '#d77a4a';
const XC = 230, XP = 560; // centri di cliché e pezzo

function schema(id) {
  // tampone: tx relativo alla posizione sopra il cliché; ty verso il basso; sy schiacciamento
  return `
<!-- cliché -->
<rect x="130" y="250" width="200" height="22" fill="#b8bec6" class="contorno"/>
<rect x="200" y="250" width="60" height="5" fill="#6a7078"/>
<rect x="200" y="250" width="60" height="5" fill="${INK}"${anim({ op: [1, 0, 1, 1, 1] }, { op: 0 })}/>
${etichetta({ testo: 'Cliché in acciaio, incisione poco profonda', tx: 40, ty: 300, px: 180, py: 272 })}
<!-- racla -->
<g${anim({ tx: [-120, -120, 0, 0, 0] }, { tx: 0 })}>
  <rect x="310" y="196" width="20" height="54" class="m-stampo contorno"/>
  <rect x="200" y="246" width="110" height="4" fill="${INK}" fill-opacity="0.5"${anim({ op: [0, 0, 1, 0, 0] }, { op: 1 })}/>
</g>
<!-- pezzo curvo -->
<path d="M460,272 V244 Q560,206 660,244 V272 Z" fill="#f4f4f0" class="contorno"/>
<path d="M530,230 Q560,222 590,230" fill="none" stroke="${INK}" stroke-width="4"${anim({ op: [0, 0, 0, 1, 1] }, { op: 0 })}/>
${etichetta({ testo: 'Pezzo con superficie curva', tx: 600, ty: 300, px: 640, py: 260 })}
<!-- tampone -->
<g${anim({ tx: [0, 0, XP - XC, XP - XC, 0], ty: [0, 60, 0, 64, 0] }, { tx: 0, ty: 0 })}>
  <rect x="${XC - 40}" y="96" width="80" height="22" class="m-macchina contorno"/>
  <g${anim({ sy: [1, 0.8, 1, 0.78, 1] }, { sy: 1 }, [XC, 118])}>
    <path d="M${XC - 70},118 H${XC + 70} Q${XC + 70},186 ${XC},190 Q${XC - 70},186 ${XC - 70},118 Z" fill="${SIL}" class="contorno"/>
  </g>
  <rect x="${XC - 30}" y="188" width="60" height="4" fill="${INK}"${anim({ op: [0, 1, 1, 0, 0] }, { op: 0 })}/>
</g>
${etichetta({ testo: 'Tampone in silicone', tx: 330, ty: 110 })}
<g${anim({ op: [1, 0, 0, 0, 0] })}>${etichetta({ testo: 'Il cliché si copre d\'inchiostro e la racla lo pulisce: resta solo nell\'incisione', tx: 120, ty: 350 })}</g>
<g${anim({ op: [0, 1, 0, 0, 0] })}>${etichetta({ testo: 'Il tampone preme sul cliché e preleva l\'inchiostro che sta asciugando', tx: 120, ty: 350 })}</g>
<g${anim({ op: [0, 0, 1, 0, 0] })}>${etichetta({ testo: 'Il tampone si sposta sul pezzo; la racla ricopre il cliché', tx: 120, ty: 350 })}</g>
<g${anim({ op: [0, 0, 0, 1, 0] })}>${etichetta({ testo: 'Compresso, il silicone avvolge la curva e cede tutto l\'inchiostro', tx: 120, ty: 350 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${etichetta({ testo: 'Pezzo stampato; il tampone torna al cliché. Cottura in forno 20–60 minuti', tx: 120, ty: 350 })}</g>
${freccia({ id, x1: 330, y1: 70, x2: 470, y2: 70 })}
`;
}

const coppie = {
  avvolgimento: {
    ok: ['Fino a metà del cilindro', 'Il tampone si deforma attorno al profilo, ma non oltre metà di un pezzo cilindrico.', () => `<circle cx="80" cy="70" r="26" fill="#f4f4f0" class="contorno"/><path d="M58,56 A26,26 0 0 1 102,56" fill="none" stroke="${INK}" stroke-width="4"/>`],
    ko: ['Tutto attorno al cilindro', 'Per stampare tutt\'intorno serve la tampografia rotativa.', () => `<circle cx="80" cy="70" r="26" fill="#f4f4f0" class="contorno"/><circle cx="80" cy="70" r="26" fill="none" stroke="${INK}" stroke-width="4" stroke-dasharray="60 30"/><circle cx="80" cy="70" r="36" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  formato: {
    ok: ['Grafica entro 100 × 100 mm', 'È il massimo che il tampone preleva dal cliché.', () => `<rect x="40" y="35" width="80" height="60" fill="none" stroke="var(--testo)" stroke-dasharray="4 3"/><rect x="55" y="50" width="50" height="30" fill="${INK}"/>`],
    ko: ['Grafiche più grandi', 'Superfici intere si coprono con la stampa idrografica.', () => `<rect x="40" y="35" width="80" height="60" fill="none" stroke="var(--testo)" stroke-dasharray="4 3"/><rect x="20" y="40" width="120" height="50" fill="${INK}" fill-opacity="0.8"/><circle cx="130" cy="65" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  superficie: {
    ok: ['Superfici che accettano l\'inchiostro', 'Quasi tutti i materiali; alcune plastiche vanno pretrattate.', () => `<rect x="20" y="60" width="120" height="30" fill="#f4f4f0" class="contorno"/><rect x="40" y="55" width="80" height="5" fill="${INK}"/>`],
    ko: ['PTFE e simili', 'Materiali antiaderenti quanto il silicone non ricevono l\'inchiostro.', () => `<rect x="20" y="60" width="120" height="30" fill="#e8eef2" class="contorno"/>${[44, 64, 84, 104].map((x) => `<circle cx="${x}" cy="54" r="4" fill="${INK}"/>`).join('')}<circle cx="80" cy="60" r="20" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  rotativa: ['Tampografia rotativa', 'Stampa in continuo su superfici ondulate e tutt\'intorno a pezzi cilindrici, come i flaconi di cosmetici.', () => `
    <circle cx="110" cy="64" r="30" fill="#f4f4f0" class="contorno"/>
    <circle cx="110" cy="64" r="30" fill="none" stroke="${INK}" stroke-width="4" stroke-dasharray="20 8"/>
    <path d="M150,30 A50,50 0 0 1 150,98" fill="none" stroke="var(--flusso)" stroke-width="2"/>`],
  bagnato: ['Più colori bagnato su bagnato', 'Il colore successivo si stampa sul precedente ancora bagnato: le macchine lavorano in tandem.', () => `
    <rect x="30" y="50" width="70" height="40" fill="#f4f4f0" class="contorno"/><rect x="120" y="50" width="70" height="40" fill="#f4f4f0" class="contorno"/>
    <rect x="45" y="62" width="40" height="8" fill="#3f8f8a"/><rect x="135" y="62" width="40" height="8" fill="#3f8f8a"/><rect x="135" y="72" width="40" height="8" fill="#f06a1d"/>`],
  palline: ['Superfici con alveoli', 'Si stampano palline da golf con le loro fossette, palloni da calcio, da baseball e da basket.', () => `
    <circle cx="110" cy="64" r="36" fill="#f4f4f0" class="contorno"/>
    ${[[96, 50], [120, 48], [104, 72], [126, 70], [90, 66]].map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="none" stroke="var(--testo)" stroke-width="0.8"/>`).join('')}
    <path d="M95,60 H125" stroke="${INK}" stroke-width="4"/>`],
};

module.exports = { viewBox: '0 50 820 320', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
