import styled from 'styled-components';

export const Container = styled.div`
	display: flex;
	justify-content: space-between;

	position: relative;

	padding: 16px 20px;

	.info {
		display: flex;
		align-items: center;
	}

	.profile {
		width: 32px;
		height: 32px;
	}

	.role-setting {
		display: flex;
		align-items: center;

		cursor: pointer;
	}

	.role-selected {
		font-size: 14px;
		line-height: 22px;
		font-weight: 400;

		color: ${({ theme }) => theme.black};
	}

	.name {
		font-size: 16px;
		line-height: 22px;
		font-weight: 400;

		color: ${({ theme }) => theme.black};

		margin-left: 12px;
	}

	.dropdown {
		width: 10px;
		margin-left: 8px;
	}
`;

export const RoleEditMenu = styled.div`
	position: absolute;
	top: 40px;
	left: 512px;

	z-index: 5;

	padding: 10px 16px;
	background: ${({ theme }) => theme.white};
	border-radius: 10px;

	box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.25);

	.role {
		font-size: 14px;
		line-height: 22px;
		font-weight: 400;

		color: ${({ theme }) => theme.black};

		cursor: pointer;

		+ .role {
			margin-top: 2px;
		}
	}
`;
