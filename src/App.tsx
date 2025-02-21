import FormBuilder from './components/FormBuilder';

import { EleTypes, FormElement } from './types';

import './App.css';

function App() {
  const formSchema: FormElement[] = [
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
        errorMessages: "First Name is required and should be between 2 and 50 characters"
      },
      events: {
        onChange: (value) => {
          console.log('Name changed to', value);
        }
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
        errorMessages: "Age is required and should be between 18 and 60"
      },
      events: {
        onChange: (value) => {
          console.log('Age changed to', value);
        }
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
        errorMessages: "Country is required"
      },
      events: {
        onChange: (value) => {  
          console.log('Country changed to', value);
        }
      }
    },
    {
      id: 'gender',
      name: 'gender',
      placeholder: 'Select your gender',
      type: EleTypes.radio,
      label: 'Gender',
      value: 'Female',
      options: ['Male', 'Female', 'Others'],
      validation: { 
        required: true,
        errorMessages: "Gender is required"
      },
      events: {
        onChange: (value) => {  
          console.log('Gender changed to', value);
        }
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
