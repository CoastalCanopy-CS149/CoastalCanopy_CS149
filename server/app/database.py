from flask import current_app, g
from pymongo import MongoClient
from app.config import MONGO_URI, DATABASE_NAME

def init_db(app):
    client = MongoClient(MONGO_URI)
    app.db = client[DATABASE_NAME]
    
    app.db.education = app.db["Education"]

#Gets reference to the 'Reports' collection in MongoDB
def get_reports_collection():
    return g.get('reports_collection') or current_app.db['Reports']
    app.db = client[DATABASE_NAME]
    
# Reference to the Mapping collection
def get_mangrove_locations():
    return current_app.db["Mapping"]


#Gets reference to the 'Users' collection in MongoDB
def get_users_collection():
    
    return g.get('users_collection') or current_app.db['Users']

# get app users collection
def get_app_users_collection():
     return g.get('app_users_collection') or current_app.db['App_Users']


