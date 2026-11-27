// Schema animato e mini-diagrammi: Stampa a caldo e goffratura (Thompson 2007, pp. 412–415).
// A sinistra la stampa a caldo (utensile, lamina, carta), a destra la goffratura fra stampi accoppiati.
// Fasi: 1 carico, 2 pressione, 3 scarico, 4 risultato.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const ORO = '#d4a53a', CARTA = '#f4efe4';

function schema(id) {
  return `
<!-- STAMPA A CALDO -->
${etichetta({ testo: 'Stampa a caldo', tx: 110, ty: 58 })}
<g${anim({ ty: [-36, 0, -36, -36] }, { ty: -36 })}>
  <rect x="110" y="110" width="220" height="40" fill="#9a6a4a" class="contorno"/>
  <rect x="180" y="150" width="20" height="14" class="m-stampo contorno"/><rect x="240" y="150" width="20" height="14" class="m-stampo contorno"/>
</g>
${etichetta({ testo: 'Utensile caldo, 100–200 °C', tx: 110, ty: 240 })}
<rect x="90" y="170" width="260" height="4" fill="${ORO}"${anim({ ty: [0, -6, 0, 0], op: [1, 1, 1, 0.4] }, { ty: 0, op: 1 })}/>
<g${anim({ op: [0, 0, 1, 1] }, { op: 0 })}><rect x="180" y="166" width="20" height="4" fill="#e9e4d6"/><rect x="240" y="166" width="20" height="4" fill="#e9e4d6"/></g>
${etichetta({ testo: 'Lamina su film di supporto', tx: 20, ty: 160, px: 90, py: 172 })}
<rect x="100" y="182" width="240" height="10" fill="${CARTA}" class="contorno"/>
<g${anim({ op: [0, 0, 1, 1] }, { op: 0 })}><rect x="180" y="182" width="20" height="3" fill="${ORO}"/><rect x="240" y="182" width="20" height="3" fill="${ORO}"/></g>
<rect x="90" y="192" width="260" height="24" class="m-stampo contorno"/>

<!-- GOFFRATURA -->
${etichetta({ testo: 'Goffratura', tx: 480, ty: 58 })}
<g${anim({ ty: [-36, 0, -36, -36] }, { ty: -36 })}>
  <path d="M480,110 H700 V182 H624 Q624,164 600,164 H580 Q556,164 556,182 H480 Z" class="m-stampo contorno"/>
</g>
<g${anim({ ty: [18, 0, 18, 18] }, { ty: 18 })}><path d="M470,190 H556 Q556,172 580,172 H600 Q624,172 624,190 H710 V214 H470 Z" class="m-stampo contorno"/></g>
<g${anim({ op: [1, 0, 0, 0] }, { op: 1 })}><rect x="470" y="182" width="240" height="8" fill="${CARTA}" class="contorno"/></g>
<g${anim({ op: [0, 1, 1, 1] }, { op: 0 })}><path d="M470,182 H556 Q556,164 580,164 H600 Q624,164 624,182 H710 V190 H624 Q624,172 600,172 H580 Q556,172 556,190 H470 Z" fill="${CARTA}" class="contorno"/></g>
${etichetta({ testo: 'Stampi accoppiati, bordi arrotondati', tx: 480, ty: 240, px: 640, py: 214 })}

<g${anim({ op: [1, 0, 0, 0] })}>${etichetta({ testo: 'Il foglio arriva sul piano, preso da ugelli a vuoto; la lamina scorre fra utensile e carta', tx: 60, ty: 300 })}</g>
<g${anim({ op: [0, 1, 0, 0] })}>${etichetta({ testo: 'Calore e pressione per meno di un secondo: l\'adesivo lega la lamina alla carta', tx: 60, ty: 300 })}</g>
<g${anim({ op: [0, 0, 1, 0] })}>${etichetta({ testo: 'La lamina usata si avvolge sulla bobina ed è scarto; nella goffratura non c\'è scarto', tx: 60, ty: 300 })}</g>
<g${anim({ op: [0, 0, 0, 1] })}>${etichetta({ testo: 'Impronta leggera con la lamina; rilievo in positivo fra stampi accoppiati', tx: 60, ty: 300 })}</g>
${freccia({ id, x1: 400, y1: 140, x2: 400, y2: 180 })}
`;
}

const coppie = {
  forma: {
    ok: ['Superfici piane o cilindriche', 'Il piano è il caso più comune ed economico; i cilindri richiedono attrezzature più costose.', () => `<rect x="20" y="70" width="120" height="16" fill="${CARTA}" class="contorno"/><rect x="50" y="66" width="60" height="4" fill="${ORO}"/>`],
    ko: ['Superfici ondulate', 'Sulle superfici ondulate l\'utensile rigido non appoggia: lì serve la tampografia.', () => `<path d="M20,90 Q50,50 80,80 T140,70 V100 H20 Z" fill="${CARTA}" class="contorno"/><rect x="30" y="40" width="100" height="14" class="m-stampo contorno"/><circle cx="80" cy="70" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  dettaglio: {
    ok: ['Linee da 0,25 mm, testi da 1,5 mm', 'Molte lamine oro e argento reggono linee di 0,25 mm e caratteri di 1,5 mm (6 punti).', () => `<text x="80" y="74" text-anchor="middle" font-size="18" fill="${ORO}" font-weight="400">Aa</text><line x1="40" y1="88" x2="120" y2="88" stroke="${ORO}" stroke-width="1"/>`],
    ko: ['Neretti e retini fini', 'Nei caratteri in neretto i fori delle lettere sono piccoli e i retini hanno punti minuscoli; alcuni colori non reggono i dettagli.', () => `<text x="80" y="76" text-anchor="middle" font-size="26" fill="${ORO}" font-weight="900">eB</text><circle cx="80" cy="66" r="24" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  spessore: {
    ok: ['Goffratura entro gli spessori', 'Carta e cartone fino a 2 mm (500 g/m²), plastica fino a 1 mm, pelle.', () => `<path d="M20,80 H60 Q60,62 80,62 Q100,62 100,80 H140 V88 H100 Q100,70 80,70 Q60,70 60,88 H20 Z" fill="${CARTA}" class="contorno"/>`],
    ko: ['Materiali sottili sotto la lamina', 'Materiali sottili si improntano da parte a parte e mostrano un rilievo sul retro, a volte indesiderato.', () => `<path d="M20,70 H60 V78 H100 V70 H140 V76 H104 V84 H56 V76 H20 Z" fill="${CARTA}" class="contorno"/><rect x="60" y="66" width="40" height="4" fill="${ORO}"/><circle cx="80" cy="84" r="14" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  cieca: ['Goffratura a secco', 'Su materiali non stampati si chiama goffratura cieca: un rilievo sottile e di qualità, senza colore.', () => `
    <path d="M20,80 H80 Q80,56 110,56 Q140,56 140,80 H200 V90 H20 Z" fill="${CARTA}" class="contorno"/>`],
  rotativa: ['Stampa a caldo rotativa', 'In continuo su fogli e pezzi cilindrici, come i flaconi di cosmetici, o per finiture finto legno su profili in plastica.', () => `
    <circle cx="110" cy="50" r="30" class="m-stampo contorno"/><rect x="20" y="82" width="180" height="10" fill="${CARTA}" class="contorno"/><rect x="90" y="78" width="40" height="4" fill="${ORO}"/>`],
  lamine: ['Lamine diverse', 'Opache, lucide, metallizzate, olografiche per la sicurezza, a motivi e trasparenti; i colori possono sovrapporsi direttamente.', () => `
    ${[ORO, '#c0c6cc', '#b8323a', '#4c62d9'].map((c, i) => `<rect x="${30 + i * 42}" y="44" width="34" height="40" fill="${c}"/>`).join('')}`],
};

module.exports = { viewBox: '0 40 820 290', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
