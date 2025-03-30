import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

MONGO_URI = os.getenv("MONGO_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME")

MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_SERVER = os.getenv("MAIL_SERVER")
MAIL_DEFAULT_SENDER = 'info@costal.com'    #os.getenv("MAIL_USERNAME")  # Default sender email
RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL")
MAIL_PORT = int(os.getenv("MAIL_PORT", 587))  # Default to 587 if not in .env
MAIL_USE_TLS = bool(os.getenv("MAIL_USE_TLS" )) # Convert to boolean
MAIL_USE_SSL = bool(os.getenv("MAIL_USE_TLS" ))

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_NORMAL_EXPIRE= os.getenv("JWT_NORMAL_EXPIRE")
JW_LONGER_LIVE= os.getenv("JW_LONGER_LIVE")
