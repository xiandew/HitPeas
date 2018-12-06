import GameInfo, {
        BALL_SIZE,
        SHOOTER_SPEED
} from './runtime/gameInfo';
import Sprite from './sprite';
import Hole from './hole';

/*----------------------------------------------------------------------------*/

import IMPACT_BLACK_JSON from '../fonts/impact_black';
import BitmapFont from "./utilities/bitmapFont";
import BitmapText from "./utilities/bitmapText";
let impact_black = new BitmapFont();
let fontLoaded = false;
let txt;
impact_black.loadFont(IMPACT_BLACK_JSON, function() {
        fontLoaded = true;
        txt = new BitmapText(impact_black);
});

/*----------------------------------------------------------------------------*/

let gameInfo = new GameInfo();
let ctx = canvas.getContext('2d');
let optimalBall = require("./utilities/optimalBall");

/*----------------------------------------------------------------------------*/

let acc = 0;

export default class Ball extends Sprite {
        constructor(hole = {}, ballSrc = false) {
                if (!ballSrc) {
                        ballSrc = optimalBall();
                }
                super(ballSrc, BALL_SIZE, BALL_SIZE, hole.x, hole.y, true);

                this.layer = hole.layer;
                this.visited = false;
        }

        rotate(angle) {
                if (typeof(this.dropping) != "undefined") {
                        return;
                }

                let toCentY = this.y - canvas.height / 2;
                let toCentX = this.x - canvas.width / 2;

                let radius = Math.sqrt(toCentX ** 2 + toCentY ** 2);
                this.x = canvas.width / 2 + (Math.cos(Math.atan2(toCentY, toCentX) - angle) * radius);
                this.y = canvas.height / 2 + (Math.sin(Math.atan2(toCentY, toCentX) - angle) * radius);

                if (((this.x + this.width / 2) >= canvas.width ||
                                (this.x - this.width / 2) <= 0 ||
                                (this.y + this.height / 2) >= canvas.height ||
                                (this.y - this.height / 2) <= 0)) {
                        gameInfo.over = true;
                }
        }

        render() {
                if (this.dropping) {

                        this.speedX *= 0.998;
                        this.speedY += 0.98;

                        this.y += this.speedY;
                        this.x += this.speedX;

                        if (this.y > canvas.height + BALL_SIZE) {
                                this.dropping = false;
                                gameInfo.score += (gameInfo.level + 1);
                        }
                }
                this.renderScore();
                super.render();
        }

        renderScore() {
                if (this.dropping == undefined) {
                        return;
                }
                if (this.y > canvas.height - 5 * this.width && !this.scoreX && !this.scoreY) {
                        this.scoreX = this.x;
                        this.scoreY = this.y;
                }

                if (fontLoaded) {
                        txt.fontSize = 0.075 * canvas.width;
                        txt.textAlign = "center";
                        txt.draw(
                                ctx,
                                `+${gameInfo.getEachWorth()}`,
                                this.scoreX,
                                this.scoreY
                        );
                }
        }

        initDropping(shooter) {
                gameInfo.holes.push(new Hole(this.x, this.y, this.layer));

                // place each hole in the same order as before for optimising the distribution
                // of the spiral when restarting
                swap(gameInfo.holes, gameInfo.holes.indexOf(this), gameInfo.holes.length - 1);

                this.dropping = true;

                // angle between the horizontal and velocity
                let va = Math.atan2(shooter.speedY, shooter.speedX);
                // angle between the horizontal and the joint line from the ball to shooter
                let ha = Math.atan2(this.y - shooter.y, this.x - shooter.x);
                // difference between two angles
                let da = va - ha;

                let theSpeed = SHOOTER_SPEED * Math.cos(da) / 2;

                this.speedX = theSpeed * Math.cos(ha);
                this.speedY = theSpeed * Math.sin(ha);
        }

        // draw a circle shape instead of image. Not display well on the phone
        // render(ctx) {
        //         if (!this.visible) {
        //                 return
        //         }

        //         ctx.beginPath()
        //         ctx.fillStyle = this.colour
        //         ctx.arc(this.x, this.y, this.width / 2, 0, 2 * Math.PI)
        //         ctx.fill()
        //         ctx.closePath()

        //         ctx.beginPath()
        //         ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        //         ctx.arc(this.x - this.width / 6, this.y + this.width / 6, this.width / 6, 0, 2 * Math.PI)
        //         ctx.fill()
        //         ctx.closePath()
        // }
}

function swap(arr, i, j) {
        arr[i] = arr.splice(j, 1, arr[i])[0];
}