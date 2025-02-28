from flask import Blueprint, request, jsonify
from app.database import get_reports_collection

reports_bp = Blueprint('reports', __name__)


@reports_bp.route('/submit-report', methods=['POST'])
def submit_report():
    data = request.get_json()
    report = {
        "firstName": data.get("firstName"),
        "lastName": data.get("lastName"),
        "email": data.get("email"),
        "contactNumber": data.get("contactNumber"),
        "image": data.get("image"),
        "latitudes": data.get("latitudes"),
        "longitudes": data.get("longitudes"),
        "destructionType": data.get("destructionType")
    }

    reports_collection = get_reports_collection()
    result = reports_collection.insert_one(report)

    if result.acknowledged:
        return jsonify({"message": "Report submitted successfully!"}), 201
    else:
        return jsonify({"error": "Failed to submit report"}), 500
