import React, { Component } from 'react';
import { connect } from 'react-redux';
import { flatten, times } from 'lodash/fp';
import HumanPlayer from '../players/humanPlayer';

import { confirm } from '../modules/humanMoves';

function UserInterface({ humanMoves: { player }, humanPlayerActive, confirm, winner }) {
	return (
		<div className="userInterface">
			<h3>
				{winner ? <span><span style={{ color: winner.color }}>{winner.name}</span> has won!</span> : <span>&nbsp;</span>}
			</h3>
			{ humanPlayerActive && <button onClick={confirm} disabled={!player}>Confirm move</button> }
		</div>
	);
}

export default connect(
	state => ({
		humanMoves: state.humanMoves,
		winner: state.board.winner,
		humanPlayerActive: state.board.players.some(player => player instanceof HumanPlayer)
	}),
	{
		confirm,
	}
)(UserInterface);
