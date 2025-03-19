from flask import Flask
from flask_cors import CORS

from app.database import init_db

# Import route modules
# from app.routes.users import auth_bp
# from app.routes.reports import reports_bp

from app.routes.gamification import gamification_bp
from app.routes.mapping import mapping_bp



def create_app():
    app = Flask(__name__)
    # Allows all routes from any origin
    CORS(app)


    init_db(app)

    # Seed the database with initial mangrove data
    # seed_mangrove_data(app)

    # Register Blueprints (modular routes)
    # app.register_blueprint(auth_bp, url_prefix="/users)
    # app.register_blueprint(reports_bp, url_prefix="/reports")

    app.register_blueprint(gamification_bp, url_prefix="/gamification")
    app.register_blueprint(mapping_bp, url_prefix="/api/mapping")

    @app.route('/')
    def home():
        return "Hello, Flask!"  # Simple route to test if the app works

    return app






