import Header from '../header';
import Toolkit from '../toolkit';

function Layout({ name }: { name: string }) {
	return (
		<>
			<Header name={name} />
			<Toolkit />
		</>
	);
}

export default Layout;
