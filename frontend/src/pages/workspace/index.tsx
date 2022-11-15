import React from 'react';
import { useLocation } from 'react-router-dom';

function Workspace() {
	const {
		state: { id, user },
	} = useLocation();

	return <div>workspace</div>;
}

export default Workspace;
