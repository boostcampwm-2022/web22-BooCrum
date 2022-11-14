import React from 'react';
import styled from 'styled-components';
import Sidebar from './sidebar.component';

function Main() {
	return (
		<Wrapper>
			<Sidebar />
			main page
		</Wrapper>
	);
}

export default Main;

const Wrapper = styled.div`
	display: flex;
`;
