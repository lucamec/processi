// Schema animato e mini-diagrammi: Sabbiatura (Thompson 2007, pp. 388–391).
// Sezione della parete di un vaso di vetro con la maschera di cera: incisione a più livelli.
// Fasi: 1 maschera, 2 prima incisione, 3 maschera modificata, 4 seconda incisione, 5 pulizia.
'use strict';
const C = require('../componenti');
const { anim, freccia, etichetta } = C;
const VETRO = '#cfe3ea', CERA = '#5b4a8a', FONDO = '#eef1f4';

function schema(id) {
  return `
<!-- parete di vetro -->
<rect x="120" y="220" width="560" height="60" fill="${VETRO}" class="contorno"/>
${etichetta({ testo: 'Vetro', tx: 700, ty: 260 })}
<!-- zone incise: A (due passate), B (solo la seconda) -->
<g${anim({ sy: [0, 0.6, 0.6, 1, 1] }, { sy: 0 }, [0, 220])}>${[160, 400].map((x) => `<rect x="${x}" y="220" width="80" height="18" fill="${FONDO}"/>`).join('')}</g>
<g${anim({ sy: [0, 0, 0, 1, 1] }, { sy: 0 }, [0, 220])}><rect x="280" y="220" width="80" height="10" fill="${FONDO}"/></g>
<g${anim({ op: [0, 0, 0, 0, 1] }, { op: 0 })}>
  ${[160, 400].map((x) => `<path d="M${x},220 V238 H${x + 80} V220" fill="none" style="stroke:var(--finito)" stroke-width="3"/>`).join('')}
  <path d="M280,220 V230 H360 V220" fill="none" style="stroke:var(--finito)" stroke-width="3"/>
</g>
<!-- maschera di cera -->
<g${anim({ op: [1, 1, 1, 1, 0] }, { op: 1 })}>
  <rect x="120" y="208" width="40" height="12" fill="${CERA}"/><rect x="240" y="208" width="40" height="12" fill="${CERA}"/><rect x="360" y="208" width="40" height="12" fill="${CERA}"/><rect x="480" y="208" width="200" height="12" fill="${CERA}"/>
</g>
<rect x="280" y="208" width="80" height="12" fill="${CERA}"${anim({ op: [1, 1, 0, 0, 0] }, { op: 1 })}/>
${etichetta({ testo: 'Maschera di cera (dal disegno)', tx: 480, ty: 196 })}
<!-- ugello e getto -->
<g${anim({ op: [0, 1, 0, 1, 0], tx: [0, 160, 0, 160, 0] }, { op: 0, tx: 0 })}>
  <path d="M180,60 H220 L212,120 H188 Z" class="m-stampo contorno"/>
  <path d="M190,120 L160,206 H240 L210,120 Z" style="fill:var(--grezzo)" fill-opacity="0.45"/>
  ${[175, 195, 215, 230].map((x, i) => `<circle cx="${x}" cy="${150 + i * 12}" r="3" fill="#8a7a5a"/>`).join('')}
</g>
${etichetta({ testo: 'Aria compressa (5,5–8,6 bar) con abrasivo', tx: 240, ty: 60 })}
<g${anim({ op: [1, 0, 0, 0, 0] })}>${etichetta({ testo: 'il disegno, tradotto in una maschera di cera adesiva, si applica sul vetro', tx: 20, ty: 330 })}</g>
<g${anim({ op: [0, 1, 0, 0, 0] })}>${etichetta({ testo: 'prima incisione con ossido di alluminio, grana 180–220, in cabina a guanti', tx: 20, ty: 330 })}</g>
<g${anim({ op: [0, 0, 1, 0, 0] })}>${etichetta({ testo: 'si toglie una parte della maschera, si rinforzano le zone delicate', tx: 20, ty: 330 })}</g>
<g${anim({ op: [0, 0, 0, 1, 0] })}>${etichetta({ testo: 'seconda incisione: due livelli di profondità e trasparenza', tx: 20, ty: 330 })}</g>
<g${anim({ op: [0, 0, 0, 0, 1] })}>${etichetta({ testo: 'tolta la maschera, si pulisce e si lucida', tx: 20, ty: 330 })}</g>
`;
}

const coppie = {
  vista: {
    ok: ['Incisione perpendicolare alla maschera', 'Il getto lavora in linea retta: l\'erosione scende perpendicolare, senza passare sotto i bordi della maschera.', (id) => `<rect x="20" y="60" width="120" height="30" fill="${VETRO}" class="contorno"/><rect x="20" y="52" width="40" height="8" fill="${CERA}"/><rect x="100" y="52" width="40" height="8" fill="${CERA}"/><rect x="60" y="60" width="40" height="12" fill="${FONDO}"/>${C.freccia({ id, x1: 80, y1: 10, x2: 80, y2: 50 })}`],
    ko: ['Sottosquadri e zone nascoste', 'Ciò che il getto non vede non viene inciso.', (id) => `<path d="M20,90 V50 H60 V70 H100 V50 H140 V90 Z" fill="${VETRO}" class="contorno"/>${C.freccia({ id, x1: 20, y1: 10, x2: 54, y2: 46 })}<circle cx="96" cy="66" r="12" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  prove: {
    ok: ['Abrasivo provato prima', 'L\'asportazione è permanente: abrasivo, pressione e distanza si provano prima della produzione.', () => `${[0, 1, 2].map((i) => `<rect x="${24 + i * 44}" y="40" width="36" height="50" fill="${VETRO}" class="contorno"/><rect x="${24 + i * 44}" y="40" width="36" height="${10 + i * 8}" fill="${FONDO}" fill-opacity="0.9"/>`).join('')}`],
    ko: ['Getto troppo aggressivo', 'Un abrasivo o una pressione sbagliati scavano troppo e non si può tornare indietro.', () => `<rect x="20" y="40" width="120" height="50" fill="${VETRO}" class="contorno"/><path d="M60,40 Q80,80 100,40 Z" fill="${FONDO}" stroke="var(--testo)"/><circle cx="80" cy="56" r="20" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
  sporco: {
    ok: ['Texture protetta', 'Le superfici sabbiate trattengono sporco e impronte: spesso si proteggono con un laminato o un rivestimento trasparente.', () => `<rect x="20" y="50" width="120" height="40" fill="${VETRO}" class="contorno"/><rect x="20" y="44" width="120" height="6" fill="var(--flusso)" fill-opacity="0.5"/>`],
    ko: ['Texture esposta al tatto', 'Senza protezione le impronte restano ben visibili sul vetro sabbiato.', () => `<rect x="20" y="50" width="120" height="40" fill="#dfe8ec" class="contorno"/><ellipse cx="70" cy="64" rx="10" ry="14" fill="none" stroke="#8a9aa6" stroke-dasharray="2 2"/><circle cx="70" cy="64" r="20" fill="none" stroke="var(--ko)" stroke-width="2.5"/>`],
  },
};

const varianti = {
  abrasivi: ['Abrasivi diversi', 'Sabbia, la più comune; graniglia d\'acciaio, la più aggressiva; ossido di alluminio, più dolce; microsfere di vetro, per materiali delicati; gusci di noce o cocco, che non intaccano vetro e placcature.', () => `
    ${['#c8b080', '#5a6068', '#d8d0c0', '#cfe3ea', '#8a5a3a'].map((c, i) => `<circle cx="${30 + i * 40}" cy="62" r="${8 + (i === 3 ? 0 : 4)}" fill="${c}" class="contorno"/>`).join('')}`],
  scultura: ['Scultura del vetro', 'Il vetro si scolpisce in rilievi tridimensionali, con o senza maschera, per vetrate architettoniche e vetrine.', () => `
    <rect x="20" y="30" width="180" height="70" fill="${VETRO}" class="contorno"/>
    <path d="M40,30 Q70,70 100,30 Q130,80 170,30" fill="${FONDO}" stroke="var(--testo)"/>`],
  plastica: ['Sabbiatura con plastica (PMB)', 'Granuli di plastica, più teneri e di forme scelte, a pressione più bassa (valore n.d.: la conversione è illeggibile nell\'OCR): servono attrezzature specialistiche e sono i più costosi.', () => `
    <rect x="20" y="70" width="180" height="30" class="m-stampo contorno"/>
    ${[40, 70, 100, 130, 160].map((x, i) => `<rect x="${x}" y="${40 + (i % 2) * 10}" width="8" height="8" fill="var(--flusso)" transform="rotate(${i * 25} ${x + 4} ${44 + (i % 2) * 10})"/>`).join('')}`],
};

module.exports = { viewBox: '0 40 820 310', schema, mini: coppie, varianti, miniVariante: { w: 220, h: 124 } };
