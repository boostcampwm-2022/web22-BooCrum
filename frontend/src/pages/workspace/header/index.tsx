import { useState, useEffect } from 'react';
import LeftSide from '../left-side';
import RightSide from '../right-side';
import { Container } from './index.style';
import { Workspace } from '@api/workspace';
import { HeaderProps } from './index.type';

function Header({ workspaceId, openShareModal }: HeaderProps) {
	const [workspace, setWorkspaceName] = useState<string>('');

	useEffect(() => {
		async function getMetaData() {
			const { name } = await Workspace.getWorkspaceMetadata(workspaceId);
			setWorkspaceName(name);
		}
		getMetaData();
	}, []);

	return (
		<Container>
			<LeftSide />
			<p className="title">{workspace}</p>
			<RightSide openShareModal={openShareModal} />
		</Container>
	);
}

export default Header;
