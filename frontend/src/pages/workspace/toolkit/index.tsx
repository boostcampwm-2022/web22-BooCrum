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

	return (
		<Container>
			<div className="cursor">
				<CursorBackground
					selected={isSelectedCursor(cursor, toolItems.SELECT)}
					onClick={() => setCursor(toolItems.SELECT)}
				>
					<SelectCursor fill={isSelectedCursor(cursor, toolItems.SELECT) ? 'white' : 'black'} />
				</CursorBackground>
				<CursorBackground selected={isSelectedCursor(cursor, toolItems.MOVE)} onClick={() => setCursor(toolItems.MOVE)}>
					<MoveCursor fill={isSelectedCursor(cursor, toolItems.MOVE) ? 'white' : 'black'} />
				</CursorBackground>
			</div>
			<div className="draw-tools">
				<Tool
					selected={isSelectedCursor(cursor, toolItems.PEN) || isSelectedCursor(cursor, toolItems.ERASER)}
					onClick={() => setCursor(toolItems.PEN)}
				>
					<img alt="pen" className="tool" src={penTool} />
				</Tool>
				<Tool selected={isSelectedCursor(cursor, toolItems.SECTION)} onClick={() => setCursor(toolItems.SECTION)}>
					<img alt="section" className="tool" src={section} />
				</Tool>
				<Tool selected={isSelectedCursor(cursor, toolItems.POST_IT)} onClick={() => setCursor(toolItems.POST_IT)}>
					<img alt="post it" className="tool" src={postIt} />
				</Tool>
			</div>
			{(isSelectedCursor(cursor, toolItems.PEN) || isSelectedCursor(cursor, toolItems.ERASER)) && <PenTypeBox />}
		</Container>
	);
}

export default Toolkit;
