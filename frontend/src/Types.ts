export type Patient = {
  id: number;
  patient_id: number;
  package: string;
  created_date: Date;
  updated_date: Date;
  username: string;
  full_name: string;
  age: number;
  email: string;
  phone: string;
  role: string;
  diagnosis: string | null;
  prescription: string | null;
};

export type Doctor = {
  appointments: any;
  id: number;
  doctor_id: number;
  specialty: string;
  created_date: Date;
  updated_date: Date;
  username: string;
  full_name: string;
  age: number;
  email: string;
  phone: string;
  role: string;
};

export type Owner = {
  id: number;
  owner_id: number;
  created_date: Date;
  updated_date: Date;
  username: string;
  full_name: string;
  age: number;
  email: string;
  phone: string;
  role: string;
}

export type Appointment =  {
  status: string;
  patient_id: number | null;
  id: number;
  date_time: string;
  summary?: string;
  written_diagnosis?: string;
  written_prescription?: string;
  date: string;
  time: string;
  doctor_id: number;
}

export type Clinic = {
  id: number;
  clinic_id: number;
  clinic_name: string;
  clinic_description: string;
  clinic_address: string;
  clinic_phone: string;
  clinic_email: string; 
  created_date: Date; 
  updated_date: Date; 
  owner_id: number;

}

export type DoctorProps = {
  doctorId: number | null;
  onAppointmentAdded: () => void;
};

