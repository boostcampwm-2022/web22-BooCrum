import styled from 'styled-components';

export const Container = styled.div`
	height: calc(100vh - 32px);
	border-right: 1px solid ${({ theme }) => theme.gray_1};

	padding: 32px 62px 0 57px;

	.sidebar-list {
		font-size: 24px;
		font-weight: 500;
		line-height: 33px;
		letter-spacing: -0.03px;

		margin: 60px 5px;
	}
`;

export const SidebarItem = styled.p`
	cursor: pointer;

	& + & {
		margin-top: 30px;
	}
`;
