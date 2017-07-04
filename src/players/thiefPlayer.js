import { tileTypes, unitTypes } from '../constants';
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

	play(board) {
		const allTiles = getAllTilesWithArmyForPlayer(board, this);

		// Determine which armies we want to move
		const moving = allTiles.filter(tile => {
			if (tile.type === tileTypes.NEUTRAL) return true;
			if (tile.type === tileTypes.CAPTURE_POINT) return tile.unitCount > 4;
			if ([tileTypes.MINOR_SPAWN, tileTypes.MAJOR_SPAWN].includes(tile.type))
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
