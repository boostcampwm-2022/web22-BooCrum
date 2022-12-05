import { ChangeEvent } from 'react';

export interface ObjectEditMenuProps {
	selectedObject: string;
	color: string;
	fontSize: number;
	setFontSize: (e: ChangeEvent<HTMLInputElement>) => void;
	setObjectColor: (color: string) => void;
}
