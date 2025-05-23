import { INodeTypeBaseDescription, IVersionedNodeType, VersionedNodeType } from 'n8n-workflow';
import { JsonValidatorV2 } from './v2/JsonValidatorV2.node';
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
			defaultVersion: 2,
		};

		const nodeVersions: IVersionedNodeType['nodeVersions'] = {
			1: new JsonValidatorV1(baseDescription),
			2: new JsonValidatorV2(baseDescription),
		};

		super(nodeVersions, baseDescription);
	}
}
