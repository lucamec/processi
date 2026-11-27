# Elenco delle tecnologie – Fase 1 (da approvare)

Fonte: R. Thompson, *Manufacturing Processes for Design Professionals*, Thames & Hudson, London 2007.

## 1. File sorgente

- Il percorso indicato nel brief (`…/R__Thompson__Manufacturing_Processes…pdf`, con underscore) **non esiste**.
- File usato, in sola lettura: `R. Thompson, Manufacturing Processes for Design Professionals, Thames & Hudson Ltd, London, 2007.pdf` (copia personale, non inclusa).
- In `DOWNLOADS/TPXD/` c'è una seconda copia identica (stesso MD5 `d86ef63e…`). Entrambe: 266 pagine PDF, scansione RICOH, pagine doppie da 1602 × 1035 pt.

## 2. Corrispondenza pagine libro ↔ pagine PDF

Ogni pagina PDF contiene una doppia pagina del libro (pari a sinistra, dispari a destra).

**Formula:** `pagina PDF = floor(pagina libro / 2) + 2`. Viceversa, la pagina PDF *n* contiene le pagine del libro `2(n−2)` e `2(n−2)+1`.

Verifica: il titolo di **tutti i 73 capitoli** compare nella pagina PDF calcolata con la formula (73/73 OK). La formula vale per tutto il libro, senza salti.

| Pagina PDF | Contenuto |
|---|---|
| 1–3 | Copertina e frontespizio |
| 4–5 | Indice (Contents) |
| 6–11 | Introduzione (pp. 8–19) |
| 12 | Divisorio Parte 1 (pp. 20–21) |
| 123 | Divisorio Parte 2 (pp. 242–243) |
| 142 | Divisorio Parte 3 (pp. 280–281) |
| 176 | Divisorio Parte 4 (pp. 348–349) |
| 210 | Divisorio Parte 5 (pp. 416–417), esclusa |

Nell'indice l'OCR ha rovinato tre numeri di pagina. Li ho ricostruiti dalla posizione dei titoli: Stampaggio a compressione ("Ul*" → **44**), Forgiatura ("m" → **114**), Fresatura fotochimica ("2UU" → **244**).

## 3. Qualità dell'OCR

Ho misurato, per ogni pagina PDF da 12 a 213, la quota di parole riconosciute in un dizionario inglese: va da 0,91 a 0,99. **Nessun capitolo risulta illeggibile.**

Il testo, però, è impaginato su più colonne: con `-layout` le colonne si alternano riga per riga, quindi ogni capitolo andrà letto con attenzione.

**I numeri sono il punto debole.** Il punteggio misura le parole, non le cifre, e ci sono errori come `go0` (90°), `8oo0C` (800 °C), `U820F` (482 °F), `i m` (1 m). Nella Fase 3 ogni valore numerico va controllato singolarmente (vedi domanda B in fondo).

## 4. Tecnologie: 73 pagine

Le pagine libro vanno dall'inizio del capitolo alla pagina prima del capitolo seguente. Le varianti sono le sotto-voci dell'indice e diventano sezioni della stessa pagina. I nomi italiani sono proposte: correggili pure.

### Parte 1 – Formatura

| # | Nome italiano proposto | Nome originale | Categoria | Pagine libro | Pagine PDF | Slug | Varianti (→ sezioni della stessa pagina) |
|---|---|---|---|---|---|---|---|
| 1 | Soffiaggio | Blow Molding | Plastica e gomma | 22–29 | 13–16 | `soffiaggio` | Estrusione-soffiaggio (EBM); Iniezione-soffiaggio (IBM); Iniezione-stiro-soffiaggio (ISBM) |
| 2 | Termoformatura | Thermoforming | Plastica e gomma | 30–35 | 17–19 | `termoformatura` | Formatura sottovuoto; Formatura a pressione; Formatura con punzone ausiliario (plug-assisted); Termoformatura a doppia lastra (twin sheet) |
| 3 | Stampaggio rotazionale | Rotation Molding | Plastica e gomma | 36–39 | 20–21 | `stampaggio-rotazionale` | — |
| 4 | Colata sottovuoto | Vacuum Casting | Plastica e gomma | 40–43 | 22–23 | `colata-sottovuoto` | — |
| 5 | Stampaggio a compressione | Compression Molding | Plastica e gomma | 44–49 | 24–26 | `stampaggio-compressione` | Compressione della gomma; Compressione della plastica |
| 6 | Stampaggio a iniezione | Injection Molding | Plastica e gomma | 50–63 | 27–33 | `stampaggio-iniezione` | Iniezione assistita da gas; Iniezione multicomponente (multishot); Decorazione in stampo (IMD). *Nota: "Moldflow analysis" è una sotto-voce dell'indice ma è uno strumento di simulazione, non una variante: propongo un riquadro informativo, non una sezione "Varianti".* |
| 7 | Stampaggio a iniezione con reazione (RIM) | Reaction Injection Molding | Plastica e gomma | 64–67 | 34–35 | `rim` | — |
| 8 | Stampaggio per immersione | Dip Molding | Plastica e gomma | 68–71 | 36–37 | `stampaggio-immersione` | — |
| 9 | Battitura della lamiera | Panel Beating | Metalli | 72–77 | 38–40 | `battitura-lamiera` | Imbutitura a mano (dishing); Cesellatura su sagoma (jig chasing); Formatura a rullo inglese (wheel forming); Spianatura (planishing) |
| 10 | Tornitura in lastra | Metal Spinning | Metalli | 78–81 | 41–42 | `tornitura-lastra` | — |
| 11 | Stampaggio della lamiera (tranciatura-piegatura a stampo) | Metal Stamping | Metalli | 82–87 | 43–45 | `stampaggio-lamiera` | Operazioni di ripresa (secondary pressing) |
| 12 | Imbutitura profonda | Deep Drawing | Metalli | 88–91 | 46–47 | `imbutitura-profonda` | — |
| 13 | Formatura superplastica (superforming) | Superforming | Metalli | 92–97 | 48–50 | `superformatura` | Formatura in cavità; Formatura a bolla; Formatura con contropressione; Formatura a diaframma |
| 14 | Curvatura di tubi e profilati | Tube and Section Bending | Metalli | 98–103 | 51–53 | `curvatura-tubi` | Curvatura con mandrino; Curvatura a rulli (ring rolling) |
| 15 | Rastremazione (swaging) | Swaging | Metalli | 104–109 | 54–56 | `rastremazione` | Rastremazione rotativa; Rastremazione idraulica |
| 16 | Profilatura a rulli | Roll Forming | Metalli | 110–113 | 57–58 | `profilatura-rulli` | — |
| 17 | Forgiatura | Forging | Metalli | 114–119 | 59–61 | `forgiatura` | Stampaggio a caldo (drop forging); Laminazione-forgiatura (roll forging) |
| 18 | Fusione in sabbia | Sand Casting | Metalli | 120–123 | 62–63 | `fusione-sabbia` | — |
| 19 | Pressofusione | Die Casting | Metalli | 124–129 | 64–66 | `pressofusione` | Pressofusione ad alta pressione; Pressofusione a bassa pressione |
| 20 | Microfusione a cera persa | Investment Casting | Metalli | 130–135 | 67–69 | `microfusione` | — |
| 21 | Stampaggio a iniezione di polveri metalliche (MIM) | Metal Injection Molding | Metalli | 136–139 | 70–71 | `mim` | — |
| 22 | Elettroformatura | Electroforming | Metalli | 140–143 | 72–73 | `elettroformatura` | — |
| 23 | Fusione centrifuga | Centrifugal Casting | Metalli | 144–147 | 74–75 | `fusione-centrifuga` | — |
| 24 | Piegatura alla pressa piegatrice | Press Braking | Metalli | 148–151 | 76–77 | `piegatura-pressa` | — |
| 25 | Soffiatura del vetro | Glassblowing | Vetro e ceramica | 152–159 | 78–81 | `soffiatura-vetro` | Soffiatura artigianale (studio); Soffio-soffio meccanico; Pressa-soffio meccanico |
| 26 | Lavorazione del vetro alla fiamma (lume) | Lampworking | Vetro e ceramica | 160–167 | 82–85 | `lavorazione-lume` | Soffiatura; Foratura; Curvatura; Formatura su mandrino |
| 27 | Tornitura dell'argilla | Clay Throwing | Vetro e ceramica | 168–171 | 86–87 | `tornitura-argilla` | — |
| 28 | Colaggio ceramico | Ceramic Slip Casting | Vetro e ceramica | 172–175 | 88–89 | `colaggio-ceramico` | — |
| 29 | Formatura a pressione della ceramica | Press Molding Ceramics | Vetro e ceramica | 176–181 | 90–92 | `pressatura-ceramica` | Calibratura (jiggering); Pressatura a stampo (ram pressing) |
| 30 | Lavorazione CNC (fresatura, tornitura, foratura) | CNC Machining | Legno | 182–189 | 93–96 | `lavorazione-cnc` | — (il capitolo distingue macchine a 3 e a 5 assi e il tornio; vale anche per metalli e plastiche) |
| 31 | Laminazione del legno | Wood Laminating | Legno | 190–197 | 97–100 | `laminazione-legno` | Taglio a kerf (kerfing); Laminazione di massello; Laminazione di impiallacciature |
| 32 | Curvatura a vapore | Steam Bending | Legno | 198–201 | 101–102 | `curvatura-vapore` | Curvatura circolare; Curvatura aperta |
| 33 | Stampaggio della polpa di carta | Paper Pulp Molding | Legno | 202–205 | 103–104 | `polpa-carta` | — |
| 34 | Laminazione dei compositi | Composite Laminating | Compositi | 206–217 | 105–110 | `laminazione-compositi` | Laminazione a umido (wet lay-up); Laminazione di pre-impregnati (pre-preg); Stampaggio per trasferimento di resina (RTM) |
| 35 | Stampaggio di DMC e SMC | DMC and SMC Molding | Compositi | 218–221 | 111–112 | `dmc-smc` | — |
| 36 | Avvolgimento di filamenti | Filament Winding | Compositi | 222–227 | 113–115 | `avvolgimento-filamenti` | — |
| 37 | Laminazione termica 3D | 3D Thermal Laminating | Compositi | 228–231 | 116–117 | `laminazione-termica-3d` | 3D Laminating (3DL); 3D Rotary Laminating (3Dr) |
| 38 | Prototipazione rapida | Rapid Prototyping | Prototipazione rapida (manifattura a strati) | 232–241 | 118–122 | `prototipazione-rapida` | Stereolitografia (SLA); Sinterizzazione laser selettiva (SLS); Sinterizzazione laser diretta di metalli (DMLS) |

### Parte 2 – Taglio

| # | Nome italiano proposto | Nome originale | Categoria | Pagine libro | Pagine PDF | Slug | Varianti (→ sezioni della stessa pagina) |
|---|---|---|---|---|---|---|---|
| 39 | Fresatura fotochimica | Photochemical Machining | Chimico | 244–247 | 124–125 | `fresatura-fotochimica` | — (lo schema del libro a p. 244 si intitola "Photo Etching Process": è lo stesso principio del capitolo Incisione fotochimica, p. 392, che è un capitolo distinto di Finitura) |
| 40 | Taglio laser | Laser Cutting | Termico | 248–253 | 126–128 | `taglio-laser` | — |
| 41 | Elettroerosione (EDM) | Electrical Discharge Machining | Termico | 254–259 | 129–131 | `elettroerosione` | Elettroerosione a tuffo; Elettroerosione a filo |
| 42 | Punzonatura e tranciatura | Punching and Blanking | Meccanico | 260–265 | 132–134 | `punzonatura-tranciatura` | — |
| 43 | Fustellatura | Die Cutting | Meccanico | 266–271 | 135–137 | `fustellatura` | — |
| 44 | Taglio a getto d'acqua | Water Jet Cutting | Meccanico | 272–275 | 138–139 | `taglio-getto-acqua` | — |
| 45 | Taglio del vetro per incisione (scoring) | Glass Scoring | Meccanico | 276–279 | 140–141 | `taglio-vetro` | — |

### Parte 3 – Giunzione

| # | Nome italiano proposto | Nome originale | Categoria | Pagine libro | Pagine PDF | Slug | Varianti (→ sezioni della stessa pagina) |
|---|---|---|---|---|---|---|---|
| 46 | Saldatura ad arco | Arc Welding | Termico | 282–287 | 143–145 | `saldatura-arco` | Elettrodo rivestito (MMA); MIG; TIG; Plasma; Arco sommerso (SAW) |
| 47 | Saldatura a fascio (laser ed elettronico) | Power Beam Welding | Termico | 288–293 | 146–148 | `saldatura-fascio` | Saldatura laser (LBW); Saldatura a fascio elettronico (EBW) |
| 48 | Saldatura per attrito | Friction Welding | Termico | 294–297 | 149–150 | `saldatura-attrito` | Rotativa (RFW); Lineare (LFW); Orbitale (OFW); Friction stir (FSW) |
| 49 | Saldatura a vibrazione | Vibration Welding | Termico | 298–301 | 151–152 | `saldatura-vibrazione` | — |
| 50 | Saldatura a ultrasuoni | Ultrasonic Welding | Termico | 302–307 | 153–155 | `saldatura-ultrasuoni` | — |
| 51 | Saldatura a resistenza | Resistance Welding | Termico | 308–311 | 156–157 | `saldatura-resistenza` | A rilievi (projection); A punti (spot); A rulli (seam) |
| 52 | Brasatura dolce e forte | Soldering and Brazing | Termico | 312–315 | 158–159 | `brasatura` | Metodo a conduzione; A cannello; In forno |
| 53 | Ribaditura a caldo (staking) | Staking | Termico | 316–319 | 160–161 | `ribaditura` | Ad aria calda; A ultrasuoni |
| 54 | Saldatura a piastra calda | Hot Plate Welding | Termico | 320–323 | 162–163 | `saldatura-piastra-calda` | — |
| 55 | Giunzioni del legno (falegnameria) | Joinery | Meccanico | 324–331 | 164–167 | `giunzioni-legno` | — |
| 56 | Tessitura e intreccio | Weaving | Meccanico | 332–337 | 168–170 | `tessitura` | — |
| 57 | Imbottitura e tappezzeria | Upholstery | Meccanico | 338–343 | 171–173 | `imbottitura` | — |
| 58 | Strutture a telaio in legno | Timber Frame Structures | Meccanico | 344–347 | 174–175 | `strutture-telaio-legno` | — |

### Parte 4 – Finitura

| # | Nome italiano proposto | Nome originale | Categoria | Pagine libro | Pagine PDF | Slug | Varianti (→ sezioni della stessa pagina) |
|---|---|---|---|---|---|---|---|
| 59 | Verniciatura a spruzzo | Spray Painting | Processi additivi (rivestimenti) | 350–355 | 177–179 | `verniciatura-spruzzo` | — |
| 60 | Verniciatura a polvere | Powder Coating | Processi additivi (rivestimenti) | 356–359 | 180–181 | `verniciatura-polvere` | Spruzzatura elettrostatica; Letto fluido |
| 61 | Anodizzazione | Anodizing | Processi additivi (rivestimenti) | 360–363 | 182–183 | `anodizzazione` | — |
| 62 | Galvanostegia (elettrodeposizione) | Electroplating | Processi additivi (rivestimenti) | 364–367 | 184–185 | `galvanostegia` | — |
| 63 | Zincatura a caldo | Galvanizing | Processi additivi (rivestimenti) | 368–371 | 186–187 | `zincatura` | — |
| 64 | Metallizzazione sottovuoto | Vacuum Metalizing | Processi additivi (rivestimenti) | 372–375 | 188–189 | `metallizzazione-sottovuoto` | — |
| 65 | Rettifica, levigatura e lucidatura | Grinding, Sanding and Polishing | Processi sottrattivi | 376–383 | 190–193 | `rettifica-levigatura` | A mola; A nastro; Levigatura di precisione (honing); Lappatura |
| 66 | Elettrolucidatura | Electropolishing | Processi sottrattivi | 384–387 | 194–195 | `elettrolucidatura` | — |
| 67 | Sabbiatura (granigliatura) | Abrasive Blasting | Processi sottrattivi | 388–391 | 196–197 | `sabbiatura` | — |
| 68 | Incisione fotochimica | Photo Etching | Processi sottrattivi | 392–395 | 198–199 | `incisione-fotochimica` | — |
| 69 | Incisione CNC | CNC Engraving | Processi sottrattivi | 396–399 | 200–201 | `incisione-cnc` | — |
| 70 | Serigrafia | Screen Printing | Stampa | 400–403 | 202–203 | `serigrafia` | — |
| 71 | Tampografia | Pad Printing | Stampa | 404–407 | 204–205 | `tampografia` | — |
| 72 | Stampa a trasferimento ad acqua (hydrografica) | Hydro Transfer Printing | Stampa | 408–411 | 206–207 | `stampa-idrografica` | — |
| 73 | Stampa a caldo e goffratura | Foil Blocking and Embossing | Stampa | 412–415 | 208–209 | `stampa-caldo-goffratura` | — |


### Riepilogo

| Parte | Sottocategorie | Pagine |
|---|---|---|
| 1 – Formatura | Plastica e gomma (8), Metalli (16), Vetro e ceramica (5), Legno (4), Compositi (4), Prototipazione rapida (1) | 38 |
| 2 – Taglio | Chimico (1), Termico (2), Meccanico (4) | 7 |
| 3 – Giunzione | Termico (9), Meccanico (4) | 13 |
| 4 – Finitura | Additivi (6), Sottrattivi (5), Stampa (4) | 15 |
| **Totale** | | **73** |

Note di classificazione:
- **Lavorazione CNC** è nel libro sotto "Legno", ma il capitolo tratta anche metalli e plastiche. Propongo di lasciarla in Legno, come nel libro, con un rimando da Taglio.
- **Fresatura fotochimica** (p. 244, Taglio) e **Incisione fotochimica** (p. 392, Finitura) sono due capitoli distinti con lo stesso principio. Restano due pagine con link reciproco.

## 5. Candidati al 3D

Il criterio è quello del brief: il 3D è ammesso solo dove neppure un 2D animato o più viste ortogonali spiegano il processo, e la ragione deve trovarsi nel testo del libro. **Tecnica proposta per tutti: assonometria/isometria SVG a tratto piatto, animata in CSS/JS.** Non propongo WebGL/Three.js per nessuna pagina in questa fase.

### 5.1 Candidati consigliati

| Pagina | Cosa mostrerebbe la vista spaziale | Perché il 2D non basta | Riferimento nel libro | Tecnica |
|---|---|---|---|---|
| **Stampaggio rotazionale** | Lo stampo che ruota contemporaneamente attorno a due assi perpendicolari mentre la polvere riveste le pareti | Il libro descrive una rotazione continua attorno all'asse orizzontale e a quello verticale insieme. In una sezione 2D si vede un solo asse: la seconda rotazione esce dal piano | pp. 36–37 | Assonometria SVG |
| **Lavorazione CNC** | Confronto fra macchina a 3 assi (X, Y, Z) e a 5 assi (testa che si inclina e ruota) su un pezzo curvo | Il libro contrappone 3 e 5 assi. Due assi di rotazione sommati a tre traslazioni non sono leggibili in una vista ortogonale, che mostra al massimo due movimenti | pp. 182–185 | Assonometria SVG |
| **Avvolgimento di filamenti** | Mandrino che ruota e testa guidafilo che trasla; il filo deposita un'elica il cui angolo cambia con il rapporto fra le due velocità | La traiettoria è elicoidale. Il libro lega l'angolo della fibra alla velocità di rotazione del mandrino e indica angoli da ~90° (circonferenziale) a quasi 0°. In 2D l'elica si appiattisce in una linea a zig-zag ambigua | pp. 222–225 | Assonometria SVG |
| **Curvatura di tubi e profilati** | Un tubo con più curve su piani diversi (curvatura spaziale) | Il libro dice che si possono ottenere forme 3D con curve multiple. Una singola curva si spiega in pianta, ma curve su piani diversi richiedono lo spazio | pp. 98–99 | Assonometria SVG |

### 5.2 Candidati possibili (decidi tu)

| Pagina | Cosa mostrerebbe | Argomento a favore | Argomento contro | Rif. | Tecnica |
|---|---|---|---|---|---|
| **Giunzioni del legno** | Spaccato esploso di alcuni incastri (tenone e mortasa, coda di rondine) | L'incastro è una geometria che si capisce nello spazio: da quale lato entra il tenone, in quale direzione la coda di rondine blocca lo sfilamento | Le tre viste ortogonali classiche, magari animate in "montaggio", sono già lo standard del disegno tecnico per gli incastri | pp. 324–325 | Assonometria SVG esplosa |
| **Laminazione termica 3D** | Stampo a doppia curvatura (superficie della vela) e gantry a 6 assi che deposita le fibre | Il libro descrive uno stampo con curvatura in due direzioni (curvatura gaussiana), circa 2000 attuatori e un gantry a 6 assi | Processo di nicchia (solo vele): una sezione con frecce può bastare per lo scopo didattico | pp. 228–231 | Assonometria SVG |

### 5.3 Casi tipici del brief valutati e **sconsigliati**

| Caso | Pagina | Perché il 2D basta |
|---|---|---|
| Piegature successive della lamiera | Piegatura alla pressa piegatrice (pp. 148–151) | Il libro tratta piegatura in aria, a fondo e a collo d'oca: piegature singole, perfettamente leggibili in sezione. Non descrive sequenze di piega di scatole. Se vuoi le sequenze, si fanno in 2D con una serie di sezioni |
| Stampi con carrelli e sottosquadri | Stampaggio a compressione (p. 48: utensile a tre parti, due laterali); Pressofusione (p. 126) | Il carrello si muove perpendicolarmente all'apertura dello stampo, quindi nel piano di una sezione: in 2D animato si legge bene. Lo stampaggio a iniezione resta solo 2D, come da brief |
| Altri moti rotatori | Tornitura in lastra, Fusione centrifuga, Tornitura dell'argilla, Saldatura per attrito | Una sola rotazione attorno a un asse: basta una sezione assiale con il simbolo di rotazione |

## 6. Domande per il checkpoint

**A. Candidati 3D.** Quali approvi tra 5.1 e 5.2?

**B. Numeri con OCR dubbio.** Propongo questa regola:
- correggo un valore solo se la stessa riga lo conferma con l'unità imperiale tra parentesi (es. `250oC U820F)` → 250 °C, confermato da 482 °F) e annoto la correzione nel JSON;
- altrimenti scrivo "n.d." e segnalo la pagina nel report del gruppo.

**C. Seconda pagina pilota.** Consiglio **Stampaggio rotazionale**: la giustificazione è la più netta, è nella stessa sottocategoria dell'iniezione, quindi confrontare le due pagine dice molto sul template, e l'assonometria è semplice.

**D. Verifica automatica del 3D.** Un'assonometria SVG usa solo trasformazioni 2D, quindi il `grep` del brief (`perspective|rotate[XY]|translateZ|preserve-3d|three|webgl`) non la troverebbe. Inoltre `three` può comparire nel testo italiano o inglese ("three-dimensional"). Proposta:
- ogni vista spaziale ha la classe `vista-3d`;
- aggiungo `vista-3d` al pattern del grep;
- limito la ricerca ai file `.html`, `.css` e `.js`.

**E. Cartella del progetto.** Al momento lavoro in una cartella temporanea legata a questa sessione. Prima della Fase 2 conviene spostare il progetto in una cartella stabile.

---

## 7. Decisioni (checkpoint Fase 1, 26/11/2026)

- **Approvati per la vista spaziale (assonometria SVG):** Stampaggio rotazionale, Lavorazione CNC, Avvolgimento di filamenti, Curvatura di tubi e profilati.
- **Non approvati:** Giunzioni del legno, Laminazione termica 3D (restano solo 2D).
- **Domande B–E senza risposta esplicita:** si applicano le proposte di default (regola sui numeri OCR; pilota 3D = Stampaggio rotazionale; marcatore `vista-3d` nel grep; il lavoro resta nella cartella attuale finché non viene indicata un'altra cartella).

## 8. Decisioni (revisione Fase 2, 26/11/2026)

- **Stile grafico:** linguaggio "teardown" (sfondo chiaro da studio, toni morbidi, un colore d'accento per la parte che lavora) sia per il 3D sia per gli schemi 2D.
- **3D su tutte le pagine:** ogni tecnologia ha una vista 3D interattiva (Three.js/WebGL) **in testa** alla sezione 2, sincronizzata con le fasi; lo schema 2D in sezione resta completo **sotto**.
- **Three.js approvato** come unica dipendenza: un file offline preimpacchettato in `src/vendor/`, copiato in `sito/assets/` e caricato con `<script>` classico (funziona da disco). Nessun `npm install` nel progetto.
- Le assonometrie SVG restano possibili come complemento dove aiutano.
