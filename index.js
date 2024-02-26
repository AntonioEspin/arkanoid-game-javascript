const sprite = document.querySelector('#sprite')
const bricks = document.querySelector('#bricks')

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

canvas.width = 448
canvas.height = 400

// variables de la pelota
const ballRadius = 4
// posicion de la pelota
let x = canvas.width / 2
let y = canvas.height -30
// velocidad de la pelota
let dx = 2
let dy = -2

let gameRunning = true

// variables de la paleta
const paddleHeigth = 10
const paddleWidth = 50

// posicion de la paleta
let paddleX = (canvas.width - paddleWidth) / 2
let paddleY = canvas.height - paddleHeigth - 10

let rightPressed = false
let leftPressed = false

// Variables de los bricks
const brickRowCount = 6
const brickColumnCount = 13
const brickWidth = 30
const brickHeight = 14
const brickPadding = 2
const brickOffsetTop = 80
const brickOffSetLeft = 15
const allBricks = []

const BRICKS_STATUS = {
  ACTIVE: 1,
  DESTROYED: 0
}

for (let c = 0; c < brickColumnCount; c++) {
  allBricks[c] = []
  for (let r = 0; r < brickRowCount; r++) {
    // calculamos la posicion del ladrillo
    const brickX = c * (brickWidth + brickPadding) + brickOffSetLeft
    const brickY = r * (brickHeight + brickPadding) + brickOffsetTop
    // asignar un color aleatorio al ladrillo
    const random = Math.floor(Math.random()*8)
    // guardamos la informacion de cada ladrillo
    allBricks[c][r] = {
      x:brickX, y: brickY, status: BRICKS_STATUS.ACTIVE, color: random
    }
  }
}

function drawBall () {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#fff'
  ctx.fill()
  ctx.closePath()
}
function drawPaddle () {
  // ctx.fillStyle = 'red'
  // ctx.fillRect(
  //   paddleX,
  //   paddleY,
  //   paddleWidth,
  //   paddleHeigth
  // )

  ctx.drawImage(
    sprite, //imagen
    29, // clipX: coordenadas de recorte
    174, // clipY: coordenadas de recorte
    paddleWidth, // el tamaño del recorte
    paddleHeigth, // el tamaño del recorte
    paddleX, // posicion X del dibujo
    paddleY, // posicion y del dibujo
    paddleWidth, // ancho del dibujo
    paddleHeigth // alto del dibujo
  )
}
function drawBricks () {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = allBricks[c][r]
      if(currentBrick.status === BRICKS_STATUS.DESTROYED)
      continue;

      const clipX = currentBrick.color *32

      ctx.drawImage(
        bricks,
        clipX,
        0,
        31,
        14,
        currentBrick.x,
        currentBrick.y,
        brickWidth,
        brickHeight
      )
      }
  }
}

function collisionDetection () {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const currentBrick = allBricks[c][r]
      if(currentBrick.status === BRICKS_STATUS.DESTROYED)
      continue;

      const isBallSameXAsBrick = x > currentBrick.x && x < currentBrick.x + brickWidth
      const isBallSameYAsBrick = y > currentBrick.y && y < currentBrick.y + brickHeight

      if (isBallSameXAsBrick && isBallSameYAsBrick) {
        dy = -dy
        currentBrick.status = BRICKS_STATUS.DESTROYED
      }
    }
  }
}

function ballMovement () {

  // Pelota toca el paddle
  const isBallSameXAsPaddle = x > paddleX && x < paddleX + paddleWidth
  const isBallSameYAsPaddle = y + dy > paddleY

  if (isBallSameXAsPaddle && isBallSameYAsPaddle) {
    dy = -dy
  }else if( // Rebotar la pelota en las paredes de los lados izquierdo o derecho
    x + dx > canvas.width - ballRadius || // pared derecha
    x + dx < ballRadius //pared izquierda
    ) {
    dx = -dx
  }

  // Rebotar en la pared de arriba
  if(y + dy < ballRadius) {
    dy = -dy
  }

  // Pelota toca la parte inferior del juego
  if (y + dy > canvas.height - ballRadius) {
    console.log('Game Over')
    document.location.reload()
    // restartGame()
  }

  x += dx
  y += dy
}

function paddleMovement () {
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7
  }
}

function cleanCanvas () {
  ctx.clearRect(0,0,canvas.width, canvas.height)
}

// function restartGame() {
//   x = canvas.width / 2;
//   y = canvas.height - 30;
//   dx = 2;
//   dy = -2;
//   gameRunning = false; // Restablecer la bandera a true al reiniciar el juego
//   setTimeout(()=>{
//     gameRunning = true
//     draw()
//   },1000)
// }

function initEvents () {
  document.addEventListener('keydown', keyDownHandler)
  document.addEventListener('keyup', keyUpHandler)

  function keyDownHandler (event) {
    const {key} = event

    if(key === 'Right' || key === 'ArrowRight') {
      rightPressed = true
    } else if (key === 'Left' || key === 'ArrowLeft') {
      leftPressed = true
    }
  }

  function keyUpHandler (event) {
    const {key} = event

    if(key === 'Right' || key === 'ArrowRight') {
      rightPressed = false
    } else if (key === 'Left' || key === 'ArrowLeft') {
      leftPressed = false
    }
  }
}

function draw () {
  // Limpiar canvas
  cleanCanvas()
  // dibujar los elementos
  drawBall()
  drawPaddle()
  drawBricks()

  // colisiones y movimientos
  collisionDetection()
  ballMovement()
  paddleMovement()
  // if (gameRunning) {
    window.requestAnimationFrame(draw)
  // }
}

  draw()
  initEvents()
