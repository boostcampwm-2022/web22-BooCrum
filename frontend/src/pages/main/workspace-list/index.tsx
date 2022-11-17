import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import axios from 'axios';
import { workspaceOrderState } from '@context/main-workspace';
import WorkspaceCard from '@pages/main/workspace-card';
import { Title, TitleContainer, WorkspaceListContainer } from './index.style';
import OrderDropdown from '@pages/main/order-dropdown';
import { compareStringByMillisecond, setTimestamp } from 'utils';
import { WorkspaceCardType } from './index.type';

async function fetchWorkspaceList(): Promise<WorkspaceCardType[]> {
	const result = await axios.get('https://7f09d24e-a8d4-4e68-a7c5-ec8c6da7ef40.mock.pstmn.io/user/info/workspace');
	return result.data;
}

function WorkspaceList({ title, hasOrder }: { title: string; hasOrder: boolean }) {
	const orderType = useRecoilValue(workspaceOrderState);
	const [workspaces, setWorkspaces] = useState<WorkspaceCardType[]>([]);

	useEffect(() => {
		async function setWorkspaceList() {
			const result = await fetchWorkspaceList();
			const sortedWorkspace = sortWorkspace(result);

			setWorkspaces(sortedWorkspace);
		}
		setWorkspaceList();
	}, []);
	useEffect(() => {
		const sortedWorkspace = sortWorkspace(workspaces.slice(0));

		setWorkspaces(sortedWorkspace);
	}, [orderType]);

	function sortWorkspace(workspaceList: WorkspaceCardType[]): WorkspaceCardType[] {
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

	console.log(workspaces);

	return (
		<>
			<TitleContainer>
				<Title>{title}</Title>
				{hasOrder && <OrderDropdown />}
			</TitleContainer>
			<WorkspaceListContainer>
				{workspaces.map((item) => (
					<WorkspaceCard
						key={item.workspace.workspaceId}
						title={item.workspace.name}
						timestamp={setTimestamp(item.workspace.updateDate)}
						imgSrc={''}
					/>
				))}
			</WorkspaceListContainer>
		</>
	);
}

export default WorkspaceList;
