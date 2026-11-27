/* Vista 3D – Metallizzazione sottovuoto di cerniere (Thompson 2007, pp. 372–375).
 * Carosello che ruota attorno all'elettrodo; ogni supporto ruota anche su se stesso.
 * Fasi: 1 strato di base, 2 carico e vuoto, 3 vaporizzazione, 4 trasparente.
 */
Vista3D.registra('metallizzazione-sottovuoto', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var RC = 1.6;
  add(radice, k.blocco(-4, 4, -2.6, -2.2, -2.6, 2.6, M.macchina, true));
  // camera
  var mVe = k.nuovo(0xb8c4d0, { transparent: true, opacity: 0.12, depthWrite: false, side: T.DoubleSide });
  var cam = new T.Mesh(new T.CylinderGeometry(2.5, 2.5, 4.0, 48, 1, true), mVe); cam.position.y = -0.2; radice.add(cam);
  add(radice, k.blocco(-2.6, 2.6, -2.2, -2.0, -2.6, 2.6, M.scuro, true));
  // elettrodo centrale con filo
  add(radice, k.blocco(-0.12, 0.12, -2.0, 1.4, -0.12, 0.12, M.scuro, true));
  var mFilo = k.nuovo(0xd9dde2, { emissive: 0xfff2c0, emissiveIntensity: 0 });
  var filo = new T.Mesh(new T.TorusGeometry(0.2, 0.03, 8, 30), mFilo); filo.rotation.x = Math.PI / 2; filo.position.y = 0.2; radice.add(filo);
  var nube = new T.Mesh(new T.SphereGeometry(1, 24, 16), k.nuovo(0xffffff, { transparent: true, opacity: 0.25, depthWrite: false }));
  nube.position.y = 0.2; radice.add(nube);
  // carosello con supporti e cerniere
  var car = new T.Group(); radice.add(car);
  var mP = k.nuovo(0x3a2a2a, { roughness: 0.3, metalness: 0.2 });
  var supp = [];
  for (var i = 0; i < 6; i++) {
    var a = i / 6 * Math.PI * 2, g = new T.Group(); g.position.set(RC * Math.cos(a), 0, RC * Math.sin(a)); car.add(g);
    var asta = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 3.2, 6), M.scuro); asta.position.y = -0.2; g.add(asta);
    [-1.0, 0.0, 1.0].forEach(function (y) {
      var c = new T.Group(); c.position.y = y; g.add(c);
      var l1 = new T.Mesh(new T.BoxGeometry(0.4, 0.5, 0.04), mP); l1.position.x = 0.22; c.add(l1);
      var l2 = new T.Mesh(new T.BoxGeometry(0.4, 0.5, 0.04), mP); l2.position.x = -0.22; c.add(l2);
      var nocca = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 0.5, 12), mP); c.add(nocca);
    });
    supp.push(g);
  }
  var cBase = new T.Color(0x3a2a2a), cAl = new T.Color(0xdfe3e8), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t), giro = fase === 1 ? 0 : (fase - 2 + t) * 2.5;
    car.rotation.y = giro; supp.forEach(function (g) { g.rotation.y = -giro * 3; });
    car.position.y = fase === 1 ? 3.0 * (1 - e) : 0;
    mVe.opacity = fase === 2 ? 0.12 + 0.1 * e : 0.22;
    var acceso = fase === 3 && t > 0.15 && t < 0.85;
    mFilo.emissiveIntensity = acceso ? 2.5 : 0;
    nube.visible = acceso; nube.scale.setScalar(0.3 + 1.6 * Math.min(1, (t - 0.15) / 0.3));
    if (fase <= 2) { mP.color.copy(cBase); mP.metalness = 0.2; mP.roughness = 0.3; }
    else if (fase === 3) { mP.color.copy(cBase).lerp(cAl, Math.max(0, Math.min(1, (t - 0.2) / 0.5))); mP.metalness = 0.2 + 0.7 * e; mP.roughness = 0.3 - 0.15 * e; }
    else { mP.color.copy(cAl).lerp(cS, e); mP.metalness = 0.9 - 0.4 * e; mP.roughness = 0.15; }
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.6,
    camera: { posizione: [3.5, 4.5, 8.5], bersaglio: [0, -0.2, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Camera a vuoto', ancora: su(radice, 2.5, 1.6, 0) },
      { testo: 'Filo di alluminio fra gli elettrodi', ancora: su(radice, 0.2, 0.3, 0.2) },
      { testo: 'Cerniere su supporti rotanti', ancora: su(radice, -RC, 1.2, 0.8) }
    ]
  };
});
