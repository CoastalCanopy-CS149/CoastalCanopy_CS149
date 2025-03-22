from flask import current_app, g
from pymongo import MongoClient
from app.config import MONGO_URI, DATABASE_NAME

def init_db(app):
    client = MongoClient(MONGO_URI)
    app.db = client[DATABASE_NAME]
    
    # Reference to the Mapping collection
    app.db.Mapping = app.db["Mapping"]


#Gets reference to the 'Users' collection in MongoDB
def get_users_collection():
    return g.get('users_collection') or current_app.db['Users']

def edu_db(app):
    client = MongoClient(MONGO_URI)
    app.db = client[DATABASE_NAME]

    # Reference to the education quiz collection
    app.db.education = app.db["Education"]