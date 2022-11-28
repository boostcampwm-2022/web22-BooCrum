import styled from 'styled-components';

export const Container = styled.div`
	margin-right: 12px;
	display: flex;

	position: relative;

	.user-icon {
		width: 30px;
		height: 30px;

		margin-top: 6px;
	}
`;

export const UserProfile = styled.div<{ color: string }>`
	display: flex;
	justify-content: center;
	align-items: center;

	width: 30px;
	height: 30px;

	background: ${({ color }) => color};
	border-radius: 30px;
	overflow: hidden;

	cursor: pointer;

	& + & {
		margin-left: 8px;
	}
`;

export const UserDetail = styled.div`
	position: absolute;
	top: 60px;

	background: ${({ theme }) => theme.white};
	padding: 10px 16px;
	border-radius: 12px;

	font-size: 14px;
	font-weight: 500;
`;
