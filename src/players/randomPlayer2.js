import { sample } from 'lodash';

import { getAllTilesForPlayer, getAdjacentTiles } from '../game/boardUtilities';
import { move } from '../game/gameActions';

export default class RandomPlayer2 {
	static getName() { return 'Random2' };
	
	constructor(color) {
		this.name = RandomPlayer2.getName();
		this.color = color;
	}
	
	play(board) {
		const source = sample(getAllTilesForPlayer(board, this));
		const target = sample(getAdjacentTiles(board, source));
		return [move(this, source, target, Math.ceil(source.unitCount * Math.random()))];
	}
}
