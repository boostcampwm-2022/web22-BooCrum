import styled from 'styled-components';

export const ContextMeueLayout = styled.div<{ posX: number; posY: number }>`
	position: absolute;
	width: 100px;
	top: ${(props) => props.posY}px;
	left: ${(props) => props.posX}px;
	background-color: white;
	list-style: none;
	padding: 0;
	z-index: 100;
`;
