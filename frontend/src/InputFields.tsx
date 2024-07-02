import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputGroup, FormControl } from 'react-bootstrap';

interface InputFieldProps {
  icon: any;
  placeholder: string;
  type: string;
  error: string;
  setError: (error: string) => void;
  validationFunction: (value: string) => Promise<string> | string;
  onChange: (value: string) => void; // New prop for onChange event
}


/*
InputField component
Validating on blur provides immediate feedback to the user, letting them know if they've made a mistake as soon as they move to the next field.
*/

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ icon, placeholder, type, error, setError, validationFunction, onChange }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);

    /*
    useImperativeHandle allows the InputField component to control what the parent component can access
    when it attaches a ref to the InputField. It customizes the value that the parent gets when it uses the ref.
    */
    useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    //Validating on blur provides immediate feedback to the user, letting them know if they've made a mistake as soon as they move to the next field.
    const handleBlur = async (event: React.FocusEvent<HTMLInputElement>) => {
      const { value } = event.target;
      const errorMessage = await validationFunction(value);
      setError(errorMessage);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      onChange(value); 
    };

    return (
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FontAwesomeIcon icon={icon} />
        </InputGroup.Text>
        <FormControl
          type={type}
          placeholder={placeholder}
          ref={inputRef}
          onBlur={handleBlur}
          onChange={handleChange}
          isInvalid={!!error}
        />
        <FormControl.Feedback type="invalid">
          {error}
        </FormControl.Feedback>
      </InputGroup>
    );
  }
);

export default InputField;
