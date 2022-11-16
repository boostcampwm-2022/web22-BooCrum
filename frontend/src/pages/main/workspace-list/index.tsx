import WorkspaceCard from '@pages/main/workspace-card';
import { Title, WorkspaceListContainer } from './index.style';

function WorkspaceList({ title }: { title: string }) {
	return (
		<div>
			<Title>{title}</Title>
			<WorkspaceListContainer>
				<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
				<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
				<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
				<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
				<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
				<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
				<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
			</WorkspaceListContainer>
		</div>
	);
}

export default WorkspaceList;
