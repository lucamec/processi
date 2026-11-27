// Schema animato e mini-diagrammi: Brasatura dolce e forte (Thompson 2007, pp. 312–315).
// Sezione assiale di un giunto a manicotto fra due tubi, brasato a cannello.
// Fasi: 1 flusso, 2 assemblaggio, 3 riscaldamento, 4 apporto per capillarità, 5 pulitura.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const RAME = '#c27a4a';
const capil = (y) => `<path d="M${300},${y} H${520}" pathLength="100" stroke-dasharray="100 100" stroke-width="5" fill="none" style="stroke:#d9dde2"${anim({ dash: [100, 100, 100, 0, 0] }, { dash: 100 })}/>`;

function schema(id) {
  return `
<line x1="100" y1="200" x2="720" y2="200" class="asse"/>
<!-- manicotto -->
<rect x="300" y="140" width="220" height="16" fill="${RAME}" class="contorno"/><rect x="300" y="244" width="220" height="16" fill="${RAME}" class="contorno"/>
<!-- tubo che entra -->
<g${anim({ tx: [0, 0, 0, 0, 0] }, { tx: -160 })}>
  <rect x="120" y="158" width="380" height="12" fill="${RAME}" class="contorno"/><rect x="120" y="230" width="380" height="12" fill="${RAME}" class="contorno"/>
</g>
<rect x="520" y="158" width="200" height="12" fill="${RAME}" class="contorno"/><rect x="520" y="230" width="200" height="12" fill="${RAME}" class="contorno"/>
${etichetta({ testo: 'Manicotto: la sovrapposizione dà una grande superficie di giunto', tx: 20, ty: 100 })}
<!-- flusso -->
<g${anim({ op: [1, 1, 1, 0, 0] }, { op: 0 })}><rect x="300" y="155" width="220" height="3" style="fill:var(--grezzo)"/><rect x="300" y="242" width="220" height="3" style="fill:var(--grezzo)"/></g>
<g${anim({ op: [1, 0, 0, 0, 0] })}>${etichetta({ testo: 'pasta di flusso: superficie pulita e senza ossidi', tx: 20, ty: 330 })}</g>
<!-- capillarità del metallo d'apporto -->
${capil(156)}${capil(244)}
<!-- cannello -->
<g${anim({ op: [0, 0, 1, 1, 0] }, { op: 0 })}>
  <path d="M600,40 L540,100" stroke="var(--testo)" stroke-width="12"/>
  <path d="M540,100 L500,140 L520,130 L515,150 Z" style="fill:var(--flusso)" opacity="0.7"/>
  <path d="M530,108 Q500,120 504,148" fill="none" stroke="var(--fuso)" stroke-width="6"/>
</g>
<rect x="296" y="136" width="228" height="128" style="fill:var(--fuso)" fill-opacity="0.12"${anim({ op: [0, 0, 1, 1, 0] }, { op: 0 })}/>
<!-- bacchetta d'apporto -->
<g${anim({ op: [0, 0, 0, 1, 0], tx: [0, 0, 0, -20, -20] }, { op: 0, tx: 0 })}><line x1="560" y1="70" x2="526" y2="134" stroke="#d9dde2" stroke-width="6"/></g>
<g${anim({ op: [0, 0, 1, 0, 0] })}>${etichetta({ testo: 'il cannello scalda il giunto oltre la fusione della lega d\'apporto', tx: 20, ty: 330 })}</g>
<g${anim({ op: [0, 0, 0, 1, 0] })}>${etichetta({ testo: 'la lega fusa viene risucchiata nella fessura per capillarità', tx: 20, ty: 330 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${etichetta({ testo: 'il metallo base non fonde: niente ZTA; basta una leggera pulitura', tx: 20, ty: 330 })}</g>
`;
}

const coppie = {
  superficie: {
    ok: ['Giunto a sovrapposizione', 'L\'interfaccia del giunto deve essere la più ampia possibile: sovrapposizioni e manicotti.', () => `<rect x="20" y="50" width="80" height="14" fill="${RAME}" class="contorno"/><rect x="60" y="64" width="80" height="14" fill="${RAME}" class="contorno"/><rect x="60" y="62" width="40" height="4" fill="#d9dde2"/>`],
    ko: ['Giunto di testa, a T o a becco di flauto', 'Questi giunti offrono poca superficie e non sono in genere adatti.', () => `<rect x="20" y="56" width="60" height="14" fill="${RAME}" class="contorno"/><rect x="82" y="56" width="60" height="14" fill="${RAME}" class="contorno"/><circle cx="81" cy="63" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  fessura: {
    ok: ['Fessura sottile e regolare', 'Una piccola luce fra i pezzi permette la risalita capillare; il giunto non deve combaciare perfettamente.', () => `<rect x="20" y="40" width="120" height="20" fill="${RAME}" class="contorno"/><rect x="20" y="64" width="120" height="20" fill="${RAME}" class="contorno"/><rect x="20" y="60" width="120" height="4" fill="#d9dde2"/>`],
    ko: ['Fessura troppo larga', 'Una luce più ampia si colma comunque, ma il giunto perde resistenza.', () => `<rect x="20" y="30" width="120" height="20" fill="${RAME}" class="contorno"/><rect x="20" y="74" width="120" height="20" fill="${RAME}" class="contorno"/><rect x="20" y="50" width="120" height="24" fill="#d9dde2" opacity="0.6"/><circle cx="80" cy="62" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  lega: {
    ok: ['Lega d\'apporto compatibile', 'La lega (argento, ottone, stagno, rame, nichel) si sceglie compatibile con il metallo base; determina anche resistenza e temperatura di servizio.', () => `<rect x="20" y="50" width="120" height="30" fill="${RAME}" class="contorno"/><rect x="20" y="62" width="120" height="6" fill="#d9dde2"/>`],
    ko: ['Lega non compatibile o superficie sporca', 'Senza compatibilità metallurgica e bagnatura la lega non aderisce: contaminazione e tensione superficiale la ostacolano.', () => `<rect x="20" y="50" width="120" height="30" fill="${RAME}" class="contorno"/>${[40, 70, 100, 125].map((x) => `<circle cx="${x}" cy="46" r="6" fill="#d9dde2" stroke="var(--testo)"/>`).join('')}<circle cx="80" cy="46" r="20" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  conduzione: ['A conduzione', 'Un saldatore scalda il giunto e la lega si aggiunge a filo o in bacchetta; tipico dei componenti a foro passante sui circuiti stampati.', () => `
    <rect x="20" y="80" width="180" height="14" class="m-finito contorno"/><rect x="104" y="40" width="10" height="54" class="m-stampo contorno"/>
    <path d="M40,20 L96,70" stroke="var(--testo)" stroke-width="8"/><path d="M180,30 L118,74" stroke="#d9dde2" stroke-width="4"/>`],
  forno: ['In forno', 'Tutto il pezzo si scalda fino alla fusione della lega, spesso su nastro trasportatore o in atmosfera protettiva: molti giunti insieme, per la produzione di massa.', () => `
    <rect x="30" y="20" width="160" height="70" fill="none" stroke="var(--fuso)" stroke-width="3" stroke-dasharray="6 4"/>
    <rect x="10" y="94" width="200" height="10" class="scuro"/>${[50, 100, 150].map((x) => `<rect x="${x}" y="70" width="30" height="24" class="m-stampo contorno"/>`).join('')}`],
  pcb: ['A onda e a rifusione', 'Per i circuiti stampati: le schede passano in un bagno di flusso e poi in un\'onda di lega, oppure si serigrafa una pasta di lega e flusso e si cuoce, centinaia di giunti in una passata.', () => `
    <rect x="20" y="40" width="180" height="12" class="m-finito contorno"/>${[50, 90, 130, 170].map((x) => `<rect x="${x}" y="28" width="14" height="12" class="scuro"/>`).join('')}
    <path d="M10,90 Q60,60 110,80 T210,80 V112 H10 Z" fill="#d9dde2" class="contorno"/>`],
};

module.exports = { viewBox: '0 20 820 330', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
