// Schema animato e mini-diagrammi: Tessitura e intreccio (Thompson 2007, pp. 332–337).
// Sezione laterale di un telaio per tessuti rigidi. Fasi: 1 ordito nei licci, 2 apertura del passo,
// 3 inserimento della trama, 4 battuta, 5 incrocio dei licci.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
// il passo: i fili pari salgono e quelli dispari scendono al centro (x 420), si chiudono al tessuto (x 620)
const filo = (dy) => `M120,200 L420,${200 + dy} L620,200`;

function schema(id) {
  return `
<!-- subbio dell'ordito e tessuto già fatto -->
<circle cx="100" cy="200" r="30" class="m-grezzo contorno"/>
<rect x="620" y="190" width="160" height="20" class="m-grezzo contorno"/>
${[640, 660, 680, 700, 720, 740, 760].map((x) => `<circle cx="${x}" cy="200" r="5" style="fill:var(--finito)"/>`).join('')}
${etichetta({ testo: 'Tessuto', tx: 680, ty: 240 })}
${etichetta({ testo: 'Ordito (fili di carta ritorta, canna, salice…)', tx: 20, ty: 150 })}
<!-- fili d'ordito: pari e dispari -->
<path d="${filo(0)}" fill="none" stroke="var(--grezzo)" stroke-width="4"${anim({ op: [1, 0, 0, 0, 0] }, { op: 1 })}/>
<path d="${filo(-40)}" fill="none" stroke="#b8935a" stroke-width="4"${anim({ op: [0, 1, 1, 1, 0] }, { op: 0 })}/>
<path d="${filo(40)}" fill="none" stroke="var(--grezzo)" stroke-width="4"${anim({ op: [0, 1, 1, 1, 0] }, { op: 0 })}/>
<path d="${filo(40)}" fill="none" stroke="#b8935a" stroke-width="4"${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}/>
<path d="${filo(-40)}" fill="none" stroke="var(--grezzo)" stroke-width="4"${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}/>
<!-- licci -->
<g${anim({ ty: [0, -40, -40, -40, 40] }, { ty: 0 })}><rect x="400" y="80" width="8" height="240" class="m-stampo contorno"/><circle cx="404" cy="200" r="6" fill="none" stroke="var(--testo)" stroke-width="2"/></g>
<g${anim({ ty: [0, 40, 40, 40, -40] }, { ty: 0 })}><rect x="432" y="80" width="8" height="240" class="m-stampo contorno"/><circle cx="436" cy="200" r="6" fill="none" stroke="var(--testo)" stroke-width="2"/></g>
${etichetta({ testo: 'Licci: barre con occhielli, a pedale o comandate dal computer', tx: 300, ty: 60 })}
<!-- trama -->
<circle cx="540" cy="200" r="7" style="fill:var(--fuso)"${anim({ op: [0, 0, 1, 1, 1], tx: [0, 0, 0, 74, 74] }, { op: 0, tx: 0 })}/>
<g${anim({ op: [0, 0, 1, 0, 0] })}>${etichetta({ testo: 'la trama entra nel passo, davanti al pettine', tx: 300, ty: 350 })}</g>
<!-- pettine (battente) -->
<g${anim({ tx: [0, 0, 0, 64, 0] }, { tx: 0 })}><rect x="548" y="120" width="10" height="160" class="scuro"/></g>
${etichetta({ testo: 'Pettine', tx: 520, ty: 110 })}
<g${anim({ op: [0, 0, 0, 1, 0] })}>${freccia({ id, x1: 520, y1: 300, x2: 600, y2: 300 })}${etichetta({ testo: 'battuta: la trama si stringe contro il tessuto', tx: 300, ty: 350 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${etichetta({ testo: 'i licci si scambiano e bloccano la trama; si ripete per la passata successiva', tx: 200, ty: 350 })}</g>
<g${anim({ op: [0, 1, 0, 0, 0] })}>${etichetta({ testo: 'i licci aprono il passo fra i fili pari e dispari', tx: 300, ty: 350 })}</g>
`;
}

const ln = (d, col = 'grezzo', w = 6) => `<path d="${d}" fill="none" stroke-width="${w}" stroke-linecap="round" style="stroke:var(--${col})"/>`;
const coppie = {
  curva: {
    ok: ['Pannello curvato in una direzione', 'Il tessuto industriale arriva in pannelli piani: si curva bene in una sola direzione, o dolcemente su uno stampo.', () => `${[0, 1, 2, 3].map((i) => ln(`M20,${40 + i * 14} Q80,${10 + i * 14} 140,${40 + i * 14}`, 'grezzo', 4)).join('')}`],
    ko: ['Forzato in forme complesse', 'Spingere il pannello in profili complessi sposta le fibre: peggiorano resistenza e aspetto.', () => `${[0, 1, 2, 3].map((i) => ln(`M20,${40 + i * 14} Q50,${10 + i * 22} 80,${50 + i * 6} T140,${30 + i * 16}`, 'grezzo', 4)).join('')}<circle cx="80" cy="62" r="18" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  raggio: {
    ok: ['Raggio adatto al materiale', 'La canna si piega molto stretta; altri materiali meno flessibili richiedono raggi ampi, o forme intrecciate a mano o pannelli uniti.', () => ln('M30,100 V60 Q30,30 60,30 H130', 'grezzo', 8)],
    ko: ['Piega troppo stretta', 'Un materiale poco flessibile, piegato troppo, si spacca.', () => `${ln('M30,100 V36 L36,30 H130', 'grezzo', 8)}<circle cx="34" cy="32" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  protezione: {
    ok: ['Fibre naturali protette', 'Molti materiali sono naturali e vanno protetti dagli agenti esterni con una verniciatura trasparente o colorata.', () => `${[0, 1, 2].map((i) => ln(`M20,${50 + i * 16} H140`, 'grezzo', 8)).join('')}<rect x="16" y="40" width="128" height="52" fill="var(--flusso)" fill-opacity="0.18" stroke="var(--flusso)" stroke-dasharray="4 3"/>`],
    ko: ['Fibre esposte', 'Senza protezione le fibre naturali si degradano.', () => `${[0, 1, 2].map((i) => ln(`M20,${50 + i * 16} H140`, 'grezzo', 8)).join('')}<path d="M60,50 l6,6 l-4,6 l6,6" fill="none" stroke="var(--ko)" stroke-width="2"/><circle cx="64" cy="62" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const tess = (fn) => { let s = ''; for (let r = 0; r < 6; r++) for (let c = 0; c < 10; c++) s += `<rect x="${20 + c * 18}" y="${20 + r * 15}" width="18" height="15" fill="${fn(r, c) ? '#b8935a' : '#d8c08a'}" stroke="var(--testo)" stroke-width="0.5"/>`; return s; };
const varianti = {
  tela: ['Tela', 'Lo schema più semplice: "uno sopra, uno sotto".', () => tess((r, c) => (r + c) % 2 === 0)],
  saia: ['Saia (spina di pesce)', 'Disegno diagonale ottenuto incrociando due o più fili alla volta.', () => tess((r, c) => ((c - r) % 4 + 4) % 4 < 2)],
  raso: ['Raso', 'La trama o l\'ordito scavalcano cinque o più fili: superficie ricca di un solo filato e trama più fitta, ma meno stabile.', () => tess((r, c) => (c + r * 2) % 5 !== 0)],
  canna: ['Incannucciato', 'Il motivo ottagonale riproduce a telaio la tecnica manuale tradizionale in 7 passaggi; la canna, ammollata, si incastra in una scanalatura con un cordino e colla.', () => `
    ${[0, 1, 2, 3, 4].map((i) => `<line x1="${30 + i * 40}" y1="10" x2="${30 + i * 40}" y2="114" stroke="#d8c08a" stroke-width="4"/><line x1="10" y1="${22 + i * 22}" x2="210" y2="${22 + i * 22}" stroke="#d8c08a" stroke-width="4"/>`).join('')}
    ${[0, 1, 2, 3].map((i) => `<line x1="${10 + i * 50}" y1="10" x2="${110 + i * 50}" y2="114" stroke="#b8935a" stroke-width="3"/>`).join('')}`],
};

module.exports = { viewBox: '0 40 820 330', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
