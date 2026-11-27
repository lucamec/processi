/* Vista 3D – Laminazione a umido su stampo a una faccia (Thompson 2007, pp. 206–217).
 * Stampo femmina a guscio su telaio; gel coat e strati di fibra rivelati da piani di taglio che scorrono in X.
 * Fasi: 1 distaccante, 2 gel coat, 3 stratificazione, 4 polimerizzazione, 5 sformatura.
 */
Vista3D.registra('laminazione-compositi', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var LX = 3.2, LZ = 2.0, H = 1.5;
  function guscio(x, z) { return -H * Math.max(0, 1 - Math.pow(x / LX, 2)) * Math.max(0, 1 - Math.pow(z / LZ, 4)); }

  add(radice, k.blocco(-4.4, 4.4, -3.4, -3.0, -2.8, 2.8, M.macchina, true));
  // telaio
  [[-3.0, -1.8], [3.0, -1.8], [-3.0, 1.8], [3.0, 1.8]].forEach(function (p) { add(radice, k.blocco(p[0] - 0.12, p[0] + 0.12, -3.0, 0, p[1] - 0.12, p[1] + 0.12, M.macchina)); });
  add(radice, k.blocco(-3.3, 3.3, -0.12, 0.0, -2.1, 2.1, M.macchina, false));
  // pelle dello stampo
  var mSt = k.nuovo(0x5d6b78, { side: T.DoubleSide, roughness: 0.35 });
  var pelle = k.lastra(LX + 0.3, LZ + 0.1, 80, 50, mSt); pelle.imposta(function (x, z) { return 0.02 + guscio(x, z); }); radice.add(pelle.mesh);

  // strati: gel coat + 3 fogli, ognuno con il suo piano di taglio
  var pezzo = new T.Group(); radice.add(pezzo);
  function strato(off, col) {
    var piano = new T.Plane(new T.Vector3(-1, 0, 0), -LX);
    var m = k.nuovo(col, { side: T.DoubleSide, roughness: 0.6 }); m.clippingPlanes = [piano];
    var l = k.lastra(LX, LZ, 80, 50, m); l.imposta(function (x, z) { return 0.02 + guscio(x, z) + off; }); pezzo.add(l.mesh);
    return { m: m, piano: piano };
  }
  var gel = strato(0.04, 0xe8e2d6);
  var fogli = [0.09, 0.14, 0.19].map(function (o) { return strato(o, k.COL.fuso); });
  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito), cGel = new T.Color(0xe8e2d6);

  // tampone del distaccante e rullo
  var tampone = new T.Mesh(new T.BoxGeometry(0.7, 0.2, 0.5), k.nuovo(0xf2efe8, { roughness: 0.9 })); tampone.castShadow = true; radice.add(tampone);
  var rullo = new T.Group(); radice.add(rullo);
  var cil = new T.Mesh(new T.CylinderGeometry(0.16, 0.16, 1.4, 20).rotateX(Math.PI / 2), M.stampo); cil.castShadow = true; rullo.add(cil);
  var man = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 1.6, 8), M.scuro); man.position.set(0.5, 0.7, 0); man.rotation.z = -0.6; rullo.add(man);

  function svela(s, u) { s.piano.constant = -LX + 2 * LX * Math.max(0, Math.min(1, u)) + (u >= 1 ? 1 : 0); }
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    svela(gel, fase === 1 ? 0 : fase === 2 ? t : 1);
    fogli.forEach(function (f, i) {
      var u = fase < 3 ? 0 : fase === 3 ? (t - i / 3) * 3 : 1;
      svela(f, u);
      f.m.color.copy(cF).lerp(cS, fase === 4 ? e * 0.5 : fase === 5 ? 0.5 + 0.5 * e : 0);
    });
    gel.m.color.copy(cGel).lerp(cS, fase === 5 ? e : 0);
    pezzo.position.y = fase === 5 ? 1.5 * e : 0;
    // distaccante: tampone a zig-zag
    tampone.visible = fase === 1;
    var zx = -2.6 + 5.2 * t, zz = 1.2 * Math.sin(t * Math.PI * 6);
    tampone.position.set(zx, 0.12 + guscio(zx, zz), zz);
    mSt.roughness = fase === 1 ? 0.35 - 0.2 * e : 0.15;
    // rullo: passa su ogni foglio
    rullo.visible = fase === 3;
    var u = (t * 3) % 1, rx = -2.8 + 5.6 * u;
    rullo.position.set(rx, 0.02 + guscio(rx, 0) + 0.38, 0);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -3.4,
    camera: { posizione: [5, 6.5, 12], bersaglio: [0, -0.4, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Stampo a una faccia', ancora: su(radice, LX + 0.3, 0, -LZ) },
      { testo: 'Telaio rigido', ancora: su(radice, 3.0, -2.2, 1.8) },
      { testo: 'Rullo', ancora: su(rullo, 0, 0.3, 0), visibile: function () { return rullo.visible; } },
      { testo: 'Fibra e resina', ancora: su(pezzo, -1.6, -0.9, -0.6), visibile: function () { return fogli[0].piano.constant > -LX + 1; } }
    ]
  };
});
