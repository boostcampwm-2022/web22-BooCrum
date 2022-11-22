import { useLocation } from 'react-router-dom';
import Header from './header';
import Toolkit from './toolkit';

function Workspace() {
	const {
		state: { name, workspaceId },
	} = useLocation();

	return (
		<>
			<Header name={name} />
			<Toolkit />
		</>
	);
}

export default Workspace;
