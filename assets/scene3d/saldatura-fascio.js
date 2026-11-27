/* Vista 3D – Saldatura laser con keyhole su lastre spesse (Thompson 2007, pp. 288–293).
 * La saldatura è una lama sottile che attraversa tutto lo spessore, rivelata dal piano che segue la testa.
 * Fasi: 1 allineamento, 2 messa a fuoco, 3 keyhole, 4 solidificazione.
 */
Vista3D.registra('saldatura-fascio', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var L = 2.6, S = 0.9, G = 0.03;
  add(radice, k.blocco(-4, 4, -2.4, -2.0, -2.6, 2.6, M.macchina, true));
  add(radice, k.blocco(-3.2, 3.2, -2.0, -0.02, -2.0, 2.0, M.macchina, true));
  var mAc = k.nuovo(0x8d99a6, { metalness: 0.5, roughness: 0.45 });
  var sx = new T.Group(), dx = new T.Group(); radice.add(sx); radice.add(dx);
  add(sx, k.blocco(-L, L, 0, S, -1.6, -G, mAc, true));
  add(dx, k.blocco(-L, L, 0, S, G, 1.6, mAc, true));
  // morsetti
  [-1.8, 1.8].forEach(function (x) { add(radice, k.blocco(x - 0.25, x + 0.25, S, S + 0.2, -1.6, -1.1, M.scuro, true)); add(radice, k.blocco(x - 0.25, x + 0.25, S, S + 0.2, 1.1, 1.6, M.scuro, true)); });
  // ZTA e saldatura
  var piano = new T.Plane(new T.Vector3(-1, 0, 0), -L);
  var mZ = k.nuovo(k.COL.fuso, { transparent: true, opacity: 0.0, depthWrite: false }); mZ.clippingPlanes = [piano];
  var zta = new T.Mesh(new T.PlaneGeometry(2 * L, 0.35).rotateX(-Math.PI / 2), mZ); zta.position.y = S + 0.004; radice.add(zta);
  var mS = k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 0.6 }); mS.clippingPlanes = [piano];
  var sald = new T.Mesh(new T.BoxGeometry(2 * L, S, 2 * G + 0.04), mS); sald.position.y = S / 2; radice.add(sald);
  // testa laser con fascio conico e keyhole
  var testa = new T.Group(); radice.add(testa);
  add(testa, k.blocco(-0.3, 0.3, 0.6, 1.8, -0.3, 0.3, M.stampo, true));
  var lente = new T.Mesh(new T.CylinderGeometry(0.22, 0.22, 0.06, 24), k.nuovo(k.COL.flusso, { transparent: true, opacity: 0.6 })); lente.position.y = 0.6; testa.add(lente);
  var cono = new T.Mesh(new T.ConeGeometry(0.2, 0.6, 24, 1, true), k.nuovo(k.COL.fuso, { transparent: true, opacity: 0.45, emissive: k.COL.fuso, emissiveIntensity: 0.6, depthWrite: false })); cono.rotation.x = Math.PI; cono.position.y = 0.3; testa.add(cono);
  var key = new T.Mesh(new T.CylinderGeometry(0.05, 0.03, S, 12), k.nuovo(0xffffff, { emissive: 0xffd08a, emissiveIntensity: 2.5 })); radice.add(key);
  var luce = new T.PointLight(0xffc27a, 0, 5); radice.add(luce);

  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t), x = -L + 0.1, yT = S + 0.05;
    sx.position.z = fase === 1 ? -0.5 * (1 - e) : 0; dx.position.z = fase === 1 ? 0.5 * (1 - e) : 0;
    if (fase === 1) yT = S + 1.0;
    if (fase === 2) yT = S + 1.0 - 0.95 * e;
    if (fase === 3) x = -L + 0.1 + (2 * L - 0.2) * t;
    if (fase === 4) { x = L - 0.1; yT = S + 0.05 + 1.0 * e; }
    testa.position.set(x, yT, 0);
    var acceso = fase === 3; cono.visible = fase === 3 || (fase === 2 && t > 0.6);
    key.visible = acceso; key.position.set(x, S / 2, 0);
    luce.intensity = acceso ? 2.5 : 0; luce.position.set(x, S + 0.4, 0.4);
    piano.constant = fase < 3 ? -L : fase === 3 ? x : L;
    mS.color.copy(cF).lerp(cS, fase === 4 ? e : 0); mS.emissiveIntensity = fase === 4 ? 0.6 * (1 - e) : 0.6;
    mZ.opacity = fase >= 3 ? 0.22 : 0;
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.4,
    camera: { posizione: [-4.5, 4.5, 7.5], bersaglio: [0, 0.4, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Testa laser', ancora: su(testa, 0.3, 1.6, 0) },
      { testo: 'Saldatura profonda e stretta', ancora: su(radice, -L, S * 0.4, 0), visibile: function () { return piano.constant > -L + 0.3; } },
      { testo: 'Lastre d\'acciaio spesse', ancora: su(radice, L, S, -1.6) }
    ]
  };
});
