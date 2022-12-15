import styled from 'styled-components';

export const Dropdown = styled.div`
	position: relative;
	z-index: 5;

	.dropdown-button {
		width: 148px;

		font-size: 12px;
		font-weight: 400;
		line-height: 16px;

		border: 1px solid ${({ theme }) => theme.gray_2};
		border-radius: 5px;

		padding: 9px 16px;

		display: flex;
		justify-content: space-between;
		align-items: center;

		cursor: pointer;
	}

	.dropdown-icon {
		width: 14px;
		height: 7px;
	}

	.dropdown-container {
		width: 140px;
		padding: 18px 20px;

		border: 1px solid ${({ theme }) => theme.gray_2};
		border-radius: 5px;

		position: absolute;

		top: 40px;

		background: ${({ theme }) => theme.white};
	}
`;

export const Description = styled.p<{ isSelected: boolean }>`
	font-size: 12px;
	font-weight: 400;
	line-height: 16px;

	color: ${({ isSelected, theme }) => (isSelected ? theme.blue_1 : theme.black)};

	cursor: pointer;

	& + & {
		margin-top: 12px;
	}
`;
