import React from 'react';
import Header from './header.component';
import { Section, Wrapper } from './index.style';
import Sidebar from './sidebar.component';

function Main() {
	return (
		<Wrapper>
			<Sidebar />
			<Section>
				<Header />
			</Section>
		</Wrapper>
	);
}

export default Main;
