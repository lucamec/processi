# src/vendor

`three.min.js` — Three.js r0.186.1 (licenza MIT, testo della licenza in fondo al file), con `OrbitControls` e `RoundedBoxGeometry`.
Impacchettato una volta sola come script classico (IIFE, variabile globale `THREE`) per funzionare aprendo il sito dal disco (`file://`), dove i moduli ES non si caricano.

Generato il 26/11/2026 con l'esbuild già presente nella skill teardown (nessuna installazione nel progetto):

    esbuild entry.js --bundle --format=iife --global-name=THREE --minify --legal-comments=eof --outfile=src/vendor/three.min.js

dove `entry.js` riesporta `three/build/three.module.js`, `OrbitControls.js` e `RoundedBoxGeometry.js` da `~/.claude/skills/teardown/node_modules/three`.
