# processi
Processi produttivi per il design

**Sito:** https://lucamec.github.io/processi/

Sito statico in italiano con una scheda per ciascuna delle 73 tecnologie di produzione descritte in R. Thompson, *Manufacturing Processes for Design Professionals* (Thames & Hudson, London 2007), parti 1–4. È pensato per gli studenti del corso di laurea triennale in Design (L-4).

Ogni scheda contiene: titolo e sintesi; una vista 3D interattiva e uno schema 2D animato del ciclo; «Come funziona»; 8 caratteristiche; vincoli di progetto con mini-diagrammi «corretto / da evitare»; varianti; processi correlati; fonte e pagine del libro.

## Com'è organizzato il repository

| Dove | Cosa |
|---|---|
| radice (`index.html`, `*.html`, `assets/`) | il sito pubblicato da GitHub Pages |
| `sorgenti/dati/<slug>.json` | testi e dati di ciascuna tecnologia |
| `sorgenti/src/schemi/<slug>.js` | schema 2D animato e mini-diagrammi |
| `sorgenti/src/scene3d/<slug>.js` | scena della vista 3D |
| `sorgenti/src/` | template, stile, componenti condivisi, runtime 3D, Three.js (`vendor/`, licenza MIT) |
| `sorgenti/build.js` | genera il sito e ne controlla link, SVG, sezioni e campi |
| `sorgenti/catalogo.json` | elenco delle tecnologie e loro pagine nel libro |

Il sito funziona anche aprendo `index.html` direttamente dal disco, senza server.

## Modificare e ripubblicare

Serve solo Node.js: lo script usa soltanto i moduli `fs` e `path`.

```bash
cd sorgenti
node build.js
```

Il comando crea `sorgenti/sito/`, che git ignora. Per pubblicare, copia il contenuto di `sorgenti/sito/` nella radice del repository, sostituendo i file esistenti:

```bash
cp -R sito/. ..
```

## Note sui contenuti

- I testi sono una rielaborazione in italiano del libro, non una traduzione letterale. Ogni dato riporta la pagina di origine.
- Quando un valore manca, o l'OCR del libro è illeggibile e la conversione delle unità non lo conferma, la scheda scrive «n.d.».
- Nessuna immagine è tratta dal libro: tutte le illustrazioni sono SVG e scene 3D disegnati da zero.
- Il sito rispetta WCAG AA, funziona da 375 a 1440 px di larghezza e rispetta `prefers-reduced-motion`.
