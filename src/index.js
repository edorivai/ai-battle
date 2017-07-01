import React from 'react';
import { render } from 'react-dom';
import './index.css';
import App from './App';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './modules/reducer';
import RandomPlayer from './players/randomPlayer';
import HumanPlayer from './players/humanPlayer';
import startLoop from './game/loop';

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const colors = [
	'#ab5a5c',
	'#4060cf',
];

const players = [
	new RandomPlayer(colors[0]),
	new HumanPlayer(colors[1], store),
];

render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);

startLoop(store, players);
