from flask import Blueprint, request, jsonify, current_app
from ultralytics import YOLO
import cv2
import base64
import os
from bson import ObjectId
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
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

#folder to save reports locally on the machine
FOLDER = "reports"
os.makedirs(FOLDER, exist_ok=True)


# Get the directory where the current script is located
current_dir = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(current_dir, 'best.onnx')
# Load the YOLO model once when the application starts
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

    # Define the image path
    image_filename = f"{report_id}.jpg"
    image_path = os.path.join(FOLDER, image_filename)

    # Save the image to the folder
    with open(image_path, "wb") as image_file:
        image_file.write(image_bytes)

    # Process the image using the YOLO model
    try:
        detection_result, result_image_path, class_name = detect(image_path, report_id)
        delete_image(image_path)

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
        "resultImagePath": result_image_path,
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


def detect(image_path, report_id):
    class_name = None
    # Run inference on the image
    results = model(image_path, conf=0.2)

    # Get the original image
    img = None
    for result in results:
        img = result.orig_img.copy()
        break

    if img is None:
        # If results doesn't contain any detection, load the image directly
        img = cv2.imread(image_path)

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
        # Add text indicating no mangrove destruction detected
        cv2.putText(img, "No mangrove destruction detected", (20, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)


    # Convert OpenCV image (NumPy array) to bytes
    _, buffer = cv2.imencode(".jpg", img)  # Encode image to JPEG format
    image_bytes = io.BytesIO(buffer)  # Create an in-memory buffer

    # Define the Cloudinary filename using report_id
    cloudinary_filename = f"result_{report_id}"

    # Upload to Cloudinary with a custom name to the Reports folder
    response = cloudinary.uploader.upload(image_bytes,
                                          public_id=cloudinary_filename,
                                          folder="ReportResults",
                                          type="private",
                                          )


    return output, response["secure_url"], class_name

def delete_image(image_path):
    try:
        if os.path.exists(image_path):
            os.remove(image_path)
            print(f"{image_path} has been deleted successfully.")
        else:
            print(f"The file {image_path} does not exist.")
    except Exception as e:
        print(f"Error deleting file: {e}")




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





