export interface Member {
	userId: string;
	nickname: string;
	color: string;
	role: Role;
}

// 0: Viewer(단순히 보기만 함) / 1: Editor(편집 및 읽기 가능) / 2: Owner(Workspace 소유자, 워크스페이스 삭제 가능)
type Role = 0 | 1 | 2;

export interface MousePointer {
	x: number;
	y: number;
}

export interface UserMousePointer extends MousePointer {
	userId: string;
}

export interface MemberInCanvas {
	userId: string;
	color: string;
	cursorObject: fabric.Path;
}
