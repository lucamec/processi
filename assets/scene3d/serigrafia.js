/* Vista 3D – Serigrafia di una lastra di vetro (Thompson 2007, pp. 400–403).
 * Fasi: 1 stencil, 2 carico, 3 stampa con la racla, 4 scarico e asciugatura.
 */
Vista3D.registra('serigrafia', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  add(radice, k.blocco(-3, 3, -0.6, -0.1, -2, 2, M.macchina, true));
  // lastra di vetro con cornice nera stampata a colonne (finestra centrale libera)
  var pezzo = new T.Group(); radice.add(pezzo);
  add(pezzo, k.blocco(-1.5, 1.5, -0.1, -0.02, -1, 1, k.nuovo(0xcfe3ea, { transparent: true, opacity: 0.6, roughness: 0.05 }), true));
  var mInk = k.nuovo(0x1d232b, { roughness: 0.3 }), colonne = [];
  for (var c = 0; c < 12; c++) {
    var x0 = -1.5 + c * 0.25, x1 = x0 + 0.25, g = new T.Group(); pezzo.add(g);
    add(g, k.blocco(x0, x1, -0.02, -0.005, 0.5, 1, mInk, true)); add(g, k.blocco(x0, x1, -0.02, -0.005, -1, -0.5, mInk, true));
    if (x1 <= -1.0 + 1e-6 || x0 >= 1.0 - 1e-6) add(g, k.blocco(x0, x1, -0.02, -0.005, -0.5, 0.5, mInk, true));
    colonne.push({ g: g, x: (x0 + x1) / 2 });
  }
  // telaio con rete e stencil
  var telaio = new T.Group(); radice.add(telaio);
  var mT = M.macchina;
  add(telaio, k.blocco(-2.2, 2.2, 0.05, 0.25, 1.3, 1.5, mT, true)); add(telaio, k.blocco(-2.2, 2.2, 0.05, 0.25, -1.5, -1.3, mT, true));
  add(telaio, k.blocco(-2.2, -2.0, 0.05, 0.25, -1.3, 1.3, mT, true)); add(telaio, k.blocco(2.0, 2.2, 0.05, 0.25, -1.3, 1.3, mT, true));
  add(telaio, k.blocco(-2.0, 2.0, 0.05, 0.06, -1.3, 1.3, k.nuovo(0xe8ecef, { transparent: true, opacity: 0.35, depthWrite: false }), true));
  var mEm = k.nuovo(0x4c62d9, { transparent: true, opacity: 0.75 }), stencil = new T.Group(); telaio.add(stencil);
  add(stencil, k.blocco(-1.0, 1.0, 0.06, 0.07, -0.5, 0.5, mEm, true));
  add(stencil, k.blocco(-2.0, 2.0, 0.06, 0.07, 1.0, 1.3, mEm, true)); add(stencil, k.blocco(-2.0, 2.0, 0.06, 0.07, -1.3, -1.0, mEm, true));
  add(stencil, k.blocco(-2.0, -1.5, 0.06, 0.07, -1.0, 1.0, mEm, true)); add(stencil, k.blocco(1.5, 2.0, 0.06, 0.07, -1.0, 1.0, mEm, true));
  // carica di inchiostro e racla
  var cordone = new T.Mesh(new T.CylinderGeometry(0.09, 0.09, 2.2, 16).rotateX(Math.PI / 2), mInk); radice.add(cordone);
  var racla = new T.Group(); radice.add(racla);
  add(racla, k.blocco(-0.06, 0.06, 0.12, 0.45, -1.2, 1.2, k.nuovo(0x2f6f9a, { roughness: 0.7 }), true));
  add(racla, k.blocco(-0.12, 0.12, 0.45, 0.8, -1.2, 1.2, M.stampo, true));
  // lampada UV per lo stencil
  var uv = new T.Mesh(new T.BoxGeometry(4.2, 0.08, 2.8), k.nuovo(0x8a6cff, { emissive: 0x6a4cff, emissiveIntensity: 0.8, transparent: true, opacity: 0.6 })); uv.position.y = 1.6; radice.add(uv);
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    uv.visible = fase === 1 && t > 0.2 && t < 0.8;
    mEm.opacity = fase === 1 ? 0.2 + 0.55 * Math.min(1, t * 1.4) : 0.75;
    telaio.position.y = fase === 1 ? 0.9 : fase === 2 ? 0.9 * (1 - e) : fase === 3 ? 0 : 0.9 * e;
    pezzo.position.x = fase === 1 ? -6 : fase === 2 ? -6 * (1 - e) : fase === 4 ? 6 * Math.max(0, (t - 0.35) / 0.65) : 0;
    var xr = fase === 3 ? -1.8 + 3.6 * e : fase === 4 ? 1.8 : -1.8;
    racla.visible = fase >= 2; racla.position.set(xr, telaio.position.y, 0); racla.rotation.z = fase === 3 ? -0.2 : 0;
    cordone.visible = fase === 2 ? t > 0.5 : fase === 3; cordone.position.set(xr + 0.25, telaio.position.y + 0.16, 0);
    colonne.forEach(function (o) { o.g.visible = fase === 4 || (fase === 3 && xr > o.x); });
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -0.6,
    camera: { posizione: [3.5, 5.5, 8], bersaglio: [0, 0, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Telaio con rete e stencil', ancora: su(telaio, -2.2, 0.25, 1.5) },
      { testo: 'Racla in gomma', ancora: su(racla, 0, 0.8, 1.2), visibile: function () { return racla.visible; } },
      { testo: 'Lastra di vetro', ancora: su(pezzo, 1.5, -0.06, 1), visibile: function () { return Math.abs(pezzo.position.x) < 2; } },
      { testo: 'Luce UV', ancora: su(uv, 2.1, 0, 0), visibile: function () { return uv.visible; } }
    ]
  };
});
