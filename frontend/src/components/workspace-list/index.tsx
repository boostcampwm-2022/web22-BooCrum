import React from 'react';
import { Title } from './index.style';

function WorkspaceList({ title }: { title: string }) {
	return (
		<div>
			<Title>{title}</Title>
			workspace list
		</div>
	);
}

export default WorkspaceList;
