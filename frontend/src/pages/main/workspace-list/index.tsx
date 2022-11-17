import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { workspaceOrderState } from '@context/main-workspace';
import WorkspaceCard from '@pages/main/workspace-card';
import { Title, TitleContainer, WorkspaceListContainer } from './index.style';
import OrderDropdown from '../order-dropdown';

interface _WorkspaceCardType {
	role: number;
	workspace: {
		workspaceId: string;
		description: null;
		name: string;
		registerDate: string;
		updateDate: string;
	};
}

function compareStringByMillisecond(a: string, b: string) {
	return new Date(b).getTime() - new Date(a).getTime();
}

function WorkspaceList({ title, hasOrder }: { title: string; hasOrder: boolean }) {
	const orderType = useRecoilValue(workspaceOrderState);
	const [workspaces, setWorkspaces] = useState<WorkspaceCardType[]>([]);

	useEffect(() => {
		async function getWorkspaceList() {
			const result = [
				{
					role: 2,
					workspace: {
						workspaceId: 'be326369-8128-475c-9269-a8b4b3f5fe52',
						description: null,
						name: 'workspace1',
						registerDate: '2022-11-15T16:26:22.000Z',
						updateDate: '2022-11-15T16:26:20.000Z',
					},
				},
				{
					role: 0,
					workspace: {
						workspaceId: '802d2d0a-52ad-4f70-fb7e-d6a89eaaaf3e',
						description: null,
						name: 'workspace2',
						registerDate: '2022-11-15T18:26:22.000Z',
						updateDate: '2022-11-15T18:26:20.000Z',
					},
				},
				{
					role: 1,
					workspace: {
						workspaceId: '65e107eb-e881-4e9c-c7f9-ca57b44b2b33',
						description: null,
						name: 'workspace3',
						registerDate: '2022-11-15T20:26:22.000Z',
						updateDate: '2022-11-15T20:26:20.000Z',
					},
				},
			];

			const sortedWorkspace = sortWorkspace(result); // workspaces로 초기화
			console.log('first render', sortedWorkspace);

			setWorkspaces([
				{ id: 1, title: 'workspace name', timestamp: 'timestamp', imgSrc: '' },
				{ id: 2, title: 'workspace name', timestamp: 'timestamp', imgSrc: '' },
				{ id: 3, title: 'workspace name', timestamp: 'timestamp', imgSrc: '' },
				{ id: 4, title: 'workspace name', timestamp: 'timestamp', imgSrc: '' },
				{ id: 5, title: 'workspace name', timestamp: 'timestamp', imgSrc: '' },
				{ id: 6, title: 'workspace name', timestamp: 'timestamp', imgSrc: '' },
			]);
		}
		getWorkspaceList();
	}, []);
	useEffect(() => {
		if (workspaces.length !== 0) {
			const sortedWorkspace = sortWorkspace([]); // workspaces로 비교
			console.log('order change: ', sortedWorkspace);

			setWorkspaces([
				{ id: 1, title: 'workspace name', timestamp: 'timestamp', imgSrc: '' },
				{ id: 2, title: 'workspace name', timestamp: 'timestamp', imgSrc: '' },
				{ id: 3, title: 'workspace name', timestamp: 'timestamp', imgSrc: '' },
				{ id: 4, title: 'workspace name', timestamp: 'timestamp', imgSrc: '' },
				{ id: 5, title: 'workspace name', timestamp: 'timestamp', imgSrc: '' },
				{ id: 6, title: 'workspace name', timestamp: 'timestamp', imgSrc: '' },
			]);
		}
	}, [orderType]);

	function sortWorkspace(workspaceList: _WorkspaceCardType[]) {
		if (!hasOrder) {
			return workspaceList.sort((a, b) => {
				return compareStringByMillisecond(a.workspace.registerDate, b.workspace.registerDate);
			});
		}
		return workspaceList.sort((a, b) => {
			if (orderType === 1) return compareStringByMillisecond(a.workspace.updateDate, b.workspace.updateDate);
			else if (orderType === 2) return compareStringByMillisecond(a.workspace.registerDate, b.workspace.registerDate);
			else return a.workspace.name < b.workspace.name ? -1 : 1;
		});
	}

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
