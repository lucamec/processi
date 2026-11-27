// Schema animato e mini-diagrammi: Serigrafia (Thompson 2007, pp. 400–403).
// Sezione di telaio, rete e stencil sopra una lastra di vetro. Fasi: 1 stencil, 2 carico, 3 stampa, 4 scarico.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const VETRO = '#cfe3ea', INK = '#1d232b', EMULS = '#4c62d9';
// aperture dello stencil (dove l'inchiostro passa)
const AP = [[230, 330], [490, 590]];

function schema(id) {
  const clip = `${id}-stampa`;
  return `
<defs><clipPath id="${clip}"><rect x="160" y="200" width="500" height="20"${anim({ sx: [0, 0, 1, 1] }, { sx: 0 }, [160, 200])}/></clipPath></defs>
<!-- piano e lastra -->
<rect x="120" y="230" width="580" height="24" class="m-stampo contorno"/>
<g${anim({ tx: [-460, 0, 0, 460] }, { tx: -460 })}>
  <rect x="180" y="212" width="460" height="18" fill="${VETRO}" class="contorno"/>
  <g clip-path="url(#${clip})">${AP.map((a) => `<rect x="${a[0]}" y="208" width="${a[1] - a[0]}" height="4" fill="${INK}"/>`).join('')}</g>
</g>
${etichetta({ testo: 'Lastra di vetro', tx: 560, ty: 280, px: 600, py: 230 })}
<!-- telaio con rete e stencil -->
<g${anim({ ty: [-40, 0, 0, -40] }, { ty: -40 })}>
  <rect x="140" y="170" width="20" height="36" class="m-macchina contorno"/><rect x="660" y="170" width="20" height="36" class="m-macchina contorno"/>
  <line x1="160" y1="204" x2="660" y2="204" stroke="var(--testo)" stroke-width="1.5" stroke-dasharray="3 2"/>
  <g${anim({ op: [1, 1, 1, 1] }, { op: 0 })}>
    <rect x="160" y="201" width="${AP[0][0] - 160}" height="6" fill="${EMULS}"/>
    <rect x="${AP[0][1]}" y="201" width="${AP[1][0] - AP[0][1]}" height="6" fill="${EMULS}"/>
    <rect x="${AP[1][1]}" y="201" width="${660 - AP[1][1]}" height="6" fill="${EMULS}"/>
  </g>
</g>
${etichetta({ testo: 'Telaio con rete (nylon, poliestere o inox) e stencil impermeabile', tx: 120, ty: 120, px: 280, py: 170 })}
<!-- carica di inchiostro e racla -->
<g${anim({ op: [0, 1, 1, 0], tx: [0, 0, 420, 420] }, { op: 0, tx: 0 })}>
  <ellipse cx="200" cy="196" rx="18" ry="7" fill="${INK}"/>
</g>
<g${anim({ op: [0, 0, 1, 0], tx: [0, 0, 420, 420] }, { op: 0, tx: 0 })}>
  <path d="M168,120 H196 V170 L186,198 H178 L168,170 Z" class="m-macchina contorno" transform="rotate(-12 182 198)"/>
</g>
<g${anim({ op: [1, 0, 0, 0] })}>${etichetta({ testo: 'Positivo su acetato e luce UV: l\'emulsione esposta indurisce, il resto si lava via', tx: 120, ty: 330 })}</g>
<g${anim({ op: [0, 1, 0, 0] })}>${etichetta({ testo: 'Il pezzo si carica sotto il telaio; sulla rete si deposita l\'inchiostro', tx: 120, ty: 330 })}</g>
<g${anim({ op: [0, 0, 1, 0] })}>${etichetta({ testo: 'La racla in gomma spinge l\'inchiostro attraverso la rete aperta', tx: 120, ty: 330 })}</g>
<g${anim({ op: [0, 0, 0, 1] })}>${etichetta({ testo: 'Il pezzo esce bagnato e asciuga; ogni colore vuole un altro telaio', tx: 120, ty: 330 })}</g>
${freccia({ id, x1: 600, y1: 140, x2: 660, y2: 140 })}
`;
}

const coppie = {
  forma: {
    ok: ['Superfici piane o cilindriche', 'La serigrafia stampa superfici piane e cilindriche.', () => `<rect x="20" y="70" width="120" height="20" fill="${VETRO}" class="contorno"/><rect x="30" y="64" width="100" height="6" fill="${INK}"/>`],
    ko: ['Superfici ondulate o concave', 'Su forme ondulate o concave la rete non tocca: servono tampografia o stampa idrografica.', () => `<path d="M20,90 Q50,50 80,80 T140,70 V100 H20 Z" fill="${VETRO}" class="contorno"/><line x1="20" y1="56" x2="140" y2="56" stroke="var(--testo)" stroke-dasharray="3 2"/><circle cx="80" cy="70" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  colori: {
    ok: ['Un telaio per colore, a registro', 'Ogni colore ha il suo telaio, messo a registro, e deve asciugare prima del successivo.', () => `<rect x="20" y="40" width="120" height="50" fill="#fff" class="contorno"/><rect x="40" y="52" width="40" height="26" fill="#3f8f8a"/><rect x="80" y="52" width="40" height="26" fill="#f06a1d"/>`],
    ko: ['Colori fuori registro', 'Senza registro i colori si sovrappongono o lasciano vuoti.', () => `<rect x="20" y="40" width="120" height="50" fill="#fff" class="contorno"/><rect x="40" y="52" width="40" height="26" fill="#3f8f8a"/><rect x="74" y="58" width="40" height="26" fill="#f06a1d" fill-opacity="0.9"/><circle cx="78" cy="66" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  rete: {
    ok: ['Rete fine per dettagli', 'Reti leggere per carta e materiali poco assorbenti: più dettaglio, meno inchiostro.', () => `${Array.from({ length: 12 }, (_, i) => `<line x1="${24 + i * 10}" y1="40" x2="${24 + i * 10}" y2="90" stroke="var(--testo)" stroke-width="0.8"/>`).join('')}`],
    ko: ['Rete grossa per dettagli fini', 'Reti pesanti depositano più inchiostro (tessili) ma risolvono meno i dettagli.', () => `${Array.from({ length: 5 }, (_, i) => `<line x1="${30 + i * 25}" y1="40" x2="${30 + i * 25}" y2="90" stroke="var(--testo)" stroke-width="3"/>`).join('')}<circle cx="80" cy="65" r="22" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  finestra: ['Stampa sul retro (window printing)', 'Si stampa il retro di un pannello trasparente: l\'inchiostro resta protetto e lucido, come negli schermi di telefoni e televisori.', () => `
    <rect x="30" y="40" width="160" height="30" fill="${VETRO}" class="contorno"/>
    <rect x="30" y="70" width="40" height="6" fill="${INK}"/><rect x="150" y="70" width="40" height="6" fill="${INK}"/>
    <circle cx="110" cy="20" r="6" fill="none" stroke="var(--testo)"/>`],
  etichetta: ['Su etichetta trasparente', 'L\'immagine rovesciata si stampa sul retro di un\'etichetta trasparente, poi incollata: sembra stampa diretta.', () => `
    <path d="M30,100 Q110,40 190,100" fill="none" stroke="var(--testo)" stroke-width="2"/>
    <path d="M70,76 Q110,54 150,76" fill="none" stroke="${EMULS}" stroke-width="5"/>`],
  conduttivi: ['Inchiostri speciali', 'Vernici UV, metallizzati, perlescenti, fluorescenti, termocromici, a rilievo, da grattare e conduttivi per circuiti flessibili.', () => `
    <rect x="30" y="40" width="160" height="60" fill="#fff" class="contorno"/>
    <path d="M50,60 H100 V80 H150" fill="none" stroke="#b08d2a" stroke-width="4"/><circle cx="150" cy="80" r="5" fill="#b08d2a"/>`],
};

module.exports = { viewBox: '0 90 820 270', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
