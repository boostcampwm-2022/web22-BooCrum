import styled from 'styled-components';

export const ContextMeueLayout = styled.ul`
	position: absolute;
	width: 100px;
	top: 0;
	right: 0.5em;
	background-color: white;
	box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.25);
	list-style: none;
	padding: 0;
	li {
		padding: 0.5em;
		font-weight: 600;
		:hover {
			background-color: #f0f0f0;
		}
	}
`;
