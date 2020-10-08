$(function(){
    let
        $block = $('.alert'),
        $button = $('button'),
        $animation = $('#animation'),
        $offset = $('#offset'),
        $duration = $('#duration'),
        animation = 'linear',
        offset = 0,
        duration = 0,
        timeStart = 0,
        timeElapsed = 0,
        progress = 0,
        offsetCur = 0,

        /**
         * @see https://easings.net/ru
         * @param progress {number} [0..1]
         * @returns {number} [0..1]
         */
        animations = {
            'linear': (progress) => {
                return progress;
            },
            'easeInOutSine': (progress) => {
                return -(Math.cos(Math.PI * progress) - 1) / 2;
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

    function animate() {
       timeElapsed = Date.now() - timeStart;
        if (timeElapsed < duration) {
            progress = timeElapsed / duration;
            offsetCur = offset * animation(progress);
            $block.css('transform', 'translateX('+offsetCur+'px)');
            requestAnimationFrame(animate);
        }
    }

    function start() {
        animation = animations[ $animation.val() ];
        offset = parseInt($offset.val());
        duration = parseInt($duration.val()) * 1000;
        offsetCur = 0;
        timeStart = Date.now();
        $block.css('transform', 'translateX('+offsetCur+'px)');
    }

    $button.click(function(){
        start();
        requestAnimationFrame(animate);
    });
});