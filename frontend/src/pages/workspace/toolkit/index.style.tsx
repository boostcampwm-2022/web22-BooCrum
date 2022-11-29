import styled from 'styled-components';

export const Container = styled.div`
	width: 472px;
	height: 80px;

	border-radius: 20px;
	border: 1px solid ${({ theme }) => theme.gray_1};

	position: absolute;
	left: calc(50% - 236px);
	bottom: 100px;

	display: flex;

	background: ${({ theme }) => theme.white};

	z-index: 4;

	.cursor {
		border-right: 1px solid ${({ theme }) => theme.gray_1};
		width: 44px;
	}

	.draw-tools {
		width: 428px;
		display: flex;
		justify-content: space-around;
	}
`;

export const Tool = styled.div<{ selected: boolean }>`
	width: 90px;
	height: 100%;

	cursor: pointer;

	background: ${({ selected }) => selected && '#F3F3F3'};
	border-radius: 8px 8px 0 0;

	z-index: 10;

	.tool {
		width: 90px;
		position: absolute;
		top: 10px;
		clip: rect(0px, 120px, 70px, 0px);

		:hover {
			top: -20px;
			clip: rect(0px, 120px, 100px, 0px);
		}
	}
`;

export const CursorBackground = styled.div<{ selected: boolean }>`
	background: ${({ theme, selected }) => (selected ? theme.blue_2 : theme.white)};
	height: 40px;

	cursor: pointer;

	:first-child {
		border-radius: 20px 0 0 0;
	}
	:last-child {
		border-radius: 0 0 0 20px;
		border-top: 1px solid ${({ theme }) => theme.gray_1};
		box-sizing: border-box;
	}
`;
