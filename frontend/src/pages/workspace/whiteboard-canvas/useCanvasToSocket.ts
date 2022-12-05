import { Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents, MousePointer } from './types';
import { useEffect } from 'react';
import useEditMenu from './useEditMenu';
import { ObjectType, SocketObjectType } from '@pages/workspace/whiteboard-canvas/types';
import {
	formatObjectDataToServer,
	formatEditTextEventToSocket,
	formatMessageToSocketForGroup,
	formatMoveObjectEventToSocket,
	formatScaleObjectEventToSocket,
	formatScaleObjectEventToSocketForGroup,
	formatMoveObjectEventToSocketForGroup,
	formatSelectEventToSocket,
} from '@utils/object-to-server';
import { fabric } from 'fabric';
import { isNull, isUndefined } from '@utils/type.utils';

interface UseCanvasToSocketProps {
	canvas: React.MutableRefObject<fabric.Canvas | null>;
	socket: React.MutableRefObject<Socket<ServerToClientEvents, ClientToServerEvents> | null>;
}

function useCanvasToSocket({ canvas, socket }: UseCanvasToSocketProps) {
	const { isOpen, menuRef, openMenu, menuPosition } = useEditMenu(canvas);

	useEffect(() => {
		if (isNull(canvas.current)) return;

		canvas.current.on('object:added', ({ target: fabricObject }) => {
			if (isUndefined(fabricObject) || fabricObject.isSocketObject) return;

			if (fabricObject.type === ObjectType.postit) {
				const message = formatObjectDataToServer(fabricObject as fabric.Group, fabricObject.type);
				socket.current?.emit('create_object', message);
			}
		});

		canvas.current.on('object:modified', ({ target: fabricObject }) => {
			if (isUndefined(fabricObject)) return;

			if (fabricObject.type in SocketObjectType) {
				const message = formatObjectDataToServer(fabricObject as fabric.Group, fabricObject.type as SocketObjectType);
				socket.current?.emit('update_object', message);
				return;
			}

			if (!(fabricObject instanceof fabric.Group)) return;

			fabricObject._objects.forEach((object) => {
				if (object.type in SocketObjectType) {
					const message = formatMessageToSocketForGroup(fabricObject, object as fabric.Group);
					socket.current?.emit('update_object', message);
				}
			});
		});

		canvas.current.on('object:removed', ({ target: fabricObject }) => {
			if (isUndefined(fabricObject) || fabricObject.isSocketObject) return;

			if (fabricObject.type === ObjectType.editable) return;

			socket.current?.emit('delete_object', {
				objectId: fabricObject.objectId,
			});
		});

		canvas.current.on('object:moving', ({ target: fabricObject }) => {
			if (isUndefined(fabricObject)) return;

			if (fabricObject.type in SocketObjectType) {
				const message = formatMoveObjectEventToSocket(fabricObject as fabric.Group);
				socket.current?.emit('move_object', message);
				return;
			}

			if (!(fabricObject instanceof fabric.Group)) return;

			fabricObject._objects.forEach((object) => {
				if (object.type in SocketObjectType) {
					const message = formatMoveObjectEventToSocketForGroup(fabricObject, object as fabric.Group);
					socket.current?.emit('move_object', message);
				}
			});
		});

		canvas.current.on('object:scaling', ({ target: fabricObject }) => {
			if (isUndefined(fabricObject)) return;

			if (fabricObject.type in ObjectType) {
				const message = formatScaleObjectEventToSocket(fabricObject as fabric.Group);
				socket.current?.emit('scale_object', message);
				return;
			}

			if (!(fabricObject instanceof fabric.Group)) return;

			fabricObject._objects.forEach((object) => {
				if (object.type in SocketObjectType) {
					const message = formatScaleObjectEventToSocketForGroup(fabricObject, object as fabric.Group);
					socket.current?.emit('scale_object', message);
				}
			});
		});

		canvas.current.on('text:changed', ({ target: fabricObject }) => {
			if (isUndefined(fabricObject) || fabricObject.type !== ObjectType.editable) return;
			const message = formatEditTextEventToSocket(fabricObject as fabric.Text);
			socket.current?.emit('update_object', message);
		});

		canvas.current.on('selection:created', ({ selected }) => {
			if (isUndefined(selected) || selected.length === 0) return;

			const messege = formatSelectEventToSocket(selected);
			socket.current?.emit('select_object', messege);

			openMenu();
		});

		canvas.current.on('selection:updated', ({ selected, deselected }) => {
			if (!isUndefined(deselected) && deselected.length !== 0) {
				const message = formatSelectEventToSocket(deselected);
				socket.current?.emit('unselect_object', message);
			}

			if (!isUndefined(selected) && selected.length !== 0) {
				const message = formatSelectEventToSocket(selected);
				socket.current?.emit('select_object', message);
			}

			openMenu();
		});

		canvas.current.on('selection:cleared', ({ deselected }) => {
			if (isUndefined(deselected) || deselected.length === 0) return;
			const message = formatSelectEventToSocket(deselected);
			socket.current?.emit('unselect_object', message);
		});

		canvas.current.on('mouse:move', ({ e }) => {
			if (isNull(canvas.current)) return;
			const vpt = canvas.current.viewportTransform;
			if (isUndefined(vpt)) return;
			const zoom = canvas.current.getZoom();
			const x = (e.offsetX - vpt[4]) / zoom;
			const y = (e.offsetY - vpt[5]) / zoom;
			const message: MousePointer = {
				x,
				y,
			};
			socket.current?.emit('move_pointer', message);
		});
	}, []);

	return {
		isOpen,
		menuRef,
		menuPosition,
	};
}

export default useCanvasToSocket;
