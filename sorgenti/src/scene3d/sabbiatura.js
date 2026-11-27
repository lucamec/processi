/* Vista 3D – Sabbiatura decorativa di un vaso di vetro (Thompson 2007, pp. 388–391).
 * Il vaso è diviso in fasce: A incise due volte, B solo nella seconda passata, C sempre mascherate.
 * Fasi: 1 maschera, 2 prima incisione, 3 maschera modificata, 4 seconda incisione, 5 pulizia.
 */
Vista3D.registra('sabbiatura', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  add(radice, k.blocco(-4, 4, -2.6, -2.2, -2.4, 2.4, M.macchina, true));
  // cabina a guanti
  var mCab = k.nuovo(0xb8c4d0, { transparent: true, opacity: 0.1, depthWrite: false, side: T.DoubleSide });
  var cab = new T.Mesh(new T.BoxGeometry(5.0, 4.0, 3.4), mCab); cab.position.y = -0.2; radice.add(cab);
  cab.add(new T.LineSegments(new T.EdgesGeometry(cab.geometry), new T.LineBasicMaterial({ color: 0x8d99a6 })));
  add(radice, k.blocco(-1.0, 1.0, -2.2, -1.6, -1.0, 1.0, M.scuro, true));
  // profilo del vaso r(y)
  var PROF = [[0, -1.6], [0.7, -1.6], [0.95, -1.0], [1.0, -0.2], [0.8, 0.6], [0.5, 1.1], [0.55, 1.5], [0, 1.5]];
  function r(y) { for (var i = 1; i < PROF.length; i++) { var a = PROF[i - 1], b = PROF[i]; if (y <= b[1] && b[1] > a[1]) return a[0] + (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]); } return 0.5; }
  var vaso = k.torneroY(PROF, k.nuovo(0xcfe3ea, { transparent: true, opacity: 0.45, roughness: 0.05, metalness: 0, depthWrite: false }), 48, true); radice.add(vaso);
  function fascia(y0, y1, mat, dr) { var p = []; for (var j = 0; j <= 8; j++) { var y = y0 + (y1 - y0) * j / 8; p.push(new T.Vector2(r(y) + dr, y)); } var m = new T.Mesh(new T.LatheGeometry(p, 48), mat); radice.add(m); return m; }
  var FA = [[-1.3, -1.0], [-0.2, 0.2], [0.9, 1.15]], FB = [[-0.6, -0.4], [0.5, 0.7]], FC = [[-1.0, -0.6], [-0.4, -0.2], [0.2, 0.5], [0.7, 0.9]];
  var mA = k.nuovo(0xffffff, { transparent: true, opacity: 0, roughness: 1, side: T.DoubleSide }), mB = mA.clone();
  var mCera = k.nuovo(0x5b4a8a, { roughness: 0.6, side: T.DoubleSide });
  FA.forEach(function (f) { fascia(f[0], f[1], mA, 0.01); });
  FB.forEach(function (f) { fascia(f[0], f[1], mB, 0.01); });
  var cereB = FB.map(function (f) { return fascia(f[0], f[1], mCera, 0.025); });
  var cereC = FC.map(function (f) { return fascia(f[0], f[1], mCera, 0.025); });
  // ugello con getto
  var ug = new T.Group(); radice.add(ug);
  var corpo = new T.Mesh(new T.CylinderGeometry(0.08, 0.12, 0.6, 16).rotateZ(Math.PI / 2), M.stampo); corpo.position.x = 0.3; ug.add(corpo);
  var getto = new T.Mesh(new T.ConeGeometry(0.25, 0.9, 16, 1, true).rotateZ(Math.PI / 2), k.nuovo(0xc8b080, { transparent: true, opacity: 0.55, depthWrite: false })); getto.position.x = -0.45; ug.add(getto);
  var cS = new T.Color(k.COL.finito), cW = new T.Color(0xffffff);
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    cereB.forEach(function (m) { m.visible = fase <= 2 || (fase === 3 && t < 0.5); });
    cereC.forEach(function (m) { m.visible = (fase === 1 ? t > 0.1 : true) && !(fase === 5 && t > 0.3); });
    mA.opacity = fase < 2 ? 0 : fase === 2 ? 0.7 * t : fase === 3 ? 0.7 : fase === 4 ? 0.7 + 0.25 * t : 0.95;
    mB.opacity = fase < 4 ? 0 : fase === 4 ? 0.55 * t : 0.55;
    mA.color.copy(cW).lerp(cS, fase === 5 ? e * 0.7 : 0); mB.color.copy(mA.color);
    var att = fase === 2 || fase === 4;
    ug.visible = att;
    var ang = t * Math.PI * 6, h = -1.3 + 2.4 * ((t * 3) % 1);
    ug.position.set(Math.cos(ang) * (r(h) + 0.9), h, Math.sin(ang) * (r(h) + 0.9)); ug.rotation.y = -ang;
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.6,
    camera: { posizione: [3.5, 3, 7.5], bersaglio: [0, -0.2, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Cabina a guanti', ancora: su(radice, -2.5, 1.8, 1.7) },
      { testo: 'Maschera di cera', ancora: su(radice, -r(0.35) - 0.05, 0.35, 0), visibile: function () { return cereC[0].visible; } },
      { testo: 'Ugello con abrasivo', ancora: su(ug, 0.5, 0.15, 0), visibile: function () { return ug.visible; } },
      { testo: 'Vaso di vetro', ancora: su(radice, 1.0, -0.2, 0.3) }
    ]
  };
});
