$(function () {
    var
        template = '<a href="#1">x #2</a>',
        $chbxList = $('.js-chbx-list'),
        $tagsList = $('.js-chbx-tags');

    function render () {
        var html = '';
        $chbxList.find(':checked').each(function () {
            var $chbx = $(this);
            var tag = template
                .replace( '#1', '#'+$chbx.attr('id') )
                .replace( '#2', $chbx.val() );
            html += tag;
        });
        $tagsList.html(html);
    }

    $chbxList.on('click', 'input[type="checkbox"]', render);
    $tagsList.on('click', 'a', function () {
        $chbxList.find( $(this).attr('href') ).click();
    });

    render();
});