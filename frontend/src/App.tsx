import { useRecoilState } from 'recoil';
import { DeleteModalState } from './context/atoms';
import DeleteModal from './pages/main/delete-modal.component';
import WorkspaceList from './pages/main/workspace-list.component';

function App() {
	const [isOpenDeleteModal, setOpenDeleteModal] = useRecoilState(DeleteModalState);
	return (
		<div className="App">
			<WorkspaceList title={'Title'}></WorkspaceList>
			{isOpenDeleteModal ? <DeleteModal setOpenModal={setOpenDeleteModal}></DeleteModal> : <></>}
		</div>
	);
}

export default App;
