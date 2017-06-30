import { startGame, spawn } from '../modules/board';
import validate from './validator';

export default function startLoop(store, players) {
	store.dispatch(startGame(players));
	
	
	let currentPlayerIndex = 0;
	let timerId;
	function run() {
		const board = store.getState().board;

		// Spawn units
		store.dispatch(spawn());

		const player = players[currentPlayerIndex];
		const move = player.play(board);

		const validation = validate(board, player, move);
		if (!validation.valid) {
			console.error(validation.message);
			clearTimeout(timerId);
			return;
		}

		store.dispatch(move);
		
		const winner = store.getState().board.winner;
		if (winner) {
			// Exit the loop if there is a winner
			return;
		}
		
		currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
		
		timerId = setTimeout(run, 30);
	}
	run();
}