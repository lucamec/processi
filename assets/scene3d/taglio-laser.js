/* Vista 3D – Taglio laser di un modello architettonico (Thompson 2007, pp. 248–253).
 * Un percorso vettoriale per livello (incisioni, tagli interni, profilo esterno): la testa segue il percorso
 * della fase e la traccia già fatta si disegna con setDrawRange.
 * Fasi: 1 carico, 2 messa a fuoco, 3 incisione di linee, 4 tagli interni, 5 profilo esterno.
 */
Vista3D.registra('taglio-laser', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var S = 0.08, YT = S + 0.002;
  add(radice, k.blocco(-4.4, 4.4, -2.2, -1.8, -3, 3, M.macchina, true));
  add(radice, k.blocco(-3.6, 3.6, -1.8, -0.06, -2.6, 2.6, M.macchina, true));       // piano aspirato
  for (var i = -8; i <= 8; i++) add(radice, k.blocco(i * 0.42 - 0.03, i * 0.42 + 0.03, -0.06, 0, -2.5, 2.5, M.scuro, true));

  // facciata (coordinate di pianta x, z)
  var FACC = [[-2, 1.3], [2, 1.3], [2, -0.6], [0, -1.6], [-2, -0.6]];
  var FIN = [];
  for (var r = 0; r < 2; r++) for (var c = 0; c < 3; c++) FIN.push([-1.55 + c * 1.1, 0.25 - r * 0.75, 0.6, 0.45]);
  function rett(f) { return [[f[0], f[1]], [f[0] + f[2], f[1]], [f[0] + f[2], f[1] + f[3]], [f[0], f[1] + f[3]], [f[0], f[1]]]; }
  var incisioni = [[[-2, 0.0], [2, 0.0]], [[-2, 0.75], [2, 0.75]], [[-0.3, 1.3], [-0.3, 0.85], [0.3, 0.85], [0.3, 1.3]]];
  function percorso(poli) {   // concatena polilinee in punti con "salti" (spenti) fra l'una e l'altra
    var p = [];
    poli.forEach(function (pl) { pl.forEach(function (q, n) { p.push({ x: q[0], z: q[1], on: n > 0 }); }); });
    return p;
  }
  var livelli = [percorso(incisioni), percorso(FIN.map(rett)), percorso([FACC.concat([FACC[0]])])];

  // foglio intero e, dopo il taglio, foglio forato + pezzo
  var mLeg = k.nuovo(0xd8b98a, { roughness: 0.8 });
  var foglio = add(radice, k.blocco(-3.2, 3.2, 0, S, -2.2, 2.2, mLeg, true));
  function piano(pts, fori, y0, y1, mat) { var g = new T.Group(); g.rotation.x = Math.PI / 2; var m = k.estruso(pts.map(function (q) { return [q[0], q[1]]; }), fori, -y1, -y0, mat, true); g.add(m); return g; }
  var foglioForato = piano([[-3.2, -2.2], [3.2, -2.2], [3.2, 2.2], [-3.2, 2.2]], [FACC], 0, S, mLeg); radice.add(foglioForato);
  var mPz = k.nuovo(0xd8b98a, { roughness: 0.8 });
  var pezzo = piano(FACC, FIN.map(function (f) { return rett(f).slice(0, 4); }), 0, S, mPz); radice.add(pezzo);

  // tracce
  var mInc = new T.LineBasicMaterial({ color: 0x8a6a3a }), mTag = new T.LineBasicMaterial({ color: 0x1d232b });
  var tracce = livelli.map(function (lv, n) {
    var segs = [];
    for (var j = 1; j < lv.length; j++) if (lv[j].on) segs.push(new T.Vector3(lv[j - 1].x, YT, lv[j - 1].z), new T.Vector3(lv[j].x, YT, lv[j].z));
    var g = new T.BufferGeometry().setFromPoints(segs); var l = new T.LineSegments(g, n === 0 ? mInc : mTag); radice.add(l);
    return { l: l, n: segs.length };
  });
  function lunghezze(lv) { var L = [0]; for (var j = 1; j < lv.length; j++) L.push(L[j - 1] + Math.hypot(lv[j].x - lv[j - 1].x, lv[j].z - lv[j - 1].z)); return L; }
  var LL = livelli.map(lunghezze);
  function punto(n, u) {   // posizione lungo il livello n alla frazione u; restituisce anche quanti segmenti accesi sono completati
    var lv = livelli[n], L = LL[n], d = u * L[L.length - 1], j = 1, fatti = 0;
    while (j < lv.length - 1 && L[j] < d) { if (lv[j].on) fatti++; j++; }
    var a = lv[j - 1], b = lv[j], f = L[j] > L[j - 1] ? (d - L[j - 1]) / (L[j] - L[j - 1]) : 1;
    return { x: a.x + (b.x - a.x) * f, z: a.z + (b.z - a.z) * f, on: b.on, fatti: fatti };
  }

  // portale e testa
  var portale = new T.Group(); radice.add(portale);
  add(portale, k.blocco(-0.2, 0.2, 2.4, 2.8, -3.0, 3.0, M.scuro, true));
  var carr = new T.Group(); portale.add(carr);
  add(carr, k.blocco(-0.3, 0.3, 1.2, 2.4, -0.3, 0.3, M.macchina, true));
  var ugello = new T.Mesh(new T.ConeGeometry(0.18, 0.5, 20).rotateX(Math.PI), M.stampo); carr.add(ugello);
  var raggio = new T.Mesh(new T.CylinderGeometry(0.025, 0.025, 1, 8), k.nuovo(0xffffff, { emissive: k.COL.fuso, emissiveIntensity: 1.5 })); carr.add(raggio);
  var luce = new T.Mesh(new T.SphereGeometry(0.08, 12, 8), k.nuovo(0xffffff, { emissive: k.COL.fuso, emissiveIntensity: 2.5 })); radice.add(luce);

  var cS = new T.Color(k.COL.finito), cL = new T.Color(0xd8b98a);
  function aggiorna(fase, t) {
    var e = k.morbido(t), alto = fase === 1 ? 0.9 : fase === 2 ? 0.9 * (1 - e) : 0;
    tracce.forEach(function (tr, n) { var att = fase - 3; var u = n < att ? 1 : n === att ? t : 0; tr.l.geometry.setDrawRange(0, n < att ? tr.n : n === att ? punto(n, u).fatti * 2 : 0); });
    var p = { x: -2.6, z: 1.8, on: false };
    if (fase >= 3) p = punto(fase - 3, t);
    portale.position.x = p.x; carr.position.z = p.z;
    var yU = S + 0.35 + alto; ugello.position.y = yU;
    var acceso = fase >= 3 && p.on;
    raggio.visible = luce.visible = acceso;
    raggio.scale.y = 0.35; raggio.position.y = S + 0.17 + alto;
    luce.position.set(p.x, S + 0.02, p.z);
    // a fine taglio il pezzo si solleva
    var fine = fase === 5 && t > 0.92;
    foglio.visible = !fine; foglioForato.visible = pezzo.visible = fine;
    pezzo.position.y = fine ? 0.8 * (t - 0.92) / 0.08 : 0;
    mPz.color.copy(fine ? cS : cL);
    tracce.forEach(function (tr) { tr.l.visible = !fine; });
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.2,
    camera: { posizione: [4, 8, 10], bersaglio: [0, 0, 0.2] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Testa laser', ancora: su(carr, 0.3, 2.0, 0) },
      { testo: 'Piano aspirato', ancora: su(radice, -3.6, -0.6, 2.6) },
      { testo: 'Foglio di compensato', ancora: su(radice, 3.2, S, 2.2) }
    ]
  };
});
