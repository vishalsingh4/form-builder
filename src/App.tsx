import FormBuilder from './components/FormBuilder';

import { EleTypes, FormElement } from './types';

import './App.css';

function App() {
  const formSchema: FormElement[] = [
    {
      id: 'name',
      type: EleTypes.text,
      label: 'Name',
      value: 'John Smith',
      validation: {
        required: true,
        minLength: 3,
        maxLength: 50,
        errorMessages: "First Name is required and should be between 2 and 50 characters"
      }
    },
    {
      id: 'age',
      type: EleTypes.number,
      label: 'Age',
      value: 20,
      validation: {
        required: true,
        min: 18,
        max: 60,
        errorMessages: "Age is required and should be between 18 and 60"
      }
    },
    {
      id: 'country',
      type: EleTypes.select,
      label: 'Country',
      value: 'India',
      options: ['USA', 'Canada', 'India', 'Australia'],
      validation: {
        required: true, 
        errorMessages: "Country is required"
      }
    },
    {
      id: 'gender',
      type: EleTypes.radio,
      label: 'Gender',
      value: 'Female',
      options: ['Male', 'Female', 'Others'],
      validation: { 
        required: true,
        errorMessages: "Gender is required"
      }
    },
  ];
  return (
    <>
      <h2>Form builder</h2>
      <FormBuilder formElements={formSchema} />
    </>
  );
}

export default App;
