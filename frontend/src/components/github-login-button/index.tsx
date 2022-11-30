import { ButtonContainer } from './index.style';
import githubIcon from '@assets/icon/github-login.svg';
import useAuth from '@hooks/useAuth';
import useModal from '@hooks/useModal';
import ErrorModal from '@components/error-modal';

function GithubLoginButton() {
	const { isOpenModal, modalRef, closeModal } = useModal();

	return (
		<>
			<ButtonContainer href="/api/auth/oauth/github">
				<img className="icon" src={githubIcon} />
				<div className="text">Github로 로그인하기</div>
			</ButtonContainer>
			<ErrorModal
				isOpen={isOpenModal}
				modalRef={modalRef}
				width={600}
				height={450}
				errorMessage="로그인에 실패했습니다."
				closeModal={closeModal}
			/>
		</>
	);
}

export default GithubLoginButton;
