import { useNavigate } from 'react-router-dom';
import plusWorkspace from '@assets/icon/plus-workspace.svg';
import { Template } from './index.style';
import { Workspace } from '@api/workspace';

function WorkspaceTemplate({ template }: { template: TemplateType }) {
	const navigate = useNavigate();

	const handleWorkspaceRouting = async () => {
		const workspace = await Workspace.postWorkspace({});
		navigate('/workspace', { state: workspace });
	};

	return (
		<Template isEmpty={template.preview === ''} onClick={handleWorkspaceRouting}>
			<div className="template-card">
				{template.preview ? (
					<img className="preview" alt={template.title} src={template.preview} />
				) : (
					<img className="new-icon" alt="create new board" src={plusWorkspace} />
				)}
			</div>
			<p className="template-title">{template.title}</p>
		</Template>
	);
}

export default WorkspaceTemplate;
