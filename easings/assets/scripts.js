$(function(){
    let
        $block = $('.alert'),
        $button = $('button'),
        $input = $('input'),
        duration = 0,
        timeStart = 0,
        x = 0;

    function animate() {
        if (Date.now() - timeStart < duration) {
            x++;
            $block.css('transform', 'translateX('+x+'px)');
            requestAnimationFrame(animate);
        }
    }

    $button.click(function(){
        duration = parseInt($input.val()) * 1000;
        timeStart = Date.now();
        requestAnimationFrame(animate);
    });
});