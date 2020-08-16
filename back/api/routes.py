import os
import math

from flask import Flask, request, send_file
from flask_restx import Resource
import pandas as pd
import numpy as np
import io
from PIL import Image

from . import api, utils
from .images import build_image


ANNOTATION_COLUMN = 'fast_dataset_cleaner_label'
ANNOTATOR_COLUMN = 'annotator'

SHA_HASH = utils.sha_generator()
utils.print_important(f"Password to add in the frontend options:", important_msg=SHA_HASH)
PASSWORD_ERROR = 'Missing or wrong password'


ANNOTATED_SUFFIX = '_annotated'
def get_annotated_csv_path(csv_path):
    return utils.get_annotated_csv_path(csv_path, ANNOTATED_SUFFIX)

current_csv_path = ''
csv_annotated = get_annotated_csv_path(current_csv_path)
df = None
if os.path.exists(csv_annotated):
    df = pd.read_csv(csv_annotated)


IMAGES_FOLDER = None
MASKS_FOLDER = None
WITH_MASKS = False
ID_COLUMN = None


def get_images_from_rows(selected_rows):
    images = []
    for ind, row in selected_rows.iterrows():
        images.append({
            'id': row[ID_COLUMN],
            'index': ind,
            'value': row[ANNOTATION_COLUMN] if not math.isnan(row[ANNOTATION_COLUMN]) else 'None'
        })
    return images


def get_first_index_not_fully_annotated_page(offset):
    global df
    df_not_annotated = df[df[ANNOTATION_COLUMN].isna()]
    if len(df_not_annotated) == 0:
        return len(df)
    first_not_annotated = df[df[ANNOTATION_COLUMN].isna()].iloc[0]
    first_index = df[df[ID_COLUMN] == first_not_annotated[ID_COLUMN]].index[0]
    start = int(offset * np.floor(first_index / offset))
    return start


def send_numpy_image(image):
    img = Image.fromarray(image.astype('uint8'))
    file_object = io.BytesIO()
    img.save(file_object, 'PNG')
    file_object.seek(0)
            
    return send_file(file_object, mimetype='image/PNG')



@api.route('/get-annotations', methods=['POST'])
class GetAnnotations(Resource):
    def post(self):
        global df
        global current_csv_path
        global csv_annotated
        global IMAGES_FOLDER
        global MASKS_FOLDER
        global WITH_MASKS
        global ID_COLUMN
        
        body = request.json

        first = body['first'] if 'first' in body else -1
        offset = int(body['offset']) if 'offset' in body else 8
        sha_hash = body['sha'] if 'sha' in body else ''
        csv_path = body['csv_path'] if 'csv_path' in body else None
        images_folder = body['images_folder'] if 'images_folder' in body else ''
        masks_folder = body['masks_folder'] if 'masks_folder' in body else None
        with_masks = body['with_masks'] if 'with_masks' in body else False
        id_column = body['id_column_name'] if 'id_column_name' in body else None
        
        if sha_hash != SHA_HASH:
            return { 'error': PASSWORD_ERROR }, 200
        
        if csv_path != current_csv_path:
            current_csv_path = csv_path
            csv_annotated = get_annotated_csv_path(csv_path)

        if os.path.exists(csv_annotated):
            df = pd.read_csv(csv_annotated)
        else:
            return { 'error_df': f'Missing csv: {csv_annotated}' }, 200
        
        if images_folder[-1] != '/':
            images_folder += '/'
        if not os.path.exists(images_folder):
            return { 'error_images_folder': f'Missing images folder: {images_folder}' }, 200
        if images_folder != IMAGES_FOLDER:
            IMAGES_FOLDER = images_folder
            
        if with_masks:
            if masks_folder[-1] != '/':
                masks_folder += '/'
            if not os.path.exists(masks_folder):
                return { 'error_masks_folder': f'Missing masks folder: {masks_folder}' }, 200
            if masks_folder != MASKS_FOLDER:
                MASKS_FOLDER = masks_folder
                WITH_MASKS = with_masks
                
        if id_column is None or id_column not in df:
            return { 'error_id_column': f'Column {id_column} not in the csv.' }, 200
        if id_column != ID_COLUMN:
            ID_COLUMN = id_column

        if first == -1:
            first = get_first_index_not_fully_annotated_page(offset)
        selected_rows = df[first: first + offset]
        images = get_images_from_rows(selected_rows)

        processed = len(df[~df[ANNOTATION_COLUMN].isna()])

        return {
            'images': images,
            'processed': processed,
            'total': len(df)
            }, 200
        
        
@api.route('/get-image', methods=['GET'])
class GetImage(Resource):
    def get(self):
        image_id = request.args.get('id', '')
        sha_hash = request.args.get('sha', '')
        
        if sha_hash != SHA_HASH:
            return { 'error': PASSWORD_ERROR }, 200

        if image_id == '':
            return { 'error': 'Provide an image index' }, 200

        image_path = f'{IMAGES_FOLDER}{image_id}' #.png
        mask_path = f'{MASKS_FOLDER}{image_id}' if WITH_MASKS else None
        
        return send_numpy_image(build_image(image_path, mask_path))
        
        
@api.route('/annotate', methods=['POST'])
class Annotate(Resource):
    def post(self):
        global df
        
        body = request.json
        annotator, annotations, sha_hash = body['annotator'], body['annotations'], body['sha']
        
        if sha_hash != SHA_HASH:
            return { 'error': PASSWORD_ERROR }, 200
        
        df = pd.read_csv(csv_annotated)
        
        for idx, is_valid in annotations.items():
            df.loc[df[ID_COLUMN] == idx, ANNOTATOR_COLUMN] = annotator
            df.loc[df[ID_COLUMN] == idx, ANNOTATION_COLUMN] = is_valid
        df.to_csv(csv_annotated, index=False)
        
        return { 'msg': 'Annotation done!' }, 200
