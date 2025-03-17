from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Mangrove location data
mangrove_locations = [
    {"id": 1, "name": "Kochchikade Mangroves", "bounds": [[7.205, 79.985], [7.21, 79.99]], "labelPos": [7.2075, 79.9875]},
    {"id": 2, "name": "Negombo Lagoon Mangroves", "bounds": [[7.185, 79.870], [7.19, 79.875]], "labelPos": [7.1875, 79.8725]},
    {"id": 3, "name": "Peliyagoda Mangroves", "bounds": [[7.195, 79.875], [7.20, 79.88]], "labelPos": [7.1975, 79.8775]},
    {"id": 4, "name": "Thimbiri Uyana Mangroves", "bounds": [[7.165, 79.840], [7.17, 79.845]], "labelPos": [7.1675, 79.8425]},
    {"id": 5, "name": "Pamunugama Mangroves", "bounds": [[7.215, 79.890], [7.22, 79.895]], "labelPos": [7.2175, 79.8925]},
    {"id": 6, "name": "Wattala Mangroves", "bounds": [[7.175, 79.950], [7.18, 79.955]], "labelPos": [7.1775, 79.9525]},
    {"id": 7, "name": "Muthurajawela Mangroves", "bounds": [[7.075, 79.975], [7.08, 79.98]], "labelPos": [7.0775, 79.9775]},
    {"id": 8, "name": "Bopitiya Mangroves", "bounds": [[7.155, 79.945], [7.16, 79.95]], "labelPos": [7.1575, 79.9475]},
    {"id": 9, "name": "Seeduwa Mangroves", "bounds": [[7.105, 79.925], [7.11, 79.93]], "labelPos": [7.1075, 79.9275]},
    {"id": 10, "name": "Katunayake Mangroves", "bounds": [[7.130, 79.980], [7.135, 79.985]], "labelPos": [7.1325, 79.9825]}
]

@app.route('/api/mangrove-locations', methods=['GET'])
def get_mangrove_locations():
    """API endpoint to get all mangrove locations"""
    return jsonify(mangrove_locations)

@app.route('/api/mangrove-locations/<int:location_id>', methods=['GET'])
def get_mangrove_location(location_id):
    """API endpoint to get a specific mangrove location by ID"""
    location = next((loc for loc in mangrove_locations if loc["id"] == location_id), None)
    if location:
        return jsonify(location)
    return jsonify({"error": "Location not found"}), 404

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)