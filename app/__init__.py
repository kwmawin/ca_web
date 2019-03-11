from flask import Flask
server = Flask(__name__, template_folder="./ui/templates", static_folder="./ui/public")

# Register UI
from app.main import bp as main_bp
server.register_blueprint(main_bp)

# Register API
from app.api import bp as api_bp
server.register_blueprint(api_bp, url_prefix='/api')
