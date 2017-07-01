import { sample } from 'lodash';

import { getAllTilesForPlayer, getAdjacentTiles } from '../game/boardUtilities';
import { move } from '../game/gameActions';

export default function RandomPlayer(color) {
	this.name = 'Random';
	this.icon = '⁉️';
	this.color = color;
};

RandomPlayer.prototype.play = function play(board) {
	const source = sample(getAllTilesForPlayer(board, this));
	const target = sample(getAdjacentTiles(board, source));
	return [move(this, source, target, Math.ceil(source.unitCount * Math.random()))];
};
