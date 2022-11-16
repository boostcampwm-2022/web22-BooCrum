import { Container } from './index.style';
import WorkspaceTemplate from '@pages/workspace-template';
import { templates } from '@data/workspace-templates';

function WorkspaceTemplateList() {
	return (
		<Container>
			<h1 className="title">Create a workspace</h1>
			<div className="template-list">
				{templates.map((template) => (
					<WorkspaceTemplate key={template.id} template={template} />
				))}
			</div>
		</Container>
	);
}

export default WorkspaceTemplateList;
