/* Vista 3D – Stampaggio per compressione di DMC con inserto (Thompson 2007, pp. 218–221).
 * Stampo rotondo: coppa con inserto e perno; il riempimento della cavità è un piano di taglio che sale.
 * Fasi: 1 carico, 2 stampaggio, 3 sformatura, 4 sbavatura.
 */
Vista3D.registra('dmc-smc', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };

  add(radice, k.blocco(-4, 4, -2.0, -1.6, -3, 3, M.macchina, true));
  // colonne e traversa della pressa
  [[-3.2, -2.2], [3.2, -2.2]].forEach(function (p) { add(radice, k.blocco(p[0] - 0.2, p[0] + 0.2, -1.6, 6.4, p[1] - 0.2, p[1] + 0.2, M.macchina, true)); });
  add(radice, k.blocco(-3.6, 3.6, 6.4, 7.0, -2.6, -1.8, M.macchina, true));
  // stampo inferiore
  radice.add(k.torneroY([[0, -1.6], [2.6, -1.6], [2.6, 1.2], [1.6, 1.2], [1.6, 0], [0, 0]], M.stampo, 64));
  // estrattori
  var estr = new T.Group(); radice.add(estr);
  [-0.9, 0.9].forEach(function (x) { var c = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 1.6, 12), M.scuro); c.position.set(x, -0.8, 0); estr.add(c); });

  // pezzo con inserto, perno e bava
  var pezzo = new T.Group(); radice.add(pezzo);
  var gP = k.torneroY([[0, 0], [1.6, 0], [1.6, 1.2], [1.3, 1.2], [1.3, 0.3], [0, 0.3]], k.nuovo(k.COL.fuso), 64); pezzo.add(gP);
  var livello = new T.Plane(new T.Vector3(0, -1, 0), 0);
  var matP = gP.userData.materiali; matP.forEach(function (m) { m.clippingPlanes = [livello]; });
  var bava = k.torneroY([[1.6, 1.2], [2.1, 1.2], [2.1, 1.24], [1.6, 1.24]], k.nuovo(k.COL.fuso), 64); pezzo.add(bava);
  var inserto = k.torneroY([[0, 0.1], [0.32, 0.1], [0.32, 0.7], [0, 0.7]], M.stampo, 24); pezzo.add(inserto);
  var perno = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 0.9, 12), M.scuro); perno.position.y = -0.3; pezzo.add(perno);
  // carica di DMC
  var mC = k.nuovo(k.COL.grezzo, { roughness: 0.9 });
  var carica = k.torneroY([[0, 0], [1.0, 0], [1.05, 0.25], [0.9, 0.6], [0.5, 0.75], [0, 0.78]], mC, 40); radice.add(carica);

  // stampo superiore e pistone
  var sup = new T.Group(); radice.add(sup);
  sup.add(k.torneroY([[0, 0.3], [1.3, 0.3], [1.3, 1.2], [2.6, 1.2], [2.6, 2.4], [0, 2.4]], M.stampo, 64));
  var pist = new T.Mesh(new T.CylinderGeometry(0.6, 0.6, 4, 32), M.scuro); pist.position.y = 4.4; sup.add(pist);

  var tSu = k.traccia([2.6, 0, 2.6, 2.6], 2.6), tEs = k.traccia([0, 0, 0.9, 0.9], 0);
  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  function colora(gr, c) { (gr.userData.materiali || []).forEach(function (m) { m.color.copy(c); }); }
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    sup.position.y = tSu(fase, t);
    var riemp = fase === 1 ? 0 : fase === 2 ? Math.max(0, (e - 0.35) / 0.65) : 1;
    livello.constant = fase >= 3 ? 100 : -0.01 + 1.3 * riemp;
    carica.visible = fase <= 2 && riemp < 1; carica.scale.set(1 + 0.5 * riemp, 1 - 0.9 * riemp, 1 + 0.5 * riemp);
    bava.visible = (fase === 2 && riemp > 0.95) || fase === 3 || (fase === 4 && t < 0.5);
    var y = tEs(fase, t); pezzo.position.y = y; estr.position.y = y;
    perno.visible = !(fase === 4 && t > 0.6); perno.position.y = -0.3 - (fase === 4 ? 0.6 * e : 0);
    var c = fase <= 2 ? cF : cS; colora(gP, c); colora(bava, c);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.0,
    camera: { posizione: [7, 7, 14], bersaglio: [0, 1.4, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Stampo superiore', ancora: su(sup, -2.6, 2.0, 0) },
      { testo: 'Stampo inferiore', ancora: su(radice, -2.6, -1.0, 0) },
      { testo: 'Carica di DMC', ancora: su(radice, 0.6, 0.7, 0.6), visibile: function () { return carica.visible; } },
      { testo: 'Inserto metallico', ancora: su(pezzo, 0.3, 0.7, 0), visibile: function () { return !carica.visible; } }
    ]
  };
});
