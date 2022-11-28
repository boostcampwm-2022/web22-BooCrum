import { useLocation } from 'react-router-dom';
import WhiteboardCanvas from './whiteboard-canvas';
import Header from './header';
import Toolkit from './toolkit';

function Workspace() {
	const {
		state: { name, workspaceId },
	} = useLocation();

	return (
		<>
			<Header name={name} workspaceId={workspaceId} />
			<Toolkit />
			<WhiteboardCanvas></WhiteboardCanvas>
		</>
	);
}

export default Workspace;
