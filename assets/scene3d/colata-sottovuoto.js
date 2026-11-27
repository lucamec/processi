/* Vista 3D – Colata sottovuoto (Thompson 2007, pp. 40–43).
 * Stampo in silicone semitrasparente ("modalità vetro"): il pezzo e i canali si vedono attraverso.
 * Fasi: 1 stampo in silicone, 2 rimozione del modello, 3 colata sottovuoto, 4 polimerizzazione, 5 estrazione.
 */
Vista3D.registra('colata-sottovuoto', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var zc = k.taglio ? 0 : 1;   // in spaccato i solidi interni mostrano solo la metà posteriore

  // camera a vuoto
  var vetro = M.vetro.clone();
  var cam = new T.Mesh(new T.BoxGeometry(10, 7.6, 5.4), vetro); cam.position.y = 0.6; cam.renderOrder = 3; radice.add(cam);
  var sp = new T.LineSegments(new T.EdgesGeometry(cam.geometry), new T.LineBasicMaterial({ color: 0x6b7682 })); sp.position.copy(cam.position); radice.add(sp);
  add(radice, k.blocco(-5, 5, -3.4, -3.1, -2.7, 2.7, M.macchina, true));
  add(radice, k.blocco(-3.9, 3.9, -3.1, -2.4, -1.8, 1.8, M.macchina, true));

  // stampo in silicone: due metà semitrasparenti
  var sil = k.nuovo(0xd9e3ec, { transparent: true, opacity: 0.25, depthWrite: false, roughness: 0.35 });
  var siliconeSotto = add(radice, k.blocco(-3.75, 3.75, -2.4, 0, -1.6, 1.6, sil, false, sil));
  var sopra = new T.Group(); radice.add(sopra);
  add(sopra, k.blocco(-3.75, 3.75, 0, 2.375, -1.6, 1.6, sil, false, sil));
  [siliconeSotto, sopra.children[0]].forEach(function (m) { var e = new T.LineSegments(new T.EdgesGeometry(m.geometry), new T.LineBasicMaterial({ color: 0x7d8b98 })); e.position.copy(m.position); m.parent.add(e); });
  [siliconeSotto].concat(sopra.children).forEach(function (m) { m.renderOrder = 2; m.castShadow = false; });

  // geometria del pezzo (vaschetta rovesciata) e dei canali
  function vaschetta(mat) {
    var g = new T.Group();
    [[-2.25, 2.25, 0.275, 0.625, -1.2, 1.2], [-2.25, -1.9, -0.925, 0.275, -1.2, 1.2], [1.9, 2.25, -0.925, 0.275, -1.2, 1.2],
     [-1.9, 1.9, -0.925, 0.275, -1.2, -0.85], [-1.9, 1.9, -0.925, 0.275, 0.85, 1.2]].forEach(function (b) { add(g, k.blocco(b[0], b[1], b[2], b[3], b[4], b[5], mat, false, mat)); });
    return g;
  }
  function canali(mat) {
    var g = new T.Group();
    function vert(x, y0, y1) { var m = new T.Mesh(new T.CylinderGeometry(0.11, 0.11, y1 - y0, 16), mat); m.position.set(x, (y0 + y1) / 2, 0); g.add(m); }
    vert(0, -1.675, 2.375); vert(-1.3, 0.625, 2.375); vert(1.3, 0.625, 2.375); vert(-2.65, -1.675, -0.75);
    var r = k.cilindroX(-2.76, 0.11, 0.11, mat); r.position.y = -1.575; g.add(r);
    var r2 = k.cilindroX(-2.76, -2.2, 0.1, mat); r2.position.y = -0.82; g.add(r2);
    return g;
  }
  var modello = vaschetta(M.macchina); radice.add(modello);
  var pur = k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 0.25, roughness: 0.4 });
  var livello = new T.Plane(new T.Vector3(0, -1, 0), -2);
  pur.clippingPlanes = [livello];
  var pezzo = vaschetta(pur); radice.add(pezzo);
  var rete = canali(pur); radice.add(rete);
  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);

  // bicchiere di colata
  var bicchiere = new T.Group(); bicchiere.position.set(0, 3.0, 0); radice.add(bicchiere);
  bicchiere.add(k.torneroY([[0.45, 0], [0.55, 0.9], [0.6, 0.9], [0.5, -0.05], [0, -0.05]], M.macchina, 32, true));
  var getto = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 0.7, 10), pur.clone()); getto.material.clippingPlanes = []; getto.position.y = -0.4; bicchiere.add(getto);

  var tSil = k.traccia([0.25, 0.25, 0.25, 0.25, 0.25], 0), tSopra = k.traccia([0, 1.9, 0, 0, 1.9], 0);
  function morb(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  function aggiorna(fase, t) {
    sil.opacity = tSil(fase, t);
    sopra.position.y = tSopra(fase, fase === 3 ? Math.min(1, t / 0.3) : t);
    modello.visible = fase === 1 || (fase === 2 && t < 0.6);
    if (fase === 2 && t >= 0.6) modello.visible = false;
    var r = fase < 3 ? 0 : fase === 3 ? morb(Math.max(0, (t - 0.25) / 0.75)) : 1;
    livello.constant = -1.75 + r * 4.2;
    pezzo.visible = rete.visible = fase >= 3;
    if (fase === 5 && t > 0.6) rete.visible = false;
    var so = fase === 4 ? morb(t) : fase === 5 ? 1 : 0;
    pur.color.lerpColors(cF, cS, so); pur.emissiveIntensity = 0.25 * (1 - so);
    bicchiere.visible = fase === 3 && t < 0.85;
    vetro.color.set(k.COL.vetro).lerp(cF, fase === 4 ? 0.35 * Math.sin(Math.PI * t) : 0);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -3.4,
    camera: { posizione: [5.5, 6, 13], bersaglio: [0, 0.3, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Camera a vuoto', ancora: su(radice, -4.6, 4.4, -2.7) },
      { testo: 'Stampo in silicone', ancora: su(sopra, 3.4, 2.375, -1.0) },
      { testo: 'Modello', ancora: su(radice, -1.6, 0.625, 0), visibile: function () { return modello.visible; } },
      { testo: 'Materozza', ancora: su(radice, 1.3, 2.0, 0), visibile: function () { return rete.visible; } },
      { testo: 'Pezzo in PUR', ancora: su(radice, 2.0, -0.6, 1.2), visibile: function () { return pezzo.visible && !rete.visible; } }
    ]
  };
});
