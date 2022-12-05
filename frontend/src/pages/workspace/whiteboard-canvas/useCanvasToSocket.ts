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
	formatScalingObjectEventToSocket,
	formatScalingObjectEventToSocketForGroup,
	formatMoveObjectEventToSocketForGroup,
} from '@utils/object-to-server';
import { fabric } from 'fabric';
import { isNull, isNullOrUndefined, isUndefined } from '@utils/type.utils';

interface UseCanvasToSocketProps {
	canvas: React.MutableRefObject<fabric.Canvas | null>;
	socket: React.MutableRefObject<Socket<ServerToClientEvents, ClientToServerEvents> | null>;
}

function useCanvasToSocket({ canvas, socket }: UseCanvasToSocketProps) {
	const { isOpen, menuRef, openMenu, menuPosition } = useEditMenu(canvas);

	const getObjectIds = (objects: fabric.Object[]) => {
		return objects.map((object) => object.objectId);
	};

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

		canvas.current.on('object:moving', ({ target: fabricObject, transform, e }) => {
			if (!fabricObject || !transform) return;

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

		canvas.current.on('object:scaling', ({ target }) => {
			if (!target) return;

			if (target.type in ObjectType) {
				const message = formatScalingObjectEventToSocket(target);
				socket.current?.emit('scale_object', message);
				return;
			}

			if (!(target instanceof fabric.Group)) return;

			target._objects.forEach((object) => {
				const message = formatScalingObjectEventToSocketForGroup(target, object);
				if (message) {
					socket.current?.emit('scale_object', message);
				}
			});
		});

		canvas.current.on('text:changed', ({ target }) => {
			if (!target || target.type !== ObjectType.editable) return;
			const message = formatEditTextEventToSocket(target as fabric.Text);
			socket.current?.emit('update_object', message);
		});

		canvas.current.on('selection:created', ({ selected }) => {
			if (!selected || selected.length === 0) return;

			const messege = {
				objectIds: getObjectIds(selected),
			};
			socket.current?.emit('select_object', messege);

			openMenu();
		});

		canvas.current.on('selection:updated', ({ selected, deselected }) => {
			if (!selected || !deselected) return;

			if (deselected.length !== 0) {
				socket.current?.emit('unselect_object', {
					objectIds: getObjectIds(deselected),
				});
			}

			if (selected.length !== 0) {
				socket.current?.emit('select_object', {
					objectIds: getObjectIds(selected),
				});
			}

			openMenu();
		});

		canvas.current.on('selection:cleared', ({ deselected }) => {
			if (!deselected) return;
			if (deselected.length !== 0) {
				socket.current?.emit('unselect_object', {
					objectIds: getObjectIds(deselected),
				});
			}
		});

		canvas.current.on('mouse:move', (e) => {
			if (!e.pointer) return;
			if (!canvas.current) return;
			const vpt = canvas.current?.viewportTransform;
			if (!vpt) return;
			const zoom = canvas.current.getZoom();
			const x = (e.e.offsetX - vpt[4]) / zoom;
			const y = (e.e.offsetY - vpt[5]) / zoom;
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
