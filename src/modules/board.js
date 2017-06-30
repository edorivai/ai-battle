import { times, flatten } from 'lodash/fp';
import { actionTypes as gameActions } from '../game/gameActions';

export const actionTypes = {
	CLEAR_BOARD: 'board/CLEAR_BOARD',
	SPAWN: 'board/SPAWN',
};

export const tileTypes = {
	NEUTRAL: 'NEUTRAL',
	MINOR_SPAWN: 'MINOR_SPAWN',
	MAJOR_SPAWN: 'MAJOR_SPAWN',
};

const initialState = {
	tiles: [],
	players: [],
	winner: null
};

const width = 5;
const height = 5;

const spawns = {
	'0,0': tileTypes.MINOR_SPAWN,
	'0,4': tileTypes.MINOR_SPAWN,
	'4,0': tileTypes.MINOR_SPAWN,
	'4,4': tileTypes.MINOR_SPAWN,
	'2,2': tileTypes.MAJOR_SPAWN,
};

const spawnSpeeds = {
	[tileTypes.NEUTRAL]: 0,
	[tileTypes.MINOR_SPAWN]: 1,
	[tileTypes.MAJOR_SPAWN]: 3,
};

const playerSpawns = {
	'0,0': 0,
	'4,4': 1,
};

function generateCleanBoard(players) {
	return times(x => times(y => {
		const coords = `${x},${y}`;
		const player = players[playerSpawns[coords]] || null;
		return {
			x,
			y,
			type  : spawns[coords] || tileTypes.NEUTRAL,
			player,
			unitCount: player ? 5 : 0
		};
	}, height), width);
}

export default function(state = initialState, action) {
	switch(action.type) {
		case actionTypes.CLEAR_BOARD:
			return {
				tiles: generateCleanBoard(action.players),
				players: action.players,
				winner: null,
			};
		case actionTypes.SPAWN:
			return {
				...state,
				tiles: state.tiles.map(row => row.map(tile => ({
					...tile,
					unitCount: tile.unitCount && tile.unitCount + spawnSpeeds[tile.type]
				})))
			};
		case gameActions.MOVE:
			const fromTile = state.tiles[action.from.x][action.from.y];
			const toTile = state.tiles[action.to.x][action.to.y];
			
			// Execute the move
			const newTiles = state.tiles.map((row, x) => row.map((tile, y) =>
				(determineTilesMatch(tile, fromTile) && {
					// Update the from tile
					...fromTile,
					unitCount: fromTile.unitCount - action.unitCount,
					player: fromTile.unitCount === action.unitCount ? null : action.player
				}) ||
				(determineTilesMatch(tile, toTile) && (
						(toTile.player === action.player || !toTile.player)
							// Normal move
							? {
							// Update the to tile
							...toTile,
							unitCount: (toTile.unitCount || 0) + action.unitCount,
							player: action.player
						}
							// Fight
							: {
							...toTile,
							unitCount: Math.max(Math.abs(action.unitCount - toTile.unitCount), 1),
							player: action.unitCount > toTile.unitCount ? action.player : toTile.player
						})
				) ||
				tile
			));
			
			// Determine if somebody has won
			const livePlayers = state.players.filter(player =>
				flatten(newTiles).some(tile => tile.player === player)
			);
			
			const winner = livePlayers.length === 1 ? livePlayers[0] : null;
			
			// Basic move (to empty, or tile that is already occupied by action.player)
			return {
				...state,
				tiles: newTiles,
				winner
			}
	}
	return state;
}

function determineTilesMatch(a, b) {
	return a.x === b.x && a.y === b.y;
}

export function spawn() {
	return { type: actionTypes.SPAWN };
}

export function startGame(players) {
	return {
		type: actionTypes.CLEAR_BOARD,
		players
	};
}
