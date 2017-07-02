import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { flatten, times } from 'lodash/fp';
import HumanPlayer from '../players/humanPlayer';
import ais from '../players/players';

import { confirm } from '../modules/humanMoves';
import { startSession, stopSession } from '../modules/session';
import './UserInterface.css';

const colors = ['#ab5a5c', '#4060cf'];
const players = [...ais, HumanPlayer];

class UserInterface extends Component {
	state = {
		player1: 4,
		player2: 3,
		speed: 50,
	};
	setPlayer1 = ({ target: { value: playerIndex } }) => this.setState({ player1: parseInt(playerIndex, 10) });
	setPlayer2 = ({ target: { value: playerIndex } }) => this.setState({ player2: parseInt(playerIndex, 10) });
	setSpeed = ({ target: { value: speed } }) => this.setState({ speed });

	getState = () => {
		return {
			board: this.props.board,
			speed: this.state.speed,
		};
	};

	stopSession = () => this.props.stopSession();

	startSession = () => {
		const { startSession, dispatch } = this.props;
		startSession(
			this.getState,
			[players[this.state.player1], players[this.state.player2]].map(
				(PlayerConstructor, i) => new PlayerConstructor(colors[i])
			),
			dispatch
		);
	};

	render() {
		const { humanMoves: { player }, humanPlayerActive, confirm, winner, running, error } = this.props;
		const { player1, player2, speed } = this.state;
		return (
			<div className="userInterface">

				<div>
					<span className="colorBox" style={{ background: colors[0] }}>&nbsp;</span>
					<select value={player1} onChange={this.setPlayer1}>
						{players.map((player, index) => <option key={index} value={index}>{player.getName()}</option>)}
					</select>
					{' '}
					- VS -
					{' '}
					<select value={player2} onChange={this.setPlayer2}>
						{players.map((player, index) => <option key={index} value={index}>{player.getName()}</option>)}
					</select>
					<span className="colorBox" style={{ background: colors[1] }}>&nbsp;</span>
					{running
						? <button className="startStopButton" onClick={this.stopSession}>STOP</button>
						: <button className="startStopButton" onClick={this.startSession}>START</button>}

					Speed:
					<br />
					<input className="speedSlider" type="range" min="0" max="100" value={speed} onChange={this.setSpeed} />

				</div>

				<h3>
					{winner ? <span><span style={{ color: winner.color }}>{winner.name}</span> has won!</span> : <span>&nbsp;</span>}
				</h3>

				{error &&
					<div className="errorBox">
						<h3>
							<span>
								<span style={{ color: error.player.color }}>{error.player.name}</span> has made an invalid move:{' '}
								{error.message}
							</span>
						</h3>

						<h4>
							Attempted to move {error.move.unitCount} units from ({error.move.from.x},{error.move.from.y}) to ({error.move.to.x},{error.move.to.y}).
						</h4>
					</div>}

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
		error: state.session.error,
		humanPlayerActive: state.board.players.some(player => player instanceof HumanPlayer),
	}),
	dispatch => ({
		dispatch,
		...bindActionCreators(
			{
				confirm,
				startSession,
				stopSession,
			},
			dispatch
		),
	})
)(UserInterface);
