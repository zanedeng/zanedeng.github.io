var startNum = 3;
$(function() {
  $('.start').on('click', function() {
    $('.t3').show();
    $('.step1').addClass('start-off');
    var clock = document.querySelector('#clock');
    clock.addEventListener("webkitAnimationEnd", function() {
      startDjs = setInterval(function() {
        startNum -= 1;
        if (startNum > 0) {
          $('.djs .b2').hide();
          $('.t' + startNum).show();
        } else {
          window.clearInterval(startDjs);
          $('.step1').fadeOut(400, function() {
            $('.info').text('有圆心，有半径，剩下的靠你了！');
            $('.step2').show();
          });
        }
      }, 1000);
    }, false);
  });
  $('.next').on('click', function() {
    $('.wrap').addClass('goNext');
  });
  $('.planet-t1').on('click', function() {
    $('.planet').hide();
    $('.planet-2').fadeIn(400);
  });
  $('.planet-t2').on('click', function() {
    $('.planet').hide();
    $('.planet-3').fadeIn(400);
  });
  $('.share').on('click', function() {
    $('.share-float').show();
  });
  $('.share-float').on('click', function() {
    $('.share-float').hide();
  });
  $('.happy-r').on('click', function() {
    $('.photos').addClass('photos-on');
  });
  $('.happy-r').on('click', function() {
    $('.photos').addClass('photos-on');
  });
  $('.photo-back').on('click', function() {
    $('.photos').removeClass('photos-on');
  });
  var picIndex;
  $('.pics img').on('click', function() {
    picIndex = $(this).index();
    $('.big-pic').eq(picIndex).fadeIn(400);
    $('.big-info').show();
  });
  $('.big-pic').on('click', function() {
    $('.big-pic').eq(picIndex).fadeOut(400);
    $('.big-info').hide();
  });
  var planetOne = document.getElementById('planet-1'),
      planetTwo = document.getElementById('planet-2');
  touch.on(planetOne, 'swipeup', function(ev) {
    ev.preventDefault();
    $('.planet').hide();
    $('.planet-2').fadeIn(400);
  });
  touch.on(planetTwo, 'swipeup', function(ev) {
    ev.preventDefault();
    $('.planet').hide();
    $('.planet-3').fadeIn(400);
  });
});
