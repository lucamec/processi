/* Vista 3D – Incisione CNC di trofei in PMMA (Thompson 2007, pp. 396–399).
 * Fresatrice a 3 assi; tre lastre trasparenti fissate con film adesivo e incise insieme.
 * Fasi: 1 fissaggio e azzeramento, 2 incisione a linee rette, 3 colore, 4 pulizia.
 */
Vista3D.registra('incisione-cnc', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  add(radice, k.blocco(-4.5, 4.5, -1.4, -1.0, -2.6, 2.6, M.macchina, true));
  add(radice, k.blocco(-4, 4, -1.0, -0.7, -2.2, 2.2, M.stampo, true));
  add(radice, k.blocco(-3.6, 3.6, -0.7, -0.68, -1.4, 1.4, k.nuovo(0xd9c27a, { transparent: true, opacity: 0.6 }), true)); // film adesivo
  // portale
  var portale = new T.Group(); radice.add(portale);
  [-4.2, 4.2].forEach(function (x) { add(portale, k.blocco(x - 0.25, x + 0.25, -1.0, 3.2, -0.25, 0.25, M.macchina, true)); });
  add(portale, k.blocco(-4.45, 4.45, 2.7, 3.2, -0.3, 0.3, M.macchina, true));
  add(portale, k.blocco(-4.0, 4.0, 2.75, 3.15, 0.3, 0.42, M.scuro, true));
  var carr = new T.Group(); carr.position.y = 2.7; portale.add(carr);
  add(carr, k.blocco(-0.4, 0.4, -0.3, 0.5, 0.3, 0.9, M.scuro, true));
  var testa = new T.Group(); testa.position.z = 0.6; carr.add(testa);
  var corpo = new T.Mesh(new T.CylinderGeometry(0.28, 0.28, 1.2, 24), M.macchina); corpo.position.y = -0.6; testa.add(corpo);
  var punta = new T.Mesh(new T.ConeGeometry(0.06, 0.5, 12).rotateX(Math.PI), k.nuovo(0x6a7078, { metalness: 0.7, roughness: 0.35 })); punta.position.y = -1.45; testa.add(punta);
  // tre lastre in PMMA
  var mPMMA = k.nuovo(0xdaf0f4, { transparent: true, opacity: 0.45, roughness: 0.05, depthWrite: false });
  var XL = [-2.4, 0, 2.4], LX = 1.0, LZ = 1.2, YT = -0.48;
  var lastre = XL.map(function (x) { var g = new T.Group(); g.position.x = x; radice.add(g); add(g, k.blocco(-LX, LX, -0.68, YT, -LZ, LZ, mPMMA, true)); return g; });
  // disegno: tratti dritti (x0, x1, z) relativi alla lastra
  var TR = [[-0.7, 0.7, -0.8], [-0.7, 0.7, -0.55], [-0.5, 0.5, -0.2], [-0.3, 0.3, 0.05], [-0.15, 0.15, 0.3], [-0.15, 0.15, 0.55], [-0.5, 0.5, 0.8]];
  var mInc = k.nuovo(0xf6f8f9, { roughness: 1 }), mCol = k.nuovo(0xb8323a, { roughness: 0.5, transparent: true });
  var tratti = [], colori = [];
  lastre.forEach(function (g, li) {
    TR.forEach(function (s) {
      var m = new T.Mesh(new T.BoxGeometry(1, 0.012, 0.12).translate(0.5, 0, 0), mInc); m.position.set(s[0], YT + 0.005, s[2]); g.add(m);
      tratti.push({ m: m, li: li, s: s });
      var c = new T.Mesh(new T.BoxGeometry(s[1] - s[0], 0.014, 0.12), mCol); c.position.set((s[0] + s[1]) / 2, YT + 0.008, s[2]); g.add(c); colori.push(c);
    });
  });
  var racla = new T.Group(); radice.add(racla);
  add(racla, k.blocco(-3.6, 3.6, YT, YT + 0.5, -0.04, 0.04, M.scuro, true));
  var ZERO = [XL[2] + LX, YT, -LZ];
  // punta a y = testa.y + 1.0: per portarla a yp, testa.y = yp - 1.0
  function testaA(x, yp, z) { portale.position.z = z; carr.position.x = x; testa.position.y = yp - 1.0; }
  function aggiorna(fase, t) {
    var e = k.morbido(t), N = tratti.length;
    lastre.forEach(function (g, i) { g.position.y = fase === 1 ? 1.2 * (1 - k.morbido(Math.max(0, Math.min(1, t * 2 - i * 0.3)))) : fase === 4 ? 0.9 * e : 0; });
    var fatto = fase === 2 ? t * N : fase > 2 ? N : 0;
    tratti.forEach(function (o, i) { var f = Math.max(0, Math.min(1, fatto - i)); o.m.visible = f > 0; o.m.scale.x = Math.max(0.001, f * (o.s[1] - o.s[0])); });
    var cAl = fase === 3 ? Math.min(1, Math.max(0, (t - 0.2) / 0.6)) : fase === 4 ? 1 : 0;
    colori.forEach(function (c) { c.visible = cAl > 0; }); mCol.opacity = cAl;
    racla.visible = fase === 3 && t > 0.15 && t < 0.85; racla.position.z = -1.3 + 2.6 * Math.min(1, Math.max(0, (t - 0.15) / 0.7));
    if (fase === 1) { var u = Math.max(0, (t - 0.55) / 0.45); testaA(ZERO[0] * k.morbido(u), YT + 0.8 - 0.8 * k.morbido(u), ZERO[2] * k.morbido(u)); }
    else if (fase === 2) {
      var i = Math.min(N - 1, Math.floor(fatto)), f = fatto - i, o = tratti[i], x0 = XL[o.li] + o.s[0], x1 = XL[o.li] + o.s[1];
      var su = f > 0.9 ? (f - 0.9) * 4 : 0;
      testaA(x0 + (x1 - x0) * Math.min(1, f / 0.9), YT + su, o.s[2]);
    } else testaA(0, YT + 1.2, fase === 3 ? -1.9 : 0);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -1.4,
    camera: { posizione: [3.5, 6.5, 10], bersaglio: [0, 0.4, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Portale a 3 assi', ancora: su(portale, -4.2, 3.2, 0) },
      { testo: 'Punta in tungsteno, 0,3 mm', ancora: su(punta, 0, -0.2, 0) },
      { testo: 'PMMA 10 mm su film adesivo', ancora: su(lastre[0], -LX, YT, LZ) },
      { testo: 'Vernice a racla', ancora: su(racla, 3.6, YT + 0.5, 0), visibile: function () { return racla.visible; } }
    ]
  };
});
