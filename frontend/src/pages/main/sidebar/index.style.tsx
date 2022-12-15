import styled from 'styled-components';

export const Container = styled.div`
	height: calc(100vh - 32px);

	padding: 32px 62px 0 57px;

	.sidebar-list {
		font-size: 24px;
		font-weight: 500;
		line-height: 33px;
		letter-spacing: -0.03px;

		margin: 60px 5px;
	}
`;

export const SidebarItem = styled.p<{ isSelected: boolean }>`
	cursor: pointer;

	color: ${({ isSelected, theme }) => (isSelected ? theme.blue_1 : theme.black)};

	& + & {
		margin-top: 30px;
	}
`;
