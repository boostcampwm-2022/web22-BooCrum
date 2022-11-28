import styled from 'styled-components';

export const Container = styled.div`
	position: relative;
	height: 56px;
	z-index: 5;

	border-bottom: 1px solid ${({ theme }) => theme.gray_1};
	background-color: white;
	display: flex;
	align-items: center;

	.title {
		font-size: 20px;
		font-weight: 400;
		line-height: 27px;

		text-align: center;

		flex: 1;
	}
`;

export const ModalWrapper = styled.div`
	position: fixed;
	z-index: 10;
	width: 100vw;
	height: 100vh;

	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	background: rgba(16, 16, 16, 0.3);
	box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 8px;
`;
