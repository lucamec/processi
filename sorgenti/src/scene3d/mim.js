/* Vista 3D – MIM (Thompson 2007, pp. 136–139).
 * Fasi: 1 iniezione, 2 pezzo verde (+20%), 3 deceraggio, 4 sinterizzazione (ritiro 15–20%).
 */
Vista3D.registra('mim', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  add(radice, k.blocco(-6.5, 6.5, -2.4, -2.0, -2.8, 2.8, M.macchina, true));
  // ingranaggio estruso
  var sh = new T.Shape(), Z = 14, R = 1.3;
  for (var i = 0; i <= Z * 4; i++) { var a = i / (Z * 4) * Math.PI * 2, r = (Math.floor(i / 2) % 2) ? R : R * 0.82; if (i) sh.lineTo(r * Math.cos(a), r * Math.sin(a)); else sh.moveTo(r * Math.cos(a), r * Math.sin(a)); }
  var foro = new T.Path(); foro.absarc(0, 0, 0.38, 0, Math.PI * 2, true); sh.holes.push(foro);
  var g = new T.ExtrudeGeometry(sh, { depth: 0.6, bevelEnabled: false, curveSegments: 24 }); g.translate(0, 0, -0.3); g.rotateX(-Math.PI / 2);
  var mat = k.nuovo(k.COL.fuso, { metalness: 0.4, roughness: 0.4 });
  var pezzo = new T.Mesh(g, mat); pezzo.castShadow = true; radice.add(pezzo);
  // stampo in due metà (sopra e sotto)
  var inf = add(radice, k.blocco(-4.6, -1.2, -2.0, -0.3, -1.7, 1.7, M.stampo));
  var sup = new T.Group(); radice.add(sup); add(sup, k.blocco(-4.6, -1.2, 0.3, 2.0, -1.7, 1.7, M.stampo));
  var ugello = new T.Mesh(new T.CylinderGeometry(0.15, 0.3, 1.2, 16), M.stampo); ugello.position.set(-2.9, 2.6, 0); sup.add(ugello);
  // forno
  var vetro = M.vetro.clone();
  var forno = new T.Mesh(new T.BoxGeometry(4, 3.2, 3.6), vetro); forno.position.set(3.4, -0.4, 0); forno.renderOrder = 3; radice.add(forno);
  var spig = new T.LineSegments(new T.EdgesGeometry(forno.geometry), new T.LineBasicMaterial({ color: 0x6b7682 })); spig.position.copy(forno.position); radice.add(spig);
  add(radice, k.blocco(2.0, 4.8, -1.85, -1.7, -1.2, 1.2, k.nuovo(0xe8e4dc), true));
  var cF = new T.Color(k.COL.fuso), cG = new T.Color(k.COL.grezzo), cS = new T.Color(k.COL.finito), cO = new T.Color(k.COL.fuso);
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var x = fase === 1 ? -2.9 : fase === 2 ? -2.9 + 6.3 * e : 3.4;
    var y = fase === 1 ? 0 : fase === 2 ? 1.2 * Math.sin(Math.PI * e) - 1.4 * e : -1.4;
    pezzo.position.set(x, y, 0);
    var s = fase === 4 ? 1 - 0.17 * e : 1; pezzo.scale.set(s, 1 - (1 - s) * 0.5, s);
    sup.position.y = fase === 1 ? 0 : 1.6;
    if (fase === 1) mat.color.copy(cF); else if (fase === 4) mat.color.lerpColors(cG, cS, e); else mat.color.copy(cG);
    vetro.color.set(k.COL.vetro).lerp(cO, fase >= 3 ? 0.35 * Math.sin(Math.PI * t) : 0);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.4,
    camera: { posizione: [1.5, 8, 14], bersaglio: [0, -0.5, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Stampo', ancora: su(inf, -1.7, 0.85, -1.7) },
      { testo: 'Forno di sinterizzazione', ancora: su(radice, 4.6, 1.2, -1.8) },
      { testo: 'Pezzo', ancora: su(pezzo, 1.2, 0.4, 0) }
    ]
  };
});
