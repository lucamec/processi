/* Vista 3D – Stereolitografia (Thompson 2007, pp. 232–241).
 * Un solo parametro b (profondità della piattaforma) guida tutto: il pezzo è tagliato dal piano della
 * superficie della resina (y = 0), quindi si vede solo ciò che è già sceso sotto ed è quindi costruito.
 * Fasi: 1 modello sezionato, 2 supporti, 3 costruzione a strati, 4 estrazione e supporti, 5 pulizia e post-cura.
 */
Vista3D.registra('prototipazione-rapida', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var HS = 0.45, PROF = [[0, 0], [0.95, 0], [1.15, 0.5], [0.85, 1.4], [0.45, 1.9], [0.55, 2.3], [0, 2.3]], HP = 2.3;

  add(radice, k.blocco(-3.2, 6.0, -3.2, -2.8, -2.6, 2.6, M.macchina, true));
  // vasca e resina
  var mV = M.macchina;
  add(radice, k.blocco(-2.4, 2.4, -2.8, -2.6, -1.8, 1.8, mV));
  add(radice, k.blocco(-2.4, -2.2, -2.6, 0.5, -1.8, 1.8, mV));
  add(radice, k.blocco(2.2, 2.4, -2.6, 0.5, -1.8, 1.8, mV));
  add(radice, k.blocco(-2.2, 2.2, -2.6, 0.5, -1.8, -1.6, mV));
  add(radice, k.blocco(-2.2, 2.2, -2.6, 0.5, 1.6, 1.8, mV));
  var mR = k.nuovo(0xd9b25a, { transparent: true, opacity: 0.28, depthWrite: false, roughness: 0.15 });
  var resina = add(radice, k.blocco(-2.2, 2.2, -2.6, 0, -1.6, 1.6, mR, false, mR));

  // piattaforma con supporti e pezzo
  var superficie = new T.Plane(new T.Vector3(0, -1, 0), 0);
  var piatt = new T.Group(); radice.add(piatt);
  var mPl = k.nuovo(0x47515c); mPl.clippingPlanes = [superficie];
  var lastra = new T.Mesh(new T.BoxGeometry(3.2, 0.12, 2.4), mPl); lastra.position.y = -0.06; piatt.add(lastra);
  var asta = new T.Mesh(new T.BoxGeometry(0.2, 4, 0.2), M.scuro); asta.position.set(-1.9, 1.9, 0); piatt.add(asta);
  var mSu = k.nuovo(0xf3efe6, { transparent: true, opacity: 1 }); mSu.clippingPlanes = [superficie];
  var supp = new T.Group(); piatt.add(supp);
  for (var i = -3; i <= 3; i++) {
    var a = new T.Mesh(new T.BoxGeometry(0.02, HS, 2.0), mSu); a.position.set(i * 0.3, HS / 2, 0); supp.add(a);
    var b = new T.Mesh(new T.BoxGeometry(2.0, HS, 0.02), mSu); b.position.set(0, HS / 2, i * 0.3); supp.add(b);
  }
  var pezzo = k.torneroY(PROF, k.nuovo(k.COL.fuso, { roughness: 0.3 }), 48, true);
  pezzo.userData.materiali.forEach(function (m) { m.clippingPlanes = [superficie]; });
  pezzo.position.y = HS; piatt.add(pezzo);

  // modello CAD sezionato (fase 1)
  var sezioni = new T.Group(); sezioni.position.set(0, 1.1, 0); radice.add(sezioni);
  var mSez = new T.LineBasicMaterial({ color: k.COL.flusso });
  for (i = 0; i <= 18; i++) {
    var h = (i / 18) * HP, r = raggio(h), pts = [];
    for (var j = 0; j <= 40; j++) { var ang = j / 40 * Math.PI * 2; pts.push(new T.Vector3(r * Math.cos(ang), h, r * Math.sin(ang))); }
    sezioni.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), mSez));
  }
  function raggio(hh) {
    for (var n = 1; n < PROF.length; n++) { var p0 = PROF[n - 1], p1 = PROF[n]; if (hh <= p1[1] && p1[1] > p0[1]) return p0[0] + (p1[0] - p0[0]) * (hh - p0[1]) / (p1[1] - p0[1]); }
    return 0.5;
  }

  // specchio, raggio laser, pala
  add(radice, k.blocco(-0.5, 0.5, 3.6, 4.0, -0.5, 0.5, M.macchina, true));
  var mL = new T.LineBasicMaterial({ color: k.COL.fuso });
  var raggioG = new T.BufferGeometry().setFromPoints([new T.Vector3(0, 3.6, 0), new T.Vector3(0, 0, 0)]);
  var laser = new T.Line(raggioG, mL); radice.add(laser);
  var punto = new T.Mesh(new T.SphereGeometry(0.07, 12, 8), k.nuovo(0xffffff, { emissive: k.COL.fuso, emissiveIntensity: 2 })); radice.add(punto);
  var pala = new T.Mesh(new T.BoxGeometry(0.12, 0.16, 3.1), M.stampo); pala.castShadow = true; radice.add(pala);
  // lampada UV (fase 5)
  var lampada = new T.Mesh(new T.BoxGeometry(2.0, 0.25, 1.4), k.nuovo(0x8a5cf6, { emissive: 0x8a5cf6, emissiveIntensity: 0.8 })); lampada.position.set(4.2, 0.5, 0); radice.add(lampada);

  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  function tri(x) { var p = x % 1; return p < 0.5 ? p * 2 : 2 - p * 2; }
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var bb = fase === 1 ? 0 : fase === 2 ? HS * t : fase === 3 ? HS + HP * t : HS + HP;
    sezioni.visible = fase === 1;
    var costruendo = fase === 2 || fase === 3;
    laser.visible = punto.visible = pala.visible = costruendo;
    superficie.constant = fase >= 4 ? 100 : 0;
    piatt.visible = true; supp.visible = true; pezzo.position.set(0, HS, 0); piatt.position.set(0, -bb, 0);
    if (fase === 4) {
      var su = Math.min(1, e * 1.8);
      piatt.position.y = -bb + (bb + 0.8) * su;
      if (t > 0.6) { var u = k.morbido((t - 0.6) / 0.4); supp.visible = false; piatt.visible = true; pezzo.position.set(4.2 * Math.min(1, u * 1.6), HS + (-3.6 - HS) * Math.max(0, (u - 0.5) / 0.5), 0); }
    }
    if (fase === 5) { piatt.position.y = 0.8; supp.visible = false; asta.visible = true; pezzo.position.set(4.2, -3.6, 0); }
    lampada.visible = fase === 5;
    pezzo.userData.materiali.forEach(function (m) { m.color.copy(cF).lerp(cS, fase === 5 ? e : 0); });
    // laser sul contorno della sezione corrente
    if (costruendo) {
      var hh = fase === 2 ? -1 : HP * t, rr = hh < 0 ? 0.9 * (0.5 + 0.5 * tri(t * 7)) : raggio(hh);
      var ang2 = t * 60;
      punto.position.set(rr * Math.cos(ang2), 0.02, rr * Math.sin(ang2));
      var pos = raggioG.attributes.position; pos.setXYZ(1, punto.position.x, 0.02, punto.position.z); pos.needsUpdate = true;
      pala.position.set(-2.0 + 4.0 * tri(t * 5), 0.05, 0);
    }
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -3.2,
    camera: { posizione: [4, 7, 16], bersaglio: [1.3, 0.2, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Modello CAD sezionato', ancora: su(sezioni, -1.0, 2.0, 0), visibile: function () { return sezioni.visible; } },
      { testo: 'Laser UV', ancora: su(radice, 0.5, 3.8, 0) },
      { testo: 'Vasca di resina', ancora: su(radice, -2.4, -0.6, 1.8) },
      { testo: 'Lampada UV', ancora: su(lampada, 0, 0.2, 0), visibile: function () { return lampada.visible; } }
    ]
  };
});
