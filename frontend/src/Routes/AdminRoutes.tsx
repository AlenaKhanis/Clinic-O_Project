
import { Routes, Route } from 'react-router-dom';
import AdminPage from '../Admin/AdminHomePage';
import { ProtectedRoute } from '../ProtectedRoute';
import DoctorProfile from '../Admin/DoctorProfile';
import PatientProfile from '../Admin/PatientNewProfile';
import AdminProfile from '../Admin/AdmimProfile';


/**
 * AdminRoutes component
 * Contains all the routes accessible to the admin user
 */

const AdminRoutes = ({ userRole , subID }: { userRole: string , subID : string | null}) => (
  <Routes>
    <Route
      path="/"
      element={
        <ProtectedRoute userRole={userRole} allowedRoles={['owner']}>
          <AdminPage />
        </ProtectedRoute>
      }
    />
    <Route
      path='doctor-profile/:doctorId'
      element={
        <ProtectedRoute userRole={userRole} allowedRoles={['owner']}>
          <DoctorProfile
            isOwner={true}
          />
        </ProtectedRoute>
      }
      />
      <Route
        path='/patient_detail/:patient_id'
        element={
          <ProtectedRoute userRole={userRole} allowedRoles={['owner']}>
            <PatientProfile
             isOwner={true}
              userRole={userRole}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path='admin_profile/:admin_id'
        element={
          <ProtectedRoute userRole={userRole} allowedRoles={['owner']}>
            <AdminProfile subId={subID}   />
          </ProtectedRoute>
        }
      />

  </Routes>
);

export default AdminRoutes;
