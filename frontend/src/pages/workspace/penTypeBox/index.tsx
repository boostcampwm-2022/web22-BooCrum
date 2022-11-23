import { cursorState } from '@context/workspace';
import { toolItems } from '@data/workspace-tool';
import { isSelectedCursor } from '@utils/isSelectedCursor';
import { useRecoilState } from 'recoil';
import penTool from '@assets/image/pen.png';
import eraserTool from '@assets/image/eraser.png';
import { ColorChip, Container, Tool } from './index.style';
import { colorChips } from '@data/workspace-object-color';

function PenTypeBox() {
	const [cursor, setCursor] = useRecoilState(cursorState);

	return (
		<Container>
			<Tool selected={isSelectedCursor(cursor, toolItems.PEN)} onClick={() => setCursor(toolItems.PEN)}>
				<img alt="pen" className="tool" src={penTool} />
			</Tool>
			<Tool selected={isSelectedCursor(cursor, toolItems.ERASER)} onClick={() => setCursor(toolItems.ERASER)}>
				<img alt="section" className="tool" src={eraserTool} />
			</Tool>
			{colorChips.map((color) => (
				<ColorChip key={color} color={color}></ColorChip>
			))}
		</Container>
	);
}

export default PenTypeBox;
