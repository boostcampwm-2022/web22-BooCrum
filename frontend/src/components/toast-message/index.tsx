import { Container } from './index.style';

function ToastMessage({ message }: { message: string }) {
	return <Container>{message}</Container>;
}
export default ToastMessage;
