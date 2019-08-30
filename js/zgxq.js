let row = 9; //九行
let col = 8; //八列
let wordMarginTop = 5; //楚河汉界文本距离上面的距离
let jbCount = 4; //角标
let jbCountWH = 4; //角标宽度
let jbCountH = 4; //角标高度
let jbCountMargin = 5; //角标间距
let canvasHeight = 0;
let canvasWidth = 0;
let cellWH = 0;
let wordWidth = 0;
//绘制象棋
let xqWH = 0;
let xqMrgin = 4;
let xqWordWH = 0;

let redXqData = ["車", "馬", "象", "士", "帥", "士", "象", "馬", "車", "炮", "炮", "卒", "卒", "卒", "卒", "卒"];
let blackXqData = ["車", "馬", "相", "士", "将", "士", "相", "馬", "車", "炮", "炮", "兵", "兵", "兵", "兵", "兵"];

let qzNum = 16;
let qzBg;
let ctx;
let canvas;
//记录棋盘棋子
let mapQz = [];
//是否初始化过
let isInit = false;
//当前玩家点击的棋子
let playerQz;
//当前玩家
let mPlayer = "黑方";

//创建玩家
function Player(player, flag, life, row, col, name, initX, initY) {
	this.player = player; //红方 黑方
	this.flag = flag; //棋子是否被选中 未选中0 选中1
	this.life = life; //棋子是否存活 0-存活 1-死亡
	this.row = row; //行
	this.col = col; //列
	this.name = name; //棋子名称
	this.initX = initX;
	this.initY = initY;
}

Player.prototype = {
	constructor: Player,
}

function loadRes(cv) {
	canvas = cv;
	//画布绑定点击事件
	canvas.addEventListener('click', function(e) {
		playerTouch(e)
	})

	canvasHeight = canvas.height - canvas.height / row;
	cellWH = canvasHeight / row;
	xqWH = cellWH / 3 * 2;
	xqWordWH = xqWH / 3 * 2;
	canvasWidth = cellWH * 8 + xqWH * 2;
	canvas.width = canvasWidth;
	jbCountWH = cellWH / 3;
	jbCountMargin = jbCountWH / 3;

	ctx = canvas.getContext("2d")
	qzBg = new Image();
	qzBg.onload = function() {
		drawQPBg(ctx);
	};
	qzBg.onerror = function() {
		alert("error!")
	};
	qzBg.src = "../xq/img/qzbg.png";
}

/**
 * 判断当前点击的位置信息
 * @param {Object} e 手势坐标
 */
function playerTouch(e) {
	var p = getEventPosition(e)
	let w = "";
	if (p.x > xqWH / 2 && p.x < canvasWidth - xqWH / 2 && p.y > xqWH / 2 && p.y < canvasHeight + xqWH * 3 / 2) {
		w = "true_" + p.x + "_" + p.y;
	} else {
		w = "false_" + p.x + "_" + p.y;
	}
	if (playerQz == null) {
		playerQz = getQz(p);
		if(!judgeQzBelong(playerQz)){
			//不属于自己的棋子类型 不处理
			playerQz = null;
			return;
		}
		playerQz.flag = 1;
		drawQPBg(ctx);
	} else {
		//删除map里面旧的所控制棋子的 数据
		let currentQz = getQz(p);
		if (currentQz == null) return;
		if (currentQz.initX == playerQz.initX && currentQz.initY == playerQz.initY) {
			console.log("你不能干掉自己");
			return;
		}
		if (judgeQzBelongType(currentQz, playerQz)) {
			//如果两个棋子都是自己的
			playerQz.flag = 0;
			currentQz.flag = 1;
			playerQz = currentQz;
			drawQPBg(ctx);
			return;
		}
		let row = playerQz.row;
		let col = playerQz.col;
		//更新控制的棋子绘制到被吃棋子的位置
		playerQz.row = currentQz.row;
		playerQz.col = currentQz.col;
		playerQz.initX = currentQz.initX;
		playerQz.initY = currentQz.initY;
		//更新被吃掉的棋子 状态为1
		currentQz.life = 1;
		drawQPBg(ctx)
		// playerQz = null;
	}
}

/**
 * @param {Object} 获取当前坐标上的棋子
 */
function getQz(p) {
	let currentQz;
	for (let i = 0; i < mapQz.length; i++) {
		let qz = mapQz[i];
		let circle = [qz.initX, qz.initY];
		let point = [p.x, p.y]
		//只有点击范围在棋子里面 并且棋子是可用状态 则取出该棋子
		if (pointInsideCircle(point, circle, xqWH) && qz.life == 0) {
			currentQz = qz;
			break;
		}

	}
	if (currentQz == null)
		return null;
	if (currentQz.life == 1) //死亡的棋子不返回
		return null;
	return currentQz;
}

//鼠标点击事件坐标兼容性处理
function getEventPosition(ev) {
	var x, y;
	if (ev.layerX || ev.layerX == 0) {
		x = ev.layerX;
		y = ev.layerY;
	} else if (ev.offsetX || ev.offsetX == 0) { // Opera
		x = ev.offsetX;
		y = ev.offsetY;
	}
	return {
		x: x,
		y: y
	};
}

//绘制棋盘背景
function drawQPBg(ctx) {
	ctx.fillStyle = "#FFE5B4";
	ctx.fillRect(0, 0, canvasWidth, canvasHeight + xqWH * 2);
	ctx.rect(xqWH, xqWH, canvasWidth - xqWH * 2, canvasHeight)
	ctx.stroke();
	//绘制列
	for (let i = 0; i < col; i++) {
		if (i == col - 1) continue
		ctx.moveTo(cellWH * (i + 1) + xqWH, xqWH);
		ctx.lineTo(cellWH * (i + 1) + xqWH, cellWH * 4 + xqWH);
		ctx.moveTo(cellWH * (i + 1) + xqWH, cellWH * 5 + xqWH);
		ctx.lineTo(cellWH * (i + 1) + xqWH, canvasHeight + xqWH);
		ctx.stroke();
	}
	//绘制 楚河汉界 文字
	ctx.fillStyle = "cornflowerblue";
	ctx.font = cellWH - wordMarginTop + "px KaiTi";
	wordWidth = ctx.measureText("楚").width;
	ctx.fillText("楚", cellWH + xqWH, cellWH * 5 - wordMarginTop + xqWH);
	ctx.fillText("河", cellWH * 2 + (cellWH - wordWidth) + xqWH, cellWH * 5 - wordMarginTop + xqWH);
	ctx.fillText("汉", cellWH * 5 + xqWH, cellWH * 5 - wordMarginTop + xqWH);
	ctx.fillText("界", cellWH * 6 + (cellWH - wordWidth) + xqWH, cellWH * 5 - wordMarginTop + xqWH);
	//绘制行
	for (let j = 0; j < row; j++) {
		if (j == row - 1) continue
		ctx.moveTo(xqWH, cellWH * (j + 1) + xqWH);
		ctx.lineTo(canvasWidth - xqWH, cellWH * (j + 1) + xqWH);
		ctx.stroke();
	}
	//绘制将和帅的活动区域
	ctx.moveTo(3 * cellWH + xqWH, 0 + xqWH);
	ctx.lineTo(5 * cellWH + xqWH, cellWH * 2 + xqWH);
	ctx.stroke();

	ctx.moveTo(5 * cellWH + xqWH, 0 + xqWH);
	ctx.lineTo(3 * cellWH + xqWH, cellWH * 2 + xqWH);
	ctx.stroke();

	ctx.moveTo(3 * cellWH + xqWH, cellWH * 7 + xqWH);
	ctx.lineTo(5 * cellWH + xqWH, cellWH * 9 + xqWH);
	ctx.stroke();

	ctx.moveTo(5 * cellWH + xqWH, cellWH * 7 + xqWH);
	ctx.lineTo(3 * cellWH + xqWH, cellWH * 9 + xqWH);
	ctx.stroke();

	//绘制角标 
	for (let k = 0; k < col; k++) {
		if (k == 1 || k == 7) {
			//上角标
			ctx.moveTo(k * cellWH + jbCountMargin + xqWH, cellWH * 2 - jbCountWH - jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH + jbCountMargin + xqWH, cellWH * 2 - jbCountMargin + xqWH);
			ctx.moveTo(k * cellWH + jbCountMargin + xqWH, cellWH * 2 - jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH + jbCountMargin + jbCountWH + xqWH, cellWH * 2 - jbCountMargin + xqWH);
			//下角标
			ctx.moveTo(k * cellWH + jbCountMargin + xqWH, cellWH * 2 + jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH + jbCountMargin + jbCountWH + xqWH, cellWH * 2 + jbCountMargin + xqWH);
			ctx.moveTo(k * cellWH + jbCountMargin + xqWH, cellWH * 2 + jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH + jbCountMargin + xqWH, cellWH * 2 + jbCountWH + jbCountMargin + xqWH);

			ctx.moveTo(k * cellWH + jbCountMargin + xqWH, cellWH * 7 - jbCountWH - jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH + jbCountMargin + xqWH, cellWH * 7 - jbCountMargin + xqWH);
			ctx.moveTo(k * cellWH + jbCountMargin + xqWH, cellWH * 7 - jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH + jbCountMargin + jbCountWH + xqWH, cellWH * 7 - jbCountMargin + xqWH);
			//下角标
			ctx.moveTo(k * cellWH + jbCountMargin + xqWH, cellWH * 7 + jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH + jbCountMargin + jbCountWH + xqWH, cellWH * 7 + jbCountMargin + xqWH);
			ctx.moveTo(k * cellWH + jbCountMargin + xqWH, cellWH * 7 + jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH + jbCountMargin + xqWH, cellWH * 7 + jbCountWH + jbCountMargin + xqWH);

			ctx.moveTo(k * cellWH - jbCountMargin + xqWH, cellWH * 2 - jbCountWH - jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH - jbCountMargin + xqWH, cellWH * 2 - jbCountMargin + xqWH);
			ctx.moveTo(k * cellWH - jbCountMargin + xqWH, cellWH * 2 - jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH - jbCountMargin - jbCountWH + xqWH, cellWH * 2 - jbCountMargin + xqWH);
			//下角标
			ctx.moveTo(k * cellWH - jbCountMargin + xqWH, cellWH * 2 + jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH - jbCountMargin - jbCountWH + xqWH, cellWH * 2 + jbCountMargin + xqWH);
			ctx.moveTo(k * cellWH - jbCountMargin + xqWH, cellWH * 2 + jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH - jbCountMargin + xqWH, cellWH * 2 + jbCountWH + jbCountMargin + xqWH);

			ctx.moveTo(k * cellWH - jbCountMargin + xqWH, cellWH * 7 - jbCountWH - jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH - jbCountMargin + xqWH, cellWH * 7 - jbCountMargin + xqWH);
			ctx.moveTo(k * cellWH - jbCountMargin + xqWH, cellWH * 7 - jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH - jbCountMargin - jbCountWH + xqWH, cellWH * 7 - jbCountMargin + xqWH);
			//下角标
			ctx.moveTo(k * cellWH - jbCountMargin + xqWH, cellWH * 7 + jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH - jbCountMargin - jbCountWH + xqWH, cellWH * 7 + jbCountMargin + xqWH);
			ctx.moveTo(k * cellWH - jbCountMargin + xqWH, cellWH * 7 + jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH - jbCountMargin + xqWH, cellWH * 7 + jbCountWH + jbCountMargin + xqWH);
		}
		if (k % 2 == 0) {
			//上角标
			ctx.moveTo(k * cellWH + jbCountMargin + xqWH, cellWH * 3 - jbCountWH - jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH + jbCountMargin + xqWH, cellWH * 3 - jbCountMargin + xqWH);
			ctx.moveTo(k * cellWH + jbCountMargin + xqWH, cellWH * 3 - jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH + jbCountMargin + jbCountWH + xqWH, cellWH * 3 - jbCountMargin + xqWH);
			//下角标
			ctx.moveTo(k * cellWH + jbCountMargin + xqWH, cellWH * 3 + jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH + jbCountMargin + jbCountWH + xqWH, cellWH * 3 + jbCountMargin + xqWH);
			ctx.moveTo(k * cellWH + jbCountMargin + xqWH, cellWH * 3 + jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH + jbCountMargin + xqWH, cellWH * 3 + jbCountWH + jbCountMargin + xqWH);

			ctx.moveTo(k * cellWH + jbCountMargin + xqWH, cellWH * 6 - jbCountWH - jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH + jbCountMargin + xqWH, cellWH * 6 - jbCountMargin + xqWH);
			ctx.moveTo(k * cellWH + jbCountMargin + xqWH, cellWH * 6 - jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH + jbCountMargin + jbCountWH + xqWH, cellWH * 6 - jbCountMargin + xqWH);
			//下角标
			ctx.moveTo(k * cellWH + jbCountMargin + xqWH, cellWH * 6 + jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH + jbCountMargin + jbCountWH + xqWH, cellWH * 6 + jbCountMargin + xqWH);
			ctx.moveTo(k * cellWH + jbCountMargin + xqWH, cellWH * 6 + jbCountMargin + xqWH);
			ctx.lineTo(k * cellWH + jbCountMargin + xqWH, cellWH * 6 + jbCountWH + jbCountMargin + xqWH);
		} else {
			ctx.moveTo((k + 1) * cellWH - jbCountMargin + xqWH, cellWH * 3 - jbCountWH - jbCountMargin + xqWH);
			ctx.lineTo((k + 1) * cellWH - jbCountMargin + xqWH, cellWH * 3 - jbCountMargin + xqWH);
			ctx.moveTo((k + 1) * cellWH - jbCountMargin + xqWH, cellWH * 3 - jbCountMargin + xqWH);
			ctx.lineTo((k + 1) * cellWH - jbCountMargin - jbCountWH + xqWH, cellWH * 3 - jbCountMargin + xqWH);
			//下角标
			ctx.moveTo((k + 1) * cellWH - jbCountMargin + xqWH, cellWH * 3 + jbCountMargin + xqWH);
			ctx.lineTo((k + 1) * cellWH - jbCountMargin - jbCountWH + xqWH, cellWH * 3 + jbCountMargin + xqWH);
			ctx.moveTo((k + 1) * cellWH - jbCountMargin + xqWH, cellWH * 3 + jbCountMargin + xqWH);
			ctx.lineTo((k + 1) * cellWH - jbCountMargin + xqWH, cellWH * 3 + jbCountWH + jbCountMargin + xqWH);

			ctx.moveTo((k + 1) * cellWH - jbCountMargin + xqWH, cellWH * 6 - jbCountWH - jbCountMargin + xqWH);
			ctx.lineTo((k + 1) * cellWH - jbCountMargin + xqWH, cellWH * 6 - jbCountMargin + xqWH);
			ctx.moveTo((k + 1) * cellWH - jbCountMargin + xqWH, cellWH * 6 - jbCountMargin + xqWH);
			ctx.lineTo((k + 1) * cellWH - jbCountMargin - jbCountWH + xqWH, cellWH * 6 - jbCountMargin + xqWH);
			//下角标
			ctx.moveTo((k + 1) * cellWH - jbCountMargin + xqWH, cellWH * 6 + jbCountMargin + xqWH);
			ctx.lineTo((k + 1) * cellWH - jbCountMargin - jbCountWH + xqWH, cellWH * 6 + jbCountMargin + xqWH);
			ctx.moveTo((k + 1) * cellWH - jbCountMargin + xqWH, cellWH * 6 + jbCountMargin + xqWH);
			ctx.lineTo((k + 1) * cellWH - jbCountMargin + xqWH, cellWH * 6 + jbCountWH + jbCountMargin + xqWH);
		}
		ctx.stroke();
	}

	updateQzPosition();
}

//更新棋子状态
function updateQzPosition() {
	//如果没有初始化过 就使用默认坐标绘制初始棋盘
	if (!isInit) {
		for (let l = 0; l < qzNum; l++) {
			let row = 0,
				col = 0;
			if (l < 9) {
				row = l;
			} else if (l == 9) {
				row = 1;
				col = 2;
			} else if (l == 10) {
				row = 7;
				col = 2;
			} else {
				row = l == 11 ? 0 : 2 * (l - 11);
				col = 3;
			}
			drawXq(ctx, row, col, blackXqData[l], "#222", "黑方");
			if (l < 9) {
				col = 9;
			} else if (l == 9) {
				row = 1;
				col = 7;
			} else if (l == 10) {
				row = 7;
				col = 7;
			} else {
				row = l == 11 ? 0 : 2 * (l - 11);
				col = 6;
			}
			drawXq(ctx, row, col, redXqData[l], "red", "红方");
		}
		ctx.closePath();
		isInit = true;
	} else {
		//初始化过就通过修改过的状态对棋子进行绘制 
		for (let i = 0; i < mapQz.length; i++) {
			let qz = mapQz[i];
			drawCheckQzBg(qz);
			if ("黑方" === qz.player) {
				if (qz.life == 0) //只绘制存活的棋子
					drawXq(ctx, qz.row, qz.col, qz.name, "#222", "黑方");
			} else {
				if (qz.life == 0) //只绘制存活的棋子
					drawXq(ctx, qz.row, qz.col, qz.name, "red", "红方");
			}
		}
	}
}

//绘制棋子和棋子背景
function drawXq(ctx, row, col, word, color, player) {
	ctx.beginPath();
	let qzX = getQzX(row);
	let qzY = getQzX(col);
	ctx.moveTo(qzX, qzY);
	ctx.drawImage(qzBg, qzX - xqWH / 2, qzY - xqWH / 2, xqWH, xqWH);

	ctx.font = xqWordWH + "px MyFont";
	ctx.fillStyle = color;
	ctx.fillText(word, qzX - xqWordWH / 2, qzY + xqWordWH / 2 -
		wordMarginTop / 2);
	if (!isInit)
		mapQz[mapQz.length] = new Player(player, 0, 0, row, col, word, qzX, qzY);
}

/**
 * 给被选中的棋子 绘制一个背景标识
 */
function drawCheckQzBg(playerQz) {
	if (playerQz != null && playerQz.flag == 1 && playerQz.player === mPlayer) {
		ctx.beginPath();
		ctx.moveTo(playerQz.initX, playerQz.initY);
		ctx.fillStyle = "green";
		ctx.arc(playerQz.initX, playerQz.initY, xqWH / 2 + 2, 0, Math.PI * 2, true);
		ctx.closePath();
		ctx.fill();
	}
}

//row = x 根据行获取X坐标
function getQzX(row) {
	return xqWH + row * cellWH;
}

//col = y 根据列获取X坐标
function getQzY(col) {
	return xqWH + col * cellWH;
}

/** 
 *  判断一个点是否在圆的内部 
 *  @param point  测试点坐标 
 *  @param circle 圆心坐标 
 *  @param r 圆半径 
 *  返回true为真，false为假 
 *  */
function pointInsideCircle(point, circle, r) {
	if (r === 0) return false
	var dx = circle[0] - point[0]
	var dy = circle[1] - point[1]
	return dx * dx + dy * dy <= r * r
}

/**
 * 判断当前点击的棋子是不是自己的
 */
function judgeQzBelong(qz) {
	return qz.player === mPlayer
}

/**
 * 判断两个点击的棋子是否都是自己的棋子
 */
function judgeQzBelongType(firstQz, secondQz) {
	return firstQz.player === secondQz.player
}
