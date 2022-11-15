import React from 'react';
import Header from './header.component';
import { Section, Wrapper } from './index.style';
import Sidebar from './sidebar.component';
import WorkspaceTemplates from './workspace-templates.component';

function Main() {
	return (
		<Wrapper>
			<Sidebar />
			<Section>
				<Header />
				<WorkspaceTemplates />
			</Section>
		</Wrapper>
	);
}

export default Main;
