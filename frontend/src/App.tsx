import { Routes, Route } from 'react-router-dom';
import Main from '@pages/main';
import Error from '@pages/error';
import Workspace from '@pages/workspace';
import Login from '@pages/login';
import ProtectedRoute from '@components/protected-route';

function App() {
	return (
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
			<Route path="/workspace" element={<Workspace />} />
			<Route path="/*" element={<Error />} />
		</Routes>
	);
}

export default App;
