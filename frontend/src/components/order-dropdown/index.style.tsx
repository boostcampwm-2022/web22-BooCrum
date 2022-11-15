import styled from 'styled-components';

export const Dropdown = styled.div`
	.button {
		cursor: pointer;
	}

	.container {
		padding: 18px 20px;

		border: 1px solid ${({ theme }) => theme.gray_2};
		border-radius: 5px;

		position: absolute;
	}
`;

export const Description = styled.p<{ isSelected: boolean }>`
	font-size: 12;
	font-weight: 400;
	line-height: 16px;

	color: ${({ isSelected, theme }) => (isSelected ? theme.blue_1 : theme.black)};

	cursor: pointer;

	& + & {
		margin-top: 12px;
	}
`;
