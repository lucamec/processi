/* Vista 3D – Pressofusione a camera fredda (Thompson 2007, pp. 124–129).
 * Fasi: 1 dosaggio, 2 iniezione, 3 solidificazione, 4 apertura ed estrazione, 5 sbavatura.
 */
Vista3D.registra('pressofusione', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var X = function (s) { return (s - 470) / 40; }, Y = function (s) { return (200 - s) / 40; };
  var S = 2.75;
  add(radice, k.blocco(-8.5, 6.5, -3.6, -3.2, -3, 3, M.macchina, true));
  // cilindro di iniezione e pistone
  radice.add(k.tornito([[0.4, X(180)], [0.75, X(180)], [0.75, X(470)], [0.4, X(470)]], M.stampo));
  var pistone = new T.Group(); radice.add(pistone);
  pistone.add(k.cilindroX(X(190), X(338), 0.38, M.stampo)); pistone.add(k.cilindroX(X(60), X(190), 0.15, M.macchina));
  var carica = k.cilindroX(X(340), X(460), 0.36, k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 0.4 })); radice.add(carica);
  // crogiolo
  var crog = new T.Group(); crog.position.set(X(320), 2.6, 0); radice.add(crog);
  crog.add(k.torneroY([[0.5, 0], [0.75, 1.1], [0.85, 1.1], [0.6, -0.1], [0, -0.1]], M.macchina, 32, true));
  var getto = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 1.9, 10), carica.material); getto.position.y = -1.0; crog.add(getto);
  // stampo fisso
  add(radice, k.blocco(X(470), X(520), -S, S, -S, S, M.stampo));
  // stampo mobile con cavità (vaschetta) + estrattori + canali di raffreddamento
  var mobile = new T.Group(); radice.add(mobile);
  var x0 = X(520), x1 = X(534), x2 = X(600), x3 = X(660), o = 1.75, i = 1.4, zo = 1.75, zi = 1.4;
  [[x2, x3, -S, S, -S, S], [x1, x2, -i, i, -zi, zi], [x0, x2, o, S, -S, S], [x0, x2, -S, -o, -S, S], [x0, x2, -o, o, -S, -zo], [x0, x2, -o, o, zo, S]]
    .forEach(function (b) { add(mobile, k.blocco(b[0], b[1], b[2], b[3], b[4], b[5], M.stampo)); });
  add(mobile, k.blocco(x3, x3 + 0.55, -3.2, 3.2, -3.0, 3.0, M.macchina));
  var raffr = k.nuovo(k.COL.flusso, { emissive: k.COL.flusso, emissiveIntensity: 0 });
  [[2.2], [-2.2]].forEach(function (c) { var m = new T.Mesh(new T.CylinderGeometry(0.15, 0.15, k.taglio ? S : 2 * S, 12).rotateX(Math.PI / 2), raffr); m.position.set(X(580), c[0], k.taglio ? -S / 2 + 0.01 : 0); mobile.add(m); });
  var estr = new T.Group(); mobile.add(estr);
  [1.55, -1.55].forEach(function (y) { var p = k.cilindroX(x2, x3 + 0.1, 0.1, M.scuro); p.position.y = y; p.position.z = -0.6; estr.add(p); });
  // pezzo
  var met = k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 0.35, metalness: 0.4, roughness: 0.35 });
  var piano = new T.Plane(new T.Vector3(-1, 0, 0), 0); met.clippingPlanes = [piano];
  var pezzo = new T.Group(); mobile.add(pezzo);
  [[x0, x1, -o, o, -zo, zo], [x1, x2, i, o, -zo, zo], [x1, x2, -o, -i, -zo, zo], [x1, x2, -i, i, -zo, -zi], [x1, x2, -i, i, zi, zo]]
    .forEach(function (b) { add(pezzo, k.blocco(b[0], b[1], b[2], b[3], b[4], b[5], met, false, met)); });
  var canale = k.blocco(X(470), x0 + 0.02, -0.1, 0.1, -0.1, 0.1, met, true); pezzo.add(canale);
  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  var tP = k.traccia([0, 3.1, 3.1, 0, 0], 0), tM = k.traccia([0, 0, 0, 2.75, 2.75], 0), tE = k.traccia([0, 0, 0, -1, -1], 0);
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    pistone.position.x = tP(fase, t);
    carica.visible = fase === 1 || (fase === 2 && t < 0.5); carica.position.x = fase === 2 ? 3.1 * e : 0;
    crog.visible = fase === 1; getto.visible = fase === 1 && t > 0.2 && t < 0.9;
    mobile.position.x = tM(fase, t); estr.position.x = tE(fase, t); pezzo.position.x = tE(fase, t);
    var r = fase === 1 ? 0 : fase === 2 ? Math.max(0, (e - 0.3) / 0.7) : 1;
    piano.constant = X(470) + r * (x2 - X(470) + 0.1) + mobile.position.x + pezzo.position.x;
    pezzo.visible = fase >= 2;
    canale.visible = fase <= 4;
    var so = fase === 3 ? e : fase > 3 ? 1 : 0;
    met.color.lerpColors(cF, cS, so); met.emissiveIntensity = 0.35 * (1 - so);
    raffr.emissiveIntensity = fase === 3 ? 0.9 : 0;
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -3.6,
    camera: { posizione: [-2, 7.5, 16], bersaglio: [-0.5, 0, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Pistone', ancora: su(pistone, X(250), 0.6, 0) },
      { testo: 'Crogiolo', ancora: su(crog, 0, 1.2, 0), visibile: function () { return crog.visible; } },
      { testo: 'Stampo mobile', ancora: su(mobile, X(640), S, -2) },
      { testo: 'Getto', ancora: su(pezzo, X(560), -1.8, 0), visibile: function () { return pezzo.visible; } }
    ]
  };
});
