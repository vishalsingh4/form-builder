import React, { useState } from "react";

import { FormElement, EleTypes } from "../../types";
import { debounce, validateFormField } from "../../utils";

import "./index.css";
import { DEBOUNCE_DELAY } from "../../constants";

interface FormBuilderProps {
  formElements: FormElement[];
}

const FormBuilder: React.FC<FormBuilderProps> = ({ formElements }) => {
  const [formState, setFormState] = useState(
    formElements.reduce((acc, ele) => {
      acc[ele.id] = ele.value;
      return acc;
    }, {} as Record<string, string | number>)
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, type, value } = e.target;

    setFormState((prevState) => ({
      ...prevState,
      [id]: type === EleTypes.number ? +value : value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let isValid = true;
    const errors: Record<string, string> = {};

    formElements.forEach((formElement) => {
      const error = validateFormField(formElement, formState[formElement.id]);
      if (error) {
        isValid = false;
        errors[formElement.id] = error;
      }
    });

    setErrors(errors);

    if (isValid) {
      console.log("Form submitted successfully", formState);
    }
    console.log(formState);
  };

  const renderFormFields = (ele: FormElement) => {
    const { id, name, placeholder, type, label, options, events } = ele;
    const debouncedOnChange = events?.onChange ? debounce(events.onChange, DEBOUNCE_DELAY) : null;

    const commonProps = {
      name, placeholder, label, onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        handleChange(e);

        if (debouncedOnChange) {
          // events.onChange!(e.target.value);
          debouncedOnChange(e.target.value);
        }
      }
    };

    switch (type) {
      case EleTypes.text:
      case EleTypes.number: {
        return (
          <input
            id={id}
            type={type}
            value={formState[id]}
            {...commonProps}
          />
        );
      }
      case EleTypes.select: {
        return (
          <select id={id} value={formState[id]} {...commonProps}>
            {options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      }
      case EleTypes.radio: {
        return (
          <div className="radio-group">
            {options?.map((option) => (
              <label key={`${id}-${option}`} className="radio-label">
                <input
                  id={id}
                  type={type}
                  value={option}
                  checked={formState[id] === option}
                  {...commonProps}
                />
                {option}
              </label>
            ))}
          </div>
        );
      }
    }
  };

  const renderErrorMessage = (id: string) => {
    if (errors[id]) {
      return <div className="error-message">{errors[id]}</div>;
    }

    return null;
  };

  const handleReset = () => {
    setFormState(
      formElements.reduce((acc, ele) => {
        acc[ele.id] = ele.value;
        return acc;
      },
        {} as Record<string, string | number>)
    );
    setErrors({});
  }

  return (
    <div className="form-container">
      <form onSubmit={handleFormSubmit}>
        {formElements.map((ele: FormElement) => (
          <div key={ele.id} className="form-group">
            <label htmlFor={ele.id}>{ele.label}</label>
            {renderFormFields(ele)}
            {renderErrorMessage(ele.id)}
          </div>
        ))}
        <button type="reset" onClick={handleReset}>Reset</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default FormBuilder;
