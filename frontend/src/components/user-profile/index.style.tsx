import styled from 'styled-components';

export const Wrapper = styled.div``;

export const ProfileContainer = styled.div<{ isShow: boolean }>`
	position: absolute;
	right: 0;
	width: 285px;
	background-color: white;
	box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.25);
	z-index: 100;
	display: ${({ isShow }) => (isShow ? 'block' : 'none')};
`;

export const ProfileItem = styled.div`
	display: flex;
	align-items: center;
	height: 60px;

	cursor: pointer;

	border-bottom: 1px solid #d8d8d8;
	:last-child {
		border: none;
	}

	&:hover {
		color: ${({ theme }) => theme.blue_1};
	}

	.icon {
		width: 30px;
		height: 30px;
		padding-left: 16px;
	}

	.text {
		font-weight: 400;
		font-size: 16px;
		line-height: 22px;
		padding-left: 12px;
	}
`;
