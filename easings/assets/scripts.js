function IexEasedAnimation(){
    let app = this;

    app.errPrefix = '[IexEasedAnimation] Ошибка: ';

    /**
     * Коллекция доступных функций анимации
     * @see https://easings.net/ru
     */
    app.easings = {
        /**
         * @param progress {number} [0..1]
         * @returns {number} [0..1]
         */
        'linear': (progress) => {
            return progress;
        },
        'easeInOutSine': (progress) => {
            return -(Math.cos(Math.PI * progress) - 1) / 2;
        },
        'easeInOutCubic': (progress) => {
            return progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        },
        'easeOutElastic': (progress) => {
            const c4 = (2 * Math.PI) / 3;
            return progress === 0
                ? 0
                : progress === 1
                    ? 1
                    : Math.pow(2, -10 * progress) * Math.sin((progress * 10 - 0.75) * c4) + 1;
        },
    };

    /**
     * Название функции анимации
     * @type {string}
     */
    app.easing = 'easeInOutCubic';

    /**
     * Функция анимации
     * @type {function}
     */
    app.easingFunction = app.easings[app.easing];

    /**
     * Длительность анимации (сек)
     * @type {number}
     */
    app.duration = 0;

    /**
     * Время начала анимации
     * @type {number}
     */
    app.timeStart = 0;

    app._onStep = function () {
        let timeElapsed = Date.now() - app.timeStart;
        let progress = timeElapsed / app.duration;
        if (timeElapsed < app.duration) {
            app.onStep(progress, app.easingFunction(progress));
            requestAnimationFrame(app._onStep);
        } else {
            app.onStep(1, 1);
            app.onFinish();
        }
    }

    /**
     * Имена допустимых пользовательских коллбэков
     * @type {string[]}
     */
    app.callbacks = ['onStart','onStep','onFinish'];

    /**
     * Пользовательский коллбэк начала анимации.
     * Можно использовать для установки начальных значений анимации.
     */
    app.onStart = function () {
    }

    /**
     * Пользовательский коллбэк шага анимации.
     * Должен содержать код изменения анимируемых CSS-свойств на основе progressEased.
     *
     * @param progressSrc {number} [0..1]
     * @param progressEased {number} [0..1]
     */
    app.onStep = function (progressSrc, progressEased) {
    }

    /**
     * Пользовательский коллбэк завершения анимации
     */
    app.onFinish = function () {
    }

    app.start = function() {
        app.onStart();

        app.easingFunction = app.easings[app.easing];
        if (typeof app.easingFunction !== 'function') {
            console.log(app.errPrefix + 'Функция анимации "' + app.easing + '" пока не поддерживается!');
            return;
        }

        let callbackErr = false;
        app.callbacks.forEach(function (name,index){
            if (typeof app[name] !== 'function') {
                console.log(app.errPrefix + 'Коллбэк "' + name + '" должен быть функцией!');
                callbackErr = true;
            }
        });

        if (callbackErr) {
            return;
        }

        app.timeStart = Date.now();
        app.duration = parseFloat(app.duration.replace(',','.')) * 1000;
        requestAnimationFrame(app._onStep);
    }
}

$(function(){
    let
        iexAnimation = new IexEasedAnimation(),
        $block = $('.alert'),
        $button = $('button'),
        $easings = $('#easings'),
        $easing = $('#easing'),
        $offset = $('#offset'),
        $duration = $('#duration'),
        offsetMax = 0,
        offsetCur = 0;

    $easings.text( Object.keys(iexAnimation.easings).join(', ') );

    iexAnimation.onStart = function () {
        offsetMax = parseInt($offset.val());
        iexAnimation.duration = $duration.val();
        iexAnimation.easing = $easing.val();
        offsetCur = 0;
        $block.css('transform', 'translateX('+offsetCur+'px)');
    }

    iexAnimation.onStep = function (progressSrc, progressEased) {
        offsetCur = offsetMax * progressEased;
        $block.css('transform', 'translateX('+offsetCur+'px)');
    }

    iexAnimation.onFinish = function () {
        $block.css('transform', 'translateX('+0+'px)');
    }

    $button.click(function(){
        iexAnimation.start();
    });
});