import WorkspaceList from '@pages/main/workspace-list';
import WorkspaceTemplates from '@pages/main/workspace-template-list';
import OrderDropdown from '@pages/main/order-dropdown';
import { Container, Title } from './index.style';

function AllWorkspace() {
	return (
		<div>
			<WorkspaceTemplates />
			<Container>
				<Title>All workspace</Title>
				<OrderDropdown />
			</Container>
			<WorkspaceList hasOrder />
		</div>
	);
}

export default AllWorkspace;
