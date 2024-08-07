import { useState } from 'react';
import { Link } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { FiAlignJustify } from "react-icons/fi";
import '../css/OffCanvas.css';



interface OffCanvasExampleProps {
  placement?: 'start' | 'end' | 'top' | 'bottom';
  role: string; // 'owner' | 'doctor' | 'patient';
  subId : string | null;
}

/**
 * OffCanvasExample component displays an off-canvas menu triggered by a button click.
 * It shows different links based on the user's role (owner, doctor, patient).
 */

export function OffCanvasExample({ subId, placement = 'end', role}: OffCanvasExampleProps) {
  const [show, setShow] = useState(false);


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

 
  return (
    <>
      <Button style={{ width: 'fit-content', margin: '20px' }} variant="outline-light" onClick={handleShow} className="me-2">
        <FiAlignJustify />
      </Button>
      <Offcanvas className="my-offcanvas" show={show} onHide={handleClose} placement={placement} >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title className="offcanvas-title">Clinic-O</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {role === 'owner' && <Link to={`/admin/admin_profile/${subId}`}>My Profile</Link>}
          {role === 'doctor' && <Link to={`/doctor/doctor_profile/${subId}`}>My Profile</Link>}
          {role === 'patient' && <Link to={`/patient/patient_profile/${subId}`}>My Profile</Link>}
          {role !== 'owner' && role !== 'doctor' && role !== 'patient' && <span></span>}
          <Link to="/">Home</Link>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
