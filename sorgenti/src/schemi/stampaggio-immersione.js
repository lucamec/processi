// Schema animato e mini-diagrammi: Stampaggio per immersione (Thompson 2007, pp. 68–71).
// Fasi: 1 preriscaldamento, 2 distaccante, 3 immersione, 4 indurimento in forno, 5 raffreddamento ed estrazione.
'use strict';
const C = require('../componenti');
const { anim, freccia, calore, etichetta, pezzo } = C;

const STAMPO = 'M392,70 H428 V214 Q428,244 410,244 Q392,244 392,214 Z';
const LINEA = 150; // linea di riempimento

function schema(id) {
  return `
<!-- Forno (fasi 1 e 4) -->
<g${anim({ op: [1, 0, 0, 1, 0] }, { op: 1 })}>
  <rect x="300" y="40" width="220" height="230" rx="10" fill="none" stroke="var(--testo-2)" stroke-width="2" stroke-dasharray="7 5"/>
  ${[330, 490].map((x) => calore({ id, x, y: 250, lungo: 30, dir: -1 })).join('')}
  ${etichetta({ testo: 'Forno', tx: 530, ty: 60 })}
</g>
${etichetta({ testo: 'preriscaldamento 300–400 °C', tx: 530, ty: 82, extra: anim({ op: [1, 0, 0, 0, 0] }, { op: 1 }) })}
${etichetta({ testo: 'indurimento 120–240 °C', tx: 530, ty: 82, extra: anim({ op: [0, 0, 0, 1, 0] }, { op: 0 }) })}

<!-- Vasca di plastisol: sale in fase 3 -->
<g${anim({ ty: [0, 0, -120, 0, 0] }, { ty: 0 })}>
  <path d="M300,270 V360 H520 V270" fill="none" stroke="var(--testo)" stroke-width="3"/>
  <rect x="302" y="282" width="216" height="76" class="m-fuso"/>
  ${etichetta({ testo: 'Vasca di PVC liquido (plastisol)', tx: 530, ty: 330 })}
</g>
<!-- Bagno d'acqua (fase 5) -->
<g${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}>
  <rect x="320" y="60" width="180" height="150" rx="6" fill="var(--flusso)" fill-opacity=".15" stroke="var(--flusso)" stroke-width="2"/>
  ${etichetta({ testo: 'Bagno d\'acqua fredda', tx: 530, ty: 120 })}
</g>

<!-- Supporto, stampo e strato di PVC: ruota di 180° dopo l'immersione -->
<rect x="250" y="56" width="320" height="12" class="macchina"/>
${etichetta({ testo: 'Supporto portastampi', tx: 40, ty: 66 })}
<clipPath id="${id}-riemp" clipPathUnits="userSpaceOnUse"><rect x="360" y="${LINEA}" width="100" height="120"/></clipPath>
<g${anim({ rot: [0, 0, 0, 180, 180] }, { rot: 0 }, [410, 160])}>
  <g clip-path="url(#${id}-riemp)">
    <path d="${STAMPO}" fill="none" stroke-linejoin="round" style="stroke:var(--fuso)"${anim({ sw: [0, 0, 18, 18, 18], op: [1, 1, 1, 0, 0] }, { sw: 0, op: 1 })}/>
    <g${anim({ ty: [0, 0, 0, 0, 0], op: [0, 0, 0, 1, 1] }, { op: 0 })}>
      <path d="${STAMPO}" fill="none" stroke-width="18" stroke-linejoin="round" style="stroke:var(--finito)"/>
    </g>
  </g>
  <path d="${STAMPO}" fill="url(#${id}-tratteggio)" class="contorno"/>
  <path d="${STAMPO}" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="3 3"${anim({ op: [0, 1, 0, 0, 0] })}/>
  <rect x="404" y="62" width="12" height="10" class="scuro"/>
</g>
<line x1="350" y1="${LINEA}" x2="470" y2="${LINEA}" stroke="var(--testo-2)" stroke-dasharray="4 4"${anim({ op: [0, 0, 1, 0, 0] })}/>
${etichetta({ testo: 'linea di riempimento', tx: 40, ty: LINEA + 4, px: 350, py: LINEA, extra: anim({ op: [0, 0, 1, 0, 0] }) })}
${etichetta({ testo: 'Stampo maschio in alluminio', tx: 40, ty: 120, px: 392, py: 110 })}
${etichetta({ testo: 'film di silicone (distaccante)', tx: 40, ty: 210, px: 392, py: 200, extra: anim({ op: [0, 1, 0, 0, 0] }) })}
<g${anim({ op: [0, 0, 0, 0, 1] })}>${freccia({ id, x1: 410, y1: 30, x2: 410, y2: 56 })}${etichetta({ testo: 'aria compressa stacca il pezzo', tx: 430, ty: 30 })}</g>
`;
}

const coppie = {
  sformo: {
    ok: ['Sformo di 5–15°', 'Le facce parallele alla superficie del liquido sono inclinate: l\'aria scivola via.', (id) => `<path d="M40,20 H120 L100,90 H60 Z" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M40,20 L60,90 H100 L120,20" fill="none" stroke="var(--finito)" stroke-width="6"/>${C.etichetta({ testo: '5–15°', tx: 126, ty: 60 })}`],
    ko: ['Faccia piana parallela al liquido', 'Una faccia piatta parallela alla superficie intrappola l\'aria: restano avvallamenti o buchi.', (id) => `<path d="M40,20 H120 V90 H40 Z" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M40,20 V90 M120,20 V90" stroke="var(--finito)" stroke-width="6"/><rect x="44" y="92" width="72" height="8" fill="#fff" stroke="var(--ko)" stroke-width="2"/>`],
  },
  raggi: {
    ok: ['Raggi sugli spigoli', 'I raccordi aiutano lo scorrimento del liquido e uno spessore regolare.', (id) => `<path d="M30,20 H130 V70 Q130,95 105,95 H55 Q30,95 30,70 Z" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M30,20 V70 Q30,95 55,95 H105 Q130,95 130,70 V20" fill="none" stroke="var(--finito)" stroke-width="6"/>`],
    ko: ['Dettagli sporgenti e spigoli vivi', 'Il PVC smussa gli spigoli: sui dettagli sporgenti si deposita troppo poco materiale.', (id) => `<path d="M30,20 H130 V95 H95 V105 H65 V95 H30 Z" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M30,20 V95 H65 V105 H95 V95 H130 V20" fill="none" stroke="var(--finito)" stroke-width="4"/><circle cx="80" cy="105" r="11" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  colature: {
    ok: ['Stampo capovolto dopo l\'immersione', 'Girando lo stampo le gocce rientrano e lo spessore resta più uniforme.', (id) => `<path d="M60,100 V30 Q60,10 80,10 Q100,10 100,30 V100 Z" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M60,80 V30 Q60,10 80,10 Q100,10 100,30 V80" fill="none" stroke="var(--finito)" stroke-width="7"/>`],
    ko: ['Colatura e goccia sul fondo', 'Il liquido cola come una vernice: in basso la parete è più spessa e si forma una goccia.', (id) => `<path d="M60,10 V80 Q60,100 80,100 Q100,100 100,80 V10 Z" fill="url(#${id}-tratteggio)" class="contorno"/><path d="M60,30 V80 Q60,104 80,106 Q100,104 100,80 V30" fill="none" stroke="var(--finito)" stroke-width="10"/><circle cx="80" cy="112" r="5" class="m-finito"/><circle cx="80" cy="110" r="11" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  rivestimento: ['Rivestimento per immersione', 'Al posto del distaccante si usa un primer: il PVC aderisce al pezzo metallico e diventa un rivestimento isolante e protettivo.', (id) => `
    <rect x="60" y="30" width="100" height="16" class="m-stampo contorno"/>
    <rect x="30" y="54" width="160" height="22" rx="11" class="m-finito contorno"/>
    <rect x="30" y="60" width="160" height="10" rx="5" class="m-stampo contorno"/>
    ${etichetta({ testo: 'impugnatura metallica rivestita', tx: 110, ty: 104, ancora: 'middle' })}`],
  doppia: ['Doppia immersione', 'Due immersioni successive formano due strati: due colori, durezze diverse o un isolamento che mostra l\'usura.', () => `
    <path d="M70,10 V90 Q70,112 110,112 Q150,112 150,90 V10" fill="none" stroke="var(--finito)" stroke-width="14"/>
    <path d="M70,10 V90 Q70,112 110,112 Q150,112 150,90 V10" fill="none" stroke="var(--fuso)" stroke-width="5"/>
    ${etichetta({ testo: 'strato 1', tx: 160, ty: 40 })}${etichetta({ testo: 'strato 2', tx: 160, ty: 60 })}`],
};

module.exports = { viewBox: '0 0 820 380', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
