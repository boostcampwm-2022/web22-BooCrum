import { useParams, Navigate } from 'react-router-dom';
import WhiteboardCanvas from './whiteboard-canvas';
import { useEffect } from 'react';
import Loading from '@components/loading';
import useAuth from '@hooks/useAuth';
import Layout from './layout';
import { useRecoilState } from 'recoil';
import { workspaceIdState } from '@context/workspace';

function Workspace() {
	const { isLoading, authenticate } = useAuth();
	const { workspaceId } = useParams();
	const [wid, setSid] = useRecoilState(workspaceIdState);

	useEffect(() => {
		setSid(workspaceId || '');
		authenticate();
	}, []);

	if (isLoading) {
		return <Loading />;
	}

	if (workspaceId === undefined) {
		return <Navigate to="/" />;
	}

	return (
		<>
			<Layout workspaceId={workspaceId} />
			<WhiteboardCanvas></WhiteboardCanvas>
		</>
	);
}

export default Workspace;
