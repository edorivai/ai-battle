import React, { Component } from 'react';
import { connect } from 'react-redux';
import { flatten, times } from 'lodash/fp';

import { tileTypes } from '../modules/board';
import { addMove, removeMove } from '../modules/humanMoves';

import './Board.css';

function Board({ board: { tiles }, humanMoves, addMove, removeMove }) {
	const addMoveCreator = tile => (from, to) =>
		addMove(from, to, tile.type === tileTypes.NEUTRAL ? tile.unitCount : tile.unitCount - 1);

	return (
		<div className="board">
			{flatten(
				tiles.map((row, x) =>
					row.map((tile, y) =>
						<Tile
							key={`${x},${y}`}
							{...tile}
							humanPlayer={humanMoves.player}
							addMove={addMoveCreator(tile)}
							removeMove={removeMove}
							moves={humanMoves.moves}
						/>
					)
				)
			)}
		</div>
	);
}

class Tile extends Component {
	render() {
		const { x, y, type, player, unitCount, humanPlayer, addMove, removeMove, moves } = this.props;
		return (
			<div
				className="boardTile"
				style={{
					background: player ? player.color : 'white',
				}}
			>
				{tileTypeIcons[type]}
				{unitCount > 0 &&
					<div className="unitCount">
						{unitCount}
					</div>}
				{player &&
					humanPlayer === player &&
					// Move buttons
					<div>
						{times(
							i => {
								const move = getMove(x, y, i, moves);
								return shouldDrawArrow(x, y, i, moves)
									? <div
									className={`moveButton${move ? ' chosen' : ''}`}
									style={{
										top      : '50%',
										left     : '50%',
										transform: `translate(${Math.cos(Math.PI * 2 * (i / 4)) * 60}px, ${Math.sin(Math.PI * 2 * (i / 4)) *
										60}px) rotate(${360 * (i + 1) / 4}deg)`,
									}}
									onClick={() => move
										? removeMove(move)
										: addMove({ x, y }, getTargetTile(x, y, i))
									}
								/>
									: null
							},
							4
						)}
					</div>}
			</div>
		);
	}
}

function shouldDrawArrow(x, y, i, moves) {
	return getMatchingMove(x, y, moves)
		? getMove(x, y, i, moves)
		: (x > 0 && x < 4 && y > 0 && y < 4) ||
				(i === 0 && x < 4) ||
				(i === 1 && y < 4) ||
				(i === 2 && x > 0) ||
				(i === 3 && y > 0);
}

function getMove(x, y, i, moves) {
	const matchingMove = getMatchingMove(x, y, moves);

	if (!matchingMove) return false;

	const targetTile = getTargetTile(x, y, i);

	return targetTile.x === matchingMove.to.x && targetTile.y === matchingMove.to.y && matchingMove;
}

function getMatchingMove(x, y, moves) {
	return moves.find(({ from }) => from.x === x && from.y === y);
}

function getTargetTile(x, y, i) {
	const targetX = x + { 0: 1, 1: 0, 2: -1, 3: 0 }[i];
	const targetY = y + { 0: 0, 1: 1, 2: 0, 3: -1 }[i];
	return { x: targetX, y: targetY };
}

const tileTypeIcons = {
	[tileTypes.NEUTRAL]: null,
	[tileTypes.MINOR_SPAWN]: (
		<svg height="60" width="60" className="minorSpawn tileIcon">
			<polygon points="30,5 55,50 5,50" />
		</svg>
	),
	[tileTypes.MAJOR_SPAWN]: (
		<svg width="50" height="50" className="majorSpawn tileIcon">
			<path d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z" />
		</svg>
	),
};

export default connect(
	state => ({
		board: state.board,
		humanMoves: state.humanMoves,
	}),
	{
		addMove,
		removeMove
	}
)(Board);
