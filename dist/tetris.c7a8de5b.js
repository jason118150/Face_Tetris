// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({4:[function(require,module,exports) {
;(function () {
	var a = [[4, 14], [4, 6, 4], [0, 14, 4], [4, 12, 4]];
	var b = [[4, 4, 6], [0, 14, 8], [12, 4, 4], [2, 14]];
	var c = [[4, 4, 12], [8, 14], [6, 4, 4], [0, 14, 2]];
	var d = [[6, 6]];
	var e = [[12, 6], [4, 12, 8]];
	var f = [[6, 12], [4, 6, 2]];
	var g = [[4, 4, 4, 4], [0, 15]];

	var tiles = [a, b, c, d, e, f, g, a, b, c, d, e, f, g];

	var Tetris = function Tetris(w, h, t) {
		this.w = w || 10;
		this.h = h || 20;
		this.t = t || 500;
		this._init();
	};

	Tetris.prototype = {
		constructor: Tetris,

		_init: function _init() {
			var self = this;
			this._translateX = ~~(this.w / 2) - 1;
			this.layout = fill(new Array(this.h), 0);
			this.tiles = tiles.map(function (e, i) {
				return e.map(function (v, j) {
					return v.map(function (n) {
						return n << self._translateX;
					});
				});
			});

			this.tiles;

			this.totalScore = 0;

			this._zero();
			this._bind();
		},

		_zero: function _zero() {
			clearInterval(this.timer);
			this.delta = 0;
			this.work = true;
			this.n = -1;

			this.running = false;

			if (!this.nextTileObj) this.nextTileObj = this._getRandTileObj();
			var next = this.nextTileObj;
			this.tile = next.tile;
			this.row = next.row;
			this.col = next.col;

			this.nextTileObj = this._getRandTileObj();
		},

		getNextTile: function getNextTile() {
			return this.nextTileObj.tile;
		},

		_getRandTileObj: function _getRandTileObj() {
			var row, col, tile;
			var tmp = this.tiles[row = rand(0, this.tiles.length - 1)];
			var tile = tmp[col = rand(0, tmp.length - 1)].slice(0);
			return { row: row, col: col, tile: tile };
		},

		_mix: function _mix(fn) {
			if (fn) {
				this._minus();fn.call(this);this._add();this._render();
			}
		},

		_add: function _add() {
			var a = this.tile.length + this.n;
			if (a < 1 || a > this.layout.length) return false;
			for (var i = 0, m = this.tile.length; i < m; i++) {
				if (i + this.n >= 0) this.layout[i + this.n] += this.tile[i];
			}
		},

		_minus: function _minus() {
			var a = this.tile.length + this.n;
			if (a < 1 || a > this.layout.length) return false;
			for (var i = 0, m = this.tile.length; i < m; i++) {
				if (i + this.n >= 0) this.layout[i + this.n] = Math.max(this.layout[i + this.n] - this.tile[i], 0);
			}
		},

		start: function start(t) {
			if (this.running) return;
			this.running = true;

			var nextRow = this.nextTileObj.row,
			    nextCol = this.nextTileObj.col;
			this.emit('start', tiles[nextRow][nextCol].map(function (e) {
				return pad(e.toString(2), 4);
			}));

			var self = this;
			this.timer = setInterval(function () {
				if (self.work === true) {
					self._mix(function () {
						self.n++;
						if (!this._isAllowed()) {
							self.n--;
							self.work = false;
						}
					});
				} else if (self.work === false) {
					clearInterval(self.timer);
					this.running = false;

					if (self.n <= 0) {
						self._clear();
						self.emit('lose');
					} else {
						var fullNum = 0;
						var maxFullNumber = (1 << self.w) - 1;
						for (var i = 0, m = self.layout.length; i < m; i++) {
							if (trim(self.layout[i]) >= maxFullNumber) {
								fullNum++;
								self.layout.splice(i, 1);
								self.layout.unshift(0);
							}
						}

						if (fullNum) {
							self.totalScore += fullNum;
							self.emit('score', self.totalScore, fullNum);
						}

						self._zero();
						self.start();
					}
				}
			}, this.t);
			return this;
		},

		on: function on(type, fn) {
			if (!this.eventQueue) this.eventQueue = {};
			if (!this.eventQueue[type]) this.eventQueue[type] = [];

			if (fn) this.eventQueue[type].push(fn.bind(this));
			return this;
		},

		emit: function emit(type) {
			var arg = Array.prototype.slice.call(arguments, 1);

			if (this.eventQueue && this.eventQueue[type]) this.eventQueue[type].forEach(function (e) {
				e.apply(null, arg);
			});
			return this;
		},

		detach: function detach(type) {
			if (type && this.eventQueue[type]) this.eventQueue[type].length = 0;
		},

		pause: function pause() {
			clearInterval(this.timer);
			if (this.running === false) return;
			this.running = false;
			this.emit('pause');
			return this;
		},

		restart: function restart(t) {
			this.layout = fill(new Array(this.h), 0);
			this._zero();
			this.start(t);
			return this;
		},

		_clear: function _clear() {
			this.layout = fill(new Array(this.h), 0);
			this._render();
		},

		_render: function _render() {
			var self = this;
			if (this.eventQueue && this.eventQueue.render && this.eventQueue.render.length) {
				var res = this.layout.map(function (e) {
					return pad(e.toString(2), self.w + 2).substring(1, self.w + 1);
				});
				this.emit('render', res);
			}
		},

		_bind: function _bind() {
			var self = this;
			bind(document, 'keydown', function (e) {
				var code = e.keyCode;
				if (code === 37) self.left();else if (code === 38) self.rotate();else if (code === 39) self.right();else if (code === 40) self.down();else if (code === 32) self.fall();
			});
		},

		rotate: function rotate() {
			if (!this.work || !this.running) return;
			if (this.tile[this.row] === d) return;
			var bak = this.tile;
			this._mix(function () {
				this._rotate();
				if (!this._isAllowed()) this.tile = bak;
			});
		},

		left: function left() {
			this._shift(-1);
		},

		right: function right() {
			this._shift(1);
		},

		_shift: function _shift(n) {
			if (!this.work || !this.running) return;
			var bak = this.tile;
			this._mix(function () {
				this.tile = this.tile.map(function (e) {
					return n > 0 ? e >> n : e << -n;
				});
				this._isAllowed() ? this.delta += n : this.tile = bak;
			});
		},

		down: function down() {
			if (!this.work || !this.running) return;
			this._mix(function () {
				this.n++;
				if (!this._isAllowed()) {
					this.n--;
					this.work = false;
				}
			});
		},

		fall: function fall() {
			if (!this.work || !this.running) return;
			if (this.n < 0) return;
			this._mix(function () {
				while (this.n <= this.layout.length - this.tile.length) {
					this.n++;
					if (!this._isAllowed()) {
						this.n--;
						this.work = false;
						break;
					}
				}
			});
		},

		_isAllowed: function _isAllowed() {
			var a = this.tile.length + this.n;

			if (a < 1 || a > this.layout.length) return false;

			var max = 1 << this.w + 1;
			if (this.tile.some(function (e) {
				return e >= max || e & 1;
			})) return false;
			for (var i = 0, m = this.tile.length; i < m; i++) {
				if ((this.tile[i] & (this.layout[i + this.n] || 0)) > 0) return false;
			}return true;
		},

		_rotate: function _rotate() {
			var rotatedTile = this.tiles[this.row][++this.col] || (this.col = 0, this.tiles[this.row][0]);
			var self = this;
			this.tile = rotatedTile.map(function (e) {
				return self.delta > 0 ? e >> self.delta : e << -self.delta;
			});
		}

	};

	window.Tetris = Tetris;

	function fill(arr, p) {
		for (var i = 0; i < arr.length; i++) {
			arr[i] = p;
		}return arr;
	}

	function trim(num) {
		var max = (1 << num.toString(2).length - 1) - 1;
		return num >> 1 & max;
	}

	function pad(str, n) {
		var len = str.length;
		return len < n ? fill(new Array(n - len), '0').join('') + str : str.substring(len - n);
	}

	function rand(a, b) {
		if (a == null) a = 0;
		if (b == null) b = 8;
		return Math.round(a + Math.random() * (b - a));
	}

	function bind(obj, type, fn) {
		return obj.addEventListener(type, fn, false);
	}
})();
},{}]},{},[4], null)
//# sourceMappingURL=/tetris.c7a8de5b.map