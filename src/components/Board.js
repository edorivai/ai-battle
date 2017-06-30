import React, { Component } from 'react';
import { connect } from 'react-redux';
import { flatten } from 'lodash/fp';

import { tileTypes } from '../modules/board';

import './Board.css';

function Board({ board: { tiles } }) {
	return <div className="board">{flatten(tiles.map((row, x) => row.map((tile, y) =>
		<Tile key={`${x},${y}`} {...tile} />)))}</div>;
}

function Tile({ type, player, unitCount }) {
	return (
		<div
			className="boardTile"
			style={{
				background: player ? player.color : 'white',
			}}
		>
			{tileTypeIcons[type]}
			{unitCount > 0 &&
				<div className='unitCount'>
					{unitCount}
				</div>
			}
		</div>
	);
}

const tileTypeIcons = {
	[tileTypes.NEUTRAL]: null,
	[tileTypes.MINOR_SPAWN]: (
		<svg height="60" width="60" className='minorSpawn tileIcon'>
			<polygon
				points="30,5 55,50 5,50"
			/>
		</svg>
	),
	[tileTypes.MAJOR_SPAWN]: (
		<svg width="50" height="50" className='majorSpawn tileIcon'>
			<path d="m25,1 6,17h18l-14,11 5,17-15-10-15,10 5-17-14-11h18z"/>
		</svg>
	)
};

export default connect(state => ({ board: state.board }))(Board);
