import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@components/protected-route';
import { lazy, Suspense } from 'react';
import Loading from '@components/loading';

const Main = lazy(() => import('@pages/main'));
const Login = lazy(() => import('@pages/login'));
const Workspace = lazy(() => import('@pages/workspace'));
const Error = lazy(() => import('@pages/error'));

function App() {
	return (
		<Suspense fallback={<Loading />}>
			<Routes>
				<Route
					path="/"
					element={
						<ProtectedRoute>
							<Main />
						</ProtectedRoute>
					}
				/>
				<Route path="/login" element={<Login />} />
				<Route path="/workspace/:workspaceId" element={<Workspace />} />
				<Route path="/*" element={<Error />} />
			</Routes>
		</Suspense>
	);
}

export default App;
