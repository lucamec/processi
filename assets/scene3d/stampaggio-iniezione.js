/* Vista 3D – Stampaggio a iniezione (Thompson 2007, pp. 50–51).
 * Stesse proporzioni dello schema 2D: 1 unità = 40 px dello schema. Asse X lungo la macchina, Y in alto.
 * Fasi: 1 plastificazione, 2 chiusura, 3 iniezione, 4 mantenimento e raffreddamento, 5 apertura ed estrazione.
 */
Vista3D.registra('stampaggio-iniezione', function (T, k) {
  'use strict';
  var radice = new T.Group();
  var M = k.mat;
  var fuso = k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 0.25, roughness: 0.4 });
  var finito = k.nuovo(k.COL.finito, { roughness: 0.45 });
  var add = function (g, o) { if (o) g.add(o); return o; };

  // Basamento
  add(radice, k.blocco(-10.2, 9.2, -3.25, -2.85, -2.6, 2.6, M.macchina, true));

  // Cilindro (sezione tubolare) e fasce riscaldanti
  add(radice, k.tornito([[0.3, -10.3], [0.75, -10.3], [0.75, 0], [0.3, 0]], M.stampo));
  var fasce = [];
  [-6.6, -4.6, -2.6].forEach(function (x) {
    var mat = k.nuovo(k.COL.scuro, { emissive: k.COL.fuso, emissiveIntensity: 0.15 });
    fasce.push(mat);
    add(radice, k.tornito([[0.75, x], [0.92, x], [0.92, x + 1.1], [0.75, x + 1.1]], mat));
  });
  // supporti
  add(radice, k.blocco(-9.4, -8.6, -2.85, -0.75, -0.6, 0.6, M.macchina, true));
  add(radice, k.blocco(-1.6, -0.8, -2.85, -0.75, -0.6, 0.6, M.macchina, true));

  // Tramoggia con granuli
  add(radice, k.tornito([[0.95, 3.1], [1.05, 3.1], [0.38, 0.8], [0.28, 0.8]].map(function (p) { return [p[0], p[1]]; }), M.macchina));
  var tram = radice.children[radice.children.length - 1];
  tram.rotation.z = Math.PI / 2; tram.position.set(-8.5, 0, 0);
  var rnd = k.rng(7), granuli = new T.InstancedMesh(new T.SphereGeometry(0.13, 10, 8), M.grezzo, 70), mtx = new T.Matrix4();
  for (var i = 0; i < 70; i++) {
    var yy = 0.95 + rnd() * 2.0, rr = (0.3 + (yy - 0.8) * 0.28) * Math.sqrt(rnd()), a = rnd() * Math.PI * 2;
    var zz = rr * Math.cos(a); if (k.taglio) zz = -Math.abs(zz);
    mtx.makeTranslation(-8.5 + rr * Math.sin(a), yy, zz);
    granuli.setMatrixAt(i, mtx);
  }
  granuli.castShadow = true;
  radice.add(granuli);

  // Vite di Archimede: albero, filetto elicoidale, punta. Ruota in fase 1, avanza come pistone in fase 3.
  var vite = new T.Group();
  add(vite, k.cilindroX(-11.4, -0.9, 0.11, M.stampo));
  var elica = new T.Curve();
  elica.getPoint = function (u, out) { var x = -9.6 + u * 8.6, an = (x / 0.5) * Math.PI * 2; return (out || new T.Vector3()).set(x, 0.19 * Math.sin(an), 0.19 * Math.cos(an)); };
  var filetto = new T.Mesh(new T.TubeGeometry(elica, 600, 0.075, 8, false), k.nuovo(0x76828f, { metalness: 0.4, roughness: 0.4 }));
  filetto.castShadow = true;
  vite.add(filetto);
  var punta = new T.Mesh(new T.ConeGeometry(0.28, 0.9, 32).rotateZ(-Math.PI / 2), M.stampo);
  punta.position.x = -0.55; vite.add(punta);
  radice.add(vite);
  var tVite = k.traccia([-1, -1, 0, 0, 0]);
  var tGiro = k.traccia([4, 4, 4, 4, 4], 0);

  // Accumulo di fuso davanti alla vite
  var pozza = new T.Mesh(new T.CylinderGeometry(0.29, 0.29, 1, 24).rotateZ(Math.PI / 2).translate(-0.5, 0, 0), fuso);
  radice.add(pozza);
  var tPozza = k.traccia([1.05, 1.05, 0.02, 0.02, 0.02]);

  // Ugello
  add(radice, k.tornito([[0.1, 0], [0.55, 0], [0.32, 0.75], [0.1, 0.75]], M.stampo));
  add(radice, k.cilindroX(0, 0.75, 0.09, fuso));

  // Semistampo fisso (con canale di colata)
  var S = 2.25;
  [k.blocco(0.75, 1.875, 0.1, S, -S, S, M.stampo), k.blocco(0.75, 1.875, -S, -0.1, -S, S, M.stampo),
   k.blocco(0.75, 1.875, -0.1, 0.1, -S, -0.1, M.stampo), k.blocco(0.75, 1.875, -0.1, 0.1, 0.1, S, M.stampo)].forEach(function (b) { add(radice, b); });
  add(radice, k.blocco(0.45, 0.75, -2.85, 2.75, -2.7, 2.7, M.macchina)); // piano fisso

  // Gruppo mobile: semistampo mobile, piano, stelo di chiusura, estrattori, canali di raffreddamento
  var mobile = new T.Group();
  var X0 = 1.875, X1 = 2.175, X2 = 4.25, X3 = 5.25, Ro = 1.5, Ri = 1.2;
  [k.blocco(X2, X3, -S, S, -S, S, M.stampo),
   k.blocco(X1, X2, -Ri, Ri, -Ri, Ri, M.stampo),
   k.blocco(X0, X2, Ro, S, -S, S, M.stampo), k.blocco(X0, X2, -S, -Ro, -S, S, M.stampo),
   k.blocco(X0, X2, -Ro, Ro, -S, -Ro, M.stampo), k.blocco(X0, X2, -Ro, Ro, Ro, S, M.stampo)].forEach(function (b) { add(mobile, b); });
  add(mobile, k.blocco(X3, X3 + 0.5, -2.85, 2.75, -2.7, 2.7, M.macchina));
  add(mobile, k.cilindroX(X3 + 0.5, 8.3, 0.32, M.macchina));
  var estrattori = new T.Group();
  [1.35, -1.35].forEach(function (y) { var p = k.cilindroX(X2, X3 + 0.02, 0.09, M.scuro); p.position.y = y; p.position.z = -0.7; estrattori.add(p); });
  mobile.add(estrattori);
  var raffr = k.nuovo(k.COL.flusso, { emissive: k.COL.flusso, emissiveIntensity: 0 });
  [[2.8, 1.9], [2.8, -1.9], [3.6, 0]].forEach(function (c) {
    var g = new T.CylinderGeometry(0.12, 0.12, k.taglio ? S : 2 * S, 16).rotateX(Math.PI / 2);
    var m = new T.Mesh(g, raffr); m.position.set(c[0], c[1], k.taglio ? -S / 2 + 0.01 : 0); mobile.add(m);
  });
  radice.add(mobile);
  var tMobile = k.traccia([2.75, 0, 0, 0, 2.75]);
  var tEstr = k.traccia([0, 0, 0, 0, -2.5], 0);

  // Pezzo: vaschetta (fondo + 4 pareti), riempita progressivamente dal punto di iniezione
  var pezzo = new T.Group();
  var piano = new T.Plane(new T.Vector3(-1, 0, 0), 0);
  fuso.clippingPlanes = [];
  var fusoPezzo = fuso.clone(); fusoPezzo.clippingPlanes = [piano];
  var parti = [[X0, X1, -Ro, Ro, -Ro, Ro], [X1, X2, Ri, Ro, -Ro, Ro], [X1, X2, -Ro, -Ri, -Ro, Ro], [X1, X2, -Ri, Ri, -Ro, -Ri], [X1, X2, -Ri, Ri, Ri, Ro]];
  var mPezzoF = [], mPezzoS = [];
  parti.forEach(function (p) {
    var a = k.blocco(p[0], p[1], p[2], p[3], p[4], p[5], fusoPezzo, false, fusoPezzo); if (a) { pezzo.add(a); mPezzoF.push(a); }
    var b = k.blocco(p[0], p[1], p[2], p[3], p[4], p[5], finito, false, finito); if (b) { pezzo.add(b); mPezzoS.push(b); }
  });
  var materozza = k.blocco(0.75, X0, -0.1, 0.1, -0.1, 0.1, fusoPezzo, true);
  radice.add(materozza);
  var pezzoMob = new T.Group(); pezzoMob.add(pezzo); mobile.add(pezzoMob);
  // il pezzo sta nel gruppo mobile: si sposta indietro di quanto avanza lo stampo
  var tRiemp = k.traccia([0, 0, 1, 1, 1], 0);
  var tSolid = k.traccia([0, 0, 0, 1, 1], 0);
  var tMat = k.traccia([1, 1, 1, 1, 0], 1);
  var statoRiemp = 0;

  function aggiorna(fase, t) {
    vite.position.x = tVite(fase, t);
    vite.rotation.x = tGiro(fase, t) * Math.PI * 2;
    pozza.scale.x = tPozza(fase, t);
    fasce.forEach(function (m, i) { m.emissiveIntensity = 0.12 + (fase === 1 ? 0.25 + 0.1 * Math.sin(t * 12 + i) : 0); });
    mobile.position.x = tMobile(fase, t);
    estrattori.position.x = tEstr(fase, t);
    pezzoMob.position.x = tEstr(fase, t);
    // riempimento: piano di taglio che avanza da 0,75 a 4,3 lungo X
    var r = tRiemp(fase, t);
    statoRiemp = r;
    piano.constant = 0.75 + r * 3.6 + mobile.position.x;
    var s = tSolid(fase, t);
    mPezzoF.forEach(function (m) { m.visible = s < 0.98; });
    mPezzoS.forEach(function (m) { m.visible = s > 0.02; m.material = finito; });
    finito.transparent = s < 0.98; finito.opacity = s;
    fusoPezzo.transparent = s > 0.02; fusoPezzo.opacity = 1 - s;
    materozza.visible = tMat(fase, t) > 0.5 && r > 0.05;
    materozza.material = s > 0.5 ? finito : fusoPezzo;
    raffr.emissiveIntensity = fase === 4 ? 0.9 * Math.sin(Math.PI * Math.min(1, t * 1.2)) + 0.2 : 0;
  }

  var w = new T.Vector3();
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice,
    pavimento: -3.25,
    camera: { posizione: [-9, 9.5, 17.5], bersaglio: [-0.8, -0.6, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Tramoggia', ancora: su(radice, -8.5, 3.4, 0) },
      { testo: 'Vite', ancora: su(vite, -5.2, -0.1, 0) },
      { testo: 'Fasce riscaldanti', ancora: su(radice, -4.0, 1.05, 0) },
      { testo: 'Stampo fisso', ancora: su(radice, 1.0, -2.0, 0.05) },
      { testo: 'Stampo mobile', ancora: su(mobile, 3.6, 2.55, -0.8) },
      { testo: 'Pezzo', ancora: su(pezzo, 3.2, -1.35, 0), visibile: function () { return statoRiemp > 0.3; } }
    ]
  };
});
