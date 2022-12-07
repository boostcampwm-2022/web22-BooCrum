import { useNavigate } from 'react-router-dom';
import plusWorkspace from '@assets/icon/plus-workspace.svg';
import { Template } from './index.style';
import { Workspace } from '@api/workspace';
import { TemplateType } from './index.type';

function WorkspaceTemplate({ template }: { template: TemplateType }) {
	const navigate = useNavigate();

	const handleWorkspaceRouting = async () => {
		const workspace = await Workspace.postWorkspace(!template.isNewTemplate ? template.templateId : '', {});
		navigate(`/workspace/${workspace.workspaceId}`);
	};

	return (
		<Template onClick={handleWorkspaceRouting}>
			<div className="template-card">
				{template.templateThumbnailUrl ? (
					<img className="preview" alt={template.templateName} src={template.templateThumbnailUrl} />
				) : (
					<img className="new-icon" alt="create new board" src={plusWorkspace} />
				)}
			</div>
			<p className="template-title">{template.templateName}</p>
		</Template>
	);
}

export default WorkspaceTemplate;
