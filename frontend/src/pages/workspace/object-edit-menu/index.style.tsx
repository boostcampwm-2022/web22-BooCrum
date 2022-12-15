import styled from 'styled-components';

export const Container = styled.div`
	height: 32px;
	position: relative;
	display: flex;

	border-radius: 4px;

	background: ${({ theme }) => theme.gray_4};
`;

export const ColorSelect = styled.div<{ color: string }>`
	display: flex;
	align-items: center;

	cursor: pointer;
	padding: 0 6px 0 10px;

	.selected-color {
		background: ${({ color }) => color};
		border-radius: 30px;

		width: 16px;
		height: 16px;

		margin-right: 4px;
	}
`;

export const FontSize = styled.input<{ selected: boolean }>`
	background: ${({ theme }) => theme.gray_4};
	width: 40px;

	padding: 0 10px 0 6px;
	border: none;
	border-radius: 4px;
	border-left: 1px solid ${({ theme }) => theme.gray_3};

	font-size: 12px;
	color: ${({ theme }) => theme.white};

	outline: none;
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
