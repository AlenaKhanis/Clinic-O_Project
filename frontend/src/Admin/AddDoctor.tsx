import { useState, useRef, useEffect } from 'react';
import {  Button, Alert } from 'react-bootstrap';
import { MDBCol, MDBInput } from 'mdb-react-ui-kit';
import { faEnvelope, faKey, faLock, faUser, faStethoscope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import '../css/Register.css';

//TODO: Add birthday field
//TODO: Add phone number field



  // repeted

const AddDoctor = ({BACKEND_URL} : {BACKEND_URL :   string}) => {
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [specialtyError, setSpecialtyError] = useState<string>("");
  const [registrationError, setRegistrationError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [fullNameError, setFullNameError] = useState<string>("");
  
  const usernameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const specialtyRef = useRef<HTMLInputElement>(null);
  const fullNameRef = useRef<HTMLInputElement>(null);

  
  // repeted
  const handleCheckUsername = () => {
    const username = usernameRef.current?.value;
    fetch(`${BACKEND_URL}/check-username?username=${username}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.exists) {
          setUsernameError("Username already exists");
        } else {
          setUsernameError("");
        }
      })
      .catch(error => {
        console.error('Error checking username:', error);
      });
  };

  const handleFullNameValidation = () => {
    const fullName = fullNameRef.current?.value || '';
    if (!fullName) {
        setFullNameError(""); 
    } else if (!/^[a-zA-Z ]+$/.test(fullName)) {
        setFullNameError("Full name must contain only letters");
    } else {
        setFullNameError("");
    }
    };

  const checkPasswordMatch = () => {
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };

  const handleEmailValidation = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = emailRef.current?.value || '';
    if (!email) {
      setEmailError("");
    } else if (!emailPattern.test(email)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordValidation = () => {
    const password = passwordRef.current?.value || '';
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordPattern.test(password)) {
      setPasswordError("Password must be at least 8 characters long and include both letters and numbers");
    } else {
      setPasswordError("");
    }
  };

  const handleSpecialtyValidation = () => {
    const specialty = specialtyRef.current?.value || '';
    if (!specialty) {
      setSpecialtyError("Specialty is required");
    } else {
      setSpecialtyError("");
    }
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = usernameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const specialty = specialtyRef.current?.value;
    const fullName = fullNameRef.current?.value;

    try {
      const response = await fetch(`${BACKEND_URL}/add_doctor`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fullName , username, email, password, specialty }),
      });

      if (!response.ok) {
        throw new Error('Failed to add doctor');
      }

      const result = await response.json();

      if (result.error) {
        setRegistrationError(result.error);
        setSuccess('');
      } else {
        setSuccess(result.message);
        setRegistrationError('');
      }
    } catch (error) {
      setRegistrationError('Failed to add doctor');
      setSuccess('');
    }
  };

  // repeted
  useEffect(() => {
    const fields = [usernameRef, emailRef, passwordRef, confirmPasswordRef, specialtyRef];
    const errors = [usernameError, passwordError, emailError, specialtyError , fullNameError];

    const areFieldsFilled = fields.every(field => !!field.current?.value);
    const areErrorsAbsent = errors.every(error => !error);

    setIsFormValid(areFieldsFilled && areErrorsAbsent);
  }, [usernameRef, emailRef, passwordRef, confirmPasswordRef, specialtyRef, usernameError, passwordError, emailError, specialtyError , fullNameError]);

  return (
    <div className='doctor-add-form'>
      <form onSubmit={handleRegister} className='form-add-doctor'>
        <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Add New Doctor</p>
        <div className='input-form-container'>
        <MDBCol md='6'>
                    <div className="d-flex flex-row align-items-center mb-4">
                        <FontAwesomeIcon icon={faUser} className="me-3" size="lg" />
                        <MDBInput
                            ref={fullNameRef}
                            placeholder='Full Name'
                            id='form5'
                            type='text'
                            className='w-100'
                            onBlur={() => handleFullNameValidation()}
                            style={{ borderColor: fullNameError ? 'red' : undefined }}
                        />
                    </div>
                    {fullNameError && <span style={{ color: 'red' }}>{fullNameError}</span>}
                </MDBCol>

        <MDBCol md='6'>
          <div className="d-flex flex-row align-items-center mb-4">
            <FontAwesomeIcon icon={faUser} className="me-3" size="lg" />
            <MDBInput
              ref={usernameRef}
              placeholder='Username'
              id='form1'
              type='text'
              className='w-100'
              onBlur={() => handleCheckUsername()}
              style={{ borderColor: usernameError ? 'red' : undefined }}
            />
          </div>
          {usernameError && <span style={{ color: 'red', margin: '30px' }}>{usernameError}</span>}
        </MDBCol>

        <MDBCol md='6'>
          <div className="d-flex flex-row align-items-center mb-4">
            <FontAwesomeIcon icon={faEnvelope} className="me-3" size="lg" />
            <MDBInput
              ref={emailRef}
              placeholder='Email'
              id='form2'
              type='email'
              onBlur={() => handleEmailValidation()}
              style={{ borderColor: emailError ? 'red' : undefined }}
            />
          </div>
          {emailError && <span style={{ color: 'red' }}>{emailError}</span>}
        </MDBCol>

        <MDBCol md='6'>
          <div className="d-flex flex-row align-items-center mb-4">
            <FontAwesomeIcon icon={faLock} className="me-3" size="lg" />
            <MDBInput
              ref={passwordRef}
              placeholder='Password'
              id='form3'
              type='password'
              onBlur={handlePasswordValidation}
              style={{ borderColor: passwordError ? 'red' : undefined }}
            />
          </div>
          <small className="text-muted">Password must be at least 8 characters long and include both letters and numbers</small>
        </MDBCol>

        <MDBCol md='6'>
          <div className="d-flex flex-row align-items-center mb-4">
            <FontAwesomeIcon icon={faKey} className="me-3 mt-n1" size="lg" />
            <MDBInput
              ref={confirmPasswordRef}
              placeholder='Repeat your password'
              id='form4'
              type='password'
              onBlur={() => checkPasswordMatch()}
              style={{ borderColor: passwordError ? 'red' : undefined }}
            />
          </div>
          {passwordError && <span style={{ color: 'red' }}>{passwordError}</span>}
        </MDBCol>

        <MDBCol md='6'>
          <div className="d-flex flex-row align-items-center mb-4">
            <FontAwesomeIcon icon={faStethoscope} className="me-3" size="lg" />
            <MDBInput
              ref={specialtyRef}
              placeholder='Specialty'
              id='form5'
              type='text'
              className='w-100'
              onBlur={handleSpecialtyValidation}
              style={{ borderColor: specialtyError ? 'red' : undefined }}
            />
          </div>
          {specialtyError && <span style={{ color: 'red' }}>{specialtyError}</span>}
        </MDBCol>
        </div>

        {registrationError && (
          <Alert variant="danger" onClose={() => setRegistrationError('')} dismissible>
            {registrationError}
          </Alert>
        )}
        {success && (
          <Alert variant="success" onClose={() => setSuccess('')} dismissible>
            {success}
          </Alert>
        )}
        <Button className='mb-4' size='lg' type='submit' disabled={!isFormValid}>Add Doctor</Button>
      </form>
    </div>
  );
};

export default AddDoctor;
