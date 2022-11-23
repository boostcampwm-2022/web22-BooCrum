import { useLocation } from 'react-router-dom';
import Layout from './layout';
import WhiteboardCanvas from './whiteboard-canvas';

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
