import { Wrapper } from './index.style';
import Spinner from '@assets/gif/spinner.gif';

function Loading() {
	return (
		<Wrapper>
			<img alt="spinner" src={Spinner} />
			<p className="text">Loading...</p>
		</Wrapper>
	);
}

export default Loading;
