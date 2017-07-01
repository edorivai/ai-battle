import { spawn } from '../modules/board';
import { stopSession } from '../modules/session';
import validate from './validator';

export default function startLoop(getBoard, players, dispatch) {
	let stopped = false;
	let currentPlayerIndex = 0;
	async function run() {
		if (stopped) return;
		
		const board = getBoard();

		// Spawn units
		dispatch(spawn());

		const player = players[currentPlayerIndex];
		const moves = await player.play(board);
		
		const validations = moves.map(move => validate(board, player, move));
		if (validations.some(validation => !validation.valid)) {
			validations
				.filter(validation => !validation.valid)
				.forEach(validation => console.error(validation.message));
			return;
		}

		moves.forEach(move =>	dispatch(move));
		
		const winner = getBoard().winner;
		if (winner) {
			// Exit the loop if there is a winner, and dispatch STOP SESSION
			dispatch(stopSession());
			return;
		}
		
		currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
		
		setTimeout(run, 30);
	}
	setTimeout(run, 0);
	
	return function stop() {
		stopped = true;
	}
}