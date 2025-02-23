export enum EleTypes {
  text = 'text',
  number = 'number',
  select = 'select',
  radio = 'radio',
}

export type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  errorMessages?: string
};

export type FormElement = {
  id: string;
  name: string;
  placeholder?: string;
  type: EleTypes.text | EleTypes.number | EleTypes.select | EleTypes.radio;
  label: string;
  value: string | number;
  options?: string[];
  validation?: ValidationRule;
  events?: {
    onChange?: (...args: unknown[]) => void;
    onBlur?: (...args: unknown[]) => void;
    onFocus?: (...args: unknown[]) => void;
  }
};
