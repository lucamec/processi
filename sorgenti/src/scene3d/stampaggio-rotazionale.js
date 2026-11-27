/* Vista 3D – Stampaggio rotazionale (Thompson 2007, pp. 36–39).
 * Giostra a tre stazioni (carico/scarico, forno, raffreddamento; il braccio ruota di 120°, p. 39).
 * All'estremità del braccio la forcella ruota attorno all'asse primario e lo stampo attorno al secondario (p. 37).
 * Fasi: 1 carico e chiusura, 2 riscaldamento in rotazione, 3 raffreddamento in rotazione, 4 apertura ed estrazione.
 */
Vista3D.registra('stampaggio-rotazionale', function (T, k) {
  'use strict';
  var radice = new T.Group();
  var M = k.mat;
  var R = 5.5, Y0 = -2;
  var add = function (g, o) { if (o) g.add(o); return o; };
  var clamp = function (x) { return Math.max(0, Math.min(1, x)); };

  // Mozzo centrale
  var mozzo = new T.Mesh(new T.CylinderGeometry(0.55, 0.7, 2.4, 40), M.macchina);
  mozzo.position.y = Y0 + 1.2; mozzo.castShadow = mozzo.receiveShadow = true; radice.add(mozzo);

  // Stazioni ----------------------------------------------------------------
  function stazione(gradi) {
    var g = new T.Group();
    var a = -gradi * Math.PI / 180;
    g.position.set(-R * Math.cos(a), 0, R * Math.sin(a));
    g.rotation.y = a;
    radice.add(g);
    return g;
  }
  function camera(g, tinta) {
    var vetro = M.vetro.clone();
    var box = new T.Mesh(new T.BoxGeometry(3.6, 3.4, 3.6), vetro);
    box.position.y = Y0 + 1.7; box.renderOrder = 2; g.add(box);
    var spigoli = new T.LineSegments(new T.EdgesGeometry(box.geometry), new T.LineBasicMaterial({ color: 0x6b7682 }));
    spigoli.position.copy(box.position); g.add(spigoli);
    add(g, k.blocco(-1.8, 1.8, Y0, Y0 + 0.08, -1.8, 1.8, M.macchina, true));
    var elementi = k.nuovo(k.COL.scuro, { emissive: tinta, emissiveIntensity: 0 });
    [-0.8, 0, 0.8].forEach(function (z) { add(g, k.blocco(-1.75, -1.65, Y0 + 0.5, Y0 + 2.7, z - 0.08, z + 0.08, elementi, true)); });
    return { vetro: vetro, elementi: elementi, tinta: new T.Color(tinta) };
  }
  var carico = stazione(0);
  add(carico, k.blocco(-1.3, 1.3, Y0, Y0 + 0.5, -1.3, 1.3, M.macchina, true));
  var forno = camera(stazione(120), k.COL.fuso);
  var freddo = camera(stazione(240), k.COL.flusso);

  // Braccio, forcella, stampo ------------------------------------------------
  var braccio = new T.Group(); braccio.position.y = 0.2; radice.add(braccio);
  add(braccio, k.blocco(-R + 1.25, -0.5, -0.14, 0.14, -0.14, 0.14, M.scuro, true));
  var centro = new T.Group(); centro.position.x = -R; centro.scale.setScalar(1.3); braccio.add(centro);   // centro dello stampo, non ruota con la forcella
  var forcella = new T.Group(); centro.add(forcella);                        // ruota attorno all'asse primario (X locale)
  var F = 1.25, s = 0.08;
  [k.blocco(F - s, F + s, -F - s, F + s, -s, s, M.scuro, true),
   k.blocco(-s, F, F - s, F + s, -s, s, M.scuro, true),
   k.blocco(-s, F, -F - s, -F + s, -s, s, M.scuro, true)].forEach(function (b) { add(forcella, b); });
  var stampo = new T.Group(); forcella.add(stampo);                         // ruota attorno all'asse secondario (Y locale)
  [1, -1].forEach(function (sg) { var p = new T.Mesh(new T.CylinderGeometry(0.07, 0.07, F - 0.75, 12), M.scuro); p.position.y = sg * (0.75 + (F - 0.75) / 2); stampo.add(p); });

  // stampo in due metà (pareti 0,1); in spaccato si vede l'interno
  var ex = 0.95, ey = 0.75, ez = 0.75, w = 0.1;
  function meta(sg) {
    var g = new T.Group();
    var y0 = sg > 0 ? 0 : -ey, y1 = sg > 0 ? ey : 0;
    var yf0 = sg > 0 ? ey - w : -ey, yf1 = sg > 0 ? ey : -ey + w;
    [k.blocco(-ex, ex, yf0, yf1, -ez, ez, M.stampo),
     k.blocco(-ex, -ex + w, y0, y1, -ez, ez, M.stampo), k.blocco(ex - w, ex, y0, y1, -ez, ez, M.stampo),
     k.blocco(-ex + w, ex - w, y0, y1, -ez, -ez + w, M.stampo), k.blocco(-ex + w, ex - w, y0, y1, ez - w, ez, M.stampo)].forEach(function (b) { add(g, b); });
    stampo.add(g);
    return g;
  }
  meta(-1);
  var coperchio = meta(1);
  var sfiato = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 0.35, 12), M.macchina);
  sfiato.position.set(0.45, ey + 0.17, k.taglio ? -0.3 : 0); coperchio.add(sfiato);

  // strato di polimero sulle pareti interne: spessore animato
  var strato = k.nuovo(k.COL.fuso, { emissive: k.COL.fuso, emissiveIntensity: 0.25, roughness: 0.45 });
  var ix = ex - w, iy = ey - w, iz = ez - w, zMax = k.taglio ? 0 : iz;
  var lastre = [];
  function lastra(asse, segno) {
    // lastra di spessore 1 con la faccia esterna nell'origine, cresce verso l'interno con scale
    var dim = { x: [1, 2 * iy, zMax + iz], y: [2 * ix, 1, zMax + iz], z: [2 * ix, 2 * iy, 1] }[asse];
    var g = new T.BoxGeometry(dim[0], dim[1], dim[2]);
    var off = { x: [-segno * 0.5, 0, (zMax - iz) / 2], y: [0, -segno * 0.5, (zMax - iz) / 2], z: [0, 0, -segno * 0.5] }[asse];
    g.translate(off[0], off[1], off[2]);
    var m = new T.Mesh(g, strato);
    m.position[asse] = segno * { x: ix, y: iy, z: iz }[asse];
    m.castShadow = true;
    m.userData.asse = asse;
    stampo.add(m); lastre.push(m);
  }
  lastra('x', 1); lastra('x', -1); lastra('y', 1); lastra('y', -1); lastra('z', -1);
  if (!k.taglio) lastra('z', 1);

  // polvere dosata: resta sul fondo per gravità (non ruota con lo stampo)
  var rnd = k.rng(11), N = 90;
  var polvere = new T.InstancedMesh(new T.IcosahedronGeometry(0.06, 0), M.grezzo, N), mtx = new T.Matrix4();
  for (var i = 0; i < N; i++) {
    var px = (rnd() - 0.5) * 1.0, pz = (rnd() - 0.5) * 0.6, py = -0.55 + rnd() * 0.12 - (px * px) * 0.1;
    if (k.taglio) pz = -Math.abs(pz);
    mtx.makeTranslation(px, py, pz); polvere.setMatrixAt(i, mtx);
  }
  centro.add(polvere);

  // assi di rotazione (tratteggiati)
  function asse(da, a, gruppo) {
    var g = new T.BufferGeometry().setFromPoints([new T.Vector3().fromArray(da), new T.Vector3().fromArray(a)]);
    var l = new T.Line(g, new T.LineDashedMaterial({ color: 0x4a5563, dashSize: 0.18, gapSize: 0.1 }));
    l.computeLineDistances(); gruppo.add(l); return l;
  }
  asse([-2.2, 0, 0], [2.0, 0, 0], centro);
  asse([0, -2.0, 0], [0, 2.0, 0], forcella);

  // Tracce per fase -----------------------------------------------------------
  var tBraccio = k.traccia([0, 120, 240, 360], 0);
  var tPrim = k.traccia([0, 540, 1080, 1080], 0);
  var tSec = k.traccia([0, 900, 1800, 1800], 0);
  var tCoperchio = k.traccia([0, 0, 0, 0.9], 0.9);
  var tStrato = k.traccia([0, 0.11, 0.11, 0.11], 0);
  var tPolvere = k.traccia([1, 0, 0, 0], 0);
  var tSolido = k.traccia([0, 0, 1, 1], 0);
  var cFuso = new T.Color(k.COL.fuso), cFin = new T.Color(k.COL.finito);

  function aggiorna(fase, t) {
    var arrivo = fase === 1 ? t : clamp(t / 0.3);        // il braccio si sposta all'inizio della fase
    var dopo = fase === 1 ? t : clamp((t - 0.25) / 0.75);
    braccio.rotation.y = -tBraccio(fase, arrivo) * Math.PI / 180;
    forcella.rotation.x = tPrim(fase, t) * Math.PI / 180;
    stampo.rotation.y = tSec(fase, t) * Math.PI / 180;
    coperchio.position.y = tCoperchio(fase, fase === 4 ? dopo : t);
    var sp = Math.max(0.001, tStrato(fase, fase === 2 ? dopo : t));
    lastre.forEach(function (m) { m.scale[m.userData.asse] = sp; m.visible = sp > 0.004; });
    var pv = Math.max(0.001, tPolvere(fase, fase === 2 ? dopo : t));
    polvere.scale.setScalar(pv); polvere.visible = pv > 0.01;
    var so = tSolido(fase, fase === 3 ? dopo : t);
    strato.color.lerpColors(cFuso, cFin, so);
    strato.emissiveIntensity = 0.25 * (1 - so);
    var caldo = fase === 2 ? clamp((t - 0.2) / 0.2) : 0, gelo = fase === 3 ? clamp((t - 0.2) / 0.2) : 0;
    forno.elementi.emissiveIntensity = 1.2 * caldo;
    forno.vetro.color.set(k.COL.vetro).lerp(forno.tinta, 0.3 * caldo);
    freddo.elementi.emissiveIntensity = 1.2 * gelo;
    freddo.vetro.color.set(k.COL.vetro).lerp(freddo.tinta, 0.3 * gelo);
  }

  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  var posStaz = function (gr, y) { var a = -gr * Math.PI / 180; return su(radice, -R * Math.cos(a), y, R * Math.sin(a)); };
  return {
    radice: radice,
    pavimento: Y0,
    camera: { posizione: [-4, 19, 20], bersaglio: [-0.6, -1.0, -0.8] },
    aggiorna: aggiorna,
    dettaglio: { punto: su(centro, 0, 0, 0), distanza: [-2.5, 4.5, 6.5] },
    etichette: [
      { testo: 'Carico e scarico', ancora: posStaz(0, Y0 + 0.6) },
      { testo: 'Forno ≈ 250 °C', ancora: posStaz(120, Y0 + 4.4) },
      { testo: 'Raffreddamento', ancora: posStaz(240, Y0 + 3.3) },
      { testo: 'Asse primario', ancora: su(centro, 0.6, -1.6, 0) },
      { testo: 'Asse secondario', ancora: su(forcella, 1.6, 0.4, 0) }
    ]
  };
});
