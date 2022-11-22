import { Container, CursorBackground, Tool } from './index.style';
import { ReactComponent as SelectCursor } from '@assets/icon/toolkit-select-cursor.svg';
import { ReactComponent as MoveCursor } from '@assets/icon/toolkit-move-cursor.svg';
import penTool from '@assets/image/pen.png';
import postIt from '@assets/image/post-it.svg';
import section from '@assets/image/section.svg';
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
				<Tool selected={cursor === 2} onClick={() => setCursor(2)}>
					<img alt="pen" className="tool" src={penTool} />
				</Tool>
				<Tool selected={cursor === 4} onClick={() => setCursor(4)}>
					<img alt="section" className="tool" src={section} />
				</Tool>
				<Tool selected={cursor === 5} onClick={() => setCursor(5)}>
					<img alt="post it" className="tool" src={postIt} />
				</Tool>
			</div>
		</Container>
	);
}

export default Toolkit;
