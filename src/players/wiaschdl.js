import { tileTypes } from '../constants';
import { getAllTilesWithArmyForPlayer, getTilesByType, moveTowards, getClosest } from '../game/boardUtilities';
import { move } from '../game/gameActions';


export default class WiaschdlPlayer {
	static getName() { return 'Wiaschdl' };
	
	constructor(color) {
		this.name = WiaschdlPlayer.getName();
		this.color = color;
	}
	
	play(board) {
		const allTiles = getAllTilesWithArmyForPlayer(board, this);
             
               var xy=Math.random(),Q;

		// Determine which armies we want to move
		const moving = allTiles.filter(tile => {
			if (tile.type === tileTypes.NEUTRAL) return true;
                        Q=xy*4+8;
                        Q=Math.abs(Q);
			if (tile.type === tileTypes.CAPTURE_POINT) return tile.unitCount > Q;
			if ([tileTypes.MINOR_SPAWN, tileTypes.MAJOR_SPAWN].includes(tile.type))
				return tile.unitCount >= Q;
			return false;
		});
		
		// Now move each army towards the closest capture point which is not occupied by us
		const targets = getTilesByType(board, tileTypes.CAPTURE_POINT).filter(target => target.player !== this);

		return moving.map(source => {
			const target = getClosest(source, targets);
			const movingUnitCount = {
				[tileTypes.CAPTURE_POINT]: source.unitCount - Q,
				[tileTypes.MINOR_SPAWN]: source.unitCount -1 , 
				[tileTypes.MAJOR_SPAWN]: source.unitCount - 1,
				[tileTypes.NEUTRAL]: source.unitCount,
			}[source.type];
			return move(this, source, moveTowards(source, target), movingUnitCount);
		});
	}
}
