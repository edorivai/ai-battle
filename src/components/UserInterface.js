import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { flatten, times } from 'lodash/fp';
import HumanPlayer from '../players/humanPlayer';
import players from '../players/players';

import { confirm } from '../modules/humanMoves';
import { startSession } from '../modules/session';
import './UserInterface.css';

const colors = ['#ab5a5c', '#4060cf'];

class UserInterface extends Component {
	state = {
		player1: 0,
		player2: 0,
	};
	setPlayer1 = ({ target: { value: playerIndex } }) => this.setState({ player1: parseInt(playerIndex, 10) });
	setPlayer2 = ({ target: { value: playerIndex } }) => this.setState({ player2: parseInt(playerIndex, 10) });

	getBoard = () => {
		console.log('getting board', this.props.board);
		return this.props.board;
	};

	startSession = () => {
		const { startSession, dispatch } = this.props;
		startSession(this.getBoard, [new players[this.state.player1](colors[0]), new players[this.state.player2](colors[1])], dispatch);
	};

	render() {
		const { humanMoves: { player }, humanPlayerActive, confirm, winner, running } = this.props;
		const { player1, player2 } = this.state;
		return (
			<div className="userInterface">

				<div>
					<select value={player1} onChange={this.setPlayer1}>
						{players.map((player, index) => <option key={index} value={index}>{player.getName()}</option>)}
					</select>
					{' '}
					- VS -
					{' '}
					<select value={player2} onChange={this.setPlayer2}>
						{players.map((player, index) => <option key={index} value={index}>{player.getName()}</option>)}
					</select>
					{running
						? <button className="startStopButton">STOP</button>
						: <button className="startStopButton" onClick={this.startSession}>START</button>}

				</div>

				<h3>
					{winner ? <span><span style={{ color: winner.color }}>{winner.name}</span> has won!</span> : <span>&nbsp;</span>}
				</h3>
				{humanPlayerActive && <button onClick={confirm} disabled={!player}>Confirm move</button>}
			</div>
		);
	}
}

export default connect(
	state => ({
		board: state.board,
		humanMoves: state.humanMoves,
		winner: state.board.winner,
		running: state.session.running,
		humanPlayerActive: state.board.players.some(player => player instanceof HumanPlayer),
	}),
	dispatch => ({
		dispatch,
		...bindActionCreators({
			confirm,
			startSession,
		}, dispatch)
	})
)(UserInterface);
