/* Vista 3D – Incisione fotochimica di una targa in inox (Thompson 2007, pp. 392–395).
 * Fasi: 1 film, 2 esposizione UV, 3 sviluppo, 4 incisione a spruzzo, 5 colore.
 */
Vista3D.registra('incisione-fotochimica', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  add(radice, k.blocco(-4.5, 4.5, -2.0, -1.6, -2, 2, M.macchina, true));
  // rulli del nastro
  for (var i = -4; i <= 4; i++) { var rl = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 3.2, 14).rotateX(Math.PI / 2), M.scuro); rl.position.set(i, -1.48, 0); radice.add(rl); }
  var pezzo = new T.Group(); radice.add(pezzo);
  var mInox = k.nuovo(0xb8bec6, { metalness: 0.55, roughness: 0.45 });
  add(pezzo, k.blocco(-1.6, 1.6, -1.36, -1.2, -1.0, 1.0, mInox, true));
  // segni: un riquadro e tre barre (vista in pianta, estrusi verso il basso)
  var SEGNI = [[-1.3, -0.7, -0.7, 0.7], [-0.4, 1.3, 0.45, 0.65], [-0.4, 1.3, 0.05, 0.25], [-0.4, 0.8, -0.35, -0.15], [-0.4, 1.3, -0.75, -0.55]];
  var mFondo = k.nuovo(0x8a929c, { metalness: 0.3, roughness: 0.9 }), mRosso = k.nuovo(0xb8323a, { roughness: 0.5, transparent: true });
  var incavi = [], colori = [], cI = new T.Color(0xb8bec6), cF = new T.Color(0x5e646c);
  SEGNI.forEach(function (s) {
    var c = add(pezzo, k.blocco(s[0], s[1], -1.2, -1.196, s[2], s[3], mFondo, true)); incavi.push(c);
    var r = add(pezzo, k.blocco(s[0], s[1], -1.2, -1.192, s[2], s[3], mRosso, true)); colori.push(r);
  });
  // film: intero o con le aperture (una lastra per ciascuna striscia fra i segni)
  var mFilm = k.nuovo(0x4c62d9, { transparent: true, opacity: 0.55, depthWrite: false });
  var filmIntero = add(pezzo, k.blocco(-1.6, 1.6, -1.2, -1.17, -1.0, 1.0, mFilm, true));
  var filmSotto = add(pezzo, k.blocco(-1.6, 1.6, -1.39, -1.36, -1.0, 1.0, mFilm, true));
  var filmAp = new T.Group(); pezzo.add(filmAp);
  var zs = [-1.0, -0.75, -0.55, -0.35, -0.15, 0.05, 0.25, 0.45, 0.65, 1.0];
  for (var j = 0; j + 1 < zs.length; j++) {
    var z0 = zs[j], z1 = zs[j + 1], zm = (z0 + z1) / 2;
    var buchi = SEGNI.filter(function (s) { return zm > s[2] && zm < s[3]; }).map(function (s) { return [s[0], s[1]]; }).sort(function (a, b) { return a[0] - b[0]; });
    var x = -1.6;
    buchi.forEach(function (b) { if (b[0] > x) add(filmAp, k.blocco(x, b[0], -1.2, -1.17, z0, z1, mFilm, true)); x = Math.max(x, b[1]); });
    if (x < 1.6) add(filmAp, k.blocco(x, 1.6, -1.2, -1.17, z0, z1, mFilm, true));
  }
  // negativo e lampada UV
  var neg = new T.Group(); radice.add(neg);
  add(neg, k.blocco(-1.7, 1.7, -0.98, -0.96, -1.1, 1.1, k.nuovo(0x1d232b, { transparent: true, opacity: 0.35, depthWrite: false }), true));
  SEGNI.forEach(function (s) { add(neg, k.blocco(s[0], s[1], -0.955, -0.945, s[2], s[3], k.nuovo(0xffffff, { transparent: true, opacity: 0.6 }), true)); });
  var lampada = new T.Group(); radice.add(lampada);
  add(lampada, k.blocco(-2, 2, 1.2, 1.5, -1.2, 1.2, M.macchina, true));
  var luce = add(lampada, k.blocco(-1.9, 1.9, 1.15, 1.2, -1.1, 1.1, k.nuovo(0x8a6cff, { emissive: 0x6a4cff, emissiveIntensity: 0.8 }), true));
  var raggi = new T.Mesh(new T.BoxGeometry(3.6, 2.1, 2.1), k.nuovo(0x8a6cff, { transparent: true, opacity: 0.12, depthWrite: false })); raggi.position.y = 0.1; lampada.add(raggi);
  // ugelli oscillanti
  var ugelli = new T.Group(); radice.add(ugelli);
  add(ugelli, k.blocco(-2.5, 2.5, 0.6, 0.75, -0.06, 0.06, M.scuro, true));
  var getti = [];
  [-2, -1, 0, 1, 2].forEach(function (x) {
    var u = new T.Mesh(new T.CylinderGeometry(0.06, 0.1, 0.25, 12), M.stampo); u.position.set(x, 0.47, 0); ugelli.add(u);
    var g = new T.Mesh(new T.ConeGeometry(0.45, 1.6, 16, 1, true), k.nuovo(0xf06a1d, { transparent: true, opacity: 0.3, depthWrite: false, side: T.DoubleSide })); g.position.set(x, -0.45, 0); ugelli.add(g); getti.push(g);
  });
  var racla = new T.Group(); radice.add(racla);
  add(racla, k.blocco(-0.05, 0.05, -1.17, -0.6, -1.1, 1.1, M.scuro, true));
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    pezzo.position.x = fase === 4 ? -2.2 + 4.4 * t : 0;
    filmIntero.visible = fase <= 2; filmSotto.visible = fase <= 4;
    filmIntero.scale.x = fase === 1 ? Math.max(0.01, e) : 1; filmIntero.position.x = fase === 1 ? -1.6 * (1 - e) : 0;
    filmSotto.scale.x = filmIntero.scale.x; filmSotto.position.x = filmIntero.position.x;
    filmAp.visible = fase === 3 || fase === 4;
    neg.visible = fase === 2; lampada.visible = fase === 2;
    neg.position.y = fase === 2 ? 0.6 * (1 - Math.min(1, t * 4)) : 0;
    luce.material.emissiveIntensity = fase === 2 && t > 0.25 ? 0.9 : 0.05; raggi.visible = fase === 2 && t > 0.25;
    ugelli.visible = fase === 4;
    ugelli.position.z = Math.sin(t * Math.PI * 10) * 0.5;
    var d = fase < 4 ? 0 : fase === 4 ? e : 1;
    incavi.forEach(function (c) { c.visible = fase >= 3; }); mFondo.color.copy(cI).lerp(cF, 0.25 + 0.75 * d);
    var col = fase === 5 ? Math.min(1, Math.max(0, (t - 0.3) / 0.5)) : 0;
    colori.forEach(function (c) { c.visible = col > 0; }); mRosso.opacity = col;
    racla.visible = fase === 5 && t > 0.25 && t < 0.85;
    racla.position.x = -1.8 + 3.6 * Math.min(1, Math.max(0, (t - 0.25) / 0.6));
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.0,
    camera: { posizione: [3.5, 4.2, 6], bersaglio: [0, -1, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Targa in inox', ancora: su(pezzo, 1.6, -1.3, 1.0) },
      { testo: 'Film fotosensibile', ancora: su(pezzo, -1.6, -1.18, 0.8), visibile: function () { return filmIntero.visible || filmAp.visible; } },
      { testo: 'Negativo e lampada UV', ancora: su(lampada, -0.8, 1.15, 1.2), visibile: function () { return lampada.visible; } },
      { testo: 'Ugelli oscillanti, cloruro ferrico', ancora: su(ugelli, -2.5, 0.7, 0), visibile: function () { return ugelli.visible; } },
      { testo: 'Colore a racla', ancora: su(racla, 0, -0.6, 1.1), visibile: function () { return racla.visible; } }
    ]
  };
});
