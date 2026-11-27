/* Vista 3D – Stampaggio della polpa di carta (Thompson 2007, pp. 202–205).
 * Stampo maschio a sei coppette (portauova) immerso nella vasca; stampo di trasferimento che si capovolge
 * e posa il guscio sul nastro; forno di essiccazione.
 * Fasi: 1 formatura, 2 emersione, 3 trasferimento, 4 essiccazione.
 */
Vista3D.registra('polpa-carta', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var LX = 1.4, LZ = 0.9, P = 0.45, XV = -2.2, YS = 2.0, YN = -0.7;
  function coppe(x, z) {
    var s = 0;
    for (var i = -1; i <= 1; i++) for (var j = -1; j <= 1; j += 2) {
      var dx = x - i * 0.9, dz = z - j * 0.45; s += P * Math.exp(-(dx * dx + dz * dz) / 0.06);
    }
    return Math.min(P, s);
  }

  // banco, vasca e impasto
  add(radice, k.blocco(-4.4, 6.8, -2.8, -2.4, -2.2, 2.2, M.macchina, true));
  var mV = M.macchina;
  add(radice, k.blocco(-4.0, -0.4, -2.4, -2.2, -1.6, 1.6, mV));
  add(radice, k.blocco(-4.0, -3.8, -2.2, 0, -1.6, 1.6, mV));
  add(radice, k.blocco(-0.6, -0.4, -2.2, 0, -1.6, 1.6, mV));
  add(radice, k.blocco(-3.8, -0.6, -2.2, 0, -1.6, -1.4, mV));
  add(radice, k.blocco(-3.8, -0.6, -2.2, 0, 1.4, 1.6, mV));
  var mImp = k.nuovo(0x9c8462, { transparent: true, opacity: 0.75, roughness: 0.3, side: T.DoubleSide });
  add(radice, k.blocco(-3.8, -0.6, -2.2, -0.3, -1.4, 1.4, mImp, false, mImp));

  // stampo maschio su braccio
  var stampo = new T.Group(); radice.add(stampo);
  var sup = k.lastra(LX, LZ, 70, 46, M.stampo); sup.imposta(function (x, z) { return -coppe(x, z); }); stampo.add(sup.mesh);
  add(stampo, k.blocco(-LX, LX, 0, 0.6, -LZ, LZ, M.stampo));
  var asta = new T.Mesh(new T.CylinderGeometry(0.14, 0.14, 4, 16), M.scuro); asta.position.y = 2.6; stampo.add(asta);

  // guscio di polpa: stessa geometria, tre copie (sullo stampo, sul trasferimento, sul nastro)
  var mG = k.nuovo(k.COL.grezzo, { side: T.DoubleSide, roughness: 0.9, transparent: true, opacity: 1 });
  var gu = k.lastra(LX + 0.04, LZ + 0.04, 70, 46, mG); gu.imposta(function (x, z) { return -coppe(x, z); });
  var gS = gu.mesh; gS.position.y = -0.06; stampo.add(gS);

  // stampo di trasferimento (poliuretano), femmina
  var trasf = new T.Group(); radice.add(trasf);
  var mPU = k.nuovo(0xd8c08a, { roughness: 0.7, side: T.DoubleSide });
  var ts = k.lastra(LX, LZ, 70, 46, mPU); ts.imposta(function (x, z) { return -coppe(x, z); }); trasf.add(ts.mesh);
  add(trasf, k.blocco(-LX - 0.12, LX + 0.12, -1.0, -0.5, -LZ - 0.12, LZ + 0.12, mPU));
  add(trasf, k.blocco(-LX - 0.12, -LX, -0.5, 0, -LZ - 0.12, LZ + 0.12, mPU));
  add(trasf, k.blocco(LX, LX + 0.12, -0.5, 0, -LZ - 0.12, LZ + 0.12, mPU));
  add(trasf, k.blocco(-LX, LX, -0.5, 0, -LZ - 0.12, -LZ, mPU));
  add(trasf, k.blocco(-LX, LX, -0.5, 0, LZ, LZ + 0.12, mPU));
  var gT = new T.Mesh(gu.mesh.geometry, mG); gT.position.y = 0.04; gT.castShadow = true; trasf.add(gT);

  // nastro e forno
  add(radice, k.blocco(0.4, 6.8, YN - 0.25, YN, -1.3, 1.3, M.scuro));
  var gC = new T.Mesh(gu.mesh.geometry, mG); gC.rotation.z = Math.PI; gC.castShadow = true; radice.add(gC);
  var mF = k.nuovo(k.COL.fuso, { transparent: true, opacity: 0.1, depthWrite: false, side: T.DoubleSide });
  var forno = new T.Mesh(new T.BoxGeometry(3.4, 2.0, 2.8), mF); forno.position.set(5.0, YN + 1.0, 0); radice.add(forno);
  forno.add(new T.LineSegments(new T.EdgesGeometry(forno.geometry), new T.LineBasicMaterial({ color: k.COL.fuso })));

  var cG = new T.Color(k.COL.grezzo), cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito), cU = cG.clone().lerp(cF, 0.3);
  var R0 = [2.3, 1.0, 0], SU = [XV, YS + 0.0, 0], GIU = [2.3, YN + 0.04, Math.PI];
  function mix(a, b, u) { return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u]; }
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    // stampo
    var ys = fase === 1 ? YS - (YS + 1.0) * k.morbido(Math.min(1, t * 2)) : fase === 2 ? -1.0 + (YS + 1.0) * e : YS;
    stampo.position.set(XV, ys, 0);
    // trasferimento
    var q = R0;
    if (fase === 3) {
      if (t < 0.3) q = mix(R0, SU, k.morbido(t / 0.3));
      else if (t < 0.45) q = SU;
      else q = mix(SU, GIU, k.morbido((t - 0.45) / 0.55));
    } else if (fase === 4) q = mix(GIU, R0, k.morbido(Math.min(1, t * 2.5)));
    trasf.position.set(q[0], q[1] - 0.08, 0); trasf.rotation.z = q[2];
    // guscio
    var sulloStampo = fase === 1 ? t > 0.5 : fase === 2 || (fase === 3 && t < 0.4);
    gS.visible = sulloStampo; gT.visible = fase === 3 && t >= 0.4; gC.visible = fase === 4;
    mG.opacity = fase === 1 ? Math.min(1, Math.max(0, (t - 0.5) * 2.5)) : 1;
    gC.position.set(2.3 + 2.7 * e, YN + 0.02, 0);
    if (fase === 4) mG.color.copy(cU).lerp(cS, Math.max(0, (e - 0.3) / 0.7)); else mG.color.copy(cU);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.8,
    camera: { posizione: [1.4, 8.5, 19], bersaglio: [1.3, 0, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Vasca di impasto', ancora: su(radice, -3.6, -0.6, 1.6) },
      { testo: 'Stampo con rete inox', ancora: su(stampo, -LX, 0.6, 0) },
      { testo: 'Stampo di trasferimento', ancora: su(trasf, -LX, -0.6, LZ) },
      { testo: 'Forno', ancora: su(radice, 6.6, YN + 2.0, -1.4) }
    ]
  };
});
