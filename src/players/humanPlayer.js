import { startPlayerMove, clearMoves } from '../modules/humanMoves';

let store;
export function setStore(_store) {
	store = _store;
}

export default class HumanPlayer {
	static getName() {
		return 'Human';
	}
	
	constructor(color) {
		this.name = HumanPlayer.getName();
		this.color = color;
	}
	
	play() {
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
	}
};
