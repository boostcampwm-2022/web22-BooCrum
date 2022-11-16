import { WorkspaceMenuItem, WorkspaceMenuList } from './worksapce-menu.style';

function WorksapceMenu() {
	return (
		<WorkspaceMenuList>
			<WorkspaceMenuItem>Open</WorkspaceMenuItem>
			<WorkspaceMenuItem>Rename</WorkspaceMenuItem>
			<WorkspaceMenuItem>Delete</WorkspaceMenuItem>
		</WorkspaceMenuList>
	);
}

export default WorksapceMenu;
