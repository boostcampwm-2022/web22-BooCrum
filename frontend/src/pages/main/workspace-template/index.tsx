import { useNavigate } from 'react-router-dom';
import plusWorkspace from '@assets/icon/plus-workspace.svg';
import { Template } from './index.style';

function WorkspaceTemplate({ template }: { template: TemplateType }) {
	const navigate = useNavigate();

	const handleWorkspaceRouting = () => {
		navigate('/workspace', { state: { id: template.id, user: 1 } });
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
