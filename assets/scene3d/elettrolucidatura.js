/* Vista 3D – Elettrolucidatura di supporti in inox per facciate (Thompson 2007, pp. 384–387).
 * Fasi: 1 montaggio, 2 elettrolucidatura, 3 neutralizzazione e risciacquo, 4 asciugatura.
 */
Vista3D.registra('elettrolucidatura', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var XA = -1.4, XR = 2.2;
  add(radice, k.blocco(-5, 5, -2.6, -2.2, -2.2, 2.2, M.macchina, true));
  add(radice, k.blocco(-4.5, 4.5, 2.8, 3.0, -0.1, 0.1, M.scuro, true));
  function vasca(x, w, col) {
    add(radice, k.blocco(x - w - 0.08, x + w + 0.08, -2.2, 0, -1.1, 1.1, M.macchina));
    var m = k.nuovo(col, { transparent: true, opacity: 0.38, depthWrite: false }); add(radice, k.blocco(x - w, x + w, -2.0, -0.25, -0.95, 0.95, m, false, m));
  }
  vasca(XA, 1.6, 0x8fc48a); vasca(XR, 1.0, 0x9bb7e0);
  [-1.4, 1.4].forEach(function (dx) { add(radice, k.blocco(XA + dx - 0.04, XA + dx + 0.04, -1.9, 0.2, -0.8, 0.8, M.scuro, true)); });
  // telaio rotante con supporti a quattro bracci
  var tel = new T.Group(); radice.add(tel);
  add(tel, k.blocco(-0.03, 0.03, 0.6, 2.8, -0.03, 0.03, M.scuro, true));
  var rot = new T.Group(); rot.position.y = 0.6; tel.add(rot);
  var mI = k.nuovo(0xb8bec6, { metalness: 0.7, roughness: 0.7 });
  [[-0.6, -0.5], [0.6, -0.5], [-0.6, -1.5], [0.6, -1.5]].forEach(function (p) {
    var s = new T.Group(); s.position.set(p[0], p[1], 0); rot.add(s);
    var mozzo = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 0.2, 20).rotateX(Math.PI / 2), mI); s.add(mozzo);
    for (var a = 0; a < 4; a++) { var b = new T.Mesh(new T.BoxGeometry(0.42, 0.07, 0.07), mI); var ang = Math.PI / 4 + a * Math.PI / 2; b.position.set(0.24 * Math.cos(ang), 0.24 * Math.sin(ang), 0); b.rotation.z = ang; s.add(b); }
    var h = new T.Mesh(new T.CylinderGeometry(0.01, 0.01, 0.4, 4), M.scuro); h.position.y = 0.3; s.add(h);
  });
  add(rot, k.blocco(-0.9, 0.9, -0.22, -0.18, -0.02, 0.02, M.scuro, true));
  add(rot, k.blocco(-0.9, 0.9, -1.22, -1.18, -0.02, 0.02, M.scuro, true));
  // bolle di gas e gocce
  var rnd = k.rng(2), bolle = [];
  for (var i = 0; i < 20; i++) { var bb = new T.Mesh(new T.SphereGeometry(0.035, 6, 4), k.nuovo(0xffffff, { transparent: true, opacity: 0.7 })); radice.add(bb); bolle.push({ m: bb, x: XA + (rnd() * 2 - 1) * 1.1, z: (rnd() * 2 - 1) * 0.6, f: rnd() }); }

  var cO = new T.Color(0xb8bec6), cB = new T.Color(0xe8edf2), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t), x = XA, y = 2.0;
    if (fase === 1) { x = XA - 2.4 + 2.4 * e; y = 2.0; }
    if (fase === 2) { y = t < 0.15 ? 2.0 * (1 - t / 0.15) : t > 0.9 ? 2.0 * (t - 0.9) / 0.1 : 0; }
    if (fase === 3) { x = t < 0.25 ? XA + (XR - XA) * k.morbido(t / 0.25) : XR; y = t < 0.25 ? 2.0 : t < 0.4 ? 2.0 * (1 - (t - 0.25) / 0.15) : t > 0.85 ? 2.0 * (t - 0.85) / 0.15 : 0; }
    if (fase === 4) { x = XR + 1.6 * e; y = 2.0; }
    tel.position.set(x, y - 0.8 * (1 - y / 2.0), 0);
    rot.rotation.y = fase === 2 ? t * 3 : 0;
    bolle.forEach(function (b) { b.m.visible = fase === 2 && t > 0.15 && t < 0.9; var h = (b.f + t * 3) % 1; b.m.position.set(b.x, -1.8 + 1.5 * h, b.z); });
    if (fase === 1) { mI.color.copy(cO); mI.roughness = 0.7; }
    else if (fase === 2) { var u = Math.max(0, Math.min(1, (t - 0.15) / 0.75)); mI.color.copy(cO).lerp(cB, u); mI.roughness = 0.7 - 0.55 * u; }
    else if (fase === 3) { mI.color.copy(cB); mI.roughness = 0.15; }
    else { mI.color.copy(cB).lerp(cS, 0.5 * e); mI.roughness = 0.15; }
    mI.metalness = 0.6;
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.6,
    camera: { posizione: [1.5, 4.5, 10], bersaglio: [0.2, 0, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Bagno acido, 50–90 °C', ancora: su(radice, XA - 1.6, -0.2, 1.0) },
      { testo: 'Catodi (−)', ancora: su(radice, XA + 1.4, 0.2, 0.8) },
      { testo: 'Risciacquo', ancora: su(radice, XR, -1.6, 1.0) },
      { testo: 'Supporti in inox (+)', ancora: su(tel, 0.9, 0.7, 0) }
    ]
  };
});
