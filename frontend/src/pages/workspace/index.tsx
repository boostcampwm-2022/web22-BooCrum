import { useParams, Navigate } from 'react-router-dom';
import WhiteboardCanvas from './whiteboard-canvas';
import Header from './header';
import Toolkit from './toolkit';

function Workspace() {
	const { workspaceId } = useParams();

	if (workspaceId === undefined) {
		return <Navigate to="/" />;
	}

	return (
		<>
			<Header workspaceId={workspaceId} />
			<Toolkit />
			<WhiteboardCanvas></WhiteboardCanvas>
		</>
	);
}

export default Workspace;
