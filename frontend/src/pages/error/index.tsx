import { Container } from './index.style';
import booCrum from '@assets/icon/boo-crum.png';

function Error() {
	return (
		<Container>
			<img className="icon" alt="booCrum icon" src={booCrum} />
			<p className="message">데이터를 불러올 수 없습니다.</p>
		</Container>
	);
}

export default Error;
