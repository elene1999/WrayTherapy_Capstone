import { JetLagConfig, JetLagVerbosity } from "../jetlag/support/JetLagConfig"
import { buildChooserScreen } from "./Chooser"
import { buildLevelScreen } from "./Levels";
import { buildStoreScreen } from "./Store";
import { buildHelpScreen } from "./Help";
import { buildSplashScreen } from "./Splash";

/**
 * GameConfig stores things like screen dimensions and other game configuration,
 * as well as the names of all the assets (images and sounds) used by this game.
 */
export class GameConfig extends JetLagConfig {
  /**
   * The GameConfig object is used to pass configuration information to the
   * JetLag system.
   *
   * To see documentation for any of these variables, hover your mouse over the
   * word on the left side of the equals sign.
   */
  constructor() {
    super(); // Always start with this line

    // The size of the screen, and some game behavior configuration
    this.screenWidth = 1600;
    this.screenHeight = 900;
    this.adaptToScreenSize = true;
    this.pixelMeterRatio = 100;
    this.canVibrate = true;
    this.debugMode = true; //this is the green lines
    this.forceAccelerometerOff = true;
    this.verbosity = JetLagVerbosity.LOUD;

    // Chooser configuration
    this.numLevels = 92;
    this.enableChooser = true;
    this.storageKey = "com.me.myjetlaggame.prefs";

    // Set up the resource prefix
    this.resourcePrefix = "./assets/";

    // list the images that the game will use
    this.imageNames = [
      // The non-animated actors in the game
      "astro_side.png",
      "greenball.png", "mustardball.png", "redball.png", "blueball.png",
      "purpleball.png", "greyball.png",
      // Images that we use for buttons in the Splash and Chooser
      "leftarrow.png", "rightarrow.png", "backarrow.png", "leveltile.png",
      "audio_on.png", "audio_off.png",
      // Some raw colors
      "red.png", "black.png",
      // Background images for OverlayScenes
      "msg2.png", "fade.png",
      // The backgrounds for the Splash and Chooser
      "splash.png", "chooser.png",
      // Layers for Parallax backgrounds and foregrounds
      "mid.png", "front.png", "back.png",
      // The animation for a star with legs
      "legstar1.png", "legstar2.png", "legstar3.png", "legstar4.png",
      "legstar5.png", "legstar6.png", "legstar7.png", "legstar8.png",
      // The animation for the star with legs, with each image flipped
      "fliplegstar1.png", "fliplegstar2.png", "fliplegstar3.png", "fliplegstar4.png",
      "fliplegstar5.png", "fliplegstar6.png", "fliplegstar7.png", "fliplegstar8.png",
      // The flying star animation
      "flystar1.png", "flystar2.png",
      // Animation for a star that expands and then disappears
      "starburst1.png", "starburst2.png", "starburst3.png", "starburst4.png",
      // eight colored stars
      "colorstar1.png", "colorstar2.png", "colorstar3.png", "colorstar4.png",
      "colorstar5.png", "colorstar6.png", "colorstar7.png", "colorstar8.png",
      // background noise, and buttons
      "noise.png", "pause.png",
      //Astronaut animation
      "1.png", "2.png","3.png","4.png","5.png","6.png",
      //Game intro background
      "planets.png", "planets_level.png", "splash_background.png", "earth.png",
      //level backgrounds
      "lvl1_background.png", "lvl1_moon.png", "lvl1_stars.png", "lvl2_moon.png", "lvl2_stars.png", "lvl3_moon.png", "lvl3_stars.png", "entire_background.png",
      //curriculum object
      "question_box.png","question_box 2.png","question_box 3.png","question_box 4.png","question_box 5.png","question_box 6.png", "blank.png",
      //question related pictures
      "answer_bar.png", "question_bar.png", "wrong_bar.png", "right_bar.png", "hint.png", "hint_bar.png",
      //rockets
      "rocket.png", "space_shuttle_screen.png",
      //star backgrounds
      "teeny_stars.png", "only_big_stars.png", "background_small_stars.png", "Full_background.png", "inside_spaceship.png", 
      //flag
      "flag.png",
      //writing
      "welcome.png", "readybutton.png", 
      //new astronaut animation
      "a1.png", "a2.png", "a3.png", "a4.png", "a5.png", "a6.png", "a7.png", "a8.png", "a9.png", "a10.png", 
        "a11.png", "a12.png", "a13.png", "a14.png", "a15.png", "a16.png", "a17.png", "a18.png", "a19.png", "a20.png", 
        "a21.png", "a22.png", "a23.png", "a24.png", "a25.png", "a26.png", "a27.png", "a28.png", "a29.png", "a30.png", 
        "a31.png", "a32.png", "a33.png", "a34.png", "a35.png", "a36.png", "a37.png", "a38.png", "a39.png", "a40.png", 
        "a41.png", "a42.png", "a43.png", "a44.png", "a45.png", "a46.png", "a47.png", "a48.png", "a49.png", "a50.png",
      //screens
      "add_on.png", "draw_a_picture.png", "lets_learn.png", "skip_count.png", "test.png",
      //tutorial
      "t_welcome.png", "t_2.png", "t_3.png", "t_4.png", "t_5.png", "t_6.png"
    ];

    // list the sound effects that the game will use
    this.soundNames = [
      "hipitch.ogg", "lowpitch.ogg",
      "losesound.ogg", "winsound.ogg",
      "slowdown.ogg", "woowoowoo.ogg", "fwapfwap.ogg",
    ];

    // list the background music files that the game will use
    this.musicNames = [
      "tune.ogg"
    ];

    // don't change these lines unless you know what you are doing
    this.levelBuilder = buildLevelScreen;
    this.chooserBuilder = buildChooserScreen;
    this.helpBuilder = buildHelpScreen;
    this.splashBuilder = buildSplashScreen;
    this.storeBuilder = buildStoreScreen;
  }
}