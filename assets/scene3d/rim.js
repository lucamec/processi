/* Vista 3D – RIM / schiuma a freddo (Thompson 2007, pp. 64–67).
 * Stampo in due metà con cavità a cuscino e telaio in acciaio; la schiuma si espande dal basso.
 * Fasi: 1 preparazione, 2 miscelazione e iniezione, 3 espansione, 4 sformatura. 1 unità = 40 px dello schema 2D.
 */
Vista3D.registra('rim', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var cx = 3.75, cy = 1.375, cz = 1.9, ox = 4.5, oy = 2.625, oz = 2.6;

  add(radice, k.blocco(-5.2, 5.2, -3.1, -2.625, -3.0, 3.0, M.macchina, true));
  // metà inferiore
  [[-ox, ox, -oy, -cy, -oz, oz], [-ox, -cx, -cy, 0, -oz, oz], [cx, ox, -cy, 0, -oz, oz], [-cx, cx, -cy, 0, -oz, -cz], [-cx, cx, -cy, 0, cz, oz]]
    .forEach(function (b) { add(radice, k.blocco(b[0], b[1], b[2], b[3], b[4], b[5], M.stampo)); });
  // metà superiore
  var sopra = new T.Group(); radice.add(sopra);
  [[-ox, ox, cy, oy, -oz, oz], [-ox, -cx, 0, cy, -oz, oz], [cx, ox, 0, cy, -oz, oz], [-cx, cx, 0, cy, -oz, -cz], [-cx, cx, 0, cy, cz, oz]]
    .forEach(function (b) { add(sopra, k.blocco(b[0], b[1], b[2], b[3], b[4], b[5], M.stampo)); });

  // schiuma che si espande dal basso
  var schiuma = k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 0.2, roughness: 0.9 });
  var livello = new T.Plane(new T.Vector3(0, -1, 0), -cy); schiuma.clippingPlanes = [livello];
  var pezzo = new T.Group(); radice.add(pezzo);
  add(pezzo, k.blocco(-cx + 0.02, cx - 0.02, -cy + 0.02, cy - 0.02, -cz + 0.02, cz - 0.02, schiuma, false, schiuma));
  // telaio in acciaio annegato
  var acciaio = k.nuovo(k.COL.scuro, { metalness: 0.5, roughness: 0.4 });
  [-2.5, -1.25, 0, 1.25, 2.5].forEach(function (x) {
    var m = new T.Mesh(new T.BoxGeometry(0.3, 0.3, k.taglio ? 1.51 : 3.0), acciaio);
    m.position.set(x, -0.025, k.taglio ? -0.745 : 0); m.castShadow = true; pezzo.add(m);
  });
  var traverso = new T.Mesh(new T.BoxGeometry(5.3, 0.3, 0.3), acciaio); traverso.position.set(0, -0.025, -1.45); pezzo.add(traverso);
  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);

  // testa di miscelazione e serbatoi
  var testa = new T.Group(); radice.add(testa);
  var t1 = new T.Mesh(new T.CylinderGeometry(0.35, 0.35, 1.3, 24), M.stampo); t1.position.set(-2.65, oy + 0.65, 0); testa.add(t1);
  [[-6.6, 1.6, 'A'], [-6.6, -0.2, 'B']].forEach(function (s) {
    var tank = new T.Mesh(new T.CylinderGeometry(0.7, 0.7, 1.5, 32), M.macchina); tank.position.set(s[0], s[1] + 0.6, -1.0); tank.castShadow = true; testa.add(tank);
    var curve = new T.CatmullRomCurve3([new T.Vector3(s[0] + 0.7, s[1] + 1.0, -1.0), new T.Vector3(-4.2, oy + 1.6, -0.6), new T.Vector3(-2.65, oy + 1.2, 0)]);
    testa.add(new T.Mesh(new T.TubeGeometry(curve, 30, 0.08, 8), M.scuro));
  });

  var tSopra = k.traccia([0, 0, 0, 2.4], 2.4), tSu = k.traccia([0, 0, 0, 0.3], 0);
  function morb(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function aggiorna(fase, t) {
    sopra.position.y = tSopra(fase, t);
    var liv = fase === 1 ? 0 : fase === 2 ? 0.18 * morb(t) : fase === 3 ? 0.18 + 0.82 * morb(t) : 1;
    livello.constant = -cy + liv * 2 * cy + 0.02;
    pezzo.children[0].visible = fase > 1;
    pezzo.position.y = tSu(fase, t);
    var so = fase === 4 ? morb(t) : 0;
    schiuma.color.lerpColors(cF, cS, so); schiuma.emissiveIntensity = 0.2 * (1 - so);
    testa.visible = fase === 2 || (fase === 3 && t < 0.2);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -3.1,
    camera: { posizione: [5, 7, 14], bersaglio: [-1.0, 0.6, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Testa di miscelazione', ancora: su(radice, -2.65, oy + 1.4, 0), visibile: function () { return testa.visible; } },
      { testo: 'Telaio in acciaio', ancora: su(pezzo, 1.25, 0.2, 0) },
      { testo: 'Stampo superiore', ancora: su(sopra, 3.8, oy, -1.5) },
      { testo: 'Schiuma PUR', ancora: su(pezzo, -1.8, -0.9, 0), visibile: function () { return pezzo.children[0].visible && livello.constant > -0.5; } }
    ]
  };
});
