# import os
# import numpy as np
# import matplotlib.pyplot as plt
# import rasterio
# import pandas as pd
# from supabase import create_client
# from dotenv import load_dotenv

# # Load environment variables from a .env file
# load_dotenv()

# # Supabase setup: Initialize Supabase client using environment variables
# SUPABASE_URL = os.getenv('SUPABASE_URL')
# SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')
# supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# # Local directory to save downloaded files
# temp_dir = "temp_data"
# os.makedirs(temp_dir, exist_ok=True)  # Create the directory if it doesn't exist

# def download_tif_files():
#     """Download TIF files from Supabase bucket"""
#     print("Downloading TIF files from Supabase...")

#     # List all files in the specified path in the Supabase bucket
#     response = supabase.storage.from_('mangrove-data').list('2015')

#     tif_files = []
#     for file in response:
#         if file['name'].endswith('.tif'):  # Check if the file is a TIF file
#             file_path = os.path.join(temp_dir, file['name'])

#             # Download the file and save it locally
#             with open(file_path, 'wb+') as f:
#                 file_data = supabase.storage.from_('mangrove-data').download(f"2015/{file['name']}")
#                 f.write(file_data)

#             tif_files.append(file_path)  # Add the file path to the list
#             print(f"Downloaded: {file['name']}")

#     return tif_files  # Return the list of downloaded TIF file paths

# def analyze_mangrove_area(tif_files):
#     """Analyze mangrove areas from TIF files"""
#     print("Analyzing mangrove areas...")

#     # Dictionary to store results of mangrove area calculations
#     areas = {}

#     for file_path in tif_files:
#         file_name = os.path.basename(file_path)  # Extract the file name
#         area_name = file_name.split('_')[0]  # Extract area name from the file name

#         with rasterio.open(file_path) as src:
#             # Read the raster data (assuming band 1 contains mangrove data)
#             image = src.read(1)

#             # Create a mask for mangrove areas (pixel values > 0)
#             mangrove_mask = image > 0

#             # Count the number of mangrove pixels
#             mangrove_pixels = np.sum(mangrove_mask)

#             # Calculate the area in square kilometers
#             pixel_area_sq_meters = src.res[0] * src.res[1]  # Pixel area in square meters
#             area_sq_km = (mangrove_pixels * pixel_area_sq_meters) / 1000000  # Convert to square kilometers

#             areas[area_name] = area_sq_km  # Store the calculated area for the region

#     return areas  # Return the dictionary of mangrove areas

# def predict_future_mangrove(areas, target_year=2026):
#     """Predict future mangrove areas using linear extrapolation"""
#     print("Predicting future mangrove areas...")

#     predicted_areas = {}

#     for area_name, area_value in areas.items():
#         # Generate a random annual change factor between -5% and +5%
#         annual_change_factor = np.random.uniform(0.95, 1.05)
#         years_difference = target_year - 2015  # Calculate the number of years to project

#         # Apply the annual change factor over the years to predict future area
#         predicted_value = area_value * (annual_change_factor ** years_difference)
#         predicted_areas[area_name] = predicted_value  # Store the predicted area

#     return predicted_areas  # Return the dictionary of predicted areas

# def save_results_to_supabase(current_areas, predicted_areas):
#     """Save analysis results to Supabase database"""
#     print("Saving results to Supabase...")

#     # Create a list of records to insert into the database
#     records = []
#     for area_name in current_areas.keys():
#         records.append({
#             'area': area_name,
#             'area_2015': float(current_areas[area_name]),  # Current area in 2015
#             'predicted_area_2026': float(predicted_areas[area_name])  # Predicted area in 2026
#         })

#     # Insert data into the Supabase table
#     try:
#         result = supabase.table('mangrove_analysis').insert(records).execute()
#         print(f"Saved {len(records)} records to Supabase")
#         return True
#     except Exception as e:
#         # Handle errors by saving the results to a local CSV file as a fallback
#         print(f"Error saving to Supabase: {str(e)}")
#         results_df = pd.DataFrame(records)
#         results_df.to_csv('mangrove_analysis_results.csv', index=False)
#         print("Saved results to local CSV instead")
#         return False

# def main():
#     """Main function to run the analysis"""
#     try:
#         # Step 1: Download TIF files from Supabase
#         tif_files = download_tif_files()

#         if not tif_files:  # Check if no files were downloaded
#             print("No TIF files found in the bucket.")
#             return

#         # Step 2: Analyze current mangrove areas
#         current_areas = analyze_mangrove_area(tif_files)

#         # Step 3: Predict future mangrove areas
#         predicted_areas = predict_future_mangrove(current_areas)

#         # Step 4: Save results to Supabase (or fallback to local CSV)
#         save_results_to_supabase(current_areas, predicted_areas)

#         print("Analysis completed and results saved to Supabase.")

#     except Exception as e:
#         # Handle any errors that occur during the process
#         print(f"Error occurred: {str(e)}")

# if __name__ == "__main__":
#     main()  # Run the main function when the script is executed