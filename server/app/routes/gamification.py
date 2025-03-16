#gamification
from flask import Blueprint, jsonify
from app.database import get_users_collection


gamification_bp = Blueprint("users", __name__)

@gamification_bp.route("/getRanks", methods=["GET"])
def get_points():
    users_collection = get_users_collection()

    leaderboard = users_collection.find({}, {"_id": 1, "username": 1, "points": 1, "avatar": 1, "color": 1}).sort("points", -1)

    ranked_users = []
    rank = 1
    previous_points = 0

    for index, user in enumerate(leaderboard):
        if previous_points != 0 and previous_points != user["points"]:
            rank = index + 1

        # Convert cursor to a list with necessary fields
        ranked_users.append({
            "rank": rank,
            "points": user["points"],
            "username": user["username"],
            "avatar":user.get("avatar", "/imgs/gamification/user2.png?width=60&height=60"),
        })

        previous_points = user["points"]


    return jsonify({"leaderboard": ranked_users}), 200



