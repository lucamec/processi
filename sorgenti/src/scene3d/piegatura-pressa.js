/* Vista 3D – Piegatura in aria alla pressa (Thompson 2007, pp. 148–151).
 * Fasi: 1 carico, 2 discesa del punzone, 3 piega completa, 4 ritorno ed estrazione.
 */
Vista3D.registra('piegatura-pressa', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var L = 4.2;   // semilunghezza della piega (asse Z)
  function prisma(pts, z0, z1, mat) {
    var sh = new T.Shape(pts.map(function (p) { return new T.Vector2(p[0], p[1]); }));
    var g = new T.ExtrudeGeometry(sh, { depth: z1 - z0, bevelEnabled: false }); g.translate(0, 0, z0);
    var m = new T.Mesh(g, mat); m.castShadow = m.receiveShadow = true; return m;
  }
  var zmax = k.taglio ? 0 : L;
  add(radice, k.blocco(-4, 4, -3.4, -3.0, -5.6, 5.6, M.macchina, true));
  radice.add(prisma([[-1.3, -2.6], [1.3, -2.6], [1.3, -0.15], [0.55, -0.15], [0, -0.8], [-0.55, -0.15], [-1.3, -0.15]], -L - 0.6, zmax + (k.taglio ? 0 : 0.6), M.stampo));
  add(radice, k.blocco(-1.6, 1.6, -3.0, -2.6, -L - 0.8, L + 0.8, M.macchina, true));
  var punz = new T.Group(); radice.add(punz);
  punz.add(prisma([[-0.5, 2.6], [0.5, 2.6], [0.5, 0.9], [0, 0], [-0.5, 0.9]], -L - 0.6, zmax + (k.taglio ? 0 : 0.6), M.stampo));
  add(punz, k.blocco(-1.6, 1.6, 2.6, 3.6, -L - 0.8, L + 0.8, M.macchina, true));
  [-5.0, 5.0].forEach(function (z) { if (!(k.taglio && z > 0)) add(radice, k.blocco(-1.2, 1.2, -3.0, 4.4, z - 0.25, z + 0.25, M.macchina, true)); });
  var mat = k.nuovo(k.COL.grezzo, { side: T.DoubleSide, metalness: 0.5, roughness: 0.3 });
  var lam = k.lastra(3.2, L, 64, 40, mat); radice.add(lam.mesh);
  var cG = new T.Color(k.COL.grezzo), cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var th = fase === 1 ? 0 : fase === 2 ? (Math.PI / 4) * 0.6 * e : fase === 3 ? (Math.PI / 4) * (0.6 + 0.4 * e) : Math.PI / 4;
    var su = fase === 4 ? 1.2 * e : 0, gi = (fase === 1 ? 0 : 1) * (th / (Math.PI / 4)) * 0.55;
    lam.imposta(function (x) { return -0.12 - gi + Math.abs(x) * Math.sin(th) + su; }, function (x) { return [Math.sign(x) * Math.abs(x) * Math.cos(th) - x, 0]; });
    punz.position.y = fase === 1 ? 1.6 : fase === 2 ? 1.6 - 1.6 * e * 0.7 - 0.0 : fase === 3 ? 0.48 - 0.55 * e + 0.0 : -0.07 + 1.7 * e;
    if (fase === 2) punz.position.y = 1.6 - (1.6 + 0.12 + gi) * Math.min(1, e * 1.2) + 0.0;
    if (fase === 3) punz.position.y = -0.12 - gi;
    if (fase === 1) mat.color.copy(cG); else if (fase === 4) mat.color.lerpColors(cF, cS, e); else mat.color.copy(cF);
  }
  function at(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -3.4,
    camera: { posizione: [9, 2.2, 9], bersaglio: [0, -0.2, -1.2] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Punzone', ancora: at(punz, 0.5, 2.6, -3.5) },
      { testo: 'Matrice a V', ancora: at(radice, 1.3, -0.4, -3.8) },
      { testo: 'Lamiera', ancora: at(radice, -2.8, 0.1, -3.0) }
    ]
  };
});
