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
	useEffect(() => {
		if (!canvas.current) return;

		canvas.current.on('object:added', (e) => {
			if (!e.target || !canvas.current) return;
			const fabricObject = e.target;
			if (fabricObject.isSocketObject) return;
			if (fabricObject.objectId === editedObjectId.current) {
				editedObjectId.current = '';
				return;
			}

			if (fabricObject.type === ObjectType.postit) {
				const message = formatCreatePostitEventToSocket(fabricObject as fabric.Group);
				socket.current?.emit('create_object', message);
			}
		});

		canvas.current.on('object:removed', ({ target }) => {
			if (!target) return;
			socket.current?.emit('delete_object', {
				objectId: target.objectId,
			});
		});

		canvas.current.on('text:changed', ({ target }) => {
			if (!target || target.type !== ObjectType.text) return;
			const message = formatEditTextEventToSocket(target as fabric.Text);
			socket.current?.emit('update_object', message);
		});

		canvas.current.on('text:editing:entered', ({ target }) => {
			if (!target) return;
			editedObjectId.current = target.objectId;
		});

		canvas.current.on('selection:created', (e) => {
			// todo select 로직
			// console.log(e);
			openMenu();
		});

		canvas.current.on('selection:cleared', (e) => {
			// todo unselect 로직
			// console.log(e);
		});

		canvas.current.on('object:moving', ({ target }) => {
			if (!target) return;
			const message = formatMoveObjectEventToSocket(target);
			socket.current?.emit('update_object', message);
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
			console.log(target);
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
