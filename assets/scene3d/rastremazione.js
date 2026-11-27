/* Vista 3D – Rastremazione rotativa (Thompson 2007, pp. 104–106).
 * Quattro martelli ruotano con la testa e si aprono e chiudono; il profilo del tubo passa da cilindro a cono chiuso.
 * Fasi: 1 inserimento, 2 martellatura, 3 chiusura della punta, 4 estrazione.
 */
Vista3D.registra('rastremazione', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var Ro = 0.62, Ri = 0.47, N = 60;
  add(radice, k.blocco(-8, 6, -3.4, -3.0, -3, 3, M.macchina, true));
  add(radice, k.blocco(0.6, 4.6, -3.0, -2.6, -2.6, 2.6, M.macchina, true));
  var testa = new T.Group(); radice.add(testa);
  testa.add(k.tornito([[1.2, 0.6], [2.6, 0.6], [2.6, 4.2], [1.2, 4.2]], M.macchina, 64));
  var martelli = [];
  for (var i = 0; i < 4; i++) {
    if (k.taglio && (i === 1 || i === 0)) continue;
    var g = new T.Group(); g.rotation.x = i * Math.PI / 2; testa.add(g);
    var m = new T.Group(); g.add(m);
    var sh = new T.Shape([new T.Vector2(0.9, Ro + 0.06), new T.Vector2(2.4, 0.12), new T.Vector2(3.9, 0.12), new T.Vector2(3.9, 1.15), new T.Vector2(0.9, 1.15)]);
    var geo = new T.ExtrudeGeometry(sh, { depth: 0.7, bevelEnabled: false }); geo.translate(0, 0, -0.35);
    var mesh = new T.Mesh(geo, M.stampo); mesh.castShadow = true; m.add(mesh);
    martelli.push(m);
  }
  // tubo: profilo esterno/interno che passa da cilindro a cono chiuso (punta piena)
  var mat = k.nuovo(k.COL.grezzo, { side: T.DoubleSide, metalness: 0.55, roughness: 0.3 });
  var tubo = new T.Mesh(new T.BufferGeometry(), mat); tubo.castShadow = true; radice.add(tubo);
  function profilo(p) {
    // x da -6 a XT; raggio esterno: cilindro fino a xa, poi cono fino alla punta
    var XT = 2.9, xa = XT - 2.3 * p, pts = [];
    function rest(x) { return x <= xa ? Ro : Ro + (0.06 - Ro) * Math.min(1, (x - xa) / Math.max(0.001, XT - xa)); }
    for (var j = 0; j <= N; j++) { var x = -6 + (XT + 6) * j / N; pts.push([rest(x), x]); }
    pts.push([0.001, XT]);
    var pin = [];
    for (var j2 = N; j2 >= 0; j2--) { var x2 = -6 + (XT - 0.4 * p - 0.05 + 6) * j2 / N; var r = Math.max(0.001, rest(x2) - 0.15 - 0.1 * p * Math.max(0, (x2 - xa))); pin.push([r, x2]); }
    return pts.concat(pin);
  }
  function ricostruisci(p, dx) {
    var pts = profilo(p).map(function (q) { return new T.Vector2(q[0], q[1] + dx); });
    var g2 = new T.LatheGeometry(pts, 48, k.taglio ? Math.PI / 2 : 0, k.taglio ? Math.PI : Math.PI * 2);
    g2.rotateZ(-Math.PI / 2);
    tubo.geometry.dispose(); tubo.geometry = g2;
  }
  var cG = new T.Color(k.COL.grezzo), cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  var tX = k.traccia([-1.8, 0, 0, -4.5], -1.8);
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var p = fase === 1 ? 0 : fase === 2 ? 0.75 * e : 1;
    ricostruisci(p, tX(fase, t));
    var batte = fase === 2 || fase === 3;
    if (!k.taglio) testa.rotation.x = batte ? t * Math.PI * 8 : 0;
    var ap = batte ? 0.12 * Math.abs(Math.sin(t * Math.PI * 24)) : 0.12;
    martelli.forEach(function (m) { m.position.y = ap; });
    if (fase === 1) mat.color.copy(cG); else if (fase === 4) mat.color.lerpColors(cF, cS, e); else mat.color.copy(cF);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -3.4,
    camera: { posizione: [4, 5, 12], bersaglio: [0.2, 0.2, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Testa rotante', ancora: su(radice, 3.5, 2.6, -0.4) },
      { testo: 'Martelli', ancora: su(radice, 2.2, 1.0, -0.4) },
      { testo: 'Tubo', ancora: su(radice, -4.0, 0.7, 0) }
    ]
  };
});
