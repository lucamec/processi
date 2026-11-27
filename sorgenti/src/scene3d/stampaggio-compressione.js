/* Vista 3D – Stampaggio a compressione di un termoindurente (Thompson 2007, pp. 46–49).
 * Stampo inferiore in tre parti (fisso + due carrelli laterali), punzone superiore, estrattore.
 * Fasi: 1 carico, 2 compressione, 3 indurimento, 4 apertura ed estrazione. 1 unità = 40 px dello schema 2D.
 */
Vista3D.registra('stampaggio-compressione', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var Y = function (sy) { return (270 - sy) / 40; }, X = function (sx) { return (sx - 410) / 40; };
  var D = 1.9;            // semiprofondità dello stampo (asse Z)
  var dP = 1.5;           // semiprofondità del pezzo

  // pressa: piano fisso, colonne, traversa
  add(radice, k.blocco(-5.4, 5.4, Y(322), Y(300), -2.6, 2.6, M.macchina, true));
  [-4.8, 4.8].forEach(function (x) { [-2.1, 2.1].forEach(function (z) { if (!(k.taglio && z > 0)) { var c = new T.Mesh(new T.CylinderGeometry(0.22, 0.22, 9, 20), M.macchina); c.position.set(x, 2.3, z); c.castShadow = true; radice.add(c); } }); });
  add(radice, k.blocco(-5.4, 5.4, 6.6, 7.2, -2.6, 2.6, M.macchina, true));

  // stampo inferiore fisso + blocchi anteriore/posteriore
  add(radice, k.blocco(X(300), X(520), Y(300), Y(270), -D, D, M.stampo));
  add(radice, k.blocco(X(300), X(520), Y(270), Y(150), -D, -dP, M.stampo));
  add(radice, k.blocco(X(300), X(520), Y(270), Y(150), dP, D, M.stampo));
  var carS = new T.Group(), carD = new T.Group(); radice.add(carS); radice.add(carD);
  add(carS, k.blocco(X(230), X(300), Y(300), Y(150), -D, D, M.stampo));
  add(carD, k.blocco(X(520), X(590), Y(300), Y(150), -D, D, M.stampo));
  var estr = new T.Mesh(new T.CylinderGeometry(0.15, 0.15, 1.0, 16), M.scuro); estr.position.set(0, Y(291), 0); radice.add(estr);

  // punzone (stampo superiore) con pistone
  var punz = new T.Group(); radice.add(punz);
  add(punz, k.blocco(X(230), X(590), Y(100), Y(60), -D, D, M.stampo));
  add(punz, k.blocco(X(316), X(504), Y(254), Y(100), -dP + 0.4, dP - 0.4, M.stampo));
  var pist = new T.Mesh(new T.CylinderGeometry(0.75, 0.75, 4, 32), M.macchina); pist.position.y = Y(60) + 2; punz.add(pist);

  // pastiglia
  var pastiglia = add(radice, k.blocco(X(340), X(480), Y(270), Y(236), -1.0, 1.0, M.grezzo, false, M.grezzo));
  // pezzo a coppa (vaschetta aperta in alto): fondo + 4 pareti, riempita dal basso verso l'alto
  var mat = k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 0.25, roughness: 0.4 });
  var livello = new T.Plane(new T.Vector3(0, -1, 0), 0); mat.clippingPlanes = [livello];
  var pezzo = new T.Group(); radice.add(pezzo);
  var w = 0.4, x0 = X(300), x1 = X(520), y0 = Y(270), y1 = Y(170);
  [[x0, x1, y0, y0 + w, -dP, dP], [x0, x0 + w, y0, y1, -dP, dP], [x1 - w, x1, y0, y1, -dP, dP],
   [x0 + w, x1 - w, y0, y1, -dP, -dP + w], [x0 + w, x1 - w, y0, y1, dP - w, dP]].forEach(function (b) { add(pezzo, k.blocco(b[0], b[1], b[2], b[3], b[4], b[5], mat, false, mat)); });
  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);

  var tPunz = k.traccia([3.0, 0, 0, 3.0], 3.0), tCar = k.traccia([0, 0, 0, 1.5], 0), tEstr = k.traccia([0, 0, 0, 1.1], 0);
  var tPast = k.traccia([0, 0, 0, 0], 2.2);
  function morb(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function aggiorna(fase, t) {
    punz.position.y = tPunz(fase, t);
    carS.position.x = -tCar(fase, t); carD.position.x = tCar(fase, t);
    var e = tEstr(fase, t); estr.position.y = Y(291) + e; pezzo.position.y = e;
    pastiglia.position.y = (Y(270) + Y(236)) / 2 + tPast(fase, t);
    pastiglia.visible = fase === 1 || (fase === 2 && t < 0.35);
    var r = fase === 1 ? 0 : fase === 2 ? morb(Math.max(0, (t - 0.3) / 0.7)) : 1;
    livello.constant = y0 - 0.05 + r * (y1 - y0 + 0.1) + pezzo.position.y;
    pezzo.visible = fase > 1;
    var so = fase === 3 ? morb(t) : fase === 4 ? 1 : 0;
    mat.color.lerpColors(cF, cS, so); mat.emissiveIntensity = 0.25 * (1 - so);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: Y(322),
    camera: { posizione: [7, 6.5, 15], bersaglio: [0, 1.4, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Punzone', ancora: su(punz, X(560), Y(60), -1.2) },
      { testo: 'Carrello laterale', ancora: su(carD, X(590), Y(160), -1.2) },
      { testo: 'Pastiglia', ancora: su(pastiglia, 1.7, 0.4, 0), visibile: function () { return pastiglia.visible; } },
      { testo: 'Pezzo', ancora: su(pezzo, X(500), Y(175), 0), visibile: function () { return pezzo.visible; } }
    ]
  };
});
