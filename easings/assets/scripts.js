$(function(){
    let
        iexAnimation = new IexEasedAnimation(),
        $block = $('.alert'),
        $button = $('button'),
        $easing = $('#easing'),
        $offset = $('#offset'),
        $rotate = $('#rotate'),
        $duration = $('#duration'),
        offsetMax = 0,
        offsetCur = 0,
        rotateMax = 0,
        rotateCur = 0;

    let optionsHtml = '';
    Object.keys(iexAnimation.easings).forEach(easing => optionsHtml += '<option value="'+easing+'">'+easing+'</option>');
    $easing.html(optionsHtml);

    function setCss($block, offset, rotate) {
        $block.css('transform', 'translateX('+offset+'px) rotate('+rotate+'deg)');
    }

    iexAnimation.onStart = function () {
        offsetCur = 0;
        rotateCur = 0;
        offsetMax = parseInt($offset.val());
        rotateMax = parseInt($rotate.val());
        iexAnimation.duration = $duration.val();
        iexAnimation.easing = $easing.val();
        setCss($block, offsetCur, rotateCur);
        $block.removeClass('alert-info').addClass('alert-success');
    }

    iexAnimation.onStep = function (progressSrc, progressEased) {
        offsetCur = offsetMax * progressEased;
        rotateCur = rotateMax * progressEased;
        setCss($block, offsetCur, rotateCur);
    }

    iexAnimation.onFinish = function () {
        $block.removeClass('alert-success').addClass('alert-info');
    }

    $button.click(function(){
        iexAnimation.start();
    });
});