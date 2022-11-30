import styled from 'styled-components';

export const ModalContent = styled.div`
	display: flex;
	height: calc(100% - 60px);
	flex-direction: column;
	justify-content: center;
	align-items: center;

	.error-image {
		transform: translate(-15%, 0);
	}

	.error-message {
		font-weight: 500;
		font-size: 24px;
		line-height: 33px;
	}

	.error-image + .error-message {
		margin-top: 30px;
	}
`;
