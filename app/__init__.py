from flask import Flask
server = Flask(__name__, template_folder="./ui/templates", static_folder="./ui/public")
from app import routes