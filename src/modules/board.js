import { times, flatten } from 'lodash/fp';
import { actionTypes as gameActions } from '../game/gameActions';
import { actionTypes as sessionActions } from './session';

export const actionTypes = {
	CLEAR_BOARD: 'board/CLEAR_BOARD',
	SPAWN: 'board/SPAWN',
};

export const tileTypes = {
	NEUTRAL: 'NEUTRAL',
	MINOR_SPAWN: 'MINOR_SPAWN',
	MAJOR_SPAWN: 'MAJOR_SPAWN',
	CAPTURE_POINT: 'CAPTURE_POINT',
};

export const spawnTileTypes = [tileTypes.MINOR_SPAWN, tileTypes.MAJOR_SPAWN];

export const unitTypes = {
	TANK: 'TANK',
	RIFLE: 'RIFLE',
	ROCKET: 'ROCKET',
};

const width = 5;
const height = 5;

// const map = {
// 	'0,0': tileTypes.MINOR_SPAWN,
// 	'0,4': tileTypes.MINOR_SPAWN,
// 	'4,0': tileTypes.MINOR_SPAWN,
// 	'4,4': tileTypes.MINOR_SPAWN,
// 	// '2,2': tileTypes.MAJOR_SPAWN,
// 	'2,1': tileTypes.CAPTURE_POINT,
// 	'3,2': tileTypes.CAPTURE_POINT,
// 	'1,2': tileTypes.CAPTURE_POINT,
// 	'2,3': tileTypes.CAPTURE_POINT,
// };

const map = {
	'0,0': tileTypes.MINOR_SPAWN,
	'3,1': tileTypes.MINOR_SPAWN,
	'1,3': tileTypes.MINOR_SPAWN,
	'0,4': tileTypes.MAJOR_SPAWN,
	'4,0': tileTypes.MAJOR_SPAWN,
	'4,4': tileTypes.MINOR_SPAWN,
	// '2,2': tileTypes.MAJOR_SPAWN,
	'2,1': tileTypes.CAPTURE_POINT,
	'3,2': tileTypes.CAPTURE_POINT,
	'1,2': tileTypes.CAPTURE_POINT,
	'2,3': tileTypes.CAPTURE_POINT,
};

const spawnSpeeds = {
	[tileTypes.NEUTRAL]: 0,
	[tileTypes.CAPTURE_POINT]: 0,
	[tileTypes.MINOR_SPAWN]: 1,
	[tileTypes.MAJOR_SPAWN]: 2,
};

const playerSpawns = {
	'0,0': 0,
	'4,4': 1,
};

function generateCleanBoard(players) {
	return times(
		x =>
			times(y => {
				const coords = `${x},${y}`;
				const player = players && players[playerSpawns[coords]] || null;
				const type = map[coords] || tileTypes.NEUTRAL;
				const unitType = unitTypes.RIFLE;
				// const unitType = playerSpawns[coords] === 0 ? unitTypes.RIFLE : unitTypes.TANK;
				return {
					x,
					y,
					type,
					unitProductionType: [tileTypes.MINOR_SPAWN, tileTypes.MAJOR_SPAWN].includes(type)
						? unitType
						// ? unitTypes.RIFLE
						: undefined,
					player,
					unitCount: player ? 1 : 0,
					unitType: player ? unitType : undefined,
					// unitType: player ? unitTypes.RIFLE : undefined,
				};
			}, height),
		width
	);
}

const initialState = {
	tiles: generateCleanBoard(),
	players: [],
	winner: null,
};

export default function(state = initialState, action) {
	switch (action.type) {
		case sessionActions.START_SESSION:
			return {
				tiles: generateCleanBoard(action.players),
				players: action.players,
				winner: null,
			};
		case sessionActions.REPORT_ERROR:
			return {
				...state,
				winner: state.players.filter(p => p !== action.player)[0],
			};
		case actionTypes.SPAWN:
			return {
				...state,
				tiles: state.tiles.map(row =>
					row.map(tile => {
						// Check to see if the unit production has been adjusted
						const adjustment = action.productionAdjustments.find(adjustment =>
							adjustment.x === tile.x && adjustment.y === tile.y);
						if (adjustment && adjustment.unitProductionType !== tile.unitProductionType && tile.unitCount > 0) {
							throw new Error('You cannot change the production type of a tile that is occupied by a different unit type');
						}
						
						return {
							...tile,
							unitProductionType: adjustment ? adjustment.unitProductionType : tile.unitProductionType,
							unitType: adjustment ? adjustment.unitProductionType : tile.unitType,
							unitCount: tile.player !== action.player
								? tile.unitCount
								: tile.unitCount + spawnSpeeds[tile.type],
						};
					})
				),
			};
		case gameActions.MOVE:
			const fromTile = state.tiles[action.from.x][action.from.y];
			const toTile = state.tiles[action.to.x][action.to.y];

			// Execute the move
			const newTiles = state.tiles.map((row, x) =>
				row.map(
					(tile, y) =>
						(determineTilesMatch(tile, fromTile) && {
							// Update the from tile
							...fromTile,
							unitCount: fromTile.unitCount - action.unitCount,
						}) ||
						(determineTilesMatch(tile, toTile) &&
							(toTile.player === action.player || !toTile.player
								? // Normal move
									{
										...toTile,
										unitCount: (toTile.unitCount || 0) + action.unitCount,
										unitType: fromTile.unitType,
										player: action.player,
									}
								: // Fight
									{
										...toTile,
										...resolveFightForTile(action, fromTile, toTile),
									})) ||
						tile
				)
			);

			// Determine if somebody has won...
			let winner = null;

			// ...by elimination
			const livePlayers = state.players.filter(player => flatten(newTiles).some(
				tile => tile.player === player && tile.unitCount > 0));
			if (livePlayers.length === 1) {
				winner = livePlayers[0];
			}

			// ...by occupying three capture points
			const capturePointCounts = state.players.map(
				player =>
					flatten(newTiles)
						.filter(tile => tile.type === tileTypes.CAPTURE_POINT)
						.filter(capturePoint => capturePoint.player === player).length
			);
			const winnerByCapturePoints = capturePointCounts.reduce((winningPlayer, count, index) =>
				count >= 4 ? state.players[index] : winningPlayer, null);
			if (winnerByCapturePoints) winner = winnerByCapturePoints;

			// Basic move (to empty, or tile that is already occupied by action.player)
			return {
				...state,
				tiles: newTiles,
				winner,
			};
	}
	return state;
}

/**
 * 
 * @param action
 * @param fromTile
 * @param toTile
 * @returns {Tile} the state of the defending tile after the fight
 */
function resolveFightForTile(action, fromTile, toTile) {
	// Unit counts after the fight
	const { attacker, defender } = resolveFight(
		{ unitCount: action.unitCount, unitType: fromTile.unitType },
		{ unitCount: toTile.unitCount, unitType: toTile.unitType },
	);
	
	return attacker === 0
		// Defender won
		? {
			unitCount: defender,
		}
		// Attacker won
		: {
			player: action.player,
			unitCount: attacker,
			unitType: fromTile.unitType,
		};
}

const counterCoefficient = 1.25;
/**
 * This map shows the battle coefficients between unit types.
 * - Rifle beats Rocket
 * - Rocket beats Tank
 * - Tank beats Rifle
 */
const coefficientMap = {
	[unitTypes.RIFLE]: {
		[unitTypes.RIFLE]: 1,
		[unitTypes.ROCKET]: 1 / counterCoefficient,
		[unitTypes.TANK]: counterCoefficient,
	},
	[unitTypes.ROCKET]: {
		[unitTypes.RIFLE]: counterCoefficient,
		[unitTypes.ROCKET]: 1,
		[unitTypes.TANK]: 1 / counterCoefficient,
	},
	[unitTypes.TANK]: {
		[unitTypes.RIFLE]: 1 / counterCoefficient,
		[unitTypes.ROCKET]: counterCoefficient,
		[unitTypes.TANK]: 1,
	},
};
function resolveFight(attacker, defender) {
	const attackerCoefficient = coefficientMap[attacker.unitType][defender.unitType];
	const defenderCoefficient = coefficientMap[defender.unitType][attacker.unitType];
	
	const attackerIntercept = attacker.unitCount / attackerCoefficient;
	const defenderIntercept = defender.unitCount / defenderCoefficient;
	const intercept = Math.min(attackerIntercept, defenderIntercept);
	
	// Respond with remaining units for either side of the battle
	// One of the two should be 0
	return {
		attacker: Math.ceil(attacker.unitCount - intercept * attackerCoefficient),
		defender: Math.ceil(defender.unitCount - intercept * defenderCoefficient),
	}
}

function determineTilesMatch(a, b) {
	return a.x === b.x && a.y === b.y;
}

export function spawn(player, productionAdjustments) {
	return { type: actionTypes.SPAWN, player, productionAdjustments };
}
