$(function(){
    let
        $block = $('.alert'),
        $button = $('button'),
        $input = $('input'),
        duration = 0,
        timeStart = 0,
        timeElapsed = 0,
        progress = 0,
        xMax = 100,
        x = 0;

    function easeInOutSine(progress) {
        return -(Math.cos(Math.PI * progress) - 1) / 2;
    }

    function animate() {
       timeElapsed = Date.now() - timeStart;
        if (timeElapsed < duration) {
            progress = timeElapsed / duration;
            x = xMax * easeInOutSine(progress);
            $block.css('transform', 'translateX('+x+'px)');
            requestAnimationFrame(animate);
        }
    }

    function start() {
        x = 0;
        duration = parseInt($input.val()) * 1000;
        timeStart = Date.now();
        $block.css('transform', 'translateX(0)');
    }

    $button.click(function(){
        start();
        requestAnimationFrame(animate);
    });
});