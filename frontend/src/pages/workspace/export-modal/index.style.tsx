import styled from 'styled-components';

export const ModalContent = styled.div`
	.export-modal-text {
		margin-top: 32px;
		font-size: 20px;
		margin-left: 16px;
		font-weight: 400;
	}
`;

export const ExportButton = styled.button`
	position: absolute;
	bottom: 1em;
	right: 1em;
	border: none;
	background-color: #2071ff;
	color: white;
	font-weight: 600;
	padding: 1em;
	border-radius: 30px;

	:disabled {
		background-color: lightgrey;
	}
`;
