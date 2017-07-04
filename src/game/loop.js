import { spawn } from '../modules/board';
import { stopSession, reportError } from '../modules/session';
import validate from './validator';

export default function startLoop(getState, players, dispatch) {
	let stopped = false;
	let currentPlayerIndex = 0;
	async function run() {
		if (stopped) return;
		const fps = 1 + getState().speed / 3;
		
		const player = players[currentPlayerIndex];
		// const productionAdjustments = player.adjustProduction(getState().board); 
		const productionAdjustments = [];
		
		// Spawn units
		dispatch(spawn(player, productionAdjustments));
		
		// await new Promise(res => setTimeout(res, 1000 / fps));

		const board = getState().board;
		const moves = await player.play(board);
		
		const validations = moves.map(move => validate(board, player, move));
		if (validations.some(validation => !validation.valid)) {
			validations
				.filter(validation => !validation.valid)
				.forEach(validation => dispatch(reportError(validation.message, player, validation.move)));
			return;
		}

		moves.forEach(move =>	dispatch(move));
		
		const winner = getState().board.winner;
		if (winner) {
			// Exit the loop if there is a winner, and dispatch STOP SESSION
			dispatch(stopSession());
			return;
		}
		
		currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
		
		setTimeout(run, 1000 / fps);
	}
	setTimeout(run, 0);
	
	return function stop() {
		stopped = true;
	}
}