import { startGame, spawn } from '../modules/board';
import validate from './validator';

export default function startLoop(store, players) {
	store.dispatch(startGame(players));
	
	
	let currentPlayerIndex = 0;
	const intervalId = setInterval(() => {
		const board = store.getState().board;
		
		// Spawn units
		store.dispatch(spawn());
		
		const player = players[currentPlayerIndex];
		const move = player.play(board);
		
		try {
			validate(board, player, move);
			store.dispatch(move);
			currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
		} catch (error) {
			console.error(error);
			clearInterval(intervalId);
		}
		
	}, 300);
}