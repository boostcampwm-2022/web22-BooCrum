import { useParams, Navigate } from 'react-router-dom';
import WhiteboardCanvas from './whiteboard-canvas';
import Header from './header';
import Toolkit from './toolkit';
import { useEffect } from 'react';
import Loading from '@components/loading';
import useAuth from '@hooks/useAuth';
import Layout from './layout';

function Workspace() {
	const { isLoading, authenticate } = useAuth();
	const { workspaceId } = useParams();

	useEffect(() => {
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
