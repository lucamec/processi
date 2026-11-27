/* Vista 3D – Ribaditura ad aria calda di un contatto metallico (Thompson 2007, pp. 316–319).
 * Fasi: 1 assemblaggio, 2 aria calda, 3 formatura, 4 ritorno.
 */
Vista3D.registra('ribaditura', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var P = [[-1.2, -0.5], [1.2, -0.5], [-1.2, 0.5], [1.2, 0.5]], RP = 0.14, HB = 0.1, HP = 0.55;
  add(radice, k.blocco(-3.5, 3.5, -2.2, -1.8, -2.4, 2.4, M.macchina, true));
  add(radice, k.blocco(-2.2, 2.2, -1.8, -0.4, -1.4, 1.4, M.stampo, true));           // maschera in alluminio
  var mPl = k.nuovo(0xe9e4da, { roughness: 0.45 });
  add(radice, k.blocco(-1.9, 1.9, -0.4, 0, -1.1, 1.1, mPl));                         // supporto stampato
  // perni (fusto + cima che si scalda) e teste a cupola
  var mCima = k.nuovo(0xe9e4da, { emissive: k.COL.fuso, emissiveIntensity: 0, roughness: 0.45 });
  var mTesta = k.nuovo(k.COL.finito, { roughness: 0.5 });
  var perni = P.map(function (p) {
    var f = new T.Mesh(new T.CylinderGeometry(RP, RP, HB, 20), mPl); f.position.set(p[0], HB / 2, p[1]); radice.add(f);
    var c = new T.Mesh(new T.CylinderGeometry(RP, RP, HP - HB, 20), mCima); c.position.set(p[0], HB + (HP - HB) / 2, p[1]); radice.add(c);
    var d = new T.Mesh(new T.SphereGeometry(0.26, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), mTesta); d.position.set(p[0], HB - 0.02, p[1]); d.scale.set(1, 0.6, 1); radice.add(d);
    return { c: c, d: d, p: p };
  });
  // contatto metallico forato
  var cont = new T.Group(); radice.add(cont);
  var fori = P.map(function (p) { var h = []; for (var j = 0; j < 20; j++) { var a = -j / 20 * Math.PI * 2; h.push([p[0] + (RP + 0.03) * Math.cos(a), -p[1] + (RP + 0.03) * Math.sin(a)]); } return h; });
  var piano = new T.Group(); piano.rotation.x = -Math.PI / 2; cont.add(piano);
  piano.add(k.estruso([[-1.6, -0.8], [1.6, -0.8], [1.6, 0.8], [-1.6, 0.8]], fori, 0, 0.08, k.nuovo(0xb87333, { metalness: 0.7, roughness: 0.3 }), true));
  // ugelli e punzoni
  var ugelli = new T.Group(); radice.add(ugelli);
  var mAria = k.nuovo(k.COL.fuso, { transparent: true, opacity: 0.35, depthWrite: false });
  var punz = new T.Group(); radice.add(punz);
  P.forEach(function (p) {
    var u = new T.Mesh(new T.CylinderGeometry(0.07, 0.07, 1.0, 12), M.scuro); u.rotation.z = 0.6; u.position.set(p[0] + 0.55, HP + 0.7, p[1]); ugelli.add(u);
    var a = new T.Mesh(new T.ConeGeometry(0.2, 0.5, 16, 1, true), mAria); a.rotation.z = 0.6 + Math.PI; a.position.set(p[0] + 0.22, HP + 0.25, p[1]); ugelli.add(a);
    var s = new T.Mesh(new T.CylinderGeometry(0.28, 0.28, 1.2, 20), M.stampo); s.position.set(p[0], 0.6, p[1]); punz.add(s);
  });

  function aggiorna(fase, t) {
    var e = k.morbido(t);
    cont.position.y = fase === 1 ? 1.2 * (1 - e) : 0;
    ugelli.visible = fase === 2;
    mCima.emissiveIntensity = fase === 2 ? 0.8 * e : fase === 3 ? 0.8 * (1 - e) : 0;
    var forma = fase < 3 ? 0 : fase === 3 ? e : 1;
    perni.forEach(function (q) {
      q.c.visible = forma < 0.98; q.c.scale.y = Math.max(0.02, 1 - forma); q.c.position.y = HB + (HP - HB) * (1 - forma) / 2;
      q.d.visible = forma > 0.02; q.d.scale.set(forma, 0.6 * forma, forma);
    });
    punz.visible = fase >= 3;
    punz.position.y = fase === 3 ? HP + 0.1 + 0.6 * (1 - e) - (HP - HB) * e : fase === 4 ? HB + 0.15 + 1.2 * e : 2;
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.2,
    camera: { posizione: [4.5, 5.5, 8.5], bersaglio: [0, 0.2, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Supporto in plastica con perni', ancora: su(radice, -1.9, -0.2, 1.1) },
      { testo: 'Contatto metallico', ancora: su(cont, 1.6, 0.08, 0.8) },
      { testo: 'Aria calda', ancora: su(radice, 1.8, HP + 0.9, 0.5), visibile: function () { return ugelli.visible; } },
      { testo: 'Punzoni freddi', ancora: su(punz, 1.2, 1.2, 0.5), visibile: function () { return punz.visible; } }
    ]
  };
});
