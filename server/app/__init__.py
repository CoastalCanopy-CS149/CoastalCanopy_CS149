from flask import Flask
from flask_cors import CORS
from flask_mail import Mail
from app.database import init_db
import os

# Import route modules
# from app.routes.users import auth_bp
from app.routes.reports import reports_bp
from app.routes.gamification import gamification_bp
from app.routes.mapping import mapping_bp
from app.routes.increase_points import points_bp

from app.config import (MAIL_SERVER, MAIL_PORT, MAIL_USE_TLS, MAIL_USERNAME,
                    MAIL_PASSWORD, RECEIVER_EMAIL)



def create_app():
    app = Flask(__name__)
    # Allows all routes from any origin
    CORS(app)

    # Initialize Flask-Mail with app configuration
    # Configure Flask-Mail
    app.config['MAIL_SERVER'] = MAIL_SERVER
    app.config['MAIL_PORT'] = MAIL_PORT
    app.config['MAIL_USE_TLS'] = MAIL_USE_TLS
    app.config['MAIL_USERNAME'] = MAIL_USERNAME
    app.config['MAIL_PASSWORD'] = MAIL_PASSWORD

    # Initialize Flask-Mail
    mail = Mail(app) # Initialize Flask-Mail with the app

    init_db(app)

    # Register Blueprints (modular routes)
    # app.register_blueprint(auth_bp, url_prefix="/users)
    app.register_blueprint(reports_bp, url_prefix="/reports")
    app.register_blueprint(gamification_bp, url_prefix="/gamification")
    app.register_blueprint(mapping_bp, url_prefix="/api/mapping")
    app.register_blueprint(points_bp, url_prefix="/points")


    @app.route('/')
    def home():
        return "Hello, Flask!"  # Simple route to test if the app works

    return app

