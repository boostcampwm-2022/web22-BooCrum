import { Routes, Route } from 'react-router-dom';
import Main from '@pages/main';
import Error from '@pages/error';

function App() {
	return (
		<Routes>
			<Route path="/" element={<Main />} />
			<Route path="/*" element={<Error />} />
		</Routes>
	);
}

export default App;
