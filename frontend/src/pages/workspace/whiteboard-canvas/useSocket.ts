import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@pages/workspace/whiteboard-canvas/socket.types';
import { useRecoilState } from 'recoil';
import { membersState } from '@context/workspace';
import { fabric } from 'fabric';
import { createCursorObject, moveCursorFromServer } from '@utils/object-from-server';

function useSocket(canvas: React.MutableRefObject<fabric.Canvas | null>) {
	const [members, setMembers] = useRecoilState(membersState);

	const socket = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
	const membersInCanvas = useRef<MemberInCanvas[]>([]);
	const [isConnected, setIsConnected] = useState(false);

	const {
		state: { workspaceId },
	} = useLocation();

	useEffect(() => {
		socket.current = io(`/workspace/${workspaceId}`);
		socket.current.on('connect', () => {
			setIsConnected(true);
			console.log('socket connected');
		});

		socket.current.on('disconnect', () => {
			setIsConnected(false);
			console.log('socket disconnected');
		});

		socket.current.on('init', ({ members, objects }) => {
			console.log(members, objects);
			setMembers(members);
			console.log('socket init');
			//todo: objects 업데이트
		});

		socket.current.on('enter_user', (userData) => {
			console.log('enter_user');
			setMembers((prev) => [...prev, userData]);
			const cursorObject = createCursorObject(userData.color);

			const newMemberInCanvas: MemberInCanvas = {
				// 임시 color 추후 서버에서 보내 줌
				userId: userData.userId,
				color: userData.color,
				cursorObject,
			};
			canvas.current?.add(cursorObject);
			membersInCanvas.current.push(newMemberInCanvas);
		});

		socket.current.on('leave_user', ({ userId }) => {
			setMembers((prev) => prev.filter((user) => user.userId !== userId));
			membersInCanvas.current = membersInCanvas.current.filter((memberInCanvas) => memberInCanvas.userId !== userId);
			console.log('leave_user');
		});

		socket.current.on('move_pointer', (userMousePointer) => {
			if (!canvas.current) return;
			moveCursorFromServer(membersInCanvas.current, userMousePointer);

			canvas.current.renderAll();
		});

		socket.current.on('select_object', ({ userId, objectId }) => {
			//todo select 업데아트
		});

		socket.current.on('unselect_object', ({ userId, objectId }) => {
			//todo unselect 업데아트
		});

		socket.current.on('create_object', ({ objectData }) => {
			//todo object 추가
		});

		socket.current.on('delete_object', ({ objectId }) => {
			// todo object 삭제
		});

		socket.current.on('update_object', ({ objectData }) => {
			//todo object 업데이트
		});

		return () => {
			if (socket.current) {
				socket.current.disconnect();
			}
		};
	}, []);

	return {
		isConnected,
		socket,
		membersInCanvas,
	};
}

export default useSocket;
