/* Vista 3D – Argentatura galvanica di cucchiai (Thompson 2007, pp. 364–367).
 * Fasi: 1 pulizia, 2 montaggio, 3 deposizione, 4 lucidatura.
 */
Vista3D.registra('galvanostegia', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var XP = -2.6, XG = 1.0;
  add(radice, k.blocco(-5, 5, -2.6, -2.2, -2.2, 2.2, M.macchina, true));
  // vasca di pulizia e vasca galvanica
  function vasca(x, w, col) {
    add(radice, k.blocco(x - w - 0.08, x + w + 0.08, -2.2, 0, -1.0, 1.0, M.macchina));
    var m = k.nuovo(col, { transparent: true, opacity: 0.35, depthWrite: false }); add(radice, k.blocco(x - w, x + w, -2.0, -0.2, -0.85, 0.85, m, false, m));
  }
  vasca(XP, 0.9, 0xd8e8f0); vasca(XG, 1.8, 0x9bb7e0);
  var mAg = k.nuovo(0xd9dde2, { metalness: 0.9, roughness: 0.25 });
  [XG - 1.55, XG + 1.55].forEach(function (x) { add(radice, k.blocco(x - 0.12, x + 0.12, -1.9, 0.3, -0.5, 0.5, mAg, true)); });
  // cucchiai appesi a un filo
  var appesi = new T.Group(); radice.add(appesi);
  add(appesi, k.blocco(-0.9, 0.9, 1.2, 1.26, -0.03, 0.03, M.scuro, true));
  var mC = k.nuovo(0xb8a888, { metalness: 0.7, roughness: 0.3 });
  var cucchiai = [-0.5, 0, 0.5].map(function (x) {
    var g = new T.Group(); g.position.set(x, 0, 0); appesi.add(g);
    var filo = new T.Mesh(new T.CylinderGeometry(0.008, 0.008, 0.6, 4), M.scuro); filo.position.y = 0.95; g.add(filo);
    var manico = new T.Mesh(new T.BoxGeometry(0.08, 1.3, 0.03), mC); manico.position.y = 0.0; g.add(manico);
    var conca = new T.Mesh(new T.SphereGeometry(0.2, 16, 10), mC); conca.scale.set(0.8, 1.3, 0.35); conca.position.y = -0.8; g.add(conca);
    return g;
  });
  // ioni e bolle
  var mIo = k.nuovo(0xffffff, { emissive: 0xc8d8ff, emissiveIntensity: 0.6 });
  var rnd = k.rng(9), ioni = [];
  for (var i = 0; i < 40; i++) { var m = new T.Mesh(new T.SphereGeometry(0.03, 6, 4), mIo); radice.add(m); ioni.push({ m: m, lato: i % 2 ? 1 : -1, y: -1.7 + rnd() * 1.6, z: (rnd() * 2 - 1) * 0.4, f: rnd() }); }
  var bolle = [];
  for (i = 0; i < 20; i++) { var b = new T.Mesh(new T.SphereGeometry(0.035, 6, 4), k.nuovo(0xffffff, { transparent: true, opacity: 0.7 })); radice.add(b); bolle.push({ m: b, x: XP + (rnd() * 2 - 1) * 0.6, z: (rnd() * 2 - 1) * 0.4, f: rnd() }); }
  // spazzola lucidante
  var spaz = new T.Mesh(new T.CylinderGeometry(0.5, 0.5, 0.25, 32).rotateX(Math.PI / 2), k.nuovo(0xe8e0d0, { roughness: 0.95 })); radice.add(spaz);

  var cOt = new T.Color(0xb8a888), cAg = new T.Color(0xd9dde2), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t), x = XP, y = 0;
    if (fase === 1) { y = t < 0.2 ? 2.0 * (1 - t / 0.2) : t > 0.8 ? 2.0 * (t - 0.8) / 0.2 : 0; }
    if (fase === 2) { x = XP + (XG - XP) * Math.min(1, e * 1.4); y = 2.0 * (1 - Math.max(0, (t - 0.6) / 0.4)); }
    if (fase === 3) { x = XG; y = 0; }
    if (fase === 4) { x = XG + 2.8 * Math.min(1, e * 2); y = 2.0 * Math.min(1, e * 2); }
    appesi.position.set(x, y - 0.6 * (1 - Math.min(1, y / 2.0)), 0);
    cucchiai.forEach(function (g, j) { g.rotation.z = fase === 3 ? 0.12 * Math.sin(t * 25 + j) : 0; });
    bolle.forEach(function (b) { b.m.visible = fase === 1 && t > 0.2 && t < 0.8; var h = (b.f + t * 3) % 1; b.m.position.set(b.x, -1.5 + 1.2 * h, b.z); });
    ioni.forEach(function (p) {
      p.m.visible = fase === 3; var u = (p.f + t * 2) % 1;
      p.m.position.set(XG + p.lato * (1.45 - 1.0 * u), p.y, p.z);
    });
    if (fase <= 2) { mC.color.copy(cOt); mC.roughness = 0.3; }
    else if (fase === 3) { mC.color.copy(cOt).lerp(cAg, e); mC.roughness = 0.3 + 0.3 * e; }
    else { mC.color.copy(cAg).lerp(cS, e); mC.roughness = 0.6 - 0.45 * e; }
    spaz.visible = fase === 4 && t > 0.5; spaz.rotation.z = t * 40; spaz.position.set(XG + 2.8, 1.2 - 0.6, 0.45);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.6,
    camera: { posizione: [1.5, 4, 10], bersaglio: [0.3, -0.2, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Pulizia', ancora: su(radice, XP, -0.1, 1.0) },
      { testo: 'Anodi d\'argento (+)', ancora: su(radice, XG + 1.55, 0.3, 0.5) },
      { testo: 'Cucchiai (−)', ancora: su(appesi, 0.9, 1.26, 0) },
      { testo: 'Bagno galvanico', ancora: su(radice, XG - 1.6, -1.9, 1.0) }
    ]
  };
});
