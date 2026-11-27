/* Vista 3D – Saldatura rotativa per attrito (Thompson 2007, pp. 294–297).
 * Fasi: 1 carico, 2 attrito, 3 pressione assiale con formazione della bava, 4 rimozione della bava.
 */
Vista3D.registra('saldatura-attrito', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var R = 0.45, Lb = 2.0, Y = 0.6;
  add(radice, k.blocco(-5, 5, -2.2, -1.8, -2, 2, M.macchina, true));
  add(radice, k.blocco(-4.8, 4.8, -1.8, -1.2, -1.0, 1.0, M.macchina, true));
  // mandrini
  var mand1 = new T.Group(); mand1.position.set(-Lb - 0.6, Y, 0); radice.add(mand1);
  mand1.add(k.cilindroX(-0.6, 0.6, 1.0, M.scuro)); add(radice, k.blocco(-4.4, -3.2, -1.2, Y - 0.2, -0.8, 0.8, M.macchina));
  var mand2 = new T.Group(); mand2.position.y = Y; radice.add(mand2);
  mand2.add(k.cilindroX(Lb + 0.0, Lb + 1.2, 1.0, M.scuro));
  // barre
  var mB = k.nuovo(0x8d99a6, { metalness: 0.6, roughness: 0.35 }), mB2 = mB.clone();
  var gir = new T.Group(); gir.position.y = Y; radice.add(gir);
  var b1 = k.cilindroX(-Lb - 0.6, 0, R, mB); gir.add(b1);
  var tacche = new T.Mesh(new T.BoxGeometry(1.2, 0.04, 0.08), M.scuro); tacche.position.set(-1.0, R, 0); gir.add(tacche);
  var b2g = new T.Group(); b2g.position.y = Y; radice.add(b2g);
  b2g.add(k.cilindroX(0, Lb, R, mB2));
  // interfaccia incandescente e bava
  var mI = k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 1.2 });
  var interf = new T.Mesh(new T.CylinderGeometry(R + 0.005, R + 0.005, 0.12, 40).rotateZ(Math.PI / 2), mI); radice.add(interf);
  var mBv = k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 0.8 });
  var bava = new T.Mesh(new T.TorusGeometry(R + 0.02, 0.1, 16, 48).rotateY(Math.PI / 2), mBv); radice.add(bava);
  var utensile = new T.Mesh(new T.BoxGeometry(0.15, 0.6, 0.15), M.scuro); radice.add(utensile);

  var cG = new T.Color(0x8d99a6), cS = new T.Color(k.COL.finito), cF = new T.Color(k.COL.fuso);
  function aggiorna(fase, t) {
    var e = k.morbido(t), x2 = 0.0, spin = 0, calore = 0, bv = 0;
    if (fase === 1) x2 = 1.0 * (1 - e);
    if (fase === 2) { spin = t * 40; calore = e; }
    if (fase === 3) { spin = 40 + 6 * (1 - e) * t; calore = 1 - 0.5 * e; x2 = -0.12 * e; bv = e; }
    if (fase === 4) { x2 = -0.12; spin = 0; bv = 1 - e; }
    gir.rotation.x = -spin;
    b2g.position.x = x2; mand2.position.x = x2;
    interf.visible = calore > 0.02; interf.position.set(x2 / 2, Y, 0); mI.emissiveIntensity = 1.2 * calore;
    bava.visible = bv > 0.02; bava.position.set(x2 / 2, Y, 0); bava.scale.set(Math.max(0.01, bv), 0.6 + 0.4 * bv, 0.6 + 0.4 * bv);
    mBv.color.copy(cF).lerp(cS, fase === 4 ? e : 0); mBv.emissiveIntensity = fase >= 3 ? 0.8 * (1 - (fase === 4 ? 1 : e * 0.5)) : 0.8;
    utensile.visible = fase === 4; utensile.position.set(x2 / 2, Y + R + 0.4 - 0.1 * Math.sin(Math.PI * t), 0);
    var fin = fase === 4 ? e : 0; mB.color.copy(cG).lerp(cS, fin); mB2.color.copy(mB.color);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.2,
    camera: { posizione: [2.5, 4, 8.5], bersaglio: [0, 0.4, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Mandrino rotante', ancora: su(radice, -Lb - 0.6, Y + 1.0, 0) },
      { testo: 'Mandrino fisso (spinta assiale)', ancora: su(mand2, Lb + 0.6, Y + 1.0, 0) },
      { testo: 'Bava', ancora: su(bava, 0, -R - 0.15, 0.3), visibile: function () { return bava.visible; } }
    ]
  };
});
