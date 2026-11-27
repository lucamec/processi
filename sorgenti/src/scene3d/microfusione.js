/* Vista 3D – Microfusione a cera persa (Thompson 2007, pp. 130–135).
 * Fasi: 1 albero di cera, 2 guscio ceramico, 3 deceratura e cottura, 4 colata, 5 rottura del guscio.
 */
Vista3D.registra('microfusione', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat;
  radice.add(k.blocco(-5, 5, -4.4, -4.0, -3, 3, M.macchina, true));
  function albero(mat, gonfia) {
    var g = new T.Group(), s = gonfia || 0;
    var c = new T.Mesh(new T.CylinderGeometry(0.28 + s, 0.28 + s, 5.6 + s, 24), mat); c.position.y = -0.6; g.add(c);
    var imb = new T.Mesh(new T.CylinderGeometry(0.75 + s, 0.3 + s, 0.8, 24), mat); imb.position.y = 2.5; g.add(imb);
    [1.4, -1.0].forEach(function (y) {
      [0, Math.PI / 2, Math.PI, -Math.PI / 2].forEach(function (a) {
        var arm = new T.Mesh(new T.BoxGeometry(1.4 + s, 0.3 + 2 * s, 0.3 + 2 * s), mat); arm.position.set(Math.cos(a) * 0.9, y, -Math.sin(a) * 0.9); arm.rotation.y = a; g.add(arm);
        var nodo = new T.Mesh(new T.CylinderGeometry(0.45 + s, 0.45 + s, 0.9 + 2 * s, 20), mat); nodo.position.set(Math.cos(a) * 1.8, y, -Math.sin(a) * 1.8); g.add(nodo);
      });
    });
    g.traverse(function (o) { if (o.isMesh) o.castShadow = true; });
    return g;
  }
  var cera = k.nuovo(k.COL.grezzo, { roughness: 0.6 });
  var ceramica = k.nuovo(0xe8e4dc, { roughness: 0.95, emissive: k.COL.fuso, emissiveIntensity: 0, side: T.DoubleSide });
  if (k.taglio) ceramica.clippingPlanes = [new T.Plane(new T.Vector3(0, 0, -1), 0)];
  var met = k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 0.4, metalness: 0.4, roughness: 0.35 });
  var livello = new T.Plane(new T.Vector3(0, -1, 0), -4); met.clippingPlanes = [livello];
  var tCera = albero(cera, 0), tGuscio = albero(ceramica, 0.18), tMet = albero(met, 0);
  [tCera, tGuscio, tMet].forEach(function (g) { g.position.y = 0.4; radice.add(g); });
  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    tCera.visible = fase <= 2;
    tGuscio.visible = fase >= 2 && fase <= 4 || (fase === 5 && t < 0.4);
    tGuscio.scale.setScalar(fase === 2 ? 0.94 + 0.06 * e : 1);
    ceramica.emissiveIntensity = fase === 3 ? 0.5 * Math.sin(Math.PI * t) : fase === 4 ? 0.25 * (1 - t) : 0;
    tMet.visible = fase >= 4;
    livello.constant = fase === 4 ? -4 + 7.5 * e : 4;
    var so = fase === 5 ? e : 0;
    met.color.lerpColors(cF, cS, so); met.emissiveIntensity = 0.4 * (1 - so);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -4.4,
    camera: { posizione: [7, 5, 14], bersaglio: [0, 0.2, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Albero di cera', ancora: su(tCera, 1.8, 1.9, 0), visibile: function () { return tCera.visible && !tGuscio.visible; } },
      { testo: 'Guscio ceramico', ancora: su(tGuscio, 1.8, 1.95, 0), visibile: function () { return tGuscio.visible; } },
      { testo: 'Imbuto di colata', ancora: su(radice, 0, 3.4, 0) }
    ]
  };
});
