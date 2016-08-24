/** 账户金额面板 */
var moneyPane;
/** 当然投注金额 */
var betMoney = 2;
/** 本关中奖金额 */
var prizeMoney = 0;
/** 账户余额 */
var accountMoney = 0;
/** 末兑总金额 */
var notpayTotal = 0;

/** 随机抽取一个票面数据 */
var ran = 0;
/** 取得配置文件的数组 */
var cArr = getConfig();
/** 中奖等级与钱<br>
 * arr[0] 中奖等级<br>
 * arr[1] 中奖金额 */
var mArr;

/** 踢球的次数 */
var times = 1;
/** 第多少次是否进球 */
var isInto;
/** 角色的各种状态 */
var role;
/** 球的各种状态 */
var ball;
/** 门员的各种状态 */
var keeper;
/** 是否进球的标识 */
var intoFlag;
/** 角色得分 */
var scoreRole = 0;
/** 门员得分 */
var scoreKeeper = 0;

/** 射门方向 左中右 */
var selectDir;

function initAction(){
	exportRoot = new lib.MainView();
	stage.addChild(exportRoot);
	
	moneyPane = new lib.MoneyPane();
	moneyPane.x = 766;
	moneyPane.y = 495;
	stage.addChild(moneyPane);
	
	stage.update();
	
	exportRoot.startBtn.addEventListener("click", function(e){
		createGameView();
	});
	
	exportRoot.helpBtn.addEventListener("click", function(e){
		var help = new lib.HelpPanel();
		help.backBtn.addEventListener("click", function(e){stage.removeChild(help);});
		stage.addChild(help);
	});
	
	exportRoot.quitBtn.addEventListener("click", function(e){
		try{
			window.GameActivity.exitApp();
		}catch(e){
			window.opener = null;  
			window.open('', '_top', '');  
			window.parent.close();
		}
	});
	
	var obj = getUrlParam();
	if(obj == null){
		setBalance(100, 0);
	}else{
		setBalance(obj.money, obj.notpay);
	}
}

/** 应用程序调用传递游戏初始账户余额， 末兑总金额<br>
money 当前账户余额<br>   
notpay 末兑总金额 */
function setBalance(money, notpay){
	accountMoney = money;
	notpayTotal = notpay;
	moneyPane.betTf.text = betMoney;
	moneyPane.accountTf.text = accountMoney;
	moneyPane.notpayTf.text = notpayTotal;
}

/** 创建游戏界面 */
function createGameView(){
	stage.removeChild(exportRoot);
	
	exportRoot = new lib.GameView();
	stage.addChildAt(exportRoot, 0);
	
	initGame();
	
	//点击门框里的人
	exportRoot.doorBtn0.addEventListener("click", doorBtnHandler);
	exportRoot.doorBtn1.addEventListener("click", doorBtnHandler);
	exportRoot.doorBtn2.addEventListener("click", doorBtnHandler);
	
	/** 点击门框里的人 选择射门方向 */
	function doorBtnHandler(e){
		if(e.target == exportRoot.doorBtn0){
			selectDir = 2;
		}else if(e.target == exportRoot.doorBtn1){
			selectDir = 1;
		}else if(e.target == exportRoot.doorBtn2){
			selectDir = 3;;
		}
		createRole("shoot");
	}
	
	//在TitleMc运动到屏幕之外时处发
	stage.addEventListener("footShoot", function(){
		exportRoot.doorBtn0.mouseEnabled = true;
		exportRoot.doorBtn1.mouseEnabled = true;
		exportRoot.doorBtn2.mouseEnabled = true;
	});
	
	//在Role_Shoot中处发
	stage.addEventListener("ballFly", function(){
		//上下
		var r1 = parseInt(Math.random()*2) == 0 ? "L" : "H";
		//进或不进球
		var s = isInto == 0 ? "F" : "S";
		
		createBall(""+selectDir+r1+s);
		createKeeper(""+selectDir+r1);
	});
	
	//在Ball_XXX运动结束时处发
	stage.addEventListener("ballFinish", function(){
		createRole(isInto == 1 ? "win" : "fail");
		createKeeper(isInto == 0 ? "win" : "fail");
	});
	
	//在Role_Success或Role_Fail中处发
	stage.addEventListener("timesFinish", function(){
		intoFlag = isInto == 0 ? new lib.FailBall() : new lib.IntoBall();
		intoFlag.x = 184;
		intoFlag.y = 200;
		exportRoot.addChild(intoFlag);
		
		isInto == 0 ? scoreKeeper++ : scoreRole++;
		setBitTf(exportRoot.roleScore, "0"+scoreRole, 64);
		setBitTf(exportRoot.keeperScore, "0"+scoreKeeper, 64);
	});
	
	//在IntoBall或FailBall中处发
	stage.addEventListener("nextTimes", function(){
		exportRoot.removeChild(intoFlag);
		if(times > 5){
			finishGame();
		}else{
			nextTimes();
		}
	});
}

/** 初始化游戏 */
function initGame(){
	accountMoney -= betMoney;
	moneyPane.betTf.text = betMoney;
	moneyPane.accountTf.text = accountMoney;
	
	times = 1;
	scoreRole = 0;
	scoreKeeper = 0;
	ran = parseInt(Math.random()*32);
	setBitTf(exportRoot.roleScore, "0"+scoreRole, 64);
	setBitTf(exportRoot.keeperScore, "0"+scoreKeeper, 64);
	nextTimes();
	
	exportRoot.doorBtn0.mouseEnabled = false;
	exportRoot.doorBtn1.mouseEnabled = false;
	exportRoot.doorBtn2.mouseEnabled = false;
}

/** 进入下一次踢球 */
function nextTimes(){
	isInto = cArr[ran][1][times-1];
	
	createRole("wait");
	createBall("wait");
	createKeeper("wait");
	exportRoot.titleMc.gotoAndPlay(2);
	setBitTf(exportRoot.titleMc.title.num, ""+times, 64);
	times++;
	
	exportRoot.doorBtn0.mouseEnabled = false;
	exportRoot.doorBtn1.mouseEnabled = false;
	exportRoot.doorBtn2.mouseEnabled = false;
}

/** 结束游戏，已经踢球完5次 */
function finishGame(){
	var m;
	if(cArr[ran][0][0] < 5){
		m = new lib.WinPanel();
		setTimeout(function(){
			m.prizeBar.gotoAndStop(cArr[ran][0][0]-1);
		}, 300);
		accountMoney += cArr[ran][0][1];
		moneyPane.accountTf.text = accountMoney;
		exportRoot.addChild(m);
	}else{
		m = new lib.LosePanel();
		exportRoot.addChild(m);
	}
	m.againBtn.addEventListener("click", function(){
		exportRoot.removeChild(m);
		initGame();
	});
	m.quitBtn.addEventListener("click", function(){
		try{
			window.GameActivity.exitApp();
		}catch(e){
			window.opener = null;  
			window.open('', '_top', '');  
			window.parent.close();
		}
	});
}


/** 创建角色 */
function createRole(state){
	if(role != null){
		exportRoot.removeChild(role);
	}
	if(state == "wait"){
		role = new lib.Role_Wait();
		role.setTransform(357, 400, 1.4, 1.4);
	}else if(state == "shoot"){
		role = new lib.Role_Shoot();
		role.setTransform(357, 400, 1.4, 1.4);
	}else if(state == "win"){
		role = new lib.Role_Success();
		role.setTransform(405, 216, 1.5, 1.5);
	}else if(state == "fail"){
		role = new lib.Role_Fail();
		role.setTransform(507, 435, 1.4, 1.4);
	}
	exportRoot.addChild(role);
}

/** 创建球 */
function createBall(state){
	if(ball != null){
		exportRoot.removeChild(ball);
	}
	if(state == "wait"){
		ball = new lib.Ball_Wait();
	}else if(state == "1LS"){
		ball = new lib.Ball_1LS();
	}else if(state == "1HS"){
		ball = new lib.Ball_1HS();
	}else if(state == "1LF"){
		ball = new lib.Ball_1LF();
	}else if(state == "1HF"){
		ball = new lib.Ball_1HF();
	}else if(state == "2LS"){
		ball = new lib.Ball_2LS();
	}else if(state == "2HS"){
		ball = new lib.Ball_2HS();
	}else if(state == "2LF"){
		ball = new lib.Ball_2LF();
	}else if(state == "2HF"){
		ball = new lib.Ball_2HF();
	}else if(state == "3LS"){
		ball = new lib.Ball_3LS();
	}else if(state == "3HS"){
		ball = new lib.Ball_3HS();
	}else if(state == "3LF"){
		ball = new lib.Ball_3LF();
	}else if(state == "3HF"){
		ball = new lib.Ball_3HF();
	}
	if(state == "wait"){
		ball.setTransform(490, 452);
	}else{
		ball.setTransform(480, 443);
	}
	exportRoot.addChild(ball);
}

/** 创建门员 */
function createKeeper(state){
	if(keeper != null){
		exportRoot.removeChild(keeper);
	}
	if(state == "wait"){
		keeper = new lib.Keeper_Wait();
		keeper.setTransform(526, 205, 0.85, 0.85);
	}else if(state == "fail"){
		keeper = new lib.Keeper_Fail();
		keeper.setTransform(526, 205, 0.85, 0.85);
	}else if(state == "win"){
		keeper = new lib.Keeper_Win();
		keeper.setTransform(526, 205, 0.85, 0.85);
	}else if(state == "1L"){
		keeper = new lib.Keeper_1F();
		keeper.setTransform(526, 205, 0.85, 0.85);
	}else if(state == "1H"){
		keeper = new lib.Keeper_1H();
		keeper.setTransform(526, 205, 0.85, 0.85);
	}else if(state == "2L"){
		keeper = new lib.Keeper_2F();
		keeper.setTransform(526, 205, -0.85, 0.85);
	}else if(state == "2H"){
		keeper = new lib.Keeper_2H();
		keeper.setTransform(526, 205, -0.85, 0.85);
	}else if(state == "3L"){
		keeper = new lib.Keeper_2F();
		keeper.setTransform(526, 205, 0.85, 0.85);
	}else if(state == "3H"){
		keeper = new lib.Keeper_2H();
		keeper.setTransform(526, 205, 0.85, 0.85);
	}
	exportRoot.addChild(keeper);
}

/** 设置位图字体文本 <br>
 * mcTf 要设置的位图字体MC<br>
 * numStr 数据字符串<br>
 * width 整个文本框的宽度<br>
 * align 文字的对齐方式，可先值为L(左)、C(中)、R(右)， 默认值C*/
 function setBitTf(mcTf, numStr, width, align, style){
	numStr = ""+numStr;
	mcTf.removeAllChildren();
	var mc;
	var w = 0;
	for(var i=0; i<numStr.length; i++){
		if(numStr.charAt(i) == "Y"){
			mc = style == null ? new lib.NY() : new lib.HY() ;
		}else if(numStr.charAt(i) == "0"){
			mc = style == null ? new lib.N0() : new lib.H0() ;
		}else if(numStr.charAt(i) == "1"){
			mc = style == null ? new lib.N1() : new lib.H1() ;
		}else if(numStr.charAt(i) == "2"){
			mc = style == null ? new lib.N2() : new lib.H2() ;
		}else if(numStr.charAt(i) == "3"){
			mc = style == null ? new lib.N3() : new lib.H3() ;
		}else if(numStr.charAt(i) == "4"){
			mc = style == null ? new lib.N4() : new lib.H4() ;
		}else if(numStr.charAt(i) == "5"){
			mc = style == null ? new lib.N5() : new lib.H5() ;
		}else if(numStr.charAt(i) == "6"){
			mc = style == null ? new lib.N6() : new lib.H6() ;
		}else if(numStr.charAt(i) == "7"){
			mc = style == null ? new lib.N7() : new lib.H7() ;
		}else if(numStr.charAt(i) == "8"){
			mc = style == null ? new lib.N8() : new lib.H8() ;
		}else if(numStr.charAt(i) == "9"){
			mc = style == null ? new lib.N9() : new lib.H9() ;
		}else if(numStr.charAt(i) == "元"){
			mc = style == null ? new lib.Nyuan() : new lib.Hyuan() ;
		}
		mc.x = w;
		w += mc.getBounds().width;
		mcTf.addChild(mc);
	}
	
	var delta;
	delta = parseInt(((width - w*mcTf.scaleX)/2)/mcTf.scaleX);
	if(align == "C" || align == undefined){
		for(i=0; i<numStr.length; i++){
			mcTf.getChildAt(i).x += delta;
		}
	}else if(align == "R"){
		for(i=0; i<numStr.length; i++){
			mcTf.getChildAt(i).x += delta*2;
		}
	}else{
	}
}
 
 /** 取得配置文件 */
 function getConfig(){
		return [
			[[1,500],[1,1,1,1,1]],
			[[1,500],[1,1,1,1,1]],
			[[2,66],[0,1,1,1,1]],
			[[2,66],[1,1,1,1,0]],
			[[2,66],[1,0,1,1,1]],
			[[2,66],[1,1,0,1,1]],
			[[2,66],[1,1,1,0,1]],
			[[2,66],[1,1,0,1,1]],
			[[3,10],[0,1,1,0,1]],
			[[3,10],[1,1,0,0,1]],
			[[3,10],[1,1,0,1,0]],
			[[3,10],[1,1,1,0,0]],
			[[3,10],[0,0,1,1,1]],
			[[3,10],[0,1,1,1,0]],
			[[3,10],[1,1,0,0,1]],
			[[3,10],[1,0,0,1,1]],
			[[3,10],[1,0,1,0,1]],
			[[4,2],[1,0,0,1,0]],
			[[4,2],[1,0,0,0,1]],
			[[4,2],[1,1,0,0,0]],
			[[4,2],[0,0,1,1,0]],
			[[4,2],[0,0,0,1,1]],
			[[4,2],[0,1,0,1,0]],
			[[5,0],[0,0,1,0,0]],
			[[5,0],[0,1,0,0,0]],
			[[5,0],[1,0,0,0,0]],
			[[5,0],[0,0,0,1,0]],
			[[5,0],[0,0,0,0,1]],
			[[5,0],[0,0,1,0,0]],
			[[5,0],[0,0,0,0,0]],
			[[5,0],[0,0,0,0,0]],
			[[5,0],[0,0,0,0,0]]
		];
	}