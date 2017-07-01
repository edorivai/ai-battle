import startLoop from '../game/loop';

const initialState = {
	running: false,
	stopLoop: null,
};

export const actionTypes = {
	START_SESSION: 'session/START_SESSION',
	STOP_SESSION: 'session/STOP_SESSION',
};

export default function(state = initialState, action) {
	switch (action.type) {
		case actionTypes.START_SESSION:
			return { running: true, stopLoop: action.stopLoop };
		case actionTypes.STOP_SESSION:
			state.stopLoop(); // Side effect
			return { running: false };
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
