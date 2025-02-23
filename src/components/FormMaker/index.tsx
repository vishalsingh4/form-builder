import React, { useState, useEffect, useCallback } from 'react';
import FormBuilder from '../FormBuilder';
import { EleTypes, FormElement, Validation, TextValidation, NumberValidation } from '../../types';
import { saveFormToStorage, getFormFromStorage, getAllFormsFromStorage, deleteFormFromStorage } from '../../services';
import './index.css';

// Demo form schema
const DEMO_FORM_SCHEMA: FormElement[] = [
    {
        id: 'name',
        name: 'name',
        placeholder: 'Enter your name',
        type: EleTypes.text,
        label: 'Name',
        value: '',
        validation: {
            required: true,
            minLength: 3,
            maxLength: 50,
            errorMessages: ["Name is required", "Name must be between 3 and 50 characters"]
        }
    },
    {
        id: 'age',
        name: 'age',
        placeholder: 'Enter your age',
        type: EleTypes.number,
        label: 'Age',
        value: 20,
        validation: {
            required: true,
            min: 18,
            max: 60,
            errorMessages: ["Age is required", "Age must be between 18 and 60"]
        }
    },
    {
        id: 'country',
        name: 'country',
        placeholder: 'Select your country',
        type: EleTypes.select,
        label: 'Country',
        value: 'India',
        options: ['USA', 'Canada', 'India', 'Australia'],
        validation: {
            required: true,
            errorMessages: ["Country is required"]
        }
    },
    {
        id: 'gender',
        name: 'gender',
        placeholder: 'Select your gender',
        type: EleTypes.radio,
        label: 'Gender',
        value: 'Female',
        options: ['Male', 'Female'],
        validation: {
            required: true,
            errorMessages: ["Gender is required"]
        }
    }
];

const generateUniqueId = (label: string): string => {
    return `${label.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 9)}`;
};

const DEFAULT_FORM_ELEMENT: FormElement = {
    id: '',
    name: '',
    placeholder: '',
    type: EleTypes.text,
    label: '',
    value: '',
    validation: {
        required: false,
        errorMessages: []
    }
};

const DEFAULT_OPTIONS = ['Option 1', 'Option 2', 'Option 3'];

type TabType = 'preview' | 'maker' | 'livePreview' | 'savedForms';

const FormMaker: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('preview');
    const [formName, setFormName] = useState('');
    const [formElements, setFormElements] = useState<FormElement[]>([DEFAULT_FORM_ELEMENT]);
    const [savedForms, setSavedForms] = useState<{ [key: string]: FormElement[] }>({});
    const [isSaving, setIsSaving] = useState(false);
    const [hasValidationError, setHasValidationError] = useState(false);
    const [collapsedFields, setCollapsedFields] = useState<number[]>([]);

    useEffect(() => {
        const forms = getAllFormsFromStorage();
        setSavedForms(forms);
    }, []);

    const debouncedSave = useCallback(
        (() => {
            let timeoutId: ReturnType<typeof setTimeout>;
            return (name: string, elements: FormElement[]) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    if (name && elements.length > 0) {
                        saveFormToStorage(name, elements);
                        setSavedForms(prev => ({ ...prev, [name]: elements }));
                    }
                }, 1000);
            };
        })(),
        []
    );

    useEffect(() => {
        if (formName && formElements.length > 0) {
            debouncedSave(formName, formElements);
        }
    }, [formName, formElements, debouncedSave]);

    const validateForm = (elements: FormElement[]): boolean => {
        return elements.every(element => element.label.trim() !== '');
    };

    const handleAddField = () => {
        if (!hasValidationError) {
            setFormElements([...formElements, { ...DEFAULT_FORM_ELEMENT }]);
        }
    };

    const toggleFieldCollapse = (index: number) => {
        setCollapsedFields(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const handleFormElementChange = (
        index: number,
        field: keyof FormElement,
        value: string | boolean | number | string[] | Partial<Validation>
    ) => {
        const updatedElements = [...formElements];
        const element = { ...updatedElements[index] };

        if (field === 'label') {
            const uniqueId = generateUniqueId(value as string);
            element.id = uniqueId;
            element.name = uniqueId;
            element.label = value as string;
        } else if (field === 'type') {
            const newValidation = {
                required: false,
                errorMessages: []
            };

            if (value === EleTypes.select || value === EleTypes.radio) {
                element.options = DEFAULT_OPTIONS;
            }

            element.type = value as EleTypes;
            element.validation = newValidation;
        } else if (field === 'validation') {
            element.validation = {
                ...element.validation,
                ...(value as Partial<Validation>)
            };
        } else if (field === 'options' && Array.isArray(value)) {
            element.options = value;
        } else if (field === 'value') {
            element.value = value as string | number;
        } else if (field === 'placeholder') {
            element.placeholder = value as string;
        }

        updatedElements[index] = element;
        const isValid = validateForm(updatedElements);
        setHasValidationError(!isValid);
        setFormElements(updatedElements);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName) {
            alert('Please enter a form name');
            return;
        }
        setIsSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            saveFormToStorage(formName, formElements);
            setSavedForms(prev => ({ ...prev, [formName]: formElements }));
            alert('Form saved successfully!');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteForm = (name: string) => {
        if (window.confirm('Are you sure you want to delete this form?')) {
            deleteFormFromStorage(name);
            const updatedForms = { ...savedForms };
            delete updatedForms[name];
            setSavedForms(updatedForms);
        }
    };

    const handleEditForm = (name: string) => {
        const form = getFormFromStorage(name);
        if (form) {
            setFormName(name);
            setFormElements(form);
            setActiveTab('maker');
        }
    };

    return (
        <div className="form-maker-container">
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('preview')}
                >
                    Preview Demo
                </button>
                <button
                    className={`tab ${activeTab === 'maker' ? 'active' : ''}`}
                    onClick={() => setActiveTab('maker')}
                >
                    Form Maker
                </button>
                <button
                    className={`tab ${activeTab === 'livePreview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('livePreview')}
                >
                    Live Preview
                </button>
                <button
                    className={`tab ${activeTab === 'savedForms' ? 'active' : ''}`}
                    onClick={() => setActiveTab('savedForms')}
                >
                    Saved Forms
                </button>
            </div>

            {activeTab === 'preview' && (
                <div className="preview-content" data-testid="preview-content">
                    <div className="preview-description">
                        <h2>This component was built using Dynamic Form Builder</h2>
                        <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('maker'); }}>
                            Try it yourself →
                        </a>
                    </div>
                    <FormBuilder formElements={DEMO_FORM_SCHEMA} />
                </div>
            )}

            {activeTab === 'maker' && (
                <div className="form-maker-content">
                    <div className="create-new-form-container">
                        <div className="preview-description">
                            <h2>Live Preview of your form in making. Check it out!</h2>
                            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('livePreview'); }}>
                                Form Live Preview →
                            </a>
                        </div>
                        <div className="preview-description">
                            <h2>Check out your saved forms here.</h2>
                            <a href="#" onClick={(e) => { e.preventDefault(); setActiveTab('savedForms'); }}>
                                Saved Forms →
                            </a>
                        </div>
                        <button
                            onClick={() => {
                                setFormName('');
                                setFormElements([{ ...DEFAULT_FORM_ELEMENT }]);
                                setActiveTab('maker');
                            }}
                            className="create-new-form-btn"
                        >
                            Create New Form
                        </button>
                    </div>
                    <form className="form-maker-form" onSubmit={handleSubmit}>
                        <div className="form-group form-name">
                            <label>Form Name:</label>
                            <input
                                type="text"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                placeholder="Enter unique form name"
                                required
                            />
                        </div>

                        {formElements.map((element, index) => (
                            <div
                                key={index}
                                className={`form-element-builder ${collapsedFields.includes(index) ? 'collapsed' : ''}`}
                            >
                                <h3 onClick={() => toggleFieldCollapse(index)}>
                                    Field {index + 1}: {element.label || ''}
                                </h3>
                                <div className="form-content">
                                    <div className="form-group">
                                        <label>Label:</label>
                                        <input
                                            type="text"
                                            value={element.label}
                                            onChange={(e) => handleFormElementChange(index, 'label', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Type:</label>
                                        <select
                                            value={element.type}
                                            onChange={(e) => handleFormElementChange(index, 'type', e.target.value)}
                                        >
                                            {Object.values(EleTypes).map((type) => (
                                                <option key={type} value={type}>
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Placeholder:</label>
                                        <input
                                            type="text"
                                            value={element.placeholder}
                                            onChange={(e) => handleFormElementChange(index, 'placeholder', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Default Value:</label>
                                        <input
                                            type={element.type === EleTypes.number ? 'number' : 'text'}
                                            value={element.value}
                                            onChange={(e) => handleFormElementChange(index, 'value', e.target.value)}
                                        />
                                    </div>

                                    {(element.type === EleTypes.select || element.type === EleTypes.radio) && (
                                        <div className="form-group">
                                            <label>Options (comma-separated):</label>
                                            <input
                                                type="text"
                                                value={element.options?.join(', ') || ''}
                                                onChange={(e) =>
                                                    handleFormElementChange(
                                                        index,
                                                        'options',
                                                        e.target.value.split(',').map(opt => opt.trim())
                                                    )
                                                }
                                                placeholder="Option 1, Option 2, Option 3"
                                            />
                                        </div>
                                    )}

                                    <div className="validation-section">
                                        <h4>Validation</h4>
                                        <div className="form-group">
                                            <label>Required:</label>
                                            <input
                                                type="checkbox"
                                                checked={element.validation.required}
                                                onChange={(e) =>
                                                    handleFormElementChange(index, 'validation', {
                                                        ...element.validation,
                                                        required: e.target.checked,
                                                    })
                                                }
                                            />
                                        </div>
                                        {element.type === EleTypes.text && (
                                            <>
                                                <div className="form-group">
                                                    <label>Min Length:</label>
                                                    <input
                                                        type="number"
                                                        value={(element.validation as TextValidation).minLength || 0}
                                                        onChange={(e) =>
                                                            handleFormElementChange(index, 'validation', {
                                                                ...element.validation,
                                                                minLength: parseInt(e.target.value),
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Max Length:</label>
                                                    <input
                                                        type="number"
                                                        value={(element.validation as TextValidation).maxLength || 100}
                                                        onChange={(e) =>
                                                            handleFormElementChange(index, 'validation', {
                                                                ...element.validation,
                                                                maxLength: parseInt(e.target.value),
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </>
                                        )}
                                        {element.type === EleTypes.number && (
                                            <>
                                                <div className="form-group">
                                                    <label>Min Value:</label>
                                                    <input
                                                        type="number"
                                                        value={(element.validation as NumberValidation).min || 0}
                                                        onChange={(e) =>
                                                            handleFormElementChange(index, 'validation', {
                                                                ...element.validation,
                                                                min: parseInt(e.target.value),
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Max Value:</label>
                                                    <input
                                                        type="number"
                                                        value={(element.validation as NumberValidation).max || 100}
                                                        onChange={(e) =>
                                                            handleFormElementChange(index, 'validation', {
                                                                ...element.validation,
                                                                max: parseInt(e.target.value),
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </>
                                        )}
                                        <div className="form-group">
                                            <label>Error Messages (comma-separated):</label>
                                            <textarea
                                                value={element.validation.errorMessages.join(', ')}
                                                onChange={(e) =>
                                                    handleFormElementChange(index, 'validation', {
                                                        ...element.validation,
                                                        errorMessages: e.target.value.split(',').map(msg => msg.trim()).filter(Boolean),
                                                    })
                                                }
                                                placeholder="Enter error messages separated by commas"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="form-actions">
                            <button
                                type="button"
                                onClick={handleAddField}
                                className="add-field-btn"
                                disabled={hasValidationError}
                                title={hasValidationError ? "Please fix validation errors before adding more fields" : ""}
                            >
                                Add More Fields
                            </button>
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isSaving || hasValidationError}
                            >
                                {isSaving ? 'Saving...' : 'Save Form'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'livePreview' && (
                <div className="preview-content" data-testid="live-preview-content">
                    <FormBuilder formElements={formElements} />
                </div>
            )}

            {activeTab === 'savedForms' && (
                <div className="saved-forms-content">
                    {Object.entries(savedForms).map(([name]) => (
                        <div key={name} className="form-card">
                            <div className="form-card-header">
                                <h3 onClick={() => handleEditForm(name)}>{name}</h3>
                                <div className="card-actions">
                                    <button
                                        onClick={() => handleEditForm(name)}
                                        className="icon-button edit"
                                        title="Edit"
                                    >
                                        &#9998;
                                    </button>
                                    <button
                                        onClick={() => handleDeleteForm(name)}
                                        className="icon-button delete"
                                        title="Delete"
                                    >
                                        &#10006;
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FormMaker; 