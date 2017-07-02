export default class PassivePlayer {
	static getName() { return 'Passive' };
	
	constructor(color) {
		this.name = PassivePlayer.getName();
		this.color = color;
	}

	adjustProduction(board) {
		return [];
	}
	
	play() {
		return [];
	}
}
