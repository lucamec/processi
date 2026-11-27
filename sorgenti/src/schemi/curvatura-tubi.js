// Schema animato e mini-diagrammi: Curvatura di tubi e profilati (Thompson 2007, pp. 98–103).
// Schema principale: curvatura con mandrino, vista dall'alto. Fasi: 1 carico, 2 prima curva a 90°,
// 3 avanzamento e rotazione del tubo, 4 seconda curva, 5 scarico.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

const tubo = (d, col, extra = '') => `<g${extra}><path d="${d}" fill="none" stroke="var(--testo)" stroke-width="26" stroke-linejoin="round"/><path d="${d}" fill="none" stroke-width="22" stroke-linejoin="round" style="stroke:var(--${col})"/></g>`;
const DRITTO = 'M100,140 H560';
const CURVO = 'M100,140 H420 A60,60 0 0 1 480,200 V330';
const AVANZATO = 'M40,140 H420';
const CURVO2 = 'M40,140 H420 A60,60 0 0 1 480,200 V330';

function schema(id) {
  return `
<!-- matrice rotante: il suo raggio dà il raggio di curvatura -->
<g${anim({ rot: [0, 90, 0, 90, 0] }, { rot: 0 }, [420, 200])}>
  <circle cx="420" cy="200" r="58" fill="url(#${id}-tratteggio)" class="contorno"/>
  <rect x="436" y="118" width="90" height="12" fill="url(#${id}-tratteggio)" class="contorno"/>
  <rect x="436" y="150" width="90" height="12" fill="url(#${id}-tratteggio)" class="contorno"/>
</g>
${etichetta({ testo: 'Matrice rotante (raggio di curvatura)', tx: 560, ty: 250 })}
${etichetta({ testo: 'Morsa di serraggio', tx: 560, ty: 110 })}

<!-- tubo -->
${tubo(DRITTO, 'grezzo', anim({ op: [1, 0, 0, 0, 0] }, { op: 1 }))}
${tubo(CURVO, 'fuso', anim({ op: [0, 1, 0, 0, 0] }, { op: 0 }))}
<g${anim({ op: [0, 0, 1, 1, 0] }, { op: 0 })}><circle cx="70" cy="140" r="15" style="fill:var(--fuso)" stroke="var(--testo)" stroke-width="2"/></g>
${tubo(AVANZATO, 'fuso', anim({ op: [0, 0, 1, 0, 0] }, { op: 0 }))}
${tubo(CURVO2, 'fuso', anim({ op: [0, 0, 0, 1, 0] }, { op: 0 }))}
<g${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}>${tubo(CURVO2, 'finito')}<circle cx="40" cy="140" r="15" style="fill:var(--finito)" stroke="var(--testo)" stroke-width="2"/></g>
${etichetta({ testo: 'Tubo', tx: 100, ty: 110 })}
<g${anim({ op: [0, 0, 1, 0, 0] })}>
  ${C.rotazione({ id, cx: 240, cy: 140, r: 22 })}
  ${freccia({ id, x1: 180, y1: 190, x2: 120, y2: 190 })}
  ${etichetta({ testo: 'il tubo avanza e ruota sul proprio asse: la prima curva esce dal foglio (vedi vista 3D)', tx: 40, ty: 236 })}
</g>

<!-- mandrino interno e matrice di pressione -->
<line x1="330" y1="140" x2="426" y2="140" stroke="var(--testo)" stroke-width="6" stroke-dasharray="7 4"/>
${etichetta({ testo: 'Mandrino interno (evita lo schiacciamento)', tx: 100, ty: 330, px: 360, py: 146 })}
<g${anim({ tx: [0, 60, 0, 60, 0] }, { tx: 0 })}><rect x="300" y="104" width="110" height="16" class="m-stampo contorno"/></g>
${etichetta({ testo: 'Matrice di pressione (segue il tubo)', tx: 100, ty: 72, px: 330, py: 104 })}
`;
}

const ln = (d, w = 8, col = 'finito') => `<path d="${d}" fill="none" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" style="stroke:var(--${col})"/>`;
const coppie = {
  raggio: {
    ok: ['Raggio non inferiore a circa 50 mm', 'Con il mandrino il raggio minimo tipico è attorno ai 50 mm.', () => `${ln('M20,100 H60 A40,40 0 0 0 100,60 V10')}${C.etichetta({ testo: 'R ≈ 50 mm', tx: 102, ty: 96 })}`],
    ko: ['Curva troppo stretta', 'Sotto il raggio minimo la parete interna si raggrinza o il tubo si schiaccia.', () => `${ln('M20,100 H88 A8,8 0 0 0 96,92 V10')}<circle cx="92" cy="96" r="11" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  vicine: {
    ok: ['Curve ben distanziate', 'Fra una curva e l\'altra resta un tratto dritto che la macchina può afferrare.', () => ln('M10,100 H50 A20,20 0 0 0 70,80 V50 A20,20 0 0 1 90,30 H150')],
    ko: ['Curve troppo ravvicinate', 'Più curve vicine possono non stare nella macchina e non essere fattibili.', () => `${ln('M10,100 H60 A12,12 0 0 0 72,88 V82 A12,12 0 0 1 84,70 H150')}<circle cx="74" cy="84" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  sviluppo: {
    ok: ['Calcolare lo sviluppo reale', 'Il metallo si allunga all\'esterno della curva più di quanto si comprima all\'interno: il pezzo piegato risulta un po\' più lungo.', () => `${ln('M10,90 H60 A30,30 0 0 0 90,60 V20')}${C.etichetta({ testo: 'L reale > L disegno', tx: 50, ty: 106 })}`],
    ko: ['Taglio uguale alla quota del disegno', 'La lunghezza a disegno raramente corrisponde a quella del pezzo dopo la piegatura.', () => `${ln('M10,90 H60 A30,30 0 0 0 90,60 V20')}<line x1="90" y1="8" x2="90" y2="20" stroke="var(--ko)" stroke-width="3"/>`],
  },
};

const varianti = {
  mandrino: ['Curvatura con mandrino', 'Il tubo, con un mandrino all\'interno, viene trascinato su una matrice rotante: curve strette senza schiacciamento. È lo schema principale.', (id) => `
    <circle cx="110" cy="80" r="34" fill="url(#${id}-tratteggio)" class="contorno"/>
    ${ln('M20,46 H110 A34,34 0 0 1 144,80 V124', 12, 'fuso')}`],
  anello: ['Curvatura a rulli', 'Tubo, profilato o lamiera passano avanti e indietro fra tre rulli; uno si avvicina a ogni passata e stringe la curva. Raggi grandi, anche variabili, fino ad anelli completi.', (id) => `
    ${[[60, 90], [160, 90], [110, 40]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20" fill="url(#${id}-tratteggio)" class="contorno"/>`).join('')}
    ${ln('M10,96 Q110,52 210,96', 8, 'fuso')}
    ${C.freccia({ id, x1: 160, y1: 124, x2: 160, y2: 112 })}`],
};

module.exports = { viewBox: '0 40 820 320', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 130 } };
