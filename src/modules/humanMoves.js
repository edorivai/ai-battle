import { move } from '../game/gameActions';

const actionTypes = {
	ADD_MOVE: 'humanMoves/ADD_MOVE',
	REMOVE_MOVE: 'humanMoves/REMOVE_MOVE',
	CLEAR_MOVES: 'humanMoves/CLEAR_MOVES',
	CONFIRM: 'humanMoves/CONFIRM',
	START_PLAYER_MOVE: 'humanMoves/START_PLAYER_MOVE',
};

const initialState = {
	confirmed: false,
	moves: [],
	player: null,
};

export default function(state = initialState, action) {
	switch (action.type) {
		case actionTypes.CLEAR_MOVES:
			return { moves: [], confirmed: false, player: null };
		case actionTypes.ADD_MOVE:
			return { ...state, moves: [...state.moves, move(state.player, action.from, action.to, action.unitCount)] };
		case actionTypes.REMOVE_MOVE:
			return { ...state, moves: state.moves.filter(move => move !== action.move) };
		case actionTypes.CONFIRM:
			return { ...state, confirmed: true };
		case actionTypes.START_PLAYER_MOVE:
			return { ...state, player: action.player };
	}
	return state;
}

export function addMove(from, to, unitCount) {
	return {
		type: actionTypes.ADD_MOVE,
		from,
		to,
		unitCount,
	}
}

export function removeMove(move) {
	return {
		type: actionTypes.REMOVE_MOVE,
		move,
	}
}

export function confirm() {
	return {
		type: actionTypes.CONFIRM
	}
}

export function startPlayerMove(player) {
	return {
		type: actionTypes.START_PLAYER_MOVE,
		player
	}
}

export function clearMoves() {
	return { type: actionTypes.CLEAR_MOVES };
}