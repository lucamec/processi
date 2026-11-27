// Schema animato e mini-diagrammi: Stampaggio a iniezione con reazione / schiuma a freddo (Thompson 2007, pp. 64–67).
// Fasi: 1 preparazione dello stampo, 2 miscelazione e iniezione, 3 espansione, 4 sformatura e rifilatura.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta, pezzo } = C;

const CAV = 'M280,140 H540 Q560,140 560,160 V230 Q560,250 540,250 H280 Q260,250 260,230 V160 Q260,140 280,140 Z';

function schema(id) {
  const bolle = [];
  for (let i = 0; i < 46; i++) { const x = 275 + ((i * 53) % 270), y = 150 + ((i * 37) % 92); bolle.push(`<circle cx="${x}" cy="${y}" r="${3 + (i % 3)}" fill="none" stroke="#ffffff" stroke-opacity=".55" stroke-width="1.2"/>`); }
  return `
<clipPath id="${id}-sotto" clipPathUnits="userSpaceOnUse"><rect x="200" y="195" width="420" height="120"/></clipPath>
<clipPath id="${id}-sopra" clipPathUnits="userSpaceOnUse"><rect x="200" y="60" width="420" height="135"/></clipPath>
<!-- metà inferiore dello stampo -->
<path d="M230,195 H590 V300 H230 Z ${CAV}" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno" clip-path="url(#${id}-sotto)"/>
${etichetta({ testo: 'Stampo inferiore', tx: 600, ty: 290 })}

<!-- schiuma: liquido sul fondo, poi espansione dal basso verso l'alto -->
<clipPath id="${id}-livello" clipPathUnits="userSpaceOnUse"><rect x="250" y="136" width="320" height="118"${anim({ sy: [0, 0.18, 1, 1] }, { sy: 0 }, [0, 254])}/></clipPath>
<g${anim({ ty: [0, 0, 0, 0] })} clip-path="url(#${id}-livello)">
  <path d="${CAV}" class="m-fuso contorno"${anim({ op: [1, 1, 1, 0] }, { op: 1 })}/>
  <g${anim({ op: [0, 0, 1, 1] }, { op: 0 })}>${bolle.join('')}</g>
</g>
<g${anim({ ty: [0, 0, 0, -10], op: [0, 0, 0, 1] }, { op: 0 })}>
  <path d="${CAV}" class="m-finito contorno"/>${bolle.join('')}
</g>

<!-- telaio in acciaio annegato nella schiuma -->
${[310, 360, 410, 460, 510].map((x) => `<rect x="${x - 6}" y="190" width="12" height="12" class="scuro"${anim({ ty: [0, 0, 0, -10] })}/>`).join('')}
${etichetta({ testo: 'Telaio in acciaio (inserto)', tx: 40, ty: 220, px: 304, py: 196 })}

<!-- metà superiore con foro di colata e canali di sfiato -->
<g${anim({ ty: [0, 0, 0, -90] }, { ty: -90 })}>
  <path d="M230,90 H590 V195 H230 Z ${CAV} M296,90 H312 V142 H296 Z M524,90 H532 V142 H524 Z" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno" clip-path="url(#${id}-sopra)"/>
  <rect x="294" y="80" width="20" height="16" class="scuro"${anim({ op: [0, 0, 1, 0] })}/>
  ${etichetta({ testo: 'Stampo superiore', tx: 600, ty: 112 })}
</g>
<g${anim({ op: [0, 0, 1, 0] })}>${freccia({ id, x1: 528, y1: 120, x2: 528, y2: 60, tipo: 'vuoto' })}${etichetta({ testo: 'l\'aria esce dai canali', tx: 540, ty: 66 })}${etichetta({ testo: 'tappo nel foro di colata', tx: 120, ty: 70, px: 294, py: 86 })}</g>

<!-- testa di miscelazione con i due componenti -->
<g${anim({ op: [0, 1, 0, 0] }, { op: 0 })}>
  <rect x="80" y="10" width="60" height="40" rx="6" class="macchina"/>${etichetta({ testo: 'A: isocianato', tx: 150, ty: 24 })}
  <rect x="80" y="54" width="60" height="40" rx="6" class="macchina"/>${etichetta({ testo: 'B: poliolo', tx: 150, ty: 80 })}
  <path d="M140,30 H304 V60 M140,74 H304" fill="none" stroke="var(--testo-2)" stroke-width="3"/>
  <rect x="290" y="40" width="28" height="44" class="m-stampo contorno"/>
  ${freccia({ id, x1: 304, y1: 86, x2: 304, y2: 150 })}
  ${etichetta({ testo: 'Testa di miscelazione', tx: 330, ty: 36 })}
</g>
<g${anim({ op: [1, 0, 0, 0] }, { op: 1 })}>${etichetta({ testo: 'distaccante spruzzato sulle pareti', tx: 260, ty: 330 })}</g>
`;
}

const coppie = {
  copertura: {
    ok: ['Schiuma di almeno 10–15 mm sul telaio', 'Il telaio resta ben dentro la schiuma e non si vede in superficie.', () => `${pezzo({ d: 'M15,25 H145 V100 H15 Z' })}<rect x="55" y="52" width="50" height="22" class="scuro"/>${C.etichetta({ testo: '≥ 10–15 mm', tx: 80, ty: 20, ancora: 'middle' })}`],
    ko: ['Telaio troppo vicino alla superficie', 'Con poca schiuma sopra, la struttura si legge attraverso il rivestimento.', () => `${pezzo({ d: 'M15,25 H145 V100 H15 Z' })}<rect x="35" y="29" width="90" height="16" class="scuro"/><line x1="35" y1="25" x2="125" y2="25" stroke="var(--ko)" stroke-width="3"/>`],
  },
  pareti: {
    ok: ['Pareti da 5 mm in su, anche diverse', 'Nello stesso pezzo convivono pareti spesse e sottili, a partire da 5 mm.', () => pezzo({ d: 'M15,30 H145 V100 H125 V48 H35 V100 H15 Z M70,48 H90 V100 H70 Z' })],
    ko: ['Pareti sotto i 5 mm', 'Il libro indica pareti a partire da 5 mm.', () => `${pezzo({ d: 'M15,30 H145 V100 H143 V34 H17 V100 H15 Z' })}<circle cx="16" cy="70" r="9" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  sfiati: {
    ok: ['Canali per l\'uscita dell\'aria', 'Mentre la schiuma si espande, i canali lasciano uscire l\'aria intrappolata.', (id) => `<path d="M10,20 H150 V105 H10 Z M30,40 H130 V90 H30 Z M120,20 H126 V40 H120 Z" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno"/>${pezzo({ d: 'M30,40 H130 V90 H30 Z' })}${freccia({ id, x1: 123, y1: 34, x2: 123, y2: 4, tipo: 'vuoto' })}`],
    ko: ['Aria intrappolata', 'Senza vie d\'uscita l\'aria resta in alto e lascia vuoti nella schiuma.', (id) => `<path d="M10,20 H150 V105 H10 Z M30,40 H130 V90 H30 Z" fill="url(#${id}-tratteggio)" fill-rule="evenodd" class="contorno"/>${pezzo({ d: 'M30,52 H130 V90 H30 Z' })}<rect x="30" y="40" width="100" height="12" fill="#fff" stroke="var(--ko)" stroke-width="2"/>`],
  },
};

const varianti = {
  srim: ['Rinforzo con fibre (SRIM, RRIM)', 'Nella plastica si incorporano fibre o stuoie di fibra per aumentare resistenza e rigidità.', (id) => `
    ${C.stampo({ id, x: 20, y: 10, w: 180, h: 30 })}${C.stampo({ id, x: 20, y: 84, w: 180, h: 30 })}
    <rect x="20" y="40" width="180" height="44" class="m-fuso contorno"/>
    ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${24 + i * 22},48 l18,28" stroke="var(--testo)" stroke-width="2"/>`).join('')}
    ${etichetta({ testo: 'stuoia di fibra annegata nel PUR', tx: 110, ty: 126, ancora: 'middle' })}`],
};

module.exports = { viewBox: '0 0 820 340', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 132 } };
