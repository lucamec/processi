/* Vista 3D – Laminazione termica 3D su stampo regolabile (Thompson 2007, pp. 228–231).
 * La superficie dello stampo è una lastra sorretta da una griglia di pistoni che ne seguono la quota.
 * Le fibre sono tubi sulla superficie, rivelati con il drawRange mentre il portale le posa.
 * Fasi: 1 forma dello stampo, 2 film PET, 3 posa delle fibre, 4 secondo film e vuoto, 5 cura e sformatura.
 */
Vista3D.registra('laminazione-termica-3d', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var LX = 3.6, LZ = 2.2, H = 1.4, Y0 = -0.4;
  function forma(x, z) { var u = x / LX, w = z / LZ; return H * Math.max(0, 1 - u * u) * (0.55 + 0.45 * Math.max(0, 1 - w * w)) + 0.25 * u * w; }
  var gonfio = 0;
  function quota(x, z) { return Y0 + gonfio * forma(x, z); }

  add(radice, k.blocco(-4.6, 4.6, -2.8, -2.4, -3, 3, M.macchina, true));
  // pistoni
  var pist = [];
  for (var i = -2; i <= 2; i++) for (var j = -1; j <= 1; j++) {
    var p = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 1, 12), M.stampo); p.castShadow = true; radice.add(p);
    pist.push({ m: p, x: i * LX * 0.4, z: j * LZ * 0.6 });
  }
  var mS = k.nuovo(0x8d99a6, { side: T.DoubleSide, roughness: 0.5 });
  var stampo = k.lastra(LX, LZ, 60, 40, mS); radice.add(stampo.mesh);

  // vela: film inferiore, fibre, film superiore
  var vela = new T.Group(); radice.add(vela);
  var mP1 = k.nuovo(k.COL.grezzo, { side: T.DoubleSide, transparent: true, opacity: 0.85, roughness: 0.3 });
  var film1 = k.lastra(LX - 0.1, LZ - 0.1, 60, 40, mP1); vela.add(film1.mesh);
  var mP2 = k.nuovo(k.COL.flusso, { side: T.DoubleSide, transparent: true, opacity: 0.35, roughness: 0.2, depthWrite: false });
  var film2 = k.lastra(LX - 0.1, LZ - 0.1, 60, 40, mP2); vela.add(film2.mesh);
  var mF = k.nuovo(k.COL.fuso, { roughness: 0.4 });
  var NF = 9, SEG = 80, fibre = [], capi = [];
  for (i = 0; i < NF; i++) {
    var a = (i / (NF - 1)), punti = [];
    var x1 = LX - 0.3, z1 = -LZ + 0.3 + a * (2 * LZ - 0.6);
    for (var s = 0; s <= SEG; s++) {
      var u = s / SEG, x = -LX + 0.3 + (x1 + LX - 0.3) * u, z = (-LZ + 0.3) + (z1 + LZ - 0.3) * u + 0.6 * Math.sin(Math.PI * u) * (a - 0.5);
      punti.push(new T.Vector3(x, 0, z));
    }
    capi.push(punti);
    var tubo = new T.Mesh(new T.BufferGeometry(), mF); vela.add(tubo); fibre.push(tubo);
  }
  function ricostruisciFibre() {
    fibre.forEach(function (tb, n) {
      var pts = capi[n].map(function (q) { return new T.Vector3(q.x, quota(q.x, q.z) + 0.07, q.z); });
      tb.geometry.dispose(); tb.geometry = new T.TubeGeometry(new T.CatmullRomCurve3(pts), SEG, 0.035, 5, false);
    });
  }
  ricostruisciFibre();
  function mostra(tb, f) { tb.geometry.setDrawRange(0, Math.floor(Math.max(0, Math.min(1, f)) * SEG) * 5 * 6); }

  // portale a 6 assi
  var portale = new T.Group(); radice.add(portale);
  add(portale, k.blocco(-0.15, 0.15, 3.0, 3.3, -3.0, 3.0, M.scuro, true));
  add(portale, k.blocco(-0.15, 0.15, -2.4, 3.3, -3.0, -2.7, M.scuro, true));
  add(portale, k.blocco(-0.15, 0.15, -2.4, 3.3, 2.7, 3.0, M.scuro, true));
  var testa = new T.Group(); portale.add(testa);
  var asta = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 1, 8), M.macchina); testa.add(asta);
  var ugello = new T.Mesh(new T.ConeGeometry(0.16, 0.3, 16).rotateX(Math.PI), M.scuro); testa.add(ugello);

  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito), cG = new T.Color(k.COL.grezzo), cB = new T.Color(k.COL.flusso), ultimoG = -1;
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var g = fase === 1 ? e : 1;
    if (g !== ultimoG) { gonfio = g; ultimoG = g; stampo.imposta(quota); film1.imposta(function (x, z) { return quota(x, z) + 0.03; }); film2.imposta(function (x, z) { return quota(x, z) + 0.12; }); ricostruisciFibre(); }
    pist.forEach(function (q) { var top = quota(q.x, q.z), h = top + 2.4; q.m.scale.y = h; q.m.position.set(q.x, -2.4 + h / 2, q.z); });
    film1.mesh.visible = fase >= 2;
    var sc = fase === 2 ? e : 1; film1.mesh.scale.set(1, 1, Math.max(0.01, sc));
    // fibre posate una dopo l'altra
    var prog = fase < 3 ? 0 : fase === 3 ? t * NF : NF, corrente = Math.min(NF - 1, Math.floor(prog));
    fibre.forEach(function (tb, n) { mostra(tb, prog - n); });
    portale.visible = fase === 3;
    if (fase === 3) {
      var f = Math.max(0, Math.min(1, prog - corrente)), q = capi[corrente][Math.round(f * SEG)];
      var y = quota(q.x, q.z) + 0.1;
      portale.position.x = q.x; testa.position.set(0, 0, q.z);
      ugello.position.y = y + 0.15; asta.scale.y = 3.0 - (y + 0.3); asta.position.y = (3.0 + y + 0.3) / 2;
    }
    film2.mesh.visible = fase >= 4;
    mP2.opacity = fase === 4 ? 0.35 * e : 0.35;
    // cura e sformatura
    var cura = fase === 5 ? Math.min(1, e * 1.6) : 0;
    mF.color.copy(cF).lerp(cS, cura); mP1.color.copy(cG).lerp(cS, cura); mP2.color.copy(cB).lerp(cS, cura);
    mF.emissive.copy(cF); mF.emissiveIntensity = fase === 5 ? 0.4 * Math.sin(Math.PI * Math.min(1, t * 1.6)) : 0;
    vela.position.y = fase === 5 ? 1.4 * Math.max(0, (t - 0.55) / 0.45) : 0;
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.8,
    camera: { posizione: [4, 8, 13], bersaglio: [0, 0, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Pistoni pneumatici', ancora: su(radice, -LX * 0.8, -1.6, LZ * 0.6) },
      { testo: 'Portale a 6 assi', ancora: su(portale, 0, 3.3, -3.0), visibile: function () { return portale.visible; } },
      { testo: 'Fibre lungo le linee di carico', ancora: su(radice, LX - 0.4, 1.2, LZ - 0.4), visibile: function () { return fibre[0].geometry.drawRange.count > 0; } },
      { testo: 'Stampo regolabile', ancora: su(radice, -LX, Y0, -LZ) }
    ]
  };
});
