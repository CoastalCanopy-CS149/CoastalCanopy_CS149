from flask import Blueprint, request, jsonify, current_app
from ultralytics import YOLO
import cv2
import base64
import os
import psutil
from bson import ObjectId
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
import numpy as np
import io
from app.database import get_reports_collection
from app.config import RECEIVER_EMAIL
from flask_mail import Message

# Load environment variables
load_dotenv()

# Configure Cloudinary using .env variables
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)


reports_bp = Blueprint('reports', __name__)

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

    #resize the image to smaller resolution
    img = cv2.resize(img, (640, 640))

    # Log memory usage
    process = psutil.Process(os.getpid())
    print(f"Memory usage before inference: {process.memory_info().rss / 1024 / 1024} MB")

    # Process the image using the YOLO model
    try:
        detection_result, result_image_url, class_name = detect(img , report_id)
    except MemoryError:
        return jsonify({"error": "Insufficient memory to process the image"}), 500
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
        if class_name == "Mangrove_Destruction":
            send_email(report)
        return jsonify({"message": "Report submitted successfully!", "report_id": report_id}), 201

    else:
        return jsonify({"error": "Failed to submit report"}), 500


def detect(image, report_id):
    class_name = None

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
                class_name = model.names[cls]

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


    return output, response["secure_url"], class_name


def send_email(data):
    try:
        recipient_email = RECEIVER_EMAIL  # Static recipient for the report
        subject = "New Report Submitted"
        message_body = f"""
         First Name: {data.get('firstName')}
         Last Name: {data.get('lastName')}
         Email: {data.get('email')}
         Contact Number: {data.get('contactNumber')}
         Latitude: {data.get('latitude')}
         Longitude: {data.get('longitude')}
         Destruction Type: {data.get('destructionType')}
         Detection Result: {data.get('detection_result')}
         Result Image URL: {data.get('resultImageURL')}
         """

        with current_app.app_context():  # Ensure app context is active
            msg = Message(subject=subject,
                          sender=os.getenv("MAIL_USERNAME"),
                          recipients=[recipient_email])
            msg.body = message_body

            current_app.extensions['mail'].send(msg)
            print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")





def send_email(data):
    try:
        recipient_email = RECEIVER_EMAIL # Static recipient for the report
        subject = "New Report Submitted"
        message_body = f"""
        First Name: {data.get('firstName')}
        Last Name: {data.get('lastName')}
        Email: {data.get('email')}
        Contact Number: {data.get('contactNumber')}
        Latitude: {data.get('latitude')}
        Longitude: {data.get('longitude')}
        Destruction Type: {data.get('destructionType')}
        Detection Result: {data.get('detection_result')}
        Result Image Path: {data.get('result_image_path')}
        """

        with current_app.app_context():  # Ensure app context is active
            msg = Message(subject=subject,
                          sender=os.getenv("MAIL_USERNAME"),
                          recipients=[recipient_email])
            msg.body = message_body

            current_app.extensions['mail'].send(msg)
            print("Email sent successfully!")
    except Exception as e:
        print(f"Failed to send email: {e}")





