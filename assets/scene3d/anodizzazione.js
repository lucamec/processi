/* Vista 3D – Linea di anodizzazione (Thompson 2007, pp. 360–363).
 * Un telaio con profilati scende in quattro vasche: una per fase.
 * Fasi: 1 pulizia e mordenzatura, 2 anodizzazione, 3 colorazione, 4 fissaggio.
 */
Vista3D.registra('anodizzazione', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var XV = [-3.3, -1.1, 1.1, 3.3], W = 0.9;
  var COL = [0xbfe3e6, 0x9bb7e0, 0xb0805a, 0xd8e8f0];
  add(radice, k.blocco(-5, 5, -2.6, -2.2, -2.2, 2.2, M.macchina, true));
  add(radice, k.blocco(-4.6, 4.6, 2.6, 2.8, -0.1, 0.1, M.scuro, true));
  var liquidi = XV.map(function (x, i) {
    add(radice, k.blocco(x - W - 0.08, x + W + 0.08, -2.2, -0.1, -1.0, 1.0, M.macchina));
    var mL = k.nuovo(COL[i], { transparent: true, opacity: 0.4, depthWrite: false });
    return add(radice, k.blocco(x - W, x + W, -2.0, -0.3, -0.85, 0.85, mL, false, mL));
  });
  // catodi nella seconda vasca
  [-0.7, 0.7].forEach(function (z) { add(radice, k.blocco(XV[1] - 0.7, XV[1] + 0.7, -1.9, 0.2, z - 0.03, z + 0.03, M.scuro, true)); });
  // vapore sull'ultima vasca
  var vap = new T.Group(); radice.add(vap);
  var mV = k.nuovo(0xffffff, { transparent: true, opacity: 0.35, depthWrite: false });
  for (var i = 0; i < 8; i++) { var s = new T.Mesh(new T.SphereGeometry(0.15, 10, 8), mV); s.position.set(XV[3] - 0.6 + 0.17 * i, 0.1 + 0.2 * (i % 3), (i % 2 ? 0.3 : -0.3)); vap.add(s); }
  // bolle nella vasca 2
  var bolle = []; var rnd = k.rng(5);
  for (i = 0; i < 24; i++) { var b = new T.Mesh(new T.SphereGeometry(0.04, 6, 4), k.nuovo(0xffffff, { transparent: true, opacity: 0.7 })); radice.add(b); bolle.push({ m: b, x: XV[1] + (rnd() * 2 - 1) * 0.5, z: (rnd() * 2 - 1) * 0.3, f: rnd() }); }
  // telaio con profilati
  var telaio = new T.Group(); radice.add(telaio);
  add(telaio, k.blocco(-0.8, 0.8, 1.1, 1.2, -0.05, 0.05, M.scuro, true));
  add(telaio, k.blocco(-0.03, 0.03, 1.2, 2.6, -0.03, 0.03, M.scuro, true));
  var mAl = k.nuovo(0xc8d0d8, { metalness: 0.75, roughness: 0.25 });
  [-0.6, -0.2, 0.2, 0.6].forEach(function (x) { add(telaio, k.blocco(x - 0.08, x + 0.08, -1.6, 1.1, -0.08, 0.08, mAl, true)); });
  telaio.rotation.z = 0.06;

  var cAl = new T.Color(0xc8d0d8), cOs = new T.Color(0xdfe3e6), cBr = new T.Color(0x8a6a3a), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var x = XV[fase - 1], su = t < 0.2 ? 1 - t / 0.2 : t > 0.85 ? (t - 0.85) / 0.15 : 0;
    var xPrev = fase === 1 ? XV[0] - 1.8 : XV[fase - 2];
    var xx = t < 0.2 ? xPrev + (x - xPrev) * k.morbido(t / 0.2) : x;
    telaio.position.set(xx, 2.2 * k.morbido(su), 0);
    var dentro = t >= 0.2 && t <= 0.85, u = Math.max(0, Math.min(1, (t - 0.2) / 0.65));
    bolle.forEach(function (b) { b.m.visible = fase === 2 && dentro; var h = (b.f + t * 3) % 1; b.m.position.set(b.x, -1.8 + 1.5 * h, b.z); });
    vap.visible = fase === 4;
    if (fase === 1) { mAl.color.copy(cAl); mAl.roughness = 0.25 + 0.4 * u; mAl.metalness = 0.75; }
    if (fase === 2) { mAl.color.copy(cAl).lerp(cOs, u); mAl.roughness = 0.65; mAl.metalness = 0.75 - 0.35 * u; }
    if (fase === 3) { mAl.color.copy(cOs).lerp(cBr, u); mAl.roughness = 0.6; mAl.metalness = 0.4; }
    if (fase === 4) { mAl.color.copy(cBr).lerp(cS, u); mAl.roughness = 0.6 - 0.3 * u; mAl.metalness = 0.4; }
  }
  function su2(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.6,
    camera: { posizione: [2, 5, 11], bersaglio: [0, 0, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Pulizia', ancora: su2(radice, XV[0], -0.1, 1.0) },
      { testo: 'Acido solforico (anodo +)', ancora: su2(radice, XV[1], -1.6, 1.0) },
      { testo: 'Colore', ancora: su2(radice, XV[2], -0.1, 1.0) },
      { testo: 'Fissaggio 98 °C', ancora: su2(radice, XV[3], -1.6, 1.0) }
    ]
  };
});
