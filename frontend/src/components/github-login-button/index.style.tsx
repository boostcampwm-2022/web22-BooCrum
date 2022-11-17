import styled from 'styled-components';

export const ButtonContainer = styled.button`
	width: 312px;
	background-color: #333;
	border-radius: 20px;
	border: 1px solid #1a1a1a;
	display: flex;
	align-items: center;
	transition: all 250ms linear;

	color: white;
	height: 72px;
	text-align: left;

	&:hover {
		text-decoration: none;
		background-color: #000000;
	}

	.text {
		font-weight: 600;
		font-size: 20px;
		line-height: 27px;
		margin-left: 25px;
	}

	.icon {
		width: 40px;
		height: 40px;
		margin-left: 25px;
		text-align: center;
	}
`;
