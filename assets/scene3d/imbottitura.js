/* Vista 3D – Cucitura a punto annodato di due strati di pelle (Thompson 2007, pp. 338–343).
 * Le quattro fasi sono i tempi di un punto: alla fine il tessuto avanza di un passo e compare un nuovo punto.
 * Fasi: 1 l'ago attraversa, 2 il crochet aggancia, 3 asola, 4 tensione e avanzamento.
 */
Vista3D.registra('imbottitura', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var P = 0.35, NP = 6;
  add(radice, k.blocco(-4, 4, -2.4, -2.0, -2.4, 2.4, M.macchina, true));
  // corpo della macchina: base, colonna, braccio
  add(radice, k.blocco(-3.6, 3.6, -2.0, -0.1, -1.4, 1.4, M.macchina, true));
  add(radice, k.blocco(2.4, 3.4, -0.1, 3.0, -0.8, 0.8, M.macchina, true));
  add(radice, k.blocco(-0.8, 3.4, 2.2, 3.0, -0.7, 0.7, M.macchina, true));
  add(radice, k.blocco(-0.6, 0.6, -0.1, 0, -0.6, 0.6, M.stampo, true));               // placca dell'ago
  // pelle: due strati che avanzano in -x
  var pelle = new T.Group(); radice.add(pelle);
  var mP1 = k.nuovo(0x8a5a3a, { roughness: 0.7 }), mP2 = k.nuovo(0xb07a52, { roughness: 0.7 });
  add(pelle, k.blocco(-3.0, 3.0, 0.0, 0.08, -1.0, 0.3, mP2, true));
  add(pelle, k.blocco(-3.0, 3.0, 0.08, 0.16, -0.3, 1.0, mP1, true));
  var mF = k.nuovo(k.COL.finito), mFu = k.nuovo(k.COL.fuso);
  var punti = [];
  for (var i = 0; i <= NP; i++) { var s = new T.Mesh(new T.BoxGeometry(P * 0.8, 0.03, 0.04), mF); s.position.set(-P * (i + 0.5), 0.175, 0); pelle.add(s); punti.push(s); }
  // piedino, barra dell'ago, ago, filo
  var piedino = add(radice, k.blocco(-0.35, 0.35, 0.18, 0.3, -0.25, 0.25, M.stampo, true));
  add(radice, k.blocco(-0.05, 0.05, 0.3, 2.2, -0.05, 0.05, M.scuro, true));
  var barra = new T.Group(); radice.add(barra);
  var bar = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 1.2, 16), M.stampo); bar.position.y = 1.0; barra.add(bar);
  var ago = new T.Mesh(new T.CylinderGeometry(0.02, 0.005, 0.6, 8), k.nuovo(0xdfe4ea, { metalness: 0.9, roughness: 0.2 })); ago.position.y = 0.1; barra.add(ago);
  var filo = new T.Mesh(new T.CylinderGeometry(0.012, 0.012, 2.4, 6), mFu); filo.position.set(0.04, 1.2, 0); barra.add(filo);
  // crochet rotante con spolina, sotto la placca (visibile in spaccato)
  var croc = new T.Group(); croc.position.set(0, -0.7, 0); radice.add(croc);
  croc.add(new T.Mesh(new T.TorusGeometry(0.4, 0.05, 10, 40, Math.PI * 1.7), M.scuro));
  var spol = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.25, 24).rotateX(Math.PI / 2), k.nuovo(0xcfb37a)); croc.add(spol);
  var asola = new T.Mesh(new T.TorusGeometry(0.28, 0.012, 6, 40), mFu); asola.position.set(0, -0.7, 0.15); radice.add(asola);

  function aggiorna(fase, t) {
    var e = k.morbido(t), y = 0.6;
    if (fase === 1) y = 0.6 - 0.65 * e;
    if (fase === 2 || fase === 3) y = -0.05;
    if (fase === 4) y = -0.05 + 0.65 * e;
    barra.position.y = y;
    croc.rotation.z = -((fase - 1) + t) * Math.PI;
    asola.visible = fase === 2 || fase === 3; asola.scale.setScalar(fase === 2 ? 0.4 + 0.6 * e : 1);
    var av = fase === 4 ? e : 0;
    pelle.position.x = -P * av;
    punti.forEach(function (p, j) { p.visible = j > 0 || fase === 4; p.material = j === 0 ? mFu : mF; });
    piedino.position.y = 0.24 + (fase === 4 ? 0.04 * Math.sin(Math.PI * t) : 0);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.4,
    camera: { posizione: [4, 4.5, 8], bersaglio: [0, 0.6, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Ago e filo superiore', ancora: su(barra, 0.1, 1.2, 0) },
      { testo: 'Piedino', ancora: su(radice, 0.35, 0.3, 0.25) },
      { testo: 'Strati di pelle', ancora: su(pelle, -2.2, 0.16, 1.0) },
      { testo: 'Cucitura', ancora: su(radice, -1.4, 0.18, 0) }
    ]
  };
});
