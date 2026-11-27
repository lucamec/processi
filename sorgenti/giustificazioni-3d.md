# Registro delle viste 3D

**Decisione del 26/11/2026 (revisione Fase 2):** su indicazione esplicita, la vista 3D è estesa a **tutte le pagine**, in stile "teardown", con Three.js (WebGL). Il 3D va in testa alla sezione 2; lo schema 2D in sezione resta completo sotto.
Per questo il controllo automatico non distingue più "pagine 3D / pagine 2D": verifica invece che **ogni** pagina abbia sia lo schema 2D sia la vista 3D, e che Three.js sia caricato solo da file locali.

Le pagine approvate in Fase 1, con la motivazione per cui il 2D da solo non basta, restano documentate qui sotto. Per le altre pagine la vista 3D è un'integrazione richiesta, non una necessità tecnica: la riga indica cosa mostra.

| Pagina | Slug | Cosa mostra la vista 3D | Perché il 2D da solo non basta | Tecnica | Stato |
|---|---|---|---|---|---|
| Stampaggio rotazionale | `stampaggio-rotazionale` | Giostra a tre stazioni; stampo che ruota su due assi; spaccato con la polvere che riveste le pareti | Rotazione biassiale continua (p. 37): la sezione mostra un solo asse | WebGL (Three.js) | Realizzata (pilota) |
| Stampaggio a iniezione | `stampaggio-iniezione` | Pressa con cilindro, vite, stampo in due metà; spaccato del ciclo | Integrazione richiesta (il 2D basterebbe) | WebGL (Three.js) | Realizzata (pilota) |
| Lavorazione CNC | `lavorazione-cnc` | Portale a 3 assi che contorna e scava una seduta; nella fase 5 la testa ruota su due assi per i fori obliqui | Tre traslazioni + due rotazioni (pp. 182–184) | WebGL (Three.js) | Realizzata (gruppo Legno) |
| Avvolgimento di filamenti | `avvolgimento-filamenti` | Elica depositata da mandrino + testa traslante | Traiettoria elicoidale (pp. 222–225) | WebGL (Three.js) | Realizzata (gruppo Compositi) |
| Curvatura di tubi e profilati | `curvatura-tubi` | Tubo piegato due volte su piani diversi, con la matrice rotante che si sposta sulla curva | Curve su piani diversi (p. 98, 101) | WebGL (Three.js) | Realizzata (gruppo Metalli) |
| Tutte le altre pagine (68) | — | Descritta nel testo alternativo `vista3d.alt` di ogni `dati/<slug>.json` | Integrazione richiesta | WebGL (Three.js) | Realizzata (73 pagine su 73, verificate il 27/11/2026) |
