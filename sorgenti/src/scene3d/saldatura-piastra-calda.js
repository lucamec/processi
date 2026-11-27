/* Vista 3D – Saldatura a piastra calda di un contenitore in due metà (Thompson 2007, pp. 320–323).
 * Fasi: 1 carico, 2 riscaldamento, 3 ritiro della piastra, 4 saldatura, 5 raffreddamento ed estrazione.
 */
Vista3D.registra('saldatura-piastra-calda', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var W = 1.4, D = 0.9, H = 0.7, P = 0.06;
  add(radice, k.blocco(-4, 4, -2.8, -2.4, -2.4, 2.4, M.macchina, true));
  [[-2.4, -1.6], [2.4, -1.6]].forEach(function (p) { add(radice, k.blocco(p[0] - 0.15, p[0] + 0.15, -2.4, 3.4, p[1] - 0.15, p[1] + 0.15, M.macchina, true)); });
  var mT = k.nuovo(0x8d99a6, { transparent: true, opacity: 0.45, depthWrite: false });
  var mP = k.nuovo(0xe9e4da, { roughness: 0.45, side: T.DoubleSide });
  function guscio(su) {   // scatola aperta verso il giunto (y = 0)
    var g = new T.Group(), s = su ? 1 : -1, t = 0.08;
    add(g, k.blocco(-W, W, Math.min(s * (H - t), s * H), Math.max(s * (H - t), s * H), -D, D, mP));
    add(g, k.blocco(-W, -W + t, Math.min(0, s * H), Math.max(0, s * H), -D, D, mP));
    add(g, k.blocco(W - t, W, Math.min(0, s * H), Math.max(0, s * H), -D, D, mP));
    add(g, k.blocco(-W, W, Math.min(0, s * H), Math.max(0, s * H), -D, -D + t, mP));
    add(g, k.blocco(-W, W, Math.min(0, s * H), Math.max(0, s * H), D - t, D, mP));
    return g;
  }
  var sup = new T.Group(); radice.add(sup);
  var gSup = guscio(true); radice.add(gSup); add(sup, k.blocco(-W - 0.3, W + 0.3, H, H + 0.8, -D - 0.3, D + 0.3, mT, true)); add(sup, k.blocco(-2.2, 2.2, H + 0.8, H + 1.2, -1.2, 1.2, M.macchina, true));
  var inf = new T.Group(); radice.add(inf);
  inf.add(guscio(false)); add(inf, k.blocco(-W - 0.3, W + 0.3, -H - 0.8, -H, -D - 0.3, D + 0.3, mT, true)); add(inf, k.blocco(-2.2, 2.2, -H - 1.2, -H - 0.8, -1.2, 1.2, M.macchina, true));
  // piastra calda
  var mPi = k.nuovo(0xb8c2cc, { emissive: k.COL.fuso, emissiveIntensity: 0.5, metalness: 0.4 });
  var piastra = new T.Mesh(new T.BoxGeometry(2 * W + 0.6, 0.12, 2 * D + 0.6), mPi); radice.add(piastra);
  // bordi caldi e bava
  var mBo = k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 0.8 });
  var bordo = new T.Mesh(new T.BoxGeometry(2 * W + 0.06, 0.08, 2 * D + 0.06), mBo); radice.add(bordo);
  var bava = new T.Group(); radice.add(bava);
  [[0, D + 0.04, 2 * W + 0.16, 0.08], [0, -D - 0.04, 2 * W + 0.16, 0.08], [W + 0.04, 0, 0.08, 2 * D], [-W - 0.04, 0, 0.08, 2 * D]].forEach(function (b) { var m = new T.Mesh(new T.BoxGeometry(b[2], 0.06, b[3]), mBo); m.position.set(b[0], 0, b[1]); bava.add(m); });

  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t), g = 0.6, px = 0, cal = 0;
    if (fase === 1) { g = 0.6; px = 5; }
    if (fase === 2) { px = 5 * Math.max(0, 1 - t * 2); g = t < 0.5 ? 0.6 : 0.6 - 0.53 * k.morbido((t - 0.5) * 2); cal = Math.max(0, (t - 0.6) / 0.4); }
    if (fase === 3) { g = 0.07 + 0.53 * Math.min(1, t * 2); px = t < 0.5 ? 0 : 5 * k.morbido((t - 0.5) * 2); cal = 1; }
    if (fase === 4) { g = 0.6 * (1 - e) - 0.01; px = 5; cal = 1; }
    if (fase === 5) { g = -0.01; px = 5; cal = 1 - e; }
    sup.position.y = g; inf.position.y = -(fase >= 4 ? 0 : g);
    if (fase === 5) sup.position.y = 1.4 * Math.max(0, (t - 0.5) / 0.5);
    gSup.position.y = fase === 5 ? -0.01 : sup.position.y;
    piastra.position.x = px; piastra.visible = px < 4.9;
    bordo.visible = cal > 0.02 && (fase === 2 || fase === 3); bordo.position.y = fase === 3 ? 0 : 0; mBo.emissiveIntensity = 0.8 * cal;
    bava.visible = fase >= 4; bava.position.y = 0; bava.scale.set(1, fase === 4 ? Math.max(0.1, e) : 1, 1);
    mBo.color.copy(cF).lerp(cS, fase === 5 ? e : 0);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.8,
    camera: { posizione: [5.5, 4.5, 9.5], bersaglio: [0, 0, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Utensile superiore', ancora: su(sup, -2.2, H + 1.0, 1.2) },
      { testo: 'Utensile inferiore', ancora: su(inf, -2.2, -H - 1.0, 1.2) },
      { testo: 'Piastra calda', ancora: su(piastra, W + 0.3, 0.06, D + 0.3), visibile: function () { return piastra.visible; } },
      { testo: 'Bava', ancora: su(bava, W, 0, D), visibile: function () { return bava.visible; } }
    ]
  };
});
