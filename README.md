# AI Battle

The purpose of this project is to practice coding, while having fun at the same time!

### Used technologies

...that you'll touch:
- javascript (this will be ~95% of what you'll touch)
- node
- npm

...that power the game
- redux
- react
- create-react-app
	- webpack
	- babel

## Setup

1. Fork repo
2. Make sure you've installed node 6+
3. Install dependencies: `npm install`
4. Run: `npm start`
5. Open browser at `http://localhost:3000` (should happen automatically at step 4)

Optional:

When you want to get your AI merged, just send out a [pull request](https://help.github.com/articles/about-pull-requests/) and I'll merge it. This way we'll be able to battle each other's AI's!

## Rules and objective

The game is a turn based game, a bit like the board game [Risk](https://en.wikipedia.org/wiki/Risk_(game)). You can spawn units, move them around, and fight your opponent's units. Your objective is to capture all of the strategic _capture points_, or to completely eliminate your opponent.

Or more formally. You win as soon as you fulfill one of these conditions:
- Capture all (4) capture points (the squares)
- Eliminate all enemy units

## Writing an AI

I'll walk you through the process of writing an AI for the game. The following section covers the following steps:

1. Setting up
2. The AI skeleton
3. Game's data structures

### Setting up

1. Create a javascript file in `/src/players`, this is where you name your AI. Let's say we name our AI the Vienna AI. In that case, create the file `/src/players/viennaPlayer.js`.
2. Shamelessly copy/paste the contents of the [Passive AI](/src/players/passivePlayer.js) into your newly created file. It should look like this:

```js
export default class PassivePlayer {
	static getName() { return 'Passive' };
	
	constructor(color) {
		this.name = PassivePlayer.getName();
		this.color = color;
	}
	
	play() {
		return [];
	}
}
```

Don't worry, we'll explain what all this does later.

3. Now rename the obvious references to the Passive AI;

```js
export default class ViennaPlayer {
	static getName() { return 'Vienna' };
	
	constructor(color) {
		this.name = ViennaPlayer.getName();
		this.color = color;
	}
	
	play() {
		return [];
	}
}
```

4. Add your player to the game. Open '/src/palyers/players.js', and... well, I'll let you figure this step out by yourself.
5. If you've managed to properly add your AI to the game, it should now show up in the dropdowns in the game. Check it out by running `npm start`.

## The AI skeleton

Those know a bit of modern javascript might already have recognized that a player is defined as a class.