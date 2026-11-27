// Schema animato e mini-diagrammi: Saldatura per attrito (Thompson 2007, pp. 294–297).
// Schema principale: saldatura rotativa (RFW), in sezione assiale.
// Fasi: 1 carico, 2 attrito, 3 pressione assiale, 4 rimozione della bava.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

function schema(id) {
  return `
<line x1="80" y1="200" x2="740" y2="200" class="asse"/>
<!-- mandrino rotante + pezzo sinistro -->
<rect x="80" y="130" width="90" height="140" class="macchina"/>
${C.rotazione({ id, cx: 125, cy: 200, r: 22 })}
<g${anim({ tx: [0, 0, 0, 0] }, { tx: -40 })}>
  <rect x="170" y="160" width="236" height="80" class="m-stampo contorno"/>
</g>
<!-- pezzo destro + mandrino fisso, spinto -->
<g${anim({ tx: [40, 0, -14, -14] }, { tx: 40 })}>
  <rect x="414" y="160" width="236" height="80" class="m-stampo contorno"/>
  <rect x="650" y="130" width="90" height="140" class="macchina"/>
  <g${anim({ op: [0, 1, 1, 0] })}>${freccia({ id, x1: 780, y1: 200, x2: 744, y2: 200 })}</g>
</g>
${etichetta({ testo: 'Mandrino rotante', tx: 60, ty: 116 })}${etichetta({ testo: 'Mandrino fisso', tx: 640, ty: 116 })}
<!-- interfaccia plastificata e bava -->
<rect x="396" y="160" width="20" height="80" style="fill:var(--fuso)"${anim({ op: [0, 1, 1, 0] }, { op: 0 })}/>
<g${anim({ op: [0, 0, 1, 0], sx: [0, 0, 1, 1] }, { op: 0, sx: 0 }, [406, 200])}>
  <path d="M388,160 Q406,132 424,160 Z M388,240 Q406,268 424,240 Z" style="fill:var(--fuso)"/>
</g>
<rect x="398" y="160" width="12" height="80" class="m-finito contorno"${anim({ op: [0, 0, 0, 1] }, { op: 0 })}/>
<g${anim({ op: [0, 1, 0, 0] })}>${etichetta({ testo: 'l\'attrito scalda e plastifica le facce, sotto la fusione', tx: 250, ty: 310 })}</g>
<g${anim({ op: [0, 0, 1, 0] })}>${etichetta({ testo: 'la rotazione si ferma, la spinta sale (~20 t): si forma la bava', tx: 250, ty: 310 })}</g>
<g${anim({ op: [0, 0, 0, 1] })}>${etichetta({ testo: 'la bava si toglie; il giunto ha la resistenza del materiale base', tx: 250, ty: 310 })}</g>
`;
}

const coppie = {
  simmetria: {
    ok: ['Almeno un pezzo simmetrico rispetto all\'asse', 'Nella saldatura rotativa almeno uno dei due pezzi deve poter ruotare attorno al proprio asse.', () => `<rect x="20" y="50" width="60" height="30" class="m-stampo contorno"/><rect x="80" y="40" width="60" height="50" class="m-stampo contorno"/><line x1="10" y1="65" x2="150" y2="65" class="asse"/>`],
    ko: ['Due pezzi asimmetrici', 'Pezzi irregolari non si fanno ruotare: servono la saldatura lineare o orbitale.', () => `<path d="M20,40 H80 V90 H50 Z" class="m-stampo contorno"/><path d="M80,40 H140 L120,90 H80 Z" class="m-stampo contorno"/><circle cx="80" cy="65" r="18" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  sezione: {
    ok: ['Giunto sotto i 2.000 mm²', 'Nelle tecniche rotativa, lineare e orbitale la superficie del giunto resta sotto circa 2.000 mm².', () => `<rect x="60" y="40" width="40" height="40" class="m-finito contorno"/>${C.etichetta({ testo: '< 2.000 mm²', tx: 80, ty: 104, ancora: 'middle' })}`],
    ko: ['Giunto troppo esteso', 'Una superficie di giunto molto grande supera le capacità delle macchine: si usa il friction stir lungo la linea.', () => `<rect x="20" y="20" width="120" height="90" class="m-finito contorno"/><circle cx="80" cy="65" r="30" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  piano: {
    ok: ['Pezzi che scorrono sul piano del giunto', 'I due pezzi devono potersi muovere l\'uno rispetto all\'altro sullo stesso piano del giunto.', (id) => `<rect x="20" y="40" width="60" height="50" class="m-stampo contorno"/><rect x="80" y="40" width="60" height="50" class="m-stampo contorno"/>${C.freccia({ id, x1: 110, y1: 30, x2: 110, y2: 10 })}${C.freccia({ id, x1: 110, y1: 100, x2: 110, y2: 120 })}`],
    ko: ['Giunto incastrato', 'Se una parte non può oscillare o ruotare sul piano del giunto, l\'attrito non si genera.', () => `<path d="M20,40 H90 V60 H70 V90 H20 Z" class="m-stampo contorno"/><path d="M90,40 H140 V90 H70 V60 H90 Z" class="m-stampo contorno"/><circle cx="80" cy="60" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  lineare: ['Lineare (LFW)', 'I pezzi oscillano uno contro l\'altro, fino a 75 Hz e ±3 mm, poi la spinta aumenta: per parti non rotonde, come pale di turbina, dischi freno, cerchioni; in sviluppo anche per quercia e faggio.', (id) => `
    <rect x="30" y="20" width="160" height="40" class="m-stampo contorno"/><rect x="30" y="64" width="160" height="40" class="m-stampo contorno"/>
    <rect x="30" y="58" width="160" height="8" style="fill:var(--fuso)"/>${C.freccia({ id, x1: 70, y1: 40, x2: 40, y2: 40 })}${C.freccia({ id, x1: 150, y1: 40, x2: 180, y2: 40 })}`],
  orbitale: ['Orbitale (OFW)', 'Come la lineare ma con un moto orbitale; per i metalli non ha ancora usi commerciali, è usata per le plastiche (saldatura a vibrazione).', () => `
    <rect x="50" y="30" width="120" height="30" class="m-stampo contorno"/><rect x="50" y="64" width="120" height="30" class="m-stampo contorno"/>
    <circle cx="110" cy="45" r="10" fill="none" stroke="var(--fuso)" stroke-width="3"/>`],
  fsw: ['Friction stir (FSW)', 'Un utensile rotante non consumabile avanza lungo il giunto e rimescola il materiale; spalla e barra d\'appoggio lo contengono. Lamiere da 1,2 a 50 mm, pannelli di estrusi, giunti di testa, a sovrapposizione, a T e d\'angolo.', () => `
    <rect x="20" y="70" width="88" height="24" class="m-stampo contorno"/><rect x="112" y="70" width="88" height="24" class="m-stampo contorno"/><rect x="10" y="94" width="200" height="10" class="scuro"/>
    <rect x="96" y="16" width="28" height="48" class="macchina"/><rect x="104" y="64" width="12" height="24" class="scuro"/>`],
  inerziale: ['Inerziale', 'Il pezzo rotante è collegato a un volano: portato in velocità lo si lascia girare libero, e l\'energia accumulata basta a saldare quando i pezzi si toccano.', (id) => `
    <circle cx="50" cy="62" r="40" class="m-stampo contorno"/><rect x="90" y="48" width="50" height="28" class="m-stampo contorno"/><rect x="144" y="48" width="50" height="28" class="m-stampo contorno"/>
    ${C.rotazione({ id, cx: 50, cy: 62, r: 18 })}`],
};

module.exports = { viewBox: '0 90 820 240', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
