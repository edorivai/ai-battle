import { flatten } from 'lodash';

export function getAllTilesForPlayer(board, player) {
	return flatten(board.tiles).filter(tile => tile.player === player);
}

export function getAdjacentTiles(board, tile) {
	return flatten(board.tiles).filter(candidate => {
		const dx = Math.abs(tile.x - candidate.x);
		const dy = Math.abs(tile.y - candidate.y);
		return dx + dy === 1;
	});
}