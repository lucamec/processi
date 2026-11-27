// Schema animato e mini-diagrammi: Elettrolucidatura (Thompson 2007, pp. 384–387).
// A sinistra la vasca (pezzo anodo); a destra il profilo superficiale: le creste si sciolgono prima delle valli.
// Fasi: 1 montaggio, 2 elettrolucidatura, 3 neutralizzazione e risciacquo, 4 asciugatura.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const profilo = (a, b) => { let d = 'M450,240'; for (let i = 0; i <= 30; i++) { const x = 450 + i * 10.6, y = 240 - (i % 3 === 1 ? a : i % 3 === 2 ? b : 0); d += ` L${x},${y}`; } return d + ' V290 H450 Z'; };

function schema(id) {
  return `
<!-- vasca -->
<path d="M60,120 V330 H380 V120" fill="none" stroke="var(--testo)" stroke-width="5"/>
<rect x="66" y="140" width="308" height="186" fill="#8fc48a" fill-opacity="0.3"${anim({ op: [1, 1, 0, 0] }, { op: 1 })}/>
<rect x="66" y="140" width="308" height="186" style="fill:var(--flusso)" fill-opacity="0.15"${anim({ op: [0, 0, 1, 0] }, { op: 0 })}/>
<rect x="90" y="100" width="20" height="200" class="scuro"/><rect x="330" y="100" width="20" height="200" class="scuro"/>
${etichetta({ testo: 'Catodi (−)', tx: 60, ty: 90 })}
<g${anim({ ty: [-110, 0, 0, -110] }, { ty: -110 })}>
  <line x1="220" y1="40" x2="220" y2="160" stroke="var(--testo)" stroke-width="3"/>
  <path d="M180,160 H260 L240,260 H200 Z" fill="#b8bec6" class="contorno"/>
</g>
${etichetta({ testo: 'Pezzo in inox: anodo (+)', tx: 240, ty: 90 })}
${etichetta({ testo: 'Acido fosforico e solforico, 50–90 °C', tx: 70, ty: 350 })}
<!-- profilo ingrandito -->
<rect x="440" y="150" width="340" height="150" fill="none" stroke="var(--testo)" stroke-dasharray="4 3"/>
<path d="${profilo(40, 22)}" fill="#b8bec6" stroke="var(--testo)" stroke-width="1.5"${anim({ op: [1, 0, 0, 0] }, { op: 1 })}/>
<path d="${profilo(14, 8)}" fill="#c8ccd2" stroke="var(--testo)" stroke-width="1.5"${anim({ op: [0, 1, 1, 0] }, { op: 0 })}/>
<path d="${profilo(14, 8)}" fill="#c8ccd2" stroke-width="2" style="stroke:var(--finito)"${anim({ op: [0, 0, 0, 1] }, { op: 0 })}/>
<g${anim({ op: [0, 1, 0, 0] })}>${[460, 492, 524, 556, 588].map((x) => `<circle cx="${x + 12}" cy="186" r="3" style="fill:var(--fuso)"/>`).join('')}</g>
${etichetta({ testo: 'Profilo della superficie (ingrandito)', tx: 450, ty: 140 })}
<g${anim({ op: [1, 0, 0, 0] })}>${etichetta({ testo: 'il pezzo si monta su un telaio che porta la corrente', tx: 20, ty: 30 })}</g>
<g${anim({ op: [0, 1, 0, 0] })}>${etichetta({ testo: 'le creste, dove la densità di corrente è maggiore, si sciolgono prima delle valli', tx: 20, ty: 30 })}</g>
<g${anim({ op: [0, 0, 1, 0] })}>${etichetta({ testo: 'neutralizzazione e risciacqui', tx: 20, ty: 30 })}</g>
<g${anim({ op: [0, 0, 0, 1] })}>${etichetta({ testo: 'asciugatura: superficie brillante, pulita e passivata', tx: 20, ty: 30 })}</g>
`;
}

const coppie = {
  preparazione: {
    ok: ['Superficie preparata', 'Il risultato dipende dalla superficie di partenza: i getti, per esempio, si sabbiano prima per una finitura uniforme.', () => `<path d="M20,70 l10,-4 l10,4 l10,-4 l10,4 l10,-4 l10,4 l10,-4 l10,4 l10,-4 l10,4 l10,-4 l10,4 V96 H20 Z" fill="#c8ccd2" class="contorno"/>`],
    ko: ['Graffi profondi e segni di utensili', 'Graffi profondi e segni di lavorazione non spariscono: la superficie più brillante li mette anzi in risalto.', () => `<path d="M20,70 H70 L76,88 L82,70 H140 V96 H20 Z" fill="#c8ccd2" class="contorno"/><circle cx="76" cy="80" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  asportazione: {
    ok: ['Asportazioni piccole', 'Di solito si tolgono al massimo 40–50 µm: una superficie ruvida si addolcisce ma non scompare. Le bave, che sono creste, spariscono subito.', () => `<path d="M20,70 q10,-10 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 V96 H20 Z" fill="#c8ccd2" class="contorno"/><path d="M20,66 q10,-6 20,0 t20,0 t20,0 t20,0 t20,0 t20,0" fill="none" style="stroke:var(--finito)" stroke-width="2"/>`],
    ko: ['Superficie molto ruvida', 'Una finitura grezza non diventa liscia: resta ondulata anche dopo il trattamento.', () => `<path d="M20,80 l10,-26 l10,26 l10,-26 l10,26 l10,-26 l10,26 l10,-26 l10,26 l10,-26 l10,26 l10,-26 l10,26 V96 H20 Z" fill="#c8ccd2" class="contorno"/><circle cx="80" cy="66" r="18" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  metallo: {
    ok: ['Un metallo per impianto', 'Ogni impianto è impostato per un materiale: metalli diversi non si lucidano insieme né nella stessa soluzione.', () => `${[30, 70, 110].map((x) => `<rect x="${x}" y="40" width="26" height="50" fill="#c8ccd2" class="contorno"/>`).join('')}`],
    ko: ['Metalli diversi nello stesso bagno', 'Mescolare acciaio, rame e alluminio nello stesso bagno non funziona.', () => `<rect x="30" y="40" width="26" height="50" fill="#c8ccd2" class="contorno"/><rect x="70" y="40" width="26" height="50" fill="#c27a4a" class="contorno"/><rect x="110" y="40" width="26" height="50" fill="#e0e4ea" class="contorno"/><circle cx="83" cy="65" r="30" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  sbavatura: ['Sbavatura', 'Le bave sono creste e si sciolgono molto in fretta: il processo sbava senza sforzi meccanici, anche su pezzi delicati, e riduce l\'attrito fra superfici accoppiate come le filettature.', () => `
    <rect x="30" y="50" width="160" height="40" fill="#c8ccd2" class="contorno"/><path d="M190,50 l10,-10 l-4,10 Z" fill="var(--ko)"/><path d="M190,50 l10,-10" stroke="var(--testo)" stroke-dasharray="2 2"/>`],
  passivazione: ['Passivazione dell\'inox', 'Il ferro si scioglie più facilmente degli altri elementi: resta uno strato ricco di cromo che si ossida e protegge l\'acciaio dalla corrosione, così brillante da sembrare cromato.', () => `
    <rect x="30" y="60" width="160" height="40" fill="#b8bec6" class="contorno"/><rect x="30" y="52" width="160" height="8" fill="#e8f0f8" stroke="var(--testo)" stroke-width="0.5"/>`],
  igienica: ['Superfici igieniche', 'Le micro-cavità dove si annidano batteri e sporco si aprono, e la sterilizzazione è più efficace: per farmaceutica, alimentare e ospedali.', () => `
    <path d="M20,70 q10,-6 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 V100 H20 Z" fill="#c8ccd2" class="contorno"/>`],
};

module.exports = { viewBox: '0 10 820 350', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
