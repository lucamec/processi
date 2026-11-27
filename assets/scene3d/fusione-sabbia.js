/* Vista 3D – Fusione in sabbia (Thompson 2007, pp. 120–123).
 * Staffe di sabbia semitrasparenti ("modalità vetro") per vedere modello, anima e metallo.
 * Fasi: 1 formatura, 2 anima e chiusura, 3 colata, 4 solidificazione, 5 distaffatura.
 */
Vista3D.registra('fusione-sabbia', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var X = function (s) { return (s - 410) / 40; }, Y = function (s) { return (200 - s) / 40; };
  var zP = 1.3;
  add(radice, k.blocco(-6, 6, Y(340), Y(320), -3, 3, M.macchina, true));
  var sabbia = k.nuovo(0xd9c49a, { transparent: true, opacity: 0.32, depthWrite: false, roughness: 1 });
  var drag = add(radice, k.blocco(X(240), X(580), Y(320), Y(200), -2.4, 2.4, sabbia, false, sabbia));
  var cope = new T.Group(); radice.add(cope);
  add(cope, k.blocco(X(240), X(580), Y(200), Y(90), -2.4, 2.4, sabbia, false, sabbia));
  [drag, cope.children[0]].forEach(function (m) { m.renderOrder = 2; m.castShadow = false; var e = new T.LineSegments(new T.EdgesGeometry(m.geometry), new T.LineBasicMaterial({ color: 0x5b6773 })); e.position.copy(m.position); m.parent.add(e); });
  function guscio(mat) {
    var g = new T.Group();
    [[X(320), X(500), Y(164), Y(150), -zP, zP], [X(320), X(334), Y(250), Y(164), -zP, zP], [X(486), X(500), Y(250), Y(164), -zP, zP],
     [X(334), X(486), Y(250), Y(164), -zP, -zP + 0.35], [X(334), X(486), Y(250), Y(164), zP - 0.35, zP]].forEach(function (b) { add(g, k.blocco(b[0], b[1], b[2], b[3], b[4], b[5], mat, false, mat)); });
    return g;
  }
  var modello = guscio(M.macchina); radice.add(modello);
  var anima = add(radice, k.blocco(X(334), X(486), Y(250), Y(164), -zP + 0.35, zP - 0.35, k.nuovo(0xc9b07a, { roughness: 1 })));
  var metallo = k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 0.4, metalness: 0.3, roughness: 0.4 });
  var livello = new T.Plane(new T.Vector3(0, -1, 0), Y(266)); metallo.clippingPlanes = [livello];
  var pezzo = guscio(metallo); radice.add(pezzo);
  var canali = new T.Group(); radice.add(canali);
  var c1 = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, Y(90) - Y(262), 16), metallo); c1.position.set(X(272), (Y(90) + Y(262)) / 2, 0); canali.add(c1);
  var c2 = k.cilindroX(X(264), X(322), 0.16, metallo); c2.position.y = Y(256); canali.add(c2);
  var c3 = new T.Mesh(new T.CylinderGeometry(0.22, 0.22, Y(90) - Y(150), 16), metallo); c3.position.set(X(410), (Y(90) + Y(150)) / 2, 0); canali.add(c3);
  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  var tCope = k.traccia([3.4, 0, 0, 0, 3.4], 3.4);
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    cope.position.y = tCope(fase, t);
    modello.visible = fase === 1;
    anima.visible = fase >= 2 && fase <= 4;
    var r = fase < 3 ? 0 : fase === 3 ? e : 1;
    livello.constant = Y(266) + r * (Y(86) - Y(266));
    pezzo.visible = canali.visible = fase >= 3;
    if (fase === 5 && t > 0.5) canali.visible = false;
    var so = fase === 4 ? e : fase === 5 ? 1 : 0;
    metallo.color.lerpColors(cF, cS, so); metallo.emissiveIntensity = 0.4 * (1 - so);
    sabbia.opacity = fase === 5 ? 0.32 * (1 - e) : 0.32;
    drag.visible = !(fase === 5 && t > 0.95);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: Y(340),
    camera: { posizione: [6, 6.5, 13], bersaglio: [0, 0, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Staffa superiore', ancora: su(cope, X(560), Y(90), -2.0) },
      { testo: 'Modello', ancora: su(radice, X(470), Y(150), 0), visibile: function () { return modello.visible; } },
      { testo: 'Canale di colata', ancora: su(radice, X(272), Y(100), 0), visibile: function () { return canali.visible; } },
      { testo: 'Anima', ancora: su(radice, X(410), Y(240), 0.5), visibile: function () { return anima.visible && !pezzo.visible; } }
    ]
  };
});
