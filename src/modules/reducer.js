import { combineReducers } from 'redux';

import board from './board';
import humanMoves from './humanMoves';
import session from './session';

export default combineReducers({
	board,
	humanMoves,
	session,
});