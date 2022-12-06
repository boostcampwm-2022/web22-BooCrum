import styled from 'styled-components';

export const WorkspaceMenuList = styled.ul`
	margin: 0;
	padding: 0;
	list-style: none;

	width: 100px;
	background: ${({ theme }) => theme.white};

	box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.25);
`;

export const WorkspaceMenuItem = styled.li`
	font-size: 16px;
	border-bottom: 1px solid #d8d8d8;
	padding: 5px;
	:last-child {
		border: none;
	}
`;
