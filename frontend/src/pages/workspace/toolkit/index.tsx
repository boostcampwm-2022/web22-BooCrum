import { Container, CursorBackground } from './index.style';
import { ReactComponent as SelectCursor } from '@assets/icon/toolkit-select-cursor.svg';
import { ReactComponent as MoveCursor } from '@assets/icon/toolkit-move-cursor.svg';
import { useState } from 'react';

function Toolkit() {
	const [cursor, setCursor] = useState(0);

	return (
		<Container>
			<div className="cursor">
				<CursorBackground selected={cursor === 0} onClick={() => setCursor(0)}>
					<SelectCursor fill={cursor === 0 ? '#ffffff' : '#000000'} />
				</CursorBackground>
				<CursorBackground selected={cursor === 1} onClick={() => setCursor(1)}>
					<MoveCursor fill={cursor === 1 ? '#ffffff' : '#000000'} />
				</CursorBackground>
			</div>
			<div className="draw-tools">
				<div className="tool"></div>
				<div className="tool"></div>
				<div className="tool"></div>
			</div>
		</Container>
	);
}

export default Toolkit;
