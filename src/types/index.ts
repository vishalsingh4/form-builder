export * from './form-types';

export enum EleTypes {
    text = 'text',
    number = 'number',
    select = 'select',
    radio = 'radio',
}

interface ValidationBase {
    required: boolean;
    errorMessages: string[];
}

export interface TextValidation extends ValidationBase {
    minLength?: number;
    maxLength?: number;
}

export interface NumberValidation extends ValidationBase {
    min?: number;
    max?: number;
}

export interface SelectValidation extends ValidationBase { }

export type Validation = TextValidation | NumberValidation | SelectValidation;

export interface FormElement {
    id: string;
    name: string;
    placeholder: string;
    type: EleTypes;
    label: string;
    value: string | number;
    options?: string[];
    validation: Validation;
}
