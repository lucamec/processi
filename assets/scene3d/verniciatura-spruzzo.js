/* Vista 3D – Verniciatura a spruzzo di un pannello (Thompson 2007, pp. 350–355).
 * Ogni mano è una serie di strisce orizzontali rivelate da un piano di taglio che segue la pistola,
 * con passate a serpentina.
 * Fasi: 1 preparazione, 2 primer, 3 carteggiatura, 4 finitura, 5 essiccazione.
 */
Vista3D.registra('verniciatura-spruzzo', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var LX = 2.2, NR = 6, HR = 0.42, Y0 = -0.4;
  add(radice, k.blocco(-4, 4, -2.4, -2.0, -2.6, 2.6, M.macchina, true));
  add(radice, k.blocco(-0.15, 0.15, -2.0, Y0, -0.4, -0.2, M.scuro, true));
  // pannello di supporto (stuccato)
  add(radice, k.blocco(-LX, LX, Y0, Y0 + NR * HR, -0.2, 0, k.nuovo(0xd8d2c4, { roughness: 0.8 }), true));
  function mano(col, z, righe) {
    return righe.map(function (r) {
      var mat = k.nuovo(col, { roughness: 0.5, side: T.DoubleSide }), piano = new T.Plane(new T.Vector3(-1, 0, 0), -LX);
      mat.clippingPlanes = [piano];
      var m = new T.Mesh(new T.PlaneGeometry(2 * LX, HR + 0.01), mat); m.position.set(0, Y0 + HR * (r + 0.5), z); radice.add(m);
      return { m: m, mat: mat, piano: piano, r: r };
    });
  }
  var tutte = [0, 1, 2, 3, 4, 5];
  var primer = mano(0xb8bec6, 0.005, tutte);
  var fin = mano(k.COL.finito, 0.01, [0, 1, 2, 3, 4]);
  var nastro = new T.Mesh(new T.BoxGeometry(2 * LX + 0.04, HR + 0.02, 0.02), k.nuovo(0x5b8fd1, { roughness: 0.8 })); nastro.position.set(0, Y0 + HR * 5.5, 0.02); radice.add(nastro);
  // pistola con nuvola
  var pist = new T.Group(); radice.add(pist);
  add(pist, k.blocco(-0.12, 0.12, -0.1, 0.2, 0.9, 1.4, M.stampo, true));
  add(pist, k.blocco(-0.06, 0.06, -0.6, -0.1, 1.15, 1.3, M.scuro, true));
  add(pist, k.blocco(-0.1, 0.1, 0.2, 0.5, 1.05, 1.3, M.stampo, true));
  var nube = new T.Mesh(new T.ConeGeometry(0.45, 0.9, 24, 1, true), k.nuovo(k.COL.fuso, { transparent: true, opacity: 0.25, depthWrite: false, side: T.DoubleSide }));
  nube.rotation.x = Math.PI / 2; nube.scale.set(1.6, 1, 0.6); nube.position.z = 0.45; pist.add(nube);
  var tampone = new T.Mesh(new T.BoxGeometry(0.5, 0.3, 0.15), k.nuovo(0xcfb37a)); radice.add(tampone);

  function passata(strisce, t, righe) {   // restituisce la posizione della pistola
    var n = righe.length, u = t * n, i = Math.min(n - 1, Math.floor(u)), f = u - i, dx = i % 2 === 0;
    strisce.forEach(function (s, j) {
      if (j < i) { s.piano.normal.set(-1, 0, 0); s.piano.constant = 10; }
      else if (j > i) { s.piano.normal.set(-1, 0, 0); s.piano.constant = -10; }
      else if (dx) { s.piano.normal.set(-1, 0, 0); s.piano.constant = -LX + 2 * LX * f; }
      else { s.piano.normal.set(1, 0, 0); s.piano.constant = -(LX - 2 * LX * f); }
    });
    var x = dx ? -LX + 2 * LX * f : LX - 2 * LX * f;
    return [x, Y0 + HR * (righe[i] + 0.5)];
  }
  function tutto(strisce, v) { strisce.forEach(function (s) { s.piano.normal.set(-1, 0, 0); s.piano.constant = v ? 10 : -10; }); }
  function aggiorna(fase, t) {
    var e = k.morbido(t), p = null;
    nastro.visible = fase <= 4 && !(fase === 5 && t > 0.2);
    if (fase === 1) { tutto(primer, false); tutto(fin, false); nastro.position.z = 0.02 + 1.0 * (1 - e); }
    else nastro.position.z = 0.02;
    if (fase === 2) { p = passata(primer, t, tutte); tutto(fin, false); }
    if (fase >= 3) tutto(primer, true);
    if (fase === 3) tutto(fin, false);
    if (fase === 4) p = passata(fin, t, [0, 1, 2, 3, 4]);
    if (fase === 5) { tutto(fin, true); nastro.visible = t < 0.3; nastro.position.z = 0.02 + 1.5 * Math.min(1, t / 0.3); }
    pist.visible = !!p; nube.visible = !!p;
    if (p) pist.position.set(p[0], p[1], 0);
    primer.forEach(function (s) { s.mat.roughness = fase >= 3 ? 0.3 + 0.4 * (fase === 3 ? 1 - e : 0) : 0.7; });
    tampone.visible = fase === 3;
    var r = Math.min(NR - 1, Math.floor(t * NR)), f = t * NR - r;
    tampone.position.set(-LX + 0.3 + (2 * LX - 0.6) * (r % 2 ? 1 - f : f), Y0 + HR * (r + 0.5), 0.1);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.4,
    camera: { posizione: [3.5, 2.5, 7], bersaglio: [0, 0.8, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Pistola a spruzzo', ancora: su(pist, 0.12, 0.5, 1.3), visibile: function () { return pist.visible; } },
      { testo: 'Mascheratura', ancora: su(nastro, LX, 0.2, 0), visibile: function () { return nastro.visible; } },
      { testo: 'Pannello', ancora: su(radice, -LX, Y0 + 0.2, 0) }
    ]
  };
});
