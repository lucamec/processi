/* Vista 3D – Profilatura a rulli (Thompson 2007, pp. 110–113).
 * Il nastro è una superficie la cui sezione (angolare) si piega progressivamente lungo X, stazione dopo stazione.
 * Fasi: 1 svolgimento, 2 prime stazioni, 3 stazioni finali, 4 taglio a misura.
 */
Vista3D.registra('profilatura-rulli', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat;
  var ST = [-3.6, -1.2, 1.2, 3.6], X0 = -7.5, X1 = 7.5, W = 1.3;
  radice.add(k.blocco(-9, 9, -2.8, -2.4, -2.4, 2.4, M.macchina, true));
  // coil
  var coil = new T.Mesh(new T.CylinderGeometry(1.4, 1.4, 1.5, 40).rotateX(Math.PI / 2), k.nuovo(k.COL.grezzo, { metalness: 0.5, roughness: 0.35 }));
  coil.position.set(-9.2, 0.6, 0); coil.castShadow = true; radice.add(coil);
  // rulli
  var rulli = [];
  ST.forEach(function (x) {
    [0.62, -0.62].forEach(function (y) {
      var r = new T.Mesh(new T.CylinderGeometry(0.55, 0.55, 2.0, 32).rotateX(Math.PI / 2), M.stampo);
      r.position.set(x, y, -0.65); r.scale.y = 0.65; r.castShadow = true; radice.add(r); rulli.push(r);
    });
    radice.add(k.blocco(x - 0.3, x + 0.3, -2.4, 1.6, -1.5, -1.2, M.macchina, true));
  });
  // cesoia
  var lama = k.blocco(5.6, 5.8, 0.3, 1.8, -1.0, 1.4, M.scuro, true); radice.add(lama);
  // nastro: sezione a L, il lato alto ruota di theta(x)
  var mat = k.nuovo(k.COL.fuso, { side: T.DoubleSide, metalness: 0.5, roughness: 0.3 });
  var NX = 120, NW = 12;
  function theta(x) { var a = (x - (ST[0] - 1.2)) / (ST[3] - ST[0] + 1.2); return Math.max(0, Math.min(1, a)) * Math.PI / 2; }
  function sezione(x, i) { // i: 0..NW lungo la larghezza
    var s = (i / NW) * 2 * W - W; // da -W a W (z)
    if (s <= 0) return [0, s];
    var th = theta(x); return [s * Math.sin(th), s * Math.cos(th)];
  }
  var geo = new T.PlaneGeometry(1, 1, NX, NW); var pos = geo.attributes.position;
  var nastro = new T.Mesh(geo, mat); nastro.castShadow = true; radice.add(nastro);
  var pezzo = new T.Mesh(new T.PlaneGeometry(1, 1, 20, NW), k.nuovo(k.COL.finito, { side: T.DoubleSide, metalness: 0.5, roughness: 0.3 })); radice.add(pezzo);
  function riempi(g, xa, xb, dx) {
    var p = g.attributes.position, nx = g.parameters.widthSegments;
    for (var j = 0; j <= NW; j++) for (var i = 0; i <= nx; i++) {
      var x = xa + (xb - xa) * i / nx, sz = sezione(Math.min(x, X1), j);
      p.setXYZ(j * (nx + 1) + i, x + dx, sz[0], sz[1]);
    }
    p.needsUpdate = true; g.computeVertexNormals();
  }
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var fronte = fase === 1 ? -5 + 1.0 * e : fase === 2 ? -4 + 5 * e : fase === 3 ? 1 + 4.7 * e : 5.7;
    riempi(geo, X0, fronte, 0);
    pezzo.visible = fase === 4;
    if (fase === 4) riempi(pezzo.geometry, 5.7, 9.0, 3.3 * e - 3.3);
    lama.position.y = fase === 4 ? -0.9 * Math.sin(Math.PI * Math.min(1, t * 2)) : 0;
    var giro = (fase - 1 + t) * Math.PI * 4;
    rulli.forEach(function (r, i) { r.rotation.z = (i % 2 ? 1 : -1) * giro; });
    coil.rotation.z = giro * 0.4;
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.8,
    camera: { posizione: [3.5, 8, 17], bersaglio: [0.3, 0, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Coil', ancora: su(coil, 0, 1.5, 0) },
      { testo: 'Rulli progressivi', ancora: su(radice, ST[1], 1.3, 0) },
      { testo: 'Cesoia', ancora: su(lama, 5.7, 1.9, 0) }
    ]
  };
});
