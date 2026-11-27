/* Runtime delle viste 3D (stile "teardown": studio chiaro, ombre morbide, un accento).
 * Richiede THREE globale (assets/three.min.js). Ogni scena si registra con
 *   Vista3D.registra('slug', function (T, k) { ...; return { camera, aggiorna(fase, t), etichette } });
 * La scena è guidata dalle stesse fasi dello schema 2D (app.js): un solo input, nessuna deriva.
 */
(function () {
  'use strict';
  var T = window.THREE;
  var scene = {};
  window.Vista3D = { registra: function (slug, f) { scene[slug] = f; } };
  var riduci = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Palette condivisa con stile.css: toni neutri da studio + un accento (materiale in lavorazione).
  var COL = {
    stampo: 0x8d99a6, taglio: 0xe3e7ec, grezzo: 0xcfb37a, fuso: 0xf06a1d, finito: 0x3f8f8a,
    macchina: 0xc9d0d8, scuro: 0x47515c, flusso: 0x4c62d9, vetro: 0xb8c4d0
  };

  function morbido(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  // Kit passato alle scene ---------------------------------------------------
  function kit(taglio) {
    var k = { T: T, COL: COL, taglio: taglio };
    function std(c, o) {
      var m = new T.MeshStandardMaterial({ color: c, roughness: 0.55, metalness: 0.15 });
      for (var p in o || {}) { if (m[p] && m[p].isColor) m[p].set(o[p]); else m[p] = o[p]; }
      return m;
    }
    k.mat = {
      stampo: std(COL.stampo, { metalness: 0.35, roughness: 0.5 }),
      taglio: std(COL.taglio, { roughness: 0.85, metalness: 0 }),
      grezzo: std(COL.grezzo, { roughness: 0.8, metalness: 0 }),
      macchina: std(COL.macchina, { roughness: 0.6 }),
      scuro: std(COL.scuro, { roughness: 0.6 }),
      flusso: std(COL.flusso, { emissive: COL.flusso, emissiveIntensity: 0.0 }),
      vetro: std(COL.vetro, { transparent: true, opacity: 0.1, depthWrite: false, side: T.DoubleSide, roughness: 0.2 })
    };
    k.nuovo = std;
    // Traccia per fasi: valori alla FINE di ogni fase, come data-k nello schema 2D.
    k.traccia = function (valori, iniziale) {
      return function (fase, t) {
        var fine = valori[fase - 1];
        var inizio = fase === 1 ? (iniziale !== undefined ? iniziale : valori[valori.length - 1]) : valori[fase - 2];
        return inizio + (fine - inizio) * morbido(t);
      };
    };
    // Blocco a parallelepipedo. In modalità spaccato la parte con z > 0 è tolta e la faccia z = 0 prende il colore di taglio.
    k.blocco = function (x0, x1, y0, y1, z0, z1, mat, nonTagliare, matTaglio) {
      var cut = taglio && !nonTagliare && z1 > 0;
      if (cut) { if (z0 >= 0) return null; z1 = 0; }
      var g = new T.BoxGeometry(x1 - x0, y1 - y0, z1 - z0);
      var mats = cut ? [mat, mat, mat, mat, matTaglio || k.mat.taglio, mat] : mat;
      var m = new T.Mesh(g, mats);
      m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
      m.castShadow = m.receiveShadow = true;
      return m;
    };
    // Solido di rivoluzione attorno all'asse X. profilo: [[r, x], ...] chiuso. In spaccato: metà posteriore + facce di taglio.
    k.tornito = function (profilo, mat, segmenti, nonTagliare) {
      var gr = new T.Group();
      var cut = taglio && !nonTagliare;
      var pts = profilo.map(function (p) { return new T.Vector2(p[0], p[1]); });
      var g = new T.LatheGeometry(pts, segmenti || 48, cut ? Math.PI / 2 : 0, cut ? Math.PI : Math.PI * 2);
      g.rotateZ(-Math.PI / 2);
      var m = new T.Mesh(g, mat);
      m.material = mat.clone(); m.material.side = T.DoubleSide;
      m.castShadow = m.receiveShadow = true;
      gr.add(m);
      if (cut) {
        [1, -1].forEach(function (s) {
          var sh = new T.Shape();
          profilo.forEach(function (p, i) { var y = s * p[0], x = p[1]; if (i) sh.lineTo(x, y); else sh.moveTo(x, y); });
          var cap = new T.Mesh(new T.ShapeGeometry(sh), k.mat.taglio);
          cap.material = k.mat.taglio.clone(); cap.material.side = T.DoubleSide;
          cap.position.z = 0.002;
          gr.add(cap);
        });
      }
      return gr;
    };
    // Solido di rivoluzione attorno all'asse Y. profilo: [[r, y], ...] chiuso.
    k.torneroY = function (profilo, mat, segmenti, nonTagliare) {
      var gr = new T.Group();
      var cut = taglio && !nonTagliare;
      var pts = profilo.map(function (p) { return new T.Vector2(p[0], p[1]); });
      var g = new T.LatheGeometry(pts, segmenti || 48, cut ? Math.PI / 2 : 0, cut ? Math.PI : Math.PI * 2);
      var m = new T.Mesh(g, mat.clone()); m.material.side = T.DoubleSide;
      m.castShadow = m.receiveShadow = true; gr.add(m);
      if (cut) {
        [1, -1].forEach(function (sg) {
          var sh = new T.Shape();
          profilo.forEach(function (p, i) { if (i) sh.lineTo(sg * p[0], p[1]); else sh.moveTo(sg * p[0], p[1]); });
          var cap = new T.Mesh(new T.ShapeGeometry(sh), mat.clone()); cap.material.side = T.DoubleSide; cap.position.z = 0.002; gr.add(cap);
        });
      }
      gr.userData.materiali = gr.children.map(function (c) { return c.material; });
      return gr;
    };
    // Prisma estruso lungo Z da un profilo nel piano XY (punti [[x, y], ...], fori opzionali).
    // In spaccato va da z0 a 0 e la faccia z = 0 prende il colore di taglio.
    k.estruso = function (punti, fori, z0, z1, mat, nonTagliare) {
      var cut = taglio && !nonTagliare && z1 > 0;
      if (cut) z1 = 0;
      var sh = new T.Shape(punti.map(function (p) { return new T.Vector2(p[0], p[1]); }));
      (fori || []).forEach(function (h) { sh.holes.push(new T.Path(h.map(function (p) { return new T.Vector2(p[0], p[1]); }))); });
      var g = new T.ExtrudeGeometry(sh, { depth: z1 - z0, bevelEnabled: false, curveSegments: 24 });
      g.translate(0, 0, z0);
      var m = new T.Mesh(g, cut ? [k.mat.taglio, mat] : mat);
      m.castShadow = m.receiveShadow = true;
      return m;
    };
    // Lamiera deformabile: piano XZ (in spaccato solo z <= 0). forma(x, z) restituisce la quota Y.
    k.lastra = function (lx, lz, nx, nz, mat) {
      var zMax = taglio ? 0 : lz;
      var g = new T.PlaneGeometry(2 * lx, zMax + lz, nx, taglio ? Math.ceil(nz / 2) : nz);
      g.rotateX(-Math.PI / 2); g.translate(0, 0, (zMax - lz) / 2);
      var m = new T.Mesh(g, mat); m.castShadow = m.receiveShadow = true;
      var pos = g.attributes.position, base = new Float32Array(pos.count * 2);
      for (var i = 0; i < pos.count; i++) { base[2 * i] = pos.getX(i); base[2 * i + 1] = pos.getZ(i); }
      return {
        mesh: m,
        // forma(x, z) -> y; facoltativo: spostamento (x, z) -> [dx, dz]
        imposta: function (forma, sposta) {
          for (var i = 0; i < pos.count; i++) {
            var x = base[2 * i], z = base[2 * i + 1], d = sposta ? sposta(x, z) : null;
            pos.setXYZ(i, x + (d ? d[0] : 0), forma(x, z), z + (d ? d[1] : 0));
          }
          pos.needsUpdate = true; g.computeVertexNormals();
        }
      };
    };
    k.morbido = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
    k.cilindroX = function (x0, x1, r, mat) {
      var g = new T.CylinderGeometry(r, r, x1 - x0, 32);
      g.rotateZ(Math.PI / 2);
      var m = new T.Mesh(g, mat);
      m.position.x = (x0 + x1) / 2;
      m.castShadow = m.receiveShadow = true;
      return m;
    };
    // Generatore pseudo-casuale deterministico (niente Math.random).
    k.rng = function (seme) { var s = seme >>> 0; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
    return k;
  }

  // Costruzione della vista --------------------------------------------------
  function avvia(box) {
    var slug = box.getAttribute('data-scena');
    var costruisci = scene[slug];
    var contenitore = box.querySelector('.tela-3d');
    var schema = box.closest('.schema');
    if (!costruisci || !contenitore) return;

    var renderer;
    try {
      renderer = new T.WebGLRenderer({ antialias: true });
    } catch (e) {
      contenitore.innerHTML = '<p class="avviso-3d">Il browser non supporta WebGL: la vista 3D non è disponibile. Lo schema in sezione qui sotto mostra lo stesso ciclo.</p>';
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.NeutralToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFShadowMap;
    renderer.localClippingEnabled = true;
    var canvas = renderer.domElement;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', box.getAttribute('data-alt') || 'Vista 3D del processo');
    contenitore.appendChild(canvas);

    var sc = new T.Scene();
    sc.background = new T.Color(0xeef1f4);
    var cam = new T.PerspectiveCamera(28, 16 / 9, 0.1, 200);
    sc.add(new T.HemisphereLight(0xffffff, 0xd5dbe2, 1.15));
    var key = new T.DirectionalLight(0xffffff, 2.0);
    key.position.set(-8, 18, 14);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.radius = 4;
    key.shadow.bias = -0.0005;
    var sCam = key.shadow.camera; sCam.left = -16; sCam.right = 16; sCam.top = 16; sCam.bottom = -16; sCam.near = 1; sCam.far = 60;
    sc.add(key);
    var fill = new T.DirectionalLight(0xffffff, 0.55);
    fill.position.set(12, 6, -8);
    sc.add(fill);

    var controlli = new T.OrbitControls(cam, canvas);
    controlli.enableDamping = !riduci;
    controlli.dampingFactor = 0.08;
    controlli.minDistance = 6;
    controlli.maxDistance = 60;
    controlli.maxPolarAngle = Math.PI * 0.49;

    var taglio = true, modello = null, def = null, inSegui = false, pSegui = new T.Vector3(), pNuovo = new T.Vector3();
    // modalità "segui": la camera accompagna la parte che lavora mantenendo l'inquadratura scelta
    function segui() {
      if (!inSegui || !def.dettaglio) return;
      def.radice.updateWorldMatrix(true, true);
      def.dettaglio.punto(pNuovo);
      var d = pNuovo.clone().sub(pSegui);
      cam.position.add(d); controlli.target.add(d); pSegui.copy(pNuovo);
    }
    var etichetteBox = box.querySelector('.etichette-3d');

    function costruisciModello() {
      if (modello) { sc.remove(modello.radice); }
      var k = kit(taglio);
      def = costruisci(T, k);
      modello = def;
      sc.add(def.radice);
      // pavimento che riceve solo l'ombra
      if (!sc.userData.pavimento) {
        var p = new T.Mesh(new T.PlaneGeometry(200, 200), new T.ShadowMaterial({ opacity: 0.14 }));
        p.rotation.x = -Math.PI / 2; p.position.y = def.pavimento || -3; p.receiveShadow = true;
        p.material.polygonOffset = true; p.material.polygonOffsetFactor = -1;
        sc.add(p); sc.userData.pavimento = p;
      }
      etichetteBox.innerHTML = '';
      (def.etichette || []).forEach(function (e) {
        var d = document.createElement('div');
        d.className = 'etichetta-3d';
        d.textContent = e.testo;
        etichetteBox.appendChild(d);
        e.el = d;
      });
      var st = (schema && schema._stato) || { fase: 1, t: 1 };
      def.aggiorna(st.fase, st.t);
      sporco = true;
    }

    function vistaIniziale() {
      cam.position.fromArray(def.camera.posizione);
      controlli.target.fromArray(def.camera.bersaglio);
      controlli.update();
      sporco = true;
    }

    var w = 0, h = 0, sporco = true, visibile = true, v = new T.Vector3();
    function dimensiona() {
      var r = contenitore.getBoundingClientRect();
      if (r.width === w && r.height === h) return;
      w = r.width; h = r.height;
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      sporco = true;
    }
    function posizionaEtichette() {
      (def.etichette || []).forEach(function (e) {
        e.ancora(v);
        v.project(cam);
        var x = (v.x * 0.5 + 0.5) * w, y = (-v.y * 0.5 + 0.5) * h;
        var dentro = v.z < 1 && x > 8 && x < w - 8 && y > 8 && y < h - 8;
        var sx = x > w * 0.7;
        e.el.classList.toggle('a-sinistra', sx);
        e.el.style.transform = 'translate(' + Math.round(sx ? x - e.el.offsetWidth : x) + 'px,' + Math.round(y) + 'px)';
        e.el.style.opacity = dentro && (!e.visibile || e.visibile()) ? 1 : 0;
      });
    }
    function ciclo() {
      requestAnimationFrame(ciclo);
      if (!visibile) return;
      dimensiona();
      if (controlli.enableDamping && controlli.update()) sporco = true;
      if (!sporco) return;
      sporco = false;
      renderer.render(sc, cam);
      posizionaEtichette();
    }
    controlli.addEventListener('change', function () { sporco = true; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visibile = es[0].isIntersecting; sporco = true; }).observe(contenitore);
    }
    window.addEventListener('resize', function () { sporco = true; });

    // sincronizzazione con le fasi dello schema 2D
    if (schema) {
      schema._ascoltatori = schema._ascoltatori || [];
      schema._ascoltatori.push(function (fase, t) { if (def) { def.aggiorna(fase, t); segui(); sporco = true; } });
    }

    var btnTaglio = box.querySelector('[data-azione="taglio"]');
    btnTaglio.addEventListener('click', function () {
      taglio = !taglio;
      btnTaglio.setAttribute('aria-pressed', taglio ? 'true' : 'false');
      costruisciModello();
    });
    box.querySelector('[data-azione="camera"]').addEventListener('click', function () { inSegui = false; aggiornaSegui(); vistaIniziale(); });
    var btnSegui = box.querySelector('[data-azione="segui"]');
    function aggiornaSegui() { if (btnSegui) btnSegui.setAttribute('aria-pressed', inSegui ? 'true' : 'false'); }
    if (btnSegui) btnSegui.addEventListener('click', function () {
      if (!def.dettaglio) return;
      inSegui = !inSegui; aggiornaSegui();
      if (inSegui) { def.radice.updateWorldMatrix(true, true); def.dettaglio.punto(pSegui); controlli.target.copy(pSegui); cam.position.copy(pSegui).add(new T.Vector3().fromArray(def.dettaglio.distanza)); controlli.update(); sporco = true; }
    });

    costruisciModello();
    vistaIniziale();
    ciclo();
  }

  function init() { document.querySelectorAll('.vista-3d[data-scena]').forEach(avvia); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
