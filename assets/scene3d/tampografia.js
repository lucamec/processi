/* Vista 3D – Tampografia di una tastiera retroilluminata (Thompson 2007, pp. 404–407).
 * Fasi: 1 preparazione del cliché, 2 prelievo, 3 trasferimento, 4 stampa, 5 finito.
 */
Vista3D.registra('tampografia', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var XC = -1.9, XP = 1.9;
  add(radice, k.blocco(-3.6, 3.6, -0.8, -0.3, -1.6, 1.6, M.macchina, true));
  // cliché in acciaio con incisione
  add(radice, k.blocco(XC - 1.0, XC + 1.0, -0.3, -0.2, -1.0, 1.0, k.nuovo(0xb8bec6, { metalness: 0.6, roughness: 0.35 }), true));
  var mInk = k.nuovo(0x1d232b, { roughness: 0.4 });
  var GRIGLIA = []; for (var i = -1; i <= 1; i++) for (var j = -1; j <= 1; j++) GRIGLIA.push([i * 0.42, j * 0.42]);
  function anelli(gruppo, y, mat) { return GRIGLIA.map(function (p) { var m = new T.Mesh(new T.RingGeometry(0.08, 0.15, 24).rotateX(-Math.PI / 2), mat); m.position.set(p[0], y, p[1]); gruppo.add(m); return m; }); }
  var incisione = new T.Group(); incisione.position.x = XC; radice.add(incisione);
  var mInc = k.nuovo(0x6a7078, { side: T.DoubleSide }); anelli(incisione, -0.195, mInc);
  var inkC = new T.Group(); inkC.position.x = XC; radice.add(inkC); anelli(inkC, -0.193, k.nuovo(0x1d232b, { side: T.DoubleSide }));
  // racla / calamaio
  var racla = new T.Group(); radice.add(racla);
  add(racla, k.blocco(-0.15, 0.15, -0.2, 0.25, -1.05, 1.05, M.stampo, true));
  var velo = add(racla, k.blocco(-0.9, -0.15, -0.2, -0.19, -1.0, 1.0, k.nuovo(0x1d232b, { transparent: true, opacity: 0.5 }), true));
  // pezzo: tastiera in gomma con tasti bianchi e gialli
  var pezzo = new T.Group(); pezzo.position.x = XP; radice.add(pezzo);
  add(pezzo, k.blocco(-0.85, 0.85, -0.3, -0.15, -0.85, 0.85, k.nuovo(0x3a3f46, { roughness: 0.8 }), true));
  GRIGLIA.forEach(function (p, n) { var b = new T.Mesh(new T.CylinderGeometry(0.16, 0.17, 0.18, 24), k.nuovo(n % 2 ? 0xf2d14a : 0xf4f4f0, { roughness: 0.7 })); b.position.set(p[0], -0.06, p[1]); pezzo.add(b); });
  var dima = add(pezzo, k.blocco(-0.95, 0.95, -0.15, -0.05, -0.95, 0.95, k.nuovo(0xdaf0f4, { transparent: true, opacity: 0.25, depthWrite: false }), true));
  var stampa = new T.Group(); pezzo.add(stampa); anelli(stampa, 0.032, mInk);
  // tampone in silicone
  var tamp = new T.Group(); radice.add(tamp);
  add(tamp, k.blocco(-0.5, 0.5, 0.75, 1.0, -0.5, 0.5, M.macchina, true));
  var asta = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 1.6, 12), M.scuro); asta.position.y = 1.8; tamp.add(asta);
  var cupola = new T.Mesh(new T.SphereGeometry(0.9, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), k.nuovo(0xd77a4a, { roughness: 0.6 }));
  cupola.rotation.x = Math.PI; cupola.position.y = 0.75; cupola.scale.y = 0.85; tamp.add(cupola);
  var inkT = new T.Group(); inkT.position.y = 0.75 - 0.9 * 0.85 - 0.005; tamp.add(inkT); anelli(inkT, 0, mInk);
  inkT.children.forEach(function (m) { m.material = k.nuovo(0x1d232b, { side: T.DoubleSide }); });
  // posTamp porta il fondo della cupola alla quota yb; s = schiacciamento (0–1)
  var YB = 0.9, YCL = -0.2, YPZ = 0.03;
  function posTamp(x, yb, sq) { var fondo = 0.75 - 0.9 * 0.85 * (1 - sq); tamp.position.set(x, yb - fondo, 0); cupola.scale.y = 0.85 * (1 - sq); cupola.scale.x = cupola.scale.z = 1 + 0.25 * sq; inkT.position.y = fondo - 0.005;
    inkT.children.forEach(function (m) { var r = Math.hypot(m.position.x, m.position.z) / cupola.scale.x; m.position.y = 0.9 * cupola.scale.y * (1 - Math.sqrt(Math.max(0, 1 - r * r / 0.81))); }); }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  function aggiorna(fase, t) {
    var e = k.morbido(t), dn = Math.sin(Math.min(1, t) * Math.PI);
    // racla: fase 1 copre e pulisce, fase 3 ripassa
    var xr = fase === 1 ? XC + 1.0 - 2.0 * e : fase === 3 ? XC - 1.0 + 2.0 * e : fase === 2 ? XC - 1.0 : XC + 1.0;
    racla.position.x = xr; velo.visible = fase === 1 || fase === 3;
    inkC.visible = fase === 1 ? t > 0.15 : fase === 2 ? t < 0.5 : fase === 3 ? t > 0.6 : true;
    inkT.visible = (fase === 2 && t > 0.5) || fase === 3 || (fase === 4 && t < 0.5);
    stampa.visible = (fase === 4 && t >= 0.5) || fase === 5;
    if (fase === 1) posTamp(XC, YB, 0);
    else if (fase === 2) posTamp(XC, YB + (YCL - YB) * Math.min(1, dn / 0.8), 0.3 * Math.max(0, dn - 0.8) / 0.2);
    else if (fase === 3) posTamp(XC + (XP - XC) * e, YB, 0);
    else if (fase === 4) posTamp(XP, YB + (YPZ - YB) * Math.min(1, dn / 0.7), 0.45 * Math.max(0, dn - 0.7) / 0.3);
    else posTamp(XP + (XC - XP) * e, YB, 0);
    dima.visible = fase < 5;
  }
  return {
    radice: radice, pavimento: -0.8,
    camera: { posizione: [2, 4, 7.5], bersaglio: [0, 0.2, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Tampone in silicone', ancora: su(tamp, 0.9, 0.5, 0) },
      { testo: 'Cliché inciso', ancora: su(radice, XC - 1.0, -0.2, 1.0) },
      { testo: 'Racla e inchiostro', ancora: su(racla, 0, 0.25, 1.05), visibile: function () { return velo.visible; } },
      { testo: 'Tastiera in gomma', ancora: su(pezzo, 0.85, -0.2, 0.85) }
    ]
  };
});
