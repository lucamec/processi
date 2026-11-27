/* Vista 3D – Termoformatura, formatura sottovuoto (Thompson 2007, p. 32).
 * Il foglio è una superficie deformabile: piana, a bolla, appoggiata allo stampo, formata.
 * Fasi: 1 riscaldamento, 2 bolla, 3 salita dello stampo, 4 vuoto, 5 raffreddamento e rifilatura.
 */
Vista3D.registra('termoformatura', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var LX = 4, LZ = 3, H = 1.9, B = 2.8;            // semilati del foglio, altezza stampo, altezza bolla
  var zMax = k.taglio ? 0 : LZ;

  // basamento, piano dello stampo, telaio
  add(radice, k.blocco(-4.6, 4.6, -3.2, -2.8, -3.6, 3.6, M.macchina, true));
  [[-4.4, -LX, -3.4, 3.4], [LX, 4.4, -3.4, 3.4]].forEach(function (r) { add(radice, k.blocco(r[0], r[1], -0.12, 0.12, r[2], r[3], M.stampo)); });
  add(radice, k.blocco(-LX, LX, -0.12, 0.12, -3.4, -LZ, M.stampo));
  if (!k.taglio) add(radice, k.blocco(-LX, LX, -0.12, 0.12, LZ, 3.4, M.stampo));
  [[-4.2, -3.6], [3.6, 4.2]].forEach(function (x) { [-3.2, 3.2].forEach(function (z) { if (!(k.taglio && z > 0)) add(radice, k.blocco(x[0], x[1], -2.8, -0.12, z - 0.25, z + 0.25, M.macchina, true)); }); });

  // stampo maschio (tronco di piramide con spigoli raccordati) che sale
  var stampoG = new T.Group(); radice.add(stampoG);
  add(stampoG, k.blocco(-2.1, 2.1, -0.3, H - 0.08, -1.4, 1.4, M.stampo));
  add(stampoG, k.blocco(-2.6, 2.6, -2.8, -0.3, -1.8, 1.8, M.stampo));
  var tSt = k.traccia([-2.5, -2.5, 0, 0, -2.5], -2.5);

  // altezza dello stampo formato nel punto (x, z): piano a quota H, fianchi ripidi
  function quotaStampo(x, z) {
    var dx = Math.max(0, Math.abs(x) - 2.0), dz = Math.max(0, Math.abs(z) - 1.3);
    var d = Math.sqrt(dx * dx + dz * dz);
    return H * Math.max(0, 1 - Math.pow(d / 0.55, 2));
  }
  function bolla(x, z) { return B * Math.max(0, (1 - Math.pow(x / LX, 2))) * Math.max(0, (1 - Math.pow(z / LZ, 2))); }

  // foglio
  var NX = 80, NZ = k.taglio ? 30 : 60;
  var g = new T.PlaneGeometry(2 * LX, zMax + LZ, NX, NZ);
  g.rotateX(-Math.PI / 2); g.translate(0, 0, (zMax - LZ) / 2);
  var pos = g.attributes.position, n = pos.count;
  var stati = [new Float32Array(n), new Float32Array(n), new Float32Array(n), new Float32Array(n)];
  for (var i = 0; i < n; i++) {
    var x = pos.getX(i), z = pos.getZ(i), q = quotaStampo(x, z), b = bolla(x, z);
    stati[0][i] = 0; stati[1][i] = b; stati[2][i] = Math.max(q, Math.min(b, b * 0.75 + q * 0.4)); stati[3][i] = q;
  }
  var perFase = [0, 1, 2, 3, 3];
  var foglioMat = k.nuovo(k.COL.grezzo, { side: T.DoubleSide, roughness: 0.5, emissive: k.COL.fuso, emissiveIntensity: 0 });
  var foglio = new T.Mesh(g, foglioMat); foglio.castShadow = foglio.receiveShadow = true; radice.add(foglio);
  var cG = new T.Color(k.COL.grezzo), cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);

  // riscaldatore
  var risc = new T.Group(); radice.add(risc);
  add(risc, k.blocco(-3.6, 3.6, 3.4, 3.7, -2.6, 2.6, M.macchina, true));
  var resist = k.nuovo(k.COL.scuro, { emissive: k.COL.fuso, emissiveIntensity: 0 });
  [-2.4, -0.8, 0.8, 2.4].forEach(function (x) { add(risc, k.blocco(x - 0.15, x + 0.15, 3.25, 3.4, -2.4, 2.4, resist, true)); });

  function morb(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function aggiorna(fase, t) {
    var da = fase === 1 ? stati[0] : stati[perFase[fase - 2]], a = stati[perFase[fase - 1]], e = morb(t);
    for (var i = 0; i < n; i++) pos.setY(i, 0.13 + da[i] + (a[i] - da[i]) * e);
    pos.needsUpdate = true; g.computeVertexNormals();
    // colore: sabbia (freddo) → arancione (caldo) → verde (raffreddato)
    if (fase === 1) foglioMat.color.lerpColors(cG, cF, e);
    else if (fase === 5) foglioMat.color.lerpColors(cF, cS, e);
    else foglioMat.color.copy(cF);
    foglioMat.emissiveIntensity = fase === 5 ? 0.2 * (1 - e) : fase === 1 ? 0.2 * e : 0.2;
    stampoG.position.y = tSt(fase, t);
    risc.position.y = fase === 1 ? 0 : 3;
    risc.visible = fase === 1 || (fase === 2 && t < 0.3);
    resist.emissiveIntensity = fase === 1 ? 1.1 : 0;
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -3.2,
    camera: { posizione: [6.5, 7.5, 12.5], bersaglio: [0, 0.2, -0.5] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Riscaldatore', ancora: su(risc, 3.2, 3.7, -2.0), visibile: function () { return risc.visible; } },
      { testo: 'Foglio', ancora: su(radice, -3.4, 0.2, -1.0) },
      { testo: 'Telaio', ancora: su(radice, 4.2, 0.12, -2.8) },
      { testo: 'Stampo maschio', ancora: su(stampoG, 2.2, 0.6, -1.4) }
    ]
  };
});
