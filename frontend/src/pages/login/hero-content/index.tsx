import { Container, Heading } from './index.style';
import LoginContent from '../login-content';

function HeroContent() {
	return (
		<Container>
			<Heading>
				온라인에서
				<br />
				<span className="point_typo">스크럼 회고</span>를
				<br />
				진행하는 공간
			</Heading>
			<LoginContent />
		</Container>
	);
}

export default HeroContent;
