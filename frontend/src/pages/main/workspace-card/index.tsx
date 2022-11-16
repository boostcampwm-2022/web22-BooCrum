import { CardLayout } from './index.style';

function WorkspaceCard({ title, timestamp, imgSrc }: Omit<WorkspaceCardType, 'id'>) {
	return (
		<CardLayout>
			<img className="card-thumbnail" src={imgSrc}></img>
			<div className="card-info">
				<div className="card-title">{title}</div>
				<div className="card-timestamp">{timestamp}</div>
			</div>
		</CardLayout>
	);
}

export default WorkspaceCard;
