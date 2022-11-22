import styled from 'styled-components';

export const Container = styled.div`
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
		margin-left: 20px;

		cursor: pointer;
	}
`;
