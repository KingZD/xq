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

function drawQP(canvas) {
	canvasHeight = canvas.height - canvas.height / row;
	cellWH = canvasHeight / row;
	xqWH = cellWH / 2;
	xqWordWH = xqWH;
	canvasWidth = cellWH * 8 + xqWH * 2;
	canvas.width = canvasWidth;
	jbCountWH = cellWH / 3;
	jbCountMargin = jbCountWH / 3;
	let ctx = canvas.getContext("2d")
	ctx.fillStyle = "#FFE5B4";
	ctx.fillRect(0, 0, canvasWidth, canvasHeight + xqWH * 2);
	ctx.strokeRect(xqWH, xqWH, canvasWidth - xqWH * 2, canvasHeight)
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
		ctx.lineTo(canvasHeight - xqWH, cellWH * (j + 1) + xqWH);
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
		drawBlackQz(ctx, row, col, blackXqData[l]);
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
		drawRedQz(ctx, row, col, redXqData[l]);
	}
	ctx.closePath();
}


function drawBlackQz(ctx, row, col, word) {
	drawXq(ctx, row, col, word);
}

function drawRedQz(ctx, row, col, word) {
	drawXq(ctx, row, col, word);
}

function drawXq(ctx, row, col, word) {
	ctx.beginPath();
	ctx.moveTo(xqWH + row * cellWH, xqWH + cellWH * col);
	var grd = ctx.createRadialGradient(xqWH, xqWH, 0, xqWH, xqWH, xqWH);
	grd.addColorStop(0, "red");
	grd.addColorStop(1, "white");
	// 填充渐变
	ctx.fillStyle = "#ccc";
	ctx.arc(xqWH + row * cellWH, xqWH + cellWH * col, xqWH - xqMrgin, 0, 2 * Math.PI, false);
	ctx.fill();

	ctx.font = xqWordWH + "px KaiTi";
	ctx.fillStyle = "cornflowerblue";
	ctx.fillText(word, (xqWH * 2 - xqWordWH) / 2 + row * cellWH, xqWordWH + (xqWH * 2 - xqWordWH) / 2 + cellWH * col);
}
