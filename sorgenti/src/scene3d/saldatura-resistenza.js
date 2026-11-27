/* Vista 3D – Saldatura a punti di due lamiere (Thompson 2007, pp. 308–311).
 * Le lamiere avanzano sotto la pinza fissa; nella fase 3 si fanno quattro punti in fila.
 * Fasi: 1 carico, 2 serraggio, 3 corrente (quattro punti), 4 rilascio.
 */
Vista3D.registra('saldatura-resistenza', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var S = 0.1, PUNTI = [-1.2, -0.4, 0.4, 1.2];
  add(radice, k.blocco(-4, 4, -2.4, -2.0, -2.4, 2.4, M.macchina, true));
  // pinza a C
  add(radice, k.blocco(-0.3, 0.3, -2.0, 3.0, -2.2, -1.8, M.macchina, true));
  add(radice, k.blocco(-0.3, 0.3, 2.4, 3.0, -1.8, 0.2, M.macchina, true));
  add(radice, k.blocco(-0.3, 0.3, -1.6, -1.0, -1.8, 0.2, M.macchina, true));
  var mCu = k.nuovo(0xc27a4a, { metalness: 0.6, roughness: 0.35 });
  var eSup = new T.Group(); radice.add(eSup);
  eSup.add(k.torneroY([[0, 0], [0.12, 0], [0.25, 0.3], [0.25, 2.4], [0, 2.4]], mCu, 32, true));
  var eInf = new T.Group(); radice.add(eInf);
  eInf.add(k.torneroY([[0, 0], [0.12, 0], [0.25, -0.3], [0.25, -1.0], [0, -1.0]], mCu, 32, true));
  // lamiere
  var lam = new T.Group(); radice.add(lam);
  var mL = k.nuovo(0x9aa6b2, { metalness: 0.55, roughness: 0.4 });
  add(lam, k.blocco(-2.0, 2.0, S, 2 * S, -1.2, 0.3, mL, true));
  add(lam, k.blocco(-2.0, 2.0, 0, S, -0.3, 1.2, mL, true));
  var noccioli = PUNTI.map(function (x) {
    var m = new T.Mesh(new T.SphereGeometry(0.2, 20, 12), k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 1 })); m.scale.set(1, 0.35, 1); m.position.set(x, S, 0); lam.add(m);
    var segno = new T.Mesh(new T.CircleGeometry(0.16, 24).rotateX(-Math.PI / 2), m.material); segno.position.set(x, 2 * S + 0.004, 0); lam.add(segno); m.userData.segno = segno; return m;
  });

  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t), lx = 0, ap = 0.6, corrente = -1, fatti = 0;
    if (fase === 1) { lx = 3.5 * (1 - e) - PUNTI[0]; ap = 0.6; }
    if (fase === 2) { lx = -PUNTI[0]; ap = 0.6 * (1 - e); }
    if (fase === 3) {
      var u = t * 4, n = Math.min(3, Math.floor(u)), f = u - n;
      var da = PUNTI[Math.max(0, n - 1)], a = PUNTI[n], m = n === 0 ? 1 : Math.min(1, f / 0.3);
      lx = -(da + (a - da) * k.morbido(m));
      ap = n === 0 ? (f > 0.75 ? (f - 0.75) * 2 : 0) : f < 0.3 ? 0.4 * Math.sin(Math.PI * f / 0.3) : (f > 0.75 ? (f - 0.75) * 2 : 0);
      if (f > 0.35 && f < 0.75) corrente = n;
      fatti = n + (f >= 0.35 ? 1 : 0);
    }
    if (fase === 4) { lx = -PUNTI[3]; ap = 0.6 * e; fatti = 4; }
    lam.position.x = lx;
    eSup.position.y = 2 * S + ap; eInf.position.y = -ap;
    noccioli.forEach(function (m, i) {
      m.visible = m.userData.segno.visible = i < fatti;
      var caldo = i === corrente;
      m.material.emissiveIntensity = caldo ? 1.5 : 0;
      m.material.color.copy(caldo ? cF : cS);
    });
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.4,
    camera: { posizione: [4, 4, 7], bersaglio: [0, 0.3, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Elettrodo (+)', ancora: su(eSup, 0.25, 1.2, 0) },
      { testo: 'Elettrodo (−)', ancora: su(eInf, 0.25, -0.5, 0) },
      { testo: 'Lamiere sovrapposte', ancora: su(lam, -2.0, 2 * S, 0.3) }
    ]
  };
});
