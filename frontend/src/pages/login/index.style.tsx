import styled from 'styled-components';

export const Wrapper = styled.div`
	height: 100vh;
`;

export const Header = styled.div`
	width: 100%;
	height: 160px;

	display: flex;
	align-items: center;

	.logo-container {
		padding: 0px 104px;
	}
`;

export const Contents = styled.div`
	display: flex;
	width: 100%;
	height: calc(100vh - 160px);
`;
