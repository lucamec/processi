/* Vista 3D – Taglio del vetro per incisione: un disco (Thompson 2007, pp. 276–279).
 * La rotella traccia un cerchio e quattro linee di rottura; poi i quattro pezzi esterni si separano.
 * Fasi: 1 lubrificazione, 2 incisione, 3 separazione, 4 rifinitura.
 */
Vista3D.registra('taglio-vetro', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var S = 0.12, RD = 1.1, W = 2.4, H = 1.8, NC = 80;
  add(radice, k.blocco(-4, 4, -2.2, -1.8, -3, 3, M.macchina, true));
  add(radice, k.blocco(-3.0, 3.0, -1.8, -0.02, -2.3, 2.3, k.nuovo(0x4a5560, { roughness: 0.95 }), true));   // piano in feltro
  var mVe = k.nuovo(0xa9d3df, { transparent: true, opacity: 0.6, roughness: 0.08, metalness: 0.1, side: T.DoubleSide });
  function pianta(pts, mat) { var g = new T.Group(); g.rotation.x = Math.PI / 2; g.add(k.estruso(pts, null, -S, 0, mat, true)); return g; }
  // lastra intera; dopo la rottura: disco + 4 quadranti
  var intera = pianta([[-W, -H], [W, -H], [W, H], [-W, H]], mVe); radice.add(intera);
  var mDi = k.nuovo(0xa9d3df, { transparent: true, opacity: 0.7, roughness: 0.08, side: T.DoubleSide });
  var cerchio = []; for (var i = 0; i < 64; i++) { var a = i / 64 * Math.PI * 2; cerchio.push([RD * Math.cos(a), RD * Math.sin(a)]); }
  var disco = pianta(cerchio, mDi); radice.add(disco);
  var quadri = [0, 1, 2, 3].map(function (q) {
    var sx = q === 0 || q === 3 ? 1 : -1, sz = q < 2 ? 1 : -1, pts = [];
    for (var j = 0; j <= 16; j++) { var t = j / 16 * Math.PI / 2; pts.push([sx * RD * Math.cos(t), sz * RD * Math.sin(t)]); }
    pts.push([0, sz * H], [sx * W, sz * H], [sx * W, 0]);
    if (sx * sz < 0) pts.reverse();
    var g = pianta(pts, mVe); radice.add(g); return { g: g, sx: sx, sz: sz };
  });
  // linee incise: cerchio + 4 linee radiali
  var pc = []; for (i = 0; i <= NC; i++) { var b = i / NC * Math.PI * 2; pc.push(new T.Vector3(RD * Math.cos(b), S + 0.004, RD * Math.sin(b))); }
  var mLin = new T.LineBasicMaterial({ color: 0xffffff });
  var lCerchio = new T.Line(new T.BufferGeometry().setFromPoints(pc), mLin); radice.add(lCerchio);
  var radiali = [[RD, 0, W, 0], [0, RD, 0, H], [-RD, 0, -W, 0], [0, -RD, 0, -H]];
  var lRad = new T.LineSegments(new T.BufferGeometry().setFromPoints([].concat.apply([], radiali.map(function (r) { return [new T.Vector3(r[0], S + 0.004, r[1]), new T.Vector3(r[2], S + 0.004, r[3])]; }))), mLin); radice.add(lRad);
  // testa con rotella
  var testa = new T.Group(); radice.add(testa);
  add(testa, k.blocco(-0.15, 0.15, 0.35, 1.6, -0.15, 0.15, M.macchina, true));
  var forc = new T.Mesh(new T.BoxGeometry(0.16, 0.25, 0.16), M.stampo); forc.position.y = 0.25; testa.add(forc);
  var rot = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 0.04, 24).rotateX(Math.PI / 2), M.scuro); rot.position.y = 0.1; testa.add(rot);
  var goccia = new T.Mesh(new T.ConeGeometry(0.2, 0.4, 16, 1, true), k.nuovo(k.COL.flusso, { transparent: true, opacity: 0.3, depthWrite: false })); goccia.rotation.x = Math.PI; goccia.position.set(0.4, 0.5, 0); testa.add(goccia);
  // mola per il bordo
  var mola = new T.Mesh(new T.CylinderGeometry(0.4, 0.4, 0.3, 32), k.nuovo(0x8a8f96, { roughness: 0.9 })); radice.add(mola);

  var cV = new T.Color(0xa9d3df), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t), hx = -W - 0.4, hz = 0;
    goccia.visible = fase === 1;
    if (fase === 1) { hx = -W - 0.4 + (W + 0.4 + RD) * e; }
    if (fase === 2) {
      if (t < 0.7) { var a = (t / 0.7) * Math.PI * 2; hx = RD * Math.cos(a); hz = RD * Math.sin(a); }
      else { var u = (t - 0.7) / 0.3 * 4, n = Math.min(3, Math.floor(u)), f = u - n, r = radiali[n]; hx = r[0] + (r[2] - r[0]) * f; hz = r[1] + (r[3] - r[1]) * f; }
    }
    if (fase >= 3) { hx = W + 0.6; hz = H; }
    testa.position.set(hx, S, hz);
    lCerchio.geometry.setDrawRange(0, fase < 2 ? 0 : fase === 2 ? Math.floor(Math.min(1, t / 0.7) * NC) + 1 : NC + 1);
    var nr = fase < 2 ? 0 : fase === 2 ? (t < 0.7 ? 0 : Math.ceil((t - 0.7) / 0.3 * 4)) : 4;
    lRad.geometry.setDrawRange(0, nr * 2);
    var rotto = fase >= 3;
    intera.visible = !rotto; disco.visible = rotto; quadri.forEach(function (q) { q.g.visible = rotto; });
    lCerchio.visible = lRad.visible = !rotto;
    var sep = fase === 3 ? e : fase === 4 ? 1 : 0;
    quadri.forEach(function (q) { q.g.position.set(q.sx * 0.5 * sep, 0, q.sz * 0.5 * sep); q.g.rotation.z = 0; });
    // rifinitura: la mola gira attorno al bordo del disco
    mola.visible = fase === 4;
    var am = t * Math.PI * 2; mola.position.set((RD + 0.4) * Math.cos(am), S / 2, (RD + 0.4) * Math.sin(am)); mola.rotation.y = t * 40;
    mDi.color.copy(cV).lerp(cS, fase === 4 ? e : 0);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.2,
    camera: { posizione: [4, 6.5, 8], bersaglio: [0, 0, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Rotella in carburo di tungsteno', ancora: su(testa, 0.15, 1.4, 0) },
      { testo: 'Lastra di vetro', ancora: su(radice, -W, S, H) },
      { testo: 'Disco', ancora: su(disco, 0, 0.1, 0), visibile: function () { return disco.visible; } }
    ]
  };
});
