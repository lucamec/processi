/* Vista 3D – Tessitura su telaio (Thompson 2007, pp. 332–337).
 * Fili d'ordito lungo Z, divisi in pari e dispari che salgono e scendono con i licci; la trama attraversa in X,
 * il pettine la batte contro le file già tessute.
 * Fasi: 1 ordito, 2 apertura del passo, 3 trama, 4 battuta, 5 incrocio.
 */
Vista3D.registra('tessitura', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var NW = 14, W = 2.6, ZB = -3.0, ZF = 1.2, Y = 0.8, PASSO = 0.35;
  add(radice, k.blocco(-4, 4, -2.4, -2.0, -4, 3, M.macchina, true));
  [-3.2, 3.2].forEach(function (x) { add(radice, k.blocco(x - 0.15, x + 0.15, -2.0, 2.4, -3.6, 2.4, M.macchina, true)); });
  var subbio = add(radice, k.cilindroX(-3.0, 3.0, 0.35, k.nuovo(0xd8c08a)));
  subbio.position.set(0, Y, ZB - 0.35);
  // fili d'ordito: tratto posteriore (dal subbio ai licci) e anteriore (dai licci al tessuto)
  var mA = k.nuovo(0xd8c08a, { roughness: 0.8 }), mB = k.nuovo(0xb8935a, { roughness: 0.8 });
  var fili = [];
  for (var i = 0; i < NW; i++) {
    var x = -W + (2 * W) * i / (NW - 1), mat = i % 2 ? mB : mA;
    var post = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 1, 6), mat), ant = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 1, 6), mat);
    radice.add(post); radice.add(ant); fili.push({ x: x, pari: i % 2 === 0, post: post, ant: ant });
  }
  function tendi(m, a, b) { var d = new T.Vector3().subVectors(b, a); m.position.copy(a).addScaledVector(d, 0.5); m.scale.set(1, d.length(), 1); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), d.normalize()); }
  // licci
  var licA = new T.Group(), licB = new T.Group(); radice.add(licA); radice.add(licB);
  [licA, licB].forEach(function (g, j) { add(g, k.blocco(-3.0, 3.0, -0.6, -0.5, -0.05 + j * 0.3 - 0.6, 0.05 + j * 0.3 - 0.6, M.stampo, true)); add(g, k.blocco(-3.0, 3.0, 2.0, 2.1, -0.05 + j * 0.3 - 0.6, 0.05 + j * 0.3 - 0.6, M.stampo, true)); });
  // pettine
  var pett = new T.Group(); radice.add(pett);
  add(pett, k.blocco(-3.0, 3.0, Y - 0.7, Y - 0.6, -0.05, 0.05, M.scuro, true)); add(pett, k.blocco(-3.0, 3.0, Y + 0.6, Y + 0.7, -0.05, 0.05, M.scuro, true));
  for (i = 0; i < NW + 1; i++) add(pett, k.blocco(-W - 0.1 + (2 * W + 0.2) * i / NW - 0.01, -W - 0.1 + (2 * W + 0.2) * i / NW + 0.01, Y - 0.6, Y + 0.6, -0.02, 0.02, M.scuro, true));
  // tessuto: file di trama già fatte + trame nuove
  var mT = k.nuovo(k.COL.fuso), mF = k.nuovo(k.COL.finito, { roughness: 0.8 });
  for (i = 0; i < 6; i++) { var f = k.cilindroX(-W - 0.1, W + 0.1, 0.06, mF); f.position.set(0, Y, ZF + 0.14 * (i + 1)); radice.add(f); }
  var trama = k.cilindroX(-W - 0.1, W + 0.1, 0.06, mT); radice.add(trama);

  var ZL = -0.6, ZP0 = 0.6;
  function aggiorna(fase, t) {
    var e = k.morbido(t), ap = 0, zP = ZP0, tx = -6, tz = ZP0 - 0.1;
    if (fase === 2) ap = e;
    if (fase === 3) { ap = 1; tx = -6 + 6 * e; }
    if (fase === 4) { ap = 1; tx = 0; zP = ZP0 + (ZF - ZP0 - 0.05) * e; tz = zP - 0.1; }
    if (fase === 5) { ap = 1 - 2 * e; tx = 0; zP = ZF - 0.05 - (ZF - 0.05 - ZP0) * e; tz = ZF - 0.15; }
    licA.position.y = PASSO * ap; licB.position.y = -PASSO * ap;
    fili.forEach(function (fl) {
      var dy = (fl.pari ? 1 : -1) * PASSO * ap;
      var pL = new T.Vector3(fl.x, Y + dy, ZL);
      tendi(fl.post, new T.Vector3(fl.x, Y, ZB), pL);
      tendi(fl.ant, pL, new T.Vector3(fl.x, Y, ZF));
    });
    pett.position.z = zP;
    trama.visible = fase >= 3; trama.position.set(tx, Y, tz);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.4,
    camera: { posizione: [6, 6, 7], bersaglio: [0, 0.6, -0.6] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Subbio dell\'ordito', ancora: su(radice, -3.0, Y + 0.4, ZB - 0.35) },
      { testo: 'Licci', ancora: su(licA, 3.0, 2.1, -0.6) },
      { testo: 'Pettine', ancora: su(pett, 3.0, Y + 0.7, 0) },
      { testo: 'Trama', ancora: su(trama, 2.0, 0.1, 0), visibile: function () { return trama.visible; } },
      { testo: 'Tessuto', ancora: su(radice, 2.6, Y, ZF + 0.6) }
    ]
  };
});
