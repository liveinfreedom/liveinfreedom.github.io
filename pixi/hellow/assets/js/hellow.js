let type = "WebGL";
if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
}

//PIXI.utils.sayHello(type);

//Create a Pixi Application
let app = new PIXI.Application({width: 400, height: 400});



//If you want to make the canvas fill the entire window
// app.renderer.view.style.position = "absolute";
// app.renderer.view.style.display = "block";
// app.renderer.autoResize = true;
// app.renderer.resize(window.innerWidth, window.innerHeight);

//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);

//load an image and run the `setup` function when it's done
PIXI.loader
    .add('img1','assets/img/1.jpg')
    .add('img2','assets/img/2.jpg')
    .add('img3','assets/img/3.jpg')
    .load(setup);

app.addPoint = function (x,y) {
    let circle = new PIXI.Graphics();
    circle.beginFill(0xFF0000);
    circle.drawCircle(0, 0, 1);
    circle.endFill();
    circle.x = x;
    circle.y = y;
    app.stage.addChild(circle);
};

app.getEasingValue = function(easingFunc, currVal, maxVal){
    let preparedVal = currVal / maxVal;
    return easingFunc(preparedVal) * maxVal;
};

//This `setup` function will run when the image has loaded
function setup() {

    //Create the sprite
    // app.spr1 = new PIXI.Sprite(PIXI.loader.resources['img1'].texture);
    // app.spr2 = new PIXI.Sprite(PIXI.loader.resources['img2'].texture);
    app.spr3 = new PIXI.Sprite(PIXI.loader.resources['img3'].texture);


    //Add the sprite to the stage
    app.stage
    //     .addChild(app.spr1)
    //     .addChild(app.spr2)
         .addChild(app.spr3);

    //Start the render loop by Pixi's `ticker`
    app.currTicker = app.ticker.add(delta => render(delta));

    var currX = 0;
    var currY = 0;

    var easing = BezierEasing(0.645, 0.045, 0.355, 1);

    function render(delta){

        currX += 2;
        currY = app.getEasingValue(easing, currX, app.view.width);
        app.addPoint(currX, currY);
        app.spr3.y = currY;

        //console.log('render():', currX, currY);

        if ( currX >= app.view.width ) {
            //console.log('render(): need to stop!');
            app.currTicker.destroy();
        }
    }

}
