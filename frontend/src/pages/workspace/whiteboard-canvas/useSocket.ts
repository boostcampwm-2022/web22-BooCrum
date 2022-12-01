import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, Member, MemberInCanvas, ServerToClientEvents } from './types';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { membersState } from '@context/workspace';
import { fabric } from 'fabric';
import {
	createCursorObject,
	createObjectFromServer,
	moveCursorFromServer,
	selectObjectFromServer,
	unselectObjectFromServer,
	updateObjectFromServer,
} from '@utils/object-from-server';
import { myInfoInWorkspaceState } from '@context/user';

function useSocket(canvas: React.MutableRefObject<fabric.Canvas | null>) {
	const setMyInfoInWorkspace = useSetRecoilState(myInfoInWorkspaceState);
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
			console.log(objects);
			myInfoInWorkspaceRef.current = userData;
			setMyInfoInWorkspace(userData);
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

			objects.forEach((object) => {
				if (!canvas.current) return;
				createObjectFromServer(canvas.current, object);
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
				if (memberInCanvas.userId === userId) {
					canvas.current?.remove(memberInCanvas.cursorObject);
					return false;
				}
				return true;
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

		socket.current.on('select_object', ({ userId, objectIds }) => {
			if (!canvas.current) return;
			if (isMessageByMe(userId)) return;
			const member = membersInCanvas.current.filter((memberInCanvas) => memberInCanvas.userId === userId);
			if (member.length === 0) return;

			selectObjectFromServer(canvas.current, objectIds, member[0].color);
		});

		socket.current.on('unselect_object', ({ userId, objectIds }) => {
			if (!canvas.current) return;
			if (isMessageByMe(userId)) return;
			unselectObjectFromServer(canvas.current, objectIds);
		});

		socket.current.on('create_object', (arg) => {
			if (!canvas.current) return;
			if (isMessageByMe(arg.creator)) return;
			createObjectFromServer(canvas.current, arg);
		});

		socket.current.on('delete_object', ({ objectId }) => {
			if (!canvas.current) return;
			const objects = canvas.current.getObjects().filter((object) => {
				if (object.objectId === objectId) {
					object.isSocketObject = true;
					return true;
				}
				return false;
			});
			if (!objects || objects.length === 0) return;
			canvas.current.remove(...objects);
		});

		socket.current.on('move_object', ({ userId, objectData }) => {
			if (!canvas.current) return;
			if (isMessageByMe(userId)) return;
			if (!objectData.left || !objectData.dleft) return;
			objectData.left += objectData.dleft;
			if (!objectData.top || !objectData.dtop) return;
			objectData.top += objectData.dtop;
			updateObjectFromServer(canvas.current, objectData);
		});

		socket.current.on('update_object', ({ userId, objectData }) => {
			if (!canvas.current) return;
			if (isMessageByMe(userId)) return;
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
	};
}

export default useSocket;
