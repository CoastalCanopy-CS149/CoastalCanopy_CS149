from flask import Blueprint, request, jsonify,current_app
from app.config import DATABASE_NAME

quiz_api = Blueprint('quiz_api', __name__)

@quiz_api.route('/api/submit-quiz', methods=['POST'])
def submit_quiz():

    try:
        # Get data from request body
        data = request.json
        score = data.get("score")

        if score is None:
             return jsonify({"error": "Missing score"}), 400

        # Get reference to education collection
        quiz_collection = current_app.db.education

        # Insert quiz submission into the database
        quiz_collection.insert_one({
            "score" : score
         })
        return jsonify({"message": "Quiz data submitted successfully"}), 200

    except Exception as e:
            return jsonify({"error": str(e)}), 500







