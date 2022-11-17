import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { workspaceOrderState } from '@context/main-workspace';
import WorkspaceCard from '@pages/main/workspace-card';
import { Title, TitleContainer, WorkspaceListContainer } from './index.style';
import OrderDropdown from '../order-dropdown';

function WorkspaceList({ title, hasOrder }: { title: string; hasOrder: boolean }) {
	const orderType = useRecoilValue(workspaceOrderState);
	const [workspaces, setWorkspaces] = useState<WorkspaceCardType[]>([]);

	useEffect(() => {
		setWorkspaces([
			{ id: 1, title: 'workspace name', timestamp: 'timestamp', imgSrc: '' },
			{ id: 2, title: 'workspace name', timestamp: 'timestamp', imgSrc: '' },
			{ id: 3, title: 'workspace name', timestamp: 'timestamp', imgSrc: '' },
			{ id: 4, title: 'workspace name', timestamp: 'timestamp', imgSrc: '' },
			{ id: 5, title: 'workspace name', timestamp: 'timestamp', imgSrc: '' },
			{ id: 6, title: 'workspace name', timestamp: 'timestamp', imgSrc: '' },
		]);
		// api 패칭할 때 제대로 정렬
	}, []);

	return (
		<>
			<TitleContainer>
				<Title>{title}</Title>
				{hasOrder && <OrderDropdown />}
			</TitleContainer>
			<WorkspaceListContainer>
				{workspaces.map((workspace) => (
					<WorkspaceCard
						key={workspace.id}
						title={workspace.title}
						timestamp={workspace.timestamp}
						imgSrc={workspace.imgSrc}
					/>
				))}
			</WorkspaceListContainer>
		</>
	);
}

export default WorkspaceList;
