import React from 'react';
import alarm from '@assets/icon/alarm.svg';
import { Container } from './header.style';

function Header() {
	return (
		<Container>
			<img className="alarm-icon" alt="alarm icon" src={alarm} />
		</Container>
	);
}

export default Header;
