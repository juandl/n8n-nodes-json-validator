import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeBaseDescription,
	INodeTypeDescription,
} from 'n8n-workflow';

import Ajv, { type SchemaObject } from 'ajv';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

export class JsonValidatorV2 implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,
			version: 2,
			defaults: {
				name: 'Json Validator',
			},
			inputs: ['main'],
			outputs: ['main'],
			properties: [
				{
					displayName: `Validate data using a JSON Schema.<br />
						A valid draft-07 schema. Visit <a href='https://JSON-schema.org/draft-07/' target='_blank'>JSON-schema.org</a> to learn how to describe your validation rules in JSON Schemas.<br />
						It does make use of the errors properties of ajv-errors, learn more about it <a href='https://github.com/ajv-validator/ajv-errors'>here</a>`,
					name: 'notice',
					type: 'notice',
					default: '',
				},
				{
					displayName: 'JSON Schema',
					name: 'schema',
					type: 'json',
					required: true,
					typeOptions: {
						alwaysOpenEditWindow: true,
					},
					default: JSON.stringify(
						{
							type: 'object',
							properties: {
								foo: { type: 'integer' },
								bar: { type: 'string' },
							},
							required: ['foo'],
							additionalProperties: false,
						},
						undefined,
						2,
					),
					placeholder: '',
					description:
						'A valid draft-07 schema. Visit https://JSON-schema.org/draft-07 to learn how to describe your validation rules in JSON Schemas.',
				},
			],
		};
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		/**
		 * Initiate AVJ
		 */
		const ajv = new Ajv({ allErrors: true });
		addFormats(ajv);
		addErrors(ajv);

		// Get the JSON schema defined by the user
		const schema = this.getNodeParameter('schema', 0, undefined, {
			ensureType: 'json',
		}) as SchemaObject;

		try {
			ajv.validateSchema(schema);
			if (ajv.errors) {
				return this.prepareOutputData([
					{
						json: {
							error: `Invalid JSON Schema: ${ajv.errorsText(ajv.errors)}`,
						},
					},
				]);
			}
		} catch (error) {
			return this.prepareOutputData([
				{
					json: {
						error: `Invalid JSON Schema ${error}`,
					},
				},
			]);
		}

		// Compile schema
		const validate = ajv.compile(schema);

		// Get the input data for validation
		const items = this.getInputData();

		// Loop through each input item and validate against the schema
		const resultData: INodeExecutionData[] = [];

		for (const element of items) {
			const inputData = element.json;

			// Run validation
			const isValid = validate(inputData);

			if (!isValid) {
				return this.prepareOutputData([
					{
						json: {
							error: ajv.errorsText(validate.errors),
						},
					},
				]);
			}

			// If valid, push the item to the output data
			resultData.push(element);
		}

		// Return validated data
		return this.prepareOutputData(resultData);
	}
}
