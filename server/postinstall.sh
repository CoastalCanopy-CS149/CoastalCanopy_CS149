#!/bin/bash
echo "Starting postinstall script..."
chmod +x postinstall.sh  # Ensure the script is executable
apt-get update
apt-get install -y libgl1-mesa-glx libglib2.0-0 libgl1
echo "Postinstall script completed."
