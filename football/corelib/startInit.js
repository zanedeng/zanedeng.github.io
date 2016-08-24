var canvas, stage, createjs, lib;
/** 根容器 */
var exportRoot;
/** 存放已经加载的图片资源 */
var images = {};
/** 自定义类命名空间 */
var wsl = {};
/** 舞台缩放后的宽度 */
var wStage;
/** 舞台缩放后的高度 */
var hStage;
/** 舞台宽度的缩放比率 */
var wStageScale;
/** 舞台高度的缩放比率 */
var hStageScale;
/** flash文档的宽度 */
var wMc;
/** flash文档的高度 */
var hMc;
/** canvas居中时的水平位置 */
var hPost;
/** canvas居中时的垂直位置 */
var vPost;

/** 设置背景颜色 */
document.body.style.backgroundColor="#000000"; 

/** 加载必须的js文件 <br>
 * arr 图形界面显示前需要加载的js文件数组*/
function loadJS(arr){
	loadConfigArr = arr;
	
	var cnt=0;
	var configArr = [
     	"../corelib/easeljs-0.7.1.min.js",
     	"../corelib/tweenjs-0.5.1.min.js",
     	"../corelib/movieclip-0.7.1.min.js",
     	"../corelib/soundjs-0.5.2.min.js",
     	"../corelib/LoaderAnimation.js",
     	"../corelib/HTMLAudioPlugin.js",
     	"../corelib/WebAudioPlugin.js"
     ].concat(arr);
	var len = configArr.length;
	
	var loader = new createjs.LoadQueue(false);
	loader.addEventListener("fileload", jsLoad);
	loader.addEventListener("complete", jsComplete);
	loader.loadManifest(configArr);
	
	function jsLoad(e) {
		var str = "加载 "+configArr[cnt]+"<br>加载进度:"+parseInt((cnt+1)/len*100)+"%";
		var size = window.innerWidth > 800 ? 7 : 4;
		document.body.innerHTML = "<br><br><br><br><br><br><br><br><br><br><br><br><font color='green' size='"+size+"'>"+str+"</font>";
		cnt++;
	}

	function jsComplete(e) {
		loader = null;
		configArr = null;
		initStage();
	}
}

/** 初始化舞台，加载游戏资源 */
function initStage() {
	wMc = lib.properties.width;
	hMc = lib.properties.height;
	var w,h;
	
	document.body.innerHTML = ""; 
	wStage = window.innerWidth;
	hStage = window.innerHeight;
	wStageScale = wStage/lib.properties.width;
	hStageScale = hStage/lib.properties.height;
	
	if(wMc*(hStage/hMc) > wStage){
		w = wStage;
		h = hMc*(wStage/wMc);
	}else{
		h = hStage;
		w = wMc*(hStage/hMc);
	}
	
	wStageScale = w/wMc;
	hStageScale = h/hMc;
	hPost = (wStage - w)/2;
	vPost = (hStage - h)/2;
	
	canvas = createCanvas("can", lib.properties.width, lib.properties.height);
	//canvas.style.width = wStage+"px";
	//canvas.style.height = hStage+"px";
	canvas.style.position="absolution";
	canvas.style.width = w+"px";
	canvas.style.height = h+"px";
	canvas.style.margin = vPost+"px 0px 0px "+0+"px";
	document.body.style.margin="0px";
	document.body.appendChild(canvas);
	
	createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin]);
	
	//创建舞台
	stage = new createjs.Stage(canvas);
	createjs.Ticker.setFPS(lib.properties.fps);
	createjs.Ticker.addEventListener("tick", stage);
	if(createjs.Touch.isSupported()){
		createjs.Touch.enable(stage, true);
		stage.enableDOMEvents(false);
	}
	
	//加载manifest中的资源
	setTimeout(function(){
		if(lib.properties.manifest.length == 0){
			initAction();
		}else{
			createLoadAnimation(lib.properties.manifest, w/2/wStageScale, h/2/hStageScale, initAction);
		}
	}, 100);
	
	//屏幕旋转时调用
	window.onorientationchange = orientationChange;
	//键盘按下
	window.addEventListener("keydown", doKeyDown, true);
	
	window.onbeforeunload= function(){
		stopSound();
	}
	
	window.onunload = function(){
		stopSound();
	}
	
	stage.update();
}

/** 屏幕旋转 */
function orientationChange() {
	location.reload();
    switch(window.orientation) {
    　　case 0:
            break;
    　　case -90:
            break;
    　　case 90:   
            break;
    　　case 180:
			break;
    };
}

/** 键盘按下 */
function doKeyDown(e) {  
    var keyID = e.keyCode ? e.keyCode : e.which;  
	if(keyID == 4){
		stopSound();
	}
    if(keyID === 38 || keyID === 87)  { // up arrow and W  
        e.preventDefault();  
    }  
    if(keyID === 39 || keyID === 68)  { // right arrow and D  
        e.preventDefault();  
    }  
    if(keyID === 40 || keyID === 83)  { // down arrow and S  
        e.preventDefault();  
    }  
    if(keyID === 37 || keyID === 65)  { // left arrow and A  
        e.preventDefault();  
    }  
}  

/** 创建一个画布，通过传递、宽度与高度 */
function createCanvas(id, w, h){
	var canvas = document.createElement("canvas");
	canvas.id = id;
	canvas.width = w;
	canvas.height = h;
	canvas.style = "background-color:#000000;margin:0;padding:0";
	//canvas.style = "background-color:#000000;margin:0;padding:0;display:block";
	return canvas;
}

/** 加载arr数组中指定的资源, 并创建加载动画添加到stage上，显示加载进度<br>
 * arr 需要加载的资源数组<br>
 * x,y 设置加载动画的x,y坐标<br>
 * backFun 加载完成时的回调函数<br>
 * tipText 要显示的提示文本*/
function createLoadAnimation(arr, x, y, backFun, tipText){
	var cnt=0;
	var len = arr.length;
	var loadAnimation = new lib.LoadAnimation();
	loadAnimation.bg.cache(0, 0, 290, 25);
	loadAnimation.thumb.cache(0, 0, 52, 20);
	createjs.Tween.get(loadAnimation.thumb, {override:true, loop:true}).to({x:206}, 3000);
	
	loadAnimation.tipTf.text = tipText ? tipText : "正在加载游戏素材，请稍候……";
	stage.addChild(loadAnimation);
	loadAnimation.x = x;
	loadAnimation.y = y;
	
	var loader = new createjs.LoadQueue(false);
	loader.installPlugin(createjs.Sound);
	loader.addEventListener("fileload", handleFileLoad);
	loader.addEventListener("complete", handleComplete);
	loader.loadManifest(arr);
	
	function handleFileLoad(evt) {
		if (evt.item.type == "image") { images[evt.item.id] = evt.result; }
		cnt++;
		loadAnimation.percentTf.text = parseInt(((cnt+1)/len)*100)+"%";
	}

	function handleComplete() {
		stage.removeChild(loadAnimation);
		createjs.Tween.removeAllTweens();
		loader = null;
		loadAnimation = null;
		loadConfigArr = null;
		canvas.getContext("2d").clearRect(0, 0, wStage, hStage);
		stage.update();
		
		if(backFun != null){
			backFun();
			backFun = null;
		}
	}
}

/** 播放声音通过加载时配置在manifest文件里的id */
function playSound(id, loop) {
	createjs.Sound.play(id, createjs.Sound.INTERRUPT_EARLY, 0, 0, loop);
}

/** 停止正在播放声音 */
function stopSound() {
	createjs.Sound.stop();
}

/** 获取网页传来的参数，即url中"?"符后的字串所代表的键值对 */
function getUrlParam(){
	var url = location.search; 
	var obj = null;
	if (url.indexOf("?") != -1) {
		obj = new Object();
		var str = url.substr(1);
		var strs = str.split("&");
		for(var i = 0; i < strs.length; i ++) {
		   obj[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
		}
	}
	return obj;
}

/** 打印调试信息 */
function trace(str){
	console.log(str);
}