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
			<h1>Workspace</h1>
			<WhiteboardCanvas></WhiteboardCanvas>

			<Header name={name} />
			<Toolkit />
		</>
	);
}

export default Workspace;
