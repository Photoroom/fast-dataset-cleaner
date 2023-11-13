import csv
import os
from flask import Flask, request, send_file
from flask_restx import Resource
import io
import cv2
from pathlib import Path

from . import api
from .utils import sha_generator, print_important
from ..constants import PASSWORD_ERROR

from ..services import AnnotationService, ImageService


SHA_HASH = sha_generator()
print_important("Password to add in the frontend options:", important_msg=SHA_HASH)


annotation_service = AnnotationService()
image_service = ImageService()



def send_numpy_image(image):
    # Convert the image from numpy array to JPEG
    is_success, im_buf_arr = cv2.imencode(".jpg", image)
    byte_im = im_buf_arr.tobytes()

    # Create a BytesIO object
    file_object = io.BytesIO(byte_im)
    file_object.seek(0)

    return send_file(file_object, mimetype='image/JPEG')



@api.route('/get-annotations', methods=['POST'])
class GetAnnotations(Resource):
    def post(self):        
        body = request.json

        first = body['first'] if 'first' in body else -1
        offset = int(body['offset']) if 'offset' in body else 8
        sha_hash = body['sha'] if 'sha' in body else ''
        csv_path = body['csv_path'] if 'csv_path' in body else None
        images_folder = body['images_folder'] if 'images_folder' in body else ''
        masks_folder = body['masks_folder'] if 'masks_folder' in body else None
        with_masks = body['with_masks'] if 'with_masks' in body else False
        id_column = body['id_column_name'] if 'id_column_name' in body else None
        image_ext = body['image_ext'] if 'image_ext' in body else ''
        mask_ext = body['mask_ext'] if 'mask_ext' in body else ''
        
        if sha_hash != SHA_HASH:
            return { 'error': PASSWORD_ERROR }, 200
        
        check_img = image_service.set_constants(images_folder, image_ext, masks_folder, mask_ext, with_masks)
        
        if check_img is not None:
            return check_img
        if csv_path is None or csv_path == '':

            csv_path = os.path.join(Path(images_folder).parent.absolute(), f'{os.path.basename(images_folder)}.csv')
            print(f"No csv path provided, using {csv_path}")
            if not os.path.exists(csv_path):
                with open(csv_path, 'w', newline='') as file:
                    writer = csv.writer(file)
                    writer.writerow([id_column])
                    for filename in os.listdir(images_folder):
                        if filename.endswith(image_ext):
                            writer.writerow([filename.removesuffix(image_ext)])

        return annotation_service.get_annotations(csv_path, first, offset, id_column)
        
        
@api.route('/get-image', methods=['GET'])
class GetImage(Resource):
    def get(self):
        image_id = request.args.get('id', '')
        sha_hash = request.args.get('sha', '')
        
        if sha_hash != SHA_HASH:
            return { 'error': PASSWORD_ERROR }, 200

        image = image_service.build_image(image_id)
        
        if type(image) is tuple:
            return image
        return send_numpy_image(image)
        
        
@api.route('/annotate', methods=['POST'])
class Annotate(Resource):
    def post(self):
        body = request.json
        annotator, annotations, sha_hash = body['annotator'], body['annotations'], body['sha']
        
        if sha_hash != SHA_HASH:
            return { 'error': PASSWORD_ERROR }, 200
        
        annotation_service.annotate(annotations, annotator)
        
        return { 'msg': 'Annotation done!' }, 200
