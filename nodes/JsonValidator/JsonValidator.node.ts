import { INodeTypeBaseDescription, IVersionedNodeType, VersionedNodeType } from 'n8n-workflow';
import { JsonValidatorV1 } from './v1/JsonValidatorV1.node';

export class JsonValidator extends VersionedNodeType {
	constructor() {
		const baseDescription: INodeTypeBaseDescription = {
			displayName: 'Json Validator',
			name: 'jsonValidator',
			group: ['transform'],
			icon: 'file:ajv.svg',
			description: 'Validate data using a JSON Schema',
			subtitle: 'Validate JSON using AJV',
			defaultVersion: 1,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new JsonValidatorV1(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
