import ContextMenu from '@components/context-menu';
import useContextMenu from '@hooks/useContextMenu';
import WorkspaceMenu from '../workspace-menu';
import { CardLayout } from './index.style';
import { WorkspaceCardProps } from './index.type';

function WorkspaceCard({ workspaceId, role, title, timestamp, imgSrc }: WorkspaceCardProps) {
	const { isOpen, menuRef, toggleOpen, menuPosition } = useContextMenu();
	const openContextMenu: React.MouseEventHandler<HTMLDivElement> = (e) => {
		e.preventDefault();
		toggleOpen(e.clientX, e.clientY);
		console.log(menuPosition);
	};
	return (
		<>
			<CardLayout onContextMenu={openContextMenu}>
				<img className="card-thumbnail" src={imgSrc}></img>
				<div className="card-info">
					<div className="card-title">{title}</div>
					<div className="card-timestamp">{timestamp}</div>
				</div>
			</CardLayout>
			<ContextMenu isOpen={isOpen} menuRef={menuRef} posX={menuPosition.x} posY={menuPosition.y}>
				<WorkspaceMenu workspaceId={workspaceId} role={role} workspaceName={title}></WorkspaceMenu>
			</ContextMenu>
		</>
	);
}

export default WorkspaceCard;
