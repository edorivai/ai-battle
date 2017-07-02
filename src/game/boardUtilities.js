import { flatten } from 'lodash';

import { spawnTileTypes } from '../constants';

/**
 * Fetches all tiles that are occupied by an army of the specified player
 */
export function getAllTilesWithArmyForPlayer(board, player) {
	return flatten(board.tiles).filter(tile => tile.player === player && tile.unitCount > 0);
}

/**
 * Fetches all tiles that are adjacent to the reference tile
 */
export function getAdjacentTiles(board, tile) {
	return flatten(board.tiles).filter(candidate => {
		const dx = Math.abs(tile.x - candidate.x);
		const dy = Math.abs(tile.y - candidate.y);
		return dx + dy === 1;
	});
}

/**
 * Fetches all tiles of the specified type
 */
export function getTilesByType(board, type) {
	return flatten(board.tiles).filter(tile => tile.type === type);
}

/**
 * Fetches all spawn tiles currently occupied by the specified player
 */
export function getSpawnsForPlayer(board, player) {
	return flatten(board.tiles)
		.filter(tile => tile.player === player)
		.filter(tile => spawnTileTypes.includes(tile.type));
}

/**
 * Fetches the x and y distance between the source and target tile
 */
export function getDeltas(source, target) {
	return {
		dx: target.x - source.x,
		dy: target.y - source.y,
	};
}

/**
 * Picks an intermediate tile to move towards, given that you want to move towards the specified target tile. 
 */
export function moveTowards(source, target) {
	const { dx, dy } = getDeltas(source, target);
	
	const move = Math.abs(dx) > Math.abs(dy)
		? { x: Math.sign(dx), y: 0 }
		: { x: 0, y: Math.sign(dy) };
	
	return { x: source.x + move.x, y: source.y + move.y };
}

/**
 * Gets the distance between two tiles
 */
export function getDistance(source, target) {
	const { dx, dy } = getDeltas(source, target);
	return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

/**
 * Gets the tile that is closest to source from a list of targets.
 */
export function getClosest(source, targets) {
	if (targets.length === 0) return null;
	
	const withDistances = targets.map(target => ({
		target,
		distance: getDistance(source, target)
	}));
	
	return withDistances.sort((a, b) => a.distance - b.distance)[0].target;
}
