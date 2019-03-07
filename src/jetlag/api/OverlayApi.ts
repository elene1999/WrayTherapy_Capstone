import { OverlayScene } from "../internal/scene/OverlayScene"
import { WorldActor } from "../actor/WorldActor"
import { TimedEvent } from "../internal/support/TimedEvent"
import { Renderable } from "../internal/support/Interfaces"
import { Hero } from "../actor/Hero"
import { Path } from "../support/Path";
import { BaseActor } from "../actor/BaseActor";
import { JetLagStage } from "../internal/JetLagStage";
import { XY } from "../internal/support/XY";
import { ImageConfig } from "./ImageConfig";
import { checkImageConfig } from "../internal/support/Functions";
import { TextConfig } from "./TextConfig";
import { PhysicsType2d } from "../internal/support/XY";

/**
 * OverlayApi provides a way of drawing to the simple screens of a game: the
 * HUD, the win and lose screens, the pause screen, and the welcome screen.
 */
export class OverlayApi {
    /** keep track of the "active" actor, if any */
    private activeActor: WorldActor = null;

    /**
     * Construct the Overlay API
     *
     * @param stage   The JetLagStage, for interacting with a level
     * @param overlay The overlay screen (hud, welcome, etc)
     */
    constructor(private stage: JetLagStage, private overlay: OverlayScene) { }

    /** Return the current "active" actor, if any */
    public getActiveActor() { return this.activeActor; }

    /**
     * Set the current "active" actor
     * 
     * @param actor The actor to treat as "active"
     */
    public setActiveActor(actor: WorldActor) { this.activeActor = actor; }

    /**
     * Convert coordinates on the overlay to coordinates in the world
     * 
     * @param x The x coordinate, in meters, on the overlay
     * @param y The y coordinate, in meters, on the overlay
     * 
     * @returns a pair {x,y} that represents the world coordinates, in meters
     */
    public overlayToWorldCoords(x: number, y: number) {
        let pixels1 = this.overlay.getCamera().metersToScreen(x, y);
        let pixels2 = this.stage.getWorld().getCamera().screenToMeters(pixels1.x, pixels1.y);
        return pixels2;
    }

    /**
     * Add a button that performs an action when clicked.
     *
     * @param cfg    An ImageConfig object, which will specify how to draw the
     *               button
     * @param action The action to run in response to a tap
     */
    public addTapControl(cfg: ImageConfig, action: (hudX: number, hudY: number) => boolean) {
        checkImageConfig(cfg);
        let c = new BaseActor(this.overlay, this.stage.device, cfg.img, cfg.width, cfg.height, cfg.z);
        c.setBoxPhysics(PhysicsType2d.Dynamics.BodyType.STATIC, cfg.x, cfg.y);
        c.setTapHandler(action);
        this.overlay.addActor(c, cfg.z);
        return c;
    }

    /**
     * Add a control that runs custom code when depressed, on any finger
     * movement, and when released
     * 
     * @param cfg      An ImageConfig object, which will specify how to draw the
     *                 pan control
     * @param panStart The action to perform when the pan event starts
     * @param panMove  The action to perform when the finger moves
     * @param panStop  The action to perform when the pan event stops
     */
    public addPanCallbackControl(cfg: ImageConfig, panStart: (hudX: number, hudY: number) => boolean, panMove: (hudX: number, hudY: number) => boolean, panStop: (hudX: number, hudY: number) => boolean) {
        let c = new BaseActor(this.overlay, this.stage.device, cfg.img, cfg.width, cfg.height, 0);
        c.setBoxPhysics(PhysicsType2d.Dynamics.BodyType.STATIC, cfg.x, cfg.y);
        c.setPanStartHandler(panStart);
        c.setPanMoveHandler(panMove);
        c.setPanStopHandler(panStop);
        this.overlay.addActor(c, 0);
        return c;
    }

    /**
     * Create a region on screen, such that any Actor inside of that region that
     * has been marked draggable can be dragged anywhere within that region.
     * 
     * @param cfg      An ImageConfig object, which will specify how to draw the
     *                 drag zone
     */
    public createDragZone(cfg: ImageConfig) {
        let foundActor: WorldActor = null;
        // pan start behavior is to update foundActor if there is an actor where
        // the touch began
        let panstart = (hudX: number, hudY: number) => {
            // Need to turn the meters of the hud into screen pixels, so that
            // world can convert to its meters
            let pixels = this.overlay.getCamera().metersToScreen(hudX, hudY);
            // If worldactor with draggable, we're good
            let actor = this.stage.getWorld().actorAt(pixels.x, pixels.y);
            if (actor == null)
                return false;
            if (!(actor instanceof WorldActor))
                return false;
            if (!actor.getDraggable())
                return false;
            foundActor = actor;
            return true;
        }
        // pan move behavior is to change the actor position based on the new
        // coord
        let panmove = (hudX: number, hudY: number) => {
            // need an actor, and need coords in pixels
            if (foundActor == null)
                return false;
            let pixels = this.overlay.getCamera().metersToScreen(hudX, hudY);
            let meters = this.stage.getWorld().getCamera().screenToMeters(pixels.x, pixels.y);
            foundActor.setPosition(meters.x - foundActor.getWidth() / 2, meters.y - foundActor.getHeight() / 2);
            return true;
        }
        // pan stop behavior is to stop tracking this actor
        let panstop = (hudX: number, hudY: number) => {
            foundActor = null; return false;
        }
        this.addPanCallbackControl(cfg, panstart, panmove, panstop);
    }

    /**
     * Create a region on screen that is able to receive swipe gestures
     * 
     * @param cfg      An ImageConfig object, which will specify how to draw the
     *                 swipe region
     */
    public createSwipeZone(cfg: ImageConfig) {
        let c = new BaseActor(this.overlay, this.stage.device, cfg.img, cfg.width, cfg.height, 0);
        c.setBoxPhysics(PhysicsType2d.Dynamics.BodyType.STATIC, cfg.x, cfg.y);
        this.overlay.addActor(c, 0);
        c.setSwipeHandler((hudX0: number, hudY0: number, hudX1: number, hudY1: number, time: number) => {
            // Need to turn the meters of the hud into screen pixels, so that world can convert to its meters
            let pixels = this.overlay.getCamera().metersToScreen(hudX0, hudY0);
            // If worldactor with flickMultiplier, we're good
            let actor = this.stage.getWorld().actorAt(pixels.x, pixels.y);
            if (actor == null)
                return false;
            if (!(actor instanceof WorldActor))
                return false;
            if (actor.getFlickMultiplier() === 0)
                return false;
            // Figure out the velocity to apply
            let p2 = this.overlay.getCamera().metersToScreen(hudX1, hudY1);
            let w = this.stage.getWorld().getCamera().screenToMeters(p2.x, p2.y);
            let dx = (w.x - actor.getXPosition()) * actor.getFlickMultiplier() * 1000 / time;
            let dy = w.y - actor.getYPosition() * actor.getFlickMultiplier() * 1000 / time;
            // prep the actor and flick it
            actor.clearHover();
            actor.updateVelocity(dx, dy);
            return true;
        });;
        return c;
    }

    /**
     * Create a region on an overlay, such that touching the region will cause
     * the current active actor to immediately relocate to that place.
     *
     * @param cfg An ImageConfig object, which will specify how to draw the
     *            poke-to-place region
     */
    public createPokeToPlaceZone(cfg: ImageConfig) {
        this.stage.setGestureHudFirst(false);
        this.addTapControl(cfg, (hudX: number, hudY: number) => {
            if (this.activeActor == null)
                return false;
            let pixels = this.overlay.getCamera().metersToScreen(hudX, hudY);
            let meters = this.stage.getWorld().getCamera().screenToMeters(pixels.x, pixels.y);
            this.activeActor.setPosition(meters.x - this.activeActor.getWidth() / 2, meters.y - this.activeActor.getHeight() / 2);
            this.activeActor = null;
            return true;
        })
    }

    /**
     * Create a region on an overlay, such that touching the region will cause
     * the current active actor to move to that place.
     *
     * @param cfg      An ImageConfig object, which will specify how to draw the
     *                 poke-to-move region
     * @param velocity The speed at which the actor should move
     * @param clear    Should the active actor be cleared (so that subsequent
     *                 touches won't change its trajectory)
     */
    public createPokeToMoveZone(cfg: ImageConfig, velocity: number, clear: boolean) {
        this.stage.setGestureHudFirst(false);
        this.addTapControl(cfg, (hudX: number, hudY: number) => {
            if (this.activeActor == null)
                return false;
            let pixels = this.overlay.getCamera().metersToScreen(hudX, hudY);
            let meters = this.stage.getWorld().getCamera().screenToMeters(pixels.x, pixels.y);
            let r = new Path().to(this.activeActor.getXPosition(), this.activeActor.getYPosition()).to(meters.x - this.activeActor.getWidth() / 2, meters.y - this.activeActor.getHeight() / 2);
            this.activeActor.setAbsoluteVelocity(0, 0);
            this.activeActor.setRotationSpeed(0);
            this.activeActor.setPath(r, velocity, false);
            if (clear)
                this.activeActor = null;
            return true;
        })
    }

    /**
     * Create a region on an overlay, such that touching the region will cause
     * the current active actor to move toward that place (but not stop when it
     * gets there).
     *
     * @param cfg      An ImageConfig object, which will specify how to draw the
     *                 poke-to-run region
     * @param velocity The speed at which the actor should move
     * @param clear    Should the active actor be cleared (so that subsequent
     *                 touches won't change its trajectory)
     */
    public createPokeToRunZone(cfg: ImageConfig, velocity: number, clear: boolean) {
        this.stage.setGestureHudFirst(false);
        this.addTapControl(cfg, (hudX: number, hudY: number) => {
            if (this.activeActor == null)
                return false;
            let pixels = this.overlay.getCamera().metersToScreen(hudX, hudY);
            let meters = this.stage.getWorld().getCamera().screenToMeters(pixels.x, pixels.y);
            let dx = this.activeActor.getXPosition() - (meters.x - this.activeActor.getWidth() / 2);
            let dy = this.activeActor.getYPosition() - (meters.y - this.activeActor.getHeight() / 2);
            let hy = Math.sqrt(dx * dx + dy * dy) / velocity;
            let v = new XY(dx / hy, dy / hy);
            this.activeActor.setRotationSpeed(0);
            this.activeActor.setAbsoluteVelocity(-v.x, -v.y);
            if (clear)
                this.activeActor = null;
            return true;
        })
    }

    /**
     * Draw a touchable region of the screen that acts as a joystick.  As the
     * user performs Pan actions within the region, the actor's velocity should
     * change accordingly.
     *
     * @param cfg      An ImageConfig object, which will specify how to draw the
     *                 joystick
     * @param actor    The actor to move with this joystick
     * @param scale    A value to use to scale the velocity produced by the
     *                 joystick
     * @param stopOnUp Should the actor stop when the joystick is released?
     * @return The control, so it can be modified further.
     */
    public addJoystickControl(cfg: ImageConfig, actor: WorldActor, scale: number, stopOnUp: boolean) {
        let moving = false;
        function doMove(hudX: number, hudY: number) {
            moving = true;
            actor.setAbsoluteVelocity(scale * (hudX - (cfg.x + cfg.width / 2)), scale * (hudY - (cfg.y + cfg.height / 2)));
            return true;
        }
        function doStop() {
            if (!moving)
                return true;
            moving = false;
            if (stopOnUp) {
                actor.setAbsoluteVelocity(0, 0);
                actor.setRotationSpeed(0);
            }
            return true;
        }
        return this.addPanCallbackControl(cfg, doMove, doMove, doStop);
    }

    /**
     * Add an image to the heads-up display. Touching the image has no effect.
     * Note that the image is represented by an "Actor", which means we are able
     * to animate it, move it, etc.
     *
     * @param cfg An ImageConfig object, which will specify how to draw the
     *            image
     * @return The image that was created
     */
    public addImage(cfg: ImageConfig) {
        let c = new BaseActor(this.overlay, this.stage.device, cfg.img, cfg.width, cfg.height, 0);
        c.setBoxPhysics(PhysicsType2d.Dynamics.BodyType.STATIC, cfg.x, cfg.y);
        this.overlay.addActor(c, 0);
        return c;
    }

    /**
     * Place some text on the screen.  See the definition of TextConfig for more
     * information on how to configure text.
     *
     * @param cfg A TextConfig object, which will specify how to draw the text
     * @param producer A function that produces the text to display
     * @return The display, so that it can be controlled further if needed
     */
    public addText(cfg: TextConfig, producer: () => string): Renderable {
        if (cfg.center) {
            return this.overlay.addTextCentered(cfg.x, cfg.y, cfg.face, cfg.color, cfg.size, cfg.z, producer);
        }
        else {
            return this.overlay.addText(cfg.x, cfg.y, cfg.face, cfg.color, cfg.size, cfg.z, producer);
        }
    }

    /**
     * Specify that an action should happen after a delay
     * 
     * @param interval How long to wait between executions of the action
     * @param repeat Should the action repeat
     * @param action The action to perform
     */
    public addTimer(interval: number, repeat: boolean, action: () => void) {
        this.overlay.getTimer().addEvent(new TimedEvent(interval, repeat, action));
    }

    /**
     * Add a button that has one behavior while it is being pressed, and another
     * when it is released
     *
     * @param cfg An ImageConfig object, which will specify how to draw the
     *            button
     * @param whileDownAction The action to execute, repeatedly, whenever the
     *                        button is pressed
     * @param onUpAction      The action to execute once any time the button is
     *                        released
     * @return The control, so we can do more with it as needed.
     */
    public addToggleButton(cfg: ImageConfig, whileDownAction: () => void, onUpAction: (hudX: number, hudY: number) => void) {
        let c = new BaseActor(this.overlay, this.stage.device, cfg.img, cfg.width, cfg.height, 0);
        c.setBoxPhysics(PhysicsType2d.Dynamics.BodyType.STATIC, cfg.x, cfg.y);
        let active = false; // will be captured by lambdas below
        c.setTouchDownHandler((hudX: number, hudY: number) => {
            active = true;
            return true;
        });
        c.setTouchUpHandler((hudX: number, hudY: number) => {
            if (!active)
                return false;
            active = false;
            if (onUpAction)
                onUpAction(hudX, hudY);
            return true;
        });
        // Put the control and events in the appropriate lists
        this.overlay.addActor(c, 0);
        this.stage.getWorld().addRepeatEvent(() => { if (active) whileDownAction(); });
        return c;
    }

    /**
     * The default behavior for throwing is to throw in a straight line. If we
     * instead desire that the projectiles have some sort of aiming to them, we
     * need to use this method, which throws toward where the screen was pressed
     *
     * Note: you probably want to use an invisible button that covers the
     * screen...
     *
     * @param cfg An ImageConfig object, which will specify how to draw the
     *            poke-to-place region
     * @param h          The hero who should throw the projectile
     * @param milliDelay A delay between throws, so that holding doesn't lead to
     *                   too many throws at once
     * @param offsetX    specifies the x distance between the top left of the
     *                   projectile and the top left of the hero throwing the
     *                   projectile
     * @param offsetY    specifies the y distance between the top left of the
     *                   projectile and the top left of the hero throwing the
     *                   projectile
     * @return The button that was created
     */
    public addDirectionalThrowButton(cfg: ImageConfig, h: Hero, milliDelay: number, offsetX: number, offsetY: number) {
        let c = new BaseActor(this.overlay, this.stage.device, cfg.img, cfg.width, cfg.height, 0);
        c.setBoxPhysics(PhysicsType2d.Dynamics.BodyType.STATIC, cfg.x, cfg.y);
        let v = new XY(0, 0);
        let isHolding = false;
        c.setTouchDownHandler((hudX: number, hudY: number) => {
            isHolding = true;
            let pixels = this.overlay.getCamera().metersToScreen(hudX, hudY);
            let world = this.stage.getWorld().getCamera().screenToMeters(pixels.x, pixels.y);
            v.x = world.x;
            v.y = world.y;
            return true;
        });
        c.setTouchUpHandler((hudX: number, hudY: number) => {
            isHolding = false;
            return true;
        });
        c.setPanMoveHandler((hudX: number, hudY: number) => {
            let pixels = this.overlay.getCamera().metersToScreen(hudX, hudY);
            let world = this.stage.getWorld().getCamera().screenToMeters(pixels.x, pixels.y);
            v.x = world.x;
            v.y = world.y;
            return isHolding;
        });
        this.overlay.addActor(c, 0);

        let mLastThrow = 0;
        this.stage.getWorld().addRepeatEvent(() => {
            if (isHolding) {
                let now = new Date().getTime();
                if (mLastThrow + milliDelay < now) {
                    mLastThrow = now;
                    this.stage.getProjectilePool().throwAt(h.getCenterX(),
                        h.getCenterY(), v.x, v.y, h, offsetX, offsetY);
                }
            }
        });
        return c;
    }

    /**
     * Create an action that makes a hero throw a projectile
     *
     * @param hero      The hero who should throw the projectile
     * @param offsetX   specifies the x distance between the top left of the
     *                  projectile and the top left of the hero throwing the
     *                  projectile
     * @param offsetY   specifies the y distance between the top left of the
     *                  projectile and the top left of the hero throwing the
     *                  projectile
     * @param velocityX The X velocity of the projectile when it is thrown
     * @param velocityY The Y velocity of the projectile when it is thrown
     * @return The action object
     */
    public ThrowFixedAction(hero: Hero, offsetX: number, offsetY: number, velocityX: number, velocityY: number): (hudX: number, hudY: number) => boolean {
        return (hudX: number, hudY: number) => {
            this.stage.getProjectilePool().throwFixed(hero, offsetX, offsetY, velocityX, velocityY);
            return true;
        }
    }

    /**
     * Create an action for moving an actor in the Y direction.  This action can
     * be used by a Control.
     *
     * @param actor The actor to move
     * @param yRate The rate at which the actor should move in the Y direction
     *              (negative values are allowed)
     * @return The action
     */
    public makeYMotionAction(actor: WorldActor, yRate: number) {
        return () => { actor.updateVelocity(actor.getXVelocity(), yRate); };
    }

    /**
     * Create an action for moving an actor in the X and Y directions.  This
     * action can be used by a Control.
     *
     * @param actor The actor to move
     * @param xRate The rate at which the actor should move in the X direction
     *              (negative values are allowed)
     * @param yRate The rate at which the actor should move in the Y direction
     *              (negative values are allowed)
     * @return The action
     */
    public makeXYMotionAction(actor: WorldActor, xRate: number, yRate: number) {
        return () => { actor.updateVelocity(xRate, yRate); };
    }

    /**
    * Create an action for moving an actor in the X direction.  This action can
    * be used by a Control.
    *
    * @param actor The actor to move
    * @param xRate The rate at which the actor should move in the X direction
    *              (negative values are allowed)
    * @return The action
    */
    public makeXMotionAction(actor: WorldActor, xRate: number) {
        return () => { actor.updateVelocity(xRate, actor.getYVelocity()); };
    }

    /**
     * Create an action for moving an actor in the X and Y directions, with
     * dampening on release. This action can be used by a Control.
     *
     * @param actor     The actor to move
     * @param xRate     The rate at which the actor should move in the X
     *                  direction (negative values are allowed)
     * @param yRate     The rate at which the actor should move in the Y
     *                  direction (negative values are allowed)
     * @param dampening The dampening factor
     * @return The action
     */
    public makeXYDampenedMotionAction(actor: WorldActor, xRate: number, yRate: number, dampening: number) {
        return () => {
            actor.updateVelocity(xRate, yRate);
            actor.setDamping(dampening);
        }
    }


    /**
     * Create an action that makes a hero throw a projectile in a direction that
     * relates to how the screen was touched
     *
     * @param hero    The hero who should throw the projectile
     * @param offsetX specifies the x distance between the top left of the
     *                projectile and the top left of the hero throwing the
     *                projectile
     * @param offsetY specifies the y distance between the top left of the
     *                projectile and the top left of the hero throwing the
     *                projectile
     * @return The action object
     */
    public ThrowDirectionalAction(hero: Hero, offsetX: number, offsetY: number) {
        return (hudX: number, hudY: number) => {
            let pixels = this.overlay.getCamera().metersToScreen(hudX, hudY);
            let world = this.stage.getWorld().getCamera().screenToMeters(pixels.x, pixels.y);
            this.stage.getProjectilePool().throwAt(hero.getCenterX(), hero.getCenterY(), world.x, world.y, hero, offsetX, offsetY);
            return true;
        };
    }

    /**
     * Create an action for making a hero rotate
     *
     * @param hero The hero to rotate
     * @param rate Amount of rotation to apply to the hero on each press
     * @return The action
     */
    public makeRotator(hero: Hero, rate: number) {
        return () => {
            hero.increaseRotation(rate);
        }
    }

    /**
    * Create an action for making a hero throw a projectile
    *
    * @param hero       The hero who should throw the projectile
    * @param milliDelay A delay between throws, so that holding doesn't lead to
    *                   too many throws at once
    * @param offsetX    specifies the x distance between the top left of the
    *                   projectile and the top left of the hero throwing the
    *                   projectile
    * @param offsetY    specifies the y distance between the top left of the
    *                   projectile and the top left of the hero throwing the
    *                   projectile
    * @param velocityX  The X velocity of the projectile when it is thrown
    * @param velocityY  The Y velocity of the projectile when it is thrown
    * @return The action object
    */
    public makeRepeatThrow(hero: Hero, milliDelay: number, offsetX: number, offsetY: number, velocityX: number, velocityY: number): () => void {
        let mLastThrow = 0; // captured by lambda
        return () => {
            let now = new Date().getTime();
            if (mLastThrow + milliDelay < now) {
                mLastThrow = now;
                this.stage.getProjectilePool().throwFixed(hero, offsetX, offsetY, velocityX, velocityY);
            }
        }
    }

    /**
     * Create an action that makes a hero jump.
     *
     * @param hero The hero who we want to jump
     * @param milliDelay If there should be time between being allowed to jump
     * @return The action object
     */
    public jumpAction(hero: Hero, milliDelay: number): (x: number, y: number) => boolean {
        let mLastJump = 0;
        return () => {
            let now = new Date().getTime();
            if (mLastJump + milliDelay < now) {
                mLastJump = now;
                hero.jump();
                return true;
            }
            return false;
        };
    }

    /**
     * Create an action for making a hero either start or stop crawling
     *
     * @param hero       The hero to control
     * @param crawlState True to start crawling, false to stop
     * @param rotate     The amount (in radians) to rotate the hero when
     *                   crawling
     * @return The action
     */
    public makeCrawlToggle(hero: Hero, crawlState: boolean, rotate: number) {
        return () => {
            if (crawlState)
                hero.crawlOn(rotate);
            else
                hero.crawlOff(rotate);
        };
    }
}