import { useState } from 'react';
import { FormElement, EleTypes } from '../../types';

import './index.css';

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, type, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [id]: type === EleTypes.number ? +value : value,
    }));
  };

  const renderFormFields = (ele: FormElement) => {
    const { id, type, options } = ele;

    switch (type) {
      case EleTypes.text:
      case EleTypes.number: {
        return (
          <input
            id={id}
            type={type}
            value={formState[id]}
            onChange={handleChange}
          />
        );
      }
      case EleTypes.select: {
        return (
          <select id={id} value={formState[id]} onChange={handleChange}>
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
          <>
            {options?.map((option) => (
              <label key={`${id}-${option}`}>
                <input
                  id={id}
                  type={type}
                  name={id}
                  value={option}
                  checked={formState[id] === option}
                  onChange={handleChange}
                />
              </label>
            ))}
          </>
        );
      }
    }
  };

  return (
    <form>
      {formElements.map((ele) => (
        <div key={ele.id}>
          <label htmlFor={ele.id}>{ele.label}</label>
          {renderFormFields(ele)}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default FormBuilder;
