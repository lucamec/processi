/* Vista 3D – Brasatura a cannello di due tubi con manicotto (Thompson 2007, pp. 312–315).
 * Fasi: 1 flusso, 2 assemblaggio, 3 riscaldamento, 4 apporto, 5 pulitura.
 */
Vista3D.registra('brasatura', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var R = 0.5, Y = 0.4;
  add(radice, k.blocco(-4, 4, -2.2, -1.8, -2.2, 2.2, M.macchina, true));
  [-2.2, 2.2].forEach(function (x) { add(radice, k.blocco(x - 0.3, x + 0.3, -1.8, Y - R, -0.5, 0.5, M.scuro, true)); });
  var mCu = k.nuovo(0xc27a4a, { metalness: 0.6, roughness: 0.35 });
  // tubo fisso, manicotto e tubo che entra, tutti sull'asse a quota Y
  var asse = new T.Group(); asse.position.y = Y; radice.add(asse);
  asse.add(k.tornito([[R - 0.08, 0.6], [R, 0.6], [R, 3.2], [R - 0.08, 3.2]], mCu, 40));
  var man = k.tornito([[R + 0.005, -0.9], [R + 0.12, -0.9], [R + 0.12, 0.9], [R + 0.005, 0.9]], mCu, 40); asse.add(man);
  var tubo = new T.Group(); asse.add(tubo);
  tubo.add(k.tornito([[R - 0.09, -3.2], [R - 0.01, -3.2], [R - 0.01, 0.55], [R - 0.09, 0.55]], mCu, 40));
  var flusso = new T.Mesh(new T.CylinderGeometry(R + 0.005, R + 0.005, 0.9, 40, 1, true).rotateZ(Math.PI / 2), k.nuovo(0xcfb37a, { roughness: 0.9, side: T.DoubleSide })); flusso.position.x = -0.35; tubo.add(flusso);
  // calore
  var mCal = k.nuovo(k.COL.fuso, { transparent: true, opacity: 0, emissive: k.COL.fuso, emissiveIntensity: 1, depthWrite: false });
  var alone = new T.Mesh(new T.CylinderGeometry(R + 0.14, R + 0.14, 1.9, 40, 1, true).rotateZ(Math.PI / 2), mCal); alone.position.y = Y; radice.add(alone);
  // anello di lega
  var mLe = k.nuovo(0xd9dde2, { metalness: 0.8, roughness: 0.25 });
  var anello = new T.Mesh(new T.TorusGeometry(R + 0.06, 0.06, 12, 48).rotateY(Math.PI / 2), mLe); anello.position.set(-0.92, Y, 0); radice.add(anello);
  // cannello e bacchetta
  var cann = new T.Group(); radice.add(cann);
  var corpo = new T.Mesh(new T.CylinderGeometry(0.08, 0.1, 1.8, 16), M.scuro); corpo.position.y = 0.9; cann.add(corpo);
  var fiamma = new T.Mesh(new T.ConeGeometry(0.16, 0.7, 16, 1, true), k.nuovo(k.COL.flusso, { transparent: true, opacity: 0.6, emissive: k.COL.flusso, emissiveIntensity: 0.8, depthWrite: false })); fiamma.rotation.x = Math.PI; fiamma.position.y = -0.35; cann.add(fiamma);
  cann.rotation.z = 0.5; cann.position.set(-0.4, Y + R + 0.75, 0.3);
  var bacch = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 1.8, 8), mLe); bacch.rotation.z = -0.6; radice.add(bacch);

  var cCu = new T.Color(0xc27a4a), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    tubo.position.x = fase === 1 ? -2.0 : fase === 2 ? -2.0 * (1 - e) : 0;
    flusso.visible = fase <= 2;
    var caldo = fase === 3 ? e : fase === 4 ? 1 : fase === 5 ? 1 - e : 0;
    mCal.opacity = 0.35 * caldo;
    cann.visible = fase === 3 || fase === 4; fiamma.scale.y = 0.8 + 0.2 * Math.sin(t * 60);
    anello.visible = fase >= 4; anello.scale.setScalar(fase === 4 ? Math.max(0.05, e) : 1);
    bacch.visible = fase === 4; bacch.position.set(-1.3 + 0.3 * e, Y + R + 0.7 - 0.2 * e, -0.2);
    mLe.color.set(0xd9dde2); if (fase === 5) mLe.color.lerp(cS, e);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.2,
    camera: { posizione: [1.5, 3.5, 7], bersaglio: [0, 0.4, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Manicotto', ancora: su(radice, 0.4, Y + R + 0.15, 0) },
      { testo: 'Cannello', ancora: su(cann, 0, 1.6, 0), visibile: function () { return cann.visible; } },
      { testo: 'Lega d\'apporto', ancora: su(anello, 0, -R - 0.1, 0.3), visibile: function () { return anello.visible; } },
      { testo: 'Pasta di flusso', ancora: su(tubo, -0.35, -R, 0.3), visibile: function () { return flusso.visible; } }
    ]
  };
});
