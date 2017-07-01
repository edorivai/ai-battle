import startLoop from '../game/loop';

const initialState = {
	running: false,
	stopLoop: null,
	error: null,
};

export const actionTypes = {
	START_SESSION: 'session/START_SESSION',
	STOP_SESSION: 'session/STOP_SESSION',
	REPORT_ERROR: 'session/REPORT_ERROR',
};

export default function(state = initialState, action) {
	switch (action.type) {
		case actionTypes.START_SESSION:
			return { running: true, error: null, stopLoop: action.stopLoop };
		case actionTypes.STOP_SESSION:
			state.stopLoop(); // Side effect
			return { ...state, running: false };
		case actionTypes.REPORT_ERROR:
			state.stopLoop();
			return { running: false, error: { message: action.message, player: action.player, move: action.move } };
		default:
			return state;
	}
}

export function startSession(getState, players, dispatch) {
	const stopLoop = startLoop(getState, players, dispatch);
	return { type: actionTypes.START_SESSION, players, stopLoop };
}
export function stopSession() {
	return { type: actionTypes.STOP_SESSION };
}

export function reportError(errorMessage, player, move) {
	return { type: actionTypes.REPORT_ERROR, player, message: errorMessage, move };
}
