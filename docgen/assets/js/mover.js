'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function move() {
  var mover = function mover(args) {
    var item = args.element;
    var threesold = item.dataset.threesold;
    var axis = item.dataset.move;
    var factor = item.dataset.factor;
    var xtraTransform = item.dataset.xtraTransform || null;
    var start = null;

    function moveEl(timestamp, axis) {

      if (!start) start = timestamp;
      var progress = timestamp - start;

      var value = window.scrollY;

      if (value <= threesold * factor / 2) {
        if (axis === '-y') {
          xtraTransform ? item.style.cssText = 'transform: translateY(-' + value / factor * (threesold / factor) + 'px) ' + xtraTransform : item.style.cssText = 'transform: translateY(-' + value / factor * (threesold / factor) + 'px)';
        } else if (axis === '-x') {
          xtraTransform ? item.style.cssText = 'transform: translateX(-' + value / factor * (threesold / factor) + 'px) ' + xtraTransform : item.style.cssText = 'transform: translateX(-' + value / factor * (threesold / factor) + 'px)';
        } else if (axis === '+y') {
          xtraTransform ? item.style.cssText = 'transform: translateY(' + value / factor * (threesold / factor) + 'px) ' + xtraTransform : item.style.cssText = 'transform: translateY(' + value / factor * (threesold / factor) + 'px)';
        } else if (axis === '+x') {
          xtraTransform ? item.style.cssText = 'transform: translateX(' + value / factor * (threesold / factor) + 'px) ' + xtraTransform : item.style.cssText = 'transform: translateX(' + value / factor * (threesold / factor) + 'px)';
        }
      }

      if (progress < 2000) {
        window.requestAnimationFrame(moveEl);
      }
    }

    window.addEventListener('scroll', function (e) {
      window.requestAnimationFrame(function (timestamp) {
        moveEl(timestamp, axis);
      });
    });
  };

  var animatedElement = document.querySelectorAll('[data-move]');
  animatedElement.forEach(function (e, s) {
    mover({
      element: animatedElement[s]
    });
  });
}

exports.default = move;