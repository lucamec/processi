/* Vista 3D – Colaggio ceramico (Thompson 2007, pp. 172–175).
 * Fasi: 1 riempimento, 2 formazione della parete, 3 svuotamento, 4 sformatura, 5 cottura.
 */
Vista3D.registra('colaggio-ceramico', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat;
  var s = function (p) { return p.map(function (q) { return [q[0] / 40, (290 - q[1]) / 40]; }); };
  var CAV = s([[0.01, 290], [60, 290], [90, 240], [90, 170], [40, 120], [40, 70]]);
  radice.add(k.blocco(-5, 5, -0.5, -0.1, -3, 3, M.macchina, true));
  // stampo: due metà (destra/sinistra) ottenute da un blocco con cavità per rivoluzione
  var gesso = k.nuovo(0xf1efe9, { roughness: 0.95, side: T.DoubleSide });
  function meta(segno) {
    var g = new T.Group();
    var prof = [[3.6, 0], [3.6, 6.0]].concat(CAV.slice().reverse().map(function (p) { return [p[0], p[1]]; }));
    // superficie di rivoluzione della cavità (mezzo giro) + guscio esterno cilindrico
    var cav = new T.LatheGeometry(CAV.map(function (p) { return new T.Vector2(p[0] + 0.01, p[1]); }), 48, segno > 0 ? 0 : Math.PI, k.taglio ? Math.PI / 2 : Math.PI);
    if (k.taglio) cav = new T.LatheGeometry(CAV.map(function (p) { return new T.Vector2(p[0] + 0.01, p[1]); }), 48, segno > 0 ? Math.PI / 2 : Math.PI, Math.PI / 2);
    g.add(new T.Mesh(cav, gesso));
    var est = new T.Mesh(new T.CylinderGeometry(3.0, 3.0, 6.0, 48, 1, true, segno > 0 ? 0 : Math.PI, k.taglio ? Math.PI / 2 : Math.PI), gesso); est.position.y = 3; if (k.taglio) est.geometry = new T.CylinderGeometry(3.0, 3.0, 6.0, 48, 1, true, segno > 0 ? Math.PI / 2 : Math.PI, Math.PI / 2);
    g.add(est); void prof;
    // faccia di taglio (piano XY) con il profilo della cavità
    var sh = new T.Shape(); sh.moveTo(0, 0); sh.lineTo(segno * 3.0, 0); sh.lineTo(segno * 3.0, 6.0); sh.lineTo(0, 6.0);
    CAV.slice().reverse().forEach(function (p) { sh.lineTo(segno * p[0], p[1]); });
    var faccia = new T.Mesh(new T.ShapeGeometry(sh), k.nuovo(0xdcd8cf, { side: T.DoubleSide })); g.add(faccia);
    g.traverse(function (o) { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    radice.add(g); return g;
  }
  var sxM = meta(-1), dxM = meta(1);
  // barbottina (solido di rivoluzione) e guscio
  var barb = k.nuovo(k.COL.grezzo, { roughness: 0.4, side: T.DoubleSide });
  var pieno = k.torneroY(CAV.concat([[0.001, CAV[CAV.length - 1][1]]]), barb, 48); radice.add(pieno);
  var gus = k.nuovo(k.COL.fuso, { roughness: 0.8, side: T.DoubleSide });
  var guscio = new T.Mesh(new T.BufferGeometry(), gus); guscio.castShadow = true; radice.add(guscio);
  function profGuscio(sp) {
    var est = CAV.map(function (p) { return [p[0], p[1]]; });
    var int = CAV.slice().reverse().map(function (p, i) { return [Math.max(0.001, p[0] - sp), Math.max(sp, p[1])]; });
    return est.concat(int).map(function (p) { return new T.Vector2(p[0], p[1]); });
  }
  var cS = new T.Color(k.COL.finito), cF = new T.Color(k.COL.fuso);
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var sp = fase === 1 ? 0.01 : fase === 2 ? 0.01 + 0.29 * e : 0.3;
    var g = new T.LatheGeometry(profGuscio(sp), 48, k.taglio ? Math.PI / 2 : 0, k.taglio ? Math.PI : Math.PI * 2);
    guscio.geometry.dispose(); guscio.geometry = g;
    guscio.visible = fase >= 2;
    pieno.visible = fase <= 2 || (fase === 3 && t < 0.6);
    pieno.scale.y = fase === 3 ? Math.max(0.01, 1 - t / 0.6) : fase === 1 ? Math.max(0.05, e) : 1;
    var ap = fase === 4 ? 1.6 * e : fase === 5 ? 1.6 : 0;
    sxM.position.x = -ap; dxM.position.x = ap;
    sxM.visible = dxM.visible = fase !== 5 || t < 0.2;
    if (fase === 5) gus.color.lerpColors(cF, cS, e); else gus.color.copy(cF);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -0.5,
    camera: { posizione: [7, 7, 17], bersaglio: [0, 2.4, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Stampo in gesso', ancora: su(dxM, 2.9, 5.6, -0.6) },
      { testo: 'Barbottina', ancora: su(radice, -0.6, 3.0, 0), visibile: function () { return pieno.visible; } },
      { testo: 'Guscio di argilla', ancora: su(radice, 1.9, 2.0, 0), visibile: function () { return guscio.visible && !pieno.visible; } }
    ]
  };
});
