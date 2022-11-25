interface Member {
	userId: string;
	nickname: string;
	color: string;
}

interface MousePointer {
	x: number;
	y: number;
}

interface UserMousePointer extends MousePointer {
	userId: string;
}

interface MemberInCanvas {
	userId: string;
	color: string;
	pointer?: MousePointer;
	selectedObjectId?: string;
}
