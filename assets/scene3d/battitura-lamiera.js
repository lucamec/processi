/* Vista 3D – Battitura della lamiera (Thompson 2007, pp. 72–77).
 * Fasi: 1 lamiera tagliata, 2 ruota inglese, 3 martellatura su sagoma, 4 saldatura, 5 spianatura.
 */
Vista3D.registra('battitura-lamiera', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var LX = 3, LZ = 2.2, H = 1.3;

  add(radice, k.blocco(-6.5, 6.5, -2.4, -2.0, -3, 3, M.macchina, true));
  // sagoma in resina (fase 3 in poi)
  var sagoma = new T.Group(); radice.add(sagoma);
  var resina = k.nuovo(0xb9a98a, { roughness: 0.8, side: T.DoubleSide });
  add(sagoma, k.blocco(-LX, LX, -2.0, -0.2, -LZ, LZ, resina, false, resina));
  var cimaSag = k.lastra(LX, LZ, 60, 44, resina); sagoma.add(cimaSag.mesh);
  var tSag = k.traccia([-3, -3, 0, 0, 0], -3);

  // ruota inglese: telaio a C, ruota piatta, incudine bombata
  var ruota = new T.Group(); ruota.position.z = -0.0; radice.add(ruota);
  add(ruota, k.blocco(-0.4, 0.4, -2.0, 4.2, -4.4, -3.6, M.macchina, true));
  add(ruota, k.blocco(-0.4, 0.4, 3.4, 4.2, -3.6, -0.3, M.macchina, true));
  add(ruota, k.blocco(-0.4, 0.4, -2.0, -1.2, -3.6, -0.3, M.macchina, true));
  var disco = new T.Mesh(new T.CylinderGeometry(0.9, 0.9, 0.7, 40).rotateX(Math.PI / 2), M.stampo); disco.position.set(0, 2.5, 0); ruota.add(disco);
  var incudine = new T.Mesh(new T.SphereGeometry(0.55, 32, 16), M.stampo); incudine.scale.set(1, 0.6, 0.8); incudine.position.set(0, -0.8, 0); ruota.add(incudine);
  [disco, incudine].forEach(function (m) { m.castShadow = true; });
  var tRuota = k.traccia([-9, 0, -9, -9, -9], -9);

  // lamiera deformabile
  var mat = k.nuovo(k.COL.grezzo, { side: T.DoubleSide, metalness: 0.45, roughness: 0.35 });
  var lam = k.lastra(LX, LZ, 70, 50, mat); radice.add(lam.mesh);
  function bolla(x, z) { return H * Math.max(0, 1 - Math.pow(x / LX, 2)) * Math.max(0, 1 - Math.pow(z / LZ, 2)); }
  function nervatura(x, z) { return 0.28 * Math.exp(-Math.pow(z / 0.35, 2)) * Math.max(0, 1 - Math.pow(x / (LX * 0.8), 2)); }
  var cG = new T.Color(k.COL.grezzo), cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);

  // secondo pannello e cordone di saldatura
  var mat2 = mat.clone(); var lam2 = k.lastra(1.6, LZ, 30, 50, mat2); radice.add(lam2.mesh);
  var cordone = new T.Mesh(new T.SphereGeometry(0.16, 16, 12), k.nuovo(0xffffff, { emissive: k.COL.fuso, emissiveIntensity: 2 })); radice.add(cordone);
  // martello (fasi 3 e 5)
  var martello = new T.Group(); radice.add(martello);
  var manico = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 2.6, 12), k.nuovo(0x8a6a48)); manico.rotation.z = Math.PI / 2.6; manico.position.set(1.0, 0.5, 0); martello.add(manico);
  var testa = new T.Mesh(new T.CylinderGeometry(0.28, 0.28, 0.9, 20), M.scuro); testa.rotation.z = Math.PI / 2; martello.add(testa);
  [manico, testa].forEach(function (m) { m.castShadow = true; });

  cimaSag.imposta(function (x, z) { return -0.18 + bolla(x, z) + nervatura(x, z); });
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var y0 = -0.1;
    var curva = fase === 1 ? 0 : fase === 2 ? e : 1;
    var nerv = fase < 3 ? 0 : fase === 3 ? e : 1;
    var dx = fase === 2 ? 1.6 * Math.sin(t * Math.PI * 6) * (1 - 0.3 * t) : 0;
    lam.imposta(function (x, z) { return y0 + curva * bolla(x, z) + nerv * nervatura(x, z); }, function () { return [dx, 0]; });
    disco.position.y = y0 + curva * H + 0.95; incudine.position.y = y0 + curva * H - 0.36;
    ruota.position.x = tRuota(fase, fase === 2 ? Math.min(1, t * 4) : t);
    sagoma.position.y = tSag(fase, Math.min(1, t * 3));
    var so = fase === 5 ? e : 0;
    mat.color.copy(fase === 1 ? cG : cF).lerp(cS, so); mat2.color.copy(mat.color);
    // secondo pannello e saldatura
    lam2.mesh.visible = fase >= 4;
    lam2.imposta(function (x, z) { return y0 + 0.45 * Math.max(0, 1 - Math.pow(z / LZ, 2)) * (1 - (x + 1.6) / 3.2); }, function () { return [LX + 1.6, 0]; });
    cordone.visible = fase === 4;
    cordone.position.set(LX, y0 + 0.1, -LZ + 2 * LZ * e * (k.taglio ? 0.5 : 1));
    // martello che batte
    martello.visible = fase === 3 || fase === 5;
    var colpo = Math.abs(Math.sin(t * Math.PI * 7));
    var mx = fase === 3 ? -1.4 + 2.8 * t : -0.5 + 1.5 * t;
    martello.position.set(mx, y0 + H + 0.65 + 0.7 * colpo, -0.3);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.4,
    camera: { posizione: [6, 7, 12], bersaglio: [0.6, 0.2, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Ruota inglese', ancora: su(ruota, 0, 3.4, 0), visibile: function () { return ruota.position.x > -5; } },
      { testo: 'Lamiera', ancora: su(radice, -2.2, 0.3, -1.4) },
      { testo: 'Sagoma in resina', ancora: su(sagoma, LX - 0.3, -0.5, -LZ), visibile: function () { return sagoma.position.y > -1; } },
      { testo: 'Saldatura', ancora: su(cordone, 0, 0.2, 0), visibile: function () { return cordone.visible; } }
    ]
  };
});
