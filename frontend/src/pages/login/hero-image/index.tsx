import { Container } from './index.style';
import heroImage from '@assets/image/hero-image.png';

function HeroImage() {
	return (
		<Container>
			<img className="hero-image" src={heroImage} />
		</Container>
	);
}

export default HeroImage;
