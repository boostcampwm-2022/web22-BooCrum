import { Container, Heading } from './index.style';
import GithubLoginButton from '@components/github-login-button';

function LoginContent() {
	return (
		<Container>
			<Heading>Sign in</Heading>
			<GithubLoginButton />
		</Container>
	);
}

export default LoginContent;
