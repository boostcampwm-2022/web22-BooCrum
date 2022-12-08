import { cursorState } from '@context/workspace';
import { toolItems } from '@data/workspace-tool';
import { isSelectedCursor } from '@utils/is-selected-cursor.utils';
import { useRecoilState } from 'recoil';
import penTool from '@assets/image/pen.png';
import eraserTool from '@assets/image/eraser.png';
import { ColorChip, Container, Tool } from './index.style';
import { colorChips } from '@data/workspace-object-color';
import { useEffect } from 'react';

function PenTypeBox() {
	const [cursor, setCursor] = useRecoilState(cursorState);

	useEffect(() => {
		colorChips.forEach((c) => {
			console.log(cursor, c, cursor.color === c);
		});
	}, []);

	const handleCursorType = (type: number) => {
		setCursor({ ...cursor, type });
	};

	const handleCursorColor = (color: string) => {
		setCursor({ ...cursor, color });
	};

	return (
		<Container>
			<Tool selected={isSelectedCursor(cursor.type, toolItems.PEN)} onClick={() => handleCursorType(toolItems.PEN)}>
				<img alt="pen" className="tool" src={penTool} />
			</Tool>
			<Tool
				selected={isSelectedCursor(cursor.type, toolItems.ERASER)}
				onClick={() => handleCursorType(toolItems.ERASER)}
			>
				<img alt="eraser" className="tool" src={eraserTool} />
			</Tool>
			{isSelectedCursor(cursor.type, toolItems.PEN) &&
				colorChips.map((color) => (
					<ColorChip
						key={color}
						color={color}
						selected={color === cursor.color}
						onClick={() => handleCursorColor(color)}
					></ColorChip>
				))}
		</Container>
	);
}

export default PenTypeBox;
