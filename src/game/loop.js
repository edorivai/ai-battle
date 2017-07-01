import { startGame, spawn } from '../modules/board';
import validate from './validator';

export default function startLoop(store, players) {
	store.dispatch(startGame(players));
	
	let currentPlayerIndex = 0;
	async function run() {
		const board = store.getState().board;

		// Spawn units
		store.dispatch(spawn());

		const player = players[currentPlayerIndex];
		const moves = await player.play(board);
		
		const validations = moves.map(move => validate(board, player, move));
		if (validations.some(validation => !validation.valid)) {
			validations
				.filter(validation => !validation.valid)
				.forEach(validation => console.error(validation.message));
			return;
		}

		moves.forEach(move =>	store.dispatch(move));
		
		const winner = store.getState().board.winner;
		if (winner) {
			// Exit the loop if there is a winner
			return;
		}
		
		currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
		
		setTimeout(run, 30);
	}
	run();
}