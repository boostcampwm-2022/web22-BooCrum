import React from 'react';
import Contents from './contents.component';
import Header from './header.component';
import { Wrapper } from './index.style';
import Sidebar from './sidebar.component';

function Main() {
	return (
		<Wrapper>
			<Sidebar />
			<div className="workspace-container">
				<Header />
				<Contents />
			</div>
		</Wrapper>
	);
}

export default Main;
