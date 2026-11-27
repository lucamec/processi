// Schema animato e mini-diagrammi: Taglio a getto d'acqua (Thompson 2007, pp. 272–275).
// Sezione della testa a getto abrasivo sopra il pezzo e la vasca. Fasi: 1 acqua in pressione,
// 2 abrasivo nella camera di miscelazione, 3 taglio, 4 sostegno ed estrazione del pezzo.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const FONDO = '#eef1f4';

function schema(id) {
  return `
<!-- vasca che dissipa il getto -->
<rect x="140" y="250" width="540" height="80" style="fill:var(--flusso)" opacity="0.15"/>
<path d="M140,236 V330 H680 V236" fill="none" stroke="var(--testo)" stroke-width="5"/>
${Array.from({ length: 12 }, (_, i) => `<rect x="${160 + i * 44}" y="218" width="6" height="18" class="scuro"/>`).join('')}
${etichetta({ testo: 'Vasca d\'acqua: assorbe il getto, l\'acqua si filtra e si ricicla', tx: 150, ty: 352 })}

<!-- pezzo: lastra di vetro -->
<rect x="170" y="196" width="480" height="22" fill="#cfe3ea" class="contorno"/>
<rect x="404" y="196" width="10" height="22" fill="${FONDO}"${anim({ op: [0, 0, 1, 1] }, { op: 0 })}/>
<path d="M409,196 Q409,212 420,218" fill="none" stroke="var(--testo)" stroke-width="1.5" stroke-dasharray="3 2"${anim({ op: [0, 0, 1, 0] }, { op: 0 })}/>
<g${anim({ op: [0, 0, 0, 1] }, { op: 0 })}>
  <path d="M380,218 l14,-10 v10 Z M440,218 l-14,-10 v10 Z" class="m-grezzo contorno"/>
  ${etichetta({ testo: 'cunei che sostengono il pezzo', tx: 470, ty: 262 })}
</g>
${etichetta({ testo: 'Vetro da 25 mm', tx: 660, ty: 210 })}

<!-- testa di taglio -->
<path d="M386,30 H432 V90 H424 V120 H394 V90 H386 Z" class="m-stampo contorno"/>
<rect x="404" y="120" width="10" height="62" class="scuro"/>
<circle cx="409" cy="96" r="5" style="fill:#e05a8a"/>
${etichetta({ testo: 'Orifizio in diamante, zaffiro o rubino (0,1–0,25 mm)', tx: 450, ty: 60, px: 414, py: 96 })}
<g${anim({ op: [1, 1, 1, 0] }, { op: 0 })}>${freccia({ id, x1: 409, y1: -10, x2: 409, y2: 34 })}</g>
${etichetta({ testo: 'Acqua fino a 4.000 bar', tx: 200, ty: 30 })}
<!-- abrasivo -->
<g${anim({ op: [0, 1, 1, 0] }, { op: 0 })}>
  <path d="M300,96 H394" fill="none" stroke="var(--grezzo)" stroke-width="8" stroke-dasharray="3 4"/>
  ${etichetta({ testo: 'Abrasivo (granato)', tx: 200, ty: 92 })}
</g>
<!-- getto -->
<path d="M409,182 V330" stroke="var(--flusso)" stroke-width="5"${anim({ op: [0, 0, 1, 0] }, { op: 0 })}/>
<g${anim({ op: [0, 0, 1, 0] })}>${etichetta({ testo: 'il getto (Ø ~1 mm) erode e devia in profondità', tx: 440, ty: 160 })}</g>
`;
}

const coppie = {
  raggi: {
    ok: ['Curve ampie e velocità adeguata', 'Angoli vivi e raggi stretti costringono a rallentare; più lento, o con più pressione, il getto lascia meno conicità.', () => `<path d="M20,90 V50 Q20,30 40,30 H140" fill="none" stroke="var(--finito)" stroke-width="5"/>`],
    ko: ['Curve strette a velocità alta', 'Il getto devia in profondità e la conicità del taglio aumenta sulle curve.', () => `<path d="M20,90 V30 H140" fill="none" stroke="var(--finito)" stroke-width="5"/><path d="M20,30 q10,10 6,24" fill="none" stroke="var(--ko)" stroke-width="2" stroke-dasharray="3 3"/><circle cx="20" cy="30" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  fori: {
    ok: ['Fori più larghi dello spessore', 'I fori con diametro inferiore allo spessore vanno forati, non tagliati.', () => `<rect x="20" y="50" width="120" height="30" class="m-finito contorno"/><rect x="60" y="50" width="40" height="30" fill="${FONDO}"/>`],
    ko: ['Foro più stretto dello spessore', 'Il getto non riesce a tagliare un foro così stretto in un materiale spesso.', () => `<rect x="20" y="30" width="120" height="60" class="m-finito contorno"/><rect x="74" y="30" width="12" height="60" fill="${FONDO}"/><circle cx="80" cy="60" r="16" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  sostegno: {
    ok: ['Linguette o cunei per i pezzi sottili', 'Un pezzo sottile può rompersi per il suo peso prima della fine del taglio: si prevedono linguette o si inseriscono cunei.', () => `<rect x="20" y="50" width="120" height="12" class="m-finito contorno"/><path d="M50,62 l10,14 h-20 Z M110,62 l10,14 h-20 Z" class="m-grezzo contorno"/>`],
    ko: ['Pezzo sottile non sostenuto', 'Senza sostegno il pezzo si spezza sul materiale non ancora tagliato.', () => `<path d="M20,50 H80 L140,70 V82 L80,62 H20 Z" class="m-finito contorno"/><circle cx="80" cy="58" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  acqua: ['Solo acqua', 'Un getto supersonico di acqua pura erode il materiale: taglio molto più pulito, adatto ai materiali teneri.', () => `
    <rect x="96" y="10" width="28" height="40" class="m-stampo contorno"/><path d="M110,50 V118" stroke="var(--flusso)" stroke-width="3"/>
    <rect x="30" y="70" width="160" height="24" style="fill:var(--grezzo)" opacity="0.6" stroke="var(--testo)"/>`],
  abrasivo: ['Con abrasivo', 'Particelle taglienti (spesso granato) nella camera di miscelazione formano un fascio di circa 1 mm che taglia i materiali duri; grane più fini (120, 80, 50) sono più lente ma più lisce.', () => `
    <rect x="96" y="10" width="28" height="40" class="m-stampo contorno"/><path d="M40,30 H96" stroke="var(--grezzo)" stroke-width="6" stroke-dasharray="3 3"/>
    <path d="M110,50 V118" stroke="var(--flusso)" stroke-width="5"/><rect x="30" y="70" width="160" height="24" class="m-stampo contorno"/>`],
  pacco: ['Fogli impilati', 'Fogli sottili si impilano e si tagliano in un\'unica passata per ridurre il tempo; i pezzi si annidano anche a 2 mm di distanza.', () => `
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="30" y="${50 + i * 9}" width="160" height="7" class="m-finito contorno"/>`).join('')}
    <path d="M110,10 V118" stroke="var(--flusso)" stroke-width="4"/>`],
};

module.exports = { viewBox: '0 -10 820 380', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
