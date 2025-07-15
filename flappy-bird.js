const canvas = document.getElementById("game-canvas")
const ctx = canvas.getContext("2d");

const bgImg = new Image();
bgImg.src = "images/bg-3.png"

const birdImg = new Image();
birdImg.src = "images/bird-2.png"

bgImg.onload = () => {
  birdImg.onload = () => {
    draw(); // start once both are loaded
  };
};

let score = 0
let velocity = 0
let gravity = 0.05
let flapStrength = -2.5

let birdX = 200;
let birdY = 100;
const birdWidth = 50;
const birdHeight = 40;

const pipeGap = 100;
const pipeWidth = 80;

let pipes = [
  {
    pipeX: canvas.width,
    pipeY: Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50,
    passed: false,
    spawn: false
  }
];

function draw() {
  // Clear canvas each frame
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

  ctx.drawImage(birdImg, birdX, birdY, birdWidth, birdHeight);

  ctx.fillStyle = "white";
  ctx.font = "36px Georgia";
  ctx.fillText("Score: " + score, 20, 50);

  // Render the pipes 
  pipes.forEach((pipe) => {
    ctx.fillStyle = "purple";
    ctx.fillRect(pipe.pipeX, 0, pipeWidth, pipe.pipeY); // top
    ctx.fillRect(pipe.pipeX, pipe.pipeY + pipeGap, pipeWidth, canvas.height - (pipe.pipeY + pipeGap)) // bottom
    pipe.pipeX -= 2 ; // move the pipes left
  })

  if (pipes[pipes.length - 1].pipeX < 400 && !pipes.spawn) {
    pipes.push({
      pipeX: canvas.width,
      pipeY: Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50,
      passed: false,
      spawn: false
    })
  }

  // score detection
   if (!pipes[0].passed && birdX > pipes[0].pipeX + pipeWidth) {
    score ++
    pipes[0].passed = true
  }

  velocity += gravity
  birdY += velocity

  // delete the pipe when it is out of frame
  if ((pipes[0].pipeX + pipeWidth) < 0) {pipes.splice(0, 1)}  

  // Keeping the bird from leaving the canvas
  if (birdY < 0) {
    birdY = 0;
    velocity = 0; 
  }

  const groundY = canvas.height - birdHeight
  if (birdY > groundY) {
    alert('Game Over!')
    resetGame();
  }

  collisionDetection()

  requestAnimationFrame(draw);           
}

draw();

function collisionDetection() {
  pipes.forEach ((pipe) => {

  const birdRight = birdX + birdWidth  
  const birdBottom = birdY + birdHeight 
  const withinPipeX = birdRight > pipe.pipeX && birdX < pipe.pipeX + pipeWidth;

  const hitTopPipe = birdY < pipe.pipeY 
  const hitBottomPipe = birdBottom > pipeGap + pipe.pipeY

  if (withinPipeX && (hitTopPipe || hitBottomPipe)) {
    alert("Game Over!");
    resetGame()
  }
})}; 

function resetGame() {
    score = 0;
    birdY = 100;
    velocity = 0;
    pipes.splice(0, (pipes.length));
    pipes.push({
      pipeX: canvas.width,
      pipeY: Math.floor(Math.random() * (canvas.height - pipeGap - 100)) + 50,
      passed: false
    })
}

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space')  {
    velocity = flapStrength    
  }
})

canvas.addEventListener('mousedown', () => {
  velocity = flapStrength
})
