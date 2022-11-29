import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, Member, MemberInCanvas, ServerToClientEvents } from './types';
import { useRecoilState } from 'recoil';
import { membersState } from '@context/workspace';
import { fabric } from 'fabric';
import {
	createCursorObject,
	createObjectFromServer,
	moveCursorFromServer,
	updateObjectFromServer,
} from '@utils/object-from-server';

function useSocket(canvas: React.MutableRefObject<fabric.Canvas | null>) {
	// 자신의 정보 role을 이용해 작업하기 위해 생성
	const myInfoInWorkspace = useRef<Member>();
	const [members, setMembers] = useRecoilState(membersState);

	const socket = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
	const membersInCanvas = useRef<MemberInCanvas[]>([]);
	const [isConnected, setIsConnected] = useState(false);

	const { workspaceId } = useParams();

	const isMessageByMe = (userId: string) => {
		return myInfoInWorkspace.current?.userId === userId;
	};

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
			myInfoInWorkspace.current = userData;
			setMembers(members);
			members.forEach((member) => {
				if (isMessageByMe(member.userId) === false) {
					const cursorObject = createCursorObject(member.color);
					const newMemberInCanvas: MemberInCanvas = {
						userId: member.userId,
						color: member.color,
						cursorObject,
					};
					canvas.current?.add(cursorObject);
					membersInCanvas.current.push(newMemberInCanvas);
				}
			});
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
			membersInCanvas.current = membersInCanvas.current.filter((memberInCanvas) => {
				canvas.current?.remove(memberInCanvas.cursorObject);
				return memberInCanvas.userId !== userId;
			});
		});

		socket.current.on('exception', (arg) => {
			console.log(arg);
		});

		socket.current.on('move_pointer', (userMousePointer) => {
			if (!canvas.current) return;
			if (isMessageByMe(userMousePointer.userId)) return;
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
			console.log(arg);
			if (!canvas.current) return;
			if (isMessageByMe(arg.creator)) return;
			createObjectFromServer(canvas.current, arg);
		});

		socket.current.on('delete_object', ({ objectId }) => {
			// todo object 삭제
		});

		socket.current.on('update_object', ({ userId, objectData }) => {
			if (!canvas.current) return;
			if (isMessageByMe(userId)) return;
			console.log(objectData);
			updateObjectFromServer(canvas.current, objectData);
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
		myInfoInWorkspace,
	};
}

export default useSocket;
