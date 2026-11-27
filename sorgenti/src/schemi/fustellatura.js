// Schema animato e mini-diagrammi: Fustellatura (Thompson 2007, pp. 266–271).
// Sezione di fustella in legno con lame d'acciaio, cuscinetti in gomma e piano di taglio.
// Fasi: 1 carico, 2 taglio, 3 espulsione, 4 separazione del pezzo.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const FONDO = '#eef1f4';
const LAME = [240, 580];     // lame di taglio passante
const CORDONE = 410;         // lama cordonatrice, arrotondata e più corta

function schema(id) {
  return `
<!-- fustella: tavola di legno, lame, cuscinetti -->
<rect x="180" y="60" width="460" height="50" class="m-grezzo contorno"/>
${etichetta({ testo: 'Fustella: lame d\'acciaio su tavola di legno', tx: 180, ty: 58 })}
${LAME.map((x) => `<rect x="${x - 3}" y="110" width="6" height="44" class="scuro"/>`).join('')}
<rect x="${CORDONE - 4}" y="110" width="8" height="36" rx="4" class="m-stampo contorno"/>
${LAME.map((x) => `<g${anim({ sy: [1, 0.45, 1, 1] }, { sy: 1 }, [x, 110])}><rect x="${x - 26}" y="110" width="20" height="40" fill="#e98fa0" class="contorno"/><rect x="${x + 6}" y="110" width="20" height="40" fill="#e98fa0" class="contorno"/></g>`).join('')}
${etichetta({ testo: 'Cuscinetti in gomma', tx: 660, ty: 140, px: 606, py: 130 })}

<!-- piano di taglio con il foglio: sale verso la fustella -->
<g${anim({ ty: [0, -46, 0, 0] }, { ty: 0 })}>
  <rect x="160" y="210" width="500" height="20" class="m-stampo contorno"/>
  <rect x="170" y="196" width="480" height="14" class="m-grezzo contorno"${anim({ op: [1, 1, 0, 0] }, { op: 1 })}/>
  <g${anim({ op: [0, 0, 1, 1] }, { op: 0 })}>
    <rect x="170" y="196" width="68" height="14" class="m-grezzo contorno"/><rect x="582" y="196" width="68" height="14" class="m-grezzo contorno"/>
  </g>
  <g${anim({ op: [0, 0, 1, 1], ty: [0, 0, 0, -60] }, { op: 0, ty: 0 })}>
    <path d="M242,196 H578 V210 H242 Z" class="m-finito contorno"/>
    <path d="M404,196 Q410,204 416,196" fill="${FONDO}" stroke="var(--testo)"/>
  </g>
</g>
${etichetta({ testo: 'Foglio (cartone, plastica, feltro, schiuma…)', tx: 20, ty: 180, px: 180, py: 200 })}
${etichetta({ testo: 'Piano di taglio in acciaio, spinto da un pistone idraulico', tx: 20, ty: 270, px: 170, py: 224 })}
<g${anim({ op: [0, 1, 0, 0] })}>${freccia({ id, x1: 410, y1: 300, x2: 410, y2: 250 })}${etichetta({ testo: 'in un colpo: taglio passante e cordonatura (5–15 t)', tx: 440, ty: 290 })}</g>
<g${anim({ op: [0, 0, 1, 0] })}>${etichetta({ testo: 'il piano scende, i cuscinetti spingono fuori il foglio', tx: 440, ty: 290 })}</g>
<g${anim({ op: [0, 0, 0, 1] })}>${etichetta({ testo: 'il pezzo si stacca; il resto del foglio è sfrido', tx: 440, ty: 290 })}</g>
`;
}

const coppie = {
  raggio: {
    ok: ['Curve con raggio di almeno 5 mm', 'Le lame si piegano fino a 5 mm di raggio; i fori più piccoli si fanno con un punzone sagomato, gli spigoli vivi unendo due lame.', () => `<path d="M20,90 V50 Q20,30 40,30 H140" fill="none" stroke="var(--testo)" stroke-width="4"/>${C.etichetta({ testo: 'R ≥ 5 mm', tx: 60, ty: 70 })}`],
    ko: ['Curve troppo strette', 'Una lama d\'acciaio non si piega sotto i 5 mm di raggio.', () => `<path d="M20,90 V36 Q20,30 26,30 H140" fill="none" stroke="var(--testo)" stroke-width="4"/><circle cx="24" cy="34" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  distanza: {
    ok: ['Lame distanti almeno 5 mm', 'Fra due lame servono almeno 5 mm, altrimenti il materiale non viene espulso.', () => `<rect x="40" y="30" width="6" height="60" class="scuro"/><rect x="110" y="30" width="6" height="60" class="scuro"/>${C.etichetta({ testo: '≥ 5 mm', tx: 78, ty: 110, ancora: 'middle' })}`],
    ko: ['Lame troppo vicine', 'Una striscia sottile resta incastrata e intasa la fustella.', () => `<rect x="70" y="30" width="6" height="60" class="scuro"/><rect x="84" y="30" width="6" height="60" class="scuro"/><circle cx="80" cy="60" r="18" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  sezioni: {
    ok: ['Parti sottili legate a parti più robuste', 'Le sezioni sottili vanno collegate a sezioni più spesse, per non creare problemi di espulsione; i pezzi si annidano nel foglio.', () => `<path d="M20,40 H140 V60 H90 V100 H70 V60 H20 Z" class="m-finito contorno"/>`],
    ko: ['Striscia sottile isolata', 'Una striscia sottile e libera si incastra o si strappa all\'espulsione.', () => `<rect x="20" y="40" width="120" height="20" class="m-finito contorno"/><rect x="74" y="70" width="8" height="40" class="m-finito contorno"/><circle cx="78" cy="90" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  passante: ['Taglio passante', 'La lama attraversa tutto il foglio fino al piano di taglio: si ritagliano reti di scatole, vassoi e sagome.', () => `
    <rect x="20" y="60" width="180" height="14" class="m-grezzo contorno"/><rect x="106" y="20" width="6" height="56" class="scuro"/>
    <rect x="10" y="74" width="200" height="12" class="m-stampo contorno"/>`],
  mezzo: ['Mezzo taglio (kiss cut)', 'Si taglia solo lo strato superiore lasciando intatto il supporto: è il metodo delle etichette autoadesive, con precisione entro 50 µm.', () => `
    <rect x="20" y="58" width="180" height="8" class="m-finito contorno"/><rect x="20" y="66" width="180" height="8" class="m-grezzo contorno"/>
    <rect x="106" y="20" width="6" height="46" class="scuro"/><rect x="10" y="74" width="200" height="12" class="m-stampo contorno"/>`],
  cordonatura: ['Cordonatura e perforazione', 'Lame arrotondate segnano le pieghe (l\'angolo dipende dal tipo di lama), lame dentate perforano: tutto nello stesso colpo.', () => `
    <path d="M20,60 H90 Q100,72 110,60 H200" fill="none" stroke="var(--grezzo)" stroke-width="12"/>
    <rect x="94" y="16" width="12" height="34" rx="6" class="m-stampo contorno"/>
    ${[140, 156, 172, 188].map((x) => `<rect x="${x}" y="54" width="8" height="12" fill="${FONDO}"/>`).join('')}`],
};

module.exports = { viewBox: '0 40 820 270', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
