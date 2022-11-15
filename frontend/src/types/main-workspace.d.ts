interface TemplateType {
	id: number;
	title: string;
	preview: string;
}

interface SidebarItemType {
	[index: string]: {
		id: number;
		title: string;
		component: React.ReactElement;
	};
}
