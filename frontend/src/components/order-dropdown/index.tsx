import React from 'react';
import { workspaceOrderState } from '@context/main-workspace';
import { orderTypes } from '@data/workspace-order';
import { useRecoilState } from 'recoil';
import { Dropdown, Description } from './index.style';
import useDropdown from '@hooks/useDropdown';

function OrderDropdown() {
	const [orderType, setOrderType] = useRecoilState(workspaceOrderState);
	const { dropdownRef, isActive, toggleActive } = useDropdown();

	const handleOrderType = (id: number) => {
		setOrderType(id);
	};

	return (
		<Dropdown ref={dropdownRef}>
			<div className="button" onClick={toggleActive}>
				{orderTypes[orderType].description}
			</div>
			{isActive && (
				<div className="container">
					{orderTypes.map((type) => (
						<Description key={type.id} isSelected={orderType === type.id} onClick={() => handleOrderType(type.id)}>
							{type.description}
						</Description>
					))}
				</div>
			)}
		</Dropdown>
	);
}

export default OrderDropdown;
