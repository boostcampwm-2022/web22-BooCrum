import styled from 'styled-components';

export const Wrapper = styled.div`
	position: absolute;
	width: 100vw;
	height: 100vh;
	top: 0;
	left: 0;
	z-index: 999;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	.text {
		text-align: center;
	}
`;
