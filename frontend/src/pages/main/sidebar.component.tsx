import React from 'react';
import { Container, Logo, SidebarItem } from './sidebar.style';

function Sidebar() {
	return (
		<Container>
			<Logo>BooCrum</Logo>
			<div className="sidebar-list">
				<SidebarItem>recents</SidebarItem>
				<SidebarItem>workspace</SidebarItem>
			</div>
		</Container>
	);
}

export default Sidebar;
