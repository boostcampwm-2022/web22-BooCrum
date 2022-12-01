import { useRef } from 'react';
import { Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents, MousePointer } from './types';
import { useEffect } from 'react';
import useEditMenu from './useEditMenu';
import { ObjectType } from '@pages/workspace/whiteboard-canvas/types';
import {
	formatCreatePostitEventToSocket,
	formatEditTextEventToSocket,
	formatMessageToSocketForGroup,
	formatMoveObjectEventToSocket,
	formatScalingObjectEventToSocket,
} from '@utils/socket.utils';
import { Transform } from 'fabric/fabric-impl';
import { formatMessageToSocket } from '../../../utils/socket.utils';

interface UseCanvasToSocketProps {
	canvas: React.MutableRefObject<fabric.Canvas | null>;
	socket: React.MutableRefObject<Socket<ServerToClientEvents, ClientToServerEvents> | null>;
}

function useCanvasToSocket({ canvas, socket }: UseCanvasToSocketProps) {
	const { isOpen, menuRef, openMenu, menuPosition } = useEditMenu(canvas);
	const editedObjectId = useRef<string>('');

	const getObjectIds = (objects: fabric.Object[]) => {
		return objects.map((object) => object.objectId);
	};

	useEffect(() => {
		if (!canvas.current) return;

		canvas.current.on('object:added', (e) => {
			if (!e.target || !canvas.current) return;
			const fabricObject = e.target;
			if (fabricObject.isSocketObject) return;
			if (fabricObject.type === ObjectType.postit) {
				const message = formatCreatePostitEventToSocket(fabricObject as fabric.Group);
				socket.current?.emit('create_object', message);
			}
		});

		canvas.current.on('object:removed', ({ target }) => {
			if (!target) return;

			if (target.isSocketObject) return;
			if (target.type === ObjectType.editable) return;

			socket.current?.emit('delete_object', {
				objectId: target.objectId,
			});
		});

		canvas.current.on('text:changed', ({ target }) => {
			if (!target || target.type !== ObjectType.editable) return;
			const message = formatEditTextEventToSocket(target as fabric.Text);
			socket.current?.emit('update_object', message);
		});

		canvas.current.on('text:editing:entered', ({ target }) => {
			if (!target) return;
			editedObjectId.current = target.objectId;
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

				// deselected.forEach((object) => {
				// 	if (object.type !== ObjectType.editable) {
				// 		const message = formatMessageToSocket(object);
				// 		socket.current?.emit('update_object', message);
				// 	}
				// });
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

		canvas.current.on('object:modified', ({ target }) => {
			if (!target) return;

			if (target.type in ObjectType) {
				const message = formatMessageToSocket(target);
				socket.current?.emit('update_object', message);
				return;
			}

			const groupObject = target as fabric.Group;

			groupObject._objects.forEach((object) => {
				const message = formatMessageToSocketForGroup(groupObject, object);
				socket.current?.emit('update_object', message);
			});
		});

		canvas.current.on('object:moving', ({ target, transform, e }) => {
			if (!target || !transform) return;

			const dx = (e as MouseEvent).x - (transform as Transform).ex;
			const dy = (e as MouseEvent).y - (transform as Transform).ey;

			if (target.type in ObjectType) {
				const message = formatMoveObjectEventToSocket({ object: target, dleft: dx, dtop: dy });
				socket.current?.emit('move_object', message);
				return;
			}

			const groupObject = target as fabric.Group;
			groupObject._objects.forEach((object) => {
				const message = formatMoveObjectEventToSocket({ object, dleft: dx, dtop: dy });
				socket.current?.emit('move_object', message);
			});
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

		canvas.current.on('object:scaling', ({ target }) => {
			if (!target) return;

			if (target.type in ObjectType) {
				const message = formatScalingObjectEventToSocket(target);
				socket.current?.emit('scale_object', message);
				return;
			}

			const groupObject = target as fabric.Group;
			const groupScaleX = groupObject.scaleX || 1;
			const groupScaleY = groupObject.scaleY || 1;

			// groupObject._objects.forEach((object) => {
			// 	const message = formatScalingObjectEventToSocket({
			// 		object: object,
			// 		dleft: dx,
			// 		dtop: dy,
			// 		scaleX: groupScaleX * (object.scaleX || 1),
			// 		scaleY: groupScaleY * (object.scaleY || 1),
			// 	});
			// 	socket.current?.emit('scale_object', message);
			// });
		});
	}, []);

	return {
		isOpen,
		menuRef,
		menuPosition,
	};
}

export default useCanvasToSocket;
