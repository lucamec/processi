/* Vista 3D – Punzonatura di una lamiera (Thompson 2007, pp. 260–265).
 * La lamiera ha già tutti i fori; un tappo per foro viene nascosto al colpo del punzone. A ogni colpo la
 * lamiera si sposta per portare il foro successivo sotto il punzone (fisso in x, z).
 * Fasi: 1 carico, 2 bloccaggio, 3 punzonatura, 4 ritorno ed espulsione, 5 sbavatura.
 */
Vista3D.registra('punzonatura-tranciatura', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var S = 0.08, R = 0.2;
  add(radice, k.blocco(-5, 5, -2.6, -2.2, -3, 3, M.macchina, true));
  // telaio a C
  add(radice, k.blocco(-0.8, 0.8, -2.2, -0.7, -2.6, -1.6, M.macchina, true));
  add(radice, k.blocco(-0.8, 0.8, -0.7, 3.2, -2.6, -1.9, M.macchina, true));
  add(radice, k.blocco(-0.8, 0.8, 2.4, 3.2, -1.9, 0.6, M.macchina, true));
  // banco a rulli
  for (var i = -9; i <= 9; i++) { if (Math.abs(i) < 2) continue; var g = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 3.2, 12).rotateX(Math.PI / 2), M.stampo); g.position.set(i * 0.42, -0.07, 0); radice.add(g); }
  // matrice (anello con gioco)
  radice.add(k.torneroY([[R + 0.03, -0.7], [0.7, -0.7], [0.7, -0.01], [R + 0.03, -0.01]], M.stampo, 40));

  // lamiera con fori + tappi
  var FORI = [];
  for (var a = 0; a < 4; a++) for (var b = 0; b < 3; b++) FORI.push([-1.05 + a * 0.7, -0.7 + b * 0.7]);
  function cerchio(cx, cz) { var p = []; for (var j = 0; j < 24; j++) { var t = -j / 24 * Math.PI * 2; p.push([cx + R * Math.cos(t), cz + R * Math.sin(t)]); } return p; }
  var lam = new T.Group(); radice.add(lam);
  var mL = k.nuovo(0xb9c2cc, { metalness: 0.55, roughness: 0.35 });
  var piano = new T.Group(); piano.rotation.x = Math.PI / 2; lam.add(piano);
  piano.add(k.estruso([[-2, -1.4], [2, -1.4], [2, 1.4], [-2, 1.4]], FORI.map(function (f) { return cerchio(f[0], f[1]); }), -S, 0, mL, true));
  var tappi = FORI.map(function (f) { var m = new T.Mesh(new T.CylinderGeometry(R, R, S, 24), mL); m.position.set(f[0], S / 2, f[1]); lam.add(m); return m; });
  var sfrido = new T.Mesh(new T.CylinderGeometry(R, R, S, 24), mL); radice.add(sfrido);

  // premilamiera e punzone
  var prem = k.torneroY([[R + 0.02, 0], [0.55, 0], [0.55, 0.18], [R + 0.02, 0.18]], k.nuovo(k.COL.fuso), 40, true); radice.add(prem);
  var punz = new T.Group(); radice.add(punz);
  var stelo = new T.Mesh(new T.CylinderGeometry(R, R, 2.0, 32), M.scuro); stelo.position.y = 1.0; punz.add(stelo);
  var testa = new T.Mesh(new T.CylinderGeometry(0.4, 0.4, 0.4, 32), M.macchina); testa.position.y = 2.1; punz.add(testa);
  // spazzola di sbavatura
  var spaz = new T.Mesh(new T.CylinderGeometry(0.5, 0.5, 0.3, 32), k.nuovo(0x8a8f96, { roughness: 0.9 })); radice.add(spaz);

  var cL = new T.Color(0xb9c2cc), cS = new T.Color(k.COL.finito), N = FORI.length;
  function aggiorna(fase, t) {
    var e = k.morbido(t), lx = 0, lz = 0, yP = 1.0, yPr = 0.6, fatti = 0, colpo = -1, yS = -9;
    if (fase === 1) { lx = -6 + 6 * e - FORI[0][0]; lz = -FORI[0][1]; }
    else if (fase === 2) { lx = -FORI[0][0]; lz = -FORI[0][1]; yPr = 0.6 - (0.6 - S) * e; }
    else if (fase === 3) {
      var u = t * N, n = Math.min(N - 1, Math.floor(u)), f = u - n, prev = Math.max(0, n - 1);
      var m = n === 0 ? 1 : Math.min(1, f / 0.35), mm = k.morbido(m);
      lx = -(FORI[prev][0] + (FORI[n][0] - FORI[prev][0]) * mm); lz = -(FORI[prev][1] + (FORI[n][1] - FORI[prev][1]) * mm);
      var c = f < 0.35 ? 0 : Math.sin(Math.PI * Math.min(1, (f - 0.35) / 0.5));
      yP = 1.0 - (1.0 + 0.05) * c; yPr = S;
      fatti = n + (f > 0.6 ? 1 : 0); colpo = f > 0.6 ? n : -1;
      if (f > 0.6) yS = -0.1 - 2.5 * (f - 0.6);
    } else { fatti = N; lx = -FORI[N - 1][0] + (fase === 4 ? 6 * e : 6); lz = -FORI[N - 1][1]; yPr = fase === 4 ? S + (0.6 - S) * e : 0.6; }
    lam.position.set(lx, 0, lz);
    tappi.forEach(function (p, j) { p.visible = j >= fatti; });
    punz.position.y = yP; prem.position.y = yPr;
    sfrido.visible = yS > -2; sfrido.position.set(0, yS, 0);
    spaz.visible = fase === 5; spaz.position.set(lx - 1.8 + 3.6 * t, S + 0.2, lz); spaz.rotation.y = t * 30;
    mL.color.copy(cL).lerp(cS, fase === 5 ? e : 0);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.6,
    camera: { posizione: [5, 5.5, 9], bersaglio: [0, 0.3, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Punzone', ancora: su(punz, 0.4, 2.1, 0) },
      { testo: 'Premilamiera', ancora: su(prem, 0.55, 0.18, 0.3) },
      { testo: 'Matrice', ancora: su(radice, 0.7, -0.5, 0.4) },
      { testo: 'Lamiera', ancora: su(lam, -2, 0.1, 1.4) }
    ]
  };
});
