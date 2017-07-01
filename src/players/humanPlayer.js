import { startPlayerMove, clearMoves } from '../modules/humanMoves';

export default function HumanPlayer(color, store) {
	this.name = 'Human';
	this.icon = '👩';
	this.color = color;
	this.store = store;
};

HumanPlayer.prototype.play = function play() {
	const store = this.store;
	store.dispatch(startPlayerMove(this));
	
	return new Promise(res => {
		const unsubscribe = store.subscribe(() => {
			const state = store.getState();
			if (state.humanMoves.confirmed) {
				res(state.humanMoves.moves);
				unsubscribe();
				store.dispatch(clearMoves())
			}
		});
	});
};
