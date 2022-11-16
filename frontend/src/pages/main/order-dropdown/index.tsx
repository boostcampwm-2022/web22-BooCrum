import { workspaceOrderState } from '@context/main-workspace';
import { orderItems } from '@data/workspace-order';
import { useRecoilState } from 'recoil';
import { Dropdown, Description } from './index.style';
import useDropdown from '@hooks/useDropdown';
import dropdownActive from '@assets/icon/dropdown-active.svg';
import dropdownInActive from '@assets/icon/dropdown-inactive.svg';

function OrderDropdown() {
	const [orderType, setOrderType] = useRecoilState(workspaceOrderState);
	const { dropdownRef, isActive, toggleActive } = useDropdown();

	const handleOrderType = (id: number) => {
		setOrderType(id);
		toggleActive();
	};

	return (
		<Dropdown ref={dropdownRef}>
			<div className="dropdown-button" onClick={toggleActive}>
				<p>{orderItems[orderType].description}</p>
				<img className="dropdown-icon" alt="dropdown button" src={isActive ? dropdownActive : dropdownInActive} />
			</div>
			{isActive && (
				<div className="dropdown-container">
					{orderItems.map((type) => (
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
