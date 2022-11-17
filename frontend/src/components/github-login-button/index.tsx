import { ButtonContainer } from './index.style';
import githubIcon from '@assets/icon/github-login.svg';
import useAuth from '@hooks/useAuth';

function GithubLoginButton() {
	const { login } = useAuth();

	function handleOnClick() {
		login();
	}

	return (
		<ButtonContainer onClick={handleOnClick}>
			<img className="icon" src={githubIcon} />
			<div className="text">Github로 로그인하기</div>
		</ButtonContainer>
	);
}

export default GithubLoginButton;
