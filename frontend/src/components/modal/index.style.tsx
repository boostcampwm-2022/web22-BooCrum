import styled from 'styled-components';

export const ModalBackground = styled.div<{ width: number; height: number }>`
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background-color: rgba(16, 16, 16, 0.3);
	z-index: 5;

	.modal-layout {
		position: absolute;
		z-index: 10;
		width: ${({ width }) => `${width}px`};
		height: ${({ height }) => `${height}px`};

		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);

		background: ${({ theme }) => theme.white};
		box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
		border-radius: 8px;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;

		padding: 10px 20px;

		border-bottom: 1px solid ${({ theme }) => theme.gray_1};
	}

	.title {
		font-size: 20px;
		font-weight: 500;
		line-height: 27px;

		color: ${({ theme }) => theme.black};

		margin: 0;
	}

	.modal-close {
		width: 36px;
		height: 36px;

		cursor: pointer;
	}
`;
