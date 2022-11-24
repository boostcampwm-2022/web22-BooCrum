import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, Member, ServerToClientEvents } from '@pages/workspace/whiteboard-canvas/socket.types';

function useSocket(canvas: React.MutableRefObject<fabric.Canvas | null>) {
	const [isConnected, setIsConnected] = useState(false);
	const [members, setMembers] = useState<Member[]>([]);
	const {
		state: { workspaceId },
	} = useLocation();
	const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(`/workspace/${workspaceId}`);

	useEffect(() => {
		socket.on('connect', () => {
			setIsConnected(true);
		});

		socket.on('disconnect', () => {
			setIsConnected(false);
		});

		socket.on('init', ({ members, objects }) => {
			setMembers(members);
			//todo: objects 업데이트
		});

		socket.on('enter_user', ({ userData }) => {
			setMembers((prev) => [...prev, userData]);
		});

		socket.on('leave_user', ({ userId }) => {
			setMembers((prev) => prev.filter((user) => user.userId !== userId));
		});

		socket.on('move_pointer', ({ userId, x, y }) => {
			// todo move_pointer 업데이트
		});

		socket.on('select_object', ({ userId, objectId }) => {
			//todo select 업데아트
		});

		socket.on('unselect_object', ({ userId, objectId }) => {
			//todo unselect 업데아트
		});

		socket.on('create_object', ({ objectData }) => {
			//todo object 추가
		});

		socket.on('delete_object', ({ objectId }) => {
			// todo object 삭제
		});

		socket.on('update_object', ({ objectData }) => {
			//todo object 업데이트
		});
	}, []);

	return {
		isConnected,
		socket,
		members,
	};
}

export default useSocket;
