import useContextMenu from '@hooks/useContextMenu';
import ContextMenu from '../../components/context-menu';
import { CardLayout } from './workspace-card.style';
import WorkspaceMenu from './worksapce-menu.component';
import { WorkspaceCardProps } from './workspace-card.types';

function WorkspaceCard({ title, timestamp, imgSrc }: WorkspaceCardProps) {
	const { isOpen, menuRef, toggleOpen } = useContextMenu();

	return (
		<CardLayout
			onContextMenu={(e) => {
				e.preventDefault();
				toggleOpen();
			}}
		>
			<img className="card-thumbnail" src={imgSrc}></img>
			<div className="card-info">
				<div className="card-title">{title}</div>
				<div className="card-timestamp">{timestamp}</div>
			</div>
			<ContextMenu isOpen={isOpen} menuRef={menuRef}>
				<WorkspaceMenu workspaceName={title}></WorkspaceMenu>
			</ContextMenu>
		</CardLayout>
	);
}

export default WorkspaceCard;
