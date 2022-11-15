import React from 'react';
import { useRecoilValue } from 'recoil';
import { workspaceTypeState } from '@context/main-workspace';
import { Wrapper } from './contents.style';
import { sidebarItems } from '@data/workspace-sidebar';

function Contents() {
	const workspaceType = useRecoilValue(workspaceTypeState);

	if (sidebarItems[workspaceType]) {
		return <Wrapper>{sidebarItems[workspaceType].component}</Wrapper>;
	}

	return <Wrapper>error</Wrapper>;
}

export default Contents;
