/* Vista 3D – Taglio a getto d'acqua di un disco di vetro (Thompson 2007, pp. 272–275).
 * La testa percorre un cerchio; il solco già tagliato si disegna con setDrawRange.
 * Fasi: 1 acqua in pressione, 2 abrasivo, 3 taglio, 4 sostegno ed estrazione.
 */
Vista3D.registra('taglio-getto-acqua', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var S = 0.25, RD = 1.3, NS = 96;
  add(radice, k.blocco(-4, 4, -2.6, -2.2, -3, 3, M.macchina, true));
  // vasca con acqua e lamelle
  var mV = M.macchina;
  add(radice, k.blocco(-3.2, 3.2, -2.2, -2.0, -2.4, 2.4, mV));
  add(radice, k.blocco(-3.2, -3.0, -2.0, -0.2, -2.4, 2.4, mV)); add(radice, k.blocco(3.0, 3.2, -2.0, -0.2, -2.4, 2.4, mV));
  add(radice, k.blocco(-3.0, 3.0, -2.0, -0.2, -2.4, -2.2, mV)); add(radice, k.blocco(-3.0, 3.0, -2.0, -0.2, 2.2, 2.4, mV));
  var mAcq = k.nuovo(k.COL.flusso, { transparent: true, opacity: 0.22, depthWrite: false });
  add(radice, k.blocco(-3.0, 3.0, -2.0, -0.5, -2.2, 2.2, mAcq, false, mAcq));
  for (var i = -6; i <= 6; i++) add(radice, k.blocco(i * 0.45 - 0.03, i * 0.45 + 0.03, -0.5, -0.02, -2.2, 2.2, M.scuro, true));
  // lastra di vetro (con foro dopo il taglio) e disco
  var mVe = k.nuovo(0xa9d3df, { transparent: true, opacity: 0.55, roughness: 0.1, metalness: 0.1 });
  function cerchio(r, inv) { var p = []; for (var j = 0; j < 64; j++) { var a = (inv ? -1 : 1) * j / 64 * Math.PI * 2; p.push([r * Math.cos(a), r * Math.sin(a)]); } return p; }
  function pianta(pts, fori, mat) { var g = new T.Group(); g.rotation.x = Math.PI / 2; g.add(k.estruso(pts, fori, -S, 0, mat, true)); return g; }
  var RET = [[-2.6, -1.9], [2.6, -1.9], [2.6, 1.9], [-2.6, 1.9]];
  var lastra = pianta(RET, null, mVe); radice.add(lastra);
  var forata = pianta(RET, [cerchio(RD + 0.03, true)], mVe); radice.add(forata);
  var mDi = k.nuovo(0xa9d3df, { transparent: true, opacity: 0.7, roughness: 0.1 });
  var disco = pianta(cerchio(RD), null, mDi); radice.add(disco);
  // solco
  var pts = []; for (i = 0; i <= NS; i++) { var a = i / NS * Math.PI * 2; pts.push(new T.Vector3(RD * Math.cos(a), S + 0.004, RD * Math.sin(a))); }
  var solco = new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: 0x1d232b })); radice.add(solco);
  // portale e testa
  var portale = new T.Group(); radice.add(portale);
  add(portale, k.blocco(-0.2, 0.2, 2.4, 2.8, -2.8, 2.8, M.scuro, true));
  var testa = new T.Group(); portale.add(testa);
  add(testa, k.blocco(-0.25, 0.25, 1.0, 2.4, -0.25, 0.25, M.macchina, true));
  var ugello = new T.Mesh(new T.CylinderGeometry(0.06, 0.12, 0.6, 16), M.stampo); ugello.position.y = 0.7; testa.add(ugello);
  var tubo = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 1.6, 8), M.scuro); tubo.rotation.z = Math.PI / 2; tubo.position.set(-0.9, 1.6, 0); testa.add(tubo);
  var abr = new T.Mesh(new T.CylinderGeometry(0.04, 0.04, 0.8, 8), k.nuovo(0xcfb37a)); abr.rotation.z = 0.8; abr.position.set(0.5, 1.2, 0); testa.add(abr);
  var getto = new T.Mesh(new T.CylinderGeometry(0.035, 0.05, 1, 10), k.nuovo(0xffffff, { emissive: k.COL.flusso, emissiveIntensity: 0.8, transparent: true, opacity: 0.85 })); testa.add(getto);
  var spruzzo = new T.Mesh(new T.ConeGeometry(0.35, 0.5, 16, 1, true), k.nuovo(k.COL.flusso, { transparent: true, opacity: 0.35, depthWrite: false })); testa.add(spruzzo);
  // cunei
  var mCu = k.nuovo(k.COL.fuso);
  var cunei = [0, 1, 2].map(function (n) { var c = new T.Mesh(new T.BoxGeometry(0.35, 0.18, 0.2), mCu); radice.add(c); return { m: c, a: n * 2.1 + 0.6 }; });
  // mola diamantata
  var mola = new T.Mesh(new T.CylinderGeometry(0.6, 0.6, 0.2, 32).rotateX(Math.PI / 2), k.nuovo(0x8a8f96, { roughness: 0.9 })); mola.position.set(2.6, 1.7, 0); radice.add(mola);

  var cV = new T.Color(0xa9d3df), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t), ang = 0, acceso = false;
    if (fase === 3) { ang = t * Math.PI * 2; acceso = true; }
    var hx = fase >= 3 ? RD * Math.cos(ang) : RD, hz = fase >= 3 ? RD * Math.sin(ang) : 0;
    if (fase === 4) { hx = -2.2; hz = -1.6; }
    portale.position.x = hx; testa.position.z = hz;
    getto.visible = spruzzo.visible = acceso || (fase <= 2 && t > 0.2);
    getto.scale.y = acceso ? 2.4 : 0.4; getto.position.y = acceso ? -0.8 : 0.25;
    spruzzo.position.y = -0.55; spruzzo.visible = acceso;
    abr.visible = fase >= 2 && fase <= 3;
    solco.geometry.setDrawRange(0, fase < 3 ? 0 : fase === 3 ? Math.floor(t * NS) + 1 : NS + 1);
    var fatto = fase === 4;
    lastra.visible = !fatto; forata.visible = disco.visible = fatto; solco.visible = !fatto;
    cunei.forEach(function (c, n) {
      var dentro = fase === 3 ? Math.min(1, Math.max(0, t * 3 - n * 0.6)) : fase === 4 ? 1 : 0;
      var r = RD + 0.9 - 0.9 * dentro;
      c.m.visible = fase >= 3; c.m.position.set(r * Math.cos(c.a), -0.11, r * Math.sin(c.a)); c.m.rotation.y = -c.a;
    });
    disco.position.y = fatto ? 1.4 * e : 0;
    mDi.color.copy(cV).lerp(cS, fatto ? e : 0);
    mola.visible = fatto; mola.rotation.z = t * 20;
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.6,
    camera: { posizione: [5, 6.5, 9.5], bersaglio: [0, 0.2, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Testa a getto d\'acqua', ancora: su(testa, 0.25, 2.2, 0) },
      { testo: 'Lastra di vetro', ancora: su(radice, -2.6, S, 1.9) },
      { testo: 'Vasca d\'acqua', ancora: su(radice, 3.2, -1.2, 2.4) },
      { testo: 'Cunei di sostegno', ancora: su(radice, (RD + 0.2) * Math.cos(0.6), 0, (RD + 0.2) * Math.sin(0.6)), visibile: function () { return cunei[0].m.visible; } }
    ]
  };
});
