import { useLocation } from 'react-router-dom';
import Toolkit from './toolkit';

function Workspace() {
	const {
		state: { name, workspaceId },
	} = useLocation();

	return (
		<>
			<Toolkit />
		</>
	);
}

export default Workspace;
