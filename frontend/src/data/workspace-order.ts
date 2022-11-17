interface WorkspaceOrderType {
	id: number;
	description: string;
}

export const orderItems: WorkspaceOrderType[] = [
	{ id: 0, description: 'Last opened' },
	{ id: 1, description: 'Last updated' },
	{ id: 2, description: 'Last created' },
	{ id: 3, description: 'Alphabetically' },
];
