import { ReactElement } from 'react';
import { useRecoilValueLoadable } from 'recoil';
import { authAtom } from '../../context/auth';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }: { children: ReactElement }) {
	const auth = useRecoilValueLoadable(authAtom);

	if (auth.state === 'loading') {
		return <div>로딩</div>;
	}

	if (auth.contents === false) {
		return <Navigate to="/login" />;
	}

	return children;
}

export default ProtectedRoute;
