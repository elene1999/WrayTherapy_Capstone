import { JetLagManager } from "../JetLagManager"
import { VictoryType } from "../stage/Stage"

/**
 * ScoreApi provides an interface for configuring everything related to the
 * score, lose, and win conditions for the current level.
 */
export class ScoreApi {
    /**
     * Construct the ScoreApi
     *
     * @param manager the JetLagManager for the game
     */
    constructor(private manager: JetLagManager) { }

    /**
     * Look up a fact that was stored for the current game session. If no such fact exists,
     * defaultVal will be returned.
     *
     * @param factName   The name used to store the fact
     * @param defaultVal The value to return if the fact does not exist
     * @return The string value corresponding to the last value stored
     */
    public getGameFact(factName: string, defaultVal: string): string {
        return this.manager.device.storage.getPersistent(factName, defaultVal);
    }

    /**
     * Look up a fact that was stored for the current level. If no such fact exists, defaultVal will
     * be returned.
     *
     * @param factName   The name used to store the fact
     * @param defaultVal The default value to use if the fact cannot be found
     * @return The integer value corresponding to the last value stored
     */
    public getLevelFact(factName: string, defaultVal: string): string {
        return this.manager.device.storage.getLevel(factName, defaultVal);
    }

    /**
     * Look up a fact that was stored for the current game session. If no such fact exists, -1 will
     * be returned.
     *
     * @param factName   The name used to store the fact
     * @param defaultVal The default value to use if the fact cannot be found
     * @return The integer value corresponding to the last value stored
     */
    public getSessionFact(factName: string, defaultVal: string) {
        return this.manager.device.storage.getSession(factName, defaultVal);
    }

    /**
     * Save a fact about the current level. If the factName has already been used for this level,
     * the new value will overwrite the old.
     *
     * @param factName  The name for the fact being saved
     * @param factValue The integer value that is the fact being saved
     */
    public setLevelFact(factName: string, factValue: string) {
        this.manager.device.storage.setLevel(factName, factValue);
    }

    /**
     * Save a fact about the current game session. If the factName has already been used for this
     * game session, the new value will overwrite the old.
     *
     * @param factName  The name for the fact being saved
     * @param factValue The integer value that is the fact being saved
     */
    public setSessionFact(factName: string, factValue: string) {
        this.manager.device.storage.setSession(factName, factValue);
    }


    /**
     * Save a fact about the current game session. If the factName has already been used for this
     * game session, the new value will overwrite the old.
     *
     * @param factName  The name for the fact being saved
     * @param factValue The integer value that is the fact being saved
     */
    public setGameFact(factName: string, factValue: string) {
        this.manager.device.storage.setPersistent(factName, factValue);
    }

    /**
     * Indicate that the level is won by having a certain number of heroes reach destinations
     *
     * @param howMany Number of heroes that must reach destinations
     */
    public setVictoryDestination(howMany: number): void {
        this.manager.getCurrStage().mVictoryType = VictoryType.DESTINATION;
        this.manager.getCurrStage().score.mVictoryHeroCount = howMany;
    }

    /**
     * Indicate that the level is won by defeating a certain number of enemies
     * or by defeating all of the enemies if not given an argument. This version
     * is useful if the number of enemies isn't known, or if the goal is to
     * defeat all enemies before more are are created.
     *
     * @param howMany The number of enemies that must be defeated to win the level
     */
    public setVictoryEnemyCount(howMany?: number): void {
        this.manager.getCurrStage().mVictoryType = VictoryType.ENEMYCOUNT;
        if (howMany) {
            this.manager.getCurrStage().score.mVictoryEnemyCount = howMany;
        } else {
            this.manager.getCurrStage().score.mVictoryEnemyCount = -1;
        }
    }

    /**
     * Indicate that the level is won by collecting enough goodies
     *
     * @param v1 Number of type-1 goodies that must be collected to win the level
     * @param v2 Number of type-2 goodies that must be collected to win the level
     * @param v3 Number of type-3 goodies that must be collected to win the level
     * @param v4 Number of type-4 goodies that must be collected to win the level
     */
    public setVictoryGoodies(v1: number, v2: number, v3: number, v4: number): void {
        this.manager.getCurrStage().mVictoryType = VictoryType.GOODIECOUNT;
        this.manager.getCurrStage().score.mVictoryGoodieCount[0] = v1;
        this.manager.getCurrStage().score.mVictoryGoodieCount[1] = v2;
        this.manager.getCurrStage().score.mVictoryGoodieCount[2] = v3;
        this.manager.getCurrStage().score.mVictoryGoodieCount[3] = v4;
    }

    /**
     * Return the number of type-1 goodies that have been collected in the current level
     */
    public getGoodies1(): number {
        return this.manager.getCurrStage().score.mGoodiesCollected[0];
    }

    /**
     * Return the number of type-2 goodies that have been collected in the current level
     */
    public getGoodies2(): number {
        return this.manager.getCurrStage().score.mGoodiesCollected[1];
    }

    /**
     * Return the number of type-3 goodies that have been collected in the current level
     */
    public getGoodies3(): number {
        return this.manager.getCurrStage().score.mGoodiesCollected[2];
    }

    /**
     * Return the number of type-4 goodies that have been collected in the current level
     */
    public getGoodies4(): number {
        return this.manager.getCurrStage().score.mGoodiesCollected[3];
    }

    /**
     * Manually increment the number of goodies of type 1 that have been collected.
     */
    public incrementGoodies1() {
        this.manager.getCurrStage().score.mGoodiesCollected[0]++;
    }

    /**
     * Manually increment the number of goodies of type 2 that have been collected.
     */
    public incrementGoodies2() {
        this.manager.getCurrStage().score.mGoodiesCollected[1]++;
    }

    /**
     * Manually increment the number of goodies of type 3 that have been collected.
     */
    public incrementGoodies3() {
        this.manager.getCurrStage().score.mGoodiesCollected[2]++;
    }

    /**
     * Manually increment the number of goodies of type 4 that have been collected.
     */
    public incrementGoodies4() {
        this.manager.getCurrStage().score.mGoodiesCollected[3]++;
    }

    /**
     * Manually set the number of goodies of type 1 that have been collected.
     *
     * @param value The new value
     */
    public setGoodies1(value: number) {
        this.manager.getCurrStage().score.mGoodiesCollected[0] = value;
    }

    /**
     * Manually set the number of goodies of type 2 that have been collected.
     *
     * @param value The new value
     */
    public setGoodies2(value: number) {
        this.manager.getCurrStage().score.mGoodiesCollected[1] = value;
    }

    /**
     * Manually set the number of goodies of type 3 that have been collected.
     *
     * @param value The new value
     */
    public setGoodies3(value: number) {
        this.manager.getCurrStage().score.mGoodiesCollected[2] = value;
    }

    /**
     * Manually set the number of goodies of type 4 that have been collected.
     *
     * @param value The new value
     */
    public setGoodies4(value: number) {
        this.manager.getCurrStage().score.mGoodiesCollected[3] = value;
    }

    /**
     * Return the remaining time until the level is lost
     */
    public getLoseCountdown(): number {
        return this.manager.getCurrStage().score.mLoseCountDownRemaining;
    }

    /**
     * Change the amount of time left in a countdown timer
     *
     * @param delta The amount of time to add before the timer expires
     */
    public updateTimerExpiration(delta: number): void {
        this.manager.getCurrStage().score.mLoseCountDownRemaining += delta;
    }

    /**
     * Return the remaining time until the level is won
     */
    public getWinCountdown(): number {
        return this.manager.getCurrStage().score.mWinCountRemaining;
    }

    /**
     * Indicate that the level will end in defeat if it is not completed in a given amount of time.
     *
     * @param timeout The amount of time until the level will end in defeat
     */
    public setLoseCountdown(timeout: number) {
        // Once the Lose CountDown is not -100, it will start counting down
        this.manager.getCurrStage().score.mLoseCountDownRemaining = timeout;
    }

    /**
     * Indicate that the level will end in victory if the hero survives for a given amount of time
     *
     * @param timeout The amount of time until the level will end in victory
     */
    public setWinCountdown(timeout: number) {
        // Once the Win CountDown is not -100, it will start counting down
        this.manager.getCurrStage().score.mWinCountRemaining = timeout;
    }

    /**
     * Set the current value of the stopwatch.  Use -100 to disable the stopwatch, otherwise it will
     * start counting immediately.
     *
     * @param newVal The new value of the stopwatch
     */
    public setStopwatch(newVal: number) {
        this.manager.getCurrStage().score.mStopWatchProgress = newVal;
    }

    /**
     * Report the stopwatch value
     */
    public getStopwatch(): number {
        // Inactive stopwatch should return 0
        if (this.manager.getCurrStage().score.mStopWatchProgress == -100)
            return 0;
        return this.manager.getCurrStage().score.mStopWatchProgress;
    }

    /**
     * Return the total number of enemies that have been defeated so far
     */
    public getEnemiesDefeated(): number {
        return this.manager.getCurrStage().getEnemiesDefeated();
    }

    /**
     * Generate text indicating the number of remaining projectiles
     */
    public getRemainingProjectiles() {
        return this.manager.getCurrStage().world.projectilePool.mProjectilesRemaining;
    }

    /**
     * Force the level to end in victory
     * 
     * This is useful in callbacks, where we might want to immediately end the game
     */
    public winLevel() {
        this.manager.getCurrStage().endLevel(true);
    }

    /**
     * Force the level to end in defeat
     * 
     * This is useful in callbacks, where we might want to immediately end the game
     */
    public loseLevel() {
        this.manager.getCurrStage().endLevel(false);
    }
}