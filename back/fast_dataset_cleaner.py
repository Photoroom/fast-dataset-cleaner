from werkzeug.utils import cached_property
from flask import Flask
from flask_cors import CORS

from .api import annotation_api
from .api.routes import args
from .file_checker import check_file


app = Flask(__name__)

check_file(args.csv_path)

API_PREFIX = '/api'
app.register_blueprint(annotation_api, url_prefix=API_PREFIX)
CORS(app)
