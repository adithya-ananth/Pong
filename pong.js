let canvas;
let canvasContext;
		
let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 4;
		
let player1Score = 0;
let player2Score = 0;
const winningScore = 5;
		
let showWinScreen = false;
		
let paddle1Y = 250;
let paddle2Y = 250;
const paddleHeight = 100;
const paddleThickness = 10;
		
function calculateMousePos(evt) {
	let rect = canvas.getBoundingClientRect();
	let root = document.documentElement;
	let mouseX = evt.clientX - rect.left - root.scrollLeft;
	let mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}
		
function handleMouseClick(evt) {
	if (showWinScreen) {
		player1Score = 0;
		player2Score = 0;
		showWinScreen = false;
	}
}
		
window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
			
	let fps = 45;
	setInterval(function() {
		moveEverything();
		drawEverything();
	}, 1000/fps);
			
	canvas.addEventListener('mousedown', handleMouseClick);
			
	canvas.addEventListener('mousemove',
		function(evt) {
			let mousePos = calculateMousePos(evt);
			paddle1Y = mousePos.y-(paddleHeight/2);
		});
}
		
function ballReset() {
	if (player1Score >= winningScore || player2Score >= winningScore) {
		showWinScreen = true;
	}
		
	ballSpeedX = -ballSpeedX;
	ballX = canvas.width/2;
	ballY = canvas.height/2;
}
		
function computerMovement() {
	let paddle2YCenter = paddle2Y + (paddleHeight/2);
		
	if (paddle2YCenter < ballY-35) {
		paddle2Y += 6;
	} else if (paddle2YCenter > ballY+35) {
		paddle2Y -= 6;
	}
}
		
function moveEverything() {
	if (showWinScreen == true) {
		return;
	}
		
	computerMovement();
		
	ballX += ballSpeedX;
	ballY += ballSpeedY;
			
	if (ballX < 0) {
		if(ballY > paddle1Y && ballY < paddle1Y+paddleHeight) {
			ballSpeedX = -ballSpeedX;
			let deltaY = ballY - (paddle1Y + paddleHeight/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player2Score++; // must be before ballReset()
			ballReset();
		}
	}
			
	if (ballX > canvas.width) {
		if(ballY > paddle2Y && ballY < paddle2Y+paddleHeight) {
			ballSpeedX = -ballSpeedX;
			let deltaY = ballY - (paddle2Y + paddleHeight/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player1Score++; // must be before ballReset()
			ballReset();					
		}
	}
			
	if (ballY < 0) {
		ballSpeedY = -ballSpeedY;
	}
			
	if (ballY > canvas.height) {
		ballSpeedY = -ballSpeedY;
	}
}
		
function drawNet() {
	for (i=0; i<canvas.height; i+=40) {
		colorRect(canvas.width/2-1, i, 2, 20, 'white');
	}
}
		
function drawEverything() {

	// blanks out the screen with black
	colorRect(0, 0, canvas.width, canvas.height, 'black');
			
	if (showWinScreen) {
		canvasContext.fillStyle = 'white';
				
		if (player1Score >= winningScore) {
			canvasContext.fillText("You Won! " + player1Score + "-" + player2Score, 350, 200);
		} else if (player2Score >= winningScore) {
			canvasContext.fillText("Computer Won! " + player1Score + "-" + player2Score, 350, 200);
		}
				
		canvasContext.fillText("Click to Continue", 350, 500);
		return;
	}
			
	drawNet();
			 
	// left player paddle
	colorRect(0, paddle1Y, 10, paddleHeight, 'white');
			
	// right player paddle
	colorRect(canvas.width-paddleThickness, paddle2Y, 10, paddleHeight, 'white');
			
	// draws the ball
	colorCircle(ballX, ballY, 10, 'white');
			
	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width-100, 100);
}
		
function colorCircle(centerX, centerY, radius, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
	canvasContext.fill();
}
		
function colorRect(leftX, topY, width, height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}
