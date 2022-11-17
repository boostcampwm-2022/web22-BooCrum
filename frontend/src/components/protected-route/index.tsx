import { ReactElement, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import Loading from '@components/loading';

function ProtectedRoute({ children }: { children: ReactElement }) {
	const { isLoading, isAuth, authenticate } = useAuth();

	useEffect(() => {
		authenticate();
	}, []);

	if (isLoading) {
		return <Loading />;
	}

	if (isAuth === false) {
		return <Navigate to="/login" />;
	}

	return children;
}

export default ProtectedRoute;
