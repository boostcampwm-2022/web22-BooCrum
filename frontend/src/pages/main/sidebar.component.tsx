import React from 'react';
import Logo from '@components/logo';
import { Container, SidebarItem } from './sidebar.style';
import { useRecoilState } from 'recoil';
import { workspaceTypeState } from '@context/main-workspace';
import { sidebarItems } from '@data/workspace-sidebar';

function Sidebar() {
	const [workspaceType, setWorkspaceType] = useRecoilState(workspaceTypeState);

	const handleWorkspaceType = (id: string) => {
		setWorkspaceType(id);
	};

	return (
		<Container>
			<Logo />
			<div className="sidebar-list">
				{Object.keys(sidebarItems).map((key) => (
					<SidebarItem
						key={sidebarItems[key].id}
						isSelected={workspaceType === key}
						onClick={() => handleWorkspaceType(key)}
					>
						{sidebarItems[key].title}
					</SidebarItem>
				))}
			</div>
		</Container>
	);
}

export default Sidebar;
