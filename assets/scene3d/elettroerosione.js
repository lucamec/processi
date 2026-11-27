/* Vista 3D – Elettroerosione a tuffo (Thompson 2007, pp. 254–259).
 * Un solo parametro s (affondamento dell'elettrodo) guida tutto: la superficie del pezzo è una lastra
 * scavata dove la faccia dell'elettrodo è scesa sotto quota 0, quindi la cavità copia l'elettrodo.
 * Fasi: 1 elettrodo, 2 immersione, 3 sgrossatura, 4 finitura, 5 estrazione.
 */
Vista3D.registra('elettroerosione', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var D = 0.9, LX = 2.4, LZ = 1.7, GAP = 0.03;
  function liscio(a, b, x) { var u = Math.max(0, Math.min(1, (x - a) / (b - a))); return u * u * (3 - 2 * u); }
  function forma(x, z) {   // profondità della faccia dell'elettrodo
    var f = D * liscio(1.75, 1.4, Math.abs(x)) * liscio(1.05, 0.75, Math.abs(z));
    return Math.max(0, f - 0.55 * D * Math.exp(-(x * x + z * z) / 0.12));
  }

  add(radice, k.blocco(-4, 4, -3.0, -2.6, -3, 3, M.macchina, true));
  // vasca
  var mV = M.macchina;
  add(radice, k.blocco(-3.4, 3.4, -2.6, -2.4, -2.4, 2.4, mV));
  add(radice, k.blocco(-3.4, -3.2, -2.4, 1.4, -2.4, 2.4, mV));
  add(radice, k.blocco(3.2, 3.4, -2.4, 1.4, -2.4, 2.4, mV));
  add(radice, k.blocco(-3.2, 3.2, -2.4, 1.4, -2.4, -2.2, mV));
  add(radice, k.blocco(-3.2, 3.2, -2.4, 1.4, 2.2, 2.4, mV));
  // pezzo: base + pareti + superficie scavabile
  var mAc = k.nuovo(0x8d99a6, { metalness: 0.5, roughness: 0.45, side: T.DoubleSide });
  add(radice, k.blocco(-LX, LX, -2.4, -D - 0.05, -LZ, LZ, mAc));
  add(radice, k.blocco(-LX, -LX + 0.02, -D - 0.05, 0, -LZ, LZ, mAc));
  add(radice, k.blocco(LX - 0.02, LX, -D - 0.05, 0, -LZ, LZ, mAc));
  add(radice, k.blocco(-LX, LX, -D - 0.05, 0, -LZ, -LZ + 0.02, mAc));
  add(radice, k.blocco(-LX, LX, -D - 0.05, 0, LZ - 0.02, LZ, mAc));
  var sup = k.lastra(LX, LZ, 90, 64, mAc); radice.add(sup.mesh);
  // fluido dielettrico
  var mOl = k.nuovo(k.COL.flusso, { transparent: true, opacity: 0.18, depthWrite: false });
  var olio = add(radice, k.blocco(-3.2, 3.2, -2.4, 1.2, -2.2, 2.2, mOl, false, mOl));

  // elettrodo: faccia sagomata + corpo + mandrino
  var elet = new T.Group(); radice.add(elet);
  var mCu = k.nuovo(0xc27a4a, { metalness: 0.6, roughness: 0.4, side: T.DoubleSide });
  var faccia = k.lastra(1.9, 1.15, 70, 48, mCu); faccia.imposta(function (x, z) { return -forma(x, z); }); elet.add(faccia.mesh);
  add(elet, k.blocco(-1.9, 1.9, 0, 0.9, -1.15, 1.15, mCu));
  var mand = new T.Mesh(new T.CylinderGeometry(0.25, 0.25, 3, 20), M.scuro); mand.position.y = 2.4; elet.add(mand);
  // scintille
  var mSc = k.nuovo(0xffffff, { emissive: k.COL.fuso, emissiveIntensity: 2.5 });
  var rnd = k.rng(3), scint = [];
  for (var i = 0; i < 40; i++) { var m = new T.Mesh(new T.SphereGeometry(0.035, 6, 4), mSc); radice.add(m); scint.push({ m: m, x: (rnd() * 2 - 1) * 1.6, z: (rnd() * 2 - 1) * 0.95, f: rnd() }); }

  var cA = new T.Color(0x8d99a6), cS = new T.Color(k.COL.finito), cCu = new T.Color(0xc27a4a), cNero = new T.Color(0x5a3a2a), ultimo = -1;
  function scava(s) {
    if (Math.abs(s - ultimo) < 1e-4) return; ultimo = s;
    sup.imposta(function (x, z) { return -Math.max(0, forma(x, z) - D + s); });
  }
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var s = fase <= 2 ? 0 : fase === 3 ? 0.8 * D * t : fase === 4 ? 0.8 * D + 0.2 * D * t : D;
    scava(s);
    var yEl = fase === 1 ? D + 2.2 : fase === 2 ? D + 2.2 - 2.2 * e : fase === 5 ? D - s + 2.4 * e : D - s;
    elet.position.y = yEl + GAP;
    elet.rotation.y = fase === 3 || fase === 4 ? 0.04 * Math.sin(t * Math.PI * 10) : 0;
    olio.visible = fase >= 2 && !(fase === 5 && t > 0.7);
    mOl.opacity = fase === 2 ? 0.18 * e : 0.18;
    var acc = fase === 3 || fase === 4;
    scint.forEach(function (p, n) {
      var vis = acc && ((p.f + t * (fase === 3 ? 9 : 4)) % 1) < 0.25;
      p.m.visible = vis;
      if (vis) p.m.position.set(p.x, -Math.max(0, forma(p.x, p.z) - D + s) + 0.02, p.z);
    });
    mCu.color.copy(cCu).lerp(cNero, fase === 3 ? 0.4 * e : fase >= 4 ? 0.4 : 0);
    mAc.color.copy(cA).lerp(cS, fase === 5 ? e : 0);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -3.0,
    camera: { posizione: [4.5, 7.5, 10], bersaglio: [0, 0, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Elettrodo di rame (−)', ancora: su(elet, -1.9, 0.9, 1.15) },
      { testo: 'Pezzo in acciaio (+)', ancora: su(radice, LX, -1.2, LZ) },
      { testo: 'Olio dielettrico', ancora: su(radice, 3.2, 1.0, -2.2), visibile: function () { return olio.visible; } }
    ]
  };
});
