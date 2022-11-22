import styled from 'styled-components';

export const Container = styled.div`
	border: 1px solid ${({ theme }) => theme.gray_1};
	border-radius: 8px;

	width: 140px;
	height: 32px;

	display: flex;
	justify-content: space-between;
	align-items: center;

	.zoom {
		width: 36px;
		height: 100%;
		display: flex;
		justify-content: center;

		cursor: pointer;

		:first-child {
			border-right: 1px solid ${({ theme }) => theme.gray_1};
		}

		:last-child {
			border-left: 1px solid ${({ theme }) => theme.gray_1};
		}
	}

	.zoom-icon {
		width: 12px;
	}

	.zoom-percent {
		font-size: 12px;
		font-weight: 500;
		line-height: 16px;
	}
`;
