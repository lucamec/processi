// Schema animato e mini-diagrammi: Fresatura fotochimica (Thompson 2007, pp. 244–247).
// Sezione di una lamiera sottile (spessore esagerato). Fasi: 1 film fotosensibile, 2 esposizione UV,
// 3 sviluppo, 4 incisione chimica sui due lati, 5 rimozione del film.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;

const FONDO = '#eef1f4';
// aperture: [x0, x1, lato] lato 'e' = entrambi (taglio passante), 's' = solo sopra (mezza incisione)
const APERTURE = [[260, 320, 'e'], [400, 460, 'e'], [540, 580, 's']];
const Y0 = 190, Y1 = 214, YM = 202;

function film(y, lato) {
  // film con aperture (dopo lo sviluppo)
  let d = '', x = 160;
  APERTURE.filter((a) => a[2] === 'e' || lato === 'sopra').forEach((a) => { d += `<rect x="${x}" y="${y}" width="${a[0] - x}" height="8" style="fill:var(--flusso)" opacity="0.75"/>`; x = a[1]; });
  return d + `<rect x="${x}" y="${y}" width="${660 - x}" height="8" style="fill:var(--flusso)" opacity="0.75"/>`;
}
function negativo(y, lato) {
  return APERTURE.filter((a) => a[2] === 'e' || lato === 'sopra').map((a) => `<rect x="${a[0]}" y="${y}" width="${a[1] - a[0]}" height="6" fill="#1d232b"/>`).join('') + `<rect x="150" y="${y}" width="520" height="6" fill="none" stroke="var(--testo)" stroke-width="1"/>`;
}

function schema(id) {
  const scavi = APERTURE.map((a) => {
    const w = a[1] - a[0];
    const sopra = `<rect x="${a[0]}" y="${Y0}" width="${w}" height="${YM - Y0 + 1}" fill="${FONDO}"${anim({ sy: [0, 0, 0, 1, 1] }, { sy: 0 }, [a[0], Y0])}/>`;
    const sotto = a[2] === 'e' ? `<rect x="${a[0]}" y="${YM - 1}" width="${w}" height="${Y1 - YM + 1}" fill="${FONDO}"${anim({ sy: [0, 0, 0, 1, 1] }, { sy: 0 }, [a[0], Y1])}/>` : '';
    return sopra + sotto;
  }).join('');
  return `
<!-- lamiera -->
<rect x="160" y="${Y0}" width="500" height="${Y1 - Y0}" class="m-grezzo contorno"${anim({ op: [1, 1, 1, 1, 0] }, { op: 1 })}/>
<rect x="160" y="${Y0}" width="500" height="${Y1 - Y0}" class="m-finito contorno"${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}/>
${scavi}
${etichetta({ testo: 'Lamiera sottile (0,1–1 mm), spessore esagerato', tx: 40, ty: 260, px: 200, py: 214 })}

<!-- film fotosensibile: intero, poi con le aperture -->
<g${anim({ op: [1, 1, 0, 0, 0] }, { op: 0 })}>
  <rect x="160" y="${Y0 - 8}" width="500" height="8" style="fill:var(--flusso)" opacity="0.45"/><rect x="160" y="${Y1}" width="500" height="8" style="fill:var(--flusso)" opacity="0.45"/>
</g>
<g${anim({ op: [0, 0, 1, 1, 0] }, { op: 0 })}>${film(Y0 - 8, 'sopra')}${film(Y1, 'sotto')}</g>
<g${anim({ op: [1, 0, 0, 0, 0] })}>${etichetta({ testo: 'Film fotosensibile laminato a caldo sui due lati', tx: 430, ty: 160 })}</g>

<!-- 2: negativi e UV -->
<g${anim({ op: [0, 1, 0, 0, 0] })}>
  ${negativo(160, 'sopra')}${negativo(232, 'sotto')}
  ${[220, 410, 600].map((x) => freccia({ id, x1: x, y1: 110, x2: x, y2: 154 })).join('')}
  ${[220, 410, 600].map((x) => freccia({ id, x1: x, y1: 296, x2: x, y2: 244 })).join('')}
  ${etichetta({ testo: 'Negativi su acetato e luce UV sui due lati: il film esposto indurisce', tx: 200, ty: 96 })}
</g>
<g${anim({ op: [0, 0, 1, 0, 0] })}>${etichetta({ testo: 'Il film non esposto, ancora morbido, viene sciolto', tx: 200, ty: 140 })}</g>

<!-- 4: ugelli oscillanti -->
<g${anim({ op: [0, 0, 0, 1, 0], vx: [0, 0, 0, 40, 0] }, { op: 0, vx: 0 })}>
  ${[240, 400, 560].map((x) => `<rect x="${x - 10}" y="110" width="20" height="18" class="scuro"/><path d="M${x - 6},128 L${x - 26},172 H${x + 26} L${x + 6},128 Z" style="fill:var(--fuso)" opacity="0.3"/>`).join('')}
  ${[240, 400, 560].map((x) => `<rect x="${x - 10}" y="276" width="20" height="18" class="scuro"/><path d="M${x - 6},276 L${x - 26},232 H${x + 26} L${x + 6},276 Z" style="fill:var(--fuso)" opacity="0.3"/>`).join('')}
</g>
<g${anim({ op: [0, 0, 0, 1, 0] })}>${etichetta({ testo: 'Cloruro ferrico da ugelli oscillanti: taglio passante dove i due lati sono aperti', tx: 140, ty: 96 })}
  ${etichetta({ testo: 'mezza incisione', tx: 600, ty: 260, px: 560, py: 204 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${etichetta({ testo: 'Il film si toglie con soda caustica: bordi senza bave', tx: 200, ty: 140 })}</g>
`;
}

const ln = (d, col = 'finito', w = 5) => `<path d="${d}" fill="none" stroke-width="${w}" style="stroke:var(--${col})"/>`;
const coppie = {
  dettagli: {
    ok: ['Dettagli più grandi dello spessore', 'Fori, fessure, raggi e barrette devono misurare almeno 1,5 volte lo spessore della lamiera.', () => `<rect x="20" y="50" width="120" height="20" class="m-finito contorno"/><rect x="50" y="50" width="34" height="20" fill="${FONDO}"/>${C.etichetta({ testo: '≥ 1,5 × s', tx: 67, ty: 40, ancora: 'middle' })}`],
    ko: ['Dettagli più piccoli dello spessore', 'Un’apertura più stretta dello spessore non viene incisa con precisione.', () => `<rect x="20" y="50" width="120" height="20" class="m-finito contorno"/><rect x="74" y="50" width="8" height="20" fill="${FONDO}"/><circle cx="78" cy="60" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  spessore: {
    ok: ['Lamiera fino a 1 mm', 'Si profilano lamine e lamiere di 0,1–1 mm; la precisione resta piena fino a 0,7 mm.', () => `<rect x="20" y="54" width="50" height="14" class="m-finito contorno"/><rect x="90" y="54" width="50" height="14" class="m-finito contorno"/>`],
    ko: ['Lamiera più spessa di 1 mm', 'Oltre 1 mm il bordo resta visibilmente concavo o convesso.', () => `<path d="M20,40 H70 Q62,60 70,80 H20 Z" class="m-finito contorno"/><path d="M90,40 H140 V80 H90 Q98,60 90,40 Z" class="m-finito contorno"/><circle cx="80" cy="60" r="18" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  linguette: {
    ok: ['Linguette che trattengono i pezzi', 'Le linguette tengono i pezzi nel foglio durante il taglio: metà spessore, almeno 0,15 mm; a V per staccarle a mano, parallele per pezzi da tranciare.', () => `<rect x="20" y="30" width="120" height="70" fill="none" stroke="var(--finito)" stroke-width="4"/><rect x="46" y="48" width="68" height="34" class="m-finito contorno"/><path d="M80,30 L76,48 H84 Z M80,100 L76,82 H84 Z" style="fill:var(--finito)"/>`],
    ko: ['Pezzi senza linguette', 'Senza collegamenti i pezzi piccoli si staccano e si perdono durante l’incisione.', () => `<rect x="20" y="30" width="120" height="70" fill="none" stroke="var(--finito)" stroke-width="4"/><rect x="50" y="56" width="68" height="34" class="m-finito contorno" transform="rotate(12 84 73)"/><circle cx="84" cy="73" r="30" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  profilatura: ['Profilatura (taglio passante)', 'Dove il disegno è aperto sui due lati, l’acido attacca da sopra e da sotto e attraversa la lamiera: si ritaglia il pezzo intero.', () => `
    <rect x="20" y="50" width="180" height="24" class="m-finito contorno"/><rect x="90" y="50" width="40" height="24" fill="${FONDO}"/>
    <rect x="20" y="42" width="70" height="8" style="fill:var(--flusso)" opacity="0.7"/><rect x="130" y="42" width="70" height="8" style="fill:var(--flusso)" opacity="0.7"/>
    <rect x="20" y="74" width="70" height="8" style="fill:var(--flusso)" opacity="0.7"/><rect x="130" y="74" width="70" height="8" style="fill:var(--flusso)" opacity="0.7"/>`],
  linee: ['Linee di piega (mezza incisione)', 'Aperto su un solo lato, il disegno incide la lamiera a metà: la larghezza della linea decide l’angolo di piega, utile per modelli e lavorazioni successive.', () => `
    ${ln('M20,80 H100 L180,30', 'finito', 14)}
    <path d="M94,72 L106,72 L100,84 Z" fill="${FONDO}"/>`],
  alleggerimento: ['Alleggerimento e marcatura', 'Si asporta materiale dalla superficie per ridurre il peso o per segnare linee e decori; tutte le funzioni avvengono nella stessa passata.', () => `
    <rect x="20" y="50" width="180" height="24" class="m-finito contorno"/>
    ${[40, 80, 120, 160].map((x) => `<rect x="${x}" y="50" width="24" height="10" fill="${FONDO}"/>`).join('')}`],
};

module.exports = { viewBox: '0 80 820 230', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
