import RecentWorkspace from '@pages/main/recent-workspace';
import AllWorkspace from '@pages/main/all-workspace';

export const sidebarItems: SidebarItemType = {
	recent: { id: 1, title: 'recents', component: <RecentWorkspace /> },
	workspace: { id: 2, title: 'workspace', component: <AllWorkspace /> },
};
