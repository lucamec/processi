/* Vista 3D – Saldatura a ultrasuoni di una piccola girante (Thompson 2007, pp. 302–307).
 * Fasi: 1 posizionamento, 2 contatto, 3 vibrazione, 4 mantenimento.
 */
Vista3D.registra('saldatura-ultrasuoni', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  add(radice, k.blocco(-3, 3, -2.4, -2.0, -2.4, 2.4, M.macchina, true));
  add(radice, k.blocco(-2.2, -1.4, -2.0, 4.6, -0.5, 0.5, M.macchina, true));          // colonna
  add(radice, k.blocco(-1.4, -0.4, 3.0, 4.2, -0.4, 0.4, M.macchina, true));            // braccio
  // incudine
  radice.add(k.torneroY([[0, -2.0], [1.3, -2.0], [1.3, -0.4], [0, -0.4]], M.stampo, 48));
  // pezzo inferiore (girante) e superiore (coperchio)
  var mP = k.nuovo(0xe9e4da, { roughness: 0.45 });
  var inf = k.torneroY([[0, -0.4], [1.0, -0.4], [1.0, 0.2], [0.85, 0.2], [0.85, -0.25], [0, -0.25]], mP, 48); radice.add(inf);
  for (var i = 0; i < 6; i++) { var pala = new T.Mesh(new T.BoxGeometry(0.75, 0.4, 0.06), mP); pala.position.set(0.42 * Math.cos(i * Math.PI / 3), -0.05, 0.42 * Math.sin(i * Math.PI / 3)); pala.rotation.y = -i * Math.PI / 3; if (!k.taglio || pala.position.z <= 0) radice.add(pala); }
  var sup = new T.Group(); radice.add(sup);
  sup.add(k.torneroY([[0, 0.24], [1.0, 0.24], [1.0, 0.42], [0, 0.42]], mP, 48));
  var albero = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 0.9, 16), M.scuro); albero.position.y = 0.7; sup.add(albero);
  // giunto
  var mJ = k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 0 });
  var giunto = new T.Mesh(new T.TorusGeometry(0.93, 0.05, 10, 64).rotateX(Math.PI / 2), mJ); giunto.position.y = 0.22; radice.add(giunto);
  // convertitore, booster, sonotrodo
  var pila = new T.Group(); radice.add(pila);
  pila.add(k.torneroY([[0, 0.45], [0.8, 0.45], [0.8, 1.6], [0.5, 1.6], [0.5, 2.0], [0, 2.0]], M.stampo, 48, true));     // sonotrodo
  pila.add(k.torneroY([[0, 2.0], [0.55, 2.0], [0.55, 2.6], [0, 2.6]], k.nuovo(0x3b6fd1, { metalness: 0.5 }), 32, true)); // booster anodizzato
  pila.add(k.torneroY([[0, 2.6], [0.7, 2.6], [0.7, 3.8], [0, 3.8]], M.scuro, 32, true));                                // convertitore

  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t), yP = 1.2, yS = 0.35, vib = 0, cal = 0;
    if (fase === 1) { yS = 0.35 * (1 - e) + 0.06; yP = 1.2; }
    if (fase === 2) { yS = 0.06; yP = 1.2 * (1 - e) + 0.06; }
    if (fase === 3) { yS = 0.06 - 0.04 * e; yP = yS; vib = 0.025 * Math.sin(t * 300); cal = Math.min(1, t * 3); }
    if (fase === 4) { yS = 0.02; yP = 0.02 + 1.2 * Math.max(0, (t - 0.5) / 0.5); cal = 1 - e; }
    sup.position.y = yS + vib; pila.position.y = yP + vib;
    giunto.visible = fase >= 3; mJ.emissiveIntensity = 1.2 * cal;
    mJ.color.copy(cF).lerp(cS, fase === 4 ? e : 0);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.4,
    camera: { posizione: [6, 5, 11], bersaglio: [0, 0.8, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Convertitore', ancora: su(pila, 0.7, 3.4, 0) },
      { testo: 'Booster', ancora: su(pila, 0.55, 2.3, 0) },
      { testo: 'Sonotrodo', ancora: su(pila, 0.8, 1.1, 0) },
      { testo: 'Incudine', ancora: su(radice, 1.3, -1.4, 0) }
    ]
  };
});
