import styled from 'styled-components';

export const Container = styled.div`
	height: 80vh;

	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	.icon {
		width: 78px;
		height: 78px;
	}

	.message {
		font-size: 20px;
		font-weight: 500;

		margin-top: 16px;
	}
`;
