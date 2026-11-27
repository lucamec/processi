/* Vista 3D – Stampa a caldo e goffratura su carta (Thompson 2007, pp. 412–415).
 * Pressa con piastra calda: prima il cliché in magnesio stampa la lamina d'oro, poi uno stampo
 * con bordi arrotondati, contro la sua controparte, solleva il rilievo nella carta.
 * Fasi: 1 carico, 2 stampa a caldo, 3 scarico della lamina, 4 goffratura.
 */
Vista3D.registra('stampa-caldo-goffratura', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var XF = -0.6, XE = 0.6, ZL = -0.45, R0 = 0.2, R1 = 0.32;
  add(radice, k.blocco(-2.6, 2.6, -0.8, -0.2, -1.4, 1.4, M.macchina, true));
  add(radice, k.blocco(-1.6, 1.6, -0.2, 0, -1.2, 1.2, M.stampo, true)); // piano di stampa
  // foglio di carta (lastra deformabile per il rilievo)
  var foglio = new T.Group(); radice.add(foglio);
  var carta = k.lastra(1.4, 1.0, 90, 64, k.nuovo(0xf4efe4, { roughness: 0.9, side: T.DoubleSide })); foglio.add(carta.mesh);
  function anello(x, z) { var r = Math.hypot(x - XE, z - ZL), d = Math.abs(r - (R0 + R1) / 2), w = (R1 - R0) / 2 + 0.04; return d >= w ? 0 : 0.5 + 0.5 * Math.cos(Math.PI * d / w); }
  function rilievo(h) { carta.imposta(function (x, z) { return 0.004 + h * 0.1 * anello(x, z); }); }
  rilievo(0);
  // lamina d'oro stampata
  var mOro = k.nuovo(0xd4a53a, { metalness: 0.8, roughness: 0.3, side: T.DoubleSide });
  var logo = new T.Group(); logo.position.set(XF, 0.008, ZL); foglio.add(logo);
  logo.add(new T.Mesh(new T.RingGeometry(R0, R1, 48).rotateX(-Math.PI / 2), mOro));
  logo.add(new T.Mesh(new T.CircleGeometry(0.08, 32).rotateX(-Math.PI / 2), mOro));
  // nastro di lamina fra due bobine
  var mNastro = k.nuovo(0xd4a53a, { metalness: 0.7, roughness: 0.35, transparent: true, opacity: 0.9, side: T.DoubleSide });
  var nastro = new T.Mesh(new T.PlaneGeometry(4.4, 0.9).rotateX(-Math.PI / 2), mNastro); nastro.position.set(0, 0.3, ZL); radice.add(nastro);
  var bobine = [-2.3, 2.3].map(function (x) { var b = new T.Mesh(new T.CylinderGeometry(0.22, 0.22, 1.0, 24).rotateX(Math.PI / 2), mNastro); b.position.set(x, 0.3, ZL); radice.add(b); return b; });
  var usato = new T.Group(); radice.add(usato);
  var mUs = k.nuovo(0xe9e4d6, { transparent: true, opacity: 0.9, side: T.DoubleSide });
  usato.add(new T.Mesh(new T.RingGeometry(R0, R1, 48).rotateX(-Math.PI / 2), mUs)); usato.add(new T.Mesh(new T.CircleGeometry(0.08, 32).rotateX(-Math.PI / 2), mUs));
  // piastra calda con i due utensili
  var piastra = new T.Group(); radice.add(piastra);
  add(piastra, k.blocco(-1.6, 1.6, 0.1, 0.5, -1.2, 1.2, k.nuovo(0x9a6a4a, { roughness: 0.5 }), true));
  add(piastra, k.blocco(-1.7, 1.7, 0.5, 0.9, -1.3, 1.3, M.macchina, true));
  var mMg = k.nuovo(0xb8bec6, { metalness: 0.6, roughness: 0.35 });
  var cliche = new T.Group(); cliche.position.set(XF, 0.1, ZL); piastra.add(cliche);
  var sh = new T.Shape(); sh.absarc(0, 0, R1, 0, Math.PI * 2, false); var foro = new T.Path(); foro.absarc(0, 0, R0, 0, Math.PI * 2, true); sh.holes.push(foro);
  var gA = new T.ExtrudeGeometry(sh, { depth: 0.06, bevelEnabled: false, curveSegments: 48 }).rotateX(Math.PI / 2); cliche.add(new T.Mesh(gA, mMg));
  var pt = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 0.06, 32), mMg); pt.position.y = -0.03; cliche.add(pt);
  var stampoG = new T.Group(); stampoG.position.set(XE, 0.1, ZL); piastra.add(stampoG);
  var toro = new T.Mesh(new T.TorusGeometry((R0 + R1) / 2, (R1 - R0) / 2, 16, 64).rotateX(Math.PI / 2), mMg); toro.scale.y = 0.5; stampoG.add(toro);
  var bagliore = new T.Mesh(new T.BoxGeometry(3.2, 0.02, 2.4), k.nuovo(0xf06a1d, { transparent: true, opacity: 0.25, depthWrite: false })); bagliore.position.y = 0.52; piastra.add(bagliore);
  function aggiorna(fase, t) {
    var e = k.morbido(t), dn = Math.sin(Math.min(1, t) * Math.PI);
    foglio.position.x = fase === 1 ? -3.4 * (1 - e) : 0;
    // la piastra scende fino a toccare la carta: fondo utensile a y = 0.1 - 0.06 sopra il piano
    var giu = fase === 2 || fase === 4 ? Math.min(1, dn * 1.25) : 0;
    piastra.position.y = 1.7 * (1 - giu) - 0.04 * giu * (fase === 4 ? 0.1 : 1);
    nastro.visible = fase <= 3; bobine.forEach(function (b) { b.visible = fase <= 3; b.rotation.z = fase === 3 ? -t * 6 : 0; });
    nastro.position.y = fase === 2 ? 0.3 - 0.27 * giu : 0.3;
    logo.visible = (fase === 2 && t > 0.5) || fase >= 3;
    usato.visible = (fase === 2 && t > 0.5) || fase === 3;
    usato.position.set(fase === 3 ? XF + (2.1 - XF) * e : XF, nastro.position.y + 0.006, ZL);
    cliche.visible = fase <= 3; stampoG.visible = fase === 4;
    rilievo(fase === 4 ? Math.min(1, Math.max(0, (t - 0.25) / 0.25)) : 0);
    bagliore.visible = fase === 2 || fase === 4;
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -0.8,
    camera: { posizione: [2.2, 5.2, 6.2], bersaglio: [0, 0.3, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Piastra calda, 100–200 °C', ancora: su(piastra, -1.7, 0.7, 1.3) },
      { testo: 'Lamina su film di supporto', ancora: su(nastro, 2.0, 0, 0.45), visibile: function () { return nastro.visible; } },
      { testo: 'Carta', ancora: su(foglio, 1.4, 0, 1.0) },
      { testo: 'Rilievo goffrato', ancora: su(foglio, XE + R1, 0.06, ZL), visibile: function () { return stampoG.visible; } }
    ]
  };
});
