import styled from 'styled-components';

export const Container = styled.div`
	flex: 1;
	display: flex;

	margin-left: 22px;

	.logo {
		font-size: 32px;
		font-weight: 800;

		color: ${({ theme }) => theme.logo};

		cursor: pointer;
	}

	.export {
		width: 24px;
		height: 28px;
		margin: 3px 0 0 20px;

		cursor: pointer;
	}
`;
