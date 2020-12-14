import { JetLagApi } from "../jetlag/api/JetLagApi";
import { OverlayApi } from "../jetlag/api/OverlayApi";
//import { Path } from "../jetlag/support/Path";
//import { Goodie } from "../jetlag/actor/Goodie";
import { Hero } from "../jetlag/actor/Hero";
//import { WorldActor } from "../jetlag/actor/WorldActor";
//import { Enemy } from "../jetlag/actor/Enemy";
import { JetLagKeys } from "../jetlag/support/JetLagKeys";
import { Obstacle } from "../jetlag/actor/Obstacle";

//import { Interface } from "readline";
//import { BaseActor } from "../jetlag/actor/BaseActor";

/**
 * buildLevelScreen is used to draw the playable levels of the game
 * hi
 *
 * We currently have 90 levels, each of which is described in part of the
 * following function.
 *
 * @param index Which level should be displayed
 * @param jl    The JetLag object, for putting stuff into the level
 */

export interface array_entry {
    questionId: any
    correct: any
    time: any
    picked: any
}

let score = 0;

let game_start: number;
let game_end: number;

let flag = false;

export async function buildLevelScreen(index: number, jl: JetLagApi): Promise<void> {

    // This line ensures that, no matter what level we draw, the ESCAPE key is configured to go back to the Chooser
    jl.setUpKeyAction(JetLagKeys.ESCAPE, () => { jl.nav.doChooser(Math.ceil(index / 24)); });

    //tutorial
    if (index == 5) {
        jl.world.setCameraBounds(160, 9);
        jl.world.drawBoundingBox(0, 0, 160, 9, "", 1, 0, 1);
        let h = jl.world.makeHero({ x: 0, y: 2.75, width: 2, height: 5, img: "a1.png", box: true});
        h.setDefaultAnimation(jl.makeAnimation(30, true, [
        "a1.png", "a2.png",  "a3.png", "a4.png", "a5.png", "a6.png", "a7.png", "a8.png", "a9.png", "a10.png", 
        "a11.png", "a12.png", "a13.png", "a14.png", "a15.png", "a16.png", "a17.png", "a18.png", "a19.png", "a20.png", 
        "a21.png", "a22.png", "a23.png", "a24.png", "a25.png", "a26.png", "a27.png", "a29.png", "a30.png", 
        "a31.png", "a32.png", "a33.png", "a34.png", "a35.png", "a36.png", "a37.png", "a38.png", "a39.png", "a40.png", 
        "a41.png", "a42.png", "a43.png", "a44.png", "a45.png", "a46.png", "a47.png", "a48.png", "a49.png", "a50.png", ]));
        h.disableRotation();
        h.setPhysics(5, 0, 0.6);
        h.addVelocity(.75, 0);
        jl.world.setCameraChase(h);

        let user_id = jl.score.getSessionFact("user_id", "error"); 
        console.log("user id is " + user_id);

        // set up our background, with a few layers
        jl.world.setBackgroundColor(0x101010);
        //jl.world.drawPicture({ x: 0, y: 0, width: 16, height: 9, img: "lvl1_background.png", z: -1 });
        jl.world.addHorizontalBackgroundLayer({ x: 0, y: 0, width: 16, height: 9, img: "lvl1_moon.png"}, 0);
        //jl.world.addHorizontalForegroundLayer({ x: 0, y: 0, width: 16, height: 9, img: "mid.png" }, 0);
        jl.world.addHorizontalBackgroundLayer({ x: 0, y: 0, width: 16, height: 6, img: "lvl1_stars.png" }, 0.5);

        jl.world.drawPicture({ x: 1, y: 1, width: 3.5, height: 1, img: "t_welcome.png"});
        jl.world.drawPicture({ x: 5.5, y: 1.10, width: 6.5, height: 1, img: "t_2.png"});
        jl.world.drawPicture({ x: 14, y: 1.10, width: 5.75, height: 2, img: "t_3.png"});


        //welcomeMessage(jl, "Speed boosters and reducers");
        loseMessage(jl, "Try Again");

        let trigger1 = jl.world.makeObstacle({ box: true, x: 15, y: 5.50, width: 3, height: 2, img: "question_box.png" });
        
        let lc =
        // Each time the hero hits the obstacle, we'll run this code to draw a new enemy
        // and a new obstacle on the screen.  We'll randomize their placement just a bit.
        // Also move the obstacle forward, so we can hit it again.
        (thisActor: Obstacle, collideActor: Hero) => {
                thisActor.remove(true);
                jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                    //overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#101010", size: 32, z: 0 }, () => "Game Paused");
                    overlay.addImage({ x: 0, y: 0, width: 16, height: 9, img: "black.png" });
                    let t4 = overlay.addImage({ x: 11.5, y: 2, width: 4, height: 1, img: "t_4.png" });

                    overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                        return true;
                    });
                    overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => "Question 1: 16 ÷ 4 = ?");

                    let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                        overlay.addImage({ x: 5, y: 10, width: 5, height: 1, img: "t_5.png" });
                        a11.remove(true);    
                        a12.remove(true);
                        a13.remove(true);
                        a14.remove(true);
                        t4.remove(true);
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
                        t4.remove(true);
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
                        t4.remove(true);
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
                        t4.remove(true);
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

    jl.world.drawPicture({ x: 23, y: 1.10, width: 7, height: 2, img: "t_6.png"});
    jl.world.makeDestination({ x: 30, y: 2, width: 4.5, height: 5, img: "flag.png" });
    jl.score.setVictoryDestination(1);

    }

        //earth
    if (index == 2) {
            jl.world.setCameraBounds(160, 9);
            jl.world.drawBoundingBox(0, 0, 160, 9, "", 1, 0, 1);
            let h = jl.world.makeHero({ x: 0, y: 2.75, width: 2, height: 5, img: "a1.png", box: true});
            h.setDefaultAnimation(jl.makeAnimation(25, true, [
            "a1.png", "a2.png",  "a3.png", "a4.png", "a5.png", "a6.png", "a7.png", "a8.png", "a9.png", "a10.png", 
            "a11.png", "a12.png", "a13.png", "a14.png", "a15.png", "a16.png", "a17.png", "a18.png", "a19.png", "a20.png", 
            "a21.png", "a22.png", "a23.png", "a24.png", "a25.png", "a26.png", "a27.png", "a29.png", "a30.png", 
            "a31.png", "a32.png", "a33.png", "a34.png", "a35.png", "a36.png", "a37.png", "a38.png", "a39.png", "a40.png", 
            "a41.png", "a42.png", "a43.png", "a44.png", "a45.png", "a46.png", "a47.png", "a48.png", "a49.png", "a50.png", ]));
            //h.setDefaultAnimation(jl.makeAnimation(200, true, ["a1.png", "2.png","3.png","4.png","5.png","6.png",
            h.disableRotation();
            h.setPhysics(5, 0, 0.6);
            h.addVelocity(1, 0);
            jl.world.setCameraChase(h);
    
            // set up our background, with a few layers
            jl.world.setBackgroundColor(0x101010);
            jl.world.addHorizontalBackgroundLayer({ x: 0, y: 0, width: 16, height: 9, img: "earth.png"}, 0);

            
            jl.world.makeDestination({box: true, x: 5, y: .75, width: 5, height: 8, img: "rocket.png" });
            jl.score.setVictoryDestination(0);
    
            
    }       
    
        //earth to space
    if (index == 3) {
            jl.world.setCameraBounds(16, 70);
            jl.world.enableTilt(0, 10);
            jl.world.drawBoundingBox(0, -100, 16, 200, "", 1, 0, 1);
            let h = jl.world.makeHero({box:true,  x: 5, y: 50, width: 5, height: 8, img: "rocket.png" });
            jl.world.setCameraChase(h);
            h.setPhysics(5, 0, 0.6);
            h.addVelocity(0, -1);
            h.setMoveByTilting();
            jl.world.setCameraChase(h);
    
            jl.world.setBackgroundColor(0xFF00FF);

            jl.world.addVerticalBackgroundLayer({ x: 0, y: 0, width: 16, height: 45, img: "test.png"}, .25);
    
            jl.world.makeDestination({ x: 5, y: 3, width: 15, height:5, img: "starburst1.png" });
            jl.score.setVictoryDestination(1);
    }
    
        //space shuttle
    if (index == 4) {
            jl.world.setCameraBounds(160, 9);
            jl.world.drawBoundingBox(0, 0, 160, 9, "", 1, 0, 1);
        
        
            jl.world.addHorizontalBackgroundLayer({ x: 0, y: 0, width: 16, height: 9, img: "inside_spaceship.png"}, 0);
    
    
            jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {

                overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "inside_spaceship.png" }, () => {

                overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "lets_learn.png" }, () => {

                overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "draw_a_picture.png"}, () => {
                    overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "skip_count.png"}, () => {
                        overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "add_on.png"}, () => {
                            jl.nav.dismissOverlayScene();
                            return true;
                        })
                        return true;
                    })
                    return true;
                })
                return true;
                });
                return true;
            });
        });
                
            //welcome.hidden(true); 
    
            //welcomeMessage(jl, "Speed boosters and reducers");
            //loseMessage("Try Again");
    
            jl.hud.addTapControl({ x: 7, y: 2, width: 2, height: 1, img: "readybutton.png" }, () => {
                jl.nav.doLevel(5);
                return true;
            });
    
            
            // //jl.world.makeDestination({box: true, x: 6, y: 0, width: 5, height: 8, img: "rocket.png" });
            // jl.score.setVictoryDestination(0);
            // eleneMessage(jl, "Ready to try it out?");
            // overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "black.png" }, (hudx: number, hudY: number) => {
            //     jl.nav.doLevel(4);
            // });
            //jl.nav.doLevel(4)
        
    } 

    //lvl1 ~ was 5
    if (index == 1) {
        game_start = new Date().getTime();
        jl.world.setCameraBounds(160, 9);
        jl.world.drawBoundingBox(0, 0, 160, 9, "", 1, 0, 1);
        let h = jl.world.makeHero({ x: 0, y: 2.75, width: 2, height: 5, img: "a1.png", box: true});
        h.setDefaultAnimation(jl.makeAnimation(25, true, [
        "a1.png", "a2.png",  "a3.png", "a4.png", "a5.png", "a6.png", "a7.png", "a8.png", "a9.png", "a10.png", 
        "a11.png", "a12.png", "a13.png", "a14.png", "a15.png", "a16.png", "a17.png", "a18.png", "a19.png", "a20.png", 
        "a21.png", "a22.png", "a23.png", "a24.png", "a25.png", "a26.png", "a27.png", "a29.png", "a30.png", 
        "a31.png", "a32.png", "a33.png", "a34.png", "a35.png", "a36.png", "a37.png", "a38.png", "a39.png", "a40.png", 
        "a41.png", "a42.png", "a43.png", "a44.png", "a45.png", "a46.png", "a47.png", "a48.png", "a49.png", "a50.png", ]));
        h.disableRotation();
        h.setPhysics(5, 0, 0.6);
        h.addVelocity(1, 0);
        jl.world.setCameraChase(h);

        // set up our background, with a few layers
        jl.world.setBackgroundColor(0x101010);
        //jl.world.drawPicture({ x: 0, y: 0, width: 16, height: 9, img: "lvl1_background.png", z: -1 });
        jl.world.addHorizontalBackgroundLayer({ x: 0, y: 0, width: 16, height: 9, img: "lvl1_moon.png"}, 0);
        //jl.world.addHorizontalForegroundLayer({ x: 0, y: 0, width: 16, height: 9, img: "mid.png" }, 0);
        jl.world.addHorizontalBackgroundLayer({ x: 0, y: 0, width: 16, height: 6, img: "lvl1_stars.png" }, 0.5);

        let q_responses: any[] = [];

        interface Question_Set {
            id: string
            question: string
            optionOne: string
            optionTwo: string
            optionThree: string
            optionFour: string
            answer: string
            questionSetId: string
        }

        let set_id = jl.score.getSessionFact("set_id", "error"); 
        let url = "http://localhost:8080/api/questions/sets/" + set_id;

        function getQuestion_Set(): Promise<Question_Set[]> {
            return fetch(url)
                .then(res => res.json())
                .then(res => {
                    return res as Question_Set[]
                })
         }

         //let result = document.getElementById('result')
        getQuestion_Set()
            .then(question_set => {

                let trigger1 = jl.world.makeObstacle({ box: true, x: 15, y: 5.50, width: 3, height: 2, img: "question_box.png" });
                
                let lc =
                (thisActor: Obstacle, collideActor: Hero) => {
                        let q1_start = new Date().getTime();
                        thisActor.remove(true);
                        jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                            overlay.addImage({ x: 0, y: 0, width: 16, height: 9, img: "black.png" });
        
                            overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                                return true;
                            });
                            overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => question_set[0].question.toString());

                            var an_entry: array_entry = {
                            //let an_entry: array_entry {
                                questionId: 0,
                                correct: 0,
                                time: 0,
                                picked: 0,

                            };

                            let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                                let q_id = question_set[0].id.toString();
                                let q1_end = new Date().getTime();
                                console.log("The question id in a11 is " + q_id);
                                checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[0].optionOne.toString(), 
                                question_set[0].answer.toString(), q_responses, an_entry, q1_start, q1_end);
                                flag = true;
                                return true;

                           });
                            overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => question_set[0].optionOne.toString());
        
                            let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                                let q1_end = new Date().getTime();
                                let q_id = question_set[0].id.toString();
                                checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[0].optionTwo.toString(), 
                                question_set[0].answer.toString(), q_responses, an_entry, q1_start, q1_end);
                                return true;
                           });
                            overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[0].optionTwo.toString());
        
                            let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                                let q1_end = new Date().getTime();
                                let q_id = question_set[0].id.toString();
                                checkAnswer(jl, overlay,q_id, a11, a12, a13, a14, question_set[0].optionThree.toString(), question_set[0].answer.toString(), 
                                q_responses, an_entry, q1_start, q1_end);
                                return true;

                           });
                            overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[0].optionThree.toString());
        
                            let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                                let q1_end = new Date().getTime();
                                let q_id = question_set[0].id.toString();
                                checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[0].optionFour.toString(), 
                                question_set[0].answer.toString(), q_responses, an_entry, q1_start, q1_end);
                                console.log("the array is " + q_responses)
                                return true;
                           });
                            overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[0].optionFour.toString());
            
                            overlay.addTapControl({ x: 10, y: 2.25, width: 1, height: .5, img: "hint.png" }, () => {
                                let hint_bar_1 = overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "hint_bar.png" }, () => {
                                    hint_bar_1.remove(true);
                                    return true;
                                })
                                return true;
                            });
                        return true;
                    });
                };
                trigger1.setHeroCollisionCallback(lc);
                trigger1.setCollisionsEnabled(false);

                let trigger2 = jl.world.makeObstacle({ box: true, x: 30, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
                let lc2 =
                (thisActor: Obstacle, collideActor: Hero) => {
                    let q2_start = new Date().getTime();
                    thisActor.remove(true);
                    // ask javascript what time it is 
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        overlay.addImage({ x: 0, y: 0, width: 16, height: 9, img: "black.png" });
                
                                    overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                                        return true;
                                    });
                                    overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => question_set[1].question.toString());

                                    var an_entry: array_entry = {
                                            questionId: 0,
                                            correct: 0,
                                            time: 0,
                                            picked: 0,
            
                                        };

                                    let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                                        let q_id = question_set[1].id.toString();
                                        let q2_end = new Date().getTime();
                                        checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[1].optionOne.toString(), 
                                        question_set[1].answer.toString(), q_responses, an_entry, q2_start, q2_end);
                                        return true;

                                });
                                    overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => question_set[1].optionOne.toString());
                
                                    let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                                        let q_id = question_set[1].id.toString();
                                        let q2_end = new Date().getTime();
                                        checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[1].optionTwo.toString(), 
                                        question_set[1].answer.toString(), q_responses, an_entry, q2_start, q2_end);
                                        return true;
                                });
                                    overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[1].optionTwo.toString());
                
                                    let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                                        let q_id = question_set[1].id.toString();
                                        let q2_end = new Date().getTime();
                                        checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[1].optionThree.toString(), 
                                        question_set[1].answer.toString(), q_responses, an_entry, q2_start, q2_end);
                                        return true;
                                });
                                    overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[1].optionThree.toString());
                
                                    let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                                        let q_id = question_set[1].id.toString();
                                        let q2_end = new Date().getTime();
                                        checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[1].optionFour.toString(), 
                                        question_set[1].answer.toString(), q_responses, an_entry, q2_start, q2_end);
                                        return true;
                                });
                                    overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[1].optionFour.toString());

                                    overlay.addTapControl({ x: 10, y: 2.25, width: 1, height: .5, img: "hint.png" }, () => {
                                        let hint_bar_1 = overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "hint_bar.png" }, () => {
                                            hint_bar_1.remove(true);
                                            return true;
                                            })
                                        return true;
                                    });
                        });
                return true;
                };

                trigger2.setHeroCollisionCallback(lc2);
                trigger2.setCollisionsEnabled(false);

                let trigger3 = jl.world.makeObstacle({ box: true, x: 45, y: 5.50, width: 3, height: 2, img: "question_box.png" });
                
                let lc3 =
                (thisActor: Obstacle, collideActor: Hero) => {
                    let q3_start = new Date().getTime();
                    thisActor.remove(true);
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        overlay.addImage({ x: 0, y: 0, width: 16, height: 9, img: "black.png" });
                
                        overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            return true;
                        });
                        overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => question_set[2].question.toString());

                        var an_entry: array_entry = {
                                questionId: 0,
                                correct: 0,
                                time: 0,
                                picked: 0,

                            };

                        let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[2].id.toString();
                            let q3_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[2].optionOne.toString(), 
                            question_set[2].answer.toString(), q_responses, an_entry, q3_start, q3_end);
                            return true;

                    });
                        overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => question_set[2].optionOne.toString());

                        let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[2].id.toString();
                            let q3_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[2].optionTwo.toString(), 
                            question_set[2].answer.toString(), q_responses, an_entry, q3_start, q3_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[2].optionTwo.toString());

                        let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[2].id.toString();
                            let q3_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[2].optionThree.toString(), 
                            question_set[2].answer.toString(), q_responses, an_entry, q3_start, q3_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[2].optionThree.toString());

                        let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[2].id.toString();
                            let q3_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[2].optionFour.toString(), 
                            question_set[2].answer.toString(), q_responses, an_entry, q3_start, q3_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[2].optionFour.toString());

                        overlay.addTapControl({ x: 10, y: 2.25, width: 1, height: .5, img: "hint.png" }, () => {
                            let hint_bar_1 = overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "hint_bar.png" }, () => {
                                hint_bar_1.remove(true);
                                return true;
                                })
                            return true;
                        });
                        });
                    return true;
                };

                trigger3.setHeroCollisionCallback(lc3);
                trigger3.setCollisionsEnabled(false);


                let trigger4 = jl.world.makeObstacle({ box: true, x: 60, y: 5.50, width: 3, height: 2, img: "question_box.png" });
                
                let lc4 =
                (thisActor: Obstacle, collideActor: Hero) => {
                    let q4_start = new Date().getTime();
                    thisActor.remove(true);
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        overlay.addImage({ x: 0, y: 0, width: 16, height: 9, img: "black.png" });
                
                        overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            return true;
                        });
                        overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => question_set[3].question.toString());

                        var an_entry: array_entry = {
                                questionId: 0,
                                correct: 0,
                                time: 0,
                                picked: 0,

                            };

                        let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[3].id.toString();
                            let q4_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[3].optionOne.toString(), 
                            question_set[3].answer.toString(), q_responses, an_entry, q4_start, q4_end);
                            return true;

                    });
                        overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => question_set[3].optionOne.toString());

                        let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[3].id.toString();
                            let q4_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[3].optionTwo.toString(), 
                            question_set[3].answer.toString(), q_responses, an_entry, q4_start, q4_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[3].optionTwo.toString());

                        let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[3].id.toString();
                            let q4_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[3].optionThree.toString(), 
                            question_set[3].answer.toString(), q_responses, an_entry, q4_start, q4_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[3].optionThree.toString());

                        let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[3].id.toString();
                            let q4_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[3].optionFour.toString(), 
                            question_set[3].answer.toString(), q_responses, an_entry, q4_start, q4_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[3].optionFour.toString());

                        overlay.addTapControl({ x: 10, y: 2.25, width: 1, height: .5, img: "hint.png" }, () => {
                            let hint_bar_1 = overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "hint_bar.png" }, () => {
                                hint_bar_1.remove(true);
                                return true;
                                })
                            return true;
                        });
                    });
                return true;
                };

                trigger4.setHeroCollisionCallback(lc4);
                trigger4.setCollisionsEnabled(false);

                let trigger5 = jl.world.makeObstacle({ box: true, x: 75, y: 5.50, width: 3, height: 2, img: "question_box.png" });
            
                let lc5 =
                (thisActor: Obstacle, collideActor: Hero) => {
                    let q5_start = new Date().getTime();
                    thisActor.remove(true);
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        overlay.addImage({ x: 0, y: 0, width: 16, height: 9, img: "black.png" });
                
                        overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            return true;
                        });
                        overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => question_set[4].question.toString());

                        var an_entry: array_entry = {
                                questionId: 0,
                                correct: 0,
                                time: 0,
                                picked: 0,

                            };

                        let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[4].id.toString();
                            let q5_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[4].optionOne.toString(), 
                            question_set[4].answer.toString(), q_responses, an_entry, q5_start, q5_end);
                            return true;

                    });
                        overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => question_set[4].optionOne.toString());

                        let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[4].id.toString();
                            let q5_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[4].optionTwo.toString(), 
                            question_set[4].answer.toString(), q_responses, an_entry, q5_start, q5_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[4].optionTwo.toString());

                        let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[4].id.toString();
                            let q5_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[4].optionThree.toString(), 
                            question_set[4].answer.toString(), q_responses, an_entry, q5_start, q5_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[4].optionThree.toString());

                        let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[4].id.toString();
                            let q5_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[4].optionFour.toString(), 
                            question_set[4].answer.toString(), q_responses, an_entry, q5_start, q5_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[4].optionFour.toString());

                        overlay.addTapControl({ x: 10, y: 2.25, width: 1, height: .5, img: "hint.png" }, () => {
                            let hint_bar_1 = overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "hint_bar.png" }, () => {
                                hint_bar_1.remove(true);
                                return true;
                                })
                            return true;
                        });
                    });
                return true;
                };

                trigger5.setHeroCollisionCallback(lc5);
                trigger5.setCollisionsEnabled(false);

                let trigger6 = jl.world.makeObstacle({ box: true, x: 90, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
                let lc6 =
                
                (thisActor: Obstacle, collideActor: Hero) => {
                    let q6_start = new Date().getTime();
                    thisActor.remove(true);
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        overlay.addImage({ x: 0, y: 0, width: 16, height: 9, img: "black.png" });
                
                        overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            return true;
                        });
                        overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => question_set[5].question.toString());

                        var an_entry: array_entry = {
                                questionId: 0,
                                correct: 0,
                                time: 0,
                                picked: 0,

                            };

                        let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[5].id.toString();
                            let q6_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[5].optionOne.toString(), 
                            question_set[5].answer.toString(), q_responses, an_entry, q6_start, q6_end);
                            return true;

                    });
                        overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => question_set[5].optionOne.toString());

                        let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[5].id.toString();
                            let q6_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[5].optionTwo.toString(), 
                            question_set[5].answer.toString(), q_responses, an_entry, q6_start, q6_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[5].optionTwo.toString());

                        let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[5].id.toString();
                            let q6_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[5].optionThree.toString(), 
                            question_set[5].answer.toString(), q_responses, an_entry, q6_start, q6_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[5].optionThree.toString());

                        let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[5].id.toString();
                            let q6_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[5].optionFour.toString(), 
                            question_set[5].answer.toString(), q_responses, an_entry, q6_start, q6_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[5].optionFour.toString());

                        overlay.addTapControl({ x: 10, y: 2.25, width: 1, height: .5, img: "hint.png" }, () => {
                            let hint_bar_1 = overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "hint_bar.png" }, () => {
                                hint_bar_1.remove(true);
                                return true;
                                })
                            return true;
                        });
                    });
                return true;
                };

                trigger6.setHeroCollisionCallback(lc6);
                trigger6.setCollisionsEnabled(false);

                let trigger7 = jl.world.makeObstacle({ box: true, x: 105, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
                let lc7 =
                (thisActor: Obstacle, collideActor: Hero) => {
                    let q7_start = new Date().getTime();
                    thisActor.remove(true);
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        overlay.addImage({ x: 0, y: 0, width: 16, height: 9, img: "black.png" });
                
                        overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            return true;
                        });
                        overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => question_set[6].question.toString());

                        var an_entry: array_entry = {
                                questionId: 0,
                                correct: 0,
                                time: 0,
                                picked: 0,

                            };

                        let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[6].id.toString();
                            let q7_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[6].optionOne.toString(), 
                            question_set[6].answer.toString(), q_responses, an_entry, q7_start, q7_end);
                            return true;

                    });
                        overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => question_set[6].optionOne.toString());

                        let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[6].id.toString();
                            let q7_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[6].optionTwo.toString(), 
                            question_set[6].answer.toString(), q_responses, an_entry, q7_start, q7_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[6].optionTwo.toString());

                        let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[6].id.toString();
                            let q7_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[6].optionThree.toString(), 
                            question_set[6].answer.toString(), q_responses, an_entry, q7_start, q7_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[6].optionThree.toString());

                        let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[6].id.toString();
                            let q7_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[6].optionFour.toString(), 
                            question_set[6].answer.toString(), q_responses, an_entry, q7_start, q7_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[6].optionFour.toString());

                        overlay.addTapControl({ x: 10, y: 2.25, width: 1, height: .5, img: "hint.png" }, () => {
                            let hint_bar_1 = overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "hint_bar.png" }, () => {
                                hint_bar_1.remove(true);
                                return true;
                                })
                            return true;
                        });
                    });
                return true;
                };

                trigger7.setHeroCollisionCallback(lc7);
                trigger7.setCollisionsEnabled(false);

                let trigger8 = jl.world.makeObstacle({ box: true, x: 120, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
                let lc8 =
                (thisActor: Obstacle, collideActor: Hero) => {
                    let q8_start = new Date().getTime();
                    thisActor.remove(true);
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        overlay.addImage({ x: 0, y: 0, width: 16, height: 9, img: "black.png" });
                
                        overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            return true;
                        });
                        overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => question_set[7].question.toString());

                        var an_entry: array_entry = {
                                questionId: 0,
                                correct: 0,
                                time: 0,
                                picked: 0,

                            };

                        let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[7].id.toString();
                            let q8_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[7].optionOne.toString(), 
                            question_set[7].answer.toString(), q_responses, an_entry, q8_start, q8_end);
                            postAttempts(user_id, q_responses)
                            return true;

                    });
                        overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => question_set[7].optionOne.toString());

                        let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[7].id.toString();
                            let q8_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[7].optionTwo.toString(), 
                            question_set[7].answer.toString(), q_responses, an_entry, q8_start, q8_end);
                            postAttempts(user_id, q_responses);
                            return true;
                    });
                        overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[7].optionTwo.toString());

                        let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[7].id.toString();
                            let q8_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[7].optionThree.toString(), 
                            question_set[7].answer.toString(), q_responses, an_entry, q8_start, q8_end);
                            postAttempts(user_id, q_responses);
                            return true;
                    });
                        overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[7].optionThree.toString());

                        let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[7].id.toString();
                            let q8_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[7].optionFour.toString(), 
                            question_set[7].answer.toString(), q_responses, an_entry, q8_start, q8_end);
                            postAttempts(user_id, q_responses);
                            return true;
                    });
                        overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[7].optionFour.toString());

                        overlay.addTapControl({ x: 10, y: 2.25, width: 1, height: .5, img: "hint.png" }, () => {
                            let hint_bar_1 = overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "hint_bar.png" }, () => {
                                hint_bar_1.remove(true);
                                return true;
                                })
                            return true;
                        });
                    });
                return true;
                };

                trigger8.setHeroCollisionCallback(lc8);
                trigger8.setCollisionsEnabled(false);
                    
    })

    let user_id = jl.score.getSessionFact("user_id", "error"); 

    console.log("the flag is " + flag);

    let trigger1000 = jl.world.makeObstacle({ box: true, x: 125, y: 5.50, width: 3, height: 2, img: "" });
        let lc2 =
        (thisActor: Obstacle, collideActor: Hero) => {
            thisActor.remove(true);
            game_end = new Date().getTime();
            console.log("end time is " + game_end)
            return true;
        };

        trigger1000.setHeroCollisionCallback(lc2);
        trigger1000.setCollisionsEnabled(false);

    jl.world.makeDestination({ x: 126, y: 2, width: 4.5, height: 5, img: "flag.png" });
    jl.score.setVictoryDestination(1);
    }

    else if (index == 6) {
        game_start = new Date().getTime();
        jl.world.setCameraBounds(160, 9);
        jl.world.drawBoundingBox(0, 0, 160, 9, "", 1, 0, 1);
        let h = jl.world.makeHero({ x: 0, y: 2.75, width: 2, height: 5, img: "a1.png", box: true});
        h.setDefaultAnimation(jl.makeAnimation(25, true, [
        "a1.png", "a2.png",  "a3.png", "a4.png", "a5.png", "a6.png", "a7.png", "a8.png", "a9.png", "a10.png", 
        "a11.png", "a12.png", "a13.png", "a14.png", "a15.png", "a16.png", "a17.png", "a18.png", "a19.png", "a20.png", 
        "a21.png", "a22.png", "a23.png", "a24.png", "a25.png", "a26.png", "a27.png", "a29.png", "a30.png", 
        "a31.png", "a32.png", "a33.png", "a34.png", "a35.png", "a36.png", "a37.png", "a38.png", "a39.png", "a40.png", 
        "a41.png", "a42.png", "a43.png", "a44.png", "a45.png", "a46.png", "a47.png", "a48.png", "a49.png", "a50.png", ]));
        h.disableRotation();
        h.setPhysics(5, 0, 0.6);
        h.addVelocity(1, 0);
        jl.world.setCameraChase(h);
        jl.world.makeDestination({ x: 159, y: 0, width: 1, height: 1, img: "mustardball.png" });
        jl.score.setVictoryDestination(1);

        // set up our background, with a few layers
        jl.world.setBackgroundColor(0x101010);
        //jl.world.drawPicture({ x: 0, y: 0, width: 16, height: 9, img: "lvl1_background.png", z: -1 });
        jl.world.addHorizontalBackgroundLayer({ x: 0, y: 0, width: 16, height: 9, img: "lvl2_moon.png"}, 0);
        //jl.world.addHorizontalForegroundLayer({ x: 0, y: 0, width: 16, height: 9, img: "mid.png" }, 0);
        jl.world.addHorizontalBackgroundLayer({ x: 0, y: 0, width: 16, height: 6, img: "lvl1_stars.png" }, 0.5);

        let q_responses: any[] = [];

        interface Question_Set {
            id: string
            question: string
            optionOne: string
            optionTwo: string
            optionThree: string
            optionFour: string
            answer: string
            questionSetId: string
        }

        let set_id = jl.score.getSessionFact("set_id", "error"); 
        let url = "http://localhost:8080/api/questions/sets/" + set_id;

        function getQuestion_Set(): Promise<Question_Set[]> {
            return fetch(url)
                .then(res => res.json())
                .then(res => {
                    return res as Question_Set[]
                })
         }

         //let result = document.getElementById('result')
        getQuestion_Set()
            .then(question_set => {

                let trigger1 = jl.world.makeObstacle({ box: true, x: 15, y: 5.50, width: 3, height: 2, img: "question_box.png" });
                
                let lc =
                (thisActor: Obstacle, collideActor: Hero) => {
                        let q1_start = new Date().getTime();
                        thisActor.remove(true);
                        jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                            overlay.addImage({ x: 0, y: 0, width: 16, height: 9, img: "black.png" });
        
                            overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                                return true;
                            });
                            overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => question_set[8].question.toString());

                            var an_entry: array_entry = {
                            //let an_entry: array_entry {
                                questionId: 0,
                                correct: 0,
                                time: 0,
                                picked: 0,

                            };

                            let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                                let q_id = question_set[8].id.toString();
                                let q1_end = new Date().getTime();
                                console.log("The question id in a11 is " + q_id);
                                checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[8].optionOne.toString(), 
                                question_set[8].answer.toString(), q_responses, an_entry, q1_start, q1_end);
                                flag = true;
                                return true;

                           });
                            overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => question_set[8].optionOne.toString());
        
                            let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                                let q1_end = new Date().getTime();
                                let q_id = question_set[8].id.toString();
                                checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[8].optionTwo.toString(), 
                                question_set[8].answer.toString(), q_responses, an_entry, q1_start, q1_end);
                                return true;
                           });
                            overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[8].optionTwo.toString());
        
                            let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                                let q1_end = new Date().getTime();
                                let q_id = question_set[8].id.toString();
                                checkAnswer(jl, overlay,q_id, a11, a12, a13, a14, question_set[8].optionThree.toString(), question_set[8].answer.toString(), 
                                q_responses, an_entry, q1_start, q1_end);
                                return true;

                           });
                            overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[8].optionThree.toString());
        
                            let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                                let q1_end = new Date().getTime();
                                let q_id = question_set[8].id.toString();
                                checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[8].optionFour.toString(), 
                                question_set[8].answer.toString(), q_responses, an_entry, q1_start, q1_end);
                                console.log("the array is " + q_responses)
                                return true;
                           });
                            overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[8].optionFour.toString());
            
                            overlay.addTapControl({ x: 10, y: 2.25, width: 1, height: .5, img: "hint.png" }, () => {
                                let hint_bar_1 = overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "hint_bar.png" }, () => {
                                    hint_bar_1.remove(true);
                                    return true;
                                })
                                return true;
                            });
                        return true;
                    });
                };
                trigger1.setHeroCollisionCallback(lc);
                trigger1.setCollisionsEnabled(false);

                let trigger2 = jl.world.makeObstacle({ box: true, x: 30, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
                let lc2 =
                (thisActor: Obstacle, collideActor: Hero) => {
                    let q2_start = new Date().getTime();
                    thisActor.remove(true);
                    // ask javascript what time it is 
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        overlay.addImage({ x: 0, y: 0, width: 16, height: 9, img: "black.png" });
                
                                    overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                                        return true;
                                    });
                                    overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => question_set[9].question.toString());

                                    var an_entry: array_entry = {
                                            questionId: 0,
                                            correct: 0,
                                            time: 0,
                                            picked: 0,
            
                                        };

                                    let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                                        let q_id = question_set[9].id.toString();
                                        let q2_end = new Date().getTime();
                                        checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[9].optionOne.toString(), 
                                        question_set[9].answer.toString(), q_responses, an_entry, q2_start, q2_end);
                                        return true;

                                });
                                    overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => question_set[9].optionOne.toString());
                
                                    let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                                        let q_id = question_set[9].id.toString();
                                        let q2_end = new Date().getTime();
                                        checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[9].optionTwo.toString(), 
                                        question_set[9].answer.toString(), q_responses, an_entry, q2_start, q2_end);
                                        return true;
                                });
                                    overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[9].optionTwo.toString());
                
                                    let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                                        let q_id = question_set[9].id.toString();
                                        let q2_end = new Date().getTime();
                                        checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[9].optionThree.toString(), 
                                        question_set[9].answer.toString(), q_responses, an_entry, q2_start, q2_end);
                                        return true;
                                });
                                    overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[9].optionThree.toString());
                
                                    let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                                        let q_id = question_set[9].id.toString();
                                        let q2_end = new Date().getTime();
                                        checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[9].optionFour.toString(), 
                                        question_set[9].answer.toString(), q_responses, an_entry, q2_start, q2_end);
                                        return true;
                                });
                                    overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[9].optionFour.toString());

                                    overlay.addTapControl({ x: 10, y: 2.25, width: 1, height: .5, img: "hint.png" }, () => {
                                        let hint_bar_1 = overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "hint_bar.png" }, () => {
                                            hint_bar_1.remove(true);
                                            return true;
                                            })
                                        return true;
                                    });
                        });
                return true;
                };

                trigger2.setHeroCollisionCallback(lc2);
                trigger2.setCollisionsEnabled(false);

                let trigger3 = jl.world.makeObstacle({ box: true, x: 45, y: 5.50, width: 3, height: 2, img: "question_box.png" });
                
                let lc3 =
                (thisActor: Obstacle, collideActor: Hero) => {
                    let q3_start = new Date().getTime();
                    thisActor.remove(true);
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        overlay.addImage({ x: 0, y: 0, width: 16, height: 9, img: "black.png" });
                
                        overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            return true;
                        });
                        overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => question_set[10].question.toString());

                        var an_entry: array_entry = {
                                questionId: 0,
                                correct: 0,
                                time: 0,
                                picked: 0,

                            };

                        let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[10].id.toString();
                            let q3_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[10].optionOne.toString(), 
                            question_set[10].answer.toString(), q_responses, an_entry, q3_start, q3_end);
                            return true;

                    });
                        overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => question_set[10].optionOne.toString());

                        let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[10].id.toString();
                            let q3_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[10].optionTwo.toString(), 
                            question_set[10].answer.toString(), q_responses, an_entry, q3_start, q3_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[10].optionTwo.toString());

                        let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[10].id.toString();
                            let q3_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[10].optionThree.toString(), 
                            question_set[10].answer.toString(), q_responses, an_entry, q3_start, q3_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[10].optionThree.toString());

                        let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[10].id.toString();
                            let q3_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[10].optionFour.toString(), 
                            question_set[10].answer.toString(), q_responses, an_entry, q3_start, q3_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[10].optionFour.toString());

                        overlay.addTapControl({ x: 10, y: 2.25, width: 1, height: .5, img: "hint.png" }, () => {
                            let hint_bar_1 = overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "hint_bar.png" }, () => {
                                hint_bar_1.remove(true);
                                return true;
                                })
                            return true;
                        });
                        });
                    return true;
                };

                trigger3.setHeroCollisionCallback(lc3);
                trigger3.setCollisionsEnabled(false);


                let trigger4 = jl.world.makeObstacle({ box: true, x: 60, y: 5.50, width: 3, height: 2, img: "question_box.png" });
                
                let lc4 =
                (thisActor: Obstacle, collideActor: Hero) => {
                    let q4_start = new Date().getTime();
                    thisActor.remove(true);
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        overlay.addImage({ x: 0, y: 0, width: 16, height: 9, img: "black.png" });
                
                        overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            return true;
                        });
                        overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => question_set[11].question.toString());

                        var an_entry: array_entry = {
                                questionId: 0,
                                correct: 0,
                                time: 0,
                                picked: 0,

                            };

                        let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[11].id.toString();
                            let q4_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[11].optionOne.toString(), 
                            question_set[11].answer.toString(), q_responses, an_entry, q4_start, q4_end);
                            return true;

                    });
                        overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => question_set[11].optionOne.toString());

                        let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[11].id.toString();
                            let q4_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[11].optionTwo.toString(), 
                            question_set[11].answer.toString(), q_responses, an_entry, q4_start, q4_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[11].optionTwo.toString());

                        let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[11].id.toString();
                            let q4_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[11].optionThree.toString(), 
                            question_set[11].answer.toString(), q_responses, an_entry, q4_start, q4_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[11].optionThree.toString());

                        let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[11].id.toString();
                            let q4_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[11].optionFour.toString(), 
                            question_set[11].answer.toString(), q_responses, an_entry, q4_start, q4_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[11].optionFour.toString());

                        overlay.addTapControl({ x: 10, y: 2.25, width: 1, height: .5, img: "hint.png" }, () => {
                            let hint_bar_1 = overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "hint_bar.png" }, () => {
                                hint_bar_1.remove(true);
                                return true;
                                })
                            return true;
                        });
                    });
                return true;
                };

                trigger4.setHeroCollisionCallback(lc4);
                trigger4.setCollisionsEnabled(false);

                let trigger5 = jl.world.makeObstacle({ box: true, x: 75, y: 5.50, width: 3, height: 2, img: "question_box.png" });
            
                let lc5 =
                (thisActor: Obstacle, collideActor: Hero) => {
                    let q5_start = new Date().getTime();
                    thisActor.remove(true);
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        overlay.addImage({ x: 0, y: 0, width: 16, height: 9, img: "black.png" });
                
                        overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            return true;
                        });
                        overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => question_set[12].question.toString());

                        var an_entry: array_entry = {
                                questionId: 0,
                                correct: 0,
                                time: 0,
                                picked: 0,

                            };

                        let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[12].id.toString();
                            let q5_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[12].optionOne.toString(), 
                            question_set[12].answer.toString(), q_responses, an_entry, q5_start, q5_end);
                            return true;

                    });
                        overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => question_set[12].optionOne.toString());

                        let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[12].id.toString();
                            let q5_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[12].optionTwo.toString(), 
                            question_set[12].answer.toString(), q_responses, an_entry, q5_start, q5_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[12].optionTwo.toString());

                        let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[12].id.toString();
                            let q5_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[12].optionThree.toString(), 
                            question_set[12].answer.toString(), q_responses, an_entry, q5_start, q5_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[12].optionThree.toString());

                        let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[12].id.toString();
                            let q5_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[12].optionFour.toString(), 
                            question_set[12].answer.toString(), q_responses, an_entry, q5_start, q5_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[12].optionFour.toString());

                        overlay.addTapControl({ x: 10, y: 2.25, width: 1, height: .5, img: "hint.png" }, () => {
                            let hint_bar_1 = overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "hint_bar.png" }, () => {
                                hint_bar_1.remove(true);
                                return true;
                                })
                            return true;
                        });
                    });
                return true;
                };

                trigger5.setHeroCollisionCallback(lc5);
                trigger5.setCollisionsEnabled(false);

                let trigger6 = jl.world.makeObstacle({ box: true, x: 90, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
                let lc6 =
                
                (thisActor: Obstacle, collideActor: Hero) => {
                    let q6_start = new Date().getTime();
                    thisActor.remove(true);
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        overlay.addImage({ x: 0, y: 0, width: 16, height: 9, img: "black.png" });
                
                        overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            return true;
                        });
                        overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => question_set[13].question.toString());

                        var an_entry: array_entry = {
                                questionId: 0,
                                correct: 0,
                                time: 0,
                                picked: 0,

                            };

                        let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[13].id.toString();
                            let q6_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[13].optionOne.toString(), 
                            question_set[13].answer.toString(), q_responses, an_entry, q6_start, q6_end);
                            return true;

                    });
                        overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => question_set[13].optionOne.toString());

                        let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[13].id.toString();
                            let q6_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[13].optionTwo.toString(), 
                            question_set[13].answer.toString(), q_responses, an_entry, q6_start, q6_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[13].optionTwo.toString());

                        let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[13].id.toString();
                            let q6_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[13].optionThree.toString(), 
                            question_set[13].answer.toString(), q_responses, an_entry, q6_start, q6_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[13].optionThree.toString());

                        let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[13].id.toString();
                            let q6_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[13].optionFour.toString(), 
                            question_set[13].answer.toString(), q_responses, an_entry, q6_start, q6_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[13].optionFour.toString());

                        overlay.addTapControl({ x: 10, y: 2.25, width: 1, height: .5, img: "hint.png" }, () => {
                            let hint_bar_1 = overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "hint_bar.png" }, () => {
                                hint_bar_1.remove(true);
                                return true;
                                })
                            return true;
                        });
                    });
                return true;
                };

                trigger6.setHeroCollisionCallback(lc6);
                trigger6.setCollisionsEnabled(false);

                let trigger7 = jl.world.makeObstacle({ box: true, x: 105, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
                let lc7 =
                (thisActor: Obstacle, collideActor: Hero) => {
                    let q7_start = new Date().getTime();
                    thisActor.remove(true);
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        overlay.addImage({ x: 0, y: 0, width: 16, height: 9, img: "black.png" });
                
                        overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            return true;
                        });
                        overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => question_set[14].question.toString());

                        var an_entry: array_entry = {
                                questionId: 0,
                                correct: 0,
                                time: 0,
                                picked: 0,

                            };

                        let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[14].id.toString();
                            let q7_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[14].optionOne.toString(), 
                            question_set[14].answer.toString(), q_responses, an_entry, q7_start, q7_end);
                            return true;

                    });
                        overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => question_set[14].optionOne.toString());

                        let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[14].id.toString();
                            let q7_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[14].optionTwo.toString(), 
                            question_set[14].answer.toString(), q_responses, an_entry, q7_start, q7_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[14].optionTwo.toString());

                        let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[14].id.toString();
                            let q7_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[14].optionThree.toString(), 
                            question_set[14].answer.toString(), q_responses, an_entry, q7_start, q7_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[14].optionThree.toString());

                        let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[14].id.toString();
                            let q7_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[14].optionFour.toString(), 
                            question_set[14].answer.toString(), q_responses, an_entry, q7_start, q7_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[14].optionFour.toString());

                        overlay.addTapControl({ x: 10, y: 2.25, width: 1, height: .5, img: "hint.png" }, () => {
                            let hint_bar_1 = overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "hint_bar.png" }, () => {
                                hint_bar_1.remove(true);
                                return true;
                                })
                            return true;
                        });
                    });
                return true;
                };

                trigger7.setHeroCollisionCallback(lc7);
                trigger7.setCollisionsEnabled(false);

                let trigger8 = jl.world.makeObstacle({ box: true, x: 120, y: 5.50, width: 3, height: 2, img: "question_box.png" });
    
                let lc8 =
                (thisActor: Obstacle, collideActor: Hero) => {
                    let q8_start = new Date().getTime();
                    thisActor.remove(true);
                    jl.nav.setPauseSceneBuilder((overlay: OverlayApi) => {
                        overlay.addImage({ x: 0, y: 0, width: 16, height: 9, img: "black.png" });
                
                        overlay.addTapControl({ x: 5.5, y: .75, width: 5, height: 2, img: "question_bar.png" }, (eventPositionX: number, eventPositionY: number) => {
                            return true;
                        });
                        overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#000000", size: 40, z: 0 }, () => question_set[15].question.toString());

                        var an_entry: array_entry = {
                                questionId: 0,
                                correct: 0,
                                time: 0,
                                picked: 0,

                            };

                        let a11 = overlay.addTapControl({ x: 1.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[15].id.toString();
                            let q8_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[15].optionOne.toString(), 
                            question_set[15].answer.toString(), q_responses, an_entry, q8_start, q8_end);

                            return true;

                    });
                        overlay.addText({ center: true, x: 2.75, y: 4.625, face: "Arial", color: "#101010", size: 75, z: 0 }, () => question_set[15].optionOne.toString());

                        let a12 = overlay.addTapControl({ x: 5.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[15].id.toString();
                            let q8_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[15].optionTwo.toString(), 
                            question_set[15].answer.toString(), q_responses, an_entry, q8_start, q8_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 6.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[15].optionTwo.toString());

                        let a13 = overlay.addTapControl({ x: 8.75, y: 3.5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[15].id.toString();
                            let q8_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[15].optionThree.toString(), 
                            question_set[15].answer.toString(), q_responses, an_entry, q8_start, q8_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 9.75, y: 4.625, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[15].optionThree.toString());

                        let a14 = overlay.addTapControl({ x: 12.25, y: 5, width: 2, height: 2, img: "answer_bar.png" }, () => {
                            let q_id = question_set[15].id.toString();
                            let q8_end = new Date().getTime();
                            checkAnswer(jl, overlay, q_id, a11, a12, a13, a14, question_set[15].optionFour.toString(), 
                            question_set[15].answer.toString(), q_responses, an_entry, q8_start, q8_end);
                            return true;
                    });
                        overlay.addText({ center: true, x: 13.25, y: 6.125, face: "Arial", color: "#0f0f0f", size: 75, z: 0 }, () => question_set[15].optionFour.toString());

                        overlay.addTapControl({ x: 10, y: 2.25, width: 1, height: .5, img: "hint.png" }, () => {
                            let hint_bar_1 = overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "hint_bar.png" }, () => {
                                hint_bar_1.remove(true);
                                return true;
                                })
                            return true;
                        });
                    });
                return true;
                };

                trigger8.setHeroCollisionCallback(lc8);
                trigger8.setCollisionsEnabled(false);
                    
    })

    let user_id = jl.score.getSessionFact("user_id", "error"); 

    console.log("the flag is " + flag);

    let trigger1000 = jl.world.makeObstacle({ box: true, x: 125, y: 5.50, width: 3, height: 2, img: "" });
        let lc2 =
        (thisActor: Obstacle, collideActor: Hero) => {
            thisActor.remove(true);
            game_end = new Date().getTime();
            console.log("end time is " + game_end)
            return true;
        };

        trigger1000.setHeroCollisionCallback(lc2);
        trigger1000.setCollisionsEnabled(false);

    jl.world.makeDestination({ x: 126, y: 2, width: 4.5, height: 5, img: "flag.png" });
    jl.score.setVictoryDestination(1);

}



function timeDiff(start: any, end: any){
    let time = (end - start)/1000
    return time;
}

function clean_date(){
    let today = new Date().toISOString().slice(0, 10)
    return today;
}

function postAttempts(user_id: any, array: any){
    let a_url = 'http://localhost:8080/api/users/' + user_id + '/attempts'
    fetch(a_url, {
        method: "post",
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'},
    
        body: JSON.stringify({
                world: "spaceQuest",
                date: clean_date(),
                totalscore: score,
                totaltime: timeDiff(game_start, game_end),
                userId: user_id,
        })
    })

    .then( (response) => { 
        return response.json();
    }).then(jsonResponse => {
        console.log("the id you want elene is " + jsonResponse.id.toString());
        postAnswers(array, jsonResponse.id.toString(), a_url);

    }).catch (error => {
        console.log(error)
    })
}

function postAnswers(array: any, attemptID: any, a_url: any){
    let s_url = a_url + '/' + attemptID;
    console.log("the s_url is " + s_url);
    fetch(s_url, {
        method: "post",
        headers: {
            'Content-Type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({
                array
        })
    })
}


function checkAnswer(jl: JetLagApi, overlay: OverlayApi, question_id: string, o1: any, o2: any, o3: any, o4: any, 
    choice: string, right: string, answers: Array<any>, entry: array_entry, start_time: any, end_time: any) {
    o1.remove(true);    
    o2.remove(true); 
    o3.remove(true);
    o4.remove(true);
    if (choice == right){
        score++;
        entry.correct = true;
        entry.questionId = question_id;
        entry.time = timeDiff(start_time, end_time);        
        entry.picked = choice;
        answers.push(entry)
        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "right_bar.png" }, () => {
            jl.nav.dismissOverlayScene();
            return true;
        })
    }
    else {
        entry.correct = false;
        entry.questionId = question_id;
        entry.time = timeDiff(start_time, end_time);        
        entry.picked = choice;
        answers.push(entry)
        overlay.addTapControl({ x: 4, y: 3, width: 8, height: 3, img: "wrong_bar.png" }, () => {
            jl.nav.dismissOverlayScene();
            return false;
        })

    }
   
    return true;
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
export function winMessage(jl: JetLagApi, score: Number, callback: () => void = null) {
    jl.nav.setWinSceneBuilder((overlay: OverlayApi) => {
        overlay.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "entire_background.png" }, () => {
            jl.nav.nextLevel();
            return true;
        });
        overlay.addText({ center: true, x: 8, y: 1.75, face: "Arial", color: "#ffffff", size: 100, z: 0 }, () => "CONGRATULATIONS!");
        overlay.addText({ center: true, x: 8, y: 4, face: "Arial", color: "#ffffff", size: 80, z: 0 }, () => "Your score is " + score + "/8");
        //overlay.addText({ center: true, x: 8, y: 4.5, face: "Arial", color: "#FFFFFF", size: 28, z: 0 }, () => message);
        if (callback !== null)
            callback();
    });
}

export function eleneMessage(jl: JetLagApi, message: string, callback: () => void = null) {
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

