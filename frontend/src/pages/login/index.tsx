import Logo from '@components/logo';
import { Wrapper, Header, Contents } from './index.style';
import HeroContent from './hero-content';
import HeroImage from './hero-image';

function Login() {
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
