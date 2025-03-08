#gamification
from flask import Blueprint, jsonify
from app.database import get_users_collection


gamification_bp = Blueprint("users", __name__)

@gamification_bp.route("/getRanks", methods=["GET", "POST"])
def get_points():
    users_collection = get_users_collection()

    leaderboard = users_collection.find({}, {"_id": 1, "username": 1, "points": 1}).sort("points", -1)

    # Convert cursor to a list with necessary fields
    ranked_users = [
        {"id": str(user["_id"]), "username": user["username"], "points": user["points"]}
        for user in leaderboard
    ]

    return jsonify({"leaderboard": ranked_users}), 200



