import { JetLagManager } from "../JetLagManager"
import { ParallaxLayer } from "../renderables/ParallaxLayer"
import { Renderer, Camera } from "../device/Renderer"

/**
 * ParallaxScenes present a set of images that seem to scroll relative to the 
 * position of the actor on whom the camera is centered.
 * 
 * The speeds of layers are a very important concept.
 * - 1 means "moves at same speed as hero", which means "fixed position"
 * - 0 means "doesn't move", which means "looks like a tiled background"
 * - in-between should be interesting
 */
export class ParallaxScene {
    /** The game-wide configuration object */
    manager: JetLagManager;

    /** All the layers to show as part of this scene */
    mLayers: ParallaxLayer[] = [];

    /**
     * Create a ParallaxScene and configure its camera
     *
     * @param config The game-wide configuration object
     */
    constructor(manager: JetLagManager) {
        this.manager = manager;
    }

    /**
     * Render all of the layers of this parallax scene
     *
     * @param worldCamera The camera for the world that these layers accompany
     * @param sb          The SpriteBatch to use while rendering
     * @param elapsed     The time since the last render
     */
    render(sb: Renderer, worldCamera: Camera, elapsed: number) {
        for (let pl of this.mLayers) {
            if (pl.isAuto) {
                this.renderAuto(sb, pl, elapsed, worldCamera);
            } else {
                this.renderRelative(sb, worldCamera, pl);
            }
        }
    }

    /**
     * Draw a layer that moves in a fixed velocity in the X dimension
     *
     * @param sb      The SpriteBatch to use when drawing this layer
     * @param pl      The layer to draw
     * @param elapsed The elapsed time since we last drew this layer
     */
    private renderAuto(sb: Renderer, pl: ParallaxLayer, elapsed: number, worldCamera: Camera) {
        // Determine the position of a reference tile of the image
        if (pl.isHoriz) {
            pl.lastX += pl.scrollSpeed * elapsed;
        }
        else {
            pl.lastY += pl.scrollSpeed * elapsed;
        }
        this.normalizeAndRender(pl, sb, worldCamera);
    }

    /**
     * This is how we actually figure out where to draw the background
     */
    private normalizeAndRender(pl: ParallaxLayer, sb: Renderer, worldCamera: Camera) {
        let x = worldCamera.getOffsetX(); // left of viewport
        let y = worldCamera.getOffsetY(); // top of viewport
        let camW = this.manager.config.screenWidth / this.manager.config.pixelMeterRatio;
        let camH = this.manager.config.screenHeight / this.manager.config.pixelMeterRatio;
        // Normalize the reference tile
        if (pl.isHoriz) {
            while (pl.lastX > x + camW)
                pl.lastX -= pl.width;
            while (pl.lastX + pl.width < x)
                pl.lastX += pl.width;
            while (pl.lastX > x)
                pl.lastX -= pl.width;
        }
        else {
            while (pl.lastY > y + camH)
                pl.lastY -= pl.height;
            while (pl.lastY + pl.height < y)
                pl.lastY += pl.height;
            while (pl.lastY > y)
                pl.lastY -= pl.height;
        }
        // save camera for next render
        pl.lastCamX = x;
        pl.lastCamY = y;
        this.renderVisibleTiles(sb, pl, worldCamera);
    }

    /**
     * Draw a layer that moves in relation to the camera center point
     * 
     * NB: the efficiency of this code derives from the assumption that the
     *     camera does not move suddenly
     *
     * @param sb The SpriteBatch to use when drawing this layer
     * @param pl The layer to draw
     */
    private renderRelative(sb: Renderer, worldCamera: Camera, pl: ParallaxLayer) {
        // Determine the change in camera
        let x = worldCamera.getOffsetX(); // left of viewport
        let y = worldCamera.getOffsetY(); // top of viewport
        let dx = x - pl.lastCamX;
        let dy = y - pl.lastCamY;
        // Determine the relative change to the reference tile
        if (pl.isHoriz) {
            pl.lastX = pl.lastX + dx * pl.scrollSpeed;
        }
        else {
            pl.lastY = pl.lastY + dy * pl.scrollSpeed;
        }
        this.normalizeAndRender(pl, sb, worldCamera);
    }

    /**
     * Given the x,y coordinates of a reference tile, render the tiles of a layer that are visible
     *
     * @param sb The SpriteBatch to use when drawing this layer
     * @param pl The layer to draw
     * @param x  the X coordinate of a reference tile of the layer
     * @param y  the Y coordinate of a reference tile of the layer
     */
    private renderVisibleTiles(sb: Renderer, pl: ParallaxLayer, worldCamera: Camera) {
        let x = worldCamera.getOffsetX(); // left of viewport
        let y = worldCamera.getOffsetY(); // top of viewport
        let camW = this.manager.config.screenWidth / this.manager.config.pixelMeterRatio;
        let camH = this.manager.config.screenHeight / this.manager.config.pixelMeterRatio;
        if (pl.isHoriz) {
            let i = 0;
            let plx = pl.lastX;
            while (plx < x + camW) {
                pl.images[i].sprite.position.x = plx;
                pl.images[i].sprite.position.y = pl.lastY;
                pl.images[i].sprite.height = pl.height;
                pl.images[i].sprite.width = pl.width;
                sb.addPictureToFrame(pl.images[i], worldCamera);
                plx += pl.width;
                i++;
            }
        }
        else {
            let i = 0;
            let ply = pl.lastY;
            while (ply < y + camH) {
                pl.images[i].sprite.position.x = pl.lastX;
                pl.images[i].sprite.position.y = ply;
                pl.images[i].sprite.height = pl.height;
                pl.images[i].sprite.width = pl.width;
                sb.addPictureToFrame(pl.images[i], worldCamera);
                ply += pl.height;
                i++;
            }
        }
    }
}