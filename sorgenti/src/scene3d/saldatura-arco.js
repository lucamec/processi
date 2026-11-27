/* Vista 3D – Saldatura MIG di due lamiere testa a testa (Thompson 2007, pp. 282–287).
 * Il cordone è un cilindro schiacciato lungo X rivelato da un piano di taglio che segue la torcia.
 * Fasi: 1 preparazione, 2 innesco, 3 avanzamento, 4 raffreddamento.
 */
Vista3D.registra('saldatura-arco', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var L = 2.8, S = 0.3;
  add(radice, k.blocco(-4, 4, -2.4, -2.0, -2.6, 2.6, M.macchina, true));
  add(radice, k.blocco(-3.4, 3.4, -2.0, -0.02, -2.0, 2.0, M.macchina, true));
  var mAc = k.nuovo(0x8d99a6, { metalness: 0.5, roughness: 0.45 });
  add(radice, k.blocco(-L, L, 0, S, -1.6, -0.03, mAc));
  add(radice, k.blocco(-L, L, 0, S, 0.03, 1.6, mAc));
  // morsetto di massa
  add(radice, k.blocco(L - 0.5, L - 0.1, S, S + 0.25, 0.8, 1.3, k.nuovo(0xc0392b), true));
  // ZTA: due fasce colorate dal calore
  var mZ = k.nuovo(k.COL.fuso, { transparent: true, opacity: 0, depthWrite: false });
  var zta = new T.Mesh(new T.PlaneGeometry(2 * L, 0.9).rotateX(-Math.PI / 2), mZ); zta.position.y = S + 0.005; radice.add(zta);
  // cordone
  var piano = new T.Plane(new T.Vector3(-1, 0, 0), -L);
  var mC = k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 0.6, roughness: 0.5 }); mC.clippingPlanes = [piano];
  var cord = new T.Mesh(new T.CylinderGeometry(0.14, 0.14, 2 * L - 0.2, 24).rotateZ(Math.PI / 2), mC); cord.scale.set(1, 0.6, 1); cord.position.y = S; radice.add(cord);
  // torcia: corpo inclinato, ugello, filo, gas, arco
  var torcia = new T.Group(); radice.add(torcia);
  var corpo = new T.Group(); corpo.rotation.z = -0.35; torcia.add(corpo);
  var manico = new T.Mesh(new T.CylinderGeometry(0.12, 0.14, 1.6, 20), M.scuro); manico.position.y = 1.2; corpo.add(manico);
  var ugello = new T.Mesh(new T.CylinderGeometry(0.11, 0.17, 0.4, 24, 1, true), M.stampo); ugello.position.y = 0.3; corpo.add(ugello);
  var filo = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 0.3, 8), k.nuovo(0xcfb37a, { metalness: 0.6 })); filo.position.y = 0.05; corpo.add(filo);
  var gas = new T.Mesh(new T.ConeGeometry(0.4, 0.5, 24, 1, true), k.nuovo(k.COL.flusso, { transparent: true, opacity: 0.22, depthWrite: false })); gas.position.y = -0.05; corpo.add(gas);
  var arco = new T.Mesh(new T.SphereGeometry(0.16, 16, 12), k.nuovo(0xffffff, { emissive: 0xfff2c0, emissiveIntensity: 3 })); radice.add(arco);
  var luce = new T.PointLight(0xffd59a, 0, 6); radice.add(luce);
  // bobina del filo
  var bob = new T.Mesh(new T.CylinderGeometry(0.5, 0.5, 0.3, 32).rotateX(Math.PI / 2), k.nuovo(0xcfb37a, { metalness: 0.4 })); bob.position.set(-3.2, 0.6, -2.2); radice.add(bob);

  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t), x = -L + 0.2, yT = S + 0.15, acceso = false;
    if (fase === 1) yT = S + 0.15 + 0.8 * (1 - e);
    if (fase === 2) { acceso = t > 0.5; }
    if (fase === 3) { x = -L + 0.2 + (2 * L - 0.4) * t; acceso = true; }
    if (fase === 4) { x = L - 0.2; yT = S + 0.15 + 0.8 * e; }
    torcia.position.set(x, yT, 0);
    gas.visible = acceso || fase === 2;
    arco.visible = acceso; arco.position.set(x, S + 0.05, 0); arco.scale.setScalar(0.8 + 0.4 * Math.abs(Math.sin(t * 90)));
    luce.intensity = acceso ? 3 : 0; luce.position.set(x, S + 0.4, 0);
    piano.constant = fase < 3 ? -L : fase === 3 ? x : L;
    mC.color.copy(cF).lerp(cS, fase === 4 ? e : 0); mC.emissiveIntensity = fase === 4 ? 0.6 * (1 - e) : 0.6;
    mZ.opacity = fase === 3 ? 0.25 * t : fase === 4 ? 0.25 : 0;
    bob.rotation.z = -(fase - 1 + t) * 6;
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.4,
    camera: { posizione: [4.5, 5.5, 9], bersaglio: [0, 0.2, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Torcia MIG', ancora: su(torcia, 0.6, 1.8, 0) },
      { testo: 'Cordone', ancora: su(radice, -1.6, S + 0.1, 0), visibile: function () { return piano.constant > -1.4; } },
      { testo: 'Morsetto di massa', ancora: su(radice, L - 0.3, S + 0.25, 1.3) },
      { testo: 'Bobina del filo', ancora: su(bob, 0, 0.5, 0) }
    ]
  };
});
