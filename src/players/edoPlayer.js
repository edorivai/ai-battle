import { flatten } from 'lodash/fp';

import { tileTypes, spawnTileTypes } from '../constants';
import { getTilesByType, getAllTilesWithArmyForPlayer, getClosest, moveTowards } from '../game/boardUtilities';
import { move } from '../game/gameActions';

export default class EdoPlayer {
	static getName() { return 'Edo' };
	
	constructor(color) {
		this.name = EdoPlayer.getName();
		this.color = color;
	}
	
	getObjectives(board) {
		const enemyCapturePointCount = getTilesByType(tileTypes.CAPTURE_POINT)
			.filter(tile => tile.player && tile.player !== this);
		
		const unownedSpawnTiles = flatten(board.tiles)
			.filter(tile => spawnTileTypes.includes(tile.type))
			.filter(tile => tile.player !== this);
		
		return [
			{ type: 'grow', score: unownedSpawnTiles.length === 0 ? 0 : 100	},
			{	type: 'defend', score: enemyCapturePointCount > 2 ? 1000 : 10	},
		];
	};
	
	// Grow strategy
	grow(board) {
		// Select all spawn tiles that we don't own yet as possible targets
		const targets = flatten(board.tiles)
			.filter(tile => spawnTileTypes.includes(tile.type))
			.filter(tile => tile.player !== this);
		
		const tilesWithArmy = getAllTilesWithArmyForPlayer(board, this);
		
		return tilesWithArmy.map(source => {
			const target = getClosest(source, targets);
			return move(this, source, moveTowards(source, target), source.unitCount);
		});
	}
	
	// Defend strategy
	defend(board) {
		// Now move each army towards the closest capture point which is not occupied by us
		const targets = getTilesByType(board, tileTypes.CAPTURE_POINT).filter(target => target.player !== this);

		const tilesWithArmy = getAllTilesWithArmyForPlayer(board, this);

		return tilesWithArmy.map(source => {
			const target = getClosest(source, targets);
			return move(this, source, moveTowards(source, target), source.unitCount);
		});
	}
	
	play(board) {
		const objectives = this.getObjectives(board);
		const prioritizedObjective = objectives.reduce((prioritized, candidate) =>
			prioritized.score < candidate.score ? candidate : prioritized);
		
		return this[prioritizedObjective.type](board);
	}
}
