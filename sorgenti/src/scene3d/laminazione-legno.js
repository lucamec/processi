/* Vista 3D – Laminazione di impiallacciature in stampo a due parti (Thompson 2007, pp. 190–197).
 * Sette fogli deformabili (lastre) piegati insieme sulla forma dello stampo.
 * Fasi: 1 strati incollati, 2 pressatura, 3 indurimento, 4 sformatura.
 */
Vista3D.registra('laminazione-legno', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var LX = 4.2, LZ = 2.2, N = 7, s = 0.12;
  function onda(x) { var u = x / LX; return 1.1 * Math.exp(-Math.pow(u / 0.32, 2)) - 0.5 * Math.pow(Math.abs(u), 3); }
  add(radice, k.blocco(-5.2, 5.2, -2.8, -2.4, -3, 3, M.macchina, true));
  // stampo inferiore: superficie modellata + blocco
  var mInf = k.nuovo(k.COL.stampo, { side: T.DoubleSide, roughness: 0.6 });
  var sup = k.lastra(LX, LZ, 80, 20, mInf); sup.imposta(function (x) { return onda(x) - 0.02; }); radice.add(sup.mesh);
  add(radice, k.blocco(-LX, LX, -2.4, -0.7, -LZ, LZ, mInf));
  // tampone
  var tamp = new T.Group(); radice.add(tamp);
  var tsup = k.lastra(LX, LZ, 80, 20, mInf); tsup.imposta(function (x) { return onda(x) + N * s + 0.02; }); tamp.add(tsup.mesh);
  add(tamp, k.blocco(-LX, LX, 1.6 + N * s, 2.6 + N * s, -LZ, LZ, mInf));
  var vite = new T.Mesh(new T.CylinderGeometry(0.25, 0.25, 3, 16), M.scuro); vite.position.y = 4.3; tamp.add(vite);
  // fogli
  var fogli = [];
  for (var i = 0; i < N; i++) {
    var m = k.nuovo(i % 2 ? 0xd9c08a : 0xb8935a, { side: T.DoubleSide, roughness: 0.7 });
    var l = k.lastra(LX - 0.1, LZ - 0.1, 80, 16, m); radice.add(l.mesh); fogli.push({ l: l, m: m, base: m.color.clone() });
  }
  var cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var p = fase === 1 ? 0 : fase === 2 ? Math.max(0, (e - 0.4) / 0.6) : 1;
    fogli.forEach(function (f, i) {
      f.l.imposta(function (x) { return (1 - p) * (1.6 + i * s) + p * (onda(x) + (i + 0.5) * s) + (fase === 4 ? 2.4 * e : 0); });
      if (fase === 4) f.m.color.copy(f.base).lerp(cS, e); else f.m.color.copy(f.base);
    });
    var tP = fase === 1 ? 2.6 : fase === 2 ? 2.6 * (1 - e) : fase === 3 ? 0 : 2.6 + 2.4 * e;
    tamp.position.y = tP + (fase === 2 ? 0 : 0);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.8,
    camera: { posizione: [6, 7, 13], bersaglio: [0, 1.0, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Tampone', ancora: su(tamp, LX - 0.3, 2.6 + N * s, -LZ) },
      { testo: 'Stampo inferiore', ancora: su(radice, LX - 0.3, -0.8, -LZ) },
      { testo: 'Fogli di impiallacciatura', ancora: su(radice, -LX + 0.6, 1.8, -1.2) }
    ]
  };
});
