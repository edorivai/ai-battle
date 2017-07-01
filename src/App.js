import React, { Component } from 'react';
import './App.css';

import Board from './components/Board';
import UserInterface from './components/UserInterface';

class App extends Component {
	render() {
		return (
			<div className="App">
				<div className="App-header">
					<h1>FCC-Vienna AI Battle!</h1>
				</div>
				
				<UserInterface />
				<Board />
			</div>
		);
	}
}

export default App;
