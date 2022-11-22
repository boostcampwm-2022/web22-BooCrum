import LeftSide from '../leftSide';
import RightSide from '../rightSide';
import { Container } from './index.style';

function Header({ name }: { name: string }) {
	return (
		<Container>
			<LeftSide />
			<p className="title">{name}</p>
			<RightSide />
		</Container>
	);
}

export default Header;
