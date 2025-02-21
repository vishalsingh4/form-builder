import { FormElement } from "../types";

export const validateFormField = (formElement: FormElement, value: string | number): string | null => { 
    const { validation, label } = formElement;
    if (!validation) {
        return null;
    }

    const { required, minLength, maxLength, min, max, pattern, errorMessages } = validation;

    if (required && !value) {
        return errorMessages ?? `${label} is required`;
    } 
   
    if(typeof value === 'string') {
        if (minLength && value.length < minLength) {
            return errorMessages ?? `${label} should be at least ${minLength} characters long`;
        }
        if (maxLength && value.length > maxLength) {
            return errorMessages ?? `${label} should not exceed ${maxLength} characters`;
        }
        if(pattern && !pattern.test(value)) {
            return errorMessages ?? `Invalid ${label}`;
        }
    } else if(typeof value === 'number') {
        if(min && value < min) {
            return errorMessages ?? `${label} should be greater than ${min}`;
        }
        if(max && value > max) {
            return errorMessages ?? `${label} should be less than ${max}`;
        }
    }

    return null;
}