/* Vista 3D – Tornitura dell'argilla (Thompson 2007, pp. 168–171).
 * Profili di rivoluzione (asse Y) ricampionati e interpolati. Fasi: 1 centratura, 2 apertura, 3 tiraggio, 4 modellatura, 5 essiccazione.
 */
Vista3D.registra('tornitura-argilla', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, N = 90;
  function ric(poli) {
    var L = [0]; for (var i = 1; i < poli.length; i++) L.push(L[i - 1] + Math.hypot(poli[i][0] - poli[i - 1][0], poli[i][1] - poli[i - 1][1]));
    var out = [], tot = L[L.length - 1], j = 1;
    for (var n = 0; n < N; n++) { var s = tot * n / (N - 1); while (j < L.length - 1 && L[j] < s) j++; var f = (s - L[j - 1]) / ((L[j] - L[j - 1]) || 1); out.push([poli[j - 1][0] + f * (poli[j][0] - poli[j - 1][0]), poli[j - 1][1] + f * (poli[j][1] - poli[j - 1][1])]); }
    return out;
  }
  var s = function (p) { return p.map(function (q) { return [q[0] / 40, (280 - q[1]) / 40]; }); };
  var BLO = ric(s([[0.01, 280], [80, 280], [72, 210], [40, 196], [0.01, 194]]));
  var CIA = ric(s([[0.01, 280], [90, 280], [86, 220], [70, 210], [56, 220], [30, 262], [0.01, 262]]));
  var CIL = ric(s([[0.01, 280], [62, 280], [62, 110], [50, 110], [50, 266], [0.01, 266]]));
  var VAS = ric(s([[0.01, 280], [56, 280], [84, 220], [80, 160], [52, 120], [60, 104], [50, 104], [42, 120], [70, 160], [74, 220], [46, 266], [0.01, 266]]));
  var stati = [BLO, CIA, CIL, VAS, VAS];
  radice.add(k.blocco(-4, 4, -3.4, -3.0, -4, 4, M.macchina, true));
  var base = new T.Mesh(new T.CylinderGeometry(1.6, 2.2, 2.6, 40), M.macchina); base.position.y = -1.7; radice.add(base);
  var testa = new T.Mesh(new T.CylinderGeometry(2.8, 2.8, 0.3, 64), M.stampo); testa.position.y = -0.15; testa.castShadow = true; radice.add(testa);
  var mat = k.nuovo(0xb5653a, { roughness: 0.9, side: T.DoubleSide });
  var argilla = new T.Mesh(new T.BufferGeometry(), mat); argilla.castShadow = true; radice.add(argilla);
  var mani = new T.Group(); radice.add(mani);
  [1, -1].forEach(function (sg) { var m = new T.Mesh(new T.CapsuleGeometry(0.35, 1.2, 6, 12), k.nuovo(0xe0b89a, { roughness: 0.8 })); m.rotation.z = Math.PI / 2; m.position.set(sg * 3.0, 1.2, k.taglio ? -0.8 : 0); mani.add(m); });
  var cF = new T.Color(0xb5653a), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var da = fase === 1 ? BLO : stati[fase - 2], a = stati[fase - 1];
    var pts = []; for (var i = 0; i < N; i++) pts.push(new T.Vector2(Math.max(0.001, da[i][0] + (a[i][0] - da[i][0]) * e), da[i][1] + (a[i][1] - da[i][1]) * e));
    var g = new T.LatheGeometry(pts, 64, k.taglio ? Math.PI / 2 : 0, k.taglio ? Math.PI : Math.PI * 2);
    argilla.geometry.dispose(); argilla.geometry = g;
    if (!k.taglio) argilla.rotation.y = testa.rotation.y = (fase + t) * Math.PI * 6;
    mani.visible = fase <= 4;
    var hy = fase === 3 ? 0.7 + 3.2 * e : fase === 4 ? 2.4 : fase === 2 ? 1.6 : 1.2;
    mani.children[0].position.set(fase === 1 ? 2.4 : 1.9, hy, k.taglio ? -0.8 : 0); mani.children[1].position.set(fase === 1 ? -2.4 : -1.9, hy, k.taglio ? -0.8 : 0);
    if (fase === 5) mat.color.lerpColors(cF, cS, e); else mat.color.copy(cF);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -3.4,
    camera: { posizione: [6, 6, 14], bersaglio: [0, 1.6, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Testa del tornio', ancora: su(testa, 2.6, 0.2, -0.8) },
      { testo: 'Argilla', ancora: su(radice, -1.6, 2.4, 0) },
      { testo: 'Mani del vasaio', ancora: su(mani, 2.4, 1.5, -0.8), visibile: function () { return mani.visible; } }
    ]
  };
});
