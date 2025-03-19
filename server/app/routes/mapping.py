from flask import Blueprint, jsonify, current_app

# Create a blueprint for mapping routes
mapping_bp = Blueprint('mapping', __name__)

@mapping_bp.route('/mangrove-locations', methods=['GET'])
def get_mangrove_locations():
    """
    Endpoint to get all mangrove locations from the database
    """
    try:
        # Get the mapping collection from the database
        mapping_collection = current_app.db.Mapping

        # Fetch all mangrove locations from the database
        mangrove_locations = list(mapping_collection.find({}, {'_id': 0}))

        # If no data is found in the database, return a 404 error
        if not mangrove_locations:
            return jsonify({"error": "No mangrove locations found"}), 404

        # Return the mangrove locations as JSON
        return jsonify(mangrove_locations)

    except Exception as e:
        # Return an error if something goes wrong
        return jsonify({"error": str(e)}), 500