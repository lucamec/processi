/* Vista 3D – Forgiatura a stampo (Thompson 2007, pp. 114–118).
 * Il pezzo è un solido di rivoluzione: i profili (billetta, sbozzo, tappo con bava) sono interpolati punto per punto.
 * Fasi: 1 billetta calda, 2 sbozzatura a stampo aperto, 3 stampaggio a stampo chiuso, 4 sbavatura.
 */
Vista3D.registra('forgiatura', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var N = 70;
  function ric(poli) {
    var L = [0]; for (var i = 1; i < poli.length; i++) L.push(L[i - 1] + Math.hypot(poli[i][0] - poli[i - 1][0], poli[i][1] - poli[i - 1][1]));
    var out = [], tot = L[L.length - 1], j = 1;
    for (var n = 0; n < N; n++) { var s = tot * n / (N - 1); while (j < L.length - 1 && L[j] < s) j++; var f = (s - L[j - 1]) / ((L[j] - L[j - 1]) || 1); out.push([poli[j - 1][0] + f * (poli[j][0] - poli[j - 1][0]), poli[j - 1][1] + f * (poli[j][1] - poli[j - 1][1])]); }
    return out;
  }
  // profili (r, y) dall'asse in basso, in senso orario fino all'asse in alto
  var BIL = ric([[0, 0], [0.75, 0], [0.75, 2.5], [0, 2.5]]);
  var SBO = ric([[0, 0], [1.5, 0], [1.5, 1.25], [0, 1.25]]);
  var FOR = ric([[0, 0], [1.75, 0], [1.75, 0.25], [2.75, 0.25], [2.75, 0.4], [1.75, 0.4], [1.75, 0.95], [1.55, 1.15], [0, 1.15]]);
  var SBA = ric([[0, 0], [1.75, 0], [1.75, 0.25], [1.76, 0.25], [1.76, 0.4], [1.75, 0.4], [1.75, 0.95], [1.55, 1.15], [0, 1.15]]);
  var stati = [BIL, SBO, FOR, SBA];

  add(radice, k.blocco(-5, 5, -2.6, -2.2, -3.5, 3.5, M.macchina, true));
  // stampi inferiori: piano (fasi 1–2) e con cavità (3–4)
  var infPiano = k.torneroY([[0, -2.2], [3.6, -2.2], [3.6, 0], [0, 0]], M.stampo, 64); radice.add(infPiano);
  var infCav = k.torneroY([[0, -2.2], [3.6, -2.2], [3.6, 0.25], [1.75, 0.25], [1.75, 0], [0, 0]], M.stampo, 64); radice.add(infCav);
  // maglio con stampi superiori
  var maglio = new T.Group(); radice.add(maglio);
  var supPiano = k.torneroY([[0, 0], [3.6, 0], [3.6, 2.0], [0, 2.0]], M.stampo, 64); maglio.add(supPiano);
  var supCav = k.torneroY([[0, 0.4], [2.75, 0.4], [3.6, 0.4], [3.6, 2.0], [0, 2.0], [0, 1.15], [1.55, 1.15], [1.75, 0.95], [1.75, 0.4]], M.stampo, 64); maglio.add(supCav);
  var stelo = new T.Mesh(new T.CylinderGeometry(0.9, 0.9, 3, 32), M.macchina); stelo.position.y = 3.5; maglio.add(stelo);
  // pezzo
  var mat = k.nuovo(k.COL.fuso, { emissive: 0xff3a00, emissiveIntensity: 0.6, roughness: 0.6, side: T.DoubleSide });
  var pezzo = new T.Mesh(new T.BufferGeometry(), mat); pezzo.castShadow = true; radice.add(pezzo);
  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);

  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var da = fase === 1 ? BIL : stati[fase - 2], a = stati[fase - 1];
    var colpi = fase === 2 || fase === 3;
    var avanz = colpi ? Math.min(1, Math.floor(t * 6 + 1) / 6) : e; // il pezzo cambia a scatti, colpo dopo colpo
    var pts = [];
    for (var i = 0; i < N; i++) pts.push(new T.Vector2(Math.max(0.001, da[i][0] + (a[i][0] - da[i][0]) * avanz), da[i][1] + (a[i][1] - da[i][1]) * avanz));
    var g = new T.LatheGeometry(pts, 64, k.taglio ? Math.PI / 2 : 0, k.taglio ? Math.PI : Math.PI * 2);
    pezzo.geometry.dispose(); pezzo.geometry = g;
    var cavita = fase >= 3;
    infPiano.visible = supPiano.visible = !cavita; infCav.visible = supCav.visible = cavita;
    // altezza del maglio: a contatto con la sommità del pezzo, più il rimbalzo dei colpi
    var cima = 0; pts.forEach(function (p) { cima = Math.max(cima, p.y); });
    var rimbalzo = colpi ? 1.6 * Math.abs(Math.sin(t * Math.PI * 6)) : 0;
    maglio.position.y = fase === 1 ? 4 : fase === 4 ? 1.15 + 3 * e : (cavita ? 0 : cima) + rimbalzo;
    if (fase === 4) { mat.color.lerpColors(cF, cS, e); mat.emissiveIntensity = 0.6 * (1 - e); } else { mat.color.copy(cF); mat.emissiveIntensity = 0.6; }
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.6,
    camera: { posizione: [6, 5.5, 12], bersaglio: [0, 0.8, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Maglio', ancora: su(stelo, 0, 1.5, -0.6) },
      { testo: 'Stampo inferiore', ancora: su(radice, 3.2, -0.5, -0.6) },
      { testo: 'Pezzo a ≈ 1250 °C', ancora: su(radice, -1.2, 1.2, 0) }
    ]
  };
});
