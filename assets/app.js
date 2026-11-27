/* Motore delle animazioni a fasi. Nessuna dipendenza.
 * Ogni elemento animato dello schema SVG porta:
 *   data-k="tx:0,0,60;op:1,0,1"  valore di ciascuna proprietà alla FINE di ogni fase
 *   data-i="tx:0"                (facoltativo) valore all'inizio della fase 1
 *   data-o="x,y"                 (facoltativo) origine per rotazione e scala
 * Proprietà: tx, ty (traslazione), rot (gradi), sx, sy (scala), op (opacità),
 *            dash (stroke-dashoffset), sw (stroke-width), vx / vy (ampiezza di vibrazione).
 */
(function () {
  'use strict';
  var riduci = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function leggi(s) {
    var o = {};
    if (!s) return o;
    s.split(';').forEach(function (parte) {
      var kv = parte.split(':');
      if (kv.length === 2) o[kv[0].trim()] = kv[1].split(',').map(Number);
    });
    return o;
  }
  function morbido(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  function Schema(box) {
    this.box = box;
    this.svg = box.querySelector('svg.schema-svg');
    this.durate = box.getAttribute('data-durate').split(',').map(Number);
    this.n = this.durate.length;
    this.fase = 1;
    this.t = 1;
    this.inCorso = false;
    this.ultimo = 0;
    this.elementi = [].map.call(this.svg.querySelectorAll('[data-k]'), function (el) {
      var o = (el.getAttribute('data-o') || '0,0').split(',').map(Number);
      var ini = leggi(el.getAttribute('data-i'));
      var i0 = {};
      Object.keys(ini).forEach(function (k) { i0[k] = ini[k][0]; });
      return { el: el, k: leggi(el.getAttribute('data-k')), i: i0, o: o };
    });
    this.btnPlay = box.querySelector('[data-azione="play"]');
    this.fasiBtn = [].slice.call(box.querySelectorAll('.barra-fasi button'));
    this.didascalie = [].slice.call(box.querySelectorAll('.didascalie li'));
    this.annuncio = box.querySelector('.annuncio');
    this.collega();
    this.disegna();
    if (!riduci) this.avvia(); else this.aggiornaPlay();
  }

  Schema.prototype.valore = function (e, prop, fase, t) {
    var v = e.k[prop];
    var fine = v[fase - 1];
    var inizio = fase === 1 ? (prop in e.i ? e.i[prop] : v[this.n - 1]) : v[fase - 2];
    return inizio + (fine - inizio) * morbido(t);
  };

  Schema.prototype.disegna = function () {
    var self = this;
    this.elementi.forEach(function (e) {
      var g = function (p, def) { return p in e.k ? self.valore(e, p, self.fase, self.t) : def; };
      var tx = g('tx', 0), ty = g('ty', 0), rot = g('rot', 0), sx = g('sx', 1), sy = g('sy', 1);
      // vibrazione (martellatura): ampiezza per fase in vx / vy
      var osc = Math.sin(self.t * 90);
      tx += g('vx', 0) * osc; ty += g('vy', 0) * osc;
      var ox = e.o[0], oy = e.o[1];
      e.el.setAttribute('transform', 'translate(' + tx + ' ' + ty + ') translate(' + ox + ' ' + oy + ') rotate(' + rot + ') scale(' + sx + ' ' + sy + ') translate(' + (-ox) + ' ' + (-oy) + ')');
      if ('op' in e.k) e.el.setAttribute('opacity', g('op', 1));
      if ('dash' in e.k) e.el.setAttribute('stroke-dashoffset', g('dash', 0));
      if ('sw' in e.k) e.el.setAttribute('stroke-width', g('sw', 1));
    });
    this.fasiBtn.forEach(function (b, i) {
      var attiva = i + 1 === self.fase;
      if (attiva) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      b.querySelector('.avanz').style.width = (i + 1 < self.fase ? 100 : attiva ? self.t * 100 : 0) + '%';
    });
    this.didascalie.forEach(function (li, i) { li.classList.toggle('attiva', i + 1 === self.fase); });
    // stato condiviso con la vista 3D (vista3d.js), che si registra come ascoltatore
    this.box._stato = { fase: this.fase, t: this.t };
    (this.box._ascoltatori || []).forEach(function (f) { f(self.fase, self.t); });
  };

  Schema.prototype.passo = function (ora) {
    if (!this.inCorso) return;
    var dt = this.ultimo ? ora - this.ultimo : 0;
    this.ultimo = ora;
    this.t += dt / this.durate[this.fase - 1];
    if (this.t >= 1) {
      this.t = 0;
      this.fase = this.fase % this.n + 1;
    }
    this.disegna();
    var self = this;
    requestAnimationFrame(function (o) { self.passo(o); });
  };

  Schema.prototype.avvia = function () {
    if (riduci) return;
    this.inCorso = true;
    this.ultimo = 0;
    if (this.t >= 1) { this.t = 0; }
    this.aggiornaPlay();
    var self = this;
    requestAnimationFrame(function (o) { self.passo(o); });
  };
  Schema.prototype.ferma = function () { this.inCorso = false; this.aggiornaPlay(); };

  Schema.prototype.aggiornaPlay = function () {
    if (!this.btnPlay) return;
    this.btnPlay.setAttribute('aria-pressed', this.inCorso ? 'true' : 'false');
    this.btnPlay.textContent = this.inCorso ? '❚❚ Pausa' : '▶ Play';
  };

  // Vai a una fase. Con movimento ridotto o in pausa: stato finale della fase, senza animazione.
  Schema.prototype.vai = function (f, annuncia) {
    this.fase = ((f - 1 + this.n) % this.n) + 1;
    this.t = (this.inCorso && !riduci) ? 0 : 1;
    this.disegna();
    if (annuncia && this.annuncio) {
      this.annuncio.textContent = 'Fase ' + this.fase + ' di ' + this.n + ': ' + this.didascalie[this.fase - 1].querySelector('b').textContent.replace(/^Fase \d+ – /, '');
    }
  };

  Schema.prototype.collega = function () {
    var self = this;
    if (riduci && this.btnPlay) {
      this.btnPlay.hidden = true;
      var nota = this.box.querySelector('.nota-movimento');
      if (nota) nota.hidden = false;
    }
    this.box.addEventListener('click', function (ev) {
      var b = ev.target.closest('button');
      if (!b || !self.box.contains(b)) return;
      var az = b.getAttribute('data-azione');
      if (az === 'play') { self.inCorso ? self.ferma() : self.avvia(); }
      else if (az === 'prec') { self.ferma(); self.vai(self.fase - 1, true); }
      else if (az === 'succ') { self.ferma(); self.vai(self.fase + 1, true); }
      else if (b.hasAttribute('data-fase')) { self.ferma(); self.vai(Number(b.getAttribute('data-fase')), true); }
    });
  };

  var schemi = [];
  document.querySelectorAll('.schema[data-durate]').forEach(function (box) { schemi.push(new Schema(box)); });

  // Rimandi dal testo "Come funziona" alle fasi dello schema principale.
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('.rimando-fase');
    if (!b || !schemi[0]) return;
    schemi[0].ferma();
    schemi[0].vai(Number(b.getAttribute('data-vai')), true);
    schemi[0].box.scrollIntoView({ behavior: riduci ? 'auto' : 'smooth', block: 'start' });
  });
})();
