import Contents from './contents';
import Header from './header';
import { Wrapper } from './index.style';
import Sidebar from './sidebar';

function Main() {
	return (
		<Wrapper>
			<Sidebar />
			<div className="workspace-container">
				<Header />
				<Contents />
			</div>
		</Wrapper>
	);
}

export default Main;
