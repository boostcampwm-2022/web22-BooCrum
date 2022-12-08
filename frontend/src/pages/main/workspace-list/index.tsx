import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { workspaceOrderState } from '@context/main-workspace';
import WorkspaceCard from '@pages/main/workspace-card';
import OrderDropdown from '@pages/main/order-dropdown';
import { Title, TitleContainer, WorkspaceListContainer } from './index.style';
import { compareStringByMillisecond, setTimestamp } from '@utils/convert-time.utils';
import { WorkspaceCardType } from './index.type';
import { User } from '@api/user';

function WorkspaceList({ title, hasOrder }: { title: string; hasOrder: boolean }) {
	const orderType = useRecoilValue(workspaceOrderState);
	const [workspaces, setWorkspaces] = useState<WorkspaceCardType[]>([]);

	async function setWorkspaceList() {
		const result = await User.getWorkspace();
		const sortedWorkspace = sortWorkspace(result);
		setWorkspaces(sortedWorkspace);
	}
	useEffect(() => {
		setWorkspaceList();
	}, []);
	useEffect(() => {
		const sortedWorkspace = sortWorkspace(workspaces.slice(0));

		setWorkspaces(sortedWorkspace);
	}, [orderType]);

	function sortWorkspace(workspaceList: WorkspaceCardType[]): WorkspaceCardType[] {
		if (!hasOrder) {
			return workspaceList.sort((a, b) => {
				return compareStringByMillisecond(a.workspace.updateDate, b.workspace.updateDate);
			});
		}
		return workspaceList.sort((a, b) => {
			if (orderType === 0) return compareStringByMillisecond(a.workspace.updateDate, b.workspace.updateDate);
			else if (orderType === 1) return compareStringByMillisecond(a.workspace.registerDate, b.workspace.registerDate);
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
				{workspaces.map((item) => (
					<WorkspaceCard
						key={item.workspace.workspaceId}
						workspaceId={item.workspace.workspaceId}
						role={item.role}
						title={item.workspace.name}
						timestamp={setTimestamp(item.workspace.updateDate)}
						imgSrc={item.workspace.thumbnailUrl}
						setWorkspaceList={setWorkspaceList}
					/>
				))}
			</WorkspaceListContainer>
		</>
	);
}

export default WorkspaceList;
