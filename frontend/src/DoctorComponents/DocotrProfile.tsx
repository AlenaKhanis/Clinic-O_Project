import { useEffect, useState } from "react";
import { Doctor, DoctorProps } from "../Types";
import ListGroup from 'react-bootstrap/ListGroup';
import '../css/doctorProfile.css';
import { useDoctorAppointments } from "../useFunctions/useDoctorAppointments";
import { Button } from "react-bootstrap";
import EditProfile from "../useFunctions/EditProfileProps";

function DoctorProfile({ doctorId}:  DoctorProps ) {
    const [selectedDoctorDetails, setSelectedDoctorDetails] = useState<Doctor | null>(null);
    const {getDoctorById} = useDoctorAppointments();
    const [showEditModal, setShowEditModal] = useState(false);
    

    
    useEffect(() => {
        if (doctorId) {
            getDoctorById(doctorId)
            .then((data: Doctor) => {
                setSelectedDoctorDetails(data);
            })
        }
    }, [doctorId ,showEditModal]); 

    return (
        <div>
            {selectedDoctorDetails ? (
                <>
                <ListGroup>
                    <h2>Doctor Profile</h2>
                    <ListGroup.Item>Full Name: {selectedDoctorDetails.full_name}</ListGroup.Item>
                    <ListGroup.Item>Username: {selectedDoctorDetails.username}</ListGroup.Item>
                    <ListGroup.Item>Age: {selectedDoctorDetails.age}</ListGroup.Item>
                    <ListGroup.Item>Email: {selectedDoctorDetails.email}</ListGroup.Item>
                    <ListGroup.Item>Phone: {selectedDoctorDetails.phone}</ListGroup.Item>
                    <ListGroup.Item>Specialty: {selectedDoctorDetails.specialty}</ListGroup.Item>
                    <Button variant='outline-dark' onClick={() => setShowEditModal(true)}>Edit</Button>
                </ListGroup>

                {selectedDoctorDetails && (
                     <EditProfile
                     profile={selectedDoctorDetails}
                     onCancel={() => setShowEditModal(false)}
                     showEditModal={showEditModal}
                     isOwner={false}
                   />
                )}
                </>
            ) : (
                <p>Loading doctor profile...</p>
            )}
        </div>
    );
}

export default DoctorProfile;
