from flask import Flask, jsonify
from flask_cors import CORS
import os
import numpy as np
import rasterio
from supabase import create_client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Supabase client
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')
supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

app = Flask(__name__)
CORS(app)  # Enable CORS

# Temporary directory for downloaded files
temp_dir = "temp_data"
os.makedirs(temp_dir, exist_ok=True)

@app.route('/api/mangrove-data', methods=['GET'])
def get_mangrove_data():
    """Endpoint to fetch mangrove data"""
    try:
        # Step 1: Download TIF files from Supabase
        tif_files = download_tif_files()

        if not tif_files:
            return jsonify({"error": "No TIF files found in the bucket."}), 404

        # Step 2: Analyze mangrove areas
        current_areas = analyze_mangrove_area(tif_files)

        # Step 3: Predict future mangrove areas
        predicted_areas = predict_future_mangrove(current_areas)

        # Prepare response data
        data = []
        for area_name in current_areas.keys():
            data.append({
                'area': area_name,
                'area_2015': float(current_areas[area_name]),
                'predicted_area_2026': float(predicted_areas[area_name])
            })

        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def download_tif_files():
    """Download TIF files from Supabase bucket"""
    print("Downloading TIF files from Supabase...")

    # List files in the '2015' folder of the 'mangrove-data' bucket
    response = supabase.storage.from_('mangrove-data').list('2015')

    tif_files = []
    for file in response:
        if file['name'].endswith('.tif'):
            file_path = os.path.join(temp_dir, file['name'])

            # Download the file
            with open(file_path, 'wb+') as f:
                file_data = supabase.storage.from_('mangrove-data').download(f"2015/{file['name']}")
                f.write(file_data)

            tif_files.append(file_path)
            print(f"Downloaded: {file['name']}")

    return tif_files

def analyze_mangrove_area(tif_files):
    """Analyze mangrove areas from TIF files"""
    print("Analyzing mangrove areas...")

    areas = {}
    for file_path in tif_files:
        file_name = os.path.basename(file_path)
        area_name = file_name.split('_')[0]  # Extract area name from file name

        with rasterio.open(file_path) as src:
            image = src.read(1)  # Read the first band
            mangrove_mask = image > 0  # Mask for mangrove areas
            mangrove_pixels = np.sum(mangrove_mask)

            # Calculate area in square kilometers
            pixel_area_sq_meters = src.res[0] * src.res[1]
            area_sq_km = (mangrove_pixels * pixel_area_sq_meters) / 1000000

            areas[area_name] = area_sq_km

    return areas

def predict_future_mangrove(areas, target_year=2026):
    """Predict future mangrove areas using linear extrapolation"""
    print("Predicting future mangrove areas...")

    predicted_areas = {}
    for area_name, area_value in areas.items():
        annual_change_factor = np.random.uniform(0.95, 1.05)  # Random change factor
        years_difference = target_year - 2015
        predicted_value = area_value * (annual_change_factor ** years_difference)
        predicted_areas[area_name] = predicted_value

    return predicted_areas

if __name__ == '__main__':
    app.run(debug=True)