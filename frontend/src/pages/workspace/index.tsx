import { useLocation } from 'react-router-dom';
import WhiteboardCanvas from './whiteboard-canvas';

function Workspace() {
	const {
		state: { id, user },
	} = useLocation();

	return (
		<>
			<h1>Workspace</h1>
			<WhiteboardCanvas></WhiteboardCanvas>
		</>
	);
}

export default Workspace;
