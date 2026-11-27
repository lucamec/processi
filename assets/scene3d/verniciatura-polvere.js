/* Vista 3D – Verniciatura a polvere elettrostatica di un elemento di cancello (Thompson 2007, pp. 356–359).
 * Le particelle seguono curve di Bézier dalla pistola a punti sul pezzo, anche sul retro.
 * Fasi: 1 preparazione, 2 spruzzatura, 3 cottura, 4 raffreddamento.
 */
Vista3D.registra('verniciatura-polvere', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  add(radice, k.blocco(-5, 5, -2.8, -2.4, -2.4, 2.4, M.macchina, true));
  add(radice, k.blocco(-5, 5, 2.9, 3.1, -0.1, 0.1, M.scuro, true));                    // rotaia del trasportatore
  // vasca di preparazione e forno
  var mAq = k.nuovo(k.COL.flusso, { transparent: true, opacity: 0.3, depthWrite: false });
  add(radice, k.blocco(-4.6, -2.4, -2.4, -0.6, -1.0, 1.0, mAq, true));
  var mFo = k.nuovo(k.COL.fuso, { transparent: true, opacity: 0.12, depthWrite: false, side: T.DoubleSide });
  var forno = new T.Mesh(new T.BoxGeometry(2.4, 3.6, 2.0), mFo); forno.position.set(3.4, 0.6, 0); radice.add(forno);
  forno.add(new T.LineSegments(new T.EdgesGeometry(forno.geometry), new T.LineBasicMaterial({ color: k.COL.fuso })));
  // pezzo: telaio con sbarre verticali, appeso al gancio
  var pezzo = new T.Group(); radice.add(pezzo);
  var mP = k.nuovo(0x8d99a6, { metalness: 0.5, roughness: 0.5 });
  [[-0.9, 0.9, 1.5, 1.65], [-0.9, 0.9, -1.25, -1.1]].forEach(function (b) { add(pezzo, k.blocco(b[0], b[1], b[2], b[3], -0.06, 0.06, mP, true)); });
  [-0.85, -0.42, 0, 0.42, 0.85].forEach(function (x) { add(pezzo, k.blocco(x - 0.05, x + 0.05, -1.1, 1.5, -0.05, 0.05, mP, true)); });
  var gancio = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 1.25, 6), M.scuro); gancio.position.y = 2.27; pezzo.add(gancio);
  // pistola
  var pist = new T.Group(); pist.position.set(0, 0.2, 2.2); radice.add(pist);
  var canna = new T.Mesh(new T.CylinderGeometry(0.08, 0.12, 0.9, 16).rotateX(Math.PI / 2), M.stampo); pist.add(canna);
  // particelle
  var mPart = k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 0.4 });
  var rnd = k.rng(11), curve = [], part = [];
  for (var i = 0; i < 70; i++) {
    var tx = (rnd() * 2 - 1) * 0.9, ty = -1.1 + rnd() * 2.7, retro = rnd() < 0.3;
    var a = new T.Vector3(0, 0.2, 1.75), b = new T.Vector3(tx * 1.4, ty * 0.5 + 0.2, retro ? -0.2 : 0.9), c = new T.Vector3(tx + (retro ? (tx > 0 ? 0.5 : -0.5) : 0), ty, retro ? -0.6 : 0.4), d = new T.Vector3(tx, ty, retro ? -0.07 : 0.07);
    curve.push(new T.CubicBezierCurve3(a, b, c, d));
    var m = new T.Mesh(new T.SphereGeometry(0.035, 6, 4), mPart); radice.add(m); part.push({ m: m, f: rnd() });
  }
  var cG = new T.Color(0x8d99a6), cPol = new T.Color(0xd9c8c0), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t), px = 0, py = 0;
    if (fase === 1) { py = -2.4 * Math.sin(Math.PI * Math.min(1, t / 0.8)); px = t < 0.8 ? -3.5 : -3.5 + 3.5 * k.morbido((t - 0.8) / 0.2); }
    if (fase === 2) px = 0;
    if (fase === 3) px = 3.4 * Math.min(1, e * 1.5);
    if (fase === 4) px = 3.4 + 1.2 * e;
    pezzo.position.set(px, py, 0);
    pist.visible = fase === 2;
    part.forEach(function (p, i) {
      var u = (p.f + t * 2.5) % 1; p.m.visible = fase === 2;
      if (fase === 2) p.m.position.copy(curve[i].getPoint(u));
    });
    mP.roughness = fase >= 3 ? 0.25 : 0.7;
    if (fase === 1) mP.color.copy(cG);
    else if (fase === 2) mP.color.copy(cG).lerp(cPol, Math.min(1, t * 1.3));
    else if (fase === 3) mP.color.copy(cPol).lerp(cS, Math.max(0, (t - 0.4) / 0.6));
    else mP.color.copy(cS);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.8,
    camera: { posizione: [2, 4.5, 13.5], bersaglio: [0, 0.4, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Pistola elettrostatica', ancora: su(pist, 0, 0.15, 0.4), visibile: function () { return pist.visible; } },
      { testo: 'Vasca di preparazione', ancora: su(radice, -4.6, -0.6, 1.0) },
      { testo: 'Forno a circa 200 °C', ancora: su(radice, 4.6, 2.4, 1.0) },
      { testo: 'Pezzo a terra', ancora: su(pezzo, 0.9, 1.6, 0) }
    ]
  };
});
