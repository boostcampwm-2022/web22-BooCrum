import ContextMenu from '@components/context-menu';
import useContextMenu from '@hooks/useContextMenu';
import { useLocation } from 'react-router-dom';
import WhiteboardCanvas from './whiteboard-canvas';
import Layout from './layout';
import ObjectEditMenu from './objectEditMenu';

function Workspace() {
	const {
		state: { name, workspaceId },
	} = useLocation();
	const { isOpen, menuRef, toggleOpen, menuPosition } = useContextMenu(); // whiteboard로 빼기

	const openContextMenu: React.MouseEventHandler<HTMLDivElement> = (e) => {
		e.preventDefault();
		toggleOpen(e.clientX, e.clientY);
	};

	return (
		<>
			<Layout name={name} />
			<WhiteboardCanvas></WhiteboardCanvas>

			<div style={{ width: '100vw', height: '100vh' }} onClick={openContextMenu}></div>

			<ContextMenu isOpen={isOpen} menuRef={menuRef} posX={menuPosition.x} posY={menuPosition.y}>
				<ObjectEditMenu selectedObject="section" />
			</ContextMenu>
		</>
	);
}

export default Workspace;
