from flask import Blueprint, request, jsonify
from pymongo import MongoClient
from datetime import datetime

quiz_api = Blueprint('quiz_api', __name__)

# MongoDB connection
client = MongoClient("mongodb+srv://malshaG:coastalCanopy-149-Malsha@cluster0.rqdby.mongodb.net/")
db = client['CoastalCanopy']
quiz_collection = db['quiz_scores']

@quiz_api.route('/api/submit-quiz', methods=['POST'])
def submit_quiz():
    data = request.json
    name = data.get("name")
    answers = data.get("answers")
    score = data.get("score")

    if not name or not answers or score is None:
        return jsonify({"message": "Missing data"}), 400

    quiz_collection.insert_one({
        "name": name,
        "answers": answers,
        "score": score,
        "submitted_at": datetime.now()
    })

    return jsonify({"message": "Quiz data submitted successfully"}), 200


