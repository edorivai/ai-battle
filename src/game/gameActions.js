export const actionTypes = {
	MOVE: 'actionTypes/MOVE',
	PASS: 'actionTypes/PASS'
};

export function move(player, from, to, unitCount) {
	return {
		type: actionTypes.MOVE,
		player,
		from,
		to,
		unitCount,
	}
}