import { FormElement } from '../types';

interface FormData {
    [formName: string]: FormElement[];
}

export const saveFormToStorage = (formName: string, formSchema: FormElement[]): void => {
    try {
        const existingData = localStorage.getItem('formBuilderData');
        const formData: FormData = existingData ? JSON.parse(existingData) : {};

        formData[formName] = formSchema;
        localStorage.setItem('formBuilderData', JSON.stringify(formData));
    } catch (error) {
        console.error('Error saving form to storage:', error);
    }
};

export const getFormFromStorage = (formName: string): FormElement[] | null => {
    try {
        const existingData = localStorage.getItem('formBuilderData');
        if (!existingData) return null;

        const formData: FormData = JSON.parse(existingData);
        return formData[formName] || null;
    } catch (error) {
        console.error('Error getting form from storage:', error);
        return null;
    }
};

export const getAllFormsFromStorage = (): { [key: string]: FormElement[] } => {
    try {
        const existingData = localStorage.getItem('formBuilderData');
        return existingData ? JSON.parse(existingData) : {};
    } catch (error) {
        console.error('Error getting all forms from storage:', error);
        return {};
    }
};

export const deleteFormFromStorage = (formName: string): void => {
    try {
        const existingData = localStorage.getItem('formBuilderData');
        if (!existingData) return;

        const formData: FormData = JSON.parse(existingData);
        delete formData[formName];
        localStorage.setItem('formBuilderData', JSON.stringify(formData));
    } catch (error) {
        console.error('Error deleting form from storage:', error);
    }
};

export const updateFormInStorage = (formName: string, formSchema: FormElement[]): void => {
    saveFormToStorage(formName, formSchema);
}; 