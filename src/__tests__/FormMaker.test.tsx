import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormMaker from '../components/FormMaker';
import { saveFormToStorage, getFormFromStorage } from '../services';

// Mock the localStorage
const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock the services
jest.mock('../services', () => ({
    saveFormToStorage: jest.fn(),
    getFormFromStorage: jest.fn(),
}));

describe('FormMaker Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders FormMaker component with initial state', () => {
        render(<FormMaker />);

        // Check if tabs are present
        expect(screen.getByText('Form Maker')).toBeInTheDocument();
        expect(screen.getByText('Preview')).toBeInTheDocument();

        // Check if form name input is present
        expect(screen.getByPlaceholderText('Enter unique form name')).toBeInTheDocument();

        // Check if initial field is present
        expect(screen.getByText('Field 1')).toBeInTheDocument();
    });

    it('adds new field when "Add More Fields" button is clicked', () => {
        render(<FormMaker />);

        const addButton = screen.getByText('Add More Fields');
        fireEvent.click(addButton);

        expect(screen.getByText('Field 2')).toBeInTheDocument();
    });

    it('switches between maker and preview tabs', () => {
        render(<FormMaker />);

        const previewTab = screen.getByText('Preview');
        fireEvent.click(previewTab);

        // Check if preview content is visible
        expect(screen.getByTestId('preview-content')).toBeInTheDocument();

        const makerTab = screen.getByText('Form Maker');
        fireEvent.click(makerTab);

        // Check if form maker content is visible
        expect(screen.getByText('Form Name:')).toBeInTheDocument();
    });

    it('saves form data to localStorage when submitted', async () => {
        render(<FormMaker />);

        // Fill in form name
        const formNameInput = screen.getByPlaceholderText('Enter unique form name');
        await userEvent.type(formNameInput, 'Test Form');

        // Fill in field details
        const labelInput = screen.getByLabelText('Label:');
        await userEvent.type(labelInput, 'Test Field');

        // Submit form
        const submitButton = screen.getByText('Save Form');
        fireEvent.click(submitButton);

        expect(saveFormToStorage).toHaveBeenCalled();
    });

    it('loads saved form data when form name exists', () => {
        const mockFormData = [{
            id: 'test',
            name: 'test',
            label: 'Test Field',
            type: 'text',
            placeholder: 'Test placeholder',
            value: '',
            validation: { required: false },
            events: { onChange: () => { } }
        }];

        (getFormFromStorage as jest.Mock).mockReturnValue(mockFormData);

        render(<FormMaker />);

        const formNameInput = screen.getByPlaceholderText('Enter unique form name');
        fireEvent.change(formNameInput, { target: { value: 'Test Form' } });

        expect(getFormFromStorage).toHaveBeenCalledWith('Test Form');
    });
}); 