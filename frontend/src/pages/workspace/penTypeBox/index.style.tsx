import styled, { css } from 'styled-components';

export const Container = styled.div`
	background: ${({ theme }) => theme.gray_1};
	border-radius: 10px 10px 0 0;

	width: 410px;
	height: 46px;

	position: absolute;
	top: -46px;
	left: 44px;

	display: flex;
	align-items: center;
`;

export const Tool = styled.div<{ selected: boolean }>`
	width: 60px;
	height: 100%;

	z-index: 7;

	cursor: pointer;

	border-radius: 8px 8px 0 0;

	.tool {
		width: 60px;
		position: absolute;

		${({ selected }) =>
			selected
				? css`
						clip: rect(0px, 120px, 70px, 0px);
						top: -25px;
				  `
				: css`
						clip: rect(0px, 120px, 50px, 0px);
						top: -5px;
				  `}

		:hover {
			top: -25px;
			clip: rect(0px, 120px, 70px, 0px);
		}
	}
`;

export const ColorChip = styled.div<{ color: string }>`
	background: ${({ color }) => color};
	border-radius: 30px;

	width: 24px;
	height: 24px;

	& + & {
		margin-left: 4px;
	}
`;
