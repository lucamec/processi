/* Vista 3D – Rettifica e lucidatura di una lastra d'acciaio (Thompson 2007, pp. 376–383).
 * La mola scorre avanti e indietro; a ogni fase la superficie diventa più liscia (righe meno visibili,
 * rugosità del materiale più bassa) e la mola più fine.
 * Fasi: 1 rettifica, 2 levigatura, 3 lucidatura opaca, 4 lucidatura a specchio.
 */
Vista3D.registra('rettifica-levigatura', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var LX = 2.4, LZ = 1.2, S = 0.2;
  add(radice, k.blocco(-4, 4, -2.4, -2.0, -2.4, 2.4, M.macchina, true));
  add(radice, k.blocco(-3.2, 3.2, -2.0, -0.1, -1.6, 1.6, M.macchina, true));
  add(radice, k.blocco(-3.0, 3.0, -0.1, 0, -1.4, 1.4, M.scuro, true));            // tavola magnetica
  var mAc = k.nuovo(0xc8ccd2, { metalness: 0.9, roughness: 0.75 });
  add(radice, k.blocco(-LX, LX, 0, S, -LZ, LZ, mAc, true));
  // righe di rettifica sulla superficie
  var mRig = new T.LineBasicMaterial({ color: 0x7a8088, transparent: true, opacity: 1 });
  var pts = []; for (var i = 0; i < 40; i++) { var z = -LZ + 0.05 + (2 * LZ - 0.1) * i / 39; pts.push(new T.Vector3(-LX + 0.05, S + 0.003, z), new T.Vector3(LX - 0.05, S + 0.003, z + 0.02 * Math.sin(i))); }
  var righe = new T.LineSegments(new T.BufferGeometry().setFromPoints(pts), mRig); radice.add(righe);
  // mola su carrello
  var carr = new T.Group(); radice.add(carr);
  add(carr, k.blocco(-0.3, 0.3, 1.1, 2.8, -0.2, 0.2, M.macchina, true));
  var mMola = k.nuovo(0x5a6068, { roughness: 0.95 });
  var mola = new T.Mesh(new T.CylinderGeometry(0.6, 0.6, 2.6, 40).rotateX(Math.PI / 2), mMola); mola.position.y = S + 0.6; carr.add(mola);
  var scint = new T.Group(); carr.add(scint);
  var mSc = k.nuovo(0xffffff, { emissive: k.COL.fuso, emissiveIntensity: 2 });
  for (i = 0; i < 14; i++) { var s = new T.Mesh(new T.SphereGeometry(0.025, 4, 3), mSc); scint.add(s); }

  var MOLE = [0x5a6068, 0x8a7a5a, 0xb8b0a0, 0xf0ece4], RUG = [0.75, 0.55, 0.35, 0.05], OP = [1, 0.6, 0.3, 0];
  var cAc = new T.Color(0xc8ccd2), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var i0 = fase - 1, u = k.morbido(Math.min(1, t * 1.2));
    var r0 = i0 === 0 ? 0.85 : RUG[i0 - 1], r1 = RUG[i0];
    mAc.roughness = r0 + (r1 - r0) * u;
    mRig.opacity = (i0 === 0 ? 1 : OP[i0 - 1]) + (OP[i0] - (i0 === 0 ? 1 : OP[i0 - 1])) * u; righe.visible = mRig.opacity > 0.02;
    mMola.color.set(MOLE[i0]); mMola.roughness = fase === 4 ? 1 : 0.95;
    carr.position.x = -LX + 0.4 + (2 * LX - 0.8) * (0.5 - 0.5 * Math.cos(t * Math.PI * 4));
    mola.rotation.z = -t * 60;
    scint.visible = fase <= 2;
    scint.children.forEach(function (s, j) { var h = ((j / 14) + t * 4) % 1; s.position.set(-0.4 - 1.2 * h, S + 0.05 + 0.5 * Math.sin(Math.PI * h), (j % 5 - 2) * 0.25); });
    mAc.color.copy(cAc).lerp(cS, fase === 4 ? 0.6 * u : 0);
    mAc.metalness = 0.75 - 0.12 * i0 - (fase === 4 ? 0.2 * u : 0);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.4,
    camera: { posizione: [3.5, 4.5, 7.5], bersaglio: [0, 0.3, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Mola', ancora: su(carr, 0, S + 1.2, 1.3) },
      { testo: 'Lastra d\'acciaio', ancora: su(radice, -LX, S, LZ) },
      { testo: 'Tavola magnetica', ancora: su(radice, 3.0, -0.05, 1.4) }
    ]
  };
});
