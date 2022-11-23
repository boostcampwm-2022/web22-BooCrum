import { colorChips } from '@data/workspace-object-color';
import { useState } from 'react';
import { ColorChip, ColorSelect, Container, Rename, FontSize } from './index.style';
import dropdownColor from '@assets/icon/dropdown-color.svg';
import { ReactComponent as RenameSection } from '@assets/icon/rename-section.svg';
import { ObjectEditMenuProps } from './index.type';

const selectedType: { [index: string]: number } = {
	NONE: 0,
	COLOR: 1,
	TYPE: 2,
};

function ObjectEditMenu({ selectedObject, color, setObjectColor }: ObjectEditMenuProps) {
	const [selected, setSelected] = useState(selectedType.NONE);

	const handleColor = (color: string) => {
		setObjectColor(color);
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
			{selectedObject === 'section' ? (
				<Rename selected={selected === selectedType.TYPE} onClick={() => setSelected(selectedType.TYPE)}>
					<RenameSection stroke={selected === selectedType.TYPE ? 'white' : '#777777'} />
				</Rename>
			) : (
				<FontSize selected={selected === selectedType.TYPE} onClick={() => setSelected(selectedType.TYPE)}></FontSize>
			)}
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
