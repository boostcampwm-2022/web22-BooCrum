import { Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '@pages/workspace/whiteboard-canvas/socket.types';
import { useEffect } from 'react';
import useContextMenu from '@hooks/useContextMenu';

interface UseCanvasEventProps {
	canvas: React.MutableRefObject<fabric.Canvas | null>;
	socket: React.MutableRefObject<Socket<ServerToClientEvents, ClientToServerEvents> | null>;
}

function useCanvasEvent({ canvas, socket }: UseCanvasEventProps) {
	const { isOpen, menuRef, toggleOpen, menuPosition } = useContextMenu();
	useEffect(() => {
		if (!canvas.current) return;

		canvas.current.on('object:added', (e) => {
			// todo object 추가 로직
			// socket.emit('create_object', { e });
			console.log(e);
		});

		canvas.current.on('object:removed', (e) => {
			console.log(e);
		});

		canvas.current.on('selection:created', (e) => {
			// todo select 로직
			console.log(e);

			toggleOpen(e.target?.left || 0, e.target?.top || 0);
		});

		canvas.current.on('selection:cleared', (e) => {
			// todo unselect 로직
			console.log(e);
		});

		canvas.current.on('object:moving', (e) => {
			// todo object update 로직
			console.log(e);
		});

		canvas.current.on('mouse:move', (e) => {
			// todo object update 로직
			if (!e.pointer) return;
			const { x, y } = e.pointer;
			const message: MousePointer = {
				x,
				y,
			};
			socket.current?.emit('move_pointer', message);
		});

		canvas.current.on('object:scaling', (e) => {
			// todo object update 로직
			console.log(e);
		});
	}, []);

	return {
		isOpen,
		menuRef,
		menuPosition,
	};
}

export default useCanvasEvent;
