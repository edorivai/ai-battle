import { combineReducers } from 'redux';

import board from './board';
import humanMoves from './humanMoves';

export default combineReducers({
	board,
	humanMoves,
});