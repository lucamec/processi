/* Vista 3D – Soffiatura del vetro artigianale (Thompson 2007, pp. 152–157).
 * Il vetro è un solido di rivoluzione attorno alla canna (asse X); profili ricampionati e interpolati.
 * Fasi: 1 raccolta, 2 marveratura, 3 soffiatura, 4 formatura, 5 ricottura.
 */
Vista3D.registra('soffiatura-vetro', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var N = 90;
  function ric(poli) {
    var L = [0]; for (var i = 1; i < poli.length; i++) L.push(L[i - 1] + Math.hypot(poli[i][0] - poli[i - 1][0], poli[i][1] - poli[i - 1][1]));
    var out = [], tot = L[L.length - 1], j = 1;
    for (var n = 0; n < N; n++) { var s = tot * n / (N - 1); while (j < L.length - 1 && L[j] < s) j++; var f = (s - L[j - 1]) / ((L[j] - L[j - 1]) || 1); out.push([poli[j - 1][0] + f * (poli[j][0] - poli[j - 1][0]), poli[j - 1][1] + f * (poli[j][1] - poli[j - 1][1])]); }
    return out;
  }
  function ellisse(cx, rx, ry, n) { var p = []; for (var i = 0; i <= n; i++) { var a = -Math.PI / 2 + Math.PI * i / n; p.push([Math.max(0.001, ry * Math.cos(a)), cx + rx * Math.sin(a)]); } return p; }
  // profili [r, x] dal punto di attacco (x = 0, r piccolo) intorno all'esterno e ritorno all'interno
  var GOC = ric([[0.2, 0]].concat(ellisse(0.9, 0.9, 0.75, 20)).concat([[0.001, 1.8], [0.001, 1.79], [0.12, 0.9], [0.12, 0.05]]));
  var PAR = ric([[0.2, 0], [0.7, 0.2], [0.7, 2.0], [0.4, 2.3], [0.001, 2.35], [0.001, 2.3], [0.12, 1.0], [0.12, 0.05]]);
  var BOL = ric([[0.2, 0]].concat(ellisse(1.9, 1.8, 1.4, 24)).concat([[0.001, 3.7], [0.001, 3.55]]).concat(ellisse(1.9, 1.65, 1.25, 24).reverse()).concat([[0.12, 0.05]]));
  var VAS = ric([[0.2, 0], [0.25, 0.3], [1.1, 0.8], [1.55, 1.8], [1.5, 3.1], [1.2, 3.8], [0.001, 3.9], [0.001, 3.78], [1.1, 3.68], [1.4, 3.05], [1.43, 1.85], [1.0, 0.9], [0.14, 0.35], [0.12, 0.05]]);
  var stati = [GOC, PAR, BOL, VAS, VAS];
  add(radice, k.blocco(-6, 7, -3.2, -2.8, -3, 3, M.macchina, true));
  var canna = k.cilindroX(-7, 0.1, 0.11, M.scuro); radice.add(canna);
  var mat = k.nuovo(k.COL.fuso, { emissive: 0xff5a00, emissiveIntensity: 0.7, roughness: 0.15, metalness: 0, side: T.DoubleSide, transparent: true, opacity: 0.92 });
  var vetro = new T.Mesh(new T.BufferGeometry(), mat); vetro.castShadow = true; radice.add(vetro);
  var giro = 0;
  // crogiolo, marver, gloryhole, forno
  var crog = new T.Group(); radice.add(crog);
  add(crog, k.blocco(-0.5, 3.8, -2.8, -1.1, -1.8, 1.8, M.macchina)); add(crog, k.blocco(-0.3, 3.6, -1.4, -1.1, -1.6, 1.6, k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 0.9 }), true));
  var marver = add(radice, k.blocco(-0.5, 4.5, -2.8, -0.75, -1.5, 1.5, k.nuovo(0xc5ccd3, { metalness: 0.8, roughness: 0.2 })));
  var glory = new T.Mesh(new T.TorusGeometry(2.0, 0.5, 16, 48), k.nuovo(0x5b6773, { emissive: 0xff6a00, emissiveIntensity: 0.5 })); glory.rotation.y = Math.PI / 2; glory.position.x = 4.6; radice.add(glory);
  var vetroForno = M.vetro.clone(); var forno = new T.Mesh(new T.BoxGeometry(5, 4.2, 4), vetroForno); forno.position.set(2, -0.4, 0); forno.renderOrder = 3; radice.add(forno);
  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var da = fase === 1 ? GOC : stati[fase - 2], a = stati[fase - 1];
    var pts = []; for (var i = 0; i < N; i++) pts.push(new T.Vector2(Math.max(0.001, da[i][0] + (a[i][0] - da[i][0]) * e), da[i][1] + (a[i][1] - da[i][1]) * e));
    var g = new T.LatheGeometry(pts, 64, k.taglio ? Math.PI / 2 : 0, k.taglio ? Math.PI : Math.PI * 2); g.rotateZ(-Math.PI / 2);
    vetro.geometry.dispose(); vetro.geometry = g;
    crog.visible = fase === 1; marver.visible = fase === 2; glory.visible = fase === 3 || fase === 4; forno.visible = fase === 5;
    if (fase === 5) { mat.color.lerpColors(cF, cS, e); mat.emissiveIntensity = 0.7 * (1 - e); } else { mat.color.copy(cF); mat.emissiveIntensity = 0.7; }
    if (!k.taglio) { vetro.rotation.x = (fase + t) * Math.PI * 4; canna.rotation.x = vetro.rotation.x; }
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -3.2,
    camera: { posizione: [1, 5, 13], bersaglio: [0.6, -0.3, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Canna da soffio', ancora: su(radice, -4.5, 0.2, 0) },
      { testo: 'Crogiolo', ancora: su(crog, 3.6, -1.1, -1.6), visibile: function () { return crog.visible; } },
      { testo: 'Marver', ancora: su(marver, 2.4, 1.0, -1.4), visibile: function () { return marver.visible; } },
      { testo: 'Gloryhole', ancora: su(glory, 0, 2.5, 0), visibile: function () { return glory.visible; } },
      { testo: 'Forno di ricottura', ancora: su(forno, 2.4, 2.1, -1.8), visibile: function () { return forno.visible; } }
    ]
  };
});
