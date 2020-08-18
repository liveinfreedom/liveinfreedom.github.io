import Ajv from 'ajv';
import { JSONSchemaBridge } from 'uniforms-bridge-json-schema';

// Типы полей: http://json-schema.org/understanding-json-schema/reference/type.html

const schema = {
    title: 'Guest',
    type: 'object',
    properties: {
        firstName: {
            type: 'string',
            title: 'Строка',
        },
        stringRegexp: {
            type: 'string',
            title: 'Строка с regexp',
            pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
        },
        stringDate: {
            type: 'string',
            title: 'Строка с regexp',
            pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
        },
        workExperience: {
            type: 'integer',
            title: 'Число',
            minimum: 0,
            maximum: 100,
        },
        policyAgreement: {
            type: 'boolean',
            title: 'Поле типа boolean',
            value: true
        },
        /*
        arrayField: {
            type: 'array',
            title: 'Поле типа array',
            description: 'description типа array',
            "items": [
                {
                    "type": "number",
                    "title": "Один"
                },
                {
                    "type": "number",
                    "title": "Два"
                },
            ]
        },

         */
    },
    required: ['firstName'],
};

const ajv = new Ajv({ allErrors: true, useDefaults: true });

function createValidator(schema: object) {
    const validator = ajv.compile(schema);

    return (model: object) => {
        validator(model);
        return validator.errors?.length ? { details: validator.errors } : null;
    };
}

const schemaValidator = createValidator(schema);

export const bridge = new JSONSchemaBridge(schema, schemaValidator);