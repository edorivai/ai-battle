import { sample } from 'lodash';

import { unitTypes } from '../constants';
import { getAllTilesWithArmyForPlayer, getAdjacentTiles, getSpawnsForPlayer } from '../game/boardUtilities';
import { move } from '../game/gameActions';

export default class RandomPlayer {
	static getName() { return 'Random' };
	
	constructor(color) {
		this.name = RandomPlayer.getName();
		this.color = color;
	}
	
	play(board) {
		const source = sample(getAllTilesWithArmyForPlayer(board, this));
		const target = sample(getAdjacentTiles(board, source));
		return [move(this, source, target, Math.ceil(source.unitCount * Math.random()))];
	}
}
