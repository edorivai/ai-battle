import { tileTypes } from '../modules/board';
import { getAllTilesForPlayer, getTilesByType, moveTowards, getClosest } from '../game/boardUtilities';
import { move } from '../game/gameActions';

export default class TurtlePlayer {
	static getName() {
		return 'Turtle';
	}

	constructor(color) {
		this.name = TurtlePlayer.getName();
		this.color = color;
	}

	play(board) {
		const allTiles = getAllTilesForPlayer(board, this);

		// Determine which armies we want to move
		const moving = allTiles.filter(tile => {
			if (tile.type === tileTypes.NEUTRAL) return true;
			if (tile.type === tileTypes.CAPTURE_POINT) return tile.unitCount > 20;
			if ([tileTypes.MINOR_SPAWN, tileTypes.MAJOR_SPAWN].includes(tile.type))
				return tile.unitCount >= 20;
			return false;
		});
		
		// Now move each army towards the closest capture point which is not occupied by us
		const targets = getTilesByType(board, tileTypes.CAPTURE_POINT).filter(target => target.player !== this);

		return moving.map(source => {
			const target = getClosest(source, targets);
			const movingUnitCount = {
				[tileTypes.CAPTURE_POINT]: source.unitCount - 20, // Ensure a minimum of 20 units are holding a capture point
				[tileTypes.MINOR_SPAWN]: source.unitCount - 1, // Ensure at least one unit stays behind at
				[tileTypes.MAJOR_SPAWN]: source.unitCount - 1,
				[tileTypes.NEUTRAL]: source.unitCount,
			}[source.type];
			return move(this, source, moveTowards(source, target), movingUnitCount);
		});
	}
}
