#TODO

# from flask import Flask
# from flask_cors import CORS
# # from app import init_db
#
# # Import route modules
# # from app.routes.users import auth_bp
# from app.routes.reports import reports_bp
# # from app.routes.gamification import gamification_bp
#
#
# def create_app():
#     app = Flask(__name__)
#     CORS(app)
#
#     init_db(app)
#
#     # Register Blueprints (modular routes)
#     # app.register_blueprint(auth_bp, url_prefix="/users)
#     app.register_blueprint(reports_bp, url_prefix="/reports")
#     # app.register_blueprint(gamification_bp, url_prefix="/gamification")
#
#     return app

from flask import Flask
from app.routes.education import quiz_api

def create_app():
    app = Flask(__name__)

    @app.route('/')
    def home():
        return "Hello, Flask!"  # Simple route to test if the app works
        app.register_blueprint(quiz_api)
    return app

