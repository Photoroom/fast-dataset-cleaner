import os
import math

from flask import Flask, request
from flask_restx import Resource
import pandas as pd
import numpy as np

from . import api, utils
from ..parser import get_parser


parser = get_parser()
args = parser.parse_args()

ANNOTATION_COLUMN = args.annotation_column_name
ANNOTATOR_COLUMN = args.annotator_column_name
ID_COLUMN = args.id_column_name
ANNOTATION_EXTENSION = args.annotated_suffix

SHA_HASH = utils.sha_generator()
utils.print_important("Password to add in the frontend options: {}".format(SHA_HASH))


def get_annotated_csv_path(csv_path):
    return utils.get_annotated_csv_path(csv_path, args.annotated_suffix)

csv_annotated = get_annotated_csv_path(args.csv_path)


def get_images_from_rows(selected_rows):
    images = []
    for ind, row in selected_rows.iterrows():
        image, combination = utils.build_image_for_row(row, ID_COLUMN)
        images.append({'id': row[ID_COLUMN],
                    'image': image,
                    'combination': combination,
                    'index': ind,
                    'value': row[ANNOTATION_COLUMN] if not math.isnan(row[ANNOTATION_COLUMN]) else 'None'})
    return images


def get_first_index_not_fully_annotated_page(df, offset):
    df_not_annotated = df[df[ANNOTATION_COLUMN].isna()]
    if len(df_not_annotated) == 0:
        return len(df)
    first_not_annotated = df[df[ANNOTATION_COLUMN].isna()].iloc[0]
    first_index = df[df[ID_COLUMN] == first_not_annotated[ID_COLUMN]].index[0]
    start = int(offset * np.floor(first_index / offset))
    return start


@api.route('/set-dataset-csv', methods=['POST'])
class SetDatasetCsv(Resource):
    def post(self):
        global csv_annotated
        body = request.json
        csv_annotated = body['csv_to_annotate'].replace('.csv', '{}.csv'.format(ANNOTATION_EXTENSION))
        
        return { 'msg': 'Dataset changed!' }, 200


@api.route('/get-annotations', methods=['GET'])
class GetAnnotations(Resource):
    def get(self):
        first = int(request.args.get('first', -1))
        offset = int(request.args.get('offset', 8))
        sha_hash = request.args.get('sha', '')
        
        if sha_hash != SHA_HASH:
            return { 'msg': 'Missing sha password',
                    'images': [],
            'processed': 0,
            'total': 0 }, 200

        try:
            df = pd.read_csv(csv_annotated)
        except Exception as e:
            print(e)
            return {
                'msg': 'Incorrect path'
            }

        if first == -1:
            first = get_first_index_not_fully_annotated_page(df, offset)
        selected_rows = df[first: first + offset]
        images = get_images_from_rows(selected_rows)

        processed = len(df[~df[ANNOTATION_COLUMN].isna()])

        return {
            'images': images,
            'processed': processed,
            'total': len(df)
            }, 200
        
        
@api.route('/annotate', methods=['POST'])
class Annotate(Resource):
    def post(self):
        body = request.json
        annotator, annotations, sha_hash = body['annotator'], body['annotations'], body['sha']
        
        if sha_hash != SHA_HASH:
            return { 'msg': 'Missing sha password' }, 200
        
        df_annotated = pd.read_csv(csv_annotated)
        
        for idx, is_valid in annotations.items():
            df_annotated.loc[df_annotated[ID_COLUMN] == idx, ANNOTATOR_COLUMN] = annotator
            df_annotated.loc[df_annotated[ID_COLUMN] == idx, ANNOTATION_COLUMN] = is_valid
        df_annotated.to_csv(csv_annotated, index=False)
        
        return { 'msg': 'Annotation done!' }, 200


@api.route('/set-annotator-column', methods=['POST'])
class SetAnnotatorColumn(Resource):
    def post(self):
        body = request.json
        annotator_col, sha_hash = body['annotator_column'], body['sha']
        
        if sha_hash != SHA_HASH:
            return { 'msg': 'Missing sha password' }, 200

        global ANNOTATOR_COLUMN
        df = pd.read_csv(csv_annotated)
        new_cols = [annotator_col if col == ANNOTATOR_COLUMN else col for col in df.columns]
        df.columns = new_cols
        ANNOTATOR_COLUMN = annotator_col
        df.to_csv(csv_annotated, index=False)
        
        return { 'msg': 'Change done!' }, 200
    
    
@api.route('/set-annotation-column', methods=['POST'])
class SetAnnotationColumn(Resource):
    def post(self):
        body = request.json
        annotation_col, sha_hash = body['annotation_column'], body['sha']
        
        if sha_hash != SHA_HASH:
            return { 'msg': 'Missing sha password' }, 200

        
        global ANNOTATION_COLUMN
        df = pd.read_csv(csv_annotated)
        new_cols = [annotation_col if col == ANNOTATION_COLUMN else col for col in df.columns]
        df.columns = new_cols
        ANNOTATION_COLUMN = annotation_col
        df.to_csv(csv_annotated, index=False)
        
        return { 'msg': 'Change done!' }, 200


@api.route('/get-columns', methods=['GET'])
class GetColumns(Resource):
    def get(self):
        return {
            'annotation': ANNOTATION_COLUMN,
            'annotator': ANNOTATOR_COLUMN
            }, 200
