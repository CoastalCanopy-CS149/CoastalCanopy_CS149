#gamification
from flask import Flask, request, jsonify, current_app, Blueprint
from app.database import get_app_users_collection


gamification_bp = Blueprint("users", __name__)

@gamification_bp.route("/getRanks", methods=["GET"])
def get_points():
    users_collection = get_app_users_collection()

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


@gamification_bp.route("/getDetails", methods=["POST"])
def get_details():
    data = request.get_json()  # Retrieve JSON payload from frontend

    if not data or "username" not in data:
        return jsonify({"error": "Username is required"}), 400  # Validate the request payload

    username = data.get('username')  # Extract username from the frontend requ

    # Access the 'Users' collection via the function
    users_collection = get_app_users_collection()

    # Find the user by username
    user = users_collection.find_one({'username': username})

    progress = (user["points"] /1000) * 100

    if user:
        user_details = [
            {
                "points": user["points"],
                "username": user["username"],
                "treesPlanted": user["treesPlanted"],
                "avatar": user.get("avatar", "/imgs/gamification/user2.png?width=60&height=60"),
                "progress": progress,
            }
        ]
        return jsonify(user_details)
    else:
        return jsonify({"error": "User not found"}), 404


@gamification_bp.route("/plantMangrove", methods=["POST"])
def reset_points():
    # Retrieve JSON payload from frontend
    data = request.get_json()

    if not data or "username" not in data:
        return jsonify({"error": "Username is required"}), 400  # Validate the request payload

    username = data.get('username')

    users_collection = get_app_users_collection()

    user = users_collection.find_one({'username': username})

    if user:
        # Decrease 1000 points and increase treesPlanted by 1
        users_collection.update_one(
            {'username': username},
            {
                '$inc': {'points': -1000, 'treesPlanted': 1}
            }
        )

        return jsonify({"success": "Points have decreased by -1000"}), 200
    else:
        return jsonify({"error": "User not found"}), 404

