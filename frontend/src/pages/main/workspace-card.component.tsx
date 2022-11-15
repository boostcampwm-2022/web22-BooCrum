import { useState } from 'react';
import ContextMenu from '../../components/context-menu';
import { CardLayout } from './worksapce-card.style';

function WorkspaceCard({ title, timestamp, imgSrc }: { title: string; timestamp: string; imgSrc: string }) {
	const [isOpenMenu, setOpenMenu] = useState(false);

	return (
		<>
			<CardLayout
				onContextMenu={(e) => {
					e.preventDefault();
					setOpenMenu(!isOpenMenu);
				}}
			>
				<img className="card-thumbnail" src={imgSrc}></img>
				<div className="card-info">
					<div className="card-title">{title}</div>
					<div className="card-timestamp">{timestamp}</div>
				</div>
				{isOpenMenu ? <ContextMenu setOpenMenu={setOpenMenu} workspacename={title}></ContextMenu> : <></>}
			</CardLayout>
		</>
	);
}

export default WorkspaceCard;
