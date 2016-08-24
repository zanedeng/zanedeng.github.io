(function (lib, img, cjs) {

var p; // shortcut to reference prototypes

// library properties:
lib.properties = {
	width: 550,
	height: 400,
	fps: 24,
	color: "#FFFFFF",
	manifest: []
};

// stage content:
(lib.LoaderAnimation = function() {
	this.initialize();

	// 图层 1
	this.instance = new lib.LoadAnimation();
	this.instance.setTransform(786,148,1,1,0,0,0,61,94.9);

	this.addChild(this.instance);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(863,253.1,343,131.9);


// symbols:
(lib.LoadAnimationThumb = function() {
	this.initialize();

	// 图层 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(255,204,0,0.4)").s().p("AhPBjIAAjGICfAAIAADGg");
	this.shape.setTransform(8,10);

	this.shape_1 = new cjs.Shape();
	this.shape_1.graphics.f("rgba(255,204,0,0.702)").s().p("AhPBjIAAjGICfAAIAADGg");
	this.shape_1.setTransform(26,10);

	this.shape_2 = new cjs.Shape();
	this.shape_2.graphics.f("#FFCC00").s().p("AhPBjIAAjGICfAAIAADGg");
	this.shape_2.setTransform(44,10);

	this.addChild(this.shape_2,this.shape_1,this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,52,20);


(lib.LoadAnimationBg = function() {
	this.initialize();

	// 图层 1
	this.shape = new cjs.Shape();
	this.shape.graphics.f("rgba(0,153,255,0.502)").s().p("A2pB9IAAj5MAtSAAAIAAD5g");
	this.shape.setTransform(145,12.5);

	this.addChild(this.shape);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(0,0,290,25);


(lib.LoadAnimation = function() {
	this.initialize();

	// mask (mask)
	var mask = new cjs.Shape();
	mask._off = true;
	mask.graphics.p("A2oB9IAAj5MAtSAAAIAAD5g");
	mask.setTransform(61,67.5);

	// thumb
	this.thumb = new lib.LoadAnimationThumb();
	this.thumb.setTransform(-111,68.1,1,1,0,0,0,26,10);

	this.thumb.mask = mask;

	// tick
	this.bg = new lib.LoadAnimationBg();
	this.bg.setTransform(61,67.5,1,1,0,0,0,145,12.5);

	this.bg.mask = mask;

	// tipTf
	this.tipTf = new cjs.Text("加载游戏素材中", "28px 'Microsoft YaHei'", "#9900CC");
	this.tipTf.name = "tipTf";
	this.tipTf.textAlign = "center";
	this.tipTf.lineHeight = 28;
	this.tipTf.lineWidth = 286;
	this.tipTf.setTransform(59,90.9);

	this.percentTf = new cjs.Text("1%", "25px 'Verdana'", "#9900CC");
	this.percentTf.name = "percentTf";
	this.percentTf.textAlign = "center";
	this.percentTf.lineHeight = 25;
	this.percentTf.lineWidth = 71;
	this.percentTf.setTransform(62.8,0);

	this.addChild(this.percentTf,this.tipTf,this.bg,this.thumb);
}).prototype = p = new cjs.Container();
p.nominalBounds = new cjs.Rectangle(-84,0,290,131.9);

})(lib = lib||{}, images = images||{}, createjs = createjs||{});
var lib, images, createjs;