import React from 'react';
import styled from 'styled-components';
import Header from './header.component';
import Sidebar from './sidebar.component';

function Main() {
	return (
		<Wrapper>
			<Sidebar />
			<Section>
				<Header />
				main page
			</Section>
		</Wrapper>
	);
}

export default Main;

const Wrapper = styled.div`
	display: flex;
`;
const Section = styled.div`
	flex-grow: 1;
`;
