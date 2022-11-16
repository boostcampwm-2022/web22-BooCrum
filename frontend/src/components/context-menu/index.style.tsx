import styled from 'styled-components';

export const ContextMeueLayout = styled.div<{ posX: number; posY: number }>`
	position: absolute;
	width: 100px;
	top: ${(props) => props.posY}px;
	left: ${(props) => props.posX}px;
	background-color: white;
	box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.25);
	list-style: none;
	padding: 0;
	z-index: 100;
`;
