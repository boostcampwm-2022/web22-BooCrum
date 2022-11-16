import styled from 'styled-components';

export const Wrapper = styled.div`
	height: 100vh;
`;

export const Header = styled.div`
	width: 100%;
	height: 120px;

	display: flex;
	align-items: center;

	.logp-container {
		padding: 0px 62px;
	}
`;

export const Contents = styled.div`
	display: flex;
	width: 100%;
	height: calc(100vh - 120px);
`;
