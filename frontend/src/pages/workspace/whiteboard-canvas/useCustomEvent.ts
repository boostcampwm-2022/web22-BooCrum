import { myInfoInWorkspaceState } from '@context/user';
import { workspaceParticipantsState } from '@context/workspace';
import { workspaceRole } from '@data/workspace-role';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Socket } from 'socket.io-client';
import { ClientToServerEvents, MyInfo, ParticipantInfo, RoleInfo, ServerToClientEvents } from './types';

function useCustomEvent(socket: React.MutableRefObject<Socket<ServerToClientEvents, ClientToServerEvents> | null>) {
	const [participants, setParticipants] = useRecoilState<ParticipantInfo[]>(workspaceParticipantsState);
	const [myInfoInWorkspace, setMyInfoInWorkspace] = useRecoilState<MyInfo>(myInfoInWorkspaceState);

	useEffect(() => {
		document.addEventListener('role:changed', messageToSocket);

		return () => {
			document.removeEventListener('role:changed', messageToSocket);
		};
	}, [myInfoInWorkspace]);
	useEffect(() => {
		socket.current?.on('change_role', messageFromSocket);

		return () => {
			socket.current?.off('change_role', messageFromSocket);
		};
	}, [participants]);

	const messageToSocket = (ev: Event) => {
		if (myInfoInWorkspace.role !== workspaceRole.OWNER) return;

		const { userId, role } = (ev as CustomEvent).detail;
		socket.current?.emit('change_role', { userId, role });
	};

	const messageFromSocket = ({ userId, role }: RoleInfo) => {
		const updatedParticipants = participants.map((part) => {
			if (part.user.userId === userId) return { ...part, role };
			return part;
		});
		setParticipants(updatedParticipants);
		if (userId === myInfoInWorkspace.userId) setMyInfoInWorkspace({ ...myInfoInWorkspace, role: role });
	};

	return { participants };
}

export default useCustomEvent;
