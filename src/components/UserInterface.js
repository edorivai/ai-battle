import React, { Component } from 'react';
import { connect } from 'react-redux';
import { flatten, times } from 'lodash/fp';

import { confirm } from '../modules/humanMoves';

function UserInterface({ humanMoves: { player }, confirm }) {
	return (
		<div className="userInterface">
			<button onClick={confirm} disabled={!player}>Confirm move</button>
		</div>
	);
}

export default connect(
	state => ({
		humanMoves: state.humanMoves,
	}),
	{
		confirm
	}
)(UserInterface);
