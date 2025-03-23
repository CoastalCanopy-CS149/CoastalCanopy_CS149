from flask import Blueprint, request, jsonify
from ultralytics import YOLO
import cv2
import base64
import os
from bson import ObjectId
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import numpy as np
import io
from app.database import get_reports_collection

# Load environment variables
load_dotenv()

# Configure Cloudinary using .env variables
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

reports_bp = Blueprint('reports', __name__)

#folder to save reports locally on the machine
FOLDER = "reports"
# RESULTS_FOLDER = "results"
os.makedirs(FOLDER, exist_ok=True)
# os.makedirs(RESULTS_FOLDER, exist_ok=True)

# Get the directory where the current script is located
current_dir = os.path.dirname(os.path.abspath(__file__))

# Load the YOLO model
model_path = os.path.join(current_dir, 'best.onnx')
model = YOLO(model_path, task="detect")

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
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # Process the image using the YOLO model
    try:
        detection_result, result_image_url = detect(img , report_id)
        # delete_image(image_path)
    except Exception as e:
        return jsonify({"error": f"Failed to process image: {str(e)}"}), 500

    report = {
        "_id": report_id,
        "firstName": data.get("firstName"),
        "lastName": data.get("lastName"),
        "email": data.get("email"),
        "contactNumber": data.get("contactNumber"),
        "latitude": data.get("latitude"),
        "longitude": data.get("longitude"),
        "destructionType": data.get("destructionType"),
        "image": data.get("image"),
        "resultImageURL": result_image_url,
        "detection_result": detection_result
    }

    reports_collection = get_reports_collection()
    result = reports_collection.insert_one(report)

    if result.acknowledged:
        return jsonify({"message": "Report submitted successfully!", "report_id": report_id}), 201
    else:
        return jsonify({"error": "Failed to submit report"}), 500


def detect(image, report_id):
    # Run inference on the image
    results = model(image, conf=0.2)

    # Get the original image
    img = None
    for result in results:
        img = result.orig_img.copy()
        break

    if img is None:
        # If results doesn't contain any detection, use the input image
        img = image

    # Process results
    output = {
        "detections": [],
        "destruction_percentage": 0.0,
        "has_detections": False
    }

    total_pixels = img.shape[0] * img.shape[1]
    destruction_pixels = 0

    # Check if there are any detections
    if results and len(results) > 0 and len(results[0].boxes) > 0:
        output["has_detections"] = True

        for result in results:
            # Get detection boxes
            boxes = result.boxes

            for box in boxes:
                # Get box coordinates
                x1, y1, x2, y2 = box.xyxy[0]
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)

                # Get confidence and class
                conf = float(box.conf[0])
                cls = int(box.cls[0])

                # Calculate area of the box
                box_area = (x2 - x1) * (y2 - y1)
                destruction_pixels += box_area

                # Draw rectangle on image
                cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)

                # Add label
                label = f"Class {cls}: {conf:.2f}"
                cv2.putText(img, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

                # Add detection details to the output
                output["detections"].append({
                    "class": cls,
                    "confidence": conf,
                    "bbox": [x1, y1, x2, y2]
                })

        # Calculate destruction percentage
        output["destruction_percentage"] = (destruction_pixels / total_pixels) * 100
    else:
        # No detections found
        cv2.putText(img, "No mangrove destruction detected", (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

    # Convert OpenCV image (NumPy array) to bytes
    _, buffer = cv2.imencode(".jpg", img)
    image_bytes = io.BytesIO(buffer)

    # Upload to Cloudinary
    response = cloudinary.uploader.upload(image_bytes,
                                          public_id=f"result_{report_id}",
                                          folder="ReportResults",
                                          type="private")

    return output, response["secure_url"]







