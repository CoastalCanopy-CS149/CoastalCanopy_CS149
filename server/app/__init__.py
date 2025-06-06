from flask import Flask
from app.routes.education import quiz_api
from flask_cors import CORS
from flask_mail import Mail
import os
from app.routes.auth import auth_bp

from app.database import init_db

# Import route modules
# from app.routes.users import auth_bp

from app.routes.reports import reports_bp
from app.routes.gamification import gamification_bp
from app.routes.mapping import mapping_bp
from app.routes.increase_points import points_bp
# from app.routes.monitoring import monitoring_bp

from app.config import (MAIL_SERVER, MAIL_PORT, MAIL_USE_TLS, MAIL_USERNAME,
                     MAIL_PASSWORD, RECEIVER_EMAIL, JWT_SECRET_KEY)
from app.services.auth_service import AuthService
from app.utils.jwt_util import JWTHandler


def create_app():
    app = Flask(__name__)
    # Allows all routes from any origin
    CORS(app, resources={r"/*": {"origins": ["https://coastalcanopy.org.lk", "http://localhost:5173"]}})
    

    # Configure Flask-Mail
    app.config['MAIL_SERVER'] = MAIL_SERVER
    app.config['MAIL_PORT'] = MAIL_PORT
    app.config['MAIL_USE_TLS'] = MAIL_USE_TLS
    app.config['MAIL_USERNAME'] = MAIL_USERNAME
    app.config['MAIL_PASSWORD'] = MAIL_PASSWORD
    app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY

    mail = Mail(app)
    init_db(app)

    jwt_handler = JWTHandler(app)
    auth_service = AuthService(jwt_handler)
    app.auth_service = auth_service
    app.mail = mail

    # Seed the database with initial mangrove data
    # seed_mangrove_data(app)

    # Register Blueprints (modular routes)
    app.register_blueprint(reports_bp, url_prefix="/reports")
    app.register_blueprint(gamification_bp, url_prefix="/gamification")
    app.register_blueprint(mapping_bp, url_prefix="/api/mapping")
    app.register_blueprint(points_bp, url_prefix="/points")
    app.register_blueprint(quiz_api)
    app.register_blueprint(auth_bp, url_prefix='/api/users')

    @app.route('/')
    def home():
        return "Hello, Flask!"  # Simple route to test if the app works
    return app

