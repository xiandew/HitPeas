import DataStore from "../data/DataStore.js";
import Sprite from "../base/Sprite.js";
import RendererManager from "../renderer/RendererManager.js";
import TouchHandler from "../utils/TouchHandler.js";
import Scene from "./Scene.js";


export default class MainMenu extends Scene {
    constructor() {
        super();

        DataStore.currentScene = this.toString();

        this.branding = new Sprite(
            DataStore.assets.get("branding"),
            0.5 * DataStore.screenWidth,
            0.2 * DataStore.screenHeight,
            0.6 * DataStore.screenWidth
        );

        this.logo = new Sprite(
            DataStore.assets.get("logo"),
            0.5 * DataStore.screenWidth,
            0.5 * DataStore.screenHeight,
            0.175 * DataStore.screenWidth,
        );

        const navLogoSize = 0.15 * DataStore.screenWidth;
        const navLogoSep = 2 * navLogoSize;
        this.navLogos = [{
            logo: "whirlychicken-logo",
            appId: "wxbbe6dad294fc15cc"
        }].map((e, i, t) => {
            e.logo = new Sprite(
                DataStore.assets.get(e.logo),
                navLogoSize * 0.75,
                0.5 * DataStore.screenHeight + (i - t.length / 2 + 0.5) * navLogoSep,
                navLogoSize
            );
            return e;
        });

        let mask = wx.createCanvas();
        let maskCtx = mask.getContext("2d");
        maskCtx.fillStyle = "rgba(117, 119, 126, 0.8)";
        maskCtx.fillRect(0, 0, mask.width, mask.height);
        this.mask = new Sprite(
            mask,
            0.5 * DataStore.screenWidth,
            0.5 * DataStore.screenHeight,
            DataStore.screenWidth,
            DataStore.screenHeight
        );

        this.startBtn = new Sprite(
            DataStore.assets.get("start-btn"),
            0.5 * DataStore.screenWidth,
            0.8 * DataStore.screenHeight,
            0.45 * DataStore.screenWidth
        );

        this.rankBtn = new Sprite(
            DataStore.assets.get("rank-btn"),
            0.5 * DataStore.screenWidth,
            0.92 * DataStore.screenHeight,
            0.08 * DataStore.screenWidth
        );

        this.touchHandler = new TouchHandler();
        this.touchHandler.onTouchEnd((e) => {
            if (DataStore.currentScene !== this.toString()) {
                return;
            }

            this.navLogos.forEach(({ logo, appId }) => {
                if (logo.isTouched(e)) {
                    wx.navigateToMiniProgram({
                        appId: appId,
                        fail: () => { },
                        cancel: () => { }
                    });
                }
            });

            if (this.startBtn.isTouched(e)) {
                this.touchHandler.destroy();
                this.navLogos.forEach(({ logo }) => this.rendererManager.remove(logo));
                this.rendererManager.remove(this.branding);
                this.rendererManager.remove(this.startBtn);
                this.rendererManager.remove(this.rankBtn);
                this.rendererManager.setRenderer(this.logo, "RotateOut");
                this.rendererManager.setRenderer(this.mask, "FadeOut");
                DataStore.lastScene = this.toString();
                DataStore.currentScene = DataStore.MainScene.toString();
            }

            if (this.rankBtn.isTouched(e)) {
                DataStore.openDataContext.postMessage({
                    action: "RankScene"
                });
                DataStore.lastScene = this.toString();
                DataStore.currentScene = DataStore.RankScene.toString();
            }
        });

        this.rendererManager = new RendererManager();
        this.rendererManager.setRenderer(this.logo, "Rotate");
        this.rendererManager.setRenderer(this.mask);
        this.rendererManager.setRenderer(this.branding);
        this.navLogos.forEach(({ logo }) => this.rendererManager.setRenderer(logo));
        this.rendererManager.setRenderer(this.startBtn);
        this.rendererManager.setRenderer(this.rankBtn);
    }

    render() {
        super.render();

        // Render the rank scene
        if (DataStore.currentScene === DataStore.RankScene.toString()) {
            return DataStore.RankScene.render();
        }

        // Render this scene
        this.rendererManager.render(this.ctx);

        // Exited
        if (this.mask.fadedOut && this.logo.rotatedOut) {
            cancelAnimationFrame(this.frameID);
            DataStore.MainScene.run();
        }
    }

    // loop all the frames
    run() {
        this.frameID = requestAnimationFrame(this.run.bind(this));
        this.update();
        this.render();
    }

    toString() {
        return "MainMenu";
    }

    static getInstance() {
        if (!MainMenu.instance) {
            MainMenu.instance = new MainMenu();
        }
        return MainMenu.instance;
    }
}