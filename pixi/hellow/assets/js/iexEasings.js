/**
 * Easing functions
 * Оnly considering the t value for the range [0, 1] => [0, 1]
 * Source: https://gist.github.com/gre/1650294
 *
 * @constructor
 */
function IexEasings() {
    let app = this;

    let EaseIn  = function(power){return function(t){return Math.pow(t, power)}};
    let EaseOut = function(power){return function(t){return 1 - Math.abs(Math.pow(t-1, power))}};
    let EaseInOut = function(power){return function(t){return t<.5 ? EaseIn(power)(t*2)/2 : EaseOut(power)(t*2 - 1)/2+0.5}};

    app.linear = EaseInOut(1);
    app.easeInQuad = EaseIn(2);
    app.easeOutQuad = EaseOut(2);
    app.easeInOutQuad = EaseInOut(2);
    app.easeInCubic = EaseIn(3);
    app.easeOutCubic = EaseOut(3);
    app.easeInOutCubic = EaseInOut(3);
    app.easeInQuart = EaseIn(4);
    app.easeOutQuart = EaseOut(4);
    app.easeInOutQuart = EaseInOut(4);
    app.easeInQuint = EaseIn(5);
    app.easeOutQuint = EaseOut(5);
    app.easeInOutQuint = EaseInOut(5);

    app.easeInElastic = function (t) { return (.04 - .04 / t) * Math.sin(25 * t) + 1 };
    app.easeOutElastic = function (t) { return .04 * t / (--t) * Math.sin(25 * t) };
    app.easeInOutElastic = function (t) { return (t -= .5) < 0 ? (.02 + .01 / t) * Math.sin(50 * t) : (.02 - .01 / t) * Math.sin(50 * t) + 1 };

    app.easeInSin = function (t) { return 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2); };
    app.easeOutSin = function (t) { return Math.sin(Math.PI / 2 * t); };
    app.easeInOutSin = function (t) { return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2; };

    app.getEasingValue = function(easing, currVal, maxVal){
        let preparedVal = currVal / maxVal;
        return app[easing](preparedVal) * maxVal;
    }
}
window.iexEasing = new IexEasings();