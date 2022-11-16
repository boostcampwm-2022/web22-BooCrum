import React from 'react';
import Logo from '@components/logo';
import { Container, SidebarItem } from './sidebar.style';

function Sidebar() {
	return (
		<Container>
			<Logo />
			<div className="sidebar-list">
				<SidebarItem>recents</SidebarItem>
				<SidebarItem>workspace</SidebarItem>
			</div>
		</Container>
	);
}

export default Sidebar;
