import React from 'react';
import { render } from 'react-dom';
import './index.css';
import App from './App';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './modules/reducer';
import { setStore } from './players/humanPlayer';

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

setStore(store);

render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
);
