import { workspaceParticipantsState } from '@context/workspace';
import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Socket } from 'socket.io-client';
import { ClientToServerEvents, ParticipantInfo, Role, ServerToClientEvents } from './types';

function useCustomEvent(socket: React.MutableRefObject<Socket<ServerToClientEvents, ClientToServerEvents> | null>) {
	const [participants, setParticipants] = useRecoilState<ParticipantInfo[]>(workspaceParticipantsState);

	useEffect(() => {
		document.addEventListener('role:changed', messageToSocket);

		socket.current?.on('update_role', messageFromSocket);

		return () => {
			document.removeEventListener('role:changed', messageToSocket);

			socket.current?.off('update_role', messageFromSocket);
		};
	}, []);

	const messageToSocket = (ev: Event) => {
		const customEventObject = ev as CustomEvent;
		console.log(customEventObject.detail);

		// socket.current?.emit("update_role", { userId, role })
	};

	const messageFromSocket = ({ userId, role }: { userId: string; role: Role }) => {
		// setParticipants(
		// 	participants.map((part) => {
		// 		if (part.user.userId === userId) return { ...part, role };
		// 		return part;
		// 	})
		// );
	};

	return { participants };
}

export default useCustomEvent;
