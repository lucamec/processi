#!/usr/bin/env node
// Genera sito/<slug>.html da dati/<slug>.json con un unico template, più sito/index.html.
// Poi esegue i controlli di accettazione e stampa un rapporto. Solo moduli standard di Node.
'use strict';
const fs = require('fs');
const path = require('path');
const C = require('./src/componenti');
const { esc } = C;

const R = __dirname;
const SITO = path.join(R, 'sito');
const ASSETS = path.join(SITO, 'assets');
const errori = [];
const avvisi = [];

// ---------- Lettura ----------
const catalogo = JSON.parse(fs.readFileSync(path.join(R, 'catalogo.json'), 'utf8'));
const template = fs.readFileSync(path.join(R, 'src/template.html'), 'utf8');
const pagine = fs.readdirSync(path.join(R, 'dati')).filter((f) => f.endsWith('.json')).sort()
  .map((f) => JSON.parse(fs.readFileSync(path.join(R, 'dati', f), 'utf8')));
const pronte = new Set(pagine.map((p) => p.slug));

// Pagine con vista spaziale approvata: lette dal registro giustificazioni-3d.md
const registro3d = fs.readFileSync(path.join(R, 'giustificazioni-3d.md'), 'utf8');
const approvate3d = new Set([...registro3d.matchAll(/^\| [^|]+ \| `([a-z0-9-]+)` \|/gm)].map((m) => m[1]));

const CAMPI = [
  ['materiali', 'Materiali lavorabili'],
  ['volumi', 'Volumi / lotti tipici'],
  ['costoAttrezzatura', 'Costo attrezzatura'],
  ['costoUnitario', 'Costo unitario'],
  ['tempoCiclo', 'Tempo ciclo'],
  ['qualitaSuperficiale', 'Qualità superficiale'],
  ['precisione', 'Precisione / tolleranze'],
  ['dimensioni', 'Dimensioni tipiche dei pezzi'],
];

const nd = (s) => esc(s).replace(/n\.d\./g, '<span class="nd">n.d.</span>');
const pag = (p) => (p ? ` <span class="pag">(p. ${esc(p)})</span>` : '');
const parole = (s) => s.trim().split(/\s+/).filter(Boolean).length;

// ---------- Validazione dei dati ----------
function valida(d) {
  const e = (m) => errori.push(`${d.slug}: ${m}`);
  if (!catalogo.find((c) => c.slug === d.slug)) e('slug assente da catalogo.json');
  for (const k of ['titolo', 'titoloOriginale', 'parte', 'categoria', 'sintesi', 'schema', 'comeFunziona', 'caratteristiche', 'vincoli', 'varianti', 'correlati', 'fonte']) {
    if (d[k] === undefined) e(`campo mancante: ${k}`);
  }
  // Decisione del 26/11/2026: vista 3D su tutte le pagine (registro in giustificazioni-3d.md)
  if (!d.vista3d || d.vista3d.tecnica !== 'webgl') e('vista3d mancante: ogni pagina deve avere { tecnica: "webgl", alt, ... }');
  if (!approvate3d.has(d.slug) && !/Tutte le altre pagine/.test(registro3d)) e('pagina non registrata in giustificazioni-3d.md');
  if (!fs.existsSync(path.join(R, 'src/scene3d', d.slug + '.js'))) e('scena 3D mancante: src/scene3d/' + d.slug + '.js');
  if (!fs.existsSync(path.join(R, 'src/schemi', d.slug + '.js'))) e('schema 2D mancante: src/schemi/' + d.slug + '.js');
  if (!d.schema || d.schema.fasi.length < 2) e('lo schema deve avere almeno 2 fasi');
  const n = parole(d.comeFunziona.map((p) => p.testo).join(' '));
  if (n > 200) e(`"Come funziona" supera 200 parole (${n})`);
  for (const [k] of CAMPI) if (!d.caratteristiche[k]) avvisi.push(`${d.slug}: caratteristica ${k} assente → mostrata come n.d.`);
}

// ---------- Blocchi HTML ----------
function svgPrincipale(d, mod) {
  const id = 'sc';
  return `<svg class="schema-svg" viewBox="${mod.viewBox}" role="img" aria-labelledby="${id}-t ${id}-d">
<title id="${id}-t">${esc(d.schema.titolo)}</title>
<desc id="${id}-d">${esc(d.schema.descrizione)}</desc>
${C.defs(id)}
${mod.schema(id)}
</svg>`;
}

function bloccoSchema(d, mod) {
  const f = d.schema.fasi;
  const v = d.vista3d;
  return `<div class="schema" id="schema" data-durate="${f.map((x) => x.durata).join(',')}">
  <div class="schema-griglia">
    <div>
      <div class="vista-3d" data-scena="${d.slug}" data-alt="${esc(v.alt)}">
        <div class="tela-cornice"><div class="tela-3d"></div><div class="etichette-3d" aria-hidden="true"></div></div>
        <div class="controlli-3d">
          <button type="button" data-azione="taglio" aria-pressed="true">Spaccato</button>
          <button type="button" data-azione="camera">Vista iniziale</button>
          ${v.dettaglio ? `<button type="button" data-azione="segui" aria-pressed="false">${esc(v.dettaglio)}</button>` : ''}
          <span class="suggerimento">Trascina per ruotare · rotella o pizzico per lo zoom</span>
        </div>
      </div>
      <div class="controlli">
        <button type="button" data-azione="prec">◀ Fase precedente</button>
        <button type="button" data-azione="play" aria-pressed="false">▶ Play</button>
        <button type="button" data-azione="succ">Fase successiva ▶</button>
        <p class="nota-movimento" hidden>Movimento ridotto attivo nelle preferenze di sistema: l'animazione resta ferma, usa i pulsanti per passare da una fase all'altra.</p>
      </div>
      <ol class="barra-fasi" aria-label="Fasi del ciclo">
        ${f.map((x, i) => `<li><button type="button" data-fase="${i + 1}"${i === 0 ? ' aria-current="step"' : ''}>${i + 1}. ${esc(x.titolo)}<span class="avanz"></span></button></li>`).join('\n        ')}
      </ol>
      <p class="annuncio sr-only" aria-live="polite"></p>
    </div>
    ${C.legendaMateriali()}
  </div>
  <ol class="didascalie">
    ${f.map((x, i) => `<li${i === 0 ? ' class="attiva"' : ''}><b>Fase ${i + 1} – ${esc(x.titolo)}</b>${esc(x.didascalia)}${pag(x.pag)}</li>`).join('\n    ')}
  </ol>
  <p class="alternativa-testuale"><b>Descrizione della vista 3D.</b> ${esc(v.alt)}</p>
  <h3 class="titolo-sezione2d">Schema in sezione (2D)</h3>
  <div class="schema-scorri">${svgPrincipale(d, mod)}</div>
</div>`;
}

function bloccoCome(d) {
  return d.comeFunziona.map((p) => `<p><button type="button" class="rimando-fase" data-vai="${p.fase}" aria-label="Mostra la fase ${p.fase} nello schema">Fase ${p.fase}</button>${esc(p.testo)}${pag(p.pag)}</p>`).join('\n  ');
}

function bloccoScheda(d) {
  const righe = CAMPI.map(([k, et]) => {
    const c = d.caratteristiche[k];
    const val = c ? nd(c.valore) + pag(c.pag) + (c.ocr ? `<span class="nota-ocr">${nd(c.ocr)}</span>` : '') : '<span class="nd">n.d.</span>';
    return `<tr><th scope="row">${et}</th><td>${val}</td></tr>`;
  });
  return `<table><caption class="sr-only">Caratteristiche del processo</caption><tbody>${righe.join('')}</tbody></table>`;
}

function coppiaMini(mod, chiave, slug) {
  const m = mod.mini[chiave];
  if (!m) { errori.push(`${slug}: mini-diagramma "${chiave}" non definito nello schema`); return ''; }
  const fig = (lato, cls, label) => {
    const [titolo, desc, corpo] = m[lato];
    return `<figure class="${cls}">${C.mini({ id: `v-${chiave}-${lato}`, titolo: `${label}: ${titolo}`, desc, corpo })}<figcaption>${label}</figcaption></figure>`;
  };
  return `<div class="coppia">${fig('ok', 'si', 'Corretto')}${fig('ko', 'no', 'Da evitare')}</div>`;
}

function bloccoVincoli(d, mod) {
  const card = d.vincoli.map((v) => `<article class="card"><h3>${esc(v.titolo)}</h3>${coppiaMini(mod, v.mini, d.slug)}<p>${nd(v.spiegazione)}${pag(v.pag)}</p>${v.ocr ? `<p class="nota-ocr">${nd(v.ocr)}</p>` : ''}</article>`);
  let html = `<div class="griglia-card">${card.join('\n')}</div>`;
  if (d.approfondimento) {
    const a = d.approfondimento;
    html += `<aside class="approfondimento"><h3>${esc(a.titolo)}</h3><p>${esc(a.testo)}${pag(a.pag)}</p></aside>`;
  }
  return html;
}

function bloccoVarianti(d, mod) {
  if (!d.varianti.length) return '<p>Il libro non descrive varianti di questo processo.</p>';
  const { w, h } = mod.miniVariante;
  return `${d.variantiNota ? `<p>${esc(d.variantiNota)}</p>` : ''}<div class="griglia-card">${d.varianti.map((v) => {
    const s = mod.varianti[v.mini];
    if (!s) { errori.push(`${d.slug}: schema variante "${v.mini}" non definito`); return ''; }
    const svg = C.mini({ id: `var-${v.mini}`, titolo: s[0], desc: s[1], w, h, corpo: s[2] });
    return `<article class="card"><h3>${esc(v.titolo)}</h3>${v.titoloOriginale ? `<p class="originale" lang="en">${esc(v.titoloOriginale)}</p>` : ''}<div class="variante-schema">${svg}</div><p>${esc(v.testo)}${pag(v.pag)}</p></article>`;
  }).join('\n')}</div>`;
}

function bloccoCorrelati(d) {
  return `<ul class="correlati">${d.correlati.map((c) => {
    const nome = pronte.has(c.slug) ? `<a href="${c.slug}.html">${esc(c.nome)}</a>` : `<span>${esc(c.nome)}</span> <span class="in-arrivo">(pagina in preparazione)</span>`;
    if (!catalogo.find((x) => x.slug === c.slug)) errori.push(`${d.slug}: correlato "${c.slug}" non è nel catalogo`);
    return `<li>${nome} – ${esc(c.nota)}${pag(c.pag)}</li>`;
  }).join('')}</ul>`;
}

// Piede comune a tutte le pagine: fonte generale e autore del progetto.
const PIEDE = `<footer class="piede"><div class="contenitore">
<hr>
<p>Fonte: R. Thompson, <cite lang="en">Manufacturing Processes for Design Professionals</cite>, Thames &amp; Hudson, London 2007.</p>
<p>Progetto del <a href="https://iuav.unifind.cineca.it/get/person/004039">prof. Luca Casarotto</a> dell'<a href="https://www.iuav.it/it">Università Iuav di Venezia</a>, realizzato con Claude</p>
</div></footer>`;

function bloccoFonte(d) {
  return `<p>Thompson, R. (2007). <cite lang="en">Manufacturing Processes for Design Professionals</cite>. London: Thames &amp; Hudson, pp. ${esc(d.fonte.pagine)}.</p>
  <p>Testi riformulati in italiano a scopo didattico; tutte le illustrazioni sono originali. I numeri di pagina tra parentesi rimandano al libro. "n.d." indica un dato assente dal libro o illeggibile nella scansione.</p>`;
}

function pagina(d) {
  const mod = require(`./src/schemi/${d.slug}`);
  const sostituzioni = {
    TITOLO: esc(d.titolo), TITOLO_ORIGINALE: esc(d.titoloOriginale), PARTE: esc(d.parte), CATEGORIA: esc(d.categoria),
    SINTESI: esc(d.sintesi), SINTESI_ATTR: esc(d.sintesi),
    SCHEMA: bloccoSchema(d, mod), VISTA3D: '', COME: bloccoCome(d), SCHEDA: bloccoScheda(d),
    VINCOLI: bloccoVincoli(d, mod), VARIANTI: bloccoVarianti(d, mod), CORRELATI: bloccoCorrelati(d), FONTE: bloccoFonte(d),
    PIEDE: PIEDE,
    SCRIPT3D: `<script src="assets/three.min.js"></script>\n<script src="assets/vista3d.js"></script>\n<script src="assets/scene3d/${d.slug}.js"></script>`,
  };
  return template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, k) => {
    if (!(k in sostituzioni)) { errori.push(`${d.slug}: segnaposto {{${k}}} senza valore`); return ''; }
    return sostituzioni[k];
  });
}

function indice() {
  const parti = [...new Set(catalogo.map((c) => c.parte))];
  const corpo = parti.map((p) => {
    const cats = [...new Set(catalogo.filter((c) => c.parte === p).map((c) => c.categoria))];
    return `<section class="indice-parte" aria-labelledby="${slugify(p)}"><h2 id="${slugify(p)}">${esc(p)}</h2>${cats.map((cat) => `
  <div class="indice-gruppo"><h3>${esc(cat)}</h3>
  <ul class="indice-cat">${catalogo.filter((c) => c.parte === p && c.categoria === cat).map((c) => pronte.has(c.slug)
    ? `<li data-cerca="${esc((c.titolo + ' ' + c.titoloOriginale + ' ' + c.categoria).toLowerCase())}"><a href="${c.slug}.html">${esc(c.titolo)}</a><span lang="en">${esc(c.titoloOriginale)}</span><span>Thompson, pp. ${c.pagine}</span></li>`
    : `<li class="non-pronta">${esc(c.titolo)}<span lang="en">${esc(c.titoloOriginale)}</span><span>In preparazione</span></li>`).join('')}</ul></div>`).join('')}</section>`;
  }).join('\n');
  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Processi produttivi per il design – Indice</title>
<link rel="stylesheet" href="assets/stile.css">
</head>
<body>
<header class="testata"><div class="contenitore"><a href="index.html">Processi produttivi per il design</a><span class="briciole">Indice delle tecnologie</span></div></header>
<main id="contenuto" class="contenitore">
<h1>Processi produttivi per il design</h1>
<p class="sintesi">Schede illustrate dei ${catalogo.length} processi di formatura, taglio, giunzione e finitura descritti da Thompson, per il corso di laurea triennale in Design (L-4). Ogni scheda ha una vista 3D, uno schema animato del ciclo, caratteristiche, vincoli di progetto e varianti.</p>
<nav class="indice-nav" aria-label="Parti del libro"><ul>${parti.map((p) => `<li><a href="#${slugify(p)}">${esc(p)}</a> <span>(${catalogo.filter((c) => c.parte === p).length})</span></li>`).join('')}</ul></nav>
<div class="indice-filtro" hidden><label for="filtro">Cerca un processo</label><input id="filtro" type="search" autocomplete="off" placeholder="es. saldatura, vetro, injection…" aria-describedby="filtro-esito"><p id="filtro-esito" role="status"></p></div>
${corpo}
</main>
${PIEDE}
<script>
(function () {
  var box = document.querySelector('.indice-filtro'), campo = document.getElementById('filtro'), esito = document.getElementById('filtro-esito');
  var voci = [].slice.call(document.querySelectorAll('.indice-cat li[data-cerca]'));
  box.hidden = false;
  function norm(t) { return t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }
  campo.addEventListener('input', function () {
    var q = norm(campo.value.trim()), n = 0;
    voci.forEach(function (li) { var ok = !q || norm(li.getAttribute('data-cerca')).indexOf(q) >= 0; li.hidden = !ok; if (ok) n++; });
    [].forEach.call(document.querySelectorAll('.indice-gruppo, .indice-parte'), function (g) { g.hidden = !g.querySelector('li[data-cerca]:not([hidden])'); });
    esito.textContent = q ? (n ? n + (n === 1 ? ' processo trovato' : ' processi trovati') : 'Nessun processo trovato') : '';
  });
})();
</script>
</body>
</html>
`;
}
function slugify(s) { return s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }

// ---------- Generazione ----------
pagine.forEach(valida);
if (errori.length) { console.error('ERRORI nei dati:\n - ' + errori.join('\n - ')); process.exit(1); }

fs.mkdirSync(path.join(ASSETS, 'scene3d'), { recursive: true });
// Nessun file viene cancellato: le pagine vengono sovrascritte.
fs.copyFileSync(path.join(R, 'src/stile.css'), path.join(ASSETS, 'stile.css'));
fs.copyFileSync(path.join(R, 'src/app.js'), path.join(ASSETS, 'app.js'));
fs.copyFileSync(path.join(R, 'src/vista3d.js'), path.join(ASSETS, 'vista3d.js'));
fs.copyFileSync(path.join(R, 'src/vendor/three.min.js'), path.join(ASSETS, 'three.min.js'));

for (const d of pagine) {
  fs.writeFileSync(path.join(SITO, d.slug + '.html'), pagina(d));
  fs.copyFileSync(path.join(R, 'src/scene3d', d.slug + '.js'), path.join(ASSETS, 'scene3d', d.slug + '.js'));
}
fs.writeFileSync(path.join(SITO, 'index.html'), indice());
if (errori.length) { console.error('ERRORI in generazione:\n - ' + errori.join('\n - ')); process.exit(1); }

// ---------- Controlli di accettazione ----------
function tutti(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? tutti(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
const fileSito = tutti(SITO);
const rel = (f) => path.relative(R, f);

// 1. Nessuna immagine raster
const raster = fileSito.filter((f) => /\.(jpe?g|png|webp|gif|bmp)$/i.test(f));
if (raster.length) errori.push('immagini raster in sito/: ' + raster.map(rel).join(', '));

// 2. Link interni (file e ancore)
let nLink = 0;
for (const f of fileSito.filter((x) => x.endsWith('.html'))) {
  const html = fs.readFileSync(f, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:)/.test(url)) continue;
    nLink++;
    const [file, ancora] = url.split('#');
    const dest = file ? path.join(path.dirname(f), file) : f;
    if (!fs.existsSync(dest)) { errori.push(`link rotto in ${rel(f)}: ${url}`); continue; }
    if (ancora && !fs.readFileSync(dest, 'utf8').includes(`id="${ancora}"`)) errori.push(`ancora mancante in ${rel(f)}: ${url}`);
  }
  // ogni SVG visibile ha title e desc
  for (const s of html.matchAll(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/g)) {
    if (/aria-hidden="true"/.test(s[1])) continue;
    if (!/^\s*<title/.test(s[2]) || !/<desc/.test(s[2])) errori.push(`SVG senza <title>/<desc> in ${rel(f)}`);
  }
}

// 3. Ogni pagina ha schema 2D + vista 3D; Three.js solo da file locale; il codice 3D sta solo dove previsto
const PATTERN = /perspective|rotate[XY]|translateZ|preserve-3d|three|webgl|vista-3d/;
const trovati = [...fileSito, ...tutti(path.join(R, 'src'))].filter((f) => PATTERN.test(fs.readFileSync(f, 'utf8'))).map(rel).sort();
const ammessi = (f) => /^sito\/[a-z0-9-]+\.html$/.test(f) || /^sito\/assets\/(three\.min\.js|vista3d\.js|scene3d\/.+\.js)$/.test(f) || /^src\/(vista3d\.js|vendor\/.+|scene3d\/.+\.js)$/.test(f) || /^(sito\/assets|src)\/stile\.css$/.test(f);
const obsoleti = trovati.filter((f) => /viste3d\//.test(f));
const fuoriPosto = trovati.filter((f) => !ammessi(f) && !obsoleti.includes(f) && f !== 'sito/index.html');
if (fuoriPosto.length) errori.push('codice 3D in file non previsti: ' + fuoriPosto.join(', '));
if (obsoleti.length) avvisi.push('file della vecchia assonometria SVG, non più usati (da cancellare con il tuo consenso): ' + obsoleti.join(', '));
for (const d of pagine) {
  const html = fs.readFileSync(path.join(SITO, d.slug + '.html'), 'utf8');
  if (!/class="schema-svg"/.test(html)) errori.push(d.slug + ': schema 2D mancante');
  if (!/class="vista-3d"/.test(html) || !/src="assets\/three\.min\.js"/.test(html)) errori.push(d.slug + ': vista 3D mancante');
  if (/<script[^>]+src="(https?:)?\/\//.test(html)) errori.push(d.slug + ': script esterno');
  if (html.indexOf('class="vista-3d"') > html.indexOf('class="schema-svg"')) errori.push(d.slug + ': la vista 3D deve precedere lo schema 2D');
}

// 4. Campi n.d. per pagina
const ndPerPagina = pagine.map((d) => {
  const html = fs.readFileSync(path.join(SITO, d.slug + '.html'), 'utf8');
  return `${d.slug}: ${(html.match(/class="nd">n\.d\./g) || []).length} n.d.`;
});

// ---------- Rapporto ----------
console.log(`Pagine generate: ${pagine.length} di ${catalogo.length} (+ index.html)`);
pagine.forEach((d) => console.log(`  - sito/${d.slug}.html${d.vista3d ? '  [vista spaziale: ' + d.vista3d.tecnica + ']' : ''}`));
console.log(`Link interni controllati: ${nLink}`);
console.log(`File con codice 3D: ${trovati.join(', ')}`);
console.log('Campi n.d.: ' + ndPerPagina.join('; '));
if (avvisi.length) console.log('Avvisi:\n - ' + avvisi.join('\n - '));
if (errori.length) { console.error('ERRORI:\n - ' + errori.join('\n - ')); process.exit(1); }
console.log('Tutti i controlli superati.');
