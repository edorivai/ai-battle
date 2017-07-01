import { tileTypes, unitTypes } from '../modules/board';
import { getAllTilesWithArmyForPlayer, getTilesByType, moveTowards, getClosest, getSpawnsForPlayer } from '../game/boardUtilities';
import { move } from '../game/gameActions';

export default class ThiefPlayer {
	static getName() {
		return 'Thief';
	}

	constructor(color) {
		this.name = ThiefPlayer.getName();
		this.color = color;
	}

	adjustProduction(board) {
		return [];
		// Count our own units
		const unitCounts = getAllTilesWithArmyForPlayer(board, this).reduce(
			(counts, tile) => {
				counts[tile.unitType] += tile.unitCount;
				return counts;
			},
			{
				[unitTypes.TANK]: 0,
				[unitTypes.ROCKET]: 0,
				[unitTypes.RIFLE]: 0,
			}
		);
		
		const lowestUnitCountType = Object.entries(unitCounts).reduce((lowest, candidate) =>
			lowest[1] <= candidate[1] ? lowest : candidate
		)[0];

		return getSpawnsForPlayer(board, this)
			.filter(tile => console.log('filtering', Math.random(), tile) || tile.unitCount === 0) // We're only allowed to switch unit type if the tile is empty
			.map(tile => ({ ...tile, unitProductionType: lowestUnitCountType }));
	}

	play(board) {
		const allTiles = getAllTilesWithArmyForPlayer(board, this);

		// Determine which armies we want to move
		const moving = allTiles.filter(tile => {
			if (tile.type === tileTypes.NEUTRAL) return true;
			if (tile.type === tileTypes.CAPTURE_POINT) return tile.unitCount > 4;
			if ([tileTypes.MINOR_SPAWN, tileTypes.MAJOR_SPAWN, tileTypes.CAPTURE_POINT].includes(tile.type))
				return tile.unitCount > 0;
			return false;
		});

		// Now move each army towards the closest capture point which is not occupied by us
		const targets = getTilesByType(board, tileTypes.CAPTURE_POINT).filter(target => target.player !== this);

		return moving.map(source => {
			const target = getClosest(source, targets);
			const movingUnitCount = {
				[tileTypes.CAPTURE_POINT]: source.unitCount - 4,
				[tileTypes.MINOR_SPAWN]: source.unitCount,
				[tileTypes.MAJOR_SPAWN]: source.unitCount,
				[tileTypes.NEUTRAL]: source.unitCount,
			}[source.type];
			return move(this, source, moveTowards(source, target), movingUnitCount);
		});
	}
}
