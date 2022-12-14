import { Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents, MousePointer } from './types';
import { useEffect } from 'react';
import useEditMenu from './useEditMenu';
import { ObjectType, SocketObjectType } from '@pages/workspace/whiteboard-canvas/types';
import {
	formatObjectDataToServer,
	formatEditColorEventToSocket,
	formatEditTextEventToSocket,
	formatMessageToSocketForGroup,
	formatMoveObjectEventToSocket,
	formatScaleObjectEventToSocket,
	formatScaleObjectEventToSocketForGroup,
	formatMoveObjectEventToSocketForGroup,
	formatSelectEventToSocket,
	formatEditFontSizeEventToSocket,
	initDrawObject,
} from '@utils/object-to-server';
import { fabric } from 'fabric';
import { isNull, isUndefined } from '@utils/type.utils';
import { createThumbnailImage } from '@utils/fabric.utils';
import { Workspace } from '@api/workspace';
import { useParams } from 'react-router-dom';

interface UseCanvasToSocketProps {
	canvas: React.MutableRefObject<fabric.Canvas | null>;
	socket: React.MutableRefObject<Socket<ServerToClientEvents, ClientToServerEvents> | null>;
	cursorWorker: React.MutableRefObject<Worker | undefined>;
	objectWorker: React.MutableRefObject<Worker | undefined>;
}

function useCanvasToSocket({ canvas, socket, cursorWorker, objectWorker }: UseCanvasToSocketProps) {
	const { isOpen, menuRef, color, setObjectColor, fontSize, handleFontSize, openMenu, selectedType, menuPosition } =
		useEditMenu(canvas);
	const { workspaceId } = useParams();

	const updateThumbnail = () => {
		if (!canvas.current || !workspaceId) return;
		const thumbnailImage = createThumbnailImage(canvas.current);

		Workspace.postThumbnail(workspaceId, {
			file: thumbnailImage,
		});
	};

	useEffect(() => {
		if (isNull(canvas.current)) return;

		canvas.current.on('object:added', ({ target: fabricObject }) => {
			if (isUndefined(fabricObject) || fabricObject.isSocketObject) return;

			if (fabricObject instanceof fabric.Path && fabricObject.type !== ObjectType.cursor) {
				initDrawObject(fabricObject as fabric.Path);
			}

			if (fabricObject.type in SocketObjectType) {
				const message = formatObjectDataToServer(fabricObject);
				socket.current?.emit('create_object', message);
				updateThumbnail();
			}
		});

		canvas.current.on('object:modified', ({ target: fabricObject }) => {
			if (isUndefined(fabricObject)) return;

			if (fabricObject.type in SocketObjectType) {
				const message = formatObjectDataToServer(fabricObject);
				socket.current?.emit('update_object', message);
				updateThumbnail();
				return;
			}

			if (!(fabricObject instanceof fabric.Group)) return;

			fabricObject._objects.forEach((object) => {
				if (object.type in SocketObjectType) {
					const message = formatMessageToSocketForGroup(fabricObject, object);
					socket.current?.emit('update_object', message);
				}
			});
			updateThumbnail();
		});

		canvas.current.on('object:removed', ({ target: fabricObject }) => {
			if (isUndefined(fabricObject) || fabricObject.isSocketObject) return;

			if (fabricObject.type === ObjectType.editable) return;

			socket.current?.emit('delete_object', {
				objectId: fabricObject.objectId,
			});
			updateThumbnail();
		});

		canvas.current.on('object:moving', ({ target: fabricObject }) => {
			if (isUndefined(fabricObject)) return;
			if (fabricObject.type in SocketObjectType) {
				const message = formatMoveObjectEventToSocket(fabricObject as fabric.Group);
				objectWorker.current?.postMessage(message);
				// socket.current?.emit('move_object', message);
				return;
			}

			if (!(fabricObject instanceof fabric.Group)) return;

			fabricObject._objects.forEach((object) => {
				if (object.type in SocketObjectType) {
					const message = formatMoveObjectEventToSocketForGroup(fabricObject, object as fabric.Group);
					objectWorker.current?.postMessage(message);
					// socket.current?.emit('move_object', message);
				}
			});
		});

		canvas.current.on('object:scaling', ({ target: fabricObject }) => {
			if (isUndefined(fabricObject)) return;

			if (fabricObject.type in ObjectType) {
				const message = formatScaleObjectEventToSocket(fabricObject as fabric.Group);
				objectWorker.current?.postMessage(message);
				// socket.current?.emit('scale_object', message);
				return;
			}

			if (!(fabricObject instanceof fabric.Group)) return;

			fabricObject._objects.forEach((object) => {
				if (object.type in SocketObjectType) {
					const message = formatScaleObjectEventToSocketForGroup(fabricObject, object as fabric.Group);
					objectWorker.current?.postMessage(message);
					// socket.current?.emit('scale_object', message);
				}
			});
		});

		canvas.current.on('color:modified', ({ target: fabricObject }) => {
			if (!(fabricObject instanceof fabric.Group)) return;
			if (fabricObject.type === ObjectType.section || fabricObject.type === ObjectType.postit) {
				const message = formatEditColorEventToSocket(fabricObject);
				socket.current?.emit('update_object', message);
				return;
			}

			fabricObject._objects.forEach((object) => {
				if (object.type === ObjectType.section || object.type === ObjectType.postit) {
					const changeObjects = object as fabric.Group;
					const message = formatEditColorEventToSocket(changeObjects);
					socket.current?.emit('update_object', message);
				}
			});
		});

		canvas.current.on('font:modified', ({ target: fabricObject }) => {
			const textObject = fabricObject as fabric.Text;
			if (isUndefined(textObject)) return;

			const message = formatEditFontSizeEventToSocket(textObject);
			socket.current?.emit('update_object', message);
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
			cursorWorker.current?.postMessage(message);
		});
	}, []);

	return {
		isOpen,
		menuRef,
		color,
		setObjectColor,
		fontSize,
		handleFontSize,
		selectedType,
		menuPosition,
	};
}

export default useCanvasToSocket;
