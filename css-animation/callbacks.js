function CssAnimations(){

    let app = this;
    app.stack = [];
    app.promise = false;
    app.$div = $('<div id="CssAnimations"></div>').appendTo('body');

    app.add = function(params){
        if ( !(
            params.$el instanceof $ &&
            params.$el.length &&
            params.animationClass
        ) ) return app;

        app.$div.attr('class', params.animationClass);
        params.animationName = app.$div.css('animation-name');
        if ( !params.animationName ) return app;

        app.stack.push(params);
        return app;
    };

    app.call = function(callback){
        app.stack.push(callback);
        return app;
    };

    app.currChunk = {};
    app.onAnimationEnd = function(e){
        if ( e.originalEvent.animationName === app.currChunk.animationName ) {
            if ( app.currChunk.animationDuration ) {
                app.currChunk.$el.css('animation-duration', '');
            }
            app.currChunk.resolve();
        }
    };

    app.promisify = function(chunk){
        return new Promise(function(resolve, reject){

            if ( typeof chunk === 'function') {
                chunk();
                resolve();
            }
            if ( typeof chunk === 'object') {
                if ( chunk.animationDuration ) {
                    chunk.$el.css('animation-duration', chunk.animationDuration);
                }

                chunk.resolve = resolve;
                app.currChunk = chunk;

                chunk.$el
                    .off('webkitAnimationEnd animationend', app.onAnimationEnd)
                    .on('webkitAnimationEnd animationend', app.onAnimationEnd)
                    .addClass(chunk.animationClass);
            }
        })
    };

    app.clearClasses = function(){
        $.each(app.stack, function (key, chunk) {
            if ( typeof chunk === 'object') {
                chunk.$el.removeClass(chunk.animationClass);
            }
        });
    };

    app.play = function(){
        app.clearClasses();

        app.promise = new Promise(function(resolve, reject){
            return resolve();
        });

        $.each(app.stack, function (key, chunk) {
            app.promise = app.promise.then(function(){
                return app.promisify(chunk);
            });
        });

        return app;
    };

    app.clear = function(){
        app.clearClasses();
        app.stack = [];
    };

    return app;
}

$(document).ready(function () {
    let
        $block = $('.block'),
        $animation = (new CssAnimations())
            .call(function(){ 
                console.log('-- start --') 
            })
            .add({ 
                $el: $block, 
                animationClass: 'moveRight', 
                animationDuration: '3s'
            })
            .call(function(){ 
                console.log('moveRight ok') 
            })
            .add({ 
                $el: $block, 
                animationClass: 'moveDown' 
            })
            .call( function(){
                console.log('moveDown ok') 
            })
            .add({ 
                $el: $block, 
                animationClass: 'moveLeft' 
            })
            .call( function(){
                console.log('moveLeft ok') 
            })
            .add({ 
                $el: $block, 
                animationClass: 'moveUp' 
            })
            .call( function(){
                console.log('moveUp ok');
                console.log('-- end --');
            });

    $('button').click(function () {
        $animation.play();
    });
});