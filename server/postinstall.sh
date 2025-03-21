#!/bin/bash

# Install missing dependencies for OpenCV
apt-get update
apt-get install -y libgl1-mesa-glx libglib2.0-0 libgl1

echo "Postinstall script completed."
