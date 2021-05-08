/**
 * IexEasedAnimation v.1.1.0
 * @constructor
 */
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
        'easeInOutQuint': (progress) => {
            return progress < 0.5 ? 16 * progress * progress * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 5) / 2;
        },
        'easeOutElastic': (progress) => {
            const c4 = (2 * Math.PI) / 3;
            return progress === 0
                ? 0
                : progress === 1
                    ? 1
                    : Math.pow(2, -10 * progress) * Math.sin((progress * 10 - 0.75) * c4) + 1;
        },
        'easeInOutElastic': (progress) => {
            const c1 = 1.70158;
            const c2 = c1 * 1.525;
            return progress < 0.5
                ? (Math.pow(2 * progress, 2) * ((c2 + 1) * 2 * progress - c2)) / 2
                : (Math.pow(2 * progress - 2, 2) * ((c2 + 1) * (progress * 2 - 2) + c2) + 2) / 2;
        },
        'easeInOutElasticDouble': (progress) => {
            const c5 = (2 * Math.PI) / 4.5;

            return progress === 0
                ? 0
                : progress === 1
                    ? 1
                    : progress < 0.5
                        ? -(Math.pow(2, 20 * progress - 10) * Math.sin((20 * progress - 11.125) * c5)) / 2
                        : (Math.pow(2, -20 * progress + 10) * Math.sin((20 * progress - 11.125) * c5)) / 2 + 1;
        }
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
     * Длительность анимации пересчитанная в милисекунды
     * @type {number}
     */
    app._duration = 0;

    /**
     * Время начала анимации
     * @type {number}
     */
    app.timeStart = 0;

    app._onStep = function () {
        let timeElapsed = Date.now() - app.timeStart;
        let progress = timeElapsed / app._duration;
        if (timeElapsed < app._duration) {
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

        if (typeof app.duration === 'string') {
            app.duration = parseFloat(app.duration.replace(',','.'))
        }
        app._duration = app.duration * 1000;
        requestAnimationFrame(app._onStep);
    }
}
