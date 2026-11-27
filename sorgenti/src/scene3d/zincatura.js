/* Vista 3D – Zincatura a caldo di una trave (Thompson 2007, pp. 368–371).
 * Fasi: 1 pulizia e decapaggio, 2 flussaggio, 3 immersione nello zinco, 4 estrazione.
 */
Vista3D.registra('zincatura', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var XV = [-3.2, -0.4, 2.8], WV = [1.1, 1.1, 1.6];
  add(radice, k.blocco(-5.5, 5.5, -2.6, -2.2, -2.2, 2.2, M.macchina, true));
  add(radice, k.blocco(-5, 5, 3.2, 3.4, -0.1, 0.1, M.scuro, true));
  var COL = [0xb8d8c8, 0xd8d0b0, 0xc8ccd2];
  XV.forEach(function (x, i) {
    add(radice, k.blocco(x - WV[i] - 0.1, x + WV[i] + 0.1, -2.2, 0, -1.0, 1.0, M.macchina));
    var m = k.nuovo(COL[i], { transparent: true, opacity: i === 2 ? 0.75 : 0.4, depthWrite: false });
    add(radice, k.blocco(x - WV[i], x + WV[i], -2.0, -0.25, -0.85, 0.85, m, false, m));
  });
  // trave appesa inclinata
  var bil = new T.Group(); radice.add(bil);
  add(bil, k.blocco(-1.2, 1.2, 1.9, 2.0, -0.05, 0.05, M.scuro, true));
  [-0.9, 0.9].forEach(function (x) { add(bil, k.blocco(x - 0.02, x + 0.02, 0.6 + (x > 0 ? 0.55 : -0.55), 1.9, -0.02, 0.02, M.scuro, true)); });
  var trave = new T.Group(); trave.rotation.z = 0.52; trave.position.y = 0.6; bil.add(trave);
  var mAc = k.nuovo(0x8a6a4a, { metalness: 0.4, roughness: 0.8 });
  add(trave, k.blocco(-1.1, 1.1, -0.06, 0.06, -0.3, 0.3, mAc, true));
  add(trave, k.blocco(-1.1, 1.1, -0.36, 0.36, -0.05, 0.05, mAc, true));
  add(trave, k.blocco(-1.1, 1.1, -0.36, -0.3, -0.3, 0.3, mAc, true));
  add(trave, k.blocco(-1.1, 1.1, 0.3, 0.36, -0.3, 0.3, mAc, true));
  // vapore del flusso, schizzi e gocce di zinco
  var mV = k.nuovo(0xffffff, { transparent: true, opacity: 0.35, depthWrite: false });
  var vap = new T.Group(); radice.add(vap);
  for (var i = 0; i < 8; i++) { var s = new T.Mesh(new T.SphereGeometry(0.16, 10, 8), mV); s.position.set((i - 4) * 0.25, 0.3 * (i % 3), (i % 2 ? 0.2 : -0.2)); vap.add(s); }
  var mZ = k.nuovo(0xd8dce2, { metalness: 0.9, roughness: 0.15 });
  var gocce = []; var rnd = k.rng(4);
  for (i = 0; i < 20; i++) { var g = new T.Mesh(new T.SphereGeometry(0.04, 6, 4), mZ); radice.add(g); gocce.push({ m: g, x: (rnd() * 2 - 1) * 1.0, z: (rnd() * 2 - 1) * 0.3, f: rnd() }); }

  var cR = new T.Color(0x8a6a4a), cG = new T.Color(0x8d99a6), cZ = new T.Color(0xd8dce2), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t), x = XV[Math.min(2, fase - 1)], dip = 0;
    var xPrev = fase === 1 ? XV[0] - 2 : XV[Math.min(2, fase - 2)];
    if (fase === 4) { x = XV[2]; xPrev = XV[2]; }
    var xx = t < 0.2 ? xPrev + (x - xPrev) * k.morbido(t / 0.2) : x;
    if (fase <= 3) dip = t < 0.2 ? 0 : t > 0.85 ? 1 - (t - 0.85) / 0.15 : Math.min(1, (t - 0.2) / 0.15);
    if (fase === 3 && t > 0.85) dip = 1;
    if (fase === 4) dip = 1 - e;
    bil.position.set(xx, 1.0 - 2.0 * dip, 0);
    vap.visible = fase === 2 && t > 0.85 || (fase === 3 && t < 0.2); vap.position.set(xx, 1.0, 0);
    gocce.forEach(function (g) {
      var h = (g.f + t * 3) % 1, vis = (fase === 3 && dip > 0.5 && t < 0.4) || (fase === 4 && t > 0.2 && t < 0.9);
      g.m.visible = vis;
      if (fase === 3) g.m.position.set(XV[2] + g.x, -0.2 + 0.5 * Math.sin(Math.PI * h), g.z);
      else g.m.position.set(XV[2] + g.x * 0.8, 0.6 - 0.9 * h, g.z);
    });
    if (fase === 1) mAc.color.copy(cR).lerp(cG, Math.max(0, (t - 0.3) / 0.6));
    else if (fase === 2) mAc.color.copy(cG);
    else if (fase === 3) mAc.color.copy(cG).lerp(cZ, Math.max(0, (t - 0.4) / 0.5));
    else mAc.color.copy(cZ).lerp(cS, Math.max(0, (t - 0.6) / 0.4));
    mAc.metalness = fase >= 3 ? 0.8 : 0.4; mAc.roughness = fase >= 3 ? 0.25 : 0.8;
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.6,
    camera: { posizione: [1.5, 5, 13], bersaglio: [0, 0, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Pulizia e decapaggio', ancora: su(radice, XV[0], -0.1, 1.0) },
      { testo: 'Flusso', ancora: su(radice, XV[1], -1.6, 1.0) },
      { testo: 'Zinco fuso a 450 °C', ancora: su(radice, XV[2], -0.1, 1.0) },
      { testo: 'Trave d\'acciaio inclinata', ancora: su(trave, 1.1, 0.36, 0.3) }
    ]
  };
});
