from flask_pymongo import PyMongo
from flask import Flask
from app.config import MONGO_URI

mongo = PyMongo()

def init_db(app: Flask):
    app.config["MONGO_URI"] = MONGO_URI
    mongo.init_app(app)
