import { toZonedTime, format } from 'date-fns-tz';
import { Appointment, Doctor, Owner, Patient } from "../Types";
import { useBackendUrl } from '../BackendUrlContext';
import { useNavigate } from 'react-router-dom';


//useGlobalFunctionsprovides several functions and type guards for handling profile updates
//date-time parsing, and user deletions.

export const useGlobalFunctions = () => {
    const navigate = useNavigate();
    const BACKEND_URL = useBackendUrl();

    // Function to parse and format date-time for appointments
    const parseDateTime = (data: Appointment[]): Appointment[] => {
        return data.map(appointment => {
            const date = new Date(appointment.date_time);
            const zonedDate = toZonedTime(date, 'Etc/UTC');
            return {
                ...appointment,
                date: format(zonedDate, 'dd.MM.yyyy', { timeZone: 'Etc/UTC' }),
                time: format(zonedDate, 'HH:mm', { timeZone: 'Etc/UTC' })
            };
        });
    };

    // Function to handle saving changes to a profile for a doctor, patient, or owner edit
    const handleSaveChanges = async (
        editedProfile: Doctor | Patient | Owner,
        setAlert: (message: string, variant: 'success' | 'danger') => void,
        originalProfile: Doctor | Patient | Owner
        ) => {
            if (!editedProfile || !originalProfile) {
              setAlert('Invalid profile data', 'danger');
              return;
        }
      
        try {
          // Initialize an empty object for editedFields with a type that combines Doctor, Patient, and Owner.  
          const editedFields: Partial<Doctor & Patient & Owner> = {};
          // Iterate over the keys of editedProfile after casting them to the appropriate type
          (Object.keys(editedProfile) as (keyof typeof editedProfile)[]).forEach(key => {
            // Check if the current key's value in editedProfile differs from that in originalProfile
            if (editedProfile[key] !== originalProfile[key]) {
              // If the value has changed, assign it to the editedFields object
              // The value is cast to a type that could belong to Doctor, Patient, or Owner
              editedFields[key] = editedProfile[key] as Doctor[keyof Doctor] & Patient[keyof Patient] & Owner[keyof Owner];
            }
          });
          
          // Determine the URL based on the profile type
          let url = '';
          if (isDoctorProfile(editedProfile)) {
            url = `${BACKEND_URL}/edit_user_profile/${editedProfile.doctor_id}`;
          } else if (isPatientProfile(editedProfile)) {
            url = `${BACKEND_URL}/edit_user_profile/${editedProfile.patient_id}`;
          } else if (isOwnerProfile(editedProfile)) {
            url = `${BACKEND_URL}/edit_user_profile/${editedProfile.owner_id}`;
          } else {
            throw new Error('Invalid profile type');
          }
      
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editedFields),
          });
      
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
      
          const data = await response.json();
          setAlert('Profile updated successfully', 'success');
          return data;
        } catch (error) {
          console.error('Error updating profile:', error);
          setAlert('Error updating profile', 'danger');
          throw error;
        }
    };

    // Type guards for determining profile types
    function isDoctorProfile(profile: Doctor | Patient | Owner): profile is Doctor {
        return 'doctor_id' in profile;
    }

    function isPatientProfile(profile: Doctor | Patient | Owner): profile is Patient {
        return 'patient_id' in profile;
    }

    function isOwnerProfile(profile: Doctor | Patient | Owner): profile is Owner {
        return 'owner_id' in profile;
    }

    // Function to handle deleting a user
    const handleDeleteUser = (
        id: number,
        setAlertMessage: (message: string) => void,
        setAlertVariant: (variant: 'success' | 'danger') => void,
        setShowAlert: (show: boolean) => void,
    ) => {
        fetch(`${BACKEND_URL}/delete_user/${id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setAlertMessage('Doctor deleted successfully');
            setAlertVariant('success');
            setShowAlert(true);
            setTimeout(() => {
              navigate('/admin');
            }, 2000);
        })
        
        .catch((error) => {
            console.error('Error deleting doctor:', error);
            setAlertMessage('Error deleting doctor');
            setAlertVariant('danger');
            setShowAlert(true);
        })

    };


    return {
        parseDateTime,
        handleSaveChanges,
        handleDeleteUser
    };
};
