import { JetLagApi } from "../jetlag/api/JetLagApi";
import { JetLagKeys } from "../jetlag/support/JetLagKeys";

/**
 * In games that have a store, there should be a button on the main screen (or
 * somewhere!) for going to the store.  Within the store, there may be many
 * different screens, corresponding to different sections of the store.
 * 
 * This code builds the screens of the store.  It is done the same way as any
 * other part of a game, but will probably make more extensive use of the
 * key/value storage to keep track of coins, inventories, etc.
 * 
 * Note: Our demo doesn't use a store, so this function doesn't do anything.
 *
 * @param index Which store screen should be displayed
 * @param jl    The JetLag object, for putting stuff into the level
 */

export function buildStoreScreen(index: number, jl: JetLagApi): void {

    // This line ensures that, no matter what level we draw, the ESCAPE key is
    // configured to go back to the Splash.  We don't go to Splash on down-press
    // of ESCAPE, but when the key is released.
    jl.setUpKeyAction(JetLagKeys.ESCAPE, () => { jl.nav.doSplash(1); });

    if (index == 2) {

        // Light blue background
        jl.world.setBackgroundColor(0x00000);

        // // put some information and pictures on the screen
        //l.world.addText({ center: true, x: 8, y: 1, face: "Arial", color: "#FFFFFF", size: 56, z: 0 }, () => "The help page is still in development :) Come back soon!");

        interface User {
            id: string
            username: string
        }

        function getUsers(): Promise<User[]> {
            //return fetch('http://localhost:8080/api/users/')
            return fetch('http://18.213.184.103:8080/api/users/')
                .then(res => res.json())
                .then(res => {
                    return res as User[]
                })
         }

        let num_users = 0;

         //let result = document.getElementById('result')
         getUsers()
            .then(users => {

                num_users = users.length;
            
                let b_counter = 0;
                for (let row = 0, y = 2.6, l = 0; row < 3; ++row, y += 1.75) {
                    let x = 1.15;
                    // i = number of boxes per row 
                    for (let i = 0; i < 4; ++i, ++l, x += 3.6) {
                        if (l < num_users){
                            drawUserButton(jl, x, y, 3, 1.25, "user_id", users[b_counter].id.toString());
                            let e = users[b_counter].username.toString();
                            console.log(e);
                            jl.hud.addText({ x: x + 0.5 , y: y + 0.25, face: "Helvetica", color: "#000000", size: 50, z: 2 }, () => e);
                            jl.world.drawPicture({ x: x, y: y, width: 3, height: 1.25, img: "white_box.png"});
                            b_counter++;
                            ////jl.hud.addText({ x: x, y: 2, face: "Arial", color: "#3C46FF", size: 12, z: 2 }, () => users[b_counter].username.toString());

                        }
                    }
                }


            })


        jl.world.drawPicture({ x: 0, y: 0, width: 16, height: 9, img: "user_menu.png" });
        // draw the navigation buttons
        if (index < 0){
            drawNextButton(jl, 15, 5.125, 1, 1, index + 1);
            drawPrevButton(jl, 0, 5.125, 1, 1, index - 1);
        }
        drawSplashButton(jl, 15, 8, 1, 1);
        

    }

    //QuestionSet screen
    if (index == 1) {
        jl.world.drawPicture({ x: 0, y: 0, width: 16, height: 9, img: "set_menu.png" });

        //put some information and pictures on the screen
        //jl.world.addText({ center: true, x: 8, y: 1, face: "Arial", color: "#FFFFFF", size: 56, z: 0 }, () => "The help page is still in development :) Come back soon!");

        interface QuestionSets {
            id: string
            grade: string
            subject: string
            topic: string

        }

        function getQuestionSets(): Promise<QuestionSets[]> {
            //return fetch('http://localhost:8080/api/questionSets')
            return fetch('http://18.213.184.103:8080/api/questionSets')
                .then(res => res.json())
                .then(res => {
                    return res as QuestionSets[]
                })
         }

        let num_sets = 0;

         //let result = document.getElementById('result')
         getQuestionSets()
            .then(question_sets => {

                num_sets = question_sets.length;

                let b_counter = 0;
                for (let row = 0, y = 2.6, l = 0; row < 3; ++row, y += 1.75) {
                    let x = 1.5;
                    // i = number of boxes per row 
                    for (let i = 0; i < 3; ++i, ++l, x += 4.5) {
                        if (l < num_sets){
                            drawSetButton(jl, x, y, 3, 2.5, "set_id", question_sets[b_counter].id.toString());
                            let id = question_sets[b_counter].id.toString();
                            let subject = question_sets[b_counter].subject.toString();
                            let topic = question_sets[b_counter].topic.toString();
                            console.log(id);
                            //jl.hud.addText({ x: x + 0.5 , y: y + 0.25, face: "Helvetica", color: "#000000", size: 50, z: 2 }, () => id);
                            jl.hud.addText({ x: x + 1 , y: y + 0.75, face: "Helvetica", color: "#000000", size: 40, z: 2 }, () => subject);
                            jl.hud.addText({ x: x + 0.72 , y: y + 1.25, face: "Helvetica", color: "#0d3cd6", size: 40, z: 2 }, () => topic);
                            jl.world.drawPicture({ x: x, y: y, width: 3, height: 2.5, img: "orange_box.png"});
                            b_counter++;
                            ////jl.hud.addText({ x: x, y: 2, face: "Arial", color: "#3C46FF", size: 12, z: 2 }, () => users[b_counter].username.toString());

                        }
                    }
                }

                //console.dir(question_sets)

                // let b_counter = 0;
                // for (let row = 0, y = 3.25, l = 0; row < 3; ++row, y += 1.75) {
                //     let x = .75;
                //     // i = number of boxes per row 
                //     for (let i = 0; i < 4; ++i, ++l, x += 3.75) {
                //         if (l < num_sets){
                //             let e = question_sets[b_counter].id.toString();
                //             console.log(e);
                //             //jl.world.drawPicture({ x: x, y: y, width: 3, height: 1.25, img: "white_box.png"});
                //             jl.hud.addText({ x: x + 0.5 , y: y + 0.25, face: "Helvetica", color: "#000000", size: 50, z: 2 }, () => e);
                //             drawSetButton(jl, x, y, 3, 1.25, "set_id", question_sets[b_counter].id.toString());
                //             b_counter++;

                //         }
                //     }
                // }

                // jl.hud.addText({ x: 2.25, y: 3.5, face: "Arial", color: "#FFFFFF", size: 20, z: 2 }, () => question_sets[0].id.toString());
                // jl.hud.addText({ x: 2.1, y: 3.8, face: "Arial", color: "#FFFFFF", size: 20, z: 2 }, () => question_sets[0].subject.toString());
                // jl.hud.addText({ x: 1.95, y: 4.1, face: "Arial", color: "#FFFFFF", size: 20, z: 2 }, () => question_sets[0].topic.toString());

                // jl.hud.addText({ x: 6, y: 3.5, face: "Arial", color: "#FFFFFF", size: 20, z: 2 }, () => question_sets[1].id.toString());
                // jl.hud.addText({ x: 5.85, y: 3.8, face: "Arial", color: "#FFFFFF", size: 20, z: 2 }, () => question_sets[1].subject.toString());
                // jl.hud.addText({ x: 5.7, y: 4.1, face: "Arial", color: "#FFFFFF", size: 20, z: 2 }, () => question_sets[1].topic.toString());

            })

        // draw the navigation buttons
        if (index < 0){
            drawNextButton(jl, 15, 5.125, 1, 1, index + 1);
            drawPrevButton(jl, 0, 5.125, 1, 1, index - 1);
        }
        drawSplashButton(jl, 15, 8, 1, 1);
        
    }

        // set up a control to go to the splash screen on screen tap
        // jl.hud.addTapControl({ x: 0, y: 0, width: 16, height: 9, img: "" }, () => {
        //     jl.nav.doSplash(1);
        //     return true;
        // });      
}

/**
 * This is a helper function for drawing a level button. If the level is
 * locked, the button isn't playable. Otherwise, the player can tap the
 * button to start a level.
 *
 * @param x      X coordinate of the top left corner of the button
 * @param y      Y coordinate of the top left corner of the button
 * @param width  width of the button
 * @param height height of the button
 * @param whichLevel  which level to play when the button is tapped
 */
// function drawLevelButton(jl: JetLagApi, x: number, y: number, width: number, height: number, whichLevel: number): void {
//     // for each button, start by drawing an obstacle
//     //let tile = jl.world.makeObstacle({ box: true, x: x, y: y, width: width, height: height, img: "leveltile.png" });
//     let tile = jl.world.makeObstacle({ box: true, x: x, y: y, width: width, height: height});

//     // attach a callback and print the level number with a touchCallback, and then put text on top of it
//     tile.setTapHandler(() => { jl.nav.doLevel(whichLevel); return true; });
//     //jl.world.addText({ center: true, x: x + width / 2, y: y + width / 2, face: "Arial", color: "#FFFFFF", size: 56, z: 0 }, () => { return whichLevel + "" });
// }

function drawUserButton(jl: JetLagApi, x: number, y: number, width: number, height: number, fact_name: string, user_id: string): void {
    // for each button, start by drawing an obstacle
    //let tile = jl.world.makeObstacle({ box: true, x: x, y: y, width: width, height: height, img: "leveltile.png" });
    let tile = jl.world.makeObstacle({ box: true, x: x, y: y, width: width, height: height});

    //tile.setTapHandler(() => { jl.nav.doChooser(1); return true; });
     tile.setTapHandler(() => {
         jl.score.setSessionFact(fact_name, user_id); 
         jl.nav.doChooser(1)
         return true; });

     
       // jl.nav.doLevel(whichLevel); return true; });
}

function drawSetButton(jl: JetLagApi, x: number, y: number, width: number, height: number, fact_name: string, set_id: string): void {
    // for each button, start by drawing an obstacle
    //let tile = jl.world.makeObstacle({ box: true, x: x, y: y, width: width, height: height, img: "leveltile.png" });
    let tile = jl.world.makeObstacle({ box: true, x: x, y: y, width: width, height: height});

    //tile.setTapHandler(() => { jl.nav.doChooser(1); return true; });
     tile.setTapHandler(() => {
         jl.score.setSessionFact(fact_name, set_id); 
         jl.nav.doChooser(1)
         return true; });

     
       // jl.nav.doLevel(whichLevel); return true; });
}

function drawPrevButton(jl: JetLagApi, x: number, y: number, width: number, height: number, chooserLevel: number) {
    let btn = jl.world.makeObstacle({ box: true, x: x, y: y, width: width, height: height, img: "leftarrow.png" });
    btn.setTapHandler(() => { jl.nav.doChooser(chooserLevel); return true; });
}

/**
 * This helper function is for drawing the button that takes us to the next chooser screen
 *
 * @param x            X coordinate of top left corner of the button
 * @param y            Y coordinate of top left corner of the button
 * @param width        width of the button
 * @param height       height of the button
 * @param chooserLevel The chooser screen to create
 */
function drawNextButton(jl: JetLagApi, x: number, y: number, width: number, height: number, chooserLevel: number) {
    let btn = jl.world.makeObstacle({ box: true, x: x, y: y, width: width, height: height, img: "rightarrow.png" });
    btn.setTapHandler(() => { jl.nav.doChooser(chooserLevel); return true; });
}

/**
 * This helper function is for drawing the button that takes us back to the splash screen
 *
 * @param x      X coordinate of top left corner of the button
 * @param y      Y coordinate of top left corner of the button
 * @param width  width of the button
 * @param height height of the button
 */
function drawSplashButton(jl: JetLagApi, x: number, y: number, width: number, height: number) {
    let btn = jl.world.makeObstacle({ box: true, x: x, y: y, width: width, height: height, img: "backarrow.png" });
    btn.setTapHandler(() => { jl.nav.doSplash(1); return true; });
}

 