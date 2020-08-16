from werkzeug.utils import cached_property
from flask import Flask
from flask_cors import CORS

from .api import annotation_api


app = Flask(__name__)

API_PREFIX = '/api'
app.register_blueprint(annotation_api, url_prefix=API_PREFIX)
CORS(app)
