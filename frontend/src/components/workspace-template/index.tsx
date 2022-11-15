import React from 'react';
import plusWorkspace from '@assets/icon/plus-workspace.svg';
import { Template } from './index.style';

interface ITemplate {
	id: number;
	title: string;
	preview: string;
}

function WorkspaceTemplate({ template }: { template: ITemplate }) {
	return (
		<Template key={template.id} isEmpty={template.preview === ''}>
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
