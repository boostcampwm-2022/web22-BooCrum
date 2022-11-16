import useContextMenu from '@hooks/useContextMenu';
import ContextMenu from '../../components/context-menu';
import { CardLayout } from './worksapce-card.style';
import WorksapceMenu from './worksapce-menu.component';

function WorkspaceCard({ title, timestamp, imgSrc }: { title: string; timestamp: string; imgSrc: string }) {
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
				<WorksapceMenu></WorksapceMenu>
			</ContextMenu>
		</CardLayout>
	);
}

export default WorkspaceCard;
