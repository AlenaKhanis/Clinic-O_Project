import React, { useState, useEffect, ChangeEvent} from 'react';
import { Modal, Button, Alert, Form } from 'react-bootstrap';
import { Doctor, Patient, Owner } from '../Types';
import { validateUsername, validateEmail, validateFullName, validatePhone, validateSpecialty } from '../validations'; 
import { useGlobalFunctions } from './useGlobalFunctions';
import { useBackendUrl } from '../BackendUrlContext';


type EditProfileProps = {
  profile: Doctor | Patient | Owner;
  onCancel: () => void;
  showEditModal: boolean;
  isOwner: boolean;
};

// Define the FormControlElement type
type FormControlElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/**
 * EditProfile component
 * handles the editing of user profiles within a modal
 * providing validation for fields and options based on the user's role (Doctor, Patient, or Owner). 
 */

const EditProfile: React.FC<EditProfileProps> = ({ profile, onCancel, showEditModal, isOwner }) => {

  const BACKEND_URL = useBackendUrl();

  const [editedProfile, setEditedProfile] = useState<Doctor | Patient | Owner>(profile);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertVariant, setAlertVariant] = useState<'success' | 'danger'>('success');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [changedFields, setChangedFields] = useState<{ [key: string]: boolean }>({});

  const { handleSaveChanges } = useGlobalFunctions();

  // Reset the edited profile and changed fields when the profile changes
  useEffect(() => {
    setEditedProfile(profile);
    setChangedFields({});
  }, [profile]);

  // Function to save changes to the profile
  const saveChanges = () => {
    handleSaveChanges(editedProfile, (message: string, variant: 'success' | 'danger') => {
      setAlertMessage(message);
      setAlertVariant(variant);
      setShowAlert(true);
    }, profile);
  };

  // Function to handle changes to the form fields
  const handleChange = async (e: ChangeEvent<FormControlElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));

    // Set the field as changed
    setChangedFields(prevChangedFields => ({
      ...prevChangedFields,
      [name]: true
    }));

    // Validate the field
    const validationErrors = { ...errors };

    if (name === 'full_name') {
      validationErrors.full_name = validateFullName(value);
    } else if (name === 'email') {
      validationErrors.email = validateEmail(value);
    } else if (name === 'phone') {
      validationErrors.phone = validatePhone(value);
    } else if (name === 'username') {
      validationErrors.username = await validateUsername(value, BACKEND_URL);
    } else if (name === 'specialty' && 'specialty' in profile) {
      validationErrors.specialty = validateSpecialty(value);
    } else if (name === 'package' && 'package' in profile) {
      
    }

    setErrors(validationErrors);
  };


  const handleCloseModal = () => {
    onCancel();
    setShowAlert(false);
    setAlertMessage(null);
    setAlertVariant('success');
    setErrors({});
  };

  // Type guards for Doctor
  const isDoctor = (profile: Doctor | Patient | Owner): profile is Doctor => {
    return (profile as Doctor).specialty !== undefined;
  };

  // Type guards for Patient
  const isPatient = (profile: Doctor | Patient | Owner): profile is Patient => {
    return (profile as Patient).package !== undefined;
  };

  // Package options for Patient
  const packageOptions = ["Silver", "Gold", "Premium"];

  // Specialty options for Doctor
  const specialties = [
    "Cardiology",
    "Dermatology",
    "Emergency Medicine",
    "Family Medicine",
    "Gastroenterology",
    "Neurology",
    "Oncology",
    "Pediatrics",
    "Psychiatry",
    "Radiology"
  ];

  return (
    <Modal show={showEditModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showAlert && <Alert variant={alertVariant} onClose={() => setShowAlert(false)} dismissible>{alertMessage}</Alert>}
        <Form>
          {/* Full Name */}
          <Form.Group controlId="formFullName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={editedProfile.full_name}
              onChange={handleChange}
              isInvalid={!!errors.full_name}
            />
            <Form.Control.Feedback type="invalid">{errors.full_name}</Form.Control.Feedback>
          </Form.Group>
          {/* Email */}
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={editedProfile.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
          {/* Phone */}
          <Form.Group controlId="formPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={editedProfile.phone}
              onChange={handleChange}
              isInvalid={!!errors.phone}
            />
            <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
          </Form.Group>
          {/* Username */}
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={editedProfile.username}
              onChange={handleChange}
              isInvalid={!!errors.username}
            />
            <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
          </Form.Group>
          {/* Specialty dropdown for Doctor */}
          {isDoctor(editedProfile) && isOwner && (
            <Form.Group controlId="formSpecialty">
              <Form.Label>Specialty</Form.Label>
              <Form.Select
                name="specialty"
                value={editedProfile.specialty || ""}
                onChange={handleChange}
                isInvalid={!!errors.specialty}
              >
                <option value="">Select specialty...</option>
                {specialties.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.specialty}</Form.Control.Feedback>
            </Form.Group>
          )}
          {/* Package dropdown for Patient */}
          {isPatient(editedProfile) && (
            <Form.Group controlId="formPackage">
              <Form.Label>Package</Form.Label>
              <Form.Select
                name="package"
                value={editedProfile.package || ""}
                onChange={handleChange}
                isInvalid={!!errors.package}
              >
                {packageOptions.map(option => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.package}</Form.Control.Feedback>
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={saveChanges}
          disabled={Object.keys(errors).some(key => errors[key]) || !Object.values(changedFields).some(field => field)}
        >
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditProfile;
