import { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { workspaceOrderState } from '@context/main-workspace';
import WorkspaceCard from '@pages/main/workspace-card';
import OrderDropdown from '@pages/main/order-dropdown';
import { Title, TitleContainer, WorkspaceListContainer } from './index.style';
import { setTimestamp } from '@utils/convert-time.utils';
import { WorkspaceCardType } from './index.type';
import { User } from '@api/user';
import { orderItemString } from '@data/workspace-order';
import Loading from '@components/loading';

function WorkspaceList({ title, hasOrder }: { title: string; hasOrder: boolean }) {
	const orderType = useRecoilValue(workspaceOrderState);
	const [workspaces, setWorkspaces] = useState<WorkspaceCardType[]>([]);
	const [loading, setLoading] = useState(true);
	const page = useRef<number>(1);
	const hasNextPage = useRef<boolean>(true);
	const observerTargetRef = useRef<HTMLDivElement>(null);

	async function initWorkspaceList() {
		page.current = 1;
		const result = await User.getFilteredWorkspace(orderItemString[hasOrder ? orderType : 0], page.current);
		setWorkspaces(result);

		page.current += 1;
		hasNextPage.current = result.length !== 0;
		setLoading(false);
	}

	async function setWorkspaceList() {
		const result = await User.getFilteredWorkspace(orderItemString[hasOrder ? orderType : 0], page.current);
		setWorkspaces((prevWorkspace) => [...prevWorkspace, ...result]);

		page.current += 1;
		hasNextPage.current = result.length !== 0;
	}

	useEffect(() => {
		if (!observerTargetRef.current || loading) return;

		const io = new IntersectionObserver((entries) => {
			if (observerTargetRef.current && !hasNextPage.current) io.unobserve(observerTargetRef.current);
			if (entries[0].isIntersecting && hasNextPage.current) {
				setWorkspaceList();
			}
		});
		io.observe(observerTargetRef.current);

		return () => {
			io.disconnect();
		};
	}, [loading, orderType]);
	useEffect(() => {
		initWorkspaceList();
	}, [orderType]);

	return (
		<>
			<TitleContainer>
				<Title>{title}</Title>
				{hasOrder && <OrderDropdown />}
			</TitleContainer>
			{loading ? (
				<Loading />
			) : (
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
					<div ref={observerTargetRef} />
				</WorkspaceListContainer>
			)}
		</>
	);
}

export default WorkspaceList;
