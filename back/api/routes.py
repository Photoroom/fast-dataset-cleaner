import os

from flask import Flask, request, send_file
from flask_restx import Resource
import pandas as pd
import io
from PIL import Image

from . import api, utils
from .images import build_image
from .dataframe import get_images_from_rows, get_first_index_not_fully_annotated_page, create_annotated_csv, annotate_df
from .constants import ANNOTATION_COLUMN, ANNOTATED_SUFFIX, PASSWORD_ERROR


SHA_HASH = utils.sha_generator()
utils.print_important(f"Password to add in the frontend options:", important_msg=SHA_HASH)


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
IMAGE_EXTENSION = None
MASK_EXTENSION = None


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
        global IMAGE_EXTENSION
        global MASK_EXTENSION
        
        body = request.json

        first = body['first'] if 'first' in body else -1
        offset = int(body['offset']) if 'offset' in body else 8
        sha_hash = body['sha'] if 'sha' in body else ''
        csv_path = body['csv_path'] if 'csv_path' in body else None
        images_folder = body['images_folder'] if 'images_folder' in body else ''
        masks_folder = body['masks_folder'] if 'masks_folder' in body else None
        with_masks = body['with_masks'] if 'with_masks' in body else False
        id_column = body['id_column_name'] if 'id_column_name' in body else None
        image_ext = body['image_ext'] if 'image_ext' in body else None
        mask_ext = body['mask_ext'] if 'mask_ext' in body else None
        
        if sha_hash != SHA_HASH:
            return { 'error': PASSWORD_ERROR }, 200
        
        if csv_path != current_csv_path:
            current_csv_path = csv_path
            csv_annotated = get_annotated_csv_path(csv_path)

        if os.path.exists(csv_annotated):
            df = pd.read_csv(csv_annotated)
        elif os.path.exists(csv_path):
            df = create_annotated_csv(csv_path, csv_annotated)
        else:
            return { 'error': f'CSVs not found: {csv_path} and {csv_annotated}' }, 200
        
        if id_column is None or id_column not in df:
            return { 'error': f'Column {id_column} not in the csv.' }, 200
        if id_column != ID_COLUMN:
            ID_COLUMN = id_column
            
        if image_ext is not None and image_ext != IMAGE_EXTENSION:
            IMAGE_EXTENSION = image_ext
        if mask_ext is not None and mask_ext != MASK_EXTENSION:
            MASK_EXTENSION = mask_ext
        
        if not os.path.exists(images_folder):
            return { 'error': f'Images folder not found: {images_folder}' }, 200
        if images_folder[-1] != '/':
            images_folder += '/'
        if images_folder != IMAGES_FOLDER:
            IMAGES_FOLDER = images_folder
            
        if with_masks:
            if masks_folder[-1] != '/':
                masks_folder += '/'
            if not os.path.exists(masks_folder):
                return { 'error': f'Masks folder not found: {masks_folder}' }, 200
            if masks_folder != MASKS_FOLDER:
                MASKS_FOLDER = masks_folder
                WITH_MASKS = with_masks

        if first == -1:
            first = get_first_index_not_fully_annotated_page(df, offset, ID_COLUMN)
        selected_rows = df[first: first + offset]
        images = get_images_from_rows(selected_rows, ID_COLUMN)

        return {
            'images': images,
            'processed': len(df[~df[ANNOTATION_COLUMN].isna()]),
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
            return { 'error': 'Provide an image id' }, 200

        image_path = f'{IMAGES_FOLDER}{image_id}{IMAGE_EXTENSION}'
        mask_path = f'{MASKS_FOLDER}{image_id}{MASK_EXTENSION}' if WITH_MASKS else None
        
        return send_numpy_image(build_image(image_path, mask_path))
        
        
@api.route('/annotate', methods=['POST'])
class Annotate(Resource):
    def post(self):
        global df
        
        body = request.json
        annotator, annotations, sha_hash = body['annotator'], body['annotations'], body['sha']
        
        if sha_hash != SHA_HASH:
            return { 'error': PASSWORD_ERROR }, 200
        
        df = annotate_df(df, annotations, annotator, ID_COLUMN, csv_annotated)
        
        return { 'msg': 'Annotation done!' }, 200
