import { useLocation } from 'react-router-dom';
import WhiteboardCanvas from './whiteboard-canvas';
import Layout from './layout';

function Workspace() {
	const {
		state: { name, workspaceId },
	} = useLocation();

	return (
		<>
			<Layout name={name} />
			<h1>Workspace</h1>
			<WhiteboardCanvas></WhiteboardCanvas>
		</>
	);
}

export default Workspace;
