import { Container, CursorBackground, Tool } from './index.style';
import { ReactComponent as SelectCursor } from '@assets/icon/toolkit-select-cursor.svg';
import { ReactComponent as MoveCursor } from '@assets/icon/toolkit-move-cursor.svg';
import penTool from '@assets/image/pen.png';
import postIt from '@assets/image/post-it.svg';
import section from '@assets/image/section.svg';
import { toolItems } from '@data/workspace-tool';
import { useRecoilState } from 'recoil';
import { cursorState } from '@context/workspace';

function Toolkit() {
	const [cursor, setCursor] = useRecoilState(cursorState);

	return (
		<Container>
			<div className="cursor">
				<CursorBackground selected={cursor === toolItems.SELECT} onClick={() => setCursor(toolItems.SELECT)}>
					<SelectCursor fill={cursor === toolItems.SELECT ? '#ffffff' : '#000000'} />
				</CursorBackground>
				<CursorBackground selected={cursor === toolItems.MOVE} onClick={() => setCursor(toolItems.MOVE)}>
					<MoveCursor fill={cursor === toolItems.MOVE ? '#ffffff' : '#000000'} />
				</CursorBackground>
			</div>
			<div className="draw-tools">
				<Tool selected={cursor === toolItems.PEN} onClick={() => setCursor(toolItems.PEN)}>
					<img alt="pen" className="tool" src={penTool} />
				</Tool>
				<Tool selected={cursor === toolItems.SECTION} onClick={() => setCursor(toolItems.SECTION)}>
					<img alt="section" className="tool" src={section} />
				</Tool>
				<Tool selected={cursor === toolItems.POST_IT} onClick={() => setCursor(toolItems.POST_IT)}>
					<img alt="post it" className="tool" src={postIt} />
				</Tool>
			</div>
		</Container>
	);
}

export default Toolkit;