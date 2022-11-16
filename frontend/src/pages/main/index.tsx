import Header from './header.component';
import { Wrapper } from './index.style';
import Sidebar from './sidebar.component';
import WorkspaceList from './workspace-list.component';
import WorkspaceTemplates from './workspace-templates.component';

function Main() {
	return (
		<Wrapper>
			<Sidebar />
			<div className="workspace-container">
				<Header />
				<WorkspaceTemplates />
				<WorkspaceList title={'Title'}></WorkspaceList>
			</div>
		</Wrapper>
	);
}

export default Main;
