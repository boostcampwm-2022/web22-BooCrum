import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@pages/workspace/whiteboard-canvas/socket.types';

function useSocket(canvas: React.MutableRefObject<fabric.Canvas | null>) {
	const socket = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [members, setMembers] = useState<Member[]>([]);
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

		socket.current.on('enter_user', ({ userData }) => {
			// todo mousepointer 객체 생성 후 추가
			setMembers((prev) => [...prev, userData]);
			console.log('enter_user');
			console.log(userData);
		});

		socket.current.on('leave_user', ({ userId }) => {
			setMembers((prev) => prev.filter((user) => user.userId !== userId));
			console.log('leave_user');
		});

		socket.current.on('move_pointer', ({ userId, x, y }) => {
			// todo move_pointer 업데이트
			console.log(userId, x, y);
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
		members,
	};
}

export default useSocket;
