import React from 'react';
import Header from './header.component';
import { Wrapper } from './index.style';
import Sidebar from './sidebar.component';
import WorkspaceTemplates from './workspace-templates.component';

function Main() {
	return (
		<Wrapper>
			<Sidebar />
			<div className="workspace-container">
				<Header />
				<WorkspaceTemplates />
			</div>
		</Wrapper>
	);
}

export default Main;
