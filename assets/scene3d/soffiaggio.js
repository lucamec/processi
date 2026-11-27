/* Vista 3D – Soffiaggio, estrusione-soffiaggio (Thompson 2007, pp. 22–24).
 * Stesse proporzioni dello schema 2D (1 unità = 40 px). Asse Y verticale, bottiglia attorno all'asse Y.
 * Fasi: 1 estrusione del parison, 2 chiusura e taglio, 3 soffiaggio, 4 apertura, 5 rifilatura.
 */
Vista3D.registra('soffiaggio', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var Y = function (sy) { return (230 - sy) / 40; };
  var PROF = [[15, 150], [15, 180], [58, 206], [60, 214], [60, 290], [52, 304], [0, 306]].map(function (p) { return [p[0] / 40, Y(p[1])]; });
  var INT = PROF.map(function (p, i) { return [Math.max(0.001, p[0] - 0.12), i === 0 ? p[1] : Math.max(p[1], Y(300))]; });

  // basamento e montante
  add(radice, k.blocco(-4, 4, -3.4, -3.0, -2.4, 2.4, M.macchina, true));
  add(radice, k.blocco(-0.5, 0.5, -3.0, 4.2, -2.7, -2.1, M.macchina, true));
  add(radice, k.blocco(-0.5, 0.5, 3.0, 3.6, -2.7, -1.0, M.macchina, true));
  // estrusore e testa
  add(radice, k.cilindroX(-6.5, -1.0, 0.5, M.macchina)).position.y = 3.6;
  add(radice, k.blocco(-1.0, 1.0, 3.0, 4.2, -1.0, 1.0, M.stampo));
  add(radice, k.torneroY([[0.0, 3.0], [0.15, 3.0], [0.15, 4.2], [0.0, 4.2]], M.stampo));

  // parison (tubo che scende dalla testa)
  var fusoMat = k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 0.25, roughness: 0.4 });
  var parison = new T.Group(); parison.position.y = 3.0; radice.add(parison);
  parison.add(k.torneroY([[0.23, 0], [0.38, 0], [0.38, -5.3], [0.23, -5.3]], fusoMat));
  var tPar = k.traccia([1, 1, 1, 1, 1], 0.05), tParOp = k.traccia([1, 1, 0, 0, 0], 1);

  // bottiglia soffiata
  var profBott = PROF.concat(INT.slice().reverse());
  var bott = k.torneroY(profBott, fusoMat, 64);
  radice.add(bott);
  var matBott = bott.userData.materiali;
  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  var tSx = k.traccia([0.25, 0.25, 1, 1, 1], 0.25), tBOp = k.traccia([0, 0, 1, 1, 1], 0), tSol = k.traccia([0, 0, 0, 1, 1], 0);
  var bava = add(radice, k.blocco(-0.38, 0.38, Y(322), Y(306), -0.38, 0.38, k.nuovo(k.COL.finito)));
  var tBava = k.traccia([0, 0, 0, 1, 0], 0);

  // stampo in due metà, con la cavità a forma di bottiglia
  function meta(sg) {
    var pts = [[0, Y(140)], [sg * 2.75, Y(140)], [sg * 2.75, Y(330)], [0, Y(330)]];
    PROF.slice().reverse().forEach(function (p) { pts.push([sg * p[0], p[1]]); });
    pts.push([sg * PROF[0][0], Y(140)]);
    if (sg < 0) pts.reverse();
    var g = new T.Group(); g.add(k.estruso(pts, null, -1.9, 1.9, M.stampo)); radice.add(g); return g;
  }
  var sx = meta(-1), dx = meta(1);
  var tAp = k.traccia([2.25, 0, 0, 2.25, 2.25]);

  // coltello, ugello di soffiaggio, rifilatrice
  var coltello = add(radice, k.blocco(2.2, 3.7, Y(146), Y(134), -0.5, 0.5, M.scuro, true));
  var tCol = k.traccia([0, -2.75, -2.75, 0, 0], 0), tColOp = k.traccia([0, 1, 0, 0, 0], 0);
  var ugello = new T.Group(); radice.add(ugello);
  ugello.add(k.torneroY([[0, 0], [0.15, 0], [0.15, 1.8], [0, 1.8]], M.scuro, 24, true));
  var tUg = k.traccia([3.2, 3.2, 1.6, 3.2, 3.2], 3.2);
  var rif = add(radice, k.blocco(-1.0, 1.0, Y(338), Y(326), -1.0, 1.0, M.scuro, true));
  var tRif = k.traccia([0, 0, 0, 0, 0.45], 0), tRifOp = k.traccia([0, 0, 0, 0, 1], 0);

  function aggiorna(fase, t) {
    parison.scale.y = tPar(fase, t);
    parison.visible = tParOp(fase, t) > 0.5;
    var s = tSx(fase, t); bott.scale.set(s, 1, s);
    bott.visible = tBOp(fase, t) > 0.02;
    var so = tSol(fase, t);
    matBott.forEach(function (m) { m.color.lerpColors(cF, cS, so); m.emissiveIntensity = 0.25 * (1 - so); });
    bava.visible = tBava(fase, t) > 0.5;
    var a = tAp(fase, t); sx.position.x = -a; dx.position.x = a;
    coltello.position.x = 2.95 + tCol(fase, t); coltello.visible = tColOp(fase, t) > 0.1;
    ugello.position.y = tUg(fase, t);
    rif.position.y = (Y(338) + Y(326)) / 2 + tRif(fase, t); rif.visible = tRifOp(fase, t) > 0.1;
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -3.4,
    camera: { posizione: [7.5, 5, 16.5], bersaglio: [-0.8, 0.8, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Estrusore', ancora: su(radice, -4.5, 4.2, 0) },
      { testo: 'Parison', ancora: su(radice, 0.4, 0.6, 0), visibile: function () { return parison.visible && !bott.visible; } },
      { testo: 'Stampo', ancora: su(dx, 1.8, 2.3, -0.6) },
      { testo: 'Ugello di soffiaggio', ancora: su(ugello, 0.3, 0.6, 0) },
      { testo: 'Bottiglia', ancora: su(radice, 1.4, -0.6, 0), visibile: function () { return bott.visible; } }
    ]
  };
});
