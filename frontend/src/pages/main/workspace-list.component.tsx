import WorkspaceCard from './workspace-card.component';
import { WorkspaceListContainer } from './workspace-list.style';

function WorkspaceList({ title }: { title: string }) {
	return (
		<>
			<WorkspaceListContainer>
				<h1>{title}</h1>
				<div className="card-list">
					<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
					<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
					<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
					<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
					<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
					<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
					<WorkspaceCard title="workspace name" timestamp="timestamp" imgSrc=""></WorkspaceCard>
				</div>
			</WorkspaceListContainer>
		</>
	);
}

export default WorkspaceList;
