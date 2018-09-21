import { JetLagManager } from "../JetLagManager"
import { BaseActor } from "../renderables/BaseActor"
import { Renderable } from "../renderables/Renderable"
import { RenderableText } from "../renderables/RenderableText"
import { Picture } from "../renderables/Picture"
import { Timer } from "../misc/Timer"
import { Renderer, Camera } from "../device/Renderer"

/**
 * PointToActorCallback is a QueryCallback for PhysicsType2d, which determines
 * if a coordinate in the world corresponds to a BaseActor.
 */
class PointToActorCallback implements PhysicsType2d.Dynamics.IQueryCallback {
  /** If we found an actor, we'll put it here */
  private foundActor: BaseActor = null;

  /** A helper vector for tracking the location that is being queried */
  private touchVector = new PhysicsType2d.Vector2(0, 0);

  /** The tolerance when looking in a region around a point */
  private readonly delta = .1;

  /** The bounding box around the point that is being tested */
  private aabb = new PhysicsType2d.Collision.AxisAlignedBoundingBox();

  /** 
   * Destructor is a no-op for our use of the IQueryCallback interface
   */
  Destructor(): void { }

  /**
   * ReportFixture is used by PhysicsType2d to see if the fixture that was
   * found meets the requirements set forth by the user.  If so, it returns
   * false, and the search ends.  If not, it returns true, and the search
   * continues.
   * 
   * @param fixture The fixture that was found, and which needs to be tested
   * 
   * @returns True if the fixture isn't satisfactory, and the search should
   *          continue
   */
  ReportFixture(fixture: PhysicsType2d.Dynamics.Fixture): boolean {
    if (fixture.TestPoint(this.touchVector)) {
      let b = fixture.GetBody().GetUserData() as BaseActor;
      if (b.getEnabled()) {
        this.foundActor = b;
        return false;
      }
    }
    return true;
  }

  /**
   * Returns the most recently found actor, or null if the most recent search
   * failed
   */
  getFoundActor() { return this.foundActor; }

  /**
   * Prior to a query, call this to set the coordinates of the search
   * 
   * @param x The X coordinate of the search, in meters
   * @param y The Y coordinate of the search, in meters
   */
  query(x: number, y: number, world: PhysicsType2d.Dynamics.World) {
    this.foundActor = null;
    this.touchVector.x = x;
    this.touchVector.y = y;
    this.aabb.lowerBound.x = x - this.delta;
    this.aabb.lowerBound.y = y - this.delta;
    this.aabb.upperBound.x = x + this.delta;
    this.aabb.upperBound.y = y + this.delta;
    world.QueryAABB(this, this.aabb);
  }
}

/**
 * Scene represents an interactive, dynamic, visible component of the game.
 * There are two prominent types of scenes, one of which houses the core
 * gameplay, and the other of which can sit on top of that core gameplay and
 * add additional functionality.
 *
 * There is a close relationship between a BaseActor and a Scene, namely that a
 * BaseActor should not need any scene functionality that is not present in
 * Scene.
 */
export abstract class Scene {

  /** The JetLag manager object */
  readonly stageManager: JetLagManager;

  /** The physics world in which all actors interact */
  readonly world: PhysicsType2d.Dynamics.World;

  /** Anything in the world that can be rendered, in 5 planes [-2, -1, 0, 1, 2] */
  readonly renderables: Array<Array<Renderable>>;

  // The camera will make sure important actors are on screen
  readonly camera: Camera;

  /** When there is a touch of an actor in the physics world, this is how we find it */
  hitActor: BaseActor

  /** For querying the point that was toucned */
  pointQuerier = new PointToActorCallback();

  /** Events that get processed on the next render, then discarded */
  readonly mOneTimeEvents: (() => void)[] = [];

  /** Events that get processed on every render */
  readonly mRepeatEvents: (() => void)[] = [];

  /** For tracking time... */
  readonly timer: Timer = new Timer();

  /**
   * Construct a new scene
   *
   * @param media  All image and sound assets for the game
   * @param config The game-wide configuration
   */
  constructor(manager: JetLagManager) {
    this.stageManager = manager;

    let w = this.stageManager.config.screenWidth / this.stageManager.config.pixelMeterRatio;
    let h = this.stageManager.config.screenHeight / this.stageManager.config.pixelMeterRatio;

    // set up the game camera, with (0, 0) in the top left
    this.camera = new Camera(w, h, this.stageManager.config.pixelMeterRatio, manager.config);

    // create a world with no default gravitational forces
    this.world = new PhysicsType2d.Dynamics.World(new PhysicsType2d.Vector2(0, 0));

    // set up the containers for holding anything we can render
    this.renderables = new Array<Array<Renderable>>(5);
    for (let i = 0; i < 5; ++i) {
      this.renderables[i] = new Array<Renderable>();
    }
  }

  /**
   * Query to find the actor at a screen coordinate
   */
  public actorAt(screenX: number, screenY: number): BaseActor {
    let worldCoords = this.camera.screenToMeters(screenX, screenY);
    console.log("world coords", worldCoords.x, worldCoords.y)
    this.pointQuerier.query(worldCoords.x, worldCoords.y, this.world);
    return this.pointQuerier.getFoundActor();
  }

  /**
   * Handle a tap action
   * 
   * @param screenX  The X coordinate on the screen
   * @param screenY  The Y coordinate on the screen
   */
  public tap(screenX: number, screenY: number): boolean {
    let actor = this.actorAt(screenX, screenY);
    if (actor === null)
      return false;
    if (actor.tapHandler !== null) {
      let worldCoords = this.camera.screenToMeters(screenX, screenY);
      actor.tapHandler(worldCoords.x, worldCoords.y);
      return true;
    }
    return false;
  }

  /**
   * Run this when a pan event starts
   */
  public panStart(screenX: number, screenY: number): boolean {
    let actor = this.actorAt(screenX, screenY);
    if (actor === null)
      return false;
    if (actor.panStartHandler === null)
      return false;
    let worldCoords = this.camera.screenToMeters(screenX, screenY);
    return actor.panStartHandler(worldCoords.x, worldCoords.y);
  }

  /**
   * This runs when a pan produces a "move" event
   */
  public panMove(screenX: number, screenY: number): boolean {
    let actor = this.actorAt(screenX, screenY);
    if (actor === null)
      return false;
    if (actor.panMoveHandler === null)
      return false;
    let worldCoords = this.camera.screenToMeters(screenX, screenY);
    return actor.panMoveHandler(worldCoords.x, worldCoords.y);
  }

  /**
   * When a pan event stops
   */
  public panStop(screenX: number, screenY: number): boolean {
    let actor = this.actorAt(screenX, screenY);
    if (actor === null)
      return false;
    if (actor.panStopHandler === null)
      return false;
    let worldCoords = this.camera.screenToMeters(screenX, screenY);
    return actor.panStopHandler(worldCoords.x, worldCoords.y);
  }

  /**
   * In response to a down-press
   */
  public touchDown(screenX: number, screenY: number): boolean {
    let actor = this.actorAt(screenX, screenY);
    if (actor === null)
      return false;
    if (actor.touchDownHandler === null)
      return false;
    let worldCoords = this.camera.screenToMeters(screenX, screenY);
    return actor.touchDownHandler(worldCoords.x, worldCoords.y);
  }

  /**
   *  When a down-press is released
   */
  public touchUp(screenX: number, screenY: number): boolean {
    let actor = this.actorAt(screenX, screenY);
    if (actor === null)
      return false;
    if (actor.touchUpHandler === null)
      return false;
    let worldCoords = this.camera.screenToMeters(screenX, screenY);
    return actor.touchUpHandler(worldCoords.x, worldCoords.y);
  }

  /** 
   * Handle a screen swipe event
   */
  public swipe(screenX0: number, screenY0: number, screenX1: number, screenY1: number, time: number) {
    let sActor = this.actorAt(screenX0, screenY0);
    let eActor = this.actorAt(screenX1, screenY1);
    if (sActor === null)
      return false;
    if (sActor !== eActor)
      return false;
    if (sActor.swipeHandler === null)
      return false;
    let wc1 = this.camera.screenToMeters(screenX0, screenY0);
    let wc2 = this.camera.screenToMeters(screenX1, screenY1);
    return sActor.swipeHandler(wc1.x, wc1.y, wc2.x, wc2.y, time);
  }

  /**
   * Add an actor to the level, putting it into the appropriate z plane
   *
   * @param actor  The actor to add
   * @param zIndex The z plane. valid values are -2, -1, 0, 1, and 2. 0 is the default.
   */
  addActor(actor: Renderable, zIndex: number) {
    // Coerce index into legal range, then add the actor
    zIndex = (zIndex < -2) ? -2 : zIndex;
    zIndex = (zIndex > 2) ? 2 : zIndex;
    this.renderables[zIndex + 2].push(actor);
  }

  /**
   * Remove an actor from its z plane
   *
   * @param actor  The actor to remove
   * @param zIndex The z plane where it is expected to be
   */
  removeActor(actor: Renderable, zIndex: number): void {
    // Coerce index into legal range, then remove the actor
    zIndex = (zIndex < -2) ? -2 : zIndex;
    zIndex = (zIndex > 2) ? 2 : zIndex;
    let i = this.renderables[zIndex + 2].indexOf(actor);
    this.renderables[zIndex + 2].splice(i, 1);
  }

  /**
   * Reset a scene by clearing all of its lists
   */
  reset(): void {
    this.mOneTimeEvents.length = 0;
    this.mRepeatEvents.length = 0;
    for (let a of this.renderables) {
      a.length = 0;
    }
  }

  /**
   * Add an image to the scene.  The image will not have any physics attached to it.
   *
   * @param x       The X coordinate of the top left corner, in meters
   * @param y       The Y coordinate of the top left corner, in meters
   * @param width   The image width, in meters
   * @param height  The image height, in meters
   * @param imgName The file name for the image, or ""
   * @param zIndex  The z index of the text
   * @return A Renderable of the image, so it can be enabled/disabled by program code
   */
  public makePicture(x: number, y: number, width: number,
    height: number, imgName: string, zIndex: number): Picture {
    // set up the image to display
    // NB: this will fail gracefully (no crash) for invalid file names
    let r = new Picture(x, y, width, height, imgName, this.stageManager);
    this.addActor(r, zIndex);
    return r;
  }

  /**
   * Draw some text in the scene, using a top-left coordinate
   *
   * @param x         The x coordinate of the top left corner
   * @param y         The y coordinate of the top left corner
   * @param fontName  The name of the font to use
   * @param fontColor The color of the font
   * @param fontSize  The size of the font
   * @param producer        A TextProducer that will generate the text to display
   * @param zIndex    The z index of the text
   * @return A Renderable of the text, so it can be enabled/disabled by program code
   */
  public addText(x: number, y: number, fontName: string, fontColor: string, fontSize: number, producer: () => string, zIndex: number): RenderableText {
    let t = new RenderableText(this.stageManager, fontName, fontSize, fontColor, x, y, false, producer);
    this.addActor(t, zIndex);
    return t;
  }

  /**
   * Draw some text in the scene, centering it on a specific point
   *
   * @param centerX   The x coordinate of the center
   * @param centerY   The y coordinate of the center
   * @param fontName  The name of the font to use
   * @param fontColor The color of the font
   * @param fontSize  The size of the font
   * @param tp        A TextProducer that will generate the text to display
   * @param zIndex    The z index of the text
   * @return A Renderable of the text, so it can be enabled/disabled by program code
   */
  public addTextCentered(centerX: number, centerY: number, fontName: string, fontColor: string, fontSize: number, producer: () => string, zIndex: number): RenderableText {
    let t = new RenderableText(this.stageManager, fontName, fontSize, fontColor, centerX, centerY, true, producer);
    this.addActor(t, zIndex);
    return t;
  }

  /**
   * Render this scene
   *
   * @return True if the scene was rendered, false if it was not
   */
  abstract render(renderer: Renderer, elapsedTime: number): boolean;
}