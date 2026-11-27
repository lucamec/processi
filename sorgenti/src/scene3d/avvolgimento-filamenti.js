/* Vista 3D – Avvolgimento di filamenti (Thompson 2007, pp. 222–227).
 * Un solo parametro per strato (s, 0..1) guida tutto: posizione della testa x(s) e angolo depositato θ(s).
 * Il mandrino ruota di π/2 − θ(s), così il punto di deposito resta sempre davanti alla testa.
 * Fasi: 1 aggancio, 2 strati elicoidali, 3 strati circonferenziali, 4 nastratura, 5 cura ed estrazione.
 */
Vista3D.registra('avvolgimento-filamenti', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var R = 0.8, L = 2.6, ZT = R + 1.0;

  add(radice, k.blocco(-5.2, 5.2, -2.4, -2.0, -2.2, 3.4, M.macchina, true));
  add(radice, k.blocco(-5.0, -4.0, -2.0, 1.2, -1.0, 1.0, M.macchina));          // testa motrice
  var contro = add(radice, k.blocco(4.2, 5.0, -2.0, 0.3, -0.7, 0.7, M.macchina)); // contropunta
  add(radice, k.blocco(-4.0, 4.0, -1.9, -1.7, 2.4, 2.8, M.scuro, true));          // guida del carrello

  // gruppo rotante: mandrino + fibra
  var giro = new T.Group(); radice.add(giro);
  var mandrino = k.tornito([[0, -4.0], [0.25, -4.0], [0.25, -L - 0.5], [R * 0.7, -L - 0.5], [R, -L], [R, L], [R * 0.7, L + 0.5], [0.25, L + 0.5], [0.25, 4.2], [0, 4.2]], M.stampo, 48);
  giro.add(mandrino);
  var fibra = new T.Group(); giro.add(fibra);

  function strato(n, campioni, xDi, thDi, r, raggioTubo, mat) {
    var pts = [];
    for (var i = 0; i <= campioni; i++) { var s = i / campioni, th = thDi(s); pts.push(new T.Vector3(xDi(s), r * Math.cos(th), r * Math.sin(th))); }
    var g = new T.TubeGeometry(new T.CatmullRomCurve3(pts), campioni, raggioTubo, 5, false);
    var m = new T.Mesh(g, mat); fibra.add(m);
    return { m: m, g: g, n: campioni, x: xDi, th: thDi, mostra: function (u) { g.setDrawRange(0, Math.floor(Math.max(0, Math.min(1, u)) * campioni) * 5 * 6); } };
  }
  var mF = k.nuovo(k.COL.fuso, { roughness: 0.35, metalness: 0.2 });
  function tri(s, n) { var p = (s * n) % 1; return p < 0.5 ? p * 2 : 2 - p * 2; }
  var CIRC = 3, GIRI = 1.3;
  var elica = strato(1, 1400, function (s) { return -L + 2 * L * tri(s, CIRC); }, function (s) { return s * CIRC * 2 * GIRI * 2 * Math.PI; }, R + 0.04, 0.045, mF);
  var GA = 48;
  var anelli = strato(2, 1600, function (s) { return -L + 2 * L * s; }, function (s) { return s * GA * 2 * Math.PI; }, R + 0.11, 0.06, mF);
  // nastro: manicotto rivelato da sinistra a destra
  var piano = new T.Plane(new T.Vector3(-1, 0, 0), -L);
  var mN = k.nuovo(0xffffff, { transparent: true, opacity: 0.45, roughness: 0.2, side: T.DoubleSide }); mN.clippingPlanes = [piano];
  var nastro = new T.Mesh(new T.CylinderGeometry(R + 0.19, R + 0.19, 2 * L, 48, 1, true).rotateZ(Math.PI / 2), mN); fibra.add(nastro);

  // carrello: testa guidafilo, bagno con ruota, bobina
  var carro = new T.Group(); radice.add(carro);
  add(carro, k.blocco(-0.5, 0.5, -1.7, -1.4, 2.1, 3.1, M.scuro, true));
  add(carro, k.blocco(-0.12, 0.12, -1.4, 0.15, 2.5, 2.7, M.macchina, true));
  var testa = add(carro, k.blocco(-0.18, 0.18, -0.15, 0.15, ZT - 0.05, 2.7, M.scuro, true));
  var bagno = new T.Mesh(new T.BoxGeometry(0.8, 0.35, 0.6), k.nuovo(k.COL.fuso, { transparent: true, opacity: 0.45 })); bagno.position.set(-0.9, -1.2, 2.6); carro.add(bagno);
  var ruota = new T.Mesh(new T.CylinderGeometry(0.28, 0.28, 0.12, 24).rotateX(Math.PI / 2), M.stampo); ruota.position.set(-0.9, -1.0, 2.6); carro.add(ruota);
  var bobina = new T.Mesh(new T.CylinderGeometry(0.35, 0.35, 0.5, 24).rotateX(Math.PI / 2), k.nuovo(0x2b2f36)); bobina.position.set(-1.0, 0.6, 3.0); carro.add(bobina);
  var filo = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, ZT - R - 0.05, 6).rotateX(Math.PI / 2), mF); filo.position.set(0, 0, (ZT + R) / 2); carro.add(filo);

  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  function porta(st, u) { var s = Math.max(0, Math.min(1, u)); carro.position.x = st.x(s); giro.rotation.x = Math.PI / 2 - st.th(s); }
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    elica.mostra(fase === 1 ? 0 : fase === 2 ? t : 1);
    anelli.mostra(fase < 3 ? 0 : fase === 3 ? t : 1);
    piano.constant = fase < 4 ? -L - 1 : fase === 4 ? -L + 2 * L * t : 100;
    filo.visible = fase <= 3;
    if (fase === 1) { carro.position.x = -L - 1 + e; giro.rotation.x = Math.PI / 2; }
    else if (fase === 2) porta(elica, t);
    else if (fase === 3) porta(anelli, t);
    else if (fase === 4) { carro.position.x = -L + 2 * L * t; giro.rotation.x = -t * 30 * Math.PI; }
    else { carro.position.x = L; giro.rotation.x = 0; }
    ruota.rotation.z = -(fase - 1 + t) * 20; bobina.rotation.z = ruota.rotation.z * 0.6;
    mF.color.copy(cF).lerp(cS, fase === 5 ? Math.min(1, e * 2) : 0);
    // estrazione del mandrino
    contro.visible = !(fase === 5 && t > 0.35);
    mandrino.position.x = fase === 5 ? 9 * Math.max(0, (t - 0.45) / 0.55) : 0;
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.4,
    camera: { posizione: [3, 6, 12], bersaglio: [0, -0.3, 0.6] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Mandrino', ancora: su(radice, -1.6, R + 0.2, -0.4) },
      { testo: 'Testa guidafilo', ancora: su(carro, 0, 0.2, 2.6) },
      { testo: 'Bagno di resina', ancora: su(carro, -0.9, -1.0, 2.9) },
      { testo: 'Testa motrice', ancora: su(radice, -4.5, 1.2, 0) }
    ]
  };
});
