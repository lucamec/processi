/* Vista 3D – Curvatura a vapore, curvatura manuale su sagoma (Thompson 2007, pp. 198–201).
 * Il listello è un parallelepipedo a molti segmenti; ogni vertice è rimappato: la parte centrale si avvolge
 * sulla sagoma (cerchio di raggio R), il resto prosegue diritto lungo la tangente.
 * Fasi: 1 ammollo e vapore, 2 carico sulla sagoma, 3 curvatura, 4 essiccazione, 5 sformatura.
 */
Vista3D.registra('curvatura-vapore', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var R = 2, S = 0.4, W = 0.5, HL = Math.PI * R / 2 + 1.2, ZW = 0.9;

  add(radice, k.blocco(-4, 4, -3.4, -3.0, -2.2, 2.2, M.macchina, true));
  // sagoma: semicerchio sopra, rettangolo sotto
  var prof = [];
  for (var i = 0; i <= 32; i++) { var a = -Math.PI / 2 + Math.PI * i / 32; prof.push([R * Math.sin(a), R * Math.cos(a)]); }
  prof.push([R, -3.0], [-R, -3.0]);
  add(radice, k.estruso(prof.reverse(), null, -ZW, ZW, M.stampo));

  // mappa (s lungo il pezzo, h distanza dalla sagoma) -> posizione, con avvolgimento p (0..1)
  function mappa(s, h, p, out) {
    var r = R + h, sc = p * Math.PI * R / 2, as = Math.abs(s), sg = s < 0 ? -1 : 1;
    if (as <= sc || sc === 0 && as === 0) { var a = s / R; out[0] = r * Math.sin(a); out[1] = r * Math.cos(a); return out; }
    var ac = sg * sc / R, d = as - sc;
    out[0] = r * Math.sin(ac) + sg * Math.cos(ac) * d; out[1] = r * Math.cos(ac) - Math.sin(ac) * d; return out;
  }
  function barra(spessore, h0, larg, mat) {
    var g = new T.BoxGeometry(2 * HL, spessore, larg, 160, 1, 1), pos = g.attributes.position, base = new Float32Array(pos.array);
    var m = new T.Mesh(g, mat); m.castShadow = m.receiveShadow = true;
    var o = [0, 0];
    return {
      mesh: m,
      imposta: function (p) {
        for (var j = 0; j < pos.count; j++) {
          mappa(base[3 * j], h0 + spessore / 2 + base[3 * j + 1], p, o);
          pos.setXYZ(j, o[0], o[1], base[3 * j + 2]);
        }
        pos.needsUpdate = true; g.computeVertexNormals(); g.computeBoundingSphere();
      }
    };
  }
  var mLegno = k.nuovo(k.COL.grezzo, { roughness: 0.75 });
  var pezzo = barra(S, 0.01, W, mLegno), gPezzo = new T.Group(); gPezzo.add(pezzo.mesh); radice.add(gPezzo);
  var nastro = barra(0.05, S + 0.03, W + 0.1, M.stampo); radice.add(nastro.mesh);
  var fermi = [-1, 1].map(function (sg) { var f = new T.Mesh(new T.BoxGeometry(0.16, 0.7, W + 0.3), M.scuro); f.castShadow = true; radice.add(f); return { f: f, sg: sg }; });
  var morsetto = new T.Mesh(new T.BoxGeometry(0.6, 0.4, W + 0.4), M.scuro); morsetto.position.y = R + S + 0.3; radice.add(morsetto);

  // tubo del vapore (fase 1) e particelle
  var tubo = new T.Group(); radice.add(tubo);
  var vetro = M.vetro.clone(); vetro.opacity = 0.14;
  var cil = new T.Mesh(new T.CylinderGeometry(0.75, 0.75, 2 * HL + 0.6, 40, 1, true, k.taglio ? Math.PI : 0, k.taglio ? Math.PI : Math.PI * 2), vetro);
  cil.rotation.z = Math.PI / 2; tubo.add(cil);
  var mVap = k.nuovo(0xffffff, { transparent: true, opacity: 0.7, emissive: k.COL.flusso, emissiveIntensity: 0.4 });
  var rnd = k.rng(7), bolle = [];
  for (i = 0; i < 40; i++) { var b = new T.Mesh(new T.SphereGeometry(0.07 + rnd() * 0.05, 8, 6), mVap); tubo.add(b); bolle.push({ m: b, x: (rnd() * 2 - 1) * HL, z: (rnd() * 2 - 1) * 0.5, f: rnd() }); }
  // camera di essiccazione (fase 4)
  var mCam = k.nuovo(k.COL.fuso, { transparent: true, opacity: 0.12, depthWrite: false, side: T.DoubleSide });
  var camera = new T.Mesh(new T.BoxGeometry(6.6, 6.2, 3.4), mCam); camera.position.y = 0.0; radice.add(camera);
  var spigoli = new T.LineSegments(new T.EdgesGeometry(camera.geometry), new T.LineBasicMaterial({ color: k.COL.fuso })); camera.add(spigoli);

  var cG = new T.Color(k.COL.grezzo), cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito), cMorb = cG.clone().lerp(cF, 0.45);
  var YT = 3.0, tY = k.traccia([YT, 0, 0, 0, 1.2], YT), tP = k.traccia([0, 0, 1, 1, 1], 0);
  function aggiorna(fase, t) {
    var e = k.morbido(t), p = tP(fase, t);
    pezzo.imposta(p); nastro.imposta(p);
    gPezzo.position.y = tY(fase, t);
    var suSagoma = fase >= 2 && fase <= 4;
    nastro.mesh.visible = morsetto.visible = suSagoma;
    var o = [0, 0];
    fermi.forEach(function (q) {
      q.f.visible = suSagoma;
      mappa(q.sg * (HL + 0.08), S + 0.15, p, o); q.f.position.set(o[0], o[1], 0);
      var ac = q.sg * Math.min(1, p) * Math.PI / 2; q.f.rotation.z = -ac;
    });
    tubo.visible = fase === 1; tubo.position.y = YT;
    bolle.forEach(function (b) { var u = (b.f + t * 1.5) % 1; b.m.position.set(b.x, -0.6 + 1.2 * u, b.z); b.m.scale.setScalar(1 - 0.6 * u); });
    camera.visible = fase === 4;
    if (fase === 1) mLegno.color.copy(cG).lerp(cMorb, e);
    else if (fase === 4) mLegno.color.copy(cMorb).lerp(cS, e);
    else if (fase === 5) mLegno.color.copy(cS);
    else mLegno.color.copy(cMorb);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -3.4,
    camera: { posizione: [5, 6.5, 14], bersaglio: [0, 1.1, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Sagoma', ancora: su(radice, -R + 0.2, -2.2, ZW) },
      { testo: 'Tubo del vapore', ancora: su(radice, -HL + 0.4, YT + 0.8, 0), visibile: function () { return tubo.visible; } },
      { testo: 'Nastro di tensione', ancora: su(radice, 1.6, R + 0.2, 0.4), visibile: function () { return nastro.mesh.visible; } },
      { testo: 'Camera di essiccazione', ancora: su(radice, -3.3, -1.0, 1.7), visibile: function () { return camera.visible; } },
      { testo: 'Massello', ancora: su(gPezzo, -1.9, R - 0.2, 0) }
    ]
  };
});
