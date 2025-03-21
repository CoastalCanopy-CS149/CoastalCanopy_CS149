from flask import Blueprint, jsonify, request
import os
import glob
import rasterio
import numpy as np  # Make sure to import numpy
from rasterio.mask import mask
import geopandas as gpd
import json
from shapely.geometry import shape
from sklearn.linear_model import LinearRegression
import numpy as np


monitoring_bp = Blueprint('monitoring', __name__)

# Function to clip raster images
def clip_raster(image_path, shapefile, output_path):
    with rasterio.open(image_path) as src:
        out_image, out_transform = mask(src, shapefile.geometry, crop=True)
        out_meta = src.meta
        out_meta.update({
            "height": out_image.shape[1],
            "width": out_image.shape[2],
            "transform": out_transform
        })
        with rasterio.open(output_path, "w", **out_meta) as dest:
            dest.write(out_image)

# Function to calculate mangrove extent
def calculate_mangrove_extent(image_path):
    try:
        with rasterio.open(image_path) as src:
            data = src.read(1)  # Read the first band
            mangrove_pixels = np.count_nonzero(data)  # Count non-zero pixels
            return mangrove_pixels
    except Exception as e:
        print(f"Error processing {image_path}: {str(e)}")
        return None

# Function to convert pixel count to area (in square meters)
def convert_pixels_to_area(pixel_count, pixel_area=900):
    return pixel_count * pixel_area  # Default pixel area is 900 m² (30m x 30m)

# Function to predict future mangrove extent using linear regression
@monitoring_bp.route('/predict-future-mangrove-extent', methods=['GET'])
def predict_future_mangrove_extent():
    try:
        # Historical data for mangrove areas (example data)
        mangrove_areas = {
            2015: 500000,  # Area in square meters
            2016: 490000,
            2017: 480000,
            2018: 470000,
            2019: 460000,
            2020: 450000,
        }

        # Prepare data for linear regression
        years = np.array(list(mangrove_areas.keys())).reshape(-1, 1)
        areas = np.array(list(mangrove_areas.values()))

        # Fit a linear regression model
        model = LinearRegression()
        model.fit(years, areas)

        # Predict future areas for the next 5 years
        future_years = np.array([2024, 2025, 2026, 2027, 2028]).reshape(-1, 1)
        future_areas = model.predict(future_years)

        # Prepare the predictions as a dictionary with integer keys and values
        predictions = {int(year): float(area) for year, area in zip(future_years.flatten(), future_areas)}

        return jsonify({
            "message": "Future mangrove extent predictions completed",
            "predictions": predictions
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Define a function to get historical data and future predictions
@monitoring_bp.route('/mangrove-data', methods=['GET'])
def get_mangrove_data():
    try:
        # Historical mangrove area data
        mangrove_areas = {
            2015: 500000,  # Example historical areas (in square meters)
            2016: 495000,
            2017: 490000,
            2018: 485000,
            2019: 480000,
            2020: 475000,
            2021: 470000,
        }

        # Prepare data for linear regression to predict future mangrove extent
        years = np.array(list(mangrove_areas.keys())).reshape(-1, 1)
        areas = np.array(list(mangrove_areas.values()))

        # Fit a linear regression model to predict future areas
        model = LinearRegression()
        model.fit(years, areas)

        # Predict future mangrove extent for the next 5 years (2024-2028)
        future_years = np.array([2024, 2025, 2026, 2027, 2028]).reshape(-1, 1)
        future_areas = model.predict(future_years)

        # Prepare the predictions as a dictionary
        predictions = {int(year): float(area) for year, area in zip(future_years.flatten(), future_areas)}

        # Return historical data and predictions as JSON
        return jsonify({
            "historical": {
                "years": list(mangrove_areas.keys()),
                "areas": list(mangrove_areas.values())
            },
            "predictions": {
                "years": future_years.flatten().tolist(),
                "areas": future_areas.tolist()
            }
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@monitoring_bp.route('/check-files', methods=['GET'])
def check_files():
    # Check if shapefile and its components exist
    base_dir = os.getcwd()
    shapefile_dir = os.path.join(base_dir, 'app', 'routes')

    # Check for all required shapefile components
    shapefile_base = os.path.join(shapefile_dir, 'sri_lanka_shapefile')
    extensions = ['.shp', '.dbf', '.shx', '.prj']
    files_status = {}

    for ext in extensions:
        file_path = shapefile_base + ext
        files_status[file_path] = os.path.isfile(file_path)

    # Check for TIF directory
    tif_dir = os.path.join(base_dir, 'mangrove_data', 'clipped')
    tif_dir_exists = os.path.isdir(tif_dir)

    # Count TIF files if directory exists
    tif_files = []
    if tif_dir_exists:
        tif_files = glob.glob(os.path.join(tif_dir, '*.tif'))

    return jsonify({
        "current_directory": base_dir,
        "shapefile_components": files_status,
        "tif_directory_exists": tif_dir_exists,
        "tif_files_count": len(tif_files),
        "tif_files": tif_files
    })

@monitoring_bp.route('/clip-raster', methods=['POST'])
def clip_raster_api():
    try:
        # Check for GeoJSON input
        if request.is_json:
            geojson_data = request.json
            if geojson_data and 'geometry' in geojson_data:
                geom = shape(geojson_data['geometry'])
                sri_lanka = gpd.GeoDataFrame([{'geometry': geom}], geometry='geometry', crs="EPSG:4326")
            else:
                return jsonify({"error": "Invalid GeoJSON format"}), 400
        else:
            return jsonify({"error": "GeoJSON input required"}), 400

        # Base directory paths
        base_path = os.path.join(os.getcwd(), 'mangrove_data', '2015')
        output_path = os.path.join(os.getcwd(), 'mangrove_data', 'clipped')

        if not os.path.exists(base_path):
            return jsonify({"error": f"Directory not found: {base_path}"}), 404

        # Create output directory if it doesn't exist
        if not os.path.exists(output_path):
            os.makedirs(output_path)

        # Find all original .tif files (exclude already clipped files)
        tif_files = [f for f in glob.glob(os.path.join(base_path, '*.tif')) if "_clipped" not in f]

        if not tif_files:
            return jsonify({"error": "No original .tif files found"}), 404

        processed_files = []
        for tif_file in tif_files:
            try:
                output_file = os.path.join(output_path, os.path.basename(tif_file).replace('.tif', '_clipped.tif'))
                clip_raster(tif_file, sri_lanka, output_file)
                processed_files.append(os.path.basename(output_file))
            except Exception as e:
                print(f"Error processing {tif_file}: {str(e)}")
                continue

        if not processed_files:
            return jsonify({"error": "No files were successfully processed"}), 500

        return jsonify({
            "message": "Raster clipping completed",
            "processed_files": len(processed_files),
            "file_names": processed_files
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@monitoring_bp.route('/predict-future-mangrove-extent', methods=['GET'])
def predict_future_mangrove_extent_api():
    try:
        # You can either pass the mangrove_areas here or load them from your database or file system.
        # For this example, we use the `mangrove_areas` that are already calculated in your application.

        # Example historical mangrove areas (these would typically come from your TIF file processing)
        # This should be populated dynamically from your existing `mangrove_areas` data.
        mangrove_areas = {
            2015: 500000,
            2016: 495000,
            2017: 490000,
            2018: 485000,
            2019: 480000,
            2020: 475000,
            2021: 470000,
        }

        # Predict future mangrove extent
        predictions = predict_future_mangrove_extent(mangrove_areas)

        return jsonify({
            "message": "Future mangrove extent predictions completed",
            "predictions": predictions
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@monitoring_bp.route('/debug-paths', methods=['GET'])
def debug_paths():
    current_dir = os.getcwd()
    possible_shapefile_paths = [
        os.path.join(current_dir, 'app', 'routes', 'sri_lanka_shapefile.shp'),
        os.path.join(current_dir, 'server', 'app', 'routes', 'sri_lanka_shapefile.shp'),
    ]

    path_exists = {path: os.path.exists(path) for path in possible_shapefile_paths}

    return jsonify({
        "current_directory": current_dir,
        "path_exists": path_exists
    })

@monitoring_bp.route('/calculate-mangrove-extent', methods=['GET'])
def calculate_mangrove_extent_api():
    try:
        base_path = os.path.join(os.getcwd(), 'mangrove_data', 'clipped')

        if not os.path.exists(base_path):
            return jsonify({"error": f"Directory not found: {base_path}"}), 404

        # Find all clipped .tif files
        tif_files = glob.glob(os.path.join(base_path, '*.tif'))
        if not tif_files:
            return jsonify({"error": "No TIF files found"}), 404

        mangrove_extents = {}
        mangrove_areas = {}

        # Calculate extent for each TIF file
        for tif_file in tif_files:
            extent = calculate_mangrove_extent(tif_file)
            if extent is not None:
                mangrove_extents[os.path.basename(tif_file)] = extent
                # Convert pixels to area (in square meters)
                area = convert_pixels_to_area(extent)
                mangrove_areas[os.path.basename(tif_file)] = area

        return jsonify({
            "message": "Mangrove extent and area calculation completed",
            "file_count": len(mangrove_extents),
            "extents": mangrove_extents,
            "areas": mangrove_areas
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


