import { ButtonContainer } from './index.style';
import githubIcon from '@assets/icon/github-login.svg';
import ErrorModal from '@components/error-modal';

function GithubLoginButton() {
	return (
		<>
			<ButtonContainer href="/api/auth/oauth/github">
				<img className="icon" src={githubIcon} />
				<div className="text">Github로 로그인하기</div>
			</ButtonContainer>
			<ErrorModal errorMessage="로그인에 실패했습니다." />
		</>
	);
}

export default GithubLoginButton;
