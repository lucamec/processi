/* Vista 3D – Lavorazione CNC a 3 e 5 assi (Thompson 2007, pp. 182–189).
 * Portale con mandrino che trasla su X, Y, Z; nella fase 5 la testa ruota su due assi per i fori obliqui
 * (il motivo per cui la pagina ha il 3D: tre traslazioni + due rotazioni non si leggono in una vista ortogonale).
 * Fasi: 1 fissaggio, 2 contorno, 3 bordo, 4 scavo, 5 fori inclinati.
 */
Vista3D.registra('lavorazione-cnc', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  var legno = k.nuovo(0xc9a46a, { roughness: 0.75 });
  add(radice, k.blocco(-6, 6, -1.4, -1.0, -4, 4, M.macchina, true));
  add(radice, k.blocco(-4.5, 4.5, -1.0, -0.4, -3.2, 3.2, M.stampo, true));          // tavola a vuoto
  // portale
  var portale = new T.Group(); radice.add(portale);
  [-4.8, 4.8].forEach(function (x) { add(portale, k.blocco(x - 0.3, x + 0.3, -1.0, 4.6, -0.3, 0.3, M.macchina, true)); });
  add(portale, k.blocco(-5.1, 5.1, 4.0, 4.6, -0.35, 0.35, M.macchina, true));
  var carrello = new T.Group(); carrello.position.y = 4.0; portale.add(carrello);
  add(carrello, k.blocco(-0.5, 0.5, -0.4, 0.6, 0.35, 1.0, M.scuro, true));
  var asseZ = new T.Group(); carrello.add(asseZ);
  var testa = new T.Group(); testa.position.set(0, -0.6, 0.68); asseZ.add(testa);
  var corpo = new T.Mesh(new T.CylinderGeometry(0.35, 0.35, 1.2, 24), M.macchina); corpo.position.y = -0.6; testa.add(corpo);
  var fresa = new T.Mesh(new T.CylinderGeometry(0.1, 0.1, 0.9, 16), k.nuovo(0xb0b8c0, { metalness: 0.8, roughness: 0.25 })); fresa.position.y = -1.65; testa.add(fresa);
  [corpo, fresa].forEach(function (m) { m.castShadow = true; });
  // pezzo: grezzo e seduta sagomata (fianchi estrusi + superficie superiore deformabile)
  var grezzo = add(radice, k.blocco(-3.2, 3.2, -0.4, 0.3, -2.2, 2.2, legno, true));
  var sh = new T.Shape(); var W = 2.6, D = 1.9, r = 0.8;
  sh.moveTo(-W + r, -D); sh.lineTo(W - r, -D); sh.quadraticCurveTo(W, -D, W, -D + r); sh.lineTo(W, D - r); sh.quadraticCurveTo(W, D, W - r, D); sh.lineTo(-W + r, D); sh.quadraticCurveTo(-W, D, -W, D - r); sh.lineTo(-W, -D + r); sh.quadraticCurveTo(-W, -D, -W + r, -D);
  var invis = new T.MeshBasicMaterial({ visible: false });
  var fianchi = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.7, bevelEnabled: false, curveSegments: 16 }).rotateX(-Math.PI / 2).translate(0, -0.4, 0), [invis, legno]); radice.add(fianchi);
  var top = k.lastra(W - 0.02, D - 0.02, 50, 40, k.nuovo(0xc9a46a, { roughness: 0.75, side: T.DoubleSide })); radice.add(top.mesh);
  function conca(x, z) { return -0.45 * Math.max(0, 1 - Math.pow(x / 2.0, 2) - Math.pow(z / 1.5, 2)); }
  var fori = new T.Group(); radice.add(fori);
  var buchi = [[-1.8, -1.2, 0.35, 0.3], [1.8, -1.2, 0.35, -0.3], [0, 1.3, -0.4, 0]];
  buchi.forEach(function (b) { var h = new T.Mesh(new T.CylinderGeometry(0.16, 0.16, 0.9, 16), k.nuovo(0x2e2a26)); h.position.set(b[0], 0.0, b[1]); h.rotation.set(b[2], 0, b[3]); fori.add(h); });
  function perim(u) { // punto sul contorno arrotondato (approssimazione con un'ellisse squadrata)
    var a = u * Math.PI * 2, c = Math.cos(a), s = Math.sin(a), p = 6;
    return [W * Math.sign(c) * Math.pow(Math.abs(c), 2 / p), D * Math.sign(s) * Math.pow(Math.abs(s), 2 / p)];
  }
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    grezzo.visible = fase === 1 || (fase === 2 && t < 0.95);
    fianchi.visible = top.mesh.visible = !grezzo.visible;
    var prof = fase === 4 ? e : fase === 5 ? 1 : 0;
    top.imposta(function (x, z) { var bordo = (fase >= 3) ? -0.12 * Math.pow(Math.max(Math.abs(x) / W, Math.abs(z) / D), 8) : 0; return 0.3 + prof * conca(x, z) + bordo; });
    fori.visible = fase === 5 && t > 0.3;
    var x = 0, z = 0, y = 2.6, rotX = 0, rotZ = 0;
    if (fase === 2 || fase === 3) { var p = perim(t); x = p[0]; z = p[1]; y = fase === 2 ? 0.75 : 0.95; }
    if (fase === 4) { var righe = 6, rr = Math.min(righe - 1, Math.floor(t * righe)), u = t * righe - rr; x = (rr % 2 ? 1 - u : u) * 3.6 - 1.8; z = -1.2 + 2.4 * rr / (righe - 1); y = 1.3 + conca(x, z); }
    if (fase === 5) { var i = Math.min(2, Math.floor(t * 3)), b = buchi[i]; x = b[0]; z = b[1]; y = 1.4; rotX = b[2]; rotZ = b[3]; }
    portale.position.z = z; carrello.position.x = x; asseZ.position.y = y - 4.0 + 1.85 + 0.6;
    testa.rotation.set(rotX, 0, rotZ);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -1.4,
    camera: { posizione: [5, 9, 15], bersaglio: [0, 1.2, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Portale (asse Y)', ancora: su(portale, 4.8, 4.6, 0) },
      { testo: 'Carrello (asse X)', ancora: su(carrello, 0, 0.6, 1.0) },
      { testo: 'Testa: asse Z + 2 rotazioni', ancora: su(testa, 0.4, -0.6, 0) },
      { testo: 'Seduta in faggio', ancora: su(radice, -2.6, 0.3, 1.9) }
    ]
  };
});
