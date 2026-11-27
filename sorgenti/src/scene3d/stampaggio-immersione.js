/* Vista 3D – Stampaggio per immersione (Thompson 2007, pp. 68–71).
 * Supporto con quattro stampi maschi (più stampi insieme riducono il ciclo, p. 70); vasca che sale.
 * Fasi: 1 preriscaldamento, 2 distaccante, 3 immersione, 4 indurimento (capovolto), 5 raffreddamento ed estrazione.
 */
Vista3D.registra('stampaggio-immersione', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var PROF = [[0.001, 0], [0.45, 0], [0.45, -3.0], [0.38, -3.45], [0.2, -3.68], [0.001, -3.72]];
  var LIV = -1.9;                // linea di riempimento (quota locale sullo stampo)
  // profilo dello strato: solo sotto la linea di riempimento, spessore 0,12
  var STR = [[0.46, LIV], [0.58, LIV], [0.58, -3.0], [0.5, -3.52], [0.26, -3.82], [0.001, -3.86], [0.001, -3.73], [0.2, -3.69], [0.38, -3.46], [0.46, -3.0]];

  add(radice, k.blocco(-5, 5, -6.4, -6.0, -2.4, 2.4, M.macchina, true));
  // vasca (pareti) e liquido
  var vasca = new T.Group(); radice.add(vasca);
  [[-3.6, 3.6, -1.6, -1.4], [-3.6, 3.6, 1.4, 1.6], [-3.6, -3.4, -1.6, 1.6], [3.4, 3.6, -1.6, 1.6]].forEach(function (b) { add(vasca, k.blocco(b[0], b[1], -2.6, 0, b[2], b[3], M.macchina)); });
  add(vasca, k.blocco(-3.6, 3.6, -2.8, -2.6, -1.6, 1.6, M.macchina));
  var liquido = k.nuovo(k.COL.fuso, { transparent: true, opacity: 0.85, roughness: 0.25, emissive: k.COL.fuso, emissiveIntensity: 0.1 });
  add(vasca, k.blocco(-3.4, 3.4, -2.6, -0.4, -1.4, 1.4, liquido, false, liquido));
  var tVasca = k.traccia([-3.4, -3.4, 0.7, -3.4, -3.4], -3.4);

  // supporto con 4 stampi; ruota di 180° (capovolto) nelle fasi 4–5
  var perno = new T.Group(); perno.position.y = 2.2; radice.add(perno);
  add(perno, k.blocco(-3.4, 3.4, 0, 0.3, -0.3, 0.3, M.scuro, true));
  var colonne = [-4.4, 4.4].map(function (x) { return add(radice, k.blocco(x - 0.25, x + 0.25, -6.0, 2.6, -0.25, 0.25, M.macchina, true)); });
  var strato = k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 0.25, roughness: 0.35 });
  var strati = [];
  [-2.4, -0.8, 0.8, 2.4].forEach(function (x) {
    var s = k.torneroY(PROF, M.stampo, 40); s.position.x = x; perno.add(s);
    var c = k.torneroY(STR, strato, 40); c.position.x = x; perno.add(c); strati.push(c);
    c.userData.materiali.forEach(function (m) { m.transparent = true; });
  });
  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);

  // forno e bagno: volumi trasparenti attorno agli stampi
  var forno = k.nuovo(k.COL.fuso, { transparent: true, opacity: 0, depthWrite: false, side: T.DoubleSide });
  var bagno = k.nuovo(k.COL.flusso, { transparent: true, opacity: 0, depthWrite: false, side: T.DoubleSide });
  var vol = new T.BoxGeometry(7.6, 5.0, 3.0);
  var fM = new T.Mesh(vol, forno); fM.position.y = 0.3; fM.renderOrder = 3; radice.add(fM);
  var bM = new T.Mesh(vol, bagno); bM.position.y = 0.3; bM.renderOrder = 3; radice.add(bM);

  function morb(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  var tRot = k.traccia([0, 0, 0, 180, 180], 0);
  function aggiorna(fase, t) {
    vasca.position.y = tVasca(fase, fase === 3 ? (t < 0.5 ? t * 2 : 1) : t);
    perno.rotation.x = tRot(fase, fase === 4 ? Math.min(1, t / 0.5) : t) * Math.PI / 180;
    var g = fase < 3 ? 0 : fase === 3 ? morb(Math.max(0, (t - 0.35) / 0.65)) : 1;
    var so = fase === 4 ? morb(t) : fase === 5 ? 1 : 0;
    strati.forEach(function (c) {
      c.visible = g > 0.01;
      c.scale.set(0.8 + 0.2 * g, 1, 0.8 + 0.2 * g);
      c.userData.materiali.forEach(function (m) { m.opacity = Math.min(1, g * 1.5); m.color.lerpColors(cF, cS, so); m.emissiveIntensity = 0.25 * (1 - so); });
    });
    forno.opacity = (fase === 1 || fase === 4) ? 0.12 : 0;
    bagno.opacity = fase === 5 ? 0.16 : 0;
    fM.position.y = bM.position.y = fase >= 4 ? 4.1 : 0.3;
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -6.4,
    camera: { posizione: [7, 4.5, 25], bersaglio: [0, 0.2, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Stampi maschi in alluminio', ancora: su(perno, 2.4, -0.6, 0) },
      { testo: 'Vasca di PVC liquido', ancora: su(vasca, 3.4, 0, -1.4) },
      { testo: 'Supporto', ancora: su(perno, -3.2, 0.3, 0) },
      { testo: 'Forno', ancora: su(fM, -3.6, 2.5, -1.5), visibile: function () { return forno.opacity > 0; } },
      { testo: 'Bagno d\'acqua', ancora: su(bM, -3.6, 2.5, -1.5), visibile: function () { return bagno.opacity > 0; } }
    ]
  };
});
