/* Vista 3D – Fresatura fotochimica (Thompson 2007, pp. 244–247).
 * La lamiera è la sovrapposizione di due metà estruse con i fori già tagliati; dentro ogni foro un
 * "tappo" di metallo si assottiglia verso il piano medio mentre l'acido incide dai due lati.
 * Fasi: 1 film, 2 esposizione UV, 3 sviluppo, 4 incisione chimica, 5 rimozione del film.
 */
Vista3D.registra('fresatura-fotochimica', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var LX = 3.2, LZ = 2.2, S = 0.24, H = S / 2;
  add(radice, k.blocco(-4.6, 4.6, -2.6, -2.2, -3, 3, M.macchina, true));

  // fessure passanti (griglia) e linee incise a metà lungo il bordo
  var fessure = [], linee = [];
  for (var r = 0; r < 4; r++) for (var c = 0; c < 3; c++) fessure.push([-2.1 + c * 1.5, -1.25 + r * 0.7, 1.2, 0.36]);
  linee.push([-2.9, -1.95, 5.8, 0.08], [-2.9, 1.87, 5.8, 0.08], [-2.9, -1.8, 0.08, 3.6], [2.82, -1.8, 0.08, 3.6]);
  function rettangolo(f) { return [[f[0], f[1]], [f[0] + f[2], f[1]], [f[0] + f[2], f[1] + f[3]], [f[0], f[1] + f[3]]]; }
  var bordo = [[-LX, -LZ], [LX, -LZ], [LX, LZ], [-LX, LZ]];

  var lam = new T.Group(); lam.rotation.x = -Math.PI / 2; radice.add(lam);   // piano XY -> XZ, spessore lungo Y
  var mOt = k.nuovo(0xc9a24a, { metalness: 0.6, roughness: 0.35, side: T.DoubleSide });
  lam.add(k.estruso(bordo, fessure.map(rettangolo), 0, H, mOt, true));
  lam.add(k.estruso(bordo, fessure.concat(linee).map(rettangolo), H, S, mOt, true));
  // tappi: si assottigliano verso il piano medio (fessure) o verso il fondo della linea (mezza incisione)
  var tappi = [];
  fessure.forEach(function (f) {
    [0, 1].forEach(function (lato) {
      var m = new T.Mesh(new T.BoxGeometry(f[2], H, f[3]), mOt); m.position.set(f[0] + f[2] / 2, 0, -(f[1] + f[3] / 2)); radice.add(m);
      tappi.push({ m: m, lato: lato });
    });
  });
  linee.forEach(function (f) { var m = new T.Mesh(new T.BoxGeometry(f[2], H, f[3]), mOt); m.position.set(f[0] + f[2] / 2, 0, -(f[1] + f[3] / 2)); radice.add(m); tappi.push({ m: m, lato: 1, linea: true }); });

  // film fotosensibile: intero (fasi 1–2) o aperto (fasi 3–4)
  var mFi = k.nuovo(k.COL.flusso, { transparent: true, opacity: 0.55, side: T.DoubleSide, depthWrite: false });
  var filmPieno = new T.Group(); radice.add(filmPieno);
  [S + 0.02, -0.02].forEach(function (y) { var m = new T.Mesh(new T.BoxGeometry(2 * LX, 0.03, 2 * LZ), mFi); m.position.y = y; filmPieno.add(m); });
  var filmAperto = new T.Group(); filmAperto.rotation.x = -Math.PI / 2; radice.add(filmAperto);
  filmAperto.add(k.estruso(bordo, fessure.concat(linee).map(rettangolo), S + 0.005, S + 0.035, mFi, true));
  filmAperto.add(k.estruso(bordo, fessure.map(rettangolo), -0.035, -0.005, mFi, true));
  // negativi e lampade UV
  var uv = new T.Group(); radice.add(uv);
  var mNeg = k.nuovo(0x1d232b, { transparent: true, opacity: 0.35, side: T.DoubleSide });
  [S + 0.25, -0.25].forEach(function (y) { var m = new T.Mesh(new T.BoxGeometry(2 * LX + 0.3, 0.02, 2 * LZ + 0.3), mNeg); m.position.y = y; uv.add(m); });
  var mUV = k.nuovo(0x8a5cf6, { emissive: 0x8a5cf6, emissiveIntensity: 0.9 });
  [1.6, -1.4].forEach(function (y) { var m = new T.Mesh(new T.BoxGeometry(5, 0.2, 3), mUV); m.position.y = y; uv.add(m); });
  // ugelli oscillanti
  var ugelli = new T.Group(); radice.add(ugelli);
  var mSp = k.nuovo(k.COL.fuso, { transparent: true, opacity: 0.25, depthWrite: false });
  [-2, 0, 2].forEach(function (x) {
    [1, -1].forEach(function (s) {
      var u = new T.Mesh(new T.BoxGeometry(0.3, 0.3, 0.3), M.scuro); u.position.set(x, s > 0 ? 1.6 : -1.4, 0); ugelli.add(u);
      var cono = new T.Mesh(new T.ConeGeometry(0.9, 1.3, 24, 1, true), mSp); cono.rotation.x = s > 0 ? 0 : Math.PI; cono.position.set(x, s > 0 ? 0.85 : -0.65, 0); ugelli.add(cono);
    });
  });

  var cG = new T.Color(0xc9a24a), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t), inc = fase < 4 ? 0 : fase === 4 ? e : 1;
    tappi.forEach(function (p) {
      var h = H * (1 - inc);
      p.m.visible = h > 0.002; p.m.scale.y = Math.max(0.001, 1 - inc);
      // lato 0: metà inferiore (scava da sotto verso il centro); lato 1: metà superiore (scava da sopra)
      p.m.position.y = p.lato === 0 ? H - h / 2 : H + h / 2;
    });
    filmPieno.visible = fase <= 2; filmAperto.visible = fase === 3 || fase === 4;
    uv.visible = fase === 2; ugelli.visible = fase === 4;
    ugelli.position.x = fase === 4 ? 0.6 * Math.sin(t * Math.PI * 8) : 0;
    mOt.color.copy(cG).lerp(cS, fase === 5 ? e : 0);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.6,
    camera: { posizione: [5, 8, 12], bersaglio: [0, 0, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Lamiera di ottone', ancora: su(radice, -LX, S, LZ) },
      { testo: 'Film fotosensibile', ancora: su(radice, -LX, S + 0.03, -LZ), visibile: function () { return filmPieno.visible || filmAperto.visible; } },
      { testo: 'Lampada UV', ancora: su(radice, 2.5, 1.7, 0), visibile: function () { return uv.visible; } },
      { testo: 'Ugelli oscillanti', ancora: su(ugelli, 2, 1.8, 0), visibile: function () { return ugelli.visible; } }
    ]
  };
});
