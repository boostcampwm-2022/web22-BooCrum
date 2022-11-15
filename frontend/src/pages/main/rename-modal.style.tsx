import styled from 'styled-components';

export const RenameModalLayout = styled.div`
	position: absolute;
	width: 400px;
	height: 200px;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	background: #ffffff;
	box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.25);
	border-radius: 8px;
	z-index: 10;

	h3 {
		border-bottom: 1px solid #d8d8d8;
		padding: 0.5em;
	}
	input {
		margin: 0.5em;
		border: none;
		border-bottom: 1px solid #d8d8d8;
		padding: 0.3em;
		font-size: 16px;
		outline: none;
		:focus {
		}
	}
	button {
		position: absolute;
		bottom: 1em;
		right: 1em;
		border: none;
		background-color: #2071ff;
		color: white;
		font-weight: 600;
		padding: 1em;
		border-radius: 30px;
	}
`;

export const RenameModalBackground = styled.div`
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	background-color: rgba(16, 16, 16, 0.3);
	z-index: 1;
`;
