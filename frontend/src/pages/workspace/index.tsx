import { useParams } from 'react-router-dom';
import WhiteboardCanvas from './whiteboard-canvas';
import Layout from './layout';

function Workspace() {
	const { workspaceId } = useParams();

	console.log(workspaceId);
	//name은?

	return (
		<>
			<Layout name={'unde'} />
			<WhiteboardCanvas></WhiteboardCanvas>
		</>
	);
}

export default Workspace;
