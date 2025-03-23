from flask import Flask
from app.routes.education import quiz_api
from flask_cors import CORS

from app.database import init_db

# Import route modules
# from app.routes.users import auth_bp

from app.routes.reports import reports_bp
from app.routes.gamification import gamification_bp
from app.routes.mapping import mapping_bp
from app.routes.increase_points import points_bp
# from app.routes.monitoring import monitoring_bp


def create_app():
    app = Flask(__name__)
    # Allows all routes from any origin
    CORS(app)

    init_db(app)

    # Seed the database with initial mangrove data
    # seed_mangrove_data(app)

    # Register Blueprints (modular routes)
    # app.register_blueprint(auth_bp, url_prefix="/users)
    app.register_blueprint(reports_bp, url_prefix="/reports")
    app.register_blueprint(gamification_bp, url_prefix="/gamification")
    app.register_blueprint(mapping_bp, url_prefix="/api/mapping")
    app.register_blueprint(points_bp, url_prefix="/points")

    @app.route('/')
    def home():
        return "Hello, Flask!"  # Simple route to test if the app works
        app.register_blueprint(quiz_api)
    return app

