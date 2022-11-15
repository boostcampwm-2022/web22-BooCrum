import React from 'react';
import { workspaceOrderState } from '@context/main-workspace';
import { orderTypes } from '@data/workspace-order';
import { useRecoilState } from 'recoil';
import { Dropdown, Description } from './index.style';

function OrderDropdown() {
	const [orderType, setOrderType] = useRecoilState(workspaceOrderState);

	const handleOrderType = (id: number) => {
		setOrderType(id);
	};

	return (
		<Dropdown>
			<div className="button">{orderTypes[orderType].description}</div>
			<div className="container">
				{orderTypes.map((type) => (
					<Description key={type.id} isSelected={orderType === type.id} onClick={() => handleOrderType(type.id)}>
						{type.description}
					</Description>
				))}
			</div>
		</Dropdown>
	);
}

export default OrderDropdown;
