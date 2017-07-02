import { sample } from 'lodash';

import { unitTypes } from '../modules/board';
import { getAllTilesWithArmyForPlayer, getAdjacentTiles, getSpawnsForPlayer } from '../game/boardUtilities';
import { move } from '../game/gameActions';

export default class RandomPlayer {
	static getName() { return 'Random' };
	
	constructor(color) {
		this.name = RandomPlayer.getName();
		this.color = color;
	}

	adjustProduction(board) {
		return [];
		// return getSpawnsForPlayer(board, this)
		// 	.filter(tile => tile.unitCount === 0) // We're only allowed to switch unit type if the tile is empty
		// 	.map(tile => ({ ...tile, unitProductionType: sample(Object.values(unitTypes)) }));
	}
	
	play(board) {
		const source = sample(getAllTilesWithArmyForPlayer(board, this));
		const target = sample(getAdjacentTiles(board, source));
		return [move(this, source, target, Math.ceil(source.unitCount * Math.random()))];
	}
}
