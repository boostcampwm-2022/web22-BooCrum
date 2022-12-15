import styled from 'styled-components';

export const ContextMeueLayout = styled.div<{ posX: number; posY: number }>`
	position: absolute;
	top: ${(props) => props.posY}px;
	left: ${(props) => props.posX}px;
	list-style: none;
	padding: 0;
	z-index: 100;
`;
