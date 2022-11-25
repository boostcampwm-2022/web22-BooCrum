import styled from 'styled-components';

export const Wrapper = styled.div`
	display: flex;

	.workspace-container {
		width: calc(100vw - 286px);
		border-left: 1px solid ${({ theme }) => theme.gray_1};
	}
`;
