import { useLocation } from 'react-router-dom';
import Layout from './layout';

function Workspace() {
	const {
		state: { name, workspaceId },
	} = useLocation();

	return (
		<>
			<Layout name={name} />
		</>
	);
}

export default Workspace;
