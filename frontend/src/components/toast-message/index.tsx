import { Container } from './index.style';

function ToastMessage({ message, bold = false }: { message: string; bold?: boolean }) {
	return <Container bold={bold}>{message}</Container>;
}
export default ToastMessage;
