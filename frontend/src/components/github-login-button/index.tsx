import { ButtonContainer } from './index.style';
import githubIcon from '@assets/icon/github-login.svg';

function GithubLoginButton() {
	return (
		<ButtonContainer>
			<img className="icon" src={githubIcon} />
			<div className="text">Github로 로그인하기</div>
		</ButtonContainer>
	);
}

export default GithubLoginButton;
