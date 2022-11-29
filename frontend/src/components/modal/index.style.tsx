import styled from 'styled-components';

export const ModalLayout = styled.div<{ width: number; height: number }>`
	position: fixed;
	width: ${({ width }) => `${width}px`};
	height: ${({ height }) => `${height}px`};
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: #ffffff;
	box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 8px;
	z-index: 10;
`;

export const ModalBackground = styled.div`
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background-color: rgba(16, 16, 16, 0.3);
	z-index: 5;
`;
