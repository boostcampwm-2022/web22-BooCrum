import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { ClientToServerEvents, Member, MemberInCanvas, Role, ServerToClientEvents } from './types';
import { useSetRecoilState } from 'recoil';
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
import { isNull } from '@utils/type.utils';

function useSocket(canvas: React.MutableRefObject<fabric.Canvas | null>) {
	const setMyInfoInWorkspace = useSetRecoilState(myInfoInWorkspaceState);
	const myInfoInWorkspaceRef = useRef<Member>();
	const setMembers = useSetRecoilState(membersState);

	const socket = useRef<Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
	const membersInCanvas = useRef<MemberInCanvas[]>([]);
	const [isConnected, setIsConnected] = useState(false);
	const [isEndInit, setIsEndInit] = useState(false);

	const { workspaceId } = useParams();

	const isMessageByMe = (userId: string) => {
		return myInfoInWorkspaceRef.current?.userId === userId;
	};

	const createMemberInCanvas = (member: Member) => {
		const cursorObject = createCursorObject(member);
		const newMemberInCanvas: MemberInCanvas = {
			userId: member.userId,
			color: member.color,
			cursorObject,
		};
		if (isNull(canvas.current)) return;
		canvas.current.add(cursorObject);
		membersInCanvas.current.push(newMemberInCanvas);
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
			myInfoInWorkspaceRef.current = userData;
			setMyInfoInWorkspace(userData);
			setMembers(members);
			members.forEach((member) => {
				if (isMessageByMe(member.userId) === false) {
					createMemberInCanvas(member);
				}
			});

			objects.forEach((object) => {
				if (!canvas.current) return;
				const role = myInfoInWorkspaceRef.current?.role as Role;
				createObjectFromServer(canvas.current, object, role, workspaceId);
			});

			setIsEndInit(true);
		});

		socket.current.on('enter_user', (userData) => {
			if (isMessageByMe(userData.userId)) return;
			setMembers((prev) => [...prev, userData]);

			createMemberInCanvas(userData);
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
			if (isNull(canvas.current) || isMessageByMe(userMousePointer.userId)) return;
			moveCursorFromServer(membersInCanvas.current, userMousePointer);
		});

		socket.current.on('select_object', ({ userId, objectIds }) => {
			if (isNull(canvas.current) || isMessageByMe(userId)) return;
			const member = membersInCanvas.current.filter((memberInCanvas) => memberInCanvas.userId === userId);
			if (member.length === 0) return;

			selectObjectFromServer(canvas.current, objectIds, member[0].color);
		});

		socket.current.on('unselect_object', ({ userId, objectIds }) => {
			if (isNull(canvas.current) || isMessageByMe(userId)) return;
			unselectObjectFromServer(canvas.current, objectIds);
		});

		socket.current.on('create_object', (arg) => {
			if (isNull(canvas.current) || isMessageByMe(arg.creator)) return;
			const role = myInfoInWorkspaceRef.current?.role as Role;
			createObjectFromServer(canvas.current, arg, role, workspaceId);
		});

		socket.current.on('delete_object', ({ objectId }) => {
			if (isNull(canvas.current)) return;
			const objects = canvas.current.getObjects().filter((object) => {
				if (object.objectId === objectId) {
					object.isSocketObject = true;
					return true;
				}
				return false;
			});
			if (objects.length === 0) return;
			canvas.current.remove(...objects);
		});

		socket.current.on('move_object', ({ userId, objectData }) => {
			if (isNull(canvas.current) || isMessageByMe(userId)) return;
			updateObjectFromServer(canvas.current, objectData);
		});

		socket.current.on('scale_object', ({ userId, objectData }) => {
			if (isNull(canvas.current) || isMessageByMe(userId)) return;
			updateObjectFromServer(canvas.current, objectData);
		});

		socket.current.on('update_object', ({ userId, objectData }) => {
			if (isNull(canvas.current) || isMessageByMe(userId)) return;
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
		isEndInit,
		socket,
		membersInCanvas,
	};
}

export default useSocket;
