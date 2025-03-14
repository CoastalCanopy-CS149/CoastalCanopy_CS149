from pymongo import MongoClient
from app.config import MONGO_URI, DATABASE_NAME

def init_db(app):
    client = MongoClient(MONGO_URI)
    app.db = client[DATABASE_NAME]