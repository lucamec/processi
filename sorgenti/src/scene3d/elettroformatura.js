/* Vista 3D – Elettroformatura (Thompson 2007, pp. 140–143).
 * Fasi: 1 mandrino, 2 strato d'argento, 3 deposizione, 4 distacco.
 */
Vista3D.registra('elettroformatura', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat, add = function (g, o) { if (o) g.add(o); return o; };
  add(radice, k.blocco(-5.5, 5.5, -3.4, -3.0, -3, 3, M.macchina, true));
  var vetro = M.vetro.clone();
  var vasca = new T.Mesh(new T.BoxGeometry(9, 5.4, 4.6), vetro); vasca.position.y = -0.3; vasca.renderOrder = 3; radice.add(vasca);
  var sp = new T.LineSegments(new T.EdgesGeometry(vasca.geometry), new T.LineBasicMaterial({ color: 0x6b7682 })); sp.position.copy(vasca.position); radice.add(sp);
  var liquido = new T.Mesh(new T.BoxGeometry(8.9, 4.6, 4.5), k.nuovo(k.COL.flusso, { transparent: true, opacity: 0, depthWrite: false })); liquido.position.y = -0.7; liquido.renderOrder = 2; radice.add(liquido);
  // anodi nel cestello
  var anodi = new T.Group(); anodi.position.x = -3.2; radice.add(anodi);
  var rame = k.nuovo(0xb87333, { metalness: 0.6, roughness: 0.35 });
  for (var i = 0; i < 12; i++) { var b = new T.Mesh(new T.SphereGeometry(0.28, 14, 10), rame); b.position.set((i % 2) * 0.5 - 0.25, -2.2 + Math.floor(i / 2) * 0.7, (i % 3) * 0.4 - 0.4); anodi.add(b); }
  // mandrino: lastra verticale con rilievi (forma nel piano YZ, sporge verso -X)
  var rilievo = function (y, z) { return 0.35 * Math.sin(y * 2.2) * Math.cos(z * 1.6) + 0.25 * Math.exp(-(y * y + z * z) / 0.8); };
  var silicone = k.nuovo(0xbfc6ce, { roughness: 0.8, side: T.DoubleSide });
  var mand = k.lastra(1.9, 1.9, 60, 60, silicone);
  mand.imposta(function (x, z) { return 0; }, function () { return [0, 0]; });
  // giro la lastra per renderla verticale (faccia verso -X)
  var supporto = new T.Group(); supporto.position.set(2.6, -0.6, 0); radice.add(supporto);
  mand.mesh.rotation.z = Math.PI / 2; supporto.add(mand.mesh);
  add(supporto, k.blocco(0.0, 0.6, -2.1, 2.1, -2.1, 2.1, M.scuro));
  var depos = k.nuovo(k.COL.fuso, { metalness: 0.6, roughness: 0.3, side: T.DoubleSide });
  var strato = k.lastra(1.9, 1.9, 60, 60, depos); strato.mesh.rotation.z = Math.PI / 2; supporto.add(strato.mesh);
  // forma del mandrino: x (dopo la rotazione diventa la sporgenza verso -X) = rilievo
  mand.imposta(function (x, z) { return rilievo(x, z); });
  // ioni
  var N = 40, rnd = k.rng(5), ioni = new T.InstancedMesh(new T.SphereGeometry(0.06, 8, 6), rame, N), m4 = new T.Matrix4(), semi = [];
  for (var j = 0; j < N; j++) semi.push([rnd(), (rnd() - 0.5) * 3.4, (rnd() - 0.5) * (k.taglio ? 1.6 : 3.4) - (k.taglio ? 0.8 : 0)]);
  radice.add(ioni);
  var cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    liquido.material.opacity = fase === 3 ? 0.14 : 0;
    anodi.visible = fase === 3;
    silicone.color.set(fase >= 2 ? 0xd8dcdf : 0xbfc6ce);
    var sp = fase === 3 ? 0.04 + 0.18 * e : 0.22;
    strato.mesh.visible = fase >= 3;
    strato.imposta(function (x, z) { return rilievo(x, z) + sp; });
    strato.mesh.position.x = fase === 4 ? 0 : 0; strato.mesh.position.y = 0;
    strato.mesh.position.x = 0; strato.mesh.position.z = 0;
    if (fase === 4) strato.mesh.position.x = -1.6 * e; // il guscio si stacca verso sinistra (X locale del supporto)
    depos.color.copy(fase === 4 ? cS : cF);
    ioni.visible = fase === 3;
    for (var j = 0; j < N; j++) { var s = (semi[j][0] + t * 3) % 1; m4.makeTranslation(-3.0 + s * 5.2, semi[j][1] - 0.6, semi[j][2]); ioni.setMatrixAt(j, m4); }
    ioni.instanceMatrix.needsUpdate = true;
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -3.4,
    camera: { posizione: [-3, 5, 13], bersaglio: [0.4, -0.4, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Anodi di rame', ancora: su(anodi, 0, 1.6, 0), visibile: function () { return anodi.visible; } },
      { testo: 'Mandrino', ancora: su(supporto, 0.3, 2.1, -1.5) },
      { testo: 'Guscio elettroformato', ancora: su(strato.mesh, 0, 1.6, 0), visibile: function () { return strato.mesh.visible; } }
    ]
  };
});
