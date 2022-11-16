import WorkspaceCard from '@pages/main/workspace-card';
import { WorkspaceListContainer } from './index.style';

function WorkspaceList() {
	return (
		<WorkspaceListContainer>
			<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
			<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
			<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
			<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
			<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
			<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
			<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
		</WorkspaceListContainer>
	);
}

export default WorkspaceList;
