/* Vista 3D – Curvatura con mandrino a più piani (Thompson 2007, pp. 98–103).
 * La linea d'asse del tubo è costruita "a tartaruga": tratti dritti e archi di raggio R; prima di ogni arco
 * il tubo ruota sul proprio asse, così le curve stanno su piani diversi (il motivo per cui serve il 3D).
 * Fasi: 1 carico, 2 prima curva, 3 avanzamento e rotazione, 4 seconda curva (piano ruotato di 90°), 5 scarico.
 */
Vista3D.registra('curvatura-tubi', function (T, k) {
  'use strict';
  var radice = new T.Group(), M = k.mat;
  var R = 1.1, rT = 0.32;
  var tratti = [3.6, 3.0, 3.0], torsioni = [0, -Math.PI / 2];
  var mat = k.nuovo(k.COL.grezzo, { metalness: 0.6, roughness: 0.3 });
  var gruppo = new T.Group(); radice.add(gruppo);
  var tubo = new T.Mesh(new T.BufferGeometry(), mat); tubo.castShadow = true; gruppo.add(tubo);
  var base = k.blocco(-7, 7, -3.6, -3.2, -5, 5, M.macchina, true); radice.add(base);

  // matrice rotante + morsa: si porta sulla curva attiva
  var matrice = new T.Group(); gruppo.add(matrice);
  var disco = new T.Mesh(new T.CylinderGeometry(R - rT * 0.2, R - rT * 0.2, 0.9, 48), M.stampo); disco.castShadow = true; matrice.add(disco);
  var morsa = new T.Mesh(new T.BoxGeometry(1.4, 0.9, 0.5), M.scuro); matrice.add(morsa);

  function asse(angoli) {
    var p = new T.Vector3(-4.5, 1.6, -1.2), d = new T.Vector3(1, 0, 0), n = new T.Vector3(0, 0, 1);
    var pts = [p.clone()], info = [];
    for (var i = 0; i < tratti.length; i++) {
      var q = p.clone().addScaledVector(d, tratti[i]);
      for (var s = 1; s <= 10; s++) pts.push(p.clone().addScaledVector(d, tratti[i] * s / 10));
      p.copy(q);
      if (i < angoli.length) {
        n.applyAxisAngle(d, torsioni[i]);
        var b = new T.Vector3().crossVectors(d, n).normalize(), c = p.clone().addScaledVector(n, R);
        info.push({ c: c.clone(), b: b.clone(), d: d.clone(), n: n.clone() });
        var a = angoli[i], v = p.clone().sub(c), N = Math.max(2, Math.ceil(a / 0.08));
        for (var j = 1; j <= N; j++) pts.push(c.clone().add(v.clone().applyAxisAngle(b, a * j / N)));
        p.copy(c).add(v.applyAxisAngle(b, a)); d.applyAxisAngle(b, a); n.applyAxisAngle(b, a);
      }
    }
    return { pts: pts, info: info };
  }
  function costruisci(angoli, attiva) {
    var a = asse(angoli);
    var curva = new T.CatmullRomCurve3(a.pts, false, 'catmullrom', 0.05);
    var g = new T.TubeGeometry(curva, 400, rT, 18, false);
    tubo.geometry.dispose(); tubo.geometry = g;
    var inf = a.info[attiva];
    if (inf) {
      matrice.visible = true;
      matrice.position.copy(inf.c);
      matrice.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), inf.b);
      morsa.position.set(0, 0, 0); // la morsa resta tangente: la mettiamo in coordinate mondo
      var tang = inf.d.clone().multiplyScalar(0.8).add(inf.n.clone().multiplyScalar(-R));
      var inv = matrice.quaternion.clone().invert(); morsa.position.copy(tang.applyQuaternion(inv));
    } else matrice.visible = false;
  }
  // centra la forma finale nell'inquadratura
  var bb = new T.Box3().setFromPoints(asse([Math.PI / 2, Math.PI / 2]).pts.concat(asse([0, 0]).pts));
  var cen = bb.getCenter(new T.Vector3()); gruppo.position.set(-cen.x, -cen.y + 0.4, -cen.z);
  var cG = new T.Color(k.COL.grezzo), cF = new T.Color(k.COL.fuso), cS = new T.Color(k.COL.finito);
  var A = Math.PI / 2;
  function aggiorna(fase, t) {
    var e = k.morbido(t);
    var ang = fase === 1 ? [0, 0] : fase === 2 ? [A * e, 0] : fase === 3 ? [A, 0] : fase === 4 ? [A, A * e] : [A, A];
    costruisci(ang, fase <= 2 ? 0 : fase === 5 ? -1 : 1);
    if (fase === 1) mat.color.copy(cG); else if (fase === 5) mat.color.lerpColors(cF, cS, e); else mat.color.copy(cF);
  }
  function su(obj, x, y, z) { return function (v) { obj.updateWorldMatrix(true, false); v.set(x, y, z).applyMatrix4(obj.matrixWorld); }; }
  return {
    radice: radice, pavimento: -3.6,
    camera: { posizione: [9, 8, 16], bersaglio: [0, 0, 0] },
    aggiorna: aggiorna,
    etichette: [
      { testo: 'Matrice rotante', ancora: su(matrice, 0, 0.5, 0), visibile: function () { return matrice.visible; } },
      { testo: 'Tubo', ancora: su(radice, -4.2, 0.4, 0) }
    ]
  };
});
