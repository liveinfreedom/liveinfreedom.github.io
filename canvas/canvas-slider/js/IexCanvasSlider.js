/**
 * Пример работы с canvas: https://greensock.com/forums/topic/17052-gsap-and-canvas/?do=findComment&comment=76045
 * GSAP-плагин для PIXIE.js: https://greensock.com/docs/Plugins/PixiPlugin
 */
function IexCanvasSlider(){
    let app = this;

    app.$slider = $('.b-slider');
    app.$imgs = app.$slider.find('img');
    app.speed = 1.5;              // скорость переключения (GSAP-изинга) в секундах
    app.easing = Power2.easeInOut;  // GSAP-изинг

    app.cnt = app.$imgs.length;
    app.imgs = [];
    app.canvasTop = $('<canvas class="b-slider__img top"></canvas>')[0];
    app.canvasBot = $('<canvas class="b-slider__img bot"></canvas>')[0];
    app.canvasTopCtxt = app.canvasTop.getContext('2d');
    app.canvasBotCtxt = app.canvasBot.getContext('2d');
    app.size = {width: 0, height: 0};
    app.currDelta = 1;
    app.currSlide = 1;
    app.nextSlide = 1;
    app.currShift = {x: 0};
    app.isAnimating = false;

    app.setCanvasSize = function(canvas) {
        var retina = false; // TODO: Определение ретины (картинки должны быть в 2 раза больше)
        canvas.width = app.size.width * (retina ? 2 : 1);
        canvas.height = app.size.height * (retina ? 2 : 1);
    };

    app.resetAnimation = function() {
console.log('app.resetAnimation()');
        TweenMax.ticker.removeEventListener("tick", app.render);
        app.currShift.x = 0;
        app.currSlide = app.nextSlide;
        app.isAnimating = false;
    };

    app.render = function() {
        if ( app.nextSlide === app.currSlide ) return;

        let lastLoop = app.currShift.x === app.size.width;

console.log('app.render():', 'app.currShift='+app.currShift.x, ' app.size.width='+app.size.width);

        app.canvasBotCtxt.clearRect(0, 0, app.size.width, app.size.height);
        app.canvasBotCtxt.drawImage(app.imgs[app.nextSlide], 0, 0);

        if ( !lastLoop ) {
            app.canvasTopCtxt.clearRect(0, 0, app.size.width, app.size.height);
            app.canvasTopCtxt.drawImage(app.imgs[app.currSlide], 0, 0);

            if ( app.currDelta > 0 ) {
                app.canvasTopCtxt.clearRect(app.size.width - app.currShift.x, 0, app.size.width, app.size.height);
            } else {
                app.canvasTopCtxt.clearRect(0, 0, app.currShift.x, app.size.height);
            }

            app.canvasBotCtxt.drawImage(app.canvasTop, 0,0);
        }
    };

    app.getNextSlide = function(){
        app.nextSlide = app.currSlide + app.currDelta;
        app.nextSlide = (app.nextSlide > app.cnt) ? 1 : app.nextSlide;
        app.nextSlide = (app.nextSlide < 1) ? app.cnt : app.nextSlide;
        return app.nextSlide;
    };

    app.init = function(){
        app.$imgs
            .css('display', 'none')
            .each(function (index,img) {
                app.imgs[index+1] = img;
                app.size = {
                    width: Math.max(app.size.width, img.naturalWidth ),
                    height: Math.max(app.size.height, img.naturalHeight )
                };
            });

        app.setCanvasSize(app.canvasTop);
        app.setCanvasSize(app.canvasBot);

        app.canvasBotCtxt.drawImage(app.imgs[app.currSlide], 0, 0, app.size.width, app.size.height);
        app.$slider.append(app.canvasBot);

        $('.js-nav').click(function (e) {
            if ( !app.isAnimating ) {
                app.isAnimating = true;
                app.currDelta = parseInt( $(this).attr('data-delta') ) || 0;
                app.getNextSlide();
console.log('click():', app.currSlide, '->', app.nextSlide);
                TweenLite.to(app.currShift, app.speed, {
                    x: app.size.width,
                    ease: app.easing,
                    onUpdate: function () {
console.log('onUpdate():', 'app.currShift='+app.currShift.x,);
                    },
                    onComplete: function () {
                        app.resetAnimation();
                    }
                });
                TweenMax.ticker.addEventListener("tick", app.render); // синхронизирован с FPS
            }
            e.preventDefault();
        });
    };
    app.init();
}
$(function () {
    new IexCanvasSlider();
});