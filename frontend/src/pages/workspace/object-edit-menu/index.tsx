import { colorChips } from '@data/workspace-object-color';
import { useState } from 'react';
import { ColorChip, ColorSelect, Container, FontSize } from './index.style';
import dropdownColor from '@assets/icon/dropdown-color.svg';
import { ObjectEditMenuProps } from './index.type';
import { ObjectType } from '../whiteboard-canvas/types';

const selectedType: { [index: string]: number } = {
	NONE: 0,
	COLOR: 1,
	TYPE: 2,
};

function ObjectEditMenu({ selectedObject, color, fontSize, setFontSize, setObjectColor }: ObjectEditMenuProps) {
	const [selected, setSelected] = useState(selectedType.NONE);

	const handleColor = (color: string) => {
		setObjectColor(color);
		setSelected(selectedType.NONE);
	};

	const toggleColorSelect = () => {
		setSelected((prevSelect) => (prevSelect === selectedType.COLOR ? selectedType.NONE : selectedType.COLOR));
	};

	const renderOptionBySelect = () => {
		if (selectedObject === ObjectType.postit) {
			return (
				<FontSize
					selected={selected === selectedType.TYPE}
					onClick={() => setSelected(selectedType.TYPE)}
					value={fontSize}
					onChange={setFontSize}
				/>
			);
		} else return <></>;
	};

	return (
		<Container>
			<ColorSelect color={color} onClick={toggleColorSelect}>
				<div className="selected-color" />
				<img alt="set color" className="dropdown-color" src={dropdownColor} />
			</ColorSelect>
			{renderOptionBySelect()}
			{selected === selectedType.COLOR && (
				<ColorChip>
					{colorChips.map((color) => (
						<div key={color} className="color" style={{ background: color }} onClick={() => handleColor(color)} />
					))}
				</ColorChip>
			)}
		</Container>
	);
}

export default ObjectEditMenu;
