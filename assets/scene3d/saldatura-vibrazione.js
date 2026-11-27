/* Vista 3D – Saldatura a vibrazione lineare di un fanale (Thompson 2007, pp. 298–301).
 * Fasi: 1 carico, 2 chiusura, 3 vibrazione, 4 mantenimento, 5 apertura.
 */
Vista3D.registra('saldatura-vibrazione', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var W = 1.6, D = 0.9, YJ = 0.4;
  add(radice, k.blocco(-4, 4, -2.6, -2.2, -2.4, 2.4, M.macchina, true));
  [[-2.6, -1.6], [2.6, -1.6], [-2.6, 1.6], [2.6, 1.6]].forEach(function (p) { add(radice, k.blocco(p[0] - 0.15, p[0] + 0.15, -2.2, 3.4, p[1] - 0.15, p[1] + 0.15, M.macchina, true)); });
  // piano superiore vibrante con il guscio
  var sup = new T.Group(); radice.add(sup);
  add(sup, k.blocco(-2.4, 2.4, 2.4, 3.0, -1.4, 1.4, M.macchina, true));
  add(sup, k.blocco(-W - 0.2, W + 0.2, 1.6, 2.4, -D - 0.2, D + 0.2, k.nuovo(0x8d99a6, { transparent: true, opacity: 0.5, depthWrite: false })));
  var mG = k.nuovo(0xe9e4da, { roughness: 0.4 });
  var guscio = new T.Group(); radice.add(guscio);
  add(guscio, k.blocco(-W, W, YJ + 0.06, YJ + 1.2, -D, D, mG));
  // piano inferiore con il catarifrangente
  var inf = new T.Group(); radice.add(inf);
  add(inf, k.blocco(-2.4, 2.4, -2.2, -1.6, -1.4, 1.4, M.macchina, true));
  add(inf, k.blocco(-W - 0.2, W + 0.2, -1.6, -0.6, -D - 0.2, D + 0.2, k.nuovo(0x8d99a6, { transparent: true, opacity: 0.5, depthWrite: false })));
  var mR = k.nuovo(0xc0392b, { transparent: true, opacity: 0.85, roughness: 0.2 });
  var cat = new T.Group(); radice.add(cat);
  add(cat, k.blocco(-W, W, -0.6, YJ, -D, D, mR));
  // giunto
  var mJ = k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 0.8 });
  var giunto = new T.Group(); radice.add(giunto);
  [[0, D - 0.06, 2 * W + 0.02, 0.14], [0, -D + 0.06, 2 * W + 0.02, 0.14], [W - 0.06, 0, 0.14, 2 * D], [-W + 0.06, 0, 0.14, 2 * D]].forEach(function (b) { var m = new T.Mesh(new T.BoxGeometry(b[2], 0.07, b[3]), mJ); m.position.set(b[0], 0, b[1]); giunto.add(m); });

  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t), giu = 0.9, vib = 0, aperto = 0;
    if (fase === 1) giu = 0.9;
    if (fase === 2) giu = 0.9 * (1 - e);
    if (fase === 3 || fase === 4) giu = 0;
    if (fase === 3) vib = 0.06 * Math.sin(t * 160);
    if (fase === 5) { giu = 0; aperto = e; }
    // il piano inferiore e il catarifrangente salgono; all'apertura scende solo il piano
    inf.position.y = -giu - 0.9 * aperto; cat.position.y = fase === 5 ? 0 : -giu;
    sup.position.x = vib; guscio.position.x = vib; cat.position.x = 0;
    if (fase === 5) { sup.position.y = 0; guscio.position.y = 0; }
    giunto.visible = fase >= 3; giunto.position.set(vib / 2, YJ + 0.03 - (fase === 2 ? giu : 0), 0);
    mJ.color.copy(cF).lerp(cS, fase === 5 ? e : fase === 4 ? e * 0.3 : 0); mJ.emissiveIntensity = fase === 3 ? 0.8 : fase === 4 ? 0.8 * (1 - e) : 0;
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.6,
    camera: { posizione: [6, 5, 12], bersaglio: [0, 0.3, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Piano superiore vibrante', ancora: su(sup, -2.4, 2.7, 1.4) },
      { testo: 'Guscio del fanale', ancora: su(guscio, -W, YJ + 1.0, D) },
      { testo: 'Catarifrangente', ancora: su(cat, -W, -0.3, D) },
      { testo: 'Piano inferiore', ancora: su(inf, 2.4, -1.9, 1.4) }
    ]
  };
});
