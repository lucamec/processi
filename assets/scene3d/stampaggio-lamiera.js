/* Vista 3D – Stampaggio della lamiera (Thompson 2007, pp. 82–87).
 * Fasi: 1 carico del grezzo, 2 stampaggio, 3 estrazione, 4 rifilatura e bordatura.
 */
Vista3D.registra('stampaggio-lamiera', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var LX = 5.0, LZ = 3.6, AX = 3.2, AZ = 2.0, W = 0.45, D = 1.0;

  add(radice, k.blocco(-6.2, 6.2, -3.0, -2.6, -4.4, 4.4, M.macchina, true));
  // matrice: cornice attorno alla cavità + fondo
  [[-5.2, -AX - W, -2.6, -0.05, -4.2, 4.2], [AX + W, 5.2, -2.6, -0.05, -4.2, 4.2], [-AX - W, AX + W, -2.6, -0.05, -4.2, -AZ - W], [-AX - W, AX + W, -2.6, -0.05, AZ + W, 4.2], [-AX - W, AX + W, -2.6, -D - 0.08, -AZ - W, AZ + W]]
    .forEach(function (b) { add(radice, k.blocco(b[0], b[1], b[2], b[3], b[4], b[5], M.stampo)); });
  // punzone
  var punz = new T.Group(); radice.add(punz);
  add(punz, k.blocco(-AX + 0.1, AX - 0.1, -D + 0.08, 2.2, -AZ + 0.1, AZ - 0.1, M.stampo));
  add(punz, k.blocco(-4.4, 4.4, 2.2, 3.0, -3.2, 3.2, M.macchina));
  // lamiera deformabile
  var mat = k.nuovo(k.COL.grezzo, { side: T.DoubleSide, metalness: 0.5, roughness: 0.3 });
  var lam = k.lastra(LX, LZ, 90, 66, mat); radice.add(lam.mesh);
  function s(u, a) { var v = (a + W - Math.abs(u)) / W; v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); }
  function forma(x, z) { return -D * s(x, AX) * s(z, AZ); }
  var cG = new T.Color(k.COL.grezzo), cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  var tP = k.traccia([3.2, 0, 3.2, 3.2], 3.2), tE = k.traccia([0, 0, 0.5, 0], 0);

  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var p = fase === 1 ? 0 : fase === 2 ? Math.max(0, (e - 0.7) / 0.3) : 1;
    var su = tE(fase, t), rif = fase === 4 ? e : 0;
    lam.imposta(function (x, z) {
      var y = 0.02 + p * forma(x, z) + su;
      return y;
    }, function (x, z) {
      // rifilatura: il bordo si ritira verso la cavità
      var fx = Math.max(0, Math.abs(x) - (AX + W + 0.35)), fz = Math.max(0, Math.abs(z) - (AZ + W + 0.35));
      return [-Math.sign(x) * fx * rif, -Math.sign(z) * fz * rif];
    });
    punz.position.y = tP(fase, t) + (fase === 2 ? 0 : 0);
    if (fase === 1) mat.color.copy(cG); else if (fase === 2) mat.color.lerpColors(cG, cF, e); else mat.color.lerpColors(cF, cS, fase === 3 ? e : 1);
  }
  function at(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -3.0,
    camera: { posizione: [8, 10, 17], bersaglio: [0, -0.3, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Punzone', ancora: at(punz, AX - 0.3, 2.0, -AZ) },
      { testo: 'Matrice', ancora: at(radice, 4.8, -0.2, -3.8) },
      { testo: 'Lamiera', ancora: at(radice, -4.6, 0.1, -3.0) }
    ]
  };
});
