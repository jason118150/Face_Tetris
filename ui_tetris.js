var w, h;
w = 15;
h = 25;
var score = document.getElementById('score');
var stage = document.getElementById('stage');
var next = document.getElementById('next');
var d = stage.getElementsByTagName('div')[0].offsetWidth;
stage.style.width = w*d + 'px';
stage.style.height = h*d + 'px';
next.style.width = 4*d + 'px';
next.style.height = 4*d + 'px';
var tetris = new Tetris(w, h, 800).on('score', function(a, b) {
  score.innerHTML = +score.innerHTML + b*b*10 ;
})
.on('lose', function() {
  addCls(stage, 'gameover');
})
.on('pause', function() {
  addCls(stage, 'pause');
})
.on('start', function(nextTile) {
  next.innerHTML = nextTile.join('').replace(/0/g, '<div></div>').replace(/1/g, '<div class="on"></div>');
})
.on('render', function(res) {
  stage.innerHTML = res.join('').replace(/0/g, '<div></div>').replace(/1/g, '<div class="on"></div>')
})
.start();

tetris.pause();


var interval = (function() {
  var startTime, timer, interval, cb;
  return {
    run: function(fn, t) {
      cb = fn;
      interval = t || 100;
      startTime = Date.now();
      timer = setInterval(function() {
        fn && fn();
      }, interval);
    },
    stop: function() {
      timer && clearInterval(timer);
      if(Date.now() - startTime < interval) {
        cb && cb();
      }
    }
  }
})();

var btn;
var slice = [].slice;
var btns = slice.call(document.getElementById('manipulate').getElementsByTagName('div'));
btns.forEach(function(btn) {
  btn.addEventListener('touchstart', function(e) {
    var cls = this.className;
    addCls(this, 'active')
    switch(cls) {
      case 'left':
        return interval.run(function() {
          tetris.left();
        })
      case 'right':
        return interval.run(function() {
          tetris.right();
        })
      case 'up':
        return interval.run(function() {
          tetris.rotate();
        })
      case 'down':
        return interval.run(function() {
          tetris.down();
        }, 70)
      case 'fall':
        tetris.fall();
    }
  });


  btn.addEventListener('touchend', function(e) {
    rmCls(this, 'active')
    interval.stop();
  })
})