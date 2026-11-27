/* Vista 3D – Calibratura (jiggering) di un piatto (Thompson 2007, pp. 176–181).
 * Fasi: 1 carico, 2 profilatura, 3 rifilatura, 4 essiccazione sullo stampo, 5 cottura.
 */
Vista3D.registra('pressatura-ceramica', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, N = 70;
  function ric(poli) {
    var L = [0]; for (var i = 1; i < poli.length; i++) L.push(L[i - 1] + Math.hypot(poli[i][0] - poli[i - 1][0], poli[i][1] - poli[i - 1][1]));
    var out = [], tot = L[L.length - 1], j = 1;
    for (var n = 0; n < N; n++) { var s = tot * n / (N - 1); while (j < L.length - 1 && L[j] < s) j++; var f = (s - L[j - 1]) / ((L[j] - L[j - 1]) || 1); out.push([poli[j - 1][0] + f * (poli[j][0] - poli[j - 1][0]), poli[j - 1][1] + f * (poli[j][1] - poli[j - 1][1])]); }
    return out;
  }
  var sc = function (p) { return p.map(function (q) { return [q[0] / 40, (300 - q[1]) / 40]; }); };
  var FRI = ric(sc([[0.01, 196], [150, 200], [150, 214], [0.01, 210]]).map(function (p) { return [p[0], p[1] + 0.35]; }));
  var PIA = ric(sc([[0.01, 210], [110, 206], [160, 186], [170, 186], [170, 196], [116, 216], [96, 218], [92, 226], [80, 226], [80, 220], [0.01, 222]]).map(function (p) { return [p[0], p[1] + 0.65]; }));
  var RIF = ric(sc([[0.01, 210], [110, 206], [160, 186], [164, 186], [164, 196], [116, 216], [96, 218], [92, 226], [80, 226], [80, 220], [0.01, 222]]).map(function (p) { return [p[0], p[1] + 0.65]; }));
  var stati = [FRI, PIA, RIF, RIF, RIF];
  radice.add(k.blocco(-5, 5, -1.6, -1.2, -4, 4, M.macchina, true));
  var giro = new T.Group(); radice.add(giro);
  var supp = new T.Mesh(new T.CylinderGeometry(0.5, 0.5, 1.2, 24), M.scuro); supp.position.y = -0.6; giro.add(supp);
  giro.add(k.torneroY(sc([[0.01, 300], [186, 300], [186, 196], [170, 196], [116, 216], [96, 218], [80, 220], [0.01, 222]]).map(function (p) { return [p[0], p[1] + 0.65 - 0.05]; }), k.nuovo(0xf1efe9, { roughness: 0.95 }), 64));
  var mat = k.nuovo(0xb5653a, { roughness: 0.9, side: T.DoubleSide });
  var piatto = new T.Mesh(new T.BufferGeometry(), mat); piatto.castShadow = true; giro.add(piatto);
  var braccio = new T.Group(); radice.add(braccio);
  var sag = k.estruso(sc([[230, 140], [590, 140], [580, 156], [556, 172], [520, 178], [486, 186], [468, 192], [460, 198], [360, 198], [354, 192], [334, 186], [300, 178], [264, 172], [240, 156]]).map(function (p) { return [p[0] - 410 / 40, p[1] + 0.65]; }), null, -0.15, 0.15, M.stampo, true);
  braccio.add(sag);
  var asta = new T.Mesh(new T.BoxGeometry(0.6, 3, 0.6), M.macchina); asta.position.y = 5.4; braccio.add(asta);
  var cF = new T.Color(0xb5653a), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var da = fase === 1 ? FRI : stati[fase - 2], a = stati[fase - 1];
    var pts = []; for (var i = 0; i < N; i++) pts.push(new T.Vector2(Math.max(0.001, da[i][0] + (a[i][0] - da[i][0]) * e), da[i][1] + (a[i][1] - da[i][1]) * e));
    var g = new T.LatheGeometry(pts, 64, k.taglio ? Math.PI / 2 : 0, k.taglio ? Math.PI : Math.PI * 2);
    piatto.geometry.dispose(); piatto.geometry = g;
    if (!k.taglio) giro.rotation.y = (fase <= 3 ? fase + t : 0) * Math.PI * 6;
    braccio.position.y = fase === 2 ? 2.0 * (1 - e) : fase === 3 ? 0 : 2.0;
    braccio.visible = fase <= 3;
    if (fase === 5) mat.color.lerpColors(cF, cS, e); else mat.color.copy(cF);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -1.6,
    camera: { posizione: [7, 8, 15], bersaglio: [0, 1.6, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Stampo in gesso', ancora: su(radice, 4.4, 1.0, -1.0) },
      { testo: 'Sagoma', ancora: su(braccio, -4.0, 4.6, 0), visibile: function () { return braccio.visible; } },
      { testo: 'Argilla', ancora: su(radice, -2.0, 3.0, 0) }
    ]
  };
});
