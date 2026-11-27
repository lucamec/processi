/* Vista 3D – Tornitura in lastra (Thompson 2007, pp. 78–81).
 * Il disco di lamiera è una superficie di rivoluzione ricalcolata a ogni passo: la parte già formata segue
 * la cupola del mandrino, il resto prosegue in linea retta (il cono tipico della tornitura).
 * Fasi: 1 caricamento, 2 prime passate, 3 passate successive, 4 rifinitura e rifilatura.
 */
Vista3D.registra('tornitura-lastra', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var Rd = 2.6, XC = 0.4, XT = XC + Rd + 0.06, R = 3.6, N = 40;

  add(radice, k.blocco(-7, 6.5, -3.6, -3.2, -2.6, 2.6, M.macchina, true));
  add(radice, k.blocco(-6.5, -4.6, -3.2, 2.2, -2.0, 2.0, M.macchina));           // testa
  add(radice, k.blocco(4.8, 6.2, -3.2, -0.6, -1.0, 1.0, M.macchina, true));        // supporto contropunta
  var punta = k.cilindroX(XT + 0.05, 5.6, 0.35, M.stampo); radice.add(punta);

  // mandrino: cupola + cilindro, ruota con il tornio
  var giro = new T.Group(); radice.add(giro);
  var prof = [[0, XC + Rd]];
  for (var i = 1; i <= 16; i++) { var a = (i / 16) * Math.PI / 2; prof.push([Rd * Math.sin(a), XC + Rd * Math.cos(a)]); }
  prof.push([Rd, -4.6], [0, -4.6]);
  giro.add(k.tornito(prof, M.stampo, 64));

  // lamiera: profilo ricalcolato (r lungo il disco → posizione)
  var mat = k.nuovo(k.COL.grezzo, { side: T.DoubleSide, metalness: 0.45, roughness: 0.35, emissive: k.COL.fuso, emissiveIntensity: 0 });
  var lam = new T.Mesh(new T.BufferGeometry(), mat); lam.castShadow = true; giro.add(lam);
  function profilo(p, rif) {
    var pts = [], rMax = rif ? R * 0.92 : R;
    var rC = p * R;                              // raggio già formato sulla cupola
    var aC = rC / Rd, xc = XC + Rd * Math.cos(aC), yc = Rd * Math.sin(aC);
    var tx = -Math.sin(aC), ty = Math.cos(aC);   // tangente alla cupola nel punto di contatto
    for (var j = 0; j <= N; j++) {
      var r = (j / N) * rMax, x, y;
      if (r <= rC) { var a2 = r / Rd; x = XC + Rd * Math.cos(a2) + 0.06; y = (Rd + 0.06) * Math.sin(a2); }
      else { var d = r - rC; x = xc + 0.06 + tx * d * (1 - p * 0.15) ; y = yc + ty * d; if (p === 0) { x = XT; y = r; } }
      pts.push(new T.Vector2(Math.max(0.001, y), x));
    }
    return { pts: pts, contatto: [xc, yc] };
  }
  function ricostruisci(p, rif) {
    var pr = profilo(p, rif);
    var g = new T.LatheGeometry(pr.pts, 64, k.taglio ? Math.PI / 2 : 0, k.taglio ? Math.PI : Math.PI * 2);
    g.rotateZ(-Math.PI / 2);
    lam.geometry.dispose(); lam.geometry = g;
    return pr.contatto;
  }

  // rullo di formatura (non ruota col tornio)
  var rullo = new T.Group(); radice.add(rullo);
  var ruota = new T.Mesh(new T.CylinderGeometry(0.45, 0.45, 0.35, 32), M.scuro); ruota.rotation.x = Math.PI / 2; ruota.castShadow = true; rullo.add(ruota);
  var braccio = k.cilindroX(0, 3, 0.12, M.macchina); braccio.rotation.z = -0.6; braccio.position.set(1.2, 0.9, 0); rullo.add(braccio);
  var cF = new T.Color(k.COL.fuso), cG = new T.Color(k.COL.grezzo), cS = new T.Color(k.COL.finito);

  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var p = fase === 1 ? 0 : fase === 2 ? 0.45 * e : fase === 3 ? 0.45 + 0.55 * e : 1;
    var c = ricostruisci(Math.max(0.0001, p), fase === 4 && t > 0.5);
    if (!k.taglio) giro.rotation.x = (fase === 1 ? 0 : (fase - 1 + t)) * Math.PI * 6;
    var an = (p * R) / Rd;
    rullo.visible = fase === 2 || fase === 3;
    rullo.position.set(c[0] + 0.55 * Math.cos(an) + 0.06, c[1] + 0.55 * Math.sin(an), k.taglio ? -0.5 : 0);
    if (fase === 1) mat.color.copy(cG); else if (fase === 4) mat.color.lerpColors(cF, cS, e); else mat.color.copy(cF);
    mat.emissiveIntensity = fase === 2 || fase === 3 ? 0.15 : 0;
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -3.6,
    camera: { posizione: [7, 6, 16], bersaglio: [-0.8, 0, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Mandrino', ancora: su(radice, -2.5, 2.6, 0) },
      { testo: 'Rullo', ancora: su(rullo, 0, 0.5, 0), visibile: function () { return rullo.visible; } },
      { testo: 'Contropunta', ancora: su(radice, 5.2, 0.4, 0) },
      { testo: 'Testa del tornio', ancora: su(radice, -5.6, -0.6, 1.4) }
    ]
  };
});
