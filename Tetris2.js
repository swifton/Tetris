var gLoop,
	c = document.getElementById('c'),
	cv = document.getElementById('cv'),	
	ctx = c.getContext('2d');
	ctxv = cv.getContext('2d');
	
	cv.width = 150;
	cv.height = 190;
	
var tile1 = [[3,0],[4,0],[5,0],[6,0]], 
	tile2 = [[3,0],[4,0],[5,0],[4,1]], 
	tile3 = [[5,0],[4,0],[4,1],[3,1]], 
	tile4 = [[3,0],[4,0],[4,1],[5,1]], 
	tile5 = [[3,0],[4,0],[3,1],[4,1]],
	tile6 = [[3,0],[5,0],[4,0],[5,1]],
	tile7 = [[5,0],[3,0],[4,0],[3,1]],
	tiles = [tile1, tile2, tile3, tile4, tile5, tile6, tile7];
	
var FieldH = 20, FieldW = 10, radius = 12.5;
width = FieldW * 2 * radius;
height = FieldH * 2 * radius;
c.width = width;
c.height = height;

var clear = function(ctx){
	ctx.fillStyle = '#d0e7f9';
	ctx.clearRect(0, 0, width, height);
	ctx.beginPath();
	ctx.rect(0, 0, width, height);
	ctx.closePath();
	ctx.fill();
}

var DrCircle = function(x, y, im, cc){
	var img=new Image();
	var str = "images/";
	img.src= str.concat(im);
	cc.drawImage(img, x - radius, y - radius); 
}

var newTile = function(){
	NofTile = newNofTile;
	newNofTile = Math.floor(Math.random()*7);
	for (var j = 0; j < 4; j++)
	{
		tile[j] = tiles[NofTile][j].slice(0);
	}
	tilesReceived += 1;
}

var ResetField = function(){
	for (var i = 0; i < FieldW + 1; i++){
		field[i] = new Array(FieldH + 1);
		for (var j = 0; j < FieldH; j++){
			field[i][j] = 0;
		}
	}

	for (var j = 0; j < FieldW; j++){
			field[j][FieldH] = -1;
	}
	linesDeleted = 0;
	tilesReceived = 0;
}

function pauseGame() {
console.log(gamePaused);
  if (!gamePaused) {
    gLoop = clearTimeout(gLoop);
    gamePaused = true;
  } else if (gamePaused) {
    gLoop = setTimeout(GameLoop, 1000 / 4);
    gamePaused = false;
  }
}

function NewGame(){
	ResetField();
	newTile();
	if (gamePaused == true){ pauseGame(); }
}

var tile = [[0,0],[0,0],[0,0],[0,0]];
var linesDeleted, tilesReceived;
var images = ["1.png","2.png","3.png","4.png","5.png","6.png","7.png"]
var colors = ['rgba(150, 0, 0, 1)','rgba(0, 150, 0, 1)','rgba(150, 150, 0, 1)','rgba(0, 0, 150, 1)','rgba(0, 150, 150, 1)','rgba(150, 0, 150, 1)','rgba(150, 150, 150, 1)'];
var field = new Array(FieldW);
ResetField();
var NofTile;
var newNofTile = Math.floor(Math.random()*7);
newTile();
var gamePaused = false;


var Draw = function(){
	
	for (var i = 0; i < FieldW; i++){
		for (var j = 0; j < FieldH; j++){
			if (field[i][j] != 0){
				DrCircle(i * 2 * radius + radius, j * 2 * radius + radius, images[Math.abs(field[i][j]) - 1],ctx);
			}
		}
	}
};

var paint = function(num){
	for (var i = 0; i < 4; i++){
		field[tile[i][0]][tile[i][1]] = num;
	}
}

var check = function(dir){
	for (var i = 0; i < 4; i++){
		if (tile[i][0] + dir[0] > FieldW - 1 || tile[i][0] + dir[0] < 0){
			return true;
		}
		if (field[tile[i][0] + dir[0]][tile[i][1] + dir[1]] < 0){
			return true;
		}
	}
	return false;
}

var CheckEnd = function(){
	var b = 0;
	for (var j = 0; j < FieldW; j++){
		if (field[j][0] < 0) {b = 1}
	}
	if (b == 1) {ResetField();}
}

var UpdateField = function(){
	

	if (check([0,1])){
		paint(-NofTile - 1);
		CheckField();
		CheckEnd();
		newTile();
		paint(NofTile + 1);
		return 1;
	}
	paint(0);
	for (var i = 0; i < 4; i++){tile[i][1]++;}	
	paint(NofTile + 1);
}

var CheckField = function(){
	var sum;
	for (var i = 0; i < FieldH; i++){
		sum = 1;
		for (var j = 0; j < FieldW; j++){
			sum *= field[j][i];
		}
		if (sum != 0){
			linesDeleted += 1;
			for (var j = 0; j < FieldW; j++){
				field[j][i] = 0;
			}
			for (var k = i; k > 0; k--){
				for (var j = 0; j < FieldW; j++){
					field[j][k] = field[j][k-1];
				}
			}
		}
	}
}

var MoveTile = function(dir){
	if (check(dir)){ return 1; }
	
	paint(0);
	for (var i = 0; i < 4; i++){
		tile[i][0] += dir[0];
		tile[i][1] += dir[1];
	}
	paint(NofTile + 1);
}

var CheckP = function(arr){
	for (var i = 0; i < 4; i++){
		if (arr[i][1] < 0) { return false; }
		if (arr[i][0] > FieldW - 1 || arr[i][0] < 0 || field[arr[i][0]][arr[i][1]] < 0){ return false; }
	}
	return true;
}

var RotateTile = function(){
	if (NofTile == 4) { return 1; }
	tmp = new Array(4);
	var a;
	for (var i = 0; i < 4; i++){
		tmp[i] = tile[i].slice(0);
		tmp[i][0] -= tile[1][0];
		tmp[i][1] -= tile[1][1];
		if (NofTile == 0){
			a = tmp[i][0];
			tmp[i][0] = tmp[i][1];
			tmp[i][1] = a;
		}
	}
	if (NofTile == 1){
		tmp = [tmp[3],tmp[1],[-tmp[3][0],-tmp[3][1]],tmp[2]]
	}
	
	if (NofTile == 2 || NofTile == 3){
		tmp = [[-tmp[2][0],-tmp[2][1]],tmp[1],tmp[0],[tmp[0][0]+tmp[2][0],tmp[0][1]+tmp[2][1]]]
	}
	
	if (NofTile == 5){
		tmp = [tmp[3],[-tmp[3][0],-tmp[3][1]],tmp[1],[-tmp[3][0]-tmp[2][0],-tmp[3][1]-tmp[2][1]]]
	} 
	
	if (NofTile == 6){
		tmp = [[-tmp[3][0],-tmp[3][1]],tmp[3],tmp[1],[tmp[3][0]+tmp[2][0],tmp[3][1]+tmp[2][1]]]
	}
	 
	for (var i = 0; i < 4; i++){
		tmp[i][0] += tile[1][0];
		tmp[i][1] += tile[1][1];
	}
	if (CheckP(tmp)){
		for (var i = 0; i < 4; i++){
			tile[i] = tmp[i].slice(0);
		}
	}	
}

var DropTile = function(){
	var tmp = new Array(4);
	for (var i = 0; i < 4; i++){
		tmp[i] = tile[i].slice(0);
	}
	var k = FieldH;
	
	for (var i = 0; i < 4; i++){
		j = 0;
		while (field[tmp[i][0]][tmp[i][1] + j] >= 0){
			j += 1;
		}
		if (j < k) { k = j; }
	}
	
	MoveTile([0, k -1]);
}

function doKeyDown(e) {
	if (gamePaused == true) {return;}
	var i = e.keyCode;
	//console.log(i);
	paint(0);
	if (i == 37){
		MoveTile([-1, 0]);
	}
	if (i == 39){
		MoveTile([1, 0]);
	}
	if (i == 38){
		RotateTile();
	}
	if (i == 40){
		DropTile();
	}
	paint(NofTile + 1);
	clear(ctx);
	Draw();
}

var update = function(){
	ctxv.fillStyle = '#000000';
	ctxv.font = 'bold 20px sans-serif';
	ctxv.textBaseline = 'bottom';
	a = 'Lines ';
	b = 'Tiles ';
	ctxv.fillText(a.concat(linesDeleted.toString()), 30, 40);
	ctxv.fillText(b.concat(tilesReceived.toString()), 30, 80);
}

function DrawNextTile(){
	for (i = 0; i < 4; i++){
		DrCircle(tiles[newNofTile][i][0] * 2 * radius - 35, 120 + tiles[newNofTile][i][1] * 2 * radius, images[newNofTile],ctxv);
	}
}

var GameLoop = function(){
	clear(ctx);
	UpdateField();
	Draw();
	clear(ctxv);
	update();
	DrawNextTile();

	gLoop = setTimeout(GameLoop, 1000 / 4);
}

paint(NofTile + 1);
window.addEventListener( "keydown", doKeyDown, true);

GameLoop();