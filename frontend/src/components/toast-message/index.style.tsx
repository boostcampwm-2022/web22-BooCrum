import styled from 'styled-components';

export const Container = styled.div<{ bold: boolean }>`
	background: ${({ bold }) => (bold ? 'black' : 'rgba(16, 16, 16, 0.3)')};
	color: ${({ theme }) => theme.white};

	padding: 12px 16px;
	border-radius: 30px;

	font-size: 12px;
	font-weight: 500;

	position: absolute;
	bottom: 20px;
	left: 50%;

	transform: translate(-50%, 0);

	animation: fadeInMessage 0.5s;

	@keyframes fadeInMessage {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
`;
