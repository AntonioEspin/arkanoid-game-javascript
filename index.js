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

function drawBall () {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#fff'
  ctx.fill()
  ctx.closePath()
}
function drawPaddle () {}
function drawBricks () {}

function collisionDetection () {}
function ballMovement () {
  // Rebotar la pelota en las paredes de los lados izquierdo o derecho
  if(
    x + dx > canvas.width - ballRadius || // pared derecha
    x + dx < ballRadius //pared izquierda
    ) {
    dx = -dx
  }
  x += dx
  y += dy
}
function paddleMovement () {}

function cleanCanvas () {
  ctx.clearRect(0,0,canvas.width, canvas.height)
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
  window.requestAnimationFrame(draw)
}

draw()
