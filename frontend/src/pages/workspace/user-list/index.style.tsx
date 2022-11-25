import styled from 'styled-components';

export const Container = styled.div`
	margin-right: 12px;

	.user-profile {
		width: 30px;

		+ .user-profile {
			margin-left: 8px;
		}
	}
`;
