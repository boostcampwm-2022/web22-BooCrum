import { ButtonContainer } from './index.style';
import githubIcon from '@assets/icon/github-login.svg';
import useAuth from '@hooks/useAuth';
import useModal from '@hooks/useModal';
import ErrorModal from '@components/error-modal';

function GithubLoginButton() {
	const { login } = useAuth();
	const { isOpenModal, modalRef, openModal } = useModal();

	async function handleOnClick() {
		const result = await login();
		if (result === false) {
			openModal();
		}
	}

	return (
		<>
			<ButtonContainer onClick={handleOnClick}>
				<img className="icon" src={githubIcon} />
				<div className="text">Github로 로그인하기</div>
			</ButtonContainer>
			<ErrorModal
				isOpen={isOpenModal}
				modalRef={modalRef}
				width={600}
				height={450}
				errorMessage="로그인에 실패했습니다."
			/>
		</>
	);
}

export default GithubLoginButton;
