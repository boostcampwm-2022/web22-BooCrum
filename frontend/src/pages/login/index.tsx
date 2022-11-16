import Logo from '@components/logo';
import { Wrapper, Header, Contents } from './index.style';
import HeroContent from './hero-content';
import HeroImage from './hero-image';
import useAuth from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

function Login() {
	const { isAuth } = useAuth();

	if (isAuth) {
		return <Navigate to="/" />;
	}

	return (
		<Wrapper>
			<Header>
				<div className="logo-container">
					<Logo />
				</div>
			</Header>
			<Contents>
				<HeroContent />
				<HeroImage />
			</Contents>
		</Wrapper>
	);
}

export default Login;
