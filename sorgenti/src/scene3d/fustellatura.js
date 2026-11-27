/* Vista 3D – Fustellatura piana della rete di una scatola (Thompson 2007, pp. 266–271).
 * Le lame sono parallelepipedi lungo i lati della rete; dopo il taglio il foglio pieno è sostituito dal foglio
 * forato e dalla rete, i cui quattro lembi ruotano attorno alle linee di cordonatura.
 * Fasi: 1 carico, 2 taglio, 3 espulsione, 4 separazione.
 */
Vista3D.registra('fustellatura', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var S = 0.06, A = 0.8, B = 0.5, F = 0.7, YD = 1.6;
  var RETE = [[-A, -B - F], [A, -B - F], [A, -B], [A + F, -B], [A + F, B], [A, B], [A, B + F], [-A, B + F], [-A, B], [-A - F, B], [-A - F, -B], [-A, -B]];
  var PIEGHE = [[[-A, -B], [A, -B]], [[A, -B], [A, B]], [[A, B], [-A, B]], [[-A, B], [-A, -B]]];

  add(radice, k.blocco(-4, 4, -2.4, -2.0, -3, 3, M.macchina, true));
  [[-3, -2], [3, -2], [-3, 2], [3, 2]].forEach(function (p) { add(radice, k.blocco(p[0] - 0.15, p[0] + 0.15, -2.0, YD + 0.8, p[1] - 0.15, p[1] + 0.15, M.macchina, true)); });
  // fustella: tavola di legno + lame + cuscinetti
  var fust = new T.Group(); fust.position.y = YD; radice.add(fust);
  add(fust, k.blocco(-2.6, 2.6, 0, 0.3, -2.0, 2.0, k.nuovo(0xc8a676, { roughness: 0.85, transparent: true, opacity: 0.35, depthWrite: false }), true));
  function lama(a, b, h, mat, sp) {
    var dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz);
    var m = new T.Mesh(new T.BoxGeometry(L, h, sp), mat); m.position.set((a[0] + b[0]) / 2, -h / 2, (a[1] + b[1]) / 2); m.rotation.y = -Math.atan2(dz, dx); return m;
  }
  RETE.forEach(function (p, i) { fust.add(lama(p, RETE[(i + 1) % RETE.length], 0.16, M.scuro, 0.025)); });
  PIEGHE.forEach(function (s) { fust.add(lama(s[0], s[1], 0.12, M.stampo, 0.05)); });
  var mGom = k.nuovo(0xe98fa0, { roughness: 0.9 });
  var cusc = new T.Group(); fust.add(cusc);
  RETE.forEach(function (p, i) { var q = RETE[(i + 1) % RETE.length]; var m = lama(p, q, 0.18, mGom, 0.14); var nx = -(q[1] - p[1]), nz = q[0] - p[0], L = Math.hypot(nx, nz); m.position.x += 0.1 * nx / L; m.position.z += 0.1 * nz / L; m.scale.x = 0.8; cusc.add(m); });

  // piano di taglio e foglio
  var piano = new T.Group(); radice.add(piano);
  add(piano, k.blocco(-2.6, 2.6, -0.3, 0, -2.0, 2.0, M.stampo, true));
  var mCart = k.nuovo(0xcfb37a, { roughness: 0.9, side: T.DoubleSide });
  function pianta(pts, fori, mat) { var g = new T.Group(); g.rotation.x = Math.PI / 2; g.add(k.estruso(pts, fori, -S, 0, mat, true)); return g; }
  var FOGLIO = [[-2.4, -1.8], [2.4, -1.8], [2.4, 1.8], [-2.4, 1.8]];
  var pieno = pianta(FOGLIO, null, mCart); piano.add(pieno);
  var forato = pianta(FOGLIO, [RETE.slice().reverse()], mCart); piano.add(forato);
  // rete: fondo + 4 lembi incernierati
  var mRete = k.nuovo(0xcfb37a, { roughness: 0.9, side: T.DoubleSide });
  var rete = new T.Group(); piano.add(rete);
  rete.add(pianta([[-A, -B], [A, -B], [A, B], [-A, B]], null, mRete));
  var lembi = [
    { asse: 'x', s: 1, pts: [[-A, -F], [A, -F], [A, 0], [-A, 0]], piv: [0, -B] },
    { asse: 'x', s: -1, pts: [[-A, 0], [A, 0], [A, F], [-A, F]], piv: [0, B] },
    { asse: 'z', s: 1, pts: [[0, -B], [F, -B], [F, B], [0, B]], piv: [A, 0] },
    { asse: 'z', s: -1, pts: [[-F, -B], [0, -B], [0, B], [-F, B]], piv: [-A, 0] }
  ].map(function (l) { var g = new T.Group(); g.position.set(l.piv[0], 0, l.piv[1]); g.add(pianta(l.pts, null, mRete)); rete.add(g); l.g = g; return l; });
  // segni di taglio e cordonatura sul foglio
  var segni = new T.Group(); piano.add(segni);
  var pts = []; RETE.forEach(function (p, i) { var q = RETE[(i + 1) % RETE.length]; pts.push(new T.Vector3(p[0], 0.002, p[1]), new T.Vector3(q[0], 0.002, q[1])); });
  segni.add(new T.LineSegments(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: 0x1d232b })));

  var cC = new T.Color(0xcfb37a), cS = new T.Color(k.COL.finito), contatto = YD - 0.16;
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var yP = fase === 1 ? -0.6 + 0.6 * e : fase === 2 ? contatto * Math.sin(Math.PI / 2 * Math.min(1, t * 1.5)) : fase === 3 ? contatto * (1 - e) : 0;
    piano.position.y = yP;
    var tagliato = (fase === 2 && t > 0.66) || fase >= 3;
    pieno.visible = !tagliato; forato.visible = rete.visible = segni.visible = tagliato;
    if (fase === 4) segni.visible = false;
    cusc.scale.y = fase === 2 && t > 0.5 ? 0.6 : 1;
    // separazione e piegatura
    var su = fase === 4 ? e : 0;
    rete.position.set(0, 0.5 * su, 0);
    fust.position.y = YD + (fase === 4 ? 1.6 * e : 0);
    var ang = (Math.PI / 2) * (fase === 4 ? Math.max(0, (t - 0.3) / 0.7) : 0);
    lembi.forEach(function (l) { l.g.rotation.set(0, 0, 0); if (l.asse === 'x') l.g.rotation.x = l.s * ang; else l.g.rotation.z = l.s * ang; });
    mRete.color.copy(cC).lerp(cS, su);
    piano.position.x = fase === 1 ? -3 * (1 - e) : 0;
  }
  function su2(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.4,
    camera: { posizione: [4.5, 6, 9], bersaglio: [0, 0.6, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Fustella in legno con lame', ancora: su2(fust, -2.6, 0.3, 2.0) },
      { testo: 'Piano di taglio', ancora: su2(piano, 2.6, -0.2, 2.0) },
      { testo: 'Rete della scatola', ancora: su2(rete, A, 0.1, B), visibile: function () { return rete.visible; } }
    ]
  };
});
