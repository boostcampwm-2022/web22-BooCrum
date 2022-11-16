import { DeleteModalState, RenameModalState } from '@context/atoms';
import { useRecoilState } from 'recoil';
import DeleteModal from './delete-modal.component';
import Header from './header.component';
import { Wrapper } from './index.style';
import RenameModal from './rename-modal.component';
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
