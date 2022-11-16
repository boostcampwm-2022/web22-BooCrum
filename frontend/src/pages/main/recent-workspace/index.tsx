import WorkspaceList from '@pages/main/workspace-list';
import { Title } from './index.style';

function RecentWorkspace() {
	return (
		<>
			<Title>Recent Workspace</Title>
			<WorkspaceList hasOrder={false} />
		</>
	);
}

export default RecentWorkspace;
