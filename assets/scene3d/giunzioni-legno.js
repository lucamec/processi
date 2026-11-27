/* Vista 3D – Giunto a tenone e mortasa, montaggio esploso (Thompson 2007, pp. 324–331).
 * Fasi: 1 tenone (cadono le guance), 2 mortasa (esce il blocco), 3 colla, 4 montaggio.
 */
Vista3D.registra('giunzioni-legno', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  add(radice, k.blocco(-4, 5, -2.8, -2.4, -2.4, 2.4, M.macchina, true));
  var mR = k.nuovo(0xd8b98a, { roughness: 0.75 }), mR2 = mR.clone();
  // gamba con mortasa cieca sul lato +x (z -0.15..0.15, y -0.4..0.6, profonda 0.5)
  var gamba = new T.Group(); radice.add(gamba);
  add(gamba, k.blocco(-0.5, 0, -2.4, 2.0, -0.5, 0.5, mR));
  add(gamba, k.blocco(0, 0.5, -2.4, 2.0, -0.5, -0.15, mR));
  add(gamba, k.blocco(0, 0.5, -2.4, 2.0, 0.15, 0.5, mR));
  add(gamba, k.blocco(0, 0.5, -2.4, -0.4, -0.15, 0.15, mR));
  add(gamba, k.blocco(0, 0.5, 0.6, 2.0, -0.15, 0.15, mR));
  var tappo = add(radice, k.blocco(0, 0.5, -0.4, 0.6, -0.15, 0.15, k.nuovo(0xd8b98a, { roughness: 0.75, transparent: true, opacity: 1 }), true));
  // traverso con tenone (coordinate locali: il tenone va da x 0 a 0.5)
  var trav = new T.Group(); radice.add(trav);
  add(trav, k.blocco(0.5, 4.0, -0.5, 0.7, -0.4, 0.4, mR2));
  var mTen = k.nuovo(0xd8b98a, { roughness: 0.75, emissive: k.COL.fuso, emissiveIntensity: 0 });
  add(trav, k.blocco(0.02, 0.5, -0.4, 0.6, -0.15, 0.15, mTen));
  var mGu = k.nuovo(0xd8b98a, { roughness: 0.75, transparent: true, opacity: 1 });
  var guance = [[0.02, 0.5, -0.5, 0.7, -0.4, -0.15], [0.02, 0.5, -0.5, 0.7, 0.15, 0.4], [0.02, 0.5, -0.5, -0.4, -0.15, 0.15], [0.02, 0.5, 0.6, 0.7, -0.15, 0.15]].map(function (b) { var m = k.blocco(b[0], b[1], b[2], b[3], b[4], b[5], mGu, true); trav.add(m); return { m: m, y0: m.position.y, z0: m.position.z }; });

  var cL = new T.Color(0xd8b98a), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var g1 = fase === 1 ? e : 1;
    guance.forEach(function (g, i) { g.m.visible = g1 < 1; g.m.position.y = g.y0 - 2.0 * g1; g.m.position.z = g.z0 + (i === 0 ? -0.6 : i === 1 ? 0.6 : 0) * g1; mGu.opacity = 1 - g1; });
    var g2 = fase < 2 ? 0 : fase === 2 ? e : 1;
    tappo.visible = g2 < 1; tappo.position.set(0.25 + 1.0 * g2, 0.1 + 2.2 * g2, 0); tappo.material.opacity = 1 - g2;
    mTen.emissiveIntensity = fase === 3 ? 0.5 * e : fase === 4 ? 0.5 * (1 - e) : 0;
    var inserito = fase === 4 ? e : 0;
    trav.position.x = 1.6 * (1 - inserito);
    var fin = fase === 4 ? Math.max(0, (t - 0.6) / 0.4) : 0;
    mR.color.copy(cL).lerp(cS, fin); mR2.color.copy(mR.color); mTen.color.copy(mR.color);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.8,
    camera: { posizione: [4, 4, 8], bersaglio: [1.2, 0, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Gamba con mortasa', ancora: su(gamba, -0.5, 1.6, 0.5) },
      { testo: 'Tenone', ancora: su(trav, 0.25, 0.6, 0.15) },
      { testo: 'Traverso', ancora: su(trav, 3.0, 0.7, 0.4) }
    ]
  };
});
