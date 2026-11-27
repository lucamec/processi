// Schema animato e mini-diagrammi: Galvanostegia (Thompson 2007, pp. 364–367).
// Sezione di una vasca galvanica: anodi del metallo di rivestimento e pezzo collegato al negativo.
// Fasi: 1 pulizia, 2 montaggio, 3 deposizione, 4 lucidatura.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const ARG = '#d9dde2';

function schema(id) {
  return `
<path d="M120,110 V330 H620 V110" fill="none" stroke="var(--testo)" stroke-width="5"/>
<rect x="126" y="130" width="488" height="196" style="fill:var(--flusso)" fill-opacity="0.15"/>
${etichetta({ testo: 'Elettrolita con il metallo di rivestimento in forma di ioni', tx: 130, ty: 350 })}
<!-- anodi in cestelli forati -->
<rect x="150" y="100" width="40" height="200" fill="${ARG}" class="contorno"/><rect x="550" y="100" width="40" height="200" fill="${ARG}" class="contorno"/>
${etichetta({ testo: 'Anodi (+): si sciolgono e reintegrano gli ioni', tx: 20, ty: 80 })}
<!-- pezzo e filo -->
<g${anim({ ty: [-120, 0, 0, -120], vx: [0, 0, 4, 0] }, { ty: -120, vx: 0 })}>
  <line x1="370" y1="20" x2="370" y2="150" stroke="var(--testo)" stroke-width="2"/>
  <path d="M340,150 H400 V280 Q370,300 340,280 Z" fill="#b8a888" class="contorno"/>
  <path d="M340,150 H400 V280 Q370,300 340,280 Z" fill="none" stroke-width="6" style="stroke:${ARG}"${anim({ op: [0, 0, 1, 0] }, { op: 0 })}/>
  <path d="M340,150 H400 V280 Q370,300 340,280 Z" fill="none" stroke-width="6" style="stroke:var(--finito)"${anim({ op: [0, 0, 0, 1] }, { op: 0 })}/>
</g>
${etichetta({ testo: 'Pezzo (−), appeso a un filo o a un telaio', tx: 420, ty: 80 })}
<!-- ioni -->
<g${anim({ op: [0, 0, 1, 0] })}>
  ${[170, 210, 250].map((y) => freccia({ id, x1: 200, y1: y, x2: 330, y2: y + 10 })).join('')}
  ${[170, 210, 250].map((y) => freccia({ id, x1: 540, y1: y, x2: 410, y2: y + 10 })).join('')}
  ${etichetta({ testo: 'corrente continua: gli ioni si depositano sul pezzo', tx: 20, ty: 30 })}
</g>
<g${anim({ op: [1, 0, 0, 0] })}>${etichetta({ testo: 'sgrassaggio caldo e bagni che tolgono l\'ossido', tx: 20, ty: 30 })}</g>
<g${anim({ op: [0, 1, 0, 0] })}>${etichetta({ testo: 'il pezzo si collega al polo negativo e si immerge', tx: 20, ty: 30 })}</g>
<g${anim({ op: [0, 0, 0, 1] })}>${etichetta({ testo: 'lucidatura finale ("colouring over"): finitura riflettente', tx: 20, ty: 30 })}</g>
`;
}

const coppie = {
  superficie: {
    ok: ['Superficie lucidata prima', 'Lo strato è troppo sottile per nascondere graffi: la finitura dipende dalla superficie di partenza, che va lucidata.', () => `<rect x="20" y="60" width="120" height="30" fill="#b8a888" class="contorno"/><rect x="20" y="54" width="120" height="6" fill="${ARG}" stroke="var(--testo)" stroke-width="0.5"/>`],
    ko: ['Graffi sotto il rivestimento', 'I difetti del pezzo restano visibili sotto il metallo depositato.', () => `<path d="M20,60 l20,0 l4,6 l4,-6 l40,0 l4,6 l4,-6 l44,0 V90 H20 Z" fill="#b8a888" class="contorno"/><path d="M20,56 l20,0 l4,6 l4,-6 l40,0 l4,6 l4,-6 l44,0" fill="none" stroke="${ARG}" stroke-width="5"/><circle cx="44" cy="62" r="10" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  contatto: {
    ok: ['Contatto in un punto nascosto', 'Il telaio lascia un segno nel punto di contatto: si riduce toccando il pezzo fra due punti piccoli o in una zona non visibile; per piccole serie si usa il filo, agitando i pezzi.', () => `<rect x="40" y="40" width="80" height="60" fill="${ARG}" class="contorno"/><line x1="80" y1="100" x2="80" y2="120" stroke="var(--testo)" stroke-width="3"/>`],
    ko: ['Contatto sulla faccia a vista', 'Il segno del contatto resta non rivestito sulla parte in vista.', () => `<rect x="40" y="40" width="80" height="60" fill="${ARG}" class="contorno"/><circle cx="80" cy="60" r="4" fill="#b8a888"/><line x1="80" y1="10" x2="80" y2="56" stroke="var(--testo)" stroke-width="3"/><circle cx="80" cy="60" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  intermedio: {
    ok: ['Strato intermedio fra metalli incompatibili', 'Metalli che non si legano o si contaminano richiedono uno strato intermedio, per esempio nichel fra ottone e oro.', () => `<rect x="20" y="64" width="120" height="26" fill="#c9a24a" class="contorno"/><rect x="20" y="56" width="120" height="8" fill="#a8b0b8"/><rect x="20" y="50" width="120" height="6" fill="#e0c050"/>`],
    ko: ['Oro direttamente sull\'ottone', 'L\'ottone altera resistenza e durata della doratura.', () => `<rect x="20" y="64" width="120" height="26" fill="#c9a24a" class="contorno"/><rect x="20" y="58" width="120" height="6" fill="#e0c050"/><circle cx="80" cy="62" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  livellante: ['Strati livellanti di nichel e rame', 'Nichel e rame, depositati in quantità sufficiente, coprono piccole imperfezioni e danno una base liscia e brillante; il nichel intermedio arriva a 10 µm. Il cromo su nichel resta insuperato per brillantezza e durata.', () => `
    <path d="M20,90 l20,-6 l20,6 l20,-6 l20,6 l20,-6 l20,6 l20,-6 l20,6 l20,-6 V104 H20 Z" fill="#b8a888" class="contorno"/>
    <rect x="20" y="70" width="200" height="16" fill="#a8b0b8"/><rect x="20" y="64" width="200" height="6" fill="${ARG}" stroke="var(--testo)" stroke-width="0.5"/>`],
  plastica: ['Plastiche metallizzate', 'Alcune plastiche, soprattutto l\'ABS che sopporta i 60 °C del bagno, si rivestono dopo un primo strato chimico; non c\'è legame metallurgico, quindi la durata è minore.', () => `
    <rect x="20" y="60" width="200" height="34" class="m-grezzo contorno"/><rect x="20" y="54" width="200" height="6" fill="#c27a4a"/><rect x="20" y="48" width="200" height="6" fill="${ARG}" stroke="var(--testo)" stroke-width="0.5"/>`],
  brunitura: ['Brunitura dell\'argento', 'L\'argento si ossida: si annerisce chimicamente e poi si lucidano i rilievi, per far risaltare i dettagli nei gioielli.', () => `
    <path d="M20,90 V60 Q50,30 80,60 Q110,90 140,60 Q170,30 200,60 V90 Z" fill="#3a3e44" class="contorno"/>
    <path d="M38,44 Q50,30 62,44 M158,44 Q170,30 182,44" fill="none" stroke="${ARG}" stroke-width="6"/>`],
};

module.exports = { viewBox: '0 10 820 350', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
