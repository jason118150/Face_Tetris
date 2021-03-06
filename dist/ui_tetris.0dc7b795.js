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
})({335:[function(require,module,exports) {
var w, h;
w = 15;
h = 25;
var score = document.getElementById('score');
var stage = document.getElementById('stage');
var next = document.getElementById('next');
var d = stage.getElementsByTagName('div')[0].offsetWidth;
stage.style.width = w * d + 'px';
stage.style.height = h * d + 'px';
next.style.width = 4 * d + 'px';
next.style.height = 4 * d + 'px';
var tetris = new Tetris(w, h, 800).on('score', function (a, b) {
  score.innerHTML = +score.innerHTML + b * b * 10;
}).on('lose', function () {
  addCls(stage, 'gameover');
}).on('pause', function () {
  addCls(stage, 'pause');
}).on('start', function (nextTile) {
  next.innerHTML = nextTile.join('').replace(/0/g, '<div></div>').replace(/1/g, '<div class="on"></div>');
}).on('render', function (res) {
  stage.innerHTML = res.join('').replace(/0/g, '<div></div>').replace(/1/g, '<div class="on"></div>');
}).start();

tetris.pause();

var interval = function () {
  var startTime, timer, interval, cb;
  return {
    run: function run(fn, t) {
      cb = fn;
      interval = t || 100;
      startTime = Date.now();
      timer = setInterval(function () {
        fn && fn();
      }, interval);
    },
    stop: function stop() {
      timer && clearInterval(timer);
      if (Date.now() - startTime < interval) {
        cb && cb();
      }
    }
  };
}();

var btn;
var slice = [].slice;
var btns = slice.call(document.getElementById('manipulate').getElementsByTagName('div'));
btns.forEach(function (btn) {
  btn.addEventListener('touchstart', function (e) {
    var cls = this.className;
    addCls(this, 'active');
    switch (cls) {
      case 'left':
        return interval.run(function () {
          tetris.left();
        });
      case 'right':
        return interval.run(function () {
          tetris.right();
        });
      case 'up':
        return interval.run(function () {
          tetris.rotate();
        });
      case 'down':
        return interval.run(function () {
          tetris.down();
        }, 70);
      case 'fall':
        tetris.fall();
    }
  });

  btn.addEventListener('touchend', function (e) {
    rmCls(this, 'active');
    interval.stop();
  });
});
},{}]},{},[335], null)
//# sourceMappingURL=/ui_tetris.0dc7b795.map