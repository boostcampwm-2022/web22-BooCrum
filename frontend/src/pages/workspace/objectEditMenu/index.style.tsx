import styled from 'styled-components';

export const Container = styled.div`
	width: 80px;
	height: 32px;

	position: relative;

	display: flex;
	padding: 0px 10px;

	border-radius: 4px;

	background: ${({ theme }) => theme.gray_4};
`;

export const ColorSelect = styled.div<{ color: string }>`
	display: flex;
	align-items: center;

	cursor: pointer;

	padding-right: 6px;
	border-right: 1px solid ${({ theme }) => theme.gray_3};

	.selected-color {
		background: ${({ color }) => color};
		border-radius: 30px;

		width: 16px;
		height: 16px;

		margin-right: 4px;
	}
`;

export const Rename = styled.div<{ selected: boolean }>`
	background: ${({ selected, theme }) => (selected ? theme.blue_2 : 'transparent')};

	margin-left: 6px;
	padding: 0 4px;

	display: flex;
	align-items: center;

	cursor: pointer;
`;

export const ColorChip = styled.div`
	padding: 8px 16px;
	border-radius: 10px;

	background: ${({ theme }) => theme.gray_4};

	position: absolute;
	left: -50px;
	top: -42px;

	display: flex;

	.color {
		width: 16px;
		height: 16px;

		border-radius: 30px;

		cursor: pointer;

		+ .color {
			margin-left: 4px;
		}
	}
`;
