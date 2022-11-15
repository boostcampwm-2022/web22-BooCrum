import WorkspaceCard from './workspace-card.component';
import { WorkspaceListContainer } from './workspace-list.style';

function WorkspaceList({ title }: { title: string }) {
	return (
		<>
			<h1>{title}</h1>
			<WorkspaceListContainer>
				<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
				<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
				<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
				<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
				<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
				<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
				<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
			</WorkspaceListContainer>
		</>
	);
}

export default WorkspaceList;
