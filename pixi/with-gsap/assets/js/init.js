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
    circle.drawCircle(0, 0, 2);
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
    app.spr2 = new PIXI.Sprite(PIXI.loader.resources['img2'].texture);
    app.spr3 = new PIXI.Sprite(PIXI.loader.resources['img3'].texture);


    //Add the sprite to the stage
    app.stage
    //     .addChild(app.spr1)
         .addChild(app.spr2)
         .addChild(app.spr3);

    var coords = {x:0, y:0};

    TweenLite.to(coords, 2, {x: app.view.width, ease: Linear.easeNone});
    TweenLite.to(coords, 2, {y: app.view.height, ease: Power1.easeInOut, onUpdate: function () {
        console.log('onUpdate():', coords);
        app.addPoint(coords.x, coords.y);
    }});

    TweenLite.to(app.spr3, 2, {y:app.view.height, ease:Power1.easeInOut});
    //TweenLite.to(app.spr2, 2, {pixi:{saturation:0, blur:20}});
}
