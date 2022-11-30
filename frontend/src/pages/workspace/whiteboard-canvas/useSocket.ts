import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, Member, MemberInCanvas, ServerToClientEvents } from './types';
import { useRecoilState } from 'recoil';
import { membersState } from '@context/workspace';
import { fabric } from 'fabric';
import { createCursorObject, createObjectFromServer, moveCursorFromServer } from '@utils/object-from-server';
import { myInfoInWorkspaceState } from '@context/user';

function useSocket(canvas: React.MutableRefObject<fabric.Canvas | null>) {
	// 자신의 정보 role을 이용해 작업하기 위해 생성
	const [myInfoInWorkspace, setMyInfoInWorkspace] = useRecoilState(myInfoInWorkspaceState);
	const myInfoInWorkspaceRef = useRef<Member>();
	const [members, setMembers] = useRecoilState(membersState);

	const socket = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
	const membersInCanvas = useRef<MemberInCanvas[]>([]);
	const [isConnected, setIsConnected] = useState(false);

	const { workspaceId } = useParams();

	const isMessageByMe = (userId: string) => {
		return myInfoInWorkspaceRef.current?.userId === userId;
	};

	useEffect(() => {
		myInfoInWorkspaceRef.current = myInfoInWorkspace;
	}, [myInfoInWorkspace]);

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

		socket.current.on('init', ({ members, objects, userData }) => {
			console.log(userData);
			console.log(members);
			setMyInfoInWorkspace(userData);
			setMembers(members);
			//todo: objects 업데이트
		});

		socket.current.on('enter_user', (userData) => {
			if (isMessageByMe(userData.userId)) return;
			setMembers((prev) => [...prev, userData]);
			const cursorObject = createCursorObject(userData.color);

			const newMemberInCanvas: MemberInCanvas = {
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

		socket.current.on('exception', (arg) => {
			console.log(arg);
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

		socket.current.on('create_object', (arg) => {
			if (!canvas.current) return;
			if (isMessageByMe(arg.creator)) return;
			createObjectFromServer(canvas.current, arg);
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
