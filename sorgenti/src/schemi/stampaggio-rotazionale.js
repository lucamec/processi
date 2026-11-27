// Schema animato e mini-diagrammi: Stampaggio rotazionale (Thompson 2007, pp. 36–39).
// Fasi: 1 carico e chiusura, 2 riscaldamento in rotazione, 3 raffreddamento in rotazione, 4 apertura ed estrazione.
'use strict';
const C = require('../componenti');
const { anim, stampo, pezzo, freccia, calore, rotazione, etichetta } = C;

const CX = 170, CY = 205, R = 112;          // pianta della giostra
const MX = 590, MY = 215;                   // centro dello stampo in sezione
const polar = (deg, r = R) => [CX + r * Math.cos(deg * Math.PI / 180), CY + r * Math.sin(deg * Math.PI / 180)];

function stazione(deg, testo, extra = '', sopra = false) {
  const [x, y] = polar(deg);
  return `<rect x="${x - 42}" y="${y - 32}" width="84" height="64" rx="8" class="cavita contorno" stroke-dasharray="5 4"/>${extra}
  ${etichetta({ testo, tx: x, ty: sopra ? y - 42 : y + 50, ancora: 'middle' })}`;
}

function schema(id) {
  const [fx, fy] = polar(-60);
  const [rx, ry] = polar(60);
  return `
<!-- ===== Vista in pianta della giostra a tre stazioni ===== -->
${etichetta({ testo: 'Pianta della macchina', tx: 20, ty: 26, extra: ' class="etichetta etichetta-fase"' })}
${stazione(180, 'Carico/scarico')}
${stazione(-60, 'Forno ≈ 250 °C', `<g${anim({ op: [0.2, 1, 0.2, 0.2] })}>${[fx - 20, fx, fx + 20].map((x) => calore({ id, x, y: fy - 22, lungo: 30 })).join('')}</g>`, true)}
${stazione(60, 'Raffreddamento', `<g${anim({ op: [0.2, 0.2, 1, 0.2] })}>${freccia({ id, x1: rx - 30, y1: ry - 12, x2: rx + 30, y2: ry - 12, tipo: 'vuoto' })}${freccia({ id, x1: rx - 30, y1: ry + 12, x2: rx + 30, y2: ry + 12, tipo: 'vuoto' })}</g>`)}
<g${anim({ rot: [0, 120, 240, 360] }, { rot: 0 }, [CX, CY])}>
  <line x1="${CX}" y1="${CY}" x2="${CX - R + 26}" y2="${CY}" stroke="var(--stampo-scuro)" stroke-width="8" stroke-linecap="round"/>
  <rect x="${CX - R - 18}" y="${CY - 18}" width="36" height="36" class="m-stampo contorno"/>
</g>
<circle cx="${CX}" cy="${CY}" r="12" class="macchina"/>
${etichetta({ testo: 'Braccio rotante', tx: CX - 20, ty: CY - 34, px: CX - 8, py: CY - 8, ancora: 'end' })}

<!-- ===== Vista in sezione dello stampo ===== -->
${etichetta({ testo: 'Sezione dello stampo', tx: 470, ty: 26, extra: ' class="etichetta etichetta-fase"' })}
<clipPath id="${id}-interno" clipPathUnits="userSpaceOnUse"><rect x="${MX - 76}" y="${MY - 76}" width="152" height="152"/></clipPath>

<!-- polvere dosata: resta sul fondo per gravità mentre lo stampo ruota, poi fonde -->
<g${anim({ op: [1, 0, 0, 0] }, { op: 0 })}>
  ${[[-30, 50], [-18, 56], [-6, 60], [6, 60], [18, 56], [30, 50], [-24, 42], [-10, 48], [4, 50], [18, 46], [-2, 38], [10, 40], [-16, 36]].map(([dx, dy]) => `<circle cx="${MX + dx}" cy="${MY + dy}" r="5" class="m-grezzo contorno"/>`).join('')}
  ${etichetta({ testo: 'Polvere dosata', tx: MX - 210, ty: MY + 60, px: MX - 34, py: MY + 52 })}
</g>

<g${anim({ rot: [0, 720, 1080, 1080] }, { rot: 0 }, [MX, MY])}>
  <!-- strato di polimero che si deposita sulle pareti -->
  <g clip-path="url(#${id}-interno)">
    <rect x="${MX - 76}" y="${MY - 76}" width="152" height="152" fill="none" style="stroke:var(--fuso)"${anim({ sw: [0, 24, 24, 24], op: [1, 1, 0, 0] }, { sw: 0, op: 1 })}/>
    <rect x="${MX - 76}" y="${MY - 76}" width="152" height="152" fill="none" style="stroke:var(--finito)"${anim({ sw: [0, 24, 24, 24], op: [0, 0, 1, 1] }, { sw: 0, op: 0 })}/>
  </g>
  <!-- metà inferiore -->
  <path d="M${MX - 90},${MY} H${MX - 76} V${MY + 76} H${MX + 76} V${MY} H${MX + 90} V${MY + 90} H${MX - 90} Z" fill="url(#${id}-tratteggio)" class="contorno"/>
  <!-- metà superiore con sfiato: si solleva in fase 4 -->
  <g${anim({ ty: [0, 0, 0, -60] }, { ty: -60 })}>
    <path d="M${MX - 90},${MY} H${MX - 76} V${MY - 76} H${MX + 76} V${MY} H${MX + 90} V${MY - 90} H${MX - 90} Z" fill="url(#${id}-tratteggio)" class="contorno"/>
    <rect x="${MX - 4}" y="${MY - 116}" width="8" height="42" class="macchina"/>
  </g>
</g>

<g${anim({ op: [0, 1, 1, 0] })}>
  ${rotazione({ id, cx: MX + 130, cy: MY - 30, r: 18 })}
  ${etichetta({ testo: 'in rotazione', tx: MX + 100, ty: MY - 60 })}
</g>
<g${anim({ op: [0, 1, 0, 0] })}>
  ${[MX - 60, MX, MX + 60].map((x) => calore({ id, x, y: MY + 160, lungo: 40, dir: -1 })).join('')}
  ${etichetta({ testo: 'calore del forno', tx: MX + 76, ty: MY + 150 })}
</g>
<g${anim({ op: [0, 0, 1, 0] })}>
  ${freccia({ id, x1: MX + 130, y1: MY + 150, x2: MX + 110, y2: MY + 105, tipo: 'vuoto' })}
  ${freccia({ id, x1: MX - 130, y1: MY + 150, x2: MX - 110, y2: MY + 105, tipo: 'vuoto' })}
  ${etichetta({ testo: 'aria e umidità', tx: MX + 76, ty: MY + 150 })}
</g>
${etichetta({ testo: 'Sfiato per i gas', tx: MX + 100, ty: 50, px: MX + 6, py: 84 })}
${etichetta({ testo: 'Stampo (sezione)', tx: MX + 104, ty: MY + 70, px: MX + 88, py: MY + 60 })}
`;
}

const coppie = {
  spessore: {
    ok: ['Parete di spessore costante', 'Corpo cavo con parete uniforme.', () => pezzo({ d: 'M20,15 H140 V100 H20 Z M32,27 H128 V88 H32 Z' })],
    ko: ['Brusco cambio di spessore', 'La parete passa di colpo da sottile a spessa: il processo non lo consente.', () => `${pezzo({ d: 'M20,15 H140 V100 H20 Z M32,27 H100 V60 H128 V88 H32 Z' })}<circle cx="100" cy="60" r="9" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  raggi: {
    ok: ['Angoli ampiamente raccordati', 'Raggi generosi negli angoli: la polvere riveste uniformemente.', () => pezzo({ d: 'M50,15 H110 Q140,15 140,45 V70 Q140,100 110,100 H50 Q20,100 20,70 V45 Q20,15 50,15 Z M52,27 H108 Q128,27 128,47 V68 Q128,88 108,88 H52 Q32,88 32,68 V47 Q32,27 52,27 Z' })],
    ko: ['Angoli vivi e stretti', 'Negli spigoli vivi il materiale si distribuisce male.', () => `${pezzo({ d: 'M20,15 H140 V100 H20 Z M32,27 H128 V88 H32 Z' })}${[[32, 27], [128, 27], [32, 88], [128, 88]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`).join('')}`],
  },
  nervature: {
    ok: ['Nervature per irrigidire', 'La bassa pressione dà pezzi poco resistenti: le nervature (ondulazioni della parete) li irrigidiscono.', () => pezzo({ d: 'M10,50 H30 L40,30 H55 L65,50 H85 L95,30 H110 L120,50 H150 V62 H120 L110,42 H95 L85,62 H65 L55,42 H40 L30,62 H10 Z' })],
    ko: ['Parete piana senza nervature', 'Una parete lunga e piatta si flette facilmente.', () => `${pezzo({ d: 'M10,50 H150 V62 H10 Z' })}<path d="M10,56 Q80,90 150,56" class="flusso-linea tratteggiata" style="stroke:var(--ko)"/>`],
  },
  proporzioni: {
    ok: ['Lunghezza fino a 4 volte il diametro', 'Pezzo cavo con lunghezza pari a circa 3 diametri.', () => `${pezzo({ d: 'M20,35 H140 V75 H20 Z M28,43 H132 V67 H28 Z' })}${etichetta({ testo: 'L ≈ 3 D', tx: 80, ty: 100, ancora: 'middle' })}`],
    ko: ['Pezzo troppo allungato', 'Oltre 4 diametri la polvere non si distribuisce in modo uniforme.', () => `${pezzo({ d: 'M8,47 H152 V63 H8 Z M13,51 H147 V59 H13 Z' })}${etichetta({ testo: 'L ≈ 9 D', tx: 80, ty: 100, ancora: 'middle' })}`],
  },
  piani: {
    ok: ['Superfici piane contenute', 'Facce piane di dimensioni limitate.', () => pezzo({ d: 'M50,30 H110 V90 H50 Z M58,38 H102 V82 H58 Z' })],
    ko: ['Grandi superfici piane', 'Con il ritiro (circa 3%) le grandi facce piane tendono a deformarsi.', () => `${pezzo({ d: 'M8,40 H152 V80 H8 Z M16,48 H144 V72 H16 Z' })}<path d="M8,40 Q80,22 152,40" class="flusso-linea tratteggiata" style="stroke:var(--ko)"/>`],
  },
};

const varianti = {
  multistrato: ['Pareti multistrato o riempite di schiuma', 'Più materiali che si attivano a temperature diverse formano strati distinti nella parete, anche con un\'anima espansa.', () => `
    <rect x="20" y="20" width="180" height="80" class="m-finito contorno"/>
    <rect x="30" y="30" width="160" height="60" class="m-fuso contorno"/>
    <rect x="40" y="40" width="140" height="40" class="cavita contorno"/>
    ${etichetta({ testo: 'pelle esterna', tx: 24, ty: 14 })}${etichetta({ testo: 'strato interno / schiuma', tx: 46, ty: 64 })}`],
  coppie: ['Pezzi stampati a coppie', 'Un unico corpo cavo viene tagliato dopo lo stampaggio per ottenere due gusci aperti (geometrie a lastra).', (id) => `
    <rect x="20" y="20" width="180" height="80" rx="10" class="m-finito contorno"/>
    <rect x="30" y="30" width="160" height="60" rx="6" class="cavita contorno"/>
    <line x1="110" y1="8" x2="110" y2="112" stroke="var(--ko)" stroke-width="2.5" stroke-dasharray="6 4"/>
    ${etichetta({ testo: 'taglio', tx: 116, ty: 116 })}`],
  grafica: ['Grafica e inserti in stampo', 'Grafiche, inserti di colore diverso, filettature e dettagli superficiali sono integrati durante lo stampaggio.', (id) => `
    ${stampo({ id, x: 20, y: 20, w: 180, h: 14 })}
    <rect x="20" y="34" width="180" height="6" class="m-grezzo contorno"/>
    <rect x="20" y="40" width="180" height="14" class="m-fuso contorno"/>
    ${etichetta({ testo: 'grafica sulla parete dello stampo', tx: 20, ty: 76 })}`],
};

module.exports = {
  viewBox: '0 0 820 400',
  schema,
  mini: coppie,
  varianti,
  miniVariante: { w: 220, h: 120 },
};
