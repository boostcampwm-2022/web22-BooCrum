import { colorChips } from '@data/workspace-object-color';
import { useState } from 'react';
import { ColorChip, ColorSelect, Container, Rename } from './index.style';
import dropdownColor from '@assets/icon/dropdown-color.svg';
import { ReactComponent as RenameSection } from '@assets/icon/rename-section.svg';

const selectedType: { [index: string]: number } = {
	NONE: 0,
	COLOR: 1,
	RENAME: 2,
};

function ObjectEditMenu() {
	const [color, setColor] = useState(colorChips[0]); // 나중에 밖으로 빼기
	const [selected, setSelected] = useState(selectedType.NONE);

	const handleColor = (color: string) => {
		setColor(color);
		setSelected(selectedType.NONE);
	};

	const toggleColorSelect = () => {
		setSelected((prevSelect) => (prevSelect === selectedType.COLOR ? selectedType.NONE : selectedType.COLOR));
	};

	return (
		<Container>
			<ColorSelect color={color} onClick={toggleColorSelect}>
				<div className="selected-color" />
				<img alt="set color" className="dropdown-color" src={dropdownColor} />
			</ColorSelect>
			<Rename selected={selected === selectedType.RENAME} onClick={() => setSelected(selectedType.RENAME)}>
				<RenameSection stroke={selected === selectedType.RENAME ? 'white' : '#777777'} />
			</Rename>
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
