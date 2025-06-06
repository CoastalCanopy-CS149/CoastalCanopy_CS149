from flask import Flask, request, jsonify, current_app, Blueprint
from app.database import get_app_users_collection

points_bp = Blueprint('points', __name__)

# Route to increase points for a user
@points_bp.route('/Increase_points', methods=['POST'])
def increase_points():
    try:
        # Get data from frontend
        data = request.get_json()
        username = data.get('username')
        points = int(data.get('points', 0))

        # Access the 'Users' collection via the function
        users_collection = get_app_users_collection()

        # Find the user by username
        user = users_collection.find_one({'username': username})

        if user:
            current_points = int(user.get('points', '0'))
            # If user exists, add points to their current points
            new_points = current_points + points
            users_collection.update_one(
                {'username': username},
                {'$set': {'points': new_points}}
            )
            return jsonify({'message': 'Points increased successfully!', 'points': new_points}), 200
        else:
            return jsonify({'message': 'User not found'}), 404

    except Exception as e:
        return jsonify({'message': 'Error: ' + str(e)}), 500
