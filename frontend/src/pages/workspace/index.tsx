import { useLocation } from 'react-router-dom';
import WhiteboardCanvas from './whiteboard-canvas';
import Toolkit from './toolkit';

function Workspace() {
	const {
		state: { name, workspaceId },
	} = useLocation();

	return (
		<>
			<h1>Workspace</h1>
			<WhiteboardCanvas></WhiteboardCanvas>
			<Toolkit />
		</>
	);
}

export default Workspace;
