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
    if (index == 1) {
        jl.world.setCameraBounds(160, 9);
        jl.world.drawBoundingBox(0, 0, 160, 9, "", 1, 0, 1);
        let h = jl.world.makeHero({ x: 0, y: 3, width: 2, height: 4, img: "astro_side.png" });
        h.setDefaultAnimation(jl.makeAnimation(200, true, ["1.png", "2.png","3.png","4.png","5.png","6.png",]));
        h.disableRotation();
        h.setPhysics(5, 0, 0.6);
        h.addVelocity(1, 0);
        jl.world.setCameraChase(h);
        jl.world.makeDestination({ x: 159, y: 0, width: 1, height: 1, img: "mustardball.png" });
        jl.score.setVictoryDestination(1);

        // set up our background, with a few layers
        jl.world.setBackgroundColor(0x101010);
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

        let score = 0;

        let trigger1 = jl.world.makeObstacle({ box: true, x: 15, y: 5.50, width: 3, height: 2, img: "question_box.png" });
        //trigger1.setDisappearAnimation(jl.makeComplexAnimation(false).to("question_box.png", 10).to("question_box 1.png", 10), 0, 0, .5, .5);
        //trigger1.setDisappearAnimation(jl.makeComplexAnimation(false).to("question_box.png", 200).to("question_box 1.png", 200).to("starburst1.png", 200).to("starburst4.png", 200), 0, 0, .5, .5);
        //trigger1.setDisappearAnimation(jl.makeComplexAnimation(false).to("question_box.png", 10).to("question_box 1.png", 10), 0, 0, .5, .5);

        let lc =
        // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
        // and a new obstacle on the screen.  We'll randomize their placement just a bit.
        // Also move the obstacle forward, so we can hit it again.
        (thisActor: Obstacle, collideActor: Hero) => {
                thisActor.remove(true);
                jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                    //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#101010", size: 32, z: 0 }, () => "Game Paused");
                    overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                        return true;
                    });

                    overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                        return true;
                    });
                    overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 1: 16 ÷ 4 = ?");

                    let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                            score = score + 1;
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "4");

                    let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "8");

                    let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "6");

                    let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "12");
                });
                return true;
        };
    trigger1.setHeroCollisionCallback(lc);
    // No transfer of momeuntum when the hero collides with the trigger
    trigger1.setCollisionsEnabled(false);

    let trigger2 = jl.world.makeObstacle({ box: true, x: 30, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
        let lc2 =
        // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
        // and a new obstacle on the screen.  We'll randomize their placement just a bit.
        // Also move the obstacle forward, so we can hit it again.
        (thisActor: Obstacle, collideActor: Hero) => {
            thisActor.remove(true);
            jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                    return true;
                });
                
                overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                    return true;
                });
                overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 2: 32 ÷ 4 = ?");
            
                let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "9");

                let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                        score = score + 1;
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "8");

                let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "7");

                let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "14");
            });
            return true;
    };
    trigger2.setHeroCollisionCallback(lc2);
    // No transfer of momeuntum when the hero collides with the trigger
    trigger2.setCollisionsEnabled(false);


    let trigger3 = jl.world.makeObstacle({ box: true, x: 45, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
    let lc3 =
    // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
    // and a new obstacle on the screen.  We'll randomize their placement just a bit.
    // Also move the obstacle forward, so we can hit it again.
    (thisActor: Obstacle, collideActor: Hero) => {
        thisActor.remove(true);
        jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
            //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
            overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                return true;
            });
            
            overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                return true;
            });
            overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 3: 12 ÷ 6 = ?");
        
            let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                a11.remove(true);    
                a12.remove(true);
                a13.remove(true);
                a14.remove(true);
                overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                    jl.nav.dismissOverlayScene();
                    return true;
                })
                return true;
           });
            overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "3");

            let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                a11.remove(true);    
                a12.remove(true);
                a13.remove(true);
                a14.remove(true);
                overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                    jl.nav.dismissOverlayScene();
                    return true;
                })
                return true;
           });
            overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "4");

            let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                a11.remove(true);    
                a12.remove(true);
                a13.remove(true);
                a14.remove(true);
                overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                    score = score + 1;
                    jl.nav.dismissOverlayScene();
                    return true;
                })
                return true;
           });
            overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "2");

            let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                a11.remove(true);    
                a12.remove(true);
                a13.remove(true);
                a14.remove(true);
                overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                    jl.nav.dismissOverlayScene();
                    return true;
                })
                return true;
           });
            overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "6");
        });
        return true;
};
trigger3.setHeroCollisionCallback(lc3);
// No transfer of momeuntum when the hero collides with the trigger
trigger3.setCollisionsEnabled(false);


let trigger4 = jl.world.makeObstacle({ box: true, x: 60, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
        let lc4 =
        // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
        // and a new obstacle on the screen.  We'll randomize their placement just a bit.
        // Also move the obstacle forward, so we can hit it again.
        (thisActor: Obstacle, collideActor: Hero) => {
            thisActor.remove(true);
            jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                    return true;
                });
                
                overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                    return true;
                });
                overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 4: 36 ÷ 9 = ?");
            
                let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "6");

                let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "5");

                let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                        score = score + 1;
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "4");

                let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "3");
            });
            return true;
    };
    trigger4.setHeroCollisionCallback(lc4);
    // No transfer of momeuntum when the hero collides with the trigger
    trigger4.setCollisionsEnabled(false);


    let trigger5 = jl.world.makeObstacle({ box: true, x: 75, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
        let lc5 =
        // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
        // and a new obstacle on the screen.  We'll randomize their placement just a bit.
        // Also move the obstacle forward, so we can hit it again.
        (thisActor: Obstacle, collideActor: Hero) => {
            thisActor.remove(true);
            jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                    return true;
                });
                
                overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                    return true;
                });
                overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 5: 81 ÷ 9  = ?");
            
                let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "6");

                let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "7");

                let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "8");

                let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                        score = score + 1;
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "9");
            });
            return true;
    };
    trigger5.setHeroCollisionCallback(lc5);
    // No transfer of momeuntum when the hero collides with the trigger
    trigger5.setCollisionsEnabled(false);


    let trigger6 = jl.world.makeObstacle({ box: true, x: 90, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
        let lc6 =
        // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
        // and a new obstacle on the screen.  We'll randomize their placement just a bit.
        // Also move the obstacle forward, so we can hit it again.
        (thisActor: Obstacle, collideActor: Hero) => {
            thisActor.remove(true);
            jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                    return true;
                });
                
                overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                    return true;
                });
                overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 6: 48 ÷ 6 = ?");
            
                let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "5");

                let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "6");

                let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "7");

                let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                        score = score + 1;
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "8");
            });
            return true;
    };
    trigger6.setHeroCollisionCallback(lc6);
    // No transfer of momeuntum when the hero collides with the trigger
    trigger6.setCollisionsEnabled(false);


    let trigger7 = jl.world.makeObstacle({ box: true, x: 105, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
        let lc7 =
        // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
        // and a new obstacle on the screen.  We'll randomize their placement just a bit.
        // Also move the obstacle forward, so we can hit it again.
        (thisActor: Obstacle, collideActor: Hero) => {
            thisActor.remove(true);
            jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                    return true;
                });
                
                overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                    return true;
                });
                overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 7: 35 ÷ 5 = ?");
            
                let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "6");

                let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                        score = score + 1;
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "7");

                let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "8");

                let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "9");
            });
            return true;
    };
    trigger7.setHeroCollisionCallback(lc7);
    // No transfer of momeuntum when the hero collides with the trigger
    trigger7.setCollisionsEnabled(false);


    let trigger8 = jl.world.makeObstacle({ box: true, x: 120, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
        let lc8 =
        // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
        // and a new obstacle on the screen.  We'll randomize their placement just a bit.
        // Also move the obstacle forward, so we can hit it again.
        (thisActor: Obstacle, collideActor: Hero) => {
            thisActor.remove(true);
            jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                    return true;
                });
                
                overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                    return true;
                });
                overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 8: 56 ÷ 7 = ?");
            
                let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "6");

                let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "7");

                let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "9");

                let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                        score = score + 1;
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "8");
            });
            return true;
    };
    trigger8.setHeroCollisionCallback(lc8);
    // No transfer of momeuntum when the hero collides with the trigger
    trigger8.setCollisionsEnabled(false);

    let trigger9 = jl.world.makeObstacle({ box: true, x: 125, y: 2, width: 4.5, height: 5, img: "flag.png" });
    
        let lc9 =
        (thisActor: Obstacle, collideActor: Hero) => {
            jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "entire_background.png" }, (hudx: number, hudY: number) => {
                    jl.nav.dismissOverlayScene();
                    return true;
                });

                overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#ffffff", size: 100, z: 0 }, () => "CONGRATULATIONS!");
                overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#ffffff", size: 80, z: 0 }, () => "Your score is " + score + "/8");

            });
            return true;
    };
    trigger9.setHeroCollisionCallback(lc9);
    // No transfer of momeuntum when the hero collides with the trigger
    trigger9.setCollisionsEnabled(false);

}
    // Show how to make an "infinite" level, and add a foreground layer
    else if (index == 2) {
        jl.world.setCameraBounds(160, 9);
        jl.world.drawBoundingBox(0, 0, 160, 9, "", 1, 0, 1);
        let h = jl.world.makeHero({ x: 0, y: 3, width: 2, height: 4, img: "astro_side.png" });
        h.setDefaultAnimation(jl.makeAnimation(200, true, ["1.png", "2.png","3.png","4.png","5.png","6.png",]));
        h.disableRotation();
        h.setPhysics(5, 0, 0.6);
        h.addVelocity(1, 0);
        jl.world.setCameraChase(h);
        jl.world.makeDestination({ x: 159, y: 0, width: 1, height: 1, img: "mustardball.png" });
        jl.score.setVictoryDestination(1);

        // set up our background, with a few layers
        jl.world.setBackgroundColor(0x101010);
        //jl.world.drawPicture({ x: 0, y: 0, width: 16, height: 9, img: "lvl1_background.png", z: -1 });
        jl.world.addHorizontalBackgroundLayer({ x: 0, y: 0, width: 16, height: 9, img: "lvl2_moon.png"}, 1);
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

        let score = 0;

        let trigger1 = jl.world.makeObstacle({ box: true, x: 15, y: 5.50, width: 3, height: 2, img: "question_box.png" });
        //trigger1.setDisappearAnimation(jl.makeComplexAnimation(false).to("question_box.png", 10).to("question_box 1.png", 10), 0, 0, .5, .5);
        //trigger1.setDisappearAnimation(jl.makeComplexAnimation(false).to("question_box.png", 200).to("question_box 1.png", 200).to("starburst1.png", 200).to("starburst4.png", 200), 0, 0, .5, .5);
        //trigger1.setDisappearAnimation(jl.makeComplexAnimation(false).to("question_box.png", 10).to("question_box 1.png", 10), 0, 0, .5, .5);

        let lc =
        // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
        // and a new obstacle on the screen.  We'll randomize their placement just a bit.
        // Also move the obstacle forward, so we can hit it again.
        (thisActor: Obstacle, collideActor: Hero) => {
                thisActor.remove(true);
                jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                    //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                    overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                        return true;
                    });
                    
                    overlay.addTapControl({ x: 4, y: .75, width: 8, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                        return true;
                    });
                    overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 9: 30 divided into groups of 5");
                
                    let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "4");

                    let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                            score = score + 1;
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "6");

                    let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "5");

                    let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "7");
                });
                return true;
        };
    trigger1.setHeroCollisionCallback(lc);
    // No transfer of momeuntum when the hero collides with the trigger
    trigger1.setCollisionsEnabled(false);

    let trigger2 = jl.world.makeObstacle({ box: true, x: 30, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
        let lc2 =
        // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
        // and a new obstacle on the screen.  We'll randomize their placement just a bit.
        // Also move the obstacle forward, so we can hit it again.
        (thisActor: Obstacle, collideActor: Hero) => {
            thisActor.remove(true);
            jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                    return true;
                });
                
                overlay.addTapControl({  x: 4, y: .75, width: 8, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                    return true;
                });
                overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 10: 24 divided into groups of 4");
            
                let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "7");

                let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "8");

                let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "5");

                let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                        score = score + 1;
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "6");
            });
            return true;
    };
    trigger2.setHeroCollisionCallback(lc2);
    // No transfer of momeuntum when the hero collides with the trigger
    trigger2.setCollisionsEnabled(false);


    let trigger3 = jl.world.makeObstacle({ box: true, x: 45, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
    let lc3 =
    // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
    // and a new obstacle on the screen.  We'll randomize their placement just a bit.
    // Also move the obstacle forward, so we can hit it again.
    (thisActor: Obstacle, collideActor: Hero) => {
        thisActor.remove(true);
        jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
            //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
            overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                return true;
            });
            
            overlay.addTapControl({  x: 4, y: .75, width: 8, height: 2, img: "question_bar.png"  }, (eventPositionX: number, eventPositionY: number) => {
                return true;
            });
            overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 11: 10 divided into groups of 5");
        
            let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                a11.remove(true);    
                a12.remove(true);
                a13.remove(true);
                a14.remove(true);
                overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                    jl.nav.dismissOverlayScene();
                    return true;
                })
                return true;
           });
            overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "5");

            let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                a11.remove(true);    
                a12.remove(true);
                a13.remove(true);
                a14.remove(true);
                overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                    jl.nav.dismissOverlayScene();
                    return true;
                })
                return true;
           });
            overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "4");

            let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                a11.remove(true);    
                a12.remove(true);
                a13.remove(true);
                a14.remove(true);
                overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                    jl.nav.dismissOverlayScene();
                    return true;
                })
                return true;
           });
            overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "3");

            let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                a11.remove(true);    
                a12.remove(true);
                a13.remove(true);
                a14.remove(true);
                overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                    score = score + 1;
                    jl.nav.dismissOverlayScene();
                    return true;
                })
                return true;
           });
            overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "2");
        });
        return true;
};
trigger3.setHeroCollisionCallback(lc3);
// No transfer of momeuntum when the hero collides with the trigger
trigger3.setCollisionsEnabled(false);


let trigger4 = jl.world.makeObstacle({ box: true, x: 60, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
        let lc4 =
        // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
        // and a new obstacle on the screen.  We'll randomize their placement just a bit.
        // Also move the obstacle forward, so we can hit it again.
        (thisActor: Obstacle, collideActor: Hero) => {
            thisActor.remove(true);
            jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                    return true;
                });
                
                overlay.addTapControl({  x: 4, y: .75, width: 8, height: 2, img: "question_bar.png"  }, (eventPositionX: number, eventPositionY: number) => {
                    return true;
                });
                overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 12: 18 divided into groups of 9");
            
                let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "1");

                let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                        score = score + 1;
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "2");

                let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "3");

                let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "4");
            });
            return true;
    };
    trigger4.setHeroCollisionCallback(lc4);
    // No transfer of momeuntum when the hero collides with the trigger
    trigger4.setCollisionsEnabled(false);


    let trigger5 = jl.world.makeObstacle({ box: true, x: 75, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
        let lc5 =
        // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
        // and a new obstacle on the screen.  We'll randomize their placement just a bit.
        // Also move the obstacle forward, so we can hit it again.
        (thisActor: Obstacle, collideActor: Hero) => {
            thisActor.remove(true);
            jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                    return true;
                });
                
                overlay.addTapControl({  x: 4, y: .75, width: 8, height: 2, img: "question_bar.png"  }, (eventPositionX: number, eventPositionY: number) => {
                    return true;
                });
                overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 13: 15 divided into groups of 5");
            
                let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "7");

                let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "6");

                let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "5");

                let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                        score = score + 1;
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "3");
            });
            return true;
    };
    trigger5.setHeroCollisionCallback(lc5);
    // No transfer of momeuntum when the hero collides with the trigger
    trigger5.setCollisionsEnabled(false);


    let trigger6 = jl.world.makeObstacle({ box: true, x: 90, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
        let lc6 =
        // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
        // and a new obstacle on the screen.  We'll randomize their placement just a bit.
        // Also move the obstacle forward, so we can hit it again.
        (thisActor: Obstacle, collideActor: Hero) => {
            thisActor.remove(true);
            jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                    return true;
                });
                
                overlay.addTapControl({  x: 4, y: .75, width: 8, height: 2, img: "question_bar.png"  }, (eventPositionX: number, eventPositionY: number) => {
                    return true;
                });
                overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 14: 27 divided into groups of 3");
            
                let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "5");

                let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "6");

                let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "7");

                let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                        score = score + 1;
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "9");
            });
            return true;
    };
    trigger6.setHeroCollisionCallback(lc6);
    // No transfer of momeuntum when the hero collides with the trigger
    trigger6.setCollisionsEnabled(false);


    let trigger7 = jl.world.makeObstacle({ box: true, x: 105, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
        let lc7 =
        // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
        // and a new obstacle on the screen.  We'll randomize their placement just a bit.
        // Also move the obstacle forward, so we can hit it again.
        (thisActor: Obstacle, collideActor: Hero) => {
            thisActor.remove(true);
            jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                    return true;
                });
                
                overlay.addTapControl({  x: 4, y: .75, width: 8, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                    return true;
                });
                overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 15: 72 divided into groups of 8");
            
                let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                        score = score + 1;
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "9");

                let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "8");

                let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "7");

                let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "6");
            });
            return true;
    };
    trigger7.setHeroCollisionCallback(lc7);
    // No transfer of momeuntum when the hero collides with the trigger
    trigger7.setCollisionsEnabled(false);


    let trigger8 = jl.world.makeObstacle({ box: true, x: 120, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
        let lc8 =
        // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
        // and a new obstacle on the screen.  We'll randomize their placement just a bit.
        // Also move the obstacle forward, so we can hit it again.
        (thisActor: Obstacle, collideActor: Hero) => {
            thisActor.remove(true);
            jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                    return true;
                });
                
                overlay.addTapControl({  x: 4, y: .75, width: 8, height: 2, img: "question_bar.png"  }, (eventPositionX: number, eventPositionY: number) => {
                    return true;
                });
                overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 16: 64 divided into groups of 8");
            
                let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                        score = score + 1;
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "8");

                let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "7");

                let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "9");

                let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "2");
            });
            return true;
    };
    trigger8.setHeroCollisionCallback(lc8);
    // No transfer of momeuntum when the hero collides with the trigger
    trigger8.setCollisionsEnabled(false);
}

    // In this level, we change the physics from level 2 so that things roll and bounce a little bit more nicely.
    else if (index == 3) {
            jl.world.setCameraBounds(160, 9);
            jl.world.drawBoundingBox(0, 0, 160, 9, "", 1, 0, 1);
            let h = jl.world.makeHero({ x: 0, y: 3, width: 2, height: 4, img: "astro_side.png" });
            h.setDefaultAnimation(jl.makeAnimation(200, true, ["1.png", "2.png","3.png","4.png","5.png","6.png",]));
            h.disableRotation();
            h.setPhysics(5, 0, 0.6);
            h.addVelocity(1, 0);
            jl.world.setCameraChase(h);
            jl.world.makeDestination({ x: 159, y: 0, width: 1, height: 1, img: "mustardball.png" });
            jl.score.setVictoryDestination(1);

            // set up our background, with a few layers
            jl.world.setBackgroundColor(0x101010);
            //jl.world.drawPicture({ x: 0, y: 0, width: 16, height: 9, img: "lvl1_background.png", z: -1 });
            jl.world.addHorizontalBackgroundLayer({ x: 0, y: 0, width: 16, height: 9, img: "lvl3_moon.png"}, 1);
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

            let score = 0;

            let trigger1 = jl.world.makeObstacle({ box: true, x: 15, y: 5.50, width: 3, height: 2, img: "question_box.png" });
            //trigger1.setDisappearAnimation(jl.makeComplexAnimation(false).to("question_box.png", 10).to("question_box 1.png", 10), 0, 0, .5, .5);
            //trigger1.setDisappearAnimation(jl.makeComplexAnimation(false).to("question_box.png", 200).to("question_box 1.png", 200).to("starburst1.png", 200).to("starburst4.png", 200), 0, 0, .5, .5);
            //trigger1.setDisappearAnimation(jl.makeComplexAnimation(false).to("question_box.png", 10).to("question_box 1.png", 10), 0, 0, .5, .5);

            let lc =
            // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
            // and a new obstacle on the screen.  We'll randomize their placement just a bit.
            // Also move the obstacle forward, so we can hit it again.
            (thisActor: Obstacle, collideActor: Hero) => {
                    thisActor.remove(true);
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                        overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                            return true;
                        });
                        
                        overlay.addTapControl({ x: 2, y: .25, width: 12, height: 3, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            return true;
                        });
                        //welcomeMessage(jl, "Reach the destination\nto win this level");
                        overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 35, z: 0 }, () => "Question 17: I bought a bag a fruit candies at the store.\nThere were 55 candies in the bag. I want to share with 5 friends.\nHow many will each friend get?");
                    
                        let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            a11.remove(true);    
                            a12.remove(true);
                            a13.remove(true);
                            a14.remove(true);
                            overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wronng_bar.png" }, () => {
                                jl.nav.dismissOverlayScene();
                                return true;
                            })
                            return true;
                       });
                        overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "10");

                        let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            a11.remove(true);    
                            a12.remove(true);
                            a13.remove(true);
                            a14.remove(true);
                            overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                                jl.nav.dismissOverlayScene();
                                return true;
                            })
                            return true;
                       });
                        overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "9");

                        let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            a11.remove(true);    
                            a12.remove(true);
                            a13.remove(true);
                            a14.remove(true);
                            overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                                jl.nav.dismissOverlayScene();
                                return true;
                            })
                            return true;
                       });
                        overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "12");

                        let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            a11.remove(true);    
                            a12.remove(true);
                            a13.remove(true);
                            a14.remove(true);
                            overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                                score = score + 1;
                                jl.nav.dismissOverlayScene();
                                return true;
                            })
                            return true;
                       });
                        overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "11");
                    });
                    return true;
            };
        trigger1.setHeroCollisionCallback(lc);
        // No transfer of momeuntum when the hero collides with the trigger
        trigger1.setCollisionsEnabled(false);

        let trigger2 = jl.world.makeObstacle({ box: true, x: 30, y: 5.50, width: 3, height: 2, img: "question_box.png" });
        
            let lc2 =
            // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
            // and a new obstacle on the screen.  We'll randomize their placement just a bit.
            // Also move the obstacle forward, so we can hit it again.
            (thisActor: Obstacle, collideActor: Hero) => {
                thisActor.remove(true);
                jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                    //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                    overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                        return true;
                    });
                    
                    overlay.addTapControl({ x: 2, y: .25, width: 12, height: 3, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                        return true;
                    });
                    overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 18: A store got 45 notebooks delivered.\nThere were 5 boxes. How many notebooks are in each box?");
                
                    let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "6");

                    let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "7");

                    let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "8");

                    let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                            score = score + 1;
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "9");
                });
                return true;
        };
        trigger2.setHeroCollisionCallback(lc2);
        // No transfer of momeuntum when the hero collides with the trigger
        trigger2.setCollisionsEnabled(false);


        let trigger3 = jl.world.makeObstacle({ box: true, x: 45, y: 5.50, width: 3, height: 2, img: "question_box.png" });
        
        let lc3 =
        // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
        // and a new obstacle on the screen.  We'll randomize their placement just a bit.
        // Also move the obstacle forward, so we can hit it again.
        (thisActor: Obstacle, collideActor: Hero) => {
            thisActor.remove(true);
            jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                    return true;
                });
                
                overlay.addTapControl({ x: 2, y: .25, width: 12, height: 3, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                    return true;
                });
                overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 19: Mom baked 36 cookies. She put 9 cookies in bag.\nHow many cookies were in each bag?");
            
                let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "3");

                let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "6");

                let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "9");

                let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                    a11.remove(true);    
                    a12.remove(true);
                    a13.remove(true);
                    a14.remove(true);
                    overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                        score = score + 1;
                        jl.nav.dismissOverlayScene();
                        return true;
                    })
                    return true;
               });
                overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "4");
            });
            return true;
    };
    trigger3.setHeroCollisionCallback(lc3);
    // No transfer of momeuntum when the hero collides with the trigger
    trigger3.setCollisionsEnabled(false);


    let trigger4 = jl.world.makeObstacle({ box: true, x: 60, y: 5.50, width: 3, height: 2, img: "question_box.png" });
        
            let lc4 =
            // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
            // and a new obstacle on the screen.  We'll randomize their placement just a bit.
            // Also move the obstacle forward, so we can hit it again.
            (thisActor: Obstacle, collideActor: Hero) => {
                thisActor.remove(true);
                jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                    //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                    overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                        return true;
                    });
                    
                    overlay.addTapControl({ x: 2, y: .25, width: 12, height: 3, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                        return true;
                    });
                    overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 20: The chef made 24 pancakes for 8 people.\nHow many pancakes did each person get?");
                
                    let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "4");

                    let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                            score = score + 1;
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "3");

                    let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "2");

                    let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "1");
                });
                return true;
        };
        trigger4.setHeroCollisionCallback(lc4);
        // No transfer of momeuntum when the hero collides with the trigger
        trigger4.setCollisionsEnabled(false);


        let trigger5 = jl.world.makeObstacle({ box: true, x: 75, y: 5.50, width: 3, height: 2, img: "question_box.png" });
        
            let lc5 =
            // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
            // and a new obstacle on the screen.  We'll randomize their placement just a bit.
            // Also move the obstacle forward, so we can hit it again.
            (thisActor: Obstacle, collideActor: Hero) => {
                thisActor.remove(true);
                jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                    //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                    overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                        return true;
                    });
                    
                    overlay.addTapControl({ x: 2, y: .25, width: 12, height: 3, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                        return true;
                    });
                    overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 21: The zookeeper had 56 grapes.\nHe wanted to share them equally with 7 sea otters.\nHow many will each sea otter get?");
                
                    let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                            score = score + 1;
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "8");

                    let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "9");

                    let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "7");

                    let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "3");
                });
                return true;
        };
        trigger5.setHeroCollisionCallback(lc5);
        // No transfer of momeuntum when the hero collides with the trigger
        trigger5.setCollisionsEnabled(false);


        let trigger6 = jl.world.makeObstacle({ box: true, x: 90, y: 5.50, width: 3, height: 2, img: "question_box.png" });
        
            let lc6 =
            // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
            // and a new obstacle on the screen.  We'll randomize their placement just a bit.
            // Also move the obstacle forward, so we can hit it again.
            (thisActor: Obstacle, collideActor: Hero) => {
                thisActor.remove(true);
                jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                    //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                    overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                        return true;
                    });
                    
                    overlay.addTapControl({ x: 2, y: .25, width: 12, height: 3, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                        return true;
                    });
                    overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 22: Momma squirrel has 3 babies.\nShe wants to share 27 nuts with each baby.\nHow many nuts does each baby get?");
                
                    let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "9");

                    let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "6");

                    let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "3");

                    let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                            score = score + 1;
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "1");
                });
                return true;
        };
        trigger6.setHeroCollisionCallback(lc6);
        // No transfer of momeuntum when the hero collides with the trigger
        trigger6.setCollisionsEnabled(false);


        let trigger7 = jl.world.makeObstacle({ box: true, x: 105, y: 5.50, width: 3, height: 2, img: "question_box.png" });
        
            let lc7 =
            // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
            // and a new obstacle on the screen.  We'll randomize their placement just a bit.
            // Also move the obstacle forward, so we can hit it again.
            (thisActor: Obstacle, collideActor: Hero) => {
                thisActor.remove(true);
                jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                    //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                    overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                        return true;
                    });
                    
                    overlay.addTapControl({x: 2, y: .25, width: 12, height: 3, img: "question_bar.png"}, (eventPositionX: number, eventPositionY: number) => {
                        return true;
                    });
                    overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 23: A clothing store got 72 sweaters in stock.\nThere was an equal number of 9 colors.\nHow many sweaters were there of each color?");
                
                    let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "5");

                    let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "6");

                    let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "7");

                    let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                            score = score + 1;
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "8");
                });
                return true;
        };
        trigger7.setHeroCollisionCallback(lc7);
        // No transfer of momeuntum when the hero collides with the trigger
        trigger7.setCollisionsEnabled(false);


        let trigger8 = jl.world.makeObstacle({ box: true, x: 120, y: 5.50, width: 3, height: 2, img: "question_box.png" });
        
            let lc8 =
            // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
            // and a new obstacle on the screen.  We'll randomize their placement just a bit.
            // Also move the obstacle forward, so we can hit it again.
            (thisActor: Obstacle, collideActor: Hero) => {
                thisActor.remove(true);
                jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                    //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#FFFFFF", size: 32, z: 0 }, () => "Game Paused");
                    overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
                        return true;
                    });
                    
                    overlay.addTapControl({ x: 2, y: .25, width: 12, height: 3, img: "question_bar.png"}, (eventPositionX: number, eventPositionY: number) => {
                        return true;
                    });
                    overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 24: A peach farmer picked 40 peaches.\nHe sold an equal number of peaches to 5 people.\nHow many did each person get?");
                
                    let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                            score = score + 1;
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => "6");

                    let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "7");

                    let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "8");

                    let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                   });
                    overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => "9");
                });
                return true;
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
