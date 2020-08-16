from flask import Blueprint
from flask_restx import Api

annotation_api = Blueprint('api.annotation', __name__)
api = Api(annotation_api)

from . import routes, utils
