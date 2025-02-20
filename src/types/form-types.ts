export enum EleTypes {
    text = 'text',
    number = 'number',
    select = 'select',
    radio = 'radio',
  }
  
  export type FormElement = {
    id: string;
    type: EleTypes.text | EleTypes.number | EleTypes.select | EleTypes.radio;
    label: string;
    value: string | number;
    onChange?: (value: string) => void;
    options?: string[];
  };
  