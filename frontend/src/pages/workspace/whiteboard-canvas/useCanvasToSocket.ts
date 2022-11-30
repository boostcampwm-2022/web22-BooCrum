import { useRef } from 'react';
import { Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents, MousePointer } from './types';
import { useEffect } from 'react';
import useEditMenu from './useEditMenu';
import { ObjectType } from '@pages/workspace/whiteboard-canvas/types';
import {
	formatCreatePostitEventToSocket,
	formatEditTextEventToSocket,
	formatMoveObjectEventToSocket,
	formatScalingObjectEventToSocket,
} from '@utils/socket.utils';

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
			console.log(fabricObject, editedObjectId.current);
			if (fabricObject.objectId === editedObjectId.current) {
				editedObjectId.current = '';
				return;
			}

			if (fabricObject.type === ObjectType.postit) {
				const message = formatCreatePostitEventToSocket(fabricObject as fabric.Group);
				console.log('asd', message);
				socket.current?.emit('create_object', message);
			}
		});

		canvas.current.on('object:removed', ({ target }) => {
			console.log(target);
			if (!target) return;
			// socket.current?.emit('delete_object', {
			// 	objectId: target.objectId,
			// });
		});

		canvas.current.on('text:changed', ({ target }) => {
			if (!target || target.type !== ObjectType.text) return;
			const message = formatEditTextEventToSocket(target as fabric.Text);
			socket.current?.emit('update_object', message);
		});

		canvas.current.on('text:editing:entered', ({ target }) => {
			console.log('enter');
			if (!target) return;
			editedObjectId.current = target.objectId;
		});

		canvas.current.on('selection:created', ({ selected }) => {
			if (!selected || selected.length === 0) return;

			console.log(getObjectIds(selected));
			const messege = {
				objectIds: getObjectIds(selected),
			};
			console.log(messege);
			socket.current?.emit('select_object', messege);

			// selected.forEach((object) => {
			// 	socket.current?.emit('select_object', {
			// 		objectId: object.objectId,
			// 	});
			// });

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

		canvas.current.on('object:moving', (arg) => {
			const { target } = arg;
			console.log(arg);
			if (!target) return;

			if (target.type in ObjectType) {
				const message = formatMoveObjectEventToSocket(target);
				socket.current?.emit('update_object', message);
				return;
			}
			console.log('asdasd', target);

			// target._objects()
		});

		canvas.current.on('mouse:move', (e) => {
			// todo object update 로직
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
			const message = formatScalingObjectEventToSocket(target);
			socket.current?.emit('update_object', message);
		});
	}, []);

	return {
		isOpen,
		menuRef,
		menuPosition,
	};
}

export default useCanvasToSocket;
