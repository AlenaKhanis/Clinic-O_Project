from flask import Blueprint, jsonify, request
from psycopg2.extras import RealDictCursor

from db.db import get_db
from models.patient import Patient

bp = Blueprint("patient", __name__)

@bp.route("/get_patient_by_id/<patient_id>", methods=['GET'])
def get_patient_by_id(patient_id):
    """
    Retrieves a patient by their ID.
    """
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        patient = Patient.get_patient(cursor, patient_id)

        if patient:
            return jsonify(patient), 200
        else:
            return jsonify({"error": "Patient not found."}), 404
    except Exception as e:
        print(f"Error in get_patient_by_id: {e}")
        return jsonify({"error": "An error occurred while retrieving the patient."}), 500

@bp.route('/get_patient_doctors/<int:patient_id>')
def get_patient_doctors(patient_id):
    """
    Retrieves all doctors associated with a patient by patient_id.
    """
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        doctors = Patient.get_patient_doctors(cursor, patient_id)
        return jsonify(doctors), 200
    except Exception as e:
        return jsonify({"error": "An error occurred while retrieving doctors."}), 500

@bp.route('/get_patients')
def get_all_patients():
    """
    Retrieves a list of all patients.
    """
    try:
        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)
        patients = Patient.get_all_patients(cursor)
        return jsonify(patients), 200
    except Exception as e:
        print(f"Error in get_all_patients: {e}")
        return jsonify({"error": "An error occurred while retrieving patients."}), 500 
    
