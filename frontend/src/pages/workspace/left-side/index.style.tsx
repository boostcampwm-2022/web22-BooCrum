import styled from 'styled-components';

export const Container = styled.div`
	flex: 1;
	display: flex;

	margin-left: 22px;

	.logo {
		font-size: 32px;
		font-weight: 800;

		color: ${({ theme }) => theme.logo};

		cursor: pointer;
	}

	.export {
		width: 24px;
		height: 28px;
		margin: 3px 0 0 20px;

		cursor: pointer;
	}
`;

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
