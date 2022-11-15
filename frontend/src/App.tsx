import { useRecoilState } from 'recoil';
import { DeleteModalState, RenameModalState } from './context/atoms';
import DeleteModal from './pages/main/delete-modal.component';
import RenameModal from './pages/main/rename-modal.component';
import WorkspaceList from './pages/main/workspace-list.component';

function App() {
	const [isOpenDeleteModal, setOpenDeleteModal] = useRecoilState(DeleteModalState);
	const [isOpenRenameModal, setOpenRenameModal] = useRecoilState(RenameModalState);
	return (
		<div className="App">
			<WorkspaceList title={'Title'}></WorkspaceList>
			{isOpenDeleteModal.isOpen ? <DeleteModal setOpenModal={setOpenDeleteModal}></DeleteModal> : <></>}
			{isOpenRenameModal.isOpen ? <RenameModal setOpenModal={setOpenRenameModal}></RenameModal> : <></>}
		</div>
	);
}

export default App;
