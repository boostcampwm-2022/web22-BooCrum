import styled from 'styled-components';

export const Container = styled.div`
	position: absolute;
	z-index: 10;
	width: 600px;
	height: 400px;

	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	background: ${({ theme }) => theme.white};
	box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 8px;

	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;

		padding: 10px 20px;

		border-bottom: 1px solid ${({ theme }) => theme.gray_1};
	}

	.title {
		font-size: 20px;
		font-weight: 500;
		line-height: 27px;

		color: ${({ theme }) => theme.black};

		margin: 0;
	}

	.modal-close {
		width: 36px;
		height: 36px;

		cursor: pointer;
	}

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

	.copy-icon {
		width: 36px;
		height: 36px;

		cursor: pointer;
	}
`;

export const Invite = styled.div<{ isValid: boolean }>`
	display: flex;
	justify-content: space-between;
	padding: 14px;

	.invite-input {
		outline: none;
		border: 2px solid ${({ isValid, theme }) => (isValid ? theme.blue_2 : theme.gray_2)};
		border-radius: 10px;

		padding: 12px 16px;
		width: 400px;
	}

	.invite-button {
		width: 130px;

		border-radius: 10px;
		background: ${({ isValid, theme }) => (isValid ? theme.blue_2 : theme.gray_2)};
		color: ${({ theme }) => theme.white};

		display: flex;
		justify-content: center;
		align-items: center;
		cursor: pointer;
	}
`;

export const ParticipantList = styled.div`
	height: 230px;
	overflow: auto;

	.participant-box {
		display: flex;
		align-items: center;

		padding: 8px 20px;
	}

	.participant-profile {
		width: 32px;
		height: 32px;
	}

	.participant-name {
		font-size: 16px;
		line-height: 22px;
		font-weight: 400;

		color: ${({ theme }) => theme.black};

		margin-left: 12px;
	}
`;
