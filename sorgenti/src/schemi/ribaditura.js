// Schema animato e mini-diagrammi: Ribaditura a caldo (Thompson 2007, pp. 316–319).
// Schema principale: ribaditura ad aria calda, in sezione. Fasi: 1 assemblaggio, 2 aria calda,
// 3 formatura con punzone freddo, 4 ritorno.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

function schema(id) {
  return `
<!-- maschera e pezzo stampato con il perno -->
<rect x="200" y="290" width="420" height="30" class="macchina"/>
<path d="M240,250 H580 V290 H240 Z" class="m-grezzo contorno"/>
<!-- perno: diritto, poi testa a cupola -->
<rect x="398" y="160" width="24" height="90" class="m-grezzo contorno"${anim({ op: [1, 1, 0, 0], sy: [1, 1, 0.5, 0.5] }, { op: 1, sy: 1 }, [410, 250])}/>
<g${anim({ op: [0, 0, 1, 1] }, { op: 0 })}>
  <rect x="398" y="210" width="24" height="40" class="m-grezzo contorno"/>
  <path d="M378,212 Q410,176 442,212 Z" class="m-finito contorno"/>
</g>
<rect x="398" y="160" width="24" height="60" style="fill:var(--fuso)" fill-opacity="0.6"${anim({ op: [0, 1, 0, 0] }, { op: 0 })}/>
${etichetta({ testo: 'Pezzo stampato con perno termoplastico', tx: 20, ty: 300, px: 250, py: 270 })}
<!-- contatto metallico forato -->
<g${anim({ ty: [0, 0, 0, 0] }, { ty: -80 })}>
  <path d="M260,212 H396 V226 H260 Z M424,212 H560 V226 H424 Z" class="m-stampo contorno"/>
</g>
${etichetta({ testo: 'Contatto metallico forato', tx: 580, ty: 220 })}
<!-- ugello aria calda -->
<g${anim({ op: [0, 1, 0, 0] }, { op: 0 })}>
  <path d="M470,90 L436,150" stroke="var(--testo)" stroke-width="14"/>
  <path d="M436,150 L420,170 L446,166 Z" style="fill:var(--fuso)" fill-opacity="0.5"/>
  ${etichetta({ testo: 'getto d\'aria calda alla temperatura di plastificazione', tx: 450, ty: 100 })}
</g>
<!-- punzone freddo con testa sagomata -->
<g${anim({ ty: [-80, -80, 0, -80] }, { ty: -80 })}>
  <rect x="384" y="60" width="52" height="110" class="m-stampo contorno"/>
  <path d="M378,170 H442 V212 Q410,176 378,212 Z" fill="url(#${id}-tratteggio)" class="contorno"/>
</g>
${etichetta({ testo: 'Punzone freddo con testa a cupola', tx: 470, ty: 66 })}
<g${anim({ op: [0, 0, 1, 0] })}>${freccia({ id, x1: 460, y1: 80, x2: 460, y2: 130 })}${etichetta({ testo: 'forma e raffredda il perno insieme', tx: 470, ty: 150 })}</g>
<g${anim({ op: [0, 0, 0, 1] })}>${etichetta({ testo: 'giunto serrato e senza vibrazioni, come un rivetto', tx: 470, ty: 150 })}</g>
`;
}

const coppie = {
  allineamento: {
    ok: ['Perni allineati in verticale', 'I perni devono avere la stessa direzione, quella di sformatura dello stampo, per essere formati in un solo colpo.', () => `<rect x="20" y="70" width="120" height="20" class="m-grezzo contorno"/>${[45, 80, 115].map((x) => `<rect x="${x - 5}" y="40" width="10" height="30" class="m-grezzo contorno"/>`).join('')}`],
    ko: ['Perni con direzioni diverse', 'Un perno inclinato richiede un secondo colpo e azioni complesse dello stampo.', () => `<rect x="20" y="70" width="120" height="20" class="m-grezzo contorno"/><rect x="40" y="40" width="10" height="30" class="m-grezzo contorno"/><rect x="100" y="42" width="10" height="30" class="m-grezzo contorno" transform="rotate(35 105 70)"/><circle cx="112" cy="54" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  diametro: {
    ok: ['Perni tondi da 0,5 a 5 mm', 'La resistenza dipende dal diametro del perno e dal materiale; perni rettangolari o cavi possono essere più grandi, con pareti sottili.', () => `<rect x="20" y="70" width="120" height="20" class="m-grezzo contorno"/><rect x="72" y="36" width="16" height="34" class="m-grezzo contorno"/>${C.etichetta({ testo: 'Ø 0,5–5 mm', tx: 94, ty: 46 })}`],
    ko: ['Perno pieno troppo grosso', 'Un perno pieno e massiccio non si scalda e non si forma bene.', () => `<rect x="20" y="70" width="120" height="20" class="m-grezzo contorno"/><rect x="55" y="20" width="50" height="50" class="m-grezzo contorno"/><circle cx="80" cy="45" r="28" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  aspetto: {
    ok: ['Giunti nascosti all\'interno', 'L\'aspetto della testa non è controllabile: i giunti sono di solito interni, dove non conta.', () => `<path d="M20,30 H140 V100 H20 Z" fill="none" stroke="var(--testo)" stroke-width="4"/><path d="M60,92 Q80,74 100,92 Z" class="m-finito contorno"/>`],
    ko: ['Ribattino in vista su una superficie estetica', 'Su una faccia a vista la testa formata può avere un aspetto irregolare.', () => `<rect x="20" y="60" width="120" height="20" class="m-grezzo contorno"/><path d="M60,60 Q80,36 104,60 Z" class="m-finito contorno"/><circle cx="82" cy="50" r="22" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  ultrasuoni: ['Ribaditura a ultrasuoni', 'Un\'unica fase: il sonotrodo scalda il perno con le vibrazioni e lo forma con la pressione, in 0,5–2 secondi. Più sonotrodi su un booster lavorano insieme.', () => `
    <rect x="30" y="90" width="160" height="20" class="m-grezzo contorno"/><rect x="40" y="76" width="140" height="14" class="m-stampo contorno"/>
    <rect x="102" y="40" width="16" height="50" class="m-grezzo contorno"/><path d="M90,10 H130 V40 Q110,26 90,40 Z" class="m-stampo contorno"/>`],
  teste: ['Teste di forme diverse', 'Il perno ammorbidito si forma con testa a cupola, zigrinata, divisa o cava: l\'utensile si adatta all\'applicazione e al diametro.', () => `
    ${[40, 90, 140, 190].map((x, i) => `<rect x="${x - 6}" y="64" width="12" height="40" class="m-grezzo contorno"/>${i === 0 ? `<path d="M${x - 16},64 Q${x},44 ${x + 16},64 Z" class="m-finito contorno"/>` : i === 1 ? `<rect x="${x - 16}" y="54" width="32" height="10" class="m-finito contorno"/>` : i === 2 ? `<path d="M${x - 16},64 L${x - 4},50 L${x},62 L${x + 4},50 L${x + 16},64 Z" class="m-finito contorno"/>` : `<path d="M${x - 16},64 V54 H${x + 16} V64 Z M${x - 6},54 V64 H${x + 6} V54 Z" class="m-finito contorno" fill-rule="evenodd"/>`}`).join('')}`],
  tenuta: ['Giunti a tenuta', 'Molti perni formati insieme coprono grandi aree; stringendo una guarnizione di gomma nell\'assieme si ottengono tenute all\'acqua.', () => `
    <rect x="30" y="80" width="160" height="20" class="m-grezzo contorno"/><rect x="40" y="70" width="140" height="10" style="fill:var(--flusso)"/><rect x="40" y="60" width="140" height="10" class="m-stampo contorno"/>
    ${[60, 110, 160].map((x) => `<rect x="${x - 5}" y="48" width="10" height="32" class="m-grezzo contorno"/><path d="M${x - 12},50 Q${x},38 ${x + 12},50 Z" class="m-finito contorno"/>`).join('')}`],
};

module.exports = { viewBox: '0 40 820 300', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
