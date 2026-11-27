// Schema animato e mini-diagrammi: Stampaggio a iniezione di polveri metalliche (Thompson 2007, pp. 136–139).
// Fasi: 1 iniezione del feedstock, 2 pezzo "verde", 3 deceraggio, 4 sinterizzazione.
'use strict';
const C = require('../componenti');
const { anim, stampo, freccia, calore, etichetta } = C;

const INGR = (cx, cy, r) => {
  const pts = [];
  for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2, rr = i % 2 ? r : r * 0.8; pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`); }
  return `M${pts.join(' L')} Z M${cx + r * 0.3},${cy} A${r * 0.3},${r * 0.3} 0 1 0 ${cx - r * 0.3},${cy} A${r * 0.3},${r * 0.3} 0 1 0 ${cx + r * 0.3},${cy} Z`;
};

function schema(id) {
  const G = INGR(250, 200, 60);
  return `
<!-- stampo a iniezione (vista frontale della cavità) -->
${stampo({ id, x: 160, y: 110, w: 180, h: 180 })}
<path d="${G}" class="cavita" fill-rule="evenodd"/>
<rect x="244" y="60" width="12" height="80" class="m-stampo contorno"/>
${etichetta({ testo: 'Stampo d\'acciaio', tx: 160, ty: 320 })}
<g${anim({ op: [1, 0, 0, 0] })}>${freccia({ id, x1: 250, y1: 30, x2: 250, y2: 60 })}${etichetta({ testo: 'polvere metallica + legante (circa 80% metallo)', tx: 270, ty: 40 })}</g>

<!-- pezzo: si sposta dallo stampo al forno e si ritira -->
<g${anim({ tx: [0, 0, 300, 300], sx: [1, 1, 1, 0.83], sy: [1, 1, 1, 0.83] }, { tx: 0, sx: 1, sy: 1 }, [250, 200])}>
  <path d="${G}" class="m-fuso contorno" fill-rule="evenodd"${anim({ op: [1, 0, 0, 0] }, { op: 1 })}/>
  <path d="${G}" class="m-grezzo contorno" fill-rule="evenodd"${anim({ op: [0, 1, 1, 0] }, { op: 0 })}/>
  <path d="${G}" class="m-finito sezionato contorno" fill-rule="evenodd"${anim({ op: [0, 0, 0, 1] }, { op: 0 })}/>
</g>
${etichetta({ testo: 'pezzo "verde": circa 20% più grande', tx: 160, ty: 350, extra: anim({ op: [0, 1, 0, 0] }) })}

<!-- forno -->
<rect x="440" y="100" width="220" height="220" rx="12" fill="none" stroke="var(--testo-2)" stroke-width="2" stroke-dasharray="7 5"/>
<rect x="470" y="262" width="160" height="10" class="macchina"/>
${etichetta({ testo: 'Piastra di supporto in ceramica', tx: 470, ty: 300 })}
<g${anim({ op: [0, 0, 1, 1] })}>${[490, 550, 610].map((x) => calore({ id, x, y: 350, lungo: 26, dir: -1 })).join('')}</g>
${etichetta({ testo: 'deceraggio: il legante evapora', tx: 450, ty: 86, extra: anim({ op: [0, 0, 1, 0] }) })}
${etichetta({ testo: 'sinterizzazione sottovuoto: ritiro del 15–20%', tx: 450, ty: 86, extra: anim({ op: [0, 0, 0, 1] }) })}
`;
}

const pz = (d) => `<path d="${d}" class="m-finito contorno"/>`;
const coppie = {
  spessore: {
    ok: ['Pareti uniformi fra 1 e 5 mm', 'Spessore costante; le parti massicce si svuotano.', () => pz('M15,30 H145 V100 H15 Z M30,45 H70 V100 H30 Z M90,45 H130 V100 H90 Z')],
    ko: ['Parte massiccia e spessa', 'I pezzi grandi e le pareti spesse si deformano più facilmente durante deceraggio e sinterizzazione.', () => `${pz('M15,30 H145 V100 H15 Z')}<path d="M15,100 Q80,86 145,100" fill="none" stroke="var(--ko)" stroke-width="2" stroke-dasharray="4 3"/>`],
  },
  raggi: {
    ok: ['Raggio interno di almeno 0,4 mm', 'Gli angoli interni concentrano le tensioni: serve un raggio minimo di 0,4 mm. Gli angoli esterni possono essere vivi.', () => pz('M20,100 V30 H50 V74 Q50,80 56,80 H140 V100 Z')],
    ko: ['Angolo interno vivo', 'Un angolo interno a spigolo vivo è un punto di concentrazione delle tensioni.', () => `${pz('M20,100 V30 H50 V80 H140 V100 Z')}<circle cx="50" cy="80" r="9" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  divisione: {
    ok: ['Linea di divisione in zona non critica', 'La bava sulla linea di divisione si toglie facilmente, salvo su texture e filetti: conviene metterla in zone non critiche e prevedere tratti piani nelle filettature.', () => `${pz('M20,40 H140 V90 H20 Z')}<line x1="10" y1="40" x2="150" y2="40" stroke="var(--testo-2)" stroke-dasharray="4 3"/>`],
    ko: ['Linea di divisione sulla filettatura', 'Una bava che attraversa un filetto o una texture è difficile da togliere.', () => `${pz('M20,40 H140 V90 H20 Z')}${[30, 46, 62, 78, 94, 110, 126].map((x) => `<line x1="${x}" y1="40" x2="${x + 8}" y2="90" stroke="var(--testo)" stroke-width="1.5"/>`).join('')}<line x1="10" y1="65" x2="150" y2="65" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  pim: ['Iniezione di polveri ceramiche (PIM)', 'Una tecnica simile, l\'iniezione di polveri, forma materiali ceramici e compositi metallici.', () => `
    <circle cx="80" cy="62" r="30" class="m-grezzo contorno"/><circle cx="150" cy="62" r="30" fill="#e8e4dc" stroke="var(--testo)"/>
    ${etichetta({ testo: 'metallo · ceramica', tx: 115, ty: 118, ancora: 'middle' })}`],
};

module.exports = { viewBox: '0 20 820 360', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 128 } };
