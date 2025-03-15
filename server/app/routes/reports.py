from flask import Blueprint, request, jsonify
from ultralytics import YOLO

from app.database import get_reports_collection
import base64
import os
from bson import ObjectId

reports_bp = Blueprint('reports', __name__)

#folder to save reports locally on the machine
FOLDER = "reports"
os.makedirs(FOLDER, exist_ok=True)

# Load the YOLO model once when the application starts
# model = YOLO('D:/MAL/IIT/2 year - 1 sem/SDGP/CoastalCanopy_CS149/server/app/routes/best.onnx', task="detect")

@reports_bp.route('/submit-report', methods=['POST'])
def submit_report():
    data = request.get_json()

    # Generate a unique ID for the report
    report_id = str(ObjectId())

    # Extract Base64 image string
    image_data = data.get("image", "")

    # Extract the Base64 part (removing metadata like "data:image/jpeg;base64,")
    _, encoded = image_data.split(",", 1)

    # Decode the Base64 string
    image_bytes = base64.b64decode(encoded)

    # Define the image path
    image_filename = f"{report_id}.jpg"  # Save as JPG
    image_path = os.path.join(FOLDER, image_filename)

    # Save the image to the folder
    with open(image_path, "wb") as image_file:
        image_file.write(image_bytes)

    # # Process the image using the YOLO model
    # try:
    #     detection_result = detect(image_path)
    # except Exception as e:
    #     return jsonify({"error": f"Failed to process image: {str(e)}"}), 500

    report = {
        "_id": report_id,
        "firstName": data.get("firstName"),
        "lastName": data.get("lastName"),
        "email": data.get("email"),
        "contactNumber": data.get("contactNumber"),
        "image": data.get("image"),
        "imagePath": image_path,
        "latitudes": data.get("latitudes"),
        "longitudes": data.get("longitudes"),
        "destructionType": data.get("destructionType"),
        # "detection_result": detection_result
    }

    reports_collection = get_reports_collection()
    result = reports_collection.insert_one(report)

    if result.acknowledged:
        return jsonify({"message": "Report submitted successfully!"}), 201
    else:
        return jsonify({"error": "Failed to submit report"}), 500


