import styled from 'styled-components';

export const Container = styled.div`
	.bottom {
		position: absolute;
		bottom: 0;

		width: 100%;
		display: flex;
		align-items: center;

		border-top: 1px solid ${({ theme }) => theme.gray_1};

		font-size: 15px;
		line-height: 20px;
		font-weight: 400;
	}

	.copy-link {
		display: flex;
		align-items: center;

		cursor: pointer;
	}

	.copy-icon {
		width: 36px;
		height: 36px;
	}
`;

export const ParticipantList = styled.div`
	height: 300px;
	overflow: auto;
`;
