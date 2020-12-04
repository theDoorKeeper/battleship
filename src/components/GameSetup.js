import React, { useState, useEffect } from 'react';
import {
	SetupWindow,
	SetupTitle,
	GameBoardGrid,
	Cell,
} from './styled_components/gameControllerStyles';
import Gameboard from './factories/gameboardFactory';

function GameSetup({ players, setTimeline, dismount, setDismount }) {
	const shipTypes = [
		{
			name: 'carrier',
			length: 5,
		},
		{
			name: 'battleship',
			length: 4,
		},
		{
			name: 'destroyer',
			length: 3,
		},
		{
			name: 'submarine',
			length: 3,
		},
		{
			name: 'patrol boat',
			length: 2,
		},
	];

	const [playerBoard, setPlayerBoard] = useState(new Gameboard());
	const [currentShip, setCurrentShip] = useState(0);
	const [axis, setAxis] = useState('x');
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// using the new loading state to avoid race conditions between the render
		// and setDismount. hint: render always wins. this causes the animation to
		// load incorrectly
		if (loading) {
			setDismount(false);
			setLoading(false);
		}
	}, [setDismount, loading]);

	const handleAnimationEnd = () => {
		// allow for the fadeout
		if (dismount) setTimeline('gameStart');
	};

	const placeShip = (board, location) => {
		if (board.placeShip(location, shipTypes[currentShip].length, axis)) {
			setPlayerBoard(board);
			if (currentShip >= 4) {
				setDismount(true);
			} else {
				setCurrentShip(currentShip + 1);
			}
		}
	};

	const handleHover = (index) => {};

	return (
		!loading && (
			<SetupWindow
				onAnimationEnd={handleAnimationEnd}
				style={{ animation: dismount ? 'fadeout 2s' : 'fadein 2s' }}
			>
				<SetupTitle>
					{players[0].name}, Place Your {shipTypes[currentShip].name}:
				</SetupTitle>
				<button onClick={() => setAxis(axis === 'x' ? 'y' : 'x')}>
					Change axis
				</button>
				<GameBoardGrid>
					{playerBoard.board.map((cell, index) => (
						<Cell
							onClick={() => {
								placeShip(playerBoard, index);
							}}
						>
							{cell.hasShip ? 'x' : ''}
						</Cell>
					))}
				</GameBoardGrid>
			</SetupWindow>
		)
	);
}

export default GameSetup;
