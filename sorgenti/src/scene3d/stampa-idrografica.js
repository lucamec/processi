/* Vista 3D – Stampa a trasferimento ad acqua (Thompson 2007, pp. 408–411).
 * Vasca d'acqua tiepida, film in PVOH con motivo mimetico (colori per vertice, nessuna immagine),
 * guscio con fondo grigio immerso dall'alto: il motivo resta sulla parte che è passata sotto il pelo dell'acqua.
 * Fasi: 1 fondo, 2 film sull'acqua, 3 attivatore, 4 immersione, 5 risciacquo e lacca.
 */
Vista3D.registra('stampa-idrografica', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var CAMO = [new T.Color(0x3d4a2a), new T.Color(0x6b7a3a), new T.Color(0x8a6a42)];
  function camo(x, z) { var v = Math.sin(x * 3.1 + Math.sin(z * 2.3)) + 0.8 * Math.sin(z * 3.7 - x * 1.3) + 0.3 * Math.sin((x + z) * 5.3); return CAMO[v < -0.5 ? 0 : v < 0.45 ? 1 : 2]; }
  function colora(geo, fx) { var p = geo.attributes.position, col = new Float32Array(p.count * 3); for (var i = 0; i < p.count; i++) { var c = fx(p.getX(i), p.getY(i), p.getZ(i)); col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b; } geo.setAttribute('color', new T.BufferAttribute(col, 3)); }
  // vasca
  add(radice, k.blocco(-2.4, 2.4, -2.0, 0.15, -1.6, 1.6, M.macchina));
  var mAcqua = k.nuovo(0x8fc0e0, { transparent: true, opacity: 0.4, depthWrite: false });
  add(radice, k.blocco(-2.2, 2.2, -1.8, 0, -1.4, 1.4, mAcqua, false, mAcqua));
  // film galleggiante
  var gFilm = new T.PlaneGeometry(2.6, 2.0, 52, 40).rotateX(-Math.PI / 2);
  colora(gFilm, function (x, y, z) { return camo(x, z); });
  var mFilm = new T.MeshStandardMaterial({ vertexColors: true, transparent: true, opacity: 0.85, roughness: 0.6, side: T.DoubleSide });
  var film = new T.Mesh(gFilm, mFilm); film.position.y = 0.012; radice.add(film);
  // paratie scorrevoli
  var paratie = [[0, -1.25, 2.8, 0.08], [0, 1.25, 2.8, 0.08], [-1.5, 0, 0.08, 2.4], [1.5, 0, 0.08, 2.4]].map(function (p) {
    var m = new T.Mesh(new T.BoxGeometry(p[2], 0.12, p[3]), M.scuro); radice.add(m); return { m: m, x: p[0], z: p[1] };
  });
  // pistola dell'attivatore
  var pist = new T.Group(); radice.add(pist);
  var cp = new T.Mesh(new T.CylinderGeometry(0.07, 0.1, 0.4, 12), M.stampo); cp.position.y = 1.4; pist.add(cp);
  var spruzzo = new T.Mesh(new T.ConeGeometry(0.5, 1.15, 20, 1, true), k.nuovo(0xe8ecef, { transparent: true, opacity: 0.35, depthWrite: false, side: T.DoubleSide })); spruzzo.position.y = 0.62; pist.add(spruzzo);
  // pezzo: guscio con la convessità verso il basso, su un supporto
  var pezzo = new T.Group(); radice.add(pezzo);
  add(pezzo, k.blocco(-0.04, 0.04, 0, 1.8, -0.04, 0.04, M.scuro, true));
  var gG = new T.SphereGeometry(0.9, 48, 24, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2); gG.scale(1.1, 0.6, 0.7);
  var mFondo = k.nuovo(0xc8ccd0, { roughness: 0.8, side: T.DoubleSide });
  pezzo.add(new T.Mesh(gG, mFondo));
  var gC = gG.clone(); gC.scale(1.006, 1.006, 1.006); colora(gC, function (x, y, z) { return camo(x * 1.2, z * 1.2); });
  var piano = new T.Plane(new T.Vector3(0, -1, 0), 0);
  var mCamo = new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.75, side: T.DoubleSide, clippingPlanes: [piano] });
  pezzo.add(new T.Mesh(gC, mCamo));
  var YA = 2.2, FONDO = -0.54; // quota del supporto sopra la vasca; punto più basso del guscio
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    // posizione del pezzo e profondità massima raggiunta (in coordinate locali)
    var y = YA, prof = 0;
    if (fase === 4) { var d = Math.sin(Math.min(1, t) * Math.PI); y = YA + (-0.6 - YA) * Math.min(1, d * 1.3); prof = t < 0.5 ? Math.max(0, -(y + FONDO)) : 0.9; }
    if (fase === 5) prof = 0.9;
    pezzo.position.set(fase === 1 ? -0.8 + 0.8 * e : 0, y, 0); pezzo.rotation.z = fase === 4 ? 0.25 * Math.sin(t * Math.PI) : 0;
    mFondo.color.setHex(fase === 1 && t < 0.4 ? 0x9aa0a6 : 0xc8ccd0);
    piano.constant = pezzo.position.y + FONDO + prof; mCamo.visible = prof > 0;
    mCamo.roughness = fase === 5 ? 0.75 - 0.55 * Math.max(0, (t - 0.4) / 0.6) : 0.75;
    // film
    film.visible = fase >= 2 && fase <= 4 && !(fase === 4 && t > 0.5);
    film.scale.setScalar(fase === 2 ? 0.2 + 0.8 * Math.min(1, t * 2) : 1);
    mFilm.opacity = fase === 4 ? 0.85 * (1 - t * 2) : fase === 3 ? 0.85 - 0.25 * e : 0.85;
    var ch = fase === 2 ? Math.max(0, (t - 0.5) * 2) : fase >= 3 && fase <= 4 ? 1 : 0;
    paratie.forEach(function (p) { p.m.visible = fase >= 2 && fase <= 4; p.m.position.set(p.x * (1.4 - 0.4 * ch), 0.05, p.z * (1.4 - 0.4 * ch)); });
    pist.visible = fase === 3 || (fase === 5 && t > 0.4);
    pist.position.set(fase === 3 ? -1 + 2 * e : 0.4, fase === 3 ? -0.3 : 1.6, 0); spruzzo.scale.y = fase === 3 ? 0.75 : 1; pist.rotation.z = fase === 3 ? 0 : Math.PI; // la lacca si spruzza dal basso sulla faccia stampata
    spruzzo.material.color.setHex(fase === 3 ? 0xe8ecef : 0xfff6d8);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -2.0,
    camera: { posizione: [3, 4.5, 7.5], bersaglio: [0, 0.4, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Acqua a 30–40 °C', ancora: su(radice, -2.2, -0.8, 1.4) },
      { testo: 'Film in PVOH con l\'inchiostro', ancora: su(film, 1.3, 0, 1.0), visibile: function () { return film.visible; } },
      { testo: 'Pezzo con fondo', ancora: su(pezzo, 1.0, -0.2, 0) },
      { testo: 'Attivatore', ancora: su(pist, 0.1, 1.6, 0), visibile: function () { return pist.visible && spruzzo.material.color.getHex() === 0xe8ecef; } },
      { testo: 'Lacca trasparente', ancora: su(pist, 0.1, 1.4, 0), visibile: function () { return pist.visible && spruzzo.material.color.getHex() !== 0xe8ecef; } }
    ]
  };
});
