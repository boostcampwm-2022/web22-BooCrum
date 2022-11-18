import { workspaceOrderState } from '@context/main-workspace';
import { orderItems } from '@data/workspace-order';
import { useRecoilState } from 'recoil';
import { Dropdown, Description } from './index.style';
import useModal from '@hooks/useModal';
import dropdownActive from '@assets/icon/dropdown-active.svg';
import dropdownInActive from '@assets/icon/dropdown-inactive.svg';

function OrderDropdown() {
	const [orderType, setOrderType] = useRecoilState(workspaceOrderState);
	const { modalRef, isOpenModal, toggleOpenModal } = useModal();

	const handleOrderType = (id: number) => {
		setOrderType(id);
		toggleOpenModal();
	};

	return (
		<Dropdown ref={modalRef}>
			<div className="dropdown-button" onClick={toggleOpenModal}>
				<p>{orderItems[orderType].description}</p>
				<img className="dropdown-icon" alt="dropdown button" src={isOpenModal ? dropdownActive : dropdownInActive} />
			</div>
			{isOpenModal && (
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
