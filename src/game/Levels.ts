import { JetLagApi } from "../jetlag/api/JetLagApi";
import { OverlayApi } from "../jetlag/api/OverlayApi";
//import { Path } from "../jetlag/support/Path";
//import { Goodie } from "../jetlag/actor/Goodie";
import { Hero } from "../jetlag/actor/Hero";
//import { WorldActor } from "../jetlag/actor/WorldActor";
//import { Enemy } from "../jetlag/actor/Enemy";
import { JetLagKeys } from "../jetlag/support/JetLagKeys";
import { Obstacle } from "../jetlag/actor/Obstacle";

/**
 * buildLevelScreen is used to draw the playable levels of the game
 *
 * We currently have 90 levels, each of which is described in part of the
 * following function.
 *
 * @param index Which level should be displayed
 * @param jl    The JetLag object, for putting stuff into the level
 */
export function buildLevelScreen(index: number, jl: JetLagApi): void {

    // This line ensures that, no matter what level we draw, the ESCAPE key is configured to go back to the Chooser
    jl.setUpKeyAction(JetLagKeys.ESCAPE, () => { jl.nav.doChooser(Math.ceil(index / 24)); });

    // In this level, all we have is a hero (the green ball) who needs to make it to the destination (a mustard colored
    // ball). The game is configured to use tilt to control the world.  If you're running on a computer, arrow keys will
    // simulate tilt.
    if (index == 3) {
        // By default, we have a level that is 1600x900 pixels (16x9 meters), with no default gravitational forces

        // Turn on tilt support, and indicate that the maximum force is +/- 10 m/(s^2) in each of the X and Y dimensions
        jl.world.enableTilt(10, 10);

        // Create a circular hero whose top left corner is at (2, 3), who is .75 meters wide, .75 meters high, and who
        // looks like a green ball.  Note that "greenball.png" is in the assets folder, and it is listed in the
        // myconfig.ts file
        let h = jl.world.makeHero({ x: 2, y: 3, width: .75, height: .75, img: "greenball.png" });

        // The hero moves via phone tilt
        h.setMoveByTilting();

        // draw a circular destination, and indicate that the level is won when the hero reaches the destination
        //
        // Note: the parameters to makeDestinationAsCircle() are the same as the parameters for making heroes.  If you
        // aren't sure what something means, hover your mouse over it and you'll get pop-up help
       // jl.world.makeDestination({ x: 15, y: 8, width: .75, height: .75, img: "mustardball.png" });
        //jl.score.setVictoryDestination(1);

        // Specify a message to print when the level is won
        //
        // Note: there is actually a lot of code behind making this message.  It all appears at the bottom of this file,
        // as a function.  Later, we'll  explore the function, and we will also see how to make different sorts of win
        // messages
        //winMessage(jl, "Great Job");
        //questionScreen(jl, "hello!");
        jl.world.setCameraBounds(300000, 9);
        //jl.world.resetGravity(0, 10);
        welcomeMessage(jl, "Press to make the hero go up");
        winMessage(jl, "Great Job");
        loseMessage(jl, "Try Again");
        jl.world.drawBoundingBox(0, 0, 300000, 9, "", 0, 0, 0);

        // make a hero
        //let h = jl.world.makeHero({ x: .25, y: 5.25, width: .75, height: .75, img: "greenball.png" });
        jl.world.setCameraChase(h);
        //h.setAbsoluteVelocity(5, 0);
        //h.disableRotation();
       //h.setPhysics(.1, 0, 0);

        // touching the screen makes the hero go upwards
       //jl.hud.addToggleButton({ x: 0, y: 0, width: 16, height: 9, img: "" }, jl.hud.makeYMotionAction(h, -5), jl.hud.makeYMotionAction(h, 0));

        // set up our background, with a few layers
        jl.world.setBackgroundColor(0x000000);
        //jl.world.drawPicture({ x: 0, y: 0, width: 16, height: 9, img: "lvl1_background.png", z: -1 });
        jl.world.addHorizontalBackgroundLayer({ x: 0, y: 0, width: 16, height: 9, img: "lvl1_moon.png"}, 1);
        //jl.world.addHorizontalForegroundLayer({ x: 0, y: 0, width: 16, height: 9, img: "mid.png" }, 0);
        jl.world.addHorizontalBackgroundLayer({ x: 0, y: 0, width: 16, height: 6, img: "lvl1_stars.png" }, 0.5);

        // we win by collecting 10 goodies...
        jl.score.setVictoryGoodies(10, 0, 0, 0);
        jl.hud.addText({ x: 1, y: 1, face: "Arial", color: "#FFFFFF", size: 20, z: 2 }, () => jl.score.getGoodies1() + " goodies");

        // now set up an obstacle and attach a callback to it
        //
        // Note that the obstacle needs to be final or we can't access it within the callback
        let trigger = jl.world.makeObstacle({ box: true, x: 16, y: 5, width: 2, height: 2, img: "question_box.png" });
        let lc =
            // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
            // and a new obstacle on the screen.  We'll randomize their placement just a bit.
            // Also move the obstacle forward, so we can hit it again.
            (thisActor: Obstacle, collideActor: Hero) => {
                // make a random enemy and a random goodie.  Put them in X coordinates relative to the trigger
                //jl.world.makeEnemy({ x: trigger.getXPosition() + 8 + jl.getRandom(10), y: jl.getRandom(8), width: .5, height: .5, img: "redball.png" });
                //jl.world.makeGoodie({ x: trigger.getXPosition() + 9 + jl.getRandom(10), y: jl.getRandom(8), width: .5, height: .5, img: "blueball.png" });
                // move the trigger so we can hit it again
                //trigger.setPosition(trigger.getXPosition() + 16, trigger.getYPosition());

                 // Create a pause scene that has a back button on it, and a button
        // for pausing the level
                //jl.hud.addTapControl({ x: 0, y: 0, width: 1, height: 1, img: "red.png" }, (hudX: number, hudY: number) => {
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                        
                        overlay.addTapControl({ x: 3.05, y: 1.10, width: 10, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                            //jl.nav.doChooser(1);
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 1.50, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "Question 1");
                    
                        overlay.addTapControl({ x: 3, y: 3.5, width: 10.00, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            //jl.nav.doChooser(1);
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 3.85, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #1");

                        overlay.addTapControl({ x: 3, y: 4.75, width: 10, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                            //jl.score.winLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 5.10, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #2");

                        overlay.addTapControl({ x: 3, y: 6.00, width: 10, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                           // jl.score.winLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 6.36, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #3");

                        overlay.addTapControl({ x: 3, y: 7.25, width: 10, height: 1.2, img: "answer_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            //jl.score.loseLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 7.6, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #4");

                        // overlay.addTapControl({ x: 7, y: 1, width: 1, height: 1, img: "red.png" }, () => {
                        //     jl.nav.dismissOverlayScene();
                        //     jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        //         // clear the pausescene, draw another one
                        //         overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, () => {
                        //             jl.nav.dismissOverlayScene();
                        //             return true;
                        //         });
                        //         overlay.addText({ center: true, x: 8, y: 4.5, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "This is a second pause scene!");
                        //     });
                        //     return true;
                        // });
                    });
                    return true;
                //});
            };
        trigger.setHeroCollisionCallback(lc);
        // No transfer of momeuntum when the hero collides with the trigger
        trigger.setCollisionsEnabled(false);

    }
    
    // Show how to make an "infinite" level, and add a foreground layer
    else if (index == 2) {
        // set up a standard side scroller with tilt, but make it really really long:
        jl.world.setCameraBounds(300000, 9);
        jl.world.resetGravity(0, 10);
        welcomeMessage(jl, "Press to make the hero go up");
        winMessage(jl, "Great Job");
        loseMessage(jl, "Try Again");
        jl.world.drawBoundingBox(0, 0, 300000, 9, "", 0, 0, 0);

        // make a hero
        let h = jl.world.makeHero({ x: .25, y: 5.25, width: .75, height: .75, img: "greenball.png" });
        jl.world.setCameraChase(h);
        h.setAbsoluteVelocity(5, 0);
        h.disableRotation();
        h.setPhysics(.1, 0, 0);

        // touching the screen makes the hero go upwards
        jl.hud.addToggleButton({ x: 0, y: 0, width: 16, height: 9, img: "" }, jl.hud.makeYMotionAction(h, -5), jl.hud.makeYMotionAction(h, 0));

        // set up our background, with a few layers
        jl.world.setBackgroundColor(0x000000);
        //jl.world.drawPicture({ x: 0, y: 0, width: 16, height: 9, img: "lvl1_background.png", z: -1 });
        jl.world.addHorizontalBackgroundLayer({ x: 0, y: 0, width: 16, height: 9, img: "lvl1_moon.png"}, 1);
        //jl.world.addHorizontalForegroundLayer({ x: 0, y: 0, width: 16, height: 9, img: "mid.png" }, 0);
        jl.world.addHorizontalBackgroundLayer({ x: 0, y: 0, width: 16, height: 6, img: "lvl1_stars.png" }, 0.5);

        // we win by collecting 10 goodies...
        jl.score.setVictoryGoodies(10, 0, 0, 0);
        jl.hud.addText({ x: 1, y: 1, face: "Arial", color: "#FFFFFF", size: 20, z: 2 }, () => jl.score.getGoodies1() + " goodies");

        // now set up an obstacle and attach a callback to it
        //
        // Note that the obstacle needs to be final or we can't access it within the callback
        let trigger = jl.world.makeObstacle({ box: true, x: 16, y: 5, width: 2, height: 2, img: "question_box.png" });
        let lc =
            // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
            // and a new obstacle on the screen.  We'll randomize their placement just a bit.
            // Also move the obstacle forward, so we can hit it again.
            (thisActor: Obstacle, collideActor: Hero) => {
                // make a random enemy and a random goodie.  Put them in X coordinates relative to the trigger
                //jl.world.makeEnemy({ x: trigger.getXPosition() + 8 + jl.getRandom(10), y: jl.getRandom(8), width: .5, height: .5, img: "redball.png" });
                //jl.world.makeGoodie({ x: trigger.getXPosition() + 9 + jl.getRandom(10), y: jl.getRandom(8), width: .5, height: .5, img: "blueball.png" });
                // move the trigger so we can hit it again
                //trigger.setPosition(trigger.getXPosition() + 16, trigger.getYPosition());

                 // Create a pause scene that has a back button on it, and a button
        // for pausing the level
                //jl.hud.addTapControl({ x: 0, y: 0, width: 1, height: 1, img: "red.png" }, (hudX: number, hudY: number) => {
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                        
                        overlay.addTapControl({ x: 3.05, y: 1.10, width: 10, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                            //jl.nav.doChooser(1);
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 1.50, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "Question 1");
                    
                        overlay.addTapControl({ x: 3, y: 3.5, width: 10.00, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            //jl.nav.doChooser(1);
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 3.85, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #1");

                        overlay.addTapControl({ x: 3, y: 4.75, width: 10, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                            //jl.score.winLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 5.10, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #2");

                        overlay.addTapControl({ x: 3, y: 6.00, width: 10, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                           // jl.score.winLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 6.36, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #3");

                        overlay.addTapControl({ x: 3, y: 7.25, width: 10, height: 1.2, img: "answer_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            //jl.score.loseLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 7.6, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #4");

                        // overlay.addTapControl({ x: 7, y: 1, width: 1, height: 1, img: "red.png" }, () => {
                        //     jl.nav.dismissOverlayScene();
                        //     jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        //         // clear the pausescene, draw another one
                        //         overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, () => {
                        //             jl.nav.dismissOverlayScene();
                        //             return true;
                        //         });
                        //         overlay.addText({ center: true, x: 8, y: 4.5, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "This is a second pause scene!");
                        //     });
                        //     return true;
                        // });
                    });
                    return true;
                //});
            };
        trigger.setHeroCollisionCallback(lc);
        // No transfer of momeuntum when the hero collides with the trigger
        trigger.setCollisionsEnabled(false);
    }

    // In this level, we change the physics from level 2 so that things roll and bounce a little bit more nicely.
    else if (index == 1) {
            jl.world.setCameraBounds(160, 9);
            jl.world.drawBoundingBox(0, 0, 160, 9, "", 1, 0, 1);
            let h = jl.world.makeHero({ x: 0, y: 3, width: 2, height: 4, img: "astro_side.png" });
            h.disableRotation();
            h.setPhysics(5, 0, 0.6);
            h.addVelocity(1, 0);
            jl.world.setCameraChase(h);
            jl.world.makeDestination({ x: 159, y: 0, width: 1, height: 1, img: "mustardball.png" });
            jl.score.setVictoryDestination(1);

            // set up our background, with a few layers
            jl.world.setBackgroundColor(0x000000);
            //jl.world.drawPicture({ x: 0, y: 0, width: 16, height: 9, img: "lvl1_background.png", z: -1 });
            jl.world.addHorizontalBackgroundLayer({ x: 0, y: 0, width: 16, height: 9, img: "lvl1_moon.png"}, 1);
            //jl.world.addHorizontalForegroundLayer({ x: 0, y: 0, width: 16, height: 9, img: "mid.png" }, 0);
            jl.world.addHorizontalBackgroundLayer({ x: 0, y: 0, width: 16, height: 6, img: "lvl1_stars.png" }, 0.5);

            // // place a speed-up obstacle that lasts for 2 seconds
            // let o1 = jl.world.makeObstacle({ x: 20, y: 0, width: 1, height: 1, img: "rightarrow.png" });
            // o1.setSpeedBoost(5, 0, 2);
            // // place a slow-down obstacle that lasts for 3 seconds
            // let o2 = jl.world.makeObstacle({ x: 60, y: 0, width: 1, height: 1, img: "leftarrow.png" });
            // o2.setSpeedBoost(-2, 0, 3);
            // // place a permanent +3 speedup obstacle... the -1 means "forever"
            // let o3 = jl.world.makeObstacle({ x: 80, y: 0, width: 1, height: 1, img: "purpleball.png" });
            // o3.setSpeedBoost(3, 0, -1);
    
            //welcomeMessage(jl, "Speed boosters and reducers");
            winMessage(jl, "Great Job");
            loseMessage(jl, "Try Again");

            let trigger1 = jl.world.makeObstacle({ box: true, x: 15, y: 5, width: 2, height: 2, img: "question_box.png" });
        
            let lc =
            // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
            // and a new obstacle on the screen.  We'll randomize their placement just a bit.
            // Also move the obstacle forward, so we can hit it again.
            (thisActor: Obstacle, collideActor: Hero) => {
                // make a random enemy and a random goodie.  Put them in X coordinates relative to the trigger
                //jl.world.makeEnemy({ x: trigger.getXPosition() + 8 + jl.getRandom(10), y: jl.getRandom(8), width: .5, height: .5, img: "redball.png" });
                //jl.world.makeGoodie({ x: trigger.getXPosition() + 9 + jl.getRandom(10), y: jl.getRandom(8), width: .5, height: .5, img: "blueball.png" });
                // move the trigger so we can hit it again
                //trigger.setPosition(trigger.getXPosition() + 16, trigger.getYPosition());

                 // Create a pause scene that has a back button on it, and a button
        // for pausing the level
                //jl.hud.addTapControl({ x: 0, y: 0, width: 1, height: 1, img: "red.png" }, (hudX: number, hudY: number) => {
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                        
                        overlay.addTapControl({ x: 3.05, y: 1.10, width: 10, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                            //jl.nav.doChooser(1);
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 1.50, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "Question 1");
                    
                        overlay.addTapControl({ x: 3, y: 3.5, width: 10.00, height: 1.2, img: "answer_bar.png" }, () => {
                            //jl.nav.doChooser(1);
                            //img: "question_bar.png";
                            //overlay.addTapControl({ x: 3, y: 3.5, width: 10.00, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            overlay.addTapControl({ x: 3, y: 3.25, width: 10.00, height: 2, img: "wrong_bar.png" }, () => {
                                jl.nav.dismissOverlayScene();
                                return true;
                            })
                            return true;
                       });
                        overlay.addText({ center: false, x: 3.4, y: 3.85, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #1");

                        overlay.addTapControl({ x: 3, y: 4.75, width: 10.00, height: 1.2, img: "answer_bar.png" }, () => {
                            //jl.nav.doChooser(1);
                            //img: "question_bar.png";
                            //overlay.addTapControl({ x: 3, y: 3.5, width: 10.00, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            overlay.addTapControl({ x: 3, y: 4.5, width: 10.00, height: 2, img: "wrong_bar.png" }, () => {
                                jl.nav.dismissOverlayScene();
                                return true;
                            })
                            return true;
                       });
                        overlay.addText({ center: false, x: 3.4, y: 5.10, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #2");

                        overlay.addTapControl({ x: 3, y: 6.00, width: 10.00, height: 1.2, img: "answer_bar.png" }, () => {
                            //jl.nav.doChooser(1);
                            //img: "question_bar.png";
                            //overlay.addTapControl({ x: 3, y: 3.5, width: 10.00, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            overlay.addTapControl({ x: 3, y: 5.75, width: 10.00, height: 1.75, img: "right_bar.png" }, () => {
                                jl.nav.dismissOverlayScene();
                                return true;
                            })
                            return true;
                       });
                        overlay.addText({ center: false, x: 3.4, y: 6.36, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #3");

                        overlay.addTapControl({ x: 3, y: 7.25, width: 10.00, height: 1.2, img: "answer_bar.png" }, () => {
                            //jl.nav.doChooser(1);
                            //img: "question_bar.png";
                            //overlay.addTapControl({ x: 3, y: 3.5, width: 10.00, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            overlay.addTapControl({ x: 3, y: 7.00, width: 10.00, height: 2, img: "wrong_bar.png" }, () => {
                                jl.nav.dismissOverlayScene();
                                return true;
                            })
                            return true;
                       });
                        overlay.addText({ center: false, x: 3.4, y: 7.6, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #4");

                        // overlay.addTapControl({ x: 7, y: 1, width: 1, height: 1, img: "red.png" }, () => {
                        //     jl.nav.dismissOverlayScene();
                        //     jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        //         // clear the pausescene, draw another one
                        //         overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, () => {
                        //             jl.nav.dismissOverlayScene();
                        //             return true;
                        //         });
                        //         overlay.addText({ center: true, x: 8, y: 4.5, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "This is a second pause scene!");
                        //     });
                        //     return true;
                        // });
                    });
                    return true;
                //});
            };
        trigger1.setHeroCollisionCallback(lc);
        // No transfer of momeuntum when the hero collides with the trigger
        trigger1.setCollisionsEnabled(false);

        let trigger2 = jl.world.makeObstacle({ box: true, x: 30, y: 5, width: 2, height: 2, img: "question_box.png" });
        
            let lc2 =
            // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
            // and a new obstacle on the screen.  We'll randomize their placement just a bit.
            // Also move the obstacle forward, so we can hit it again.
            (thisActor: Obstacle, collideActor: Hero) => {
                // make a random enemy and a random goodie.  Put them in X coordinates relative to the trigger
                //jl.world.makeEnemy({ x: trigger.getXPosition() + 8 + jl.getRandom(10), y: jl.getRandom(8), width: .5, height: .5, img: "redball.png" });
                //jl.world.makeGoodie({ x: trigger.getXPosition() + 9 + jl.getRandom(10), y: jl.getRandom(8), width: .5, height: .5, img: "blueball.png" });
                // move the trigger so we can hit it again
                //trigger.setPosition(trigger.getXPosition() + 16, trigger.getYPosition());

                 // Create a pause scene that has a back button on it, and a button
        // for pausing the level
                //jl.hud.addTapControl({ x: 0, y: 0, width: 1, height: 1, img: "red.png" }, (hudX: number, hudY: number) => {
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                        
                        overlay.addTapControl({ x: 3.05, y: 1.10, width: 10, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                            //jl.nav.doChooser(1);
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 1.50, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "Question 2");
                    
                        overlay.addTapControl({ x: 3, y: 3.5, width: 10.00, height: 1.2, img: "answer_bar.png" }, () => {
                            //jl.nav.doChooser(1);
                            //img: "question_bar.png";
                            //overlay.addTapControl({ x: 3, y: 3.5, width: 10.00, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            overlay.addTapControl({ x: 3, y: 3.25, width: 10.00, height: 2, img: "wrong_bar.png" }, () => {
                                jl.nav.dismissOverlayScene();
                                return true;
                            })
                            return true;
                       });
                        overlay.addText({ center: false, x: 3.4, y: 3.85, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #1");

                        overlay.addTapControl({ x: 3, y: 4.75, width: 10.00, height: 1.2, img: "answer_bar.png" }, () => {
                            //jl.nav.doChooser(1);
                            //img: "question_bar.png";
                            //overlay.addTapControl({ x: 3, y: 3.5, width: 10.00, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            overlay.addTapControl({ x: 3, y: 4.5, width: 10.00, height: 2, img: "wrong_bar.png" }, () => {
                                jl.nav.dismissOverlayScene();
                                return true;
                            })
                            return true;
                       });
                        overlay.addText({ center: false, x: 3.4, y: 5.10, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #2");

                        overlay.addTapControl({ x: 3, y: 6.00, width: 10.00, height: 1.2, img: "answer_bar.png" }, () => {
                            //jl.nav.doChooser(1);
                            //img: "question_bar.png";
                            //overlay.addTapControl({ x: 3, y: 3.5, width: 10.00, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            overlay.addTapControl({ x: 3, y: 5.75, width: 10.00, height: 1.75, img: "right_bar.png" }, () => {
                                jl.nav.dismissOverlayScene();
                                return true;
                            })
                            return true;
                       });
                        overlay.addText({ center: false, x: 3.4, y: 6.36, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #3");

                        overlay.addTapControl({ x: 3, y: 7.25, width: 10.00, height: 1.2, img: "answer_bar.png" }, () => {
                            //jl.nav.doChooser(1);
                            //img: "question_bar.png";
                            //overlay.addTapControl({ x: 3, y: 3.5, width: 10.00, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            overlay.addTapControl({ x: 3, y: 7.00, width: 10.00, height: 2, img: "wrong_bar.png" }, () => {
                                jl.nav.dismissOverlayScene();
                                return true;
                            })
                            return true;
                       });
                        overlay.addText({ center: false, x: 3.4, y: 7.6, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #4");

                        // overlay.addTapControl({ x: 7, y: 1, width: 1, height: 1, img: "red.png" }, () => {
                        //     jl.nav.dismissOverlayScene();
                        //     jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        //         // clear the pausescene, draw another one
                        //         overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, () => {
                        //             jl.nav.dismissOverlayScene();
                        //             return true;
                        //         });
                        //         overlay.addText({ center: true, x: 8, y: 4.5, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "This is a second pause scene!");
                        //     });
                        //     return true;
                        // });
                    });
                    return true;
                //});
            };
        trigger2.setHeroCollisionCallback(lc2);
        // No transfer of momeuntum when the hero collides with the trigger
        trigger2.setCollisionsEnabled(false);


        let trigger3 = jl.world.makeObstacle({ box: true, x: 45, y: 5, width: 2, height: 2, img: "question_box.png" });
        
        let lc3 =
        // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
        // and a new obstacle on the screen.  We'll randomize their placement just a bit.
        // Also move the obstacle forward, so we can hit it again.
        (thisActor: Obstacle, collideActor: Hero) => {
            // make a random enemy and a random goodie.  Put them in X coordinates relative to the trigger
            //jl.world.makeEnemy({ x: trigger.getXPosition() + 8 + jl.getRandom(10), y: jl.getRandom(8), width: .5, height: .5, img: "redball.png" });
            //jl.world.makeGoodie({ x: trigger.getXPosition() + 9 + jl.getRandom(10), y: jl.getRandom(8), width: .5, height: .5, img: "blueball.png" });
            // move the trigger so we can hit it again
            //trigger.setPosition(trigger.getXPosition() + 16, trigger.getYPosition());

             // Create a pause scene that has a back button on it, and a button
            // for pausing the level
            //jl.hud.addTapControl({ x: 0, y: 0, width: 1, height: 1, img: "red.png" }, (hudX: number, hudY: number) => {
                jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                    //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                    
                    overlay.addTapControl({ x: 3.05, y: 1.10, width: 10, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                        jl.nav.dismissOverlayScene();
                        //jl.nav.doChooser(1);
                        return true;
                    });
                    overlay.addText({ center: false, x: 3.4, y: 1.50, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "Question 3");
                
                    overlay.addTapControl({ x: 3, y: 3.5, width: 10.00, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                        jl.nav.dismissOverlayScene();
                        //jl.nav.doChooser(1);
                        return true;
                    });
                    overlay.addText({ center: false, x: 3.4, y: 3.85, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #1");

                    overlay.addTapControl({ x: 3, y: 4.75, width: 10, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                        jl.nav.dismissOverlayScene();
                        //jl.score.winLevel();
                        return true;
                    });
                    overlay.addText({ center: false, x: 3.4, y: 5.10, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #2");

                    overlay.addTapControl({ x: 3, y: 6.00, width: 10, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                        jl.nav.dismissOverlayScene();
                       // jl.score.winLevel();
                        return true;
                    });
                    overlay.addText({ center: false, x: 3.4, y: 6.36, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #3");

                    overlay.addTapControl({ x: 3, y: 7.25, width: 10, height: 1.2, img: "answer_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        //jl.score.loseLevel();
                        return true;
                    });
                    overlay.addText({ center: false, x: 3.4, y: 7.6, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #4");

                    // overlay.addTapControl({ x: 7, y: 1, width: 1, height: 1, img: "red.png" }, () => {
                    //     jl.nav.dismissOverlayScene();
                    //     jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                    //         // clear the pausescene, draw another one
                    //         overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, () => {
                    //             jl.nav.dismissOverlayScene();
                    //             return true;
                    //         });
                    //         overlay.addText({ center: true, x: 8, y: 4.5, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "This is a second pause scene!");
                    //     });
                    //     return true;
                    // });
                });
                return true;
            //});
        };
    trigger3.setHeroCollisionCallback(lc3);
    // No transfer of momeuntum when the hero collides with the trigger
    trigger3.setCollisionsEnabled(false);


    let trigger4 = jl.world.makeObstacle({ box: true, x: 60, y: 5, width: 2, height: 2, img: "question_box.png" });
        
            let lc4 =
            // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
            // and a new obstacle on the screen.  We'll randomize their placement just a bit.
            // Also move the obstacle forward, so we can hit it again.
            (thisActor: Obstacle, collideActor: Hero) => {
                // make a random enemy and a random goodie.  Put them in X coordinates relative to the trigger
                //jl.world.makeEnemy({ x: trigger.getXPosition() + 8 + jl.getRandom(10), y: jl.getRandom(8), width: .5, height: .5, img: "redball.png" });
                //jl.world.makeGoodie({ x: trigger.getXPosition() + 9 + jl.getRandom(10), y: jl.getRandom(8), width: .5, height: .5, img: "blueball.png" });
                // move the trigger so we can hit it again
                //trigger.setPosition(trigger.getXPosition() + 16, trigger.getYPosition());

                 // Create a pause scene that has a back button on it, and a button
        // for pausing the level
                //jl.hud.addTapControl({ x: 0, y: 0, width: 1, height: 1, img: "red.png" }, (hudX: number, hudY: number) => {
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                        
                        overlay.addTapControl({ x: 3.05, y: 1.10, width: 10, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                            //jl.nav.doChooser(1);
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 1.50, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "Question 4");
                    
                        overlay.addTapControl({ x: 3, y: 3.5, width: 10.00, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                            //jl.nav.doChooser(1);
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 3.85, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #1");

                        overlay.addTapControl({ x: 3, y: 4.75, width: 10, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                            //jl.score.winLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 5.10, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #2");

                        overlay.addTapControl({ x: 3, y: 6.00, width: 10, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                           // jl.score.winLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 6.36, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #3");

                        overlay.addTapControl({ x: 3, y: 7.25, width: 10, height: 1.2, img: "answer_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            //jl.score.loseLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 7.6, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #4");

                        // overlay.addTapControl({ x: 7, y: 1, width: 1, height: 1, img: "red.png" }, () => {
                        //     jl.nav.dismissOverlayScene();
                        //     jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        //         // clear the pausescene, draw another one
                        //         overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, () => {
                        //             jl.nav.dismissOverlayScene();
                        //             return true;
                        //         });
                        //         overlay.addText({ center: true, x: 8, y: 4.5, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "This is a second pause scene!");
                        //     });
                        //     return true;
                        // });
                    });
                    return true;
                //});
            };
        trigger4.setHeroCollisionCallback(lc4);
        // No transfer of momeuntum when the hero collides with the trigger
        trigger4.setCollisionsEnabled(false);


        let trigger5 = jl.world.makeObstacle({ box: true, x: 75, y: 5, width: 2, height: 2, img: "question_box.png" });
        
            let lc5 =
            // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
            // and a new obstacle on the screen.  We'll randomize their placement just a bit.
            // Also move the obstacle forward, so we can hit it again.
            (thisActor: Obstacle, collideActor: Hero) => {
                // make a random enemy and a random goodie.  Put them in X coordinates relative to the trigger
                //jl.world.makeEnemy({ x: trigger.getXPosition() + 8 + jl.getRandom(10), y: jl.getRandom(8), width: .5, height: .5, img: "redball.png" });
                //jl.world.makeGoodie({ x: trigger.getXPosition() + 9 + jl.getRandom(10), y: jl.getRandom(8), width: .5, height: .5, img: "blueball.png" });
                // move the trigger so we can hit it again
                //trigger.setPosition(trigger.getXPosition() + 16, trigger.getYPosition());

                 // Create a pause scene that has a back button on it, and a button
        // for pausing the level
                //jl.hud.addTapControl({ x: 0, y: 0, width: 1, height: 1, img: "red.png" }, (hudX: number, hudY: number) => {
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                        
                        overlay.addTapControl({ x: 3.05, y: 1.10, width: 10, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                            //jl.nav.doChooser(1);
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 1.50, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "Question 5");
                    
                        overlay.addTapControl({ x: 3, y: 3.5, width: 10.00, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                            //jl.nav.doChooser(1);
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 3.85, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #1");

                        overlay.addTapControl({ x: 3, y: 4.75, width: 10, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                            //jl.score.winLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 5.10, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #2");

                        overlay.addTapControl({ x: 3, y: 6.00, width: 10, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                           // jl.score.winLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 6.36, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #3");

                        overlay.addTapControl({ x: 3, y: 7.25, width: 10, height: 1.2, img: "answer_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            //jl.score.loseLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 7.6, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #4");

                        // overlay.addTapControl({ x: 7, y: 1, width: 1, height: 1, img: "red.png" }, () => {
                        //     jl.nav.dismissOverlayScene();
                        //     jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        //         // clear the pausescene, draw another one
                        //         overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, () => {
                        //             jl.nav.dismissOverlayScene();
                        //             return true;
                        //         });
                        //         overlay.addText({ center: true, x: 8, y: 4.5, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "This is a second pause scene!");
                        //     });
                        //     return true;
                        // });
                    });
                    return true;
                //});
            };
        trigger5.setHeroCollisionCallback(lc5);
        // No transfer of momeuntum when the hero collides with the trigger
        trigger5.setCollisionsEnabled(false);


        let trigger6 = jl.world.makeObstacle({ box: true, x: 90, y: 5, width: 2, height: 2, img: "question_box.png" });
        
            let lc6 =
            // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
            // and a new obstacle on the screen.  We'll randomize their placement just a bit.
            // Also move the obstacle forward, so we can hit it again.
            (thisActor: Obstacle, collideActor: Hero) => {
                // make a random enemy and a random goodie.  Put them in X coordinates relative to the trigger
                //jl.world.makeEnemy({ x: trigger.getXPosition() + 8 + jl.getRandom(10), y: jl.getRandom(8), width: .5, height: .5, img: "redball.png" });
                //jl.world.makeGoodie({ x: trigger.getXPosition() + 9 + jl.getRandom(10), y: jl.getRandom(8), width: .5, height: .5, img: "blueball.png" });
                // move the trigger so we can hit it again
                //trigger.setPosition(trigger.getXPosition() + 16, trigger.getYPosition());

                 // Create a pause scene that has a back button on it, and a button
        // for pausing the level
                //jl.hud.addTapControl({ x: 0, y: 0, width: 1, height: 1, img: "red.png" }, (hudX: number, hudY: number) => {
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                        
                        overlay.addTapControl({ x: 3.05, y: 1.10, width: 10, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                            //jl.nav.doChooser(1);
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 1.50, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "Question 6");
                    
                        overlay.addTapControl({ x: 3, y: 3.5, width: 10.00, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                            //jl.nav.doChooser(1);
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 3.85, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #1");

                        overlay.addTapControl({ x: 3, y: 4.75, width: 10, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                            //jl.score.winLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 5.10, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #2");

                        overlay.addTapControl({ x: 3, y: 6.00, width: 10, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                           // jl.score.winLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 6.36, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #3");

                        overlay.addTapControl({ x: 3, y: 7.25, width: 10, height: 1.2, img: "answer_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            //jl.score.loseLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 7.6, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #4");

                        // overlay.addTapControl({ x: 7, y: 1, width: 1, height: 1, img: "red.png" }, () => {
                        //     jl.nav.dismissOverlayScene();
                        //     jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        //         // clear the pausescene, draw another one
                        //         overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, () => {
                        //             jl.nav.dismissOverlayScene();
                        //             return true;
                        //         });
                        //         overlay.addText({ center: true, x: 8, y: 4.5, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "This is a second pause scene!");
                        //     });
                        //     return true;
                        // });
                    });
                    return true;
                //});
            };
        trigger6.setHeroCollisionCallback(lc6);
        // No transfer of momeuntum when the hero collides with the trigger
        trigger6.setCollisionsEnabled(false);


        let trigger7 = jl.world.makeObstacle({ box: true, x: 105, y: 5, width: 2, height: 2, img: "question_box.png" });
        
            let lc7 =
            // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
            // and a new obstacle on the screen.  We'll randomize their placement just a bit.
            // Also move the obstacle forward, so we can hit it again.
            (thisActor: Obstacle, collideActor: Hero) => {
                // make a random enemy and a random goodie.  Put them in X coordinates relative to the trigger
                //jl.world.makeEnemy({ x: trigger.getXPosition() + 8 + jl.getRandom(10), y: jl.getRandom(8), width: .5, height: .5, img: "redball.png" });
                //jl.world.makeGoodie({ x: trigger.getXPosition() + 9 + jl.getRandom(10), y: jl.getRandom(8), width: .5, height: .5, img: "blueball.png" });
                // move the trigger so we can hit it again
                //trigger.setPosition(trigger.getXPosition() + 16, trigger.getYPosition());

                 // Create a pause scene that has a back button on it, and a button
        // for pausing the level
                //jl.hud.addTapControl({ x: 0, y: 0, width: 1, height: 1, img: "red.png" }, (hudX: number, hudY: number) => {
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                        
                        overlay.addTapControl({ x: 3.05, y: 1.10, width: 10, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                            //jl.nav.doChooser(1);
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 1.50, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "Question 7");
                    
                        overlay.addTapControl({ x: 3, y: 3.5, width: 10.00, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                            //jl.nav.doChooser(1);
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 3.85, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #1");

                        overlay.addTapControl({ x: 3, y: 4.75, width: 10, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                            //jl.score.winLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 5.10, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #2");

                        overlay.addTapControl({ x: 3, y: 6.00, width: 10, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                           // jl.score.winLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 6.36, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #3");

                        overlay.addTapControl({ x: 3, y: 7.25, width: 10, height: 1.2, img: "answer_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            //jl.score.loseLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 7.6, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #4");

                        // overlay.addTapControl({ x: 7, y: 1, width: 1, height: 1, img: "red.png" }, () => {
                        //     jl.nav.dismissOverlayScene();
                        //     jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        //         // clear the pausescene, draw another one
                        //         overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, () => {
                        //             jl.nav.dismissOverlayScene();
                        //             return true;
                        //         });
                        //         overlay.addText({ center: true, x: 8, y: 4.5, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "This is a second pause scene!");
                        //     });
                        //     return true;
                        // });
                    });
                    return true;
                //});
            };
        trigger7.setHeroCollisionCallback(lc7);
        // No transfer of momeuntum when the hero collides with the trigger
        trigger7.setCollisionsEnabled(false);


        let trigger8 = jl.world.makeObstacle({ box: true, x: 120, y: 5, width: 2, height: 2, img: "question_box.png" });
        
            let lc8 =
            // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
            // and a new obstacle on the screen.  We'll randomize their placement just a bit.
            // Also move the obstacle forward, so we can hit it again.
            (thisActor: Obstacle, collideActor: Hero) => {
                // make a random enemy and a random goodie.  Put them in X coordinates relative to the trigger
                //jl.world.makeEnemy({ x: trigger.getXPosition() + 8 + jl.getRandom(10), y: jl.getRandom(8), width: .5, height: .5, img: "redball.png" });
                //jl.world.makeGoodie({ x: trigger.getXPosition() + 9 + jl.getRandom(10), y: jl.getRandom(8), width: .5, height: .5, img: "blueball.png" });
                // move the trigger so we can hit it again
                //trigger.setPosition(trigger.getXPosition() + 16, trigger.getYPosition());

                 // Create a pause scene that has a back button on it, and a button
        // for pausing the level
                //jl.hud.addTapControl({ x: 0, y: 0, width: 1, height: 1, img: "red.png" }, (hudX: number, hudY: number) => {
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                        
                        overlay.addTapControl({ x: 3.05, y: 1.10, width: 10, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                            //jl.nav.doChooser(1);
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 1.50, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "Question 8");
                    
                        overlay.addTapControl({ x: 3, y: 3.5, width: 10.00, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            //jl.nav.doChooser(1);
                            jl.nav.dismissOverlayScene();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 3.85, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #1");

                        overlay.addTapControl({ x: 3, y: 4.75, width: 10, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                            //jl.score.winLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 5.10, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #2");

                        overlay.addTapControl({ x: 3, y: 6.00, width: 10, height: 1.2, img: "answer_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            jl.nav.dismissOverlayScene();
                           // jl.score.winLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 6.36, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #3");

                        overlay.addTapControl({ x: 3, y: 7.25, width: 10, height: 1.2, img: "answer_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            //jl.score.loseLevel();
                            return true;
                        });
                        overlay.addText({ center: false, x: 3.4, y: 7.6, face: "Arial", color: "#000000", size: 32, z: 0 }, () => "answer #4");

                        // overlay.addTapControl({ x: 7, y: 1, width: 1, height: 1, img: "red.png" }, () => {
                        //     jl.nav.dismissOverlayScene();
                        //     jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        //         // clear the pausescene, draw another one
                        //         overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, () => {
                        //             jl.nav.dismissOverlayScene();
                        //             return true;
                        //         });
                        //         overlay.addText({ center: true, x: 8, y: 4.5, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "This is a second pause scene!");
                        //     });
                        //     return true;
                        // });
                    });
                    return true;
                //});
            };
        trigger8.setHeroCollisionCallback(lc8);
        // No transfer of momeuntum when the hero collides with the trigger
        trigger8.setCollisionsEnabled(false);


    }
    // Put the level number in the top right corner of every level
    jl.hud.addText({ x: 15, y: .5, face: "arial", color: "#872436", size: 22, z: 2 }, () => "Level " + index);
}

/**
 * This is a standard way of drawing a black screen with some text, to serve as
 * the welcome screen for the game
 */
export function welcomeMessage(jl: JetLagApi, message: string) {
    // this next line can be confusing.  We are going to put some text in the middle of the
    // pre-scene, so it is centered at (8, 4.5).  The text will be white (#FFFFF) because
    // the default pre-scene background is black, size 32pt.  The rest of the line provides
    // some power that we don't take advantage of yet.
    //
    // Note: '\n' means insert a line break into the text.
    jl.nav.setWelcomeSceneBuilder((overlay: OverlayApi) => {
        overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, () => {
            jl.nav.dismissOverlayScene();
            return true;
        });
        overlay.addText({ center: true, x: 8, y: 4.5, face: "Arial", color: "#FFFFFF", size: 28, z: 0 }, () => message);
    });
}

export function questionScreen(jl: JetLagApi, message: string) {
    // this next line can be confusing.  We are going to put some text in the middle of the
    // pre-scene, so it is centered at (8, 4.5).  The text will be white (#FFFFF) because
    // the default pre-scene background is black, size 32pt.  The rest of the line provides
    // some power that we don't take advantage of yet.
    //
    // Note: '\n' means insert a line break into the text.
    jl.nav.setWelcomeSceneBuilder((overlay: OverlayApi) => {
        overlay.addTapControl({ x: 0, y: 0, width: 10, height: 5, img: "black.png" }, () => {
            jl.nav.dismissOverlayScene();
            return true;
        });
        overlay.addText({ center: true, x: 8, y: 4.5, face: "Arial", color: "#FFFFFF", size: 28, z: 0 }, () => message);
    });
}

/**
 * This is a standard way of drawing a black screen with some text, to serve as
 * the win screen for the game
 */
export function winMessage(jl: JetLagApi, message: string, callback: () => void = null) {
    jl.nav.setWinSceneBuilder((overlay: OverlayApi) => {
        overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, () => {
            jl.nav.nextLevel();
            return true;
        });
        overlay.addText({ center: true, x: 8, y: 4.5, face: "Arial", color: "#FFFFFF", size: 28, z: 0 }, () => message);
        if (callback !== null)
            callback();
    });
}

/**
 * This is a standard way of drawing a black screen with some text, to serve as
 * the lose screen for the game
 */
export function loseMessage(jl: JetLagApi, message: string, callback: () => void = null) {
    jl.nav.setLoseSceneBuilder((overlay: OverlayApi) => {
        overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, () => {
            jl.nav.repeatLevel();
            return true;
        });
        overlay.addText({ center: true, x: 8, y: 4.5, face: "Arial", color: "#FFFFFF", size: 28, z: 0 }, () => message);
        if (callback !== null)
            callback();
    });
}
