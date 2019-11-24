import RotateAnimator from "./RotateAnimator.js";
import FadeOutAnimator from "./FadeOutAnimator.js";
import RotateOutAnimator from "./RotateOutAnimator.js";
import RotateInAnimator from "./RotateInAnimator.js";


/**
 * This class is to register animation for game objects
 * in order to seperate animation and the game logic.
 */
export default class AnimatorController {
    constructor() {}

    static getAnimator(animation) {
        return {
            "Rotate": RotateAnimator,
            "FadeOut": FadeOutAnimator,
            "RotateOut": RotateOutAnimator,
            "RotateIn": RotateInAnimator,
        }[animation];
    }

    static registerAnimator(target, animation) {
        target.animator = new (AnimatorController.getAnimator(animation))(target);
    }
}