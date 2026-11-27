/* Vista 3D – Fusione centrifuga in stampo di silicone (Thompson 2007, pp. 144–147).
 * Fasi: 1 stampo sul piatto, 2 colata al centro, 3 riempimento, 4 apertura ed estrazione.
 */
Vista3D.registra('fusione-centrifuga', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat;
  radice.add(k.blocco(-5, 5, -2.6, -2.2, -4, 4, M.macchina, true));
  var base = new T.Mesh(new T.CylinderGeometry(0.6, 0.9, 1.6, 32), M.macchina); base.position.y = -1.4; radice.add(base);
  var giro = new T.Group(); radice.add(giro);
  var piatto = new T.Mesh(new T.CylinderGeometry(3.4, 3.4, 0.15, 64), M.stampo); piatto.position.y = -0.55; piatto.castShadow = true; giro.add(piatto);
  var sil = k.nuovo(0xd06a5a, { roughness: 0.8, transparent: true, opacity: 0.55, depthWrite: false });
  var inf = new T.Mesh(new T.CylinderGeometry(3.1, 3.1, 0.45, 64), sil); inf.position.y = -0.25; inf.renderOrder = 2; giro.add(inf);
  var sup = new T.Mesh(new T.CylinderGeometry(3.1, 3.1, 0.45, 64), sil); sup.position.y = 0.25; sup.renderOrder = 2; giro.add(sup);
  var disco = new T.Mesh(new T.CylinderGeometry(3.4, 3.4, 0.15, 64), M.stampo); disco.position.y = 0.55; giro.add(disco);
  // cavità (pezzi) e canali
  var met = k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 0.35, metalness: 0.5, roughness: 0.3 });
  var pezzi = [], canali = [];
  for (var i = 0; i < 6; i++) {
    var a = i / 6 * Math.PI * 2;
    var p = new T.Mesh(new T.TorusKnotGeometry(0.32, 0.11, 60, 10), met); p.position.set(Math.cos(a) * 2.2, 0, Math.sin(a) * 2.2); giro.add(p); pezzi.push(p);
    var c = new T.Mesh(new T.CylinderGeometry(0.07, 0.07, 1.6, 8).rotateZ(Math.PI / 2), met); c.position.set(Math.cos(a) * 1.15, 0, Math.sin(a) * 1.15); c.rotation.y = -a; giro.add(c); canali.push(c);
  }
  var centro = new T.Mesh(new T.CylinderGeometry(0.3, 0.3, 1.0, 20), met); giro.add(centro);
  var getto = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 2.5, 10), met); getto.position.y = 1.9; radice.add(getto);
  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    giro.rotation.y = (fase === 1 ? 0.5 * t : fase === 4 ? 3.5 : (fase - 1.5 + t)) * Math.PI * 2;
    getto.visible = fase === 2;
    centro.visible = fase >= 2;
    var r = fase < 3 ? 0 : fase === 3 ? e : 1;
    canali.forEach(function (c) { c.visible = fase >= 3 && (fase > 3 || e > 0.05); c.scale.x = Math.max(0.01, Math.min(1, r * 2)); });
    pezzi.forEach(function (p) { p.visible = fase >= 3 && r > 0.4; p.scale.setScalar(Math.max(0.01, (r - 0.4) / 0.6)); });
    sup.position.y = fase === 4 ? 0.25 + 1.6 * e : 0.25; disco.position.y = fase === 4 ? 0.55 + 1.6 * e : 0.55;
    sil.opacity = fase === 4 ? 0.55 * (1 - 0.6 * e) : 0.55;
    if (k.taglio) { disco.visible = false; sup.visible = fase === 4; }
    var so = fase === 4 ? e : 0; met.color.lerpColors(cF, cS, so); met.emissiveIntensity = 0.35 * (1 - so);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.6,
    camera: { posizione: [5, 7, 9], bersaglio: [0, -0.2, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Stampo in silicone', ancora: su(radice, 3.0, 0.5, -1.0) },
      { testo: 'Canale centrale', ancora: su(radice, 0, 0.9, 0) },
      { testo: 'Piatto rotante', ancora: su(radice, -3.2, -0.6, 1.5) }
    ]
  };
});
