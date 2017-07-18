import { tileTypes } from '../constants';
import { getTilesByType, getAllTilesWithArmyForPlayer, getClosest, moveTowards } from '../game/boardUtilities';
import { move } from '../game/gameActions';

export default class CalmAndNicePersonPlayer {
	static getName() { return 'calmandniceperson' };
	
	constructor(color) {
        this.name = CalmAndNicePersonPlayer.getName();
        this.color = color;
    }
    
    play(board) {
        const tilesWithArmy = getAllTilesWithArmyForPlayer(board, this);
        return this.getPriorityMove(board, tilesWithArmy);
    }

    /* Determines which move is most important to our strategy right now. */
    getPriorityMove(board, tilesWithArmy) {
        // Get the amunt of unclaimed major spawn tiles.
        const unclaimedSpawnTileCount = getTilesByType(board, tileTypes.MAJOR_SPAWN).filter(tile => !tile.player || tile.player !== this).length;
        const unclaimedCapturePointCount = getTilesByType(board, tileTypes.CAPTURE_POINT).filter(tile => tile.player !== this).length;
        const capturePointsClaimedByEnemy = getTilesByType(board, tileTypes.CAPTURE_POINT).filter(tile => tile.player && tile.player !== this).length;

        // Here we try to find out which move is the most imporant right now.
        // The highest priority has the capture move, which takes capture points as fast as
        // it can, if the enemy has already captured at least 2 of them.
        // The second highest priority is capturing major spawns if we do not own all of them yet.
        // If these two goals are fulfilled, the AI tries to claim more capture points (lowest
        // priority of all objectives).
        const objectives = [
            { functionName: 'spreadToSpawns', score: unclaimedSpawnTileCount !== 0 ? 100 : 0 },
            { functionName: 'capture', score: unclaimedCapturePointCount > 2 ? 50 : 25 },
            { functionName: 'capture', score: capturePointsClaimedByEnemy >= 2 ? 150: 25 }
        ];

        // Walk through the different objectives and find the hightest priority value
        // by comparing the current objective with the currently most important objective.
        const prioritizedObjective = objectives.reduce((prioritized, current) => 
            current.score > prioritized.score ? current : prioritized);
        
        console.log(prioritizedObjective.functionName + ' ' + prioritizedObjective.score);

        return this[prioritizedObjective.functionName](board, tilesWithArmy);
    }

    // This is the part of the strategy where we try to claim major spawn points
    // as quickly as possible. The idea is that we rush to one spawn points and capture
    // the other one later on if we still have time.
    // If we're the second player to make a move, we also react to where our opponent
    // placed its units with the first move, so we can instantly take the major spawn
    // points away from them should they try to capture one.
    spreadToSpawns(board, tilesWithArmy) {
        let sourceTile = null;

        const majorSpawns = getTilesByType(board, tileTypes.MAJOR_SPAWN);
        // Major spawns that are not ours are targets for this strategy.
        const mainTargets = majorSpawns.filter(tile => tile.player !== this);
        let mainTarget = null;

        // We only need to do this bit if we're not in the upper left corner.
        // This basically allows the spread strategy to react to where the player
        // who makes the first move (the one in the upper left corner) moved their
        // first unit.
        // If we're in the upper left corner, we're the first to make a move anyway,
        // so we'll just leave this bit out.
        if (board.tiles[0][0].player !== this) { 
            // If we have not yet moved a unit so this only happens on the first move.
            if (tilesWithArmy.length === 1) {
                if (board.tiles[1][0].unitCount > 0) {
                    //mainTarget = board.tiles[0][4]; // We avoid the major spawn.
                    mainTarget = board.tiles[4][0]; // We attack the major spawn.
                } else if (board.tiles[0][1].unitCount > 0) {
                    //mainTarget = board.tiles[4][0]; // We avoid the major spawn.
                    mainTarget = board.tiles[0][4]; // We attack the major spawn.
                } else {
                    mainTarget = mainTargets[Math.round(Math.random())];
                }
            }
        }

        // If we have not picked a main target at this point (which happens if we're
        // the first player to make a move or if we're the second player and we've already
        // made our first move), we pick the first of the two major spawns.
        if (mainTarget === null) { mainTarget = mainTargets[0]; }

        // As our 'from' tile, we pick the one closest to our main target, that also has
        // an army. This allows us to move the same units until we reach the spawn point.
        sourceTile = getClosest(mainTarget, tilesWithArmy);
        
        return tilesWithArmy.map(source => {
            return move(this, sourceTile, moveTowards(sourceTile, mainTarget), sourceTile.unitCount);
        });
    }

    // This part of the strategy is responsible for taking capture points. It does so by finding
    // the capture points that have not yet been captured by us, and tries moving a certain amount
    // of units away from neutral tiles, major spawns and minor spawns towards the current target capture point.
    // Units from major spawns only move if there are more than 5 units there, to ensure that major spawns
    // cannot just be taken away from us behind our backs.
    capture(board, tilesWithArmy) {
        const notOurCapturePoints = getTilesByType(board, tileTypes.CAPTURE_POINT).filter(tile => tile.player !== this);

        const moving = tilesWithArmy.filter(tile => {
            if (tile.type === tileTypes.NEUTRAL) return true;
            if (tile.type === tileTypes.MAJOR_SPAWN) return tile.unitCount > 5;
            if (tile.type === tileTypes.MINOR_SPAWN) return true;
            return false;
        });

        return moving.map(source => {
            const target = getClosest(source, notOurCapturePoints);
            const movingUnitCount = {
                [tileTypes.NEUTRAL]: source.unitCount,
                [tileTypes.MAJOR_SPAWN]: source.unitCount - 5,
                [tileTypes.MINOR_SPAWN]: source.unitCount,
            }[source.type];
            return move(this, source, moveTowards(source, target), movingUnitCount);
        });
    }
}