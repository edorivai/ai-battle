export default function determineValidMove(board, player, move) {
	const fromTile = board.tiles[move.from.x][move.from.y];
	
	const fromCoords = `(${move.from.x},${move.from.y})`;
	// Check if tile is owned by the player that is moving
	if (fromTile.player !== player) {
		return {
			valid: false,
			message: `It seems that player "${player.name}" doesn\'t occupy tile ${fromCoords}`,
			move,
		}
	}
	
	// Check for unitCount > 0
	if (move.unitCount <= 0) {
		return {
			valid: false,
			message: 'You should move at least 1 unit',
			move,
		}
	}
	
	// Check if the tiles are adjacent
	if (Math.abs(move.from.x - move.to.x) > 1 || Math.abs(move.from.y - move.to.y) > 1) {
		return {
			valid: false,
			message: `You can only move to adjacent tiles`,
			move,
		};
	}
	
	// Check if the from tile has enough units
	if (fromTile.unitCount < move.unitCount) {
		return {
			valid: false,
			message: `Cannot move ${move.unitCount} units from ${fromCoords}, since you only have ${fromTile.unitCount} units available there`,
			move,
		}
	}
	
	return { valid: true };
}