from flask import Flask
from flask_cors import CORS
from werkzeug.utils import cached_property

from .api import annotation_api


FRONTEND_FOLDER = '../front/build/'
app = Flask(__name__, static_url_path='', static_folder=FRONTEND_FOLDER)

API_PREFIX = '/api'
app.register_blueprint(annotation_api, url_prefix=API_PREFIX)
CORS(app)

import sys, os,  pathlib
@app.route('/')
def root():
    return app.send_static_file('index.html')
