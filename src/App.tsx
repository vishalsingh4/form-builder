import FormBuilder from './components/FormBuilder';

import { EleTypes, FormElement } from './types';

import './App.css';

function App() {
  const formSchema: FormElement[] = [
    {
      id: 'name',
      type: EleTypes.text,
      label: 'Name',
      value: '',
    },
    {
      id: 'age',
      type: EleTypes.number,
      label: 'Number',
      value: 0,
    },
    {
      id: 'country',
      type: EleTypes.select,
      label: 'Country',
      value: 0,
      options: ['USA', 'Canada', 'India', 'Australia'],
    },
    {
      id: 'gender',
      type: EleTypes.radio,
      label: 'Gender',
      value: '',
      options: ['Male', 'Female', 'Others'],
    },
  ];
  return (
    <>
      <h1>Form builder</h1>
      <FormBuilder formElements={formSchema} />
    </>
  );
}

export default App;
