/* Vista 3D – Imbutitura profonda inversa (Thompson 2007, pp. 88–91).
 * La lamiera è una superficie di rivoluzione: i profili delle fasi sono ricampionati alla stessa lunghezza
 * e interpolati punto per punto, così il materiale "scorre" da una forma all'altra.
 * Fasi: 1 carico, 2 prima imbutitura, 3 imbutitura inversa, 4 estrazione.
 */
Vista3D.registra('imbutitura-profonda', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var N = 90;
  function ric(poli) { // ricampiona per lunghezza d'arco
    var L = [0]; for (var i = 1; i < poli.length; i++) L.push(L[i - 1] + Math.hypot(poli[i][0] - poli[i - 1][0], poli[i][1] - poli[i - 1][1]));
    var out = [], tot = L[L.length - 1], j = 1;
    for (var n = 0; n < N; n++) { var s = tot * n / (N - 1); while (j < L.length - 1 && L[j] < s) j++; var f = (s - L[j - 1]) / ((L[j] - L[j - 1]) || 1); out.push([poli[j - 1][0] + f * (poli[j][0] - poli[j - 1][0]), poli[j - 1][1] + f * (poli[j][1] - poli[j - 1][1])]); }
    return out;
  }
  var S0 = ric([[0, 0.1], [3.85, 0.1]]);
  var S1 = ric([[0, 0.15], [2.15, 0.15], [2.2, 0.05], [2.2, -3.1]]);
  var S2 = ric([[0, -3.75], [0.85, -3.75], [0.9, -3.6], [0.9, 0.1], [1.0, 0.15], [2.15, 0.15], [2.2, 0.05], [2.2, -3.1]]);
  var stati = [S0, S1, S2, S2];

  add(radice, k.blocco(-5, 5, -4.8, -4.4, -3, 3, M.macchina, true));
  add(radice, k.torneroY([[1.0, 0], [2.0, 0], [2.0, -4.4], [1.0, -4.4]], M.stampo, 64));
  var prem = new T.Group(); radice.add(prem);
  prem.add(k.torneroY([[2.25, 1.4], [3.9, 1.4], [3.9, 0.25], [2.25, 0.25]], M.stampo, 64));
  var punz = new T.Group(); radice.add(punz);
  punz.add(k.torneroY([[0, 2.9], [0.8, 2.9], [0.8, -3.6], [0, -3.6]], M.stampo, 48));
  var mat = k.nuovo(k.COL.grezzo, { side: T.DoubleSide, metalness: 0.5, roughness: 0.3 });
  var lam = new T.Mesh(new T.BufferGeometry(), mat); lam.castShadow = true; radice.add(lam);
  var cG = new T.Color(k.COL.grezzo), cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  var tPrem = k.traccia([0, -3.2, -3.2, 0], 0), tPunz = k.traccia([3.8, 3.8, 0, 3.8], 3.8), tSu = k.traccia([0, 0, 0, 5.2], 0);

  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var da = fase === 1 ? S0 : stati[fase - 2], a = stati[fase - 1];
    var pts = [];
    for (var i = 0; i < N; i++) pts.push(new T.Vector2(Math.max(0.001, da[i][0] + (a[i][0] - da[i][0]) * e), da[i][1] + (a[i][1] - da[i][1]) * e + tSu(fase, t)));
    var g = new T.LatheGeometry(pts, 64, k.taglio ? Math.PI / 2 : 0, k.taglio ? Math.PI : Math.PI * 2);
    lam.geometry.dispose(); lam.geometry = g;
    prem.position.y = tPrem(fase, t); punz.position.y = tPunz(fase, t);
    if (fase === 1) mat.color.copy(cG); else if (fase === 4) mat.color.lerpColors(cF, cS, e); else mat.color.copy(cF);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -4.8,
    camera: { posizione: [8, 4.5, 18], bersaglio: [0, -1.6, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Premilamiera', ancora: su(prem, -3.6, 1.4, -0.5) },
      { testo: 'Punzone', ancora: su(punz, 0, 2.9, -0.4) },
      { testo: 'Matrice', ancora: su(radice, 2.0, -3.8, -0.3) }
    ]
  };
});
