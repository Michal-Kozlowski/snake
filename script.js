var sizeX = 25;
var sizeY = 17;
var headX;
var headY;
var direction = "right";
var lastMoveDirection = "right";
var length;
var interval = 75;
var gameIsOn = false;
var game;
var food = [0,0];
var superFood = [0,0];
var isFood = false;
var isSuperFood = false;
var area = sizeX * sizeY;

var table = document.querySelector("table");
var hello = document.querySelector("#hello");
var len = document.querySelector("#len");
var slow = document.querySelector("#slow");
var normal = document.querySelector("#normal");
var fast = document.querySelector("#fast");
var small = document.querySelector("#small");
var normalSize = document.querySelector("#normalSize");
var large = document.querySelector("#large");
var speedButtons = document.querySelectorAll("#speed button");
var sizeButtons = document.querySelectorAll("#size button");
var lenHidden = document.querySelector("#lenHidden");
var h3 = document.querySelector("h3");


// create map
function createMap(){
	for (var i = 0; i < sizeY; i++) {
		var row = table.insertRow();
		for (var j = 0; j < sizeX; j++) {
			row.insertCell();
		}
	}
}
createMap();

// initialize game
function init(){
	game = setInterval(move, interval);
	gameIsOn = true;
	hello.textContent = "snakes length: ";
	headX = (sizeX-1)/2 - 5;
	headY = (sizeY-1)/2;
	length = 3;	
	direction = "right";
	placeFood();	
	h3.classList.add("hidden");
	for (var i = 0; i < sizeY; i++) {
		for (var j = 0; j < sizeX; j++) {
			table.rows[i].cells[j].textContent = 0;				
			table.rows[i].cells[j].classList.remove("active");		
		}
	}
}

// choose direction (not backwards)
document.addEventListener("keydown", function(e){
	if((e.keyCode === 37 || e.keyCode === 65) && lastMoveDirection !== "right") {
		e.preventDefault();
		direction = "left";
	}
	else if((e.keyCode === 38 || e.keyCode === 87) && lastMoveDirection !== "down") {
		e.preventDefault();
		direction = "up";
	}	
	else if((e.keyCode === 39 || e.keyCode === 68) && lastMoveDirection !== "left") {
		e.preventDefault();
		direction = "right";
	}	
	else if((e.keyCode === 40 || e.keyCode === 83) && lastMoveDirection !== "up") {
		e.preventDefault();
		direction = "down";
	}
	if(e.keyCode === 32 && !gameIsOn) {
		init();
	}
});

// move
function move(){	
	placeFood();
	if(direction === "left") {
		headX--;
		lastMoveDirection = direction;
	}
	else if(direction === "up") {
		headY--;
		lastMoveDirection = direction;
	}	
	else if(direction === "right") {
		headX++;
		lastMoveDirection = direction;
	}	
	else if(direction === "down") {
		lastMoveDirection = direction;
		headY++;
	}
	eat();
	gameOverSelf();
	gameOverWall();
	table.rows[headY].cells[headX].classList.add("active");
	fade();
}

// tail fade
function fade(){
	table.rows[headY].cells[headX].textContent = length;
	for (var i = 0; i < sizeY; i++) {
		for (var j = 0; j < sizeX; j++) {
			if(table.rows[i].cells[j].textContent > "0"){
				table.rows[i].cells[j].textContent--;
			} else {
				table.rows[i].cells[j].classList.remove("active");
			}
		}
	}
}

// game over
function gameOver() {
	gameIsOn = false;
	clearInterval(game);		 
	hello.textContent = "press space to play with the snake";
	len.textContent = "";
	lenHidden.textContent = length + " (" + Math.floor(length/area*100) + "% of the board)";
	h3.classList.remove("hidden");
}

// gameover wall
function gameOverWall(){
	if(headX === 0 || headX === sizeX-1 || headY === 0 || headY === sizeY-1) {
		gameOver();
	}
}

// gameover self
function gameOverSelf(){
	if(table.rows[headY].cells[headX].classList.contains("active")) {
		gameOver();
	}
}
// create food
function createFood(){
	food[0] = Math.floor(Math.random() * (sizeX-2)) + 1;
	food[1] = Math.floor(Math.random() * (sizeY-2)) + 1;
	return food;
}

// place food
function placeFood(){
	createFood();
	if(!isSuperFood && !isFood && table.rows[food[1]].cells[food[0]].classList.contains("active")){
		while(table.rows[food[1]].cells[food[0]].classList.contains("active")){
			createFood();
		}
		table.rows[food[1]].cells[food[0]].classList.add("superfood");
		isSuperFood = true;
	}
	if(!isSuperFood && !isFood){
		table.rows[food[1]].cells[food[0]].classList.add("food");
		isFood = true;
	}
}

// eat
function eat(){
	if(table.rows[headY].cells[headX].classList.contains("food")) {
		length++;
		table.rows[headY].cells[headX].classList.remove("food");
		isFood = false;
	}
	else if(table.rows[headY].cells[headX].classList.contains("superfood")) {
		length += 5;
		table.rows[headY].cells[headX].classList.remove("superfood");
		isSuperFood = false;
	}
	len.textContent = length;
}

//  speed
function speed(){
	for (var i = 0; i < speedButtons.length; i++) {
		speedButtons[i].classList.remove("set");
	}
}

slow.addEventListener("click", function(){
	interval = 160;
	speed();
	this.classList.add("set");
});

normal.addEventListener("click", function(){
	interval = 80;
	speed();
	this.classList.add("set");
});

fast.addEventListener("click", function(){
	interval = 40;
	speed();
	this.classList.add("set");
});

// map size
function size(){
	for (var i = 0; i < sizeButtons.length; i++) {
		sizeButtons[i].classList.remove("set");
	}
}

// new map
function newMap(x,y){
	for (var i = 0; i < sizeY; i++) {
		table.deleteRow(0);
	}
	isFood = false;
	isSuperFood = false;
	sizeX = x;
	sizeY = y;
	createMap();
	area = sizeX * sizeY;
}

small.addEventListener("click", function(){
	if(!gameIsOn){
		size();
		this.classList.add("set");
		newMap(17,15);	
	}
});

normalSize.addEventListener("click", function(){
	if(!gameIsOn){
		size();
		this.classList.add("set");
		newMap(25,19);
	}
});

large.addEventListener("click", function(){
	if(!gameIsOn){
		size();
		this.classList.add("set");
		newMap(41,25);
	}
});