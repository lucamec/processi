/* Vista 3D – Pannello di parete a telaio di legno (Thompson 2007, pp. 344–347).
 * Il pannello è costruito in piano (piano XZ) e nella fase 5 ruota in verticale attorno al bordo inferiore.
 * Fasi: 1 taglio a misura, 2 posizionamento, 3 piastre chiodate, 4 pannello OSB, 5 messa in opera.
 */
Vista3D.registra('strutture-telaio-legno', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var LX = 2.4, LZ = 1.6, S = 0.15, H = 0.2, RITTI = [-2.2, -1.1, 0, 1.1, 2.2];
  add(radice, k.blocco(-4, 4, -2.4, -2.0, -2.6, 2.6, M.macchina, true));
  add(radice, k.blocco(-3.0, 3.0, -2.0, -0.02, -2.0, 2.0, M.macchina, true));
  var mPino = k.nuovo(0xe2c48e, { roughness: 0.75 });
  // il pannello ruota attorno al bordo z = +LZ
  var perno = new T.Group(); perno.position.set(0, 0, LZ); radice.add(perno);
  var pann = new T.Group(); pann.position.set(0, 0, -LZ); perno.add(pann);
  var pezzi = [];
  [-LZ + S / 2, LZ - S / 2].forEach(function (z, i) { var m = k.blocco(-LX, LX, 0, H, z - S / 2, z + S / 2, mPino, true); pann.add(m); pezzi.push({ m: m, y0: m.position.y, d: i * 0.3 }); });
  RITTI.forEach(function (x, i) { var m = k.blocco(x - S / 2, x + S / 2, 0, H, -LZ + S, LZ - S, mPino, true); pann.add(m); pezzi.push({ m: m, y0: m.position.y, d: 0.6 + i * 0.25 }); });
  // piastre chiodate
  var mAc = k.nuovo(0x9aa6b2, { metalness: 0.7, roughness: 0.35 });
  var piastre = [];
  RITTI.forEach(function (x) { [-LZ + S, LZ - S].forEach(function (z) { var p = new T.Mesh(new T.BoxGeometry(0.3, 0.01, 0.3), mAc); p.position.set(x, H + 0.006, z - Math.sign(z) * 0.05); pann.add(p); piastre.push(p); }); });
  var pressa = new T.Group(); radice.add(pressa);
  add(pressa, k.blocco(-0.3, 0.3, 0.5, 2.6, -0.3, 0.3, M.scuro, true));
  // pannello OSB e pistola
  var mOsb = k.nuovo(0xc9a56b, { roughness: 0.9, transparent: true, opacity: 0.95 });
  var osb = new T.Mesh(new T.BoxGeometry(2 * LX, 0.05, 2 * LZ), mOsb); pann.add(osb);
  var pistola = new T.Group(); radice.add(pistola);
  add(pistola, k.blocco(-0.1, 0.1, 0.3, 1.0, -0.1, 0.1, M.scuro, true)); add(pistola, k.blocco(-0.1, 0.5, 0.9, 1.1, -0.1, 0.1, M.scuro, true));

  var cP = new T.Color(0xe2c48e), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    pezzi.forEach(function (p) {
      var u = fase === 1 ? Math.max(0, Math.min(1, (t * 2.2 - p.d))) : 1;
      p.m.position.y = p.y0 + 2.5 * (1 - k.morbido(u));
      p.m.visible = fase > 1 || u > 0;
    });
    var nP = fase < 3 ? 0 : fase === 3 ? Math.floor(t * piastre.length + 0.5) : piastre.length;
    piastre.forEach(function (p, i) { p.visible = i < nP; });
    pressa.visible = fase === 3;
    if (fase === 3) { var c = piastre[Math.min(piastre.length - 1, Math.floor(t * piastre.length))]; pressa.position.set(c.position.x, H + 0.4 * Math.abs(Math.sin(t * piastre.length * Math.PI)), c.position.z); }
    osb.visible = fase >= 4; osb.position.y = H + 0.035 + (fase === 4 ? 1.5 * (1 - Math.min(1, e * 2)) : 0);
    pistola.visible = fase === 4 && t > 0.5;
    var u = Math.max(0, (t - 0.5) / 0.5); pistola.position.set(-LX + 2 * LX * u, H + 0.06, LZ * (u < 0.5 ? -0.9 : 0.9));
    perno.rotation.x = fase === 5 ? Math.PI / 2 * e : 0;
    mOsb.color.set(0xc9a56b); if (fase === 5) mOsb.color.lerp(cS, e);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.4,
    camera: { posizione: [5, 6.5, 10.5], bersaglio: [0, 0.8, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Ritti e correnti in pino', ancora: su(pann, -LX, H, -LZ) },
      { testo: 'Pressa per piastre chiodate', ancora: su(pressa, 0.3, 2.2, 0), visibile: function () { return pressa.visible; } },
      { testo: 'Pannello OSB', ancora: su(osb, LX, 0.05, LZ), visibile: function () { return osb.visible; } }
    ]
  };
});
