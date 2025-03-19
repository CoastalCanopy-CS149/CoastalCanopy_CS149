from flask import Flask, request, jsonify
from flask_cors import CORS
import paypalrestsdk
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)  # Allow frontend to access backend

# PayPal Client ID & Secret from the Developer Dashboard
PAYPAL_CLIENT_ID = "ASWSqzAfL5BGaI0wWhQe2ggkNz9YaGvMiScBT0m6tbQzRrtTpLYNNHKd6XpQuKdCXdkdD9NOcWT-azlB"
PAYPAL_SECRET = "EKDXNV9D1zbOhF1z9AcI8UIIwnArAknAYwZBSal25drIviKj0ALVQ76kfCrUgj5s7LOrz0xaZkn-N2SC"

# PayPal SDK Configuration
paypalrestsdk.configure({
    "mode": "sandbox",  # Change to "live" for real payments
    "client_id": PAYPAL_CLIENT_ID,
    "client_secret": PAYPAL_SECRET
})

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["shopDB"]
orders_collection = db["orders"]

# Create Payment Route
@app.route("/create-payment", methods=["POST"])
def create_payment():
    data = request.json
    total_price = data["total"]  # Get total amount from frontend

    # 🔹 Create PayPal Payment Object
    payment = paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {"payment_method": "paypal"},
        "redirect_urls": {
            "return_url": "http://localhost:5173/success",  # Redirect to frontend on success
            "cancel_url": "http://localhost:5173/cancel"
        },
        "transactions": [{
            "amount": {"total": str(total_price), "currency": "USD"},
            "description": "Mangrove Shop Purchase"
        }]
    })

    # Execute Payment
    if payment.create():
        for link in payment.links:
            if link["rel"] == "approval_url":
                return jsonify({"approval_url": link["href"]})  # Send approval link to React
    else:
        return jsonify({"error": payment.error}), 400

# Execute Payment Route
@app.route("/execute-payment", methods=["POST"])
def execute_payment():
    data = request.json
    payment_id = data["paymentID"]
    payer_id = data["payerID"]

    payment = paypalrestsdk.Payment.find(payment_id)
    if payment.execute({"payer_id": payer_id}):
        # Save Order in MongoDB
        orders_collection.insert_one({
            "payment_id": payment_id,
            "payer_id": payer_id,
            "status": "Completed"
        })
        return jsonify({"message": "Payment successful!"})
    else:
        return jsonify({"error": payment.error}), 400

if __name__ == "__main__":
    app.run(debug=True)
