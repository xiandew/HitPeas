import Sprite from './sprite'
import GameInfo from './runtime/gameInfo'

// export const COLOURS = ['#1da2da', '#014765', '#01986a', '#d392ba', '#b14701', '#ecd613']
export const BALLS =
	['images/b_blue.png', 'images/b_cyan.png', 'images/b_green.png',
	'images/b_pink.png', 'images/b_red.png', 'images/b_yellow.png']

let gameInfo = new GameInfo()
// adjust the ball size according to the screen width.
// diameterSpiral = 0.75 * screenWidth with layer = 5.5
// where 5.5 is a magic number which I think gives the best view on the screen
export const BALL_SIZE = 0.75 * canvas.width / (1 + 5.5 * 4 / Math.sqrt(3))

export default class Ball extends Sprite {
	constructor(x, y, layer, visible) {
		super(BALLS[Math.floor(Math.random() * BALLS.length)], BALL_SIZE, BALL_SIZE, x, y, visible)

		this.layer = layer
		this.visited = false
	}

	// draw a circle shape instead of image. Not display well on the phone
        /*render(ctx) {
                if (!this.visible) {
                        return
                }

                ctx.beginPath()
                ctx.fillStyle = this.colour
                ctx.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI)
                ctx.fill()
                ctx.closePath()

                ctx.beginPath()
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
                ctx.arc(this.x - this.width / 6, this.y + this.width / 6, this.width / 6, 0, 2 * Math.PI)
                ctx.fill()
                ctx.closePath()
        }*/

	update() {

	}

	rotate(angle) {
		let toCentY = this.y - canvas.height / 2
		let toCentX = this.x - canvas.width / 2

		let radius = Math.sqrt(toCentX ** 2 + toCentY ** 2)
		this.x = canvas.width / 2 + (Math.cos(Math.atan2(toCentY, toCentX) - angle) * radius)
		this.y = canvas.height / 2 + (Math.sin(Math.atan2(toCentY, toCentX) - angle) * radius)

		if (this.visible) {
			if((this.x + this.width / 2) >= canvas.width || (this.x - this.width / 2) <= 0 ||
				(this.y + this.height / 2) >= canvas.height || (this.y - this.height / 2) <= 0){
				gameInfo.over = true
			}
		}
	}

	// TODO an out screen animation
}