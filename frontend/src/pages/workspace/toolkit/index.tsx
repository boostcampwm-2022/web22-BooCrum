import { useRecoilState } from 'recoil';
import { Container, CursorBackground, Tool } from './index.style';
import { ReactComponent as SelectCursor } from '@assets/icon/toolkit-select-cursor.svg';
import { ReactComponent as MoveCursor } from '@assets/icon/toolkit-move-cursor.svg';
import penTool from '@assets/image/pen.png';
import postIt from '@assets/image/post-it.svg';
import section from '@assets/image/section.svg';
import { toolItems } from '@data/workspace-tool';
import { cursorState } from '@context/workspace';
import { isSelectedCursor } from '@utils/isSelectedCursor';
import PenTypeBox from '../penTypeBox';

function Toolkit() {
	const [cursor, setCursor] = useRecoilState(cursorState);

	const handleCursor = (type: number) => {
		setCursor({ ...cursor, type });
	};

	return (
		<Container>
			<div className="cursor">
				<CursorBackground
					selected={isSelectedCursor(cursor.type, toolItems.SELECT)}
					onClick={() => handleCursor(toolItems.SELECT)}
				>
					<SelectCursor fill={isSelectedCursor(cursor.type, toolItems.SELECT) ? 'white' : 'black'} />
				</CursorBackground>
				<CursorBackground
					selected={isSelectedCursor(cursor.type, toolItems.MOVE)}
					onClick={() => handleCursor(toolItems.MOVE)}
				>
					<MoveCursor fill={isSelectedCursor(cursor.type, toolItems.MOVE) ? 'white' : 'black'} />
				</CursorBackground>
			</div>
			<div className="draw-tools">
				<Tool
					selected={isSelectedCursor(cursor.type, toolItems.PEN) || isSelectedCursor(cursor.type, toolItems.ERASER)}
					onClick={() => handleCursor(toolItems.PEN)}
				>
					<img alt="pen" className="tool" src={penTool} />
				</Tool>
				<Tool
					selected={isSelectedCursor(cursor.type, toolItems.SECTION)}
					onClick={() => handleCursor(toolItems.SECTION)}
				>
					<img alt="section" className="tool" src={section} />
				</Tool>
				<Tool
					selected={isSelectedCursor(cursor.type, toolItems.POST_IT)}
					onClick={() => handleCursor(toolItems.POST_IT)}
				>
					<img alt="post it" className="tool" src={postIt} />
				</Tool>
			</div>
			{(isSelectedCursor(cursor.type, toolItems.PEN) || isSelectedCursor(cursor.type, toolItems.ERASER)) && (
				<PenTypeBox />
			)}
		</Container>
	);
}

export default Toolkit;
