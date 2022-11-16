import { useRecoilValue } from 'recoil';
import { workspaceTypeState } from '@context/main-workspace';
import { Wrapper } from './index.style';
import { sidebarItems } from '@data/workspace-sidebar';
import Error from '@pages/error';

function Contents() {
	const workspaceType = useRecoilValue(workspaceTypeState);

	if (sidebarItems[workspaceType]) {
		return <Wrapper>{sidebarItems[workspaceType].component}</Wrapper>;
	}

	return <Error />;
}

export default Contents;
