/* Vista 3D – Lavorazione del vetro alla fiamma (Thompson 2007, pp. 160–167).
 * Fasi: 1 riscaldo, 2 soffiatura, 3 foratura, 4 curvatura, 5 ricottura.
 */
Vista3D.registra('lavorazione-lume', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  add(radice, k.blocco(-6, 6, -3.2, -2.8, -3, 3, M.macchina, true));
  // cannello
  var cann = new T.Group(); cann.position.y = -2.0; radice.add(cann);
  add(cann, k.blocco(-0.3, 0.3, -0.8, 0.2, -0.3, 0.3, M.scuro, true));
  var fiamma = new T.Mesh(new T.ConeGeometry(0.35, 1.6, 24), k.nuovo(0xffb35a, { emissive: 0xff7a1a, emissiveIntensity: 1.2, transparent: true, opacity: 0.75, depthWrite: false })); fiamma.position.y = 1.0; cann.add(fiamma);
  // vetro: profilo di rivoluzione attorno all'asse X per la parte sinistra (tubo + bolla)
  var vetro = k.nuovo(0xcfe3ea, { transparent: true, opacity: 0.55, roughness: 0.05, metalness: 0, side: T.DoubleSide, emissive: k.COL.fuso, emissiveIntensity: 0 });
  var sx = new T.Mesh(new T.BufferGeometry(), vetro); radice.add(sx);
  var ramo = new T.Group(); ramo.position.x = 1.3; radice.add(ramo);       // tratto destro: si piega in fase 4
  ramo.add(k.tornito([[0.24, 0], [0.32, 0], [0.32, 3.8], [0.24, 3.8]], vetro, 32, true));
  function profilo(b) { // b: gonfiamento della bolla 0..1
    var pts = [], R = 0.32 + 0.9 * b, ri = 0.24 + 0.88 * b;
    function r(x, base, top) { var u = Math.max(0, 1 - Math.pow(x / 1.3, 2)); return base + (top - base) * Math.sqrt(u); }
    for (var i = 0; i <= 50; i++) { var x = -5 + i * 6.3 / 50; pts.push(new T.Vector2(x > -1.3 ? r(x, 0.32, R) : 0.32, x)); }
    for (var j = 50; j >= 0; j--) { var x2 = -5 + j * 6.3 / 50; pts.push(new T.Vector2(x2 > -1.3 ? r(x2, 0.24, ri) : 0.24, x2)); }
    pts.push(pts[0].clone());
    return pts;
  }
  var foro = new T.Mesh(new T.CircleGeometry(0.28, 24), k.nuovo(0x2e3a47, { side: T.DoubleSide })); foro.rotation.x = -Math.PI / 2; radice.add(foro);
  var punta = new T.Mesh(new T.CylinderGeometry(0.03, 0.06, 2.2, 10), M.scuro); radice.add(punta);
  var forno = new T.Mesh(new T.BoxGeometry(11, 4.5, 4), M.vetro.clone()); forno.position.y = 0; forno.renderOrder = 3; radice.add(forno);
  var cS = new T.Color(k.COL.finito), cV = new T.Color(0xcfe3ea);
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var b = fase === 1 ? 0 : fase === 2 ? e : 1;
    var g = new T.LatheGeometry(profilo(b), 48, k.taglio ? Math.PI / 2 : 0, k.taglio ? Math.PI : Math.PI * 2); g.rotateZ(-Math.PI / 2);
    sx.geometry.dispose(); sx.geometry = g;
    var R = 0.32 + 0.9 * b;
    foro.visible = fase >= 3 && !(fase === 3 && t < 0.5); foro.position.set(0, R + 0.01, 0);
    punta.visible = fase === 3; punta.position.set(0, R + 1.1 - (t < 0.5 ? 0.3 * t * 2 : 0.3), 0);
    ramo.rotation.z = fase === 4 ? -e * Math.PI / 2 : fase === 5 ? -Math.PI / 2 : 0;
    cann.visible = fase <= 4; forno.visible = fase === 5;
    var calore = fase === 5 ? 0 : 0.6;
    vetro.emissiveIntensity = calore * (fase === 1 ? e : 1);
    vetro.color.copy(cV).lerp(new T.Color(k.COL.fuso), fase <= 4 ? 0.6 * (fase === 1 ? e : 1) : 0);
    if (fase === 5) vetro.color.lerpColors(cV, cS, e);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -3.2,
    camera: { posizione: [2, 4, 12], bersaglio: [-0.5, -0.4, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Tubo di vetro', ancora: su(radice, -4.0, 0.4, 0) },
      { testo: 'Fiamma', ancora: su(cann, 0.4, 1.4, 0), visibile: function () { return cann.visible; } },
      { testo: 'Punta di tungsteno', ancora: su(punta, 0, 1.1, 0), visibile: function () { return punta.visible; } },
      { testo: 'Forno di ricottura', ancora: su(forno, -5, 2.2, -1.8), visibile: function () { return forno.visible; } }
    ]
  };
});
