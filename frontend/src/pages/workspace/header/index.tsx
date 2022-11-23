import LeftSide from '../left-side';
import RightSide from '../right-side';
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
