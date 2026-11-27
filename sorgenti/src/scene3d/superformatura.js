/* Vista 3D – Formatura superplastica in cavità (Thompson 2007, pp. 92–95).
 * Fasi: 1 carico e riscaldamento, 2 pressione dell'aria, 3 formatura completa, 4 estrazione.
 */
Vista3D.registra('superformatura', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var LX = 5.0, LZ = 3.6, AX = 2.6, AZ = 1.6, W = 0.9, D = 2.4;
  var stampoCaldo = k.nuovo(k.COL.stampo, { metalness: 0.35, roughness: 0.5, emissive: k.COL.fuso, emissiveIntensity: 0 });
  add(radice, k.blocco(-6, 6, -4.2, -3.8, -4.4, 4.4, M.macchina, true));
  // stampo femmina: superficie superiore modellata + blocco
  var cima = k.lastra(LX, LZ, 80, 60, k.nuovo(k.COL.stampo, { side: T.DoubleSide, metalness: 0.35, roughness: 0.5 }));
  function s(u, a) { var v = (a + W - Math.abs(u)) / W; v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); }
  function forma(x, z) { return -D * s(x, AX) * s(z, AZ); }
  cima.imposta(function (x, z) { return forma(x, z) - 0.06; }); radice.add(cima.mesh);
  [[-LX, LX, -3.8, -0.06, -LZ, LZ]].forEach(function (b) { var m = k.blocco(b[0], b[1], b[2], -D - 0.1, b[4], b[5], stampoCaldo); add(radice, m); });
  [[-LX, -AX - W, -D - 0.1, -0.06], [AX + W, LX, -D - 0.1, -0.06]].forEach(function (b) { add(radice, k.blocco(b[0], b[1], b[2], b[3], -LZ, LZ, stampoCaldo)); });
  add(radice, k.blocco(-AX - W, AX + W, -D - 0.1, -0.06, -LZ, -AZ - W, stampoCaldo));
  if (!k.taglio) add(radice, k.blocco(-AX - W, AX + W, -D - 0.1, -0.06, AZ + W, LZ, stampoCaldo));
  // camera di pressione
  var cam = new T.Group(); radice.add(cam);
  [[-LX, LX, 2.2, 2.6, -LZ, LZ], [-LX, -LX + 0.4, 0.06, 2.2, -LZ, LZ], [LX - 0.4, LX, 0.06, 2.2, -LZ, LZ], [-LX + 0.4, LX - 0.4, 0.06, 2.2, -LZ, -LZ + 0.4], [-LX + 0.4, LX - 0.4, 0.06, 2.2, LZ - 0.4, LZ]]
    .forEach(function (b) { add(cam, k.blocco(b[0], b[1], b[2], b[3], b[4], b[5], M.stampo)); });
  // lamiera
  var mat = k.nuovo(k.COL.grezzo, { side: T.DoubleSide, metalness: 0.5, roughness: 0.3, emissive: k.COL.fuso, emissiveIntensity: 0 });
  var lam = k.lastra(LX, LZ, 90, 66, mat); radice.add(lam.mesh);
  var cG = new T.Color(k.COL.grezzo), cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  var tCam = k.traccia([0, 0, 0, 3], 3), tSu = k.traccia([0, 0, 0, 2.8], 0);

  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var p = fase === 1 ? 0 : fase === 2 ? 0.55 * e : fase === 3 ? 0.55 + 0.45 * e : 1;
    var su = tSu(fase, t);
    lam.imposta(function (x, z) {
      // a metà formatura la lamiera è una conca libera; alla fine copia lo stampo
      var libera = -D * 0.8 * Math.max(0, 1 - Math.pow(x / (AX + W), 2)) * Math.max(0, 1 - Math.pow(z / (AZ + W), 2));
      var y = p < 0.55 ? libera * (p / 0.55) : libera + (forma(x, z) - libera) * ((p - 0.55) / 0.45);
      return 0.02 + Math.max(y, forma(x, z)) + su;
    });
    cam.position.y = tCam(fase, t);
    if (fase === 1) mat.color.lerpColors(cG, cF, e); else if (fase === 4) mat.color.lerpColors(cF, cS, e); else mat.color.copy(cF);
    mat.emissiveIntensity = fase < 4 ? 0.25 : 0.25 * (1 - e);
    stampoCaldo.emissiveIntensity = fase < 4 ? 0.12 : 0.04;
  }
  function at(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -4.2,
    camera: { posizione: [8, 10, 17], bersaglio: [0, -0.6, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Camera di pressione', ancora: at(cam, 4.6, 2.6, -3.2) },
      { testo: 'Stampo riscaldato', ancora: at(radice, 4.8, -1.5, -3.4) },
      { testo: 'Lamiera superplastica', ancora: at(radice, -3.6, 0.1, -2.6) }
    ]
  };
});
