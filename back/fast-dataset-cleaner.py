import argparse
import os
import base64

from flask import Flask, request, jsonify
import pandas as pd
import numpy as np

import cv2

ANNOTATION_COLUMN = "is_valid"
ANNOTATOR_COLUMN = "annotator"
ID_COLUMN = "id"
parser = argparse.ArgumentParser(description='Fast dataset cleaner')
parser.add_argument("--csv_path", help="CSV containing the data to annotate", required=True)
parser.add_argument("--annotated_suffix", help="CSV containing the data to annotate", default="_annotated")
app = Flask(__name__)


# This function should be the only thing changing for each dataset
def build_image_for_row(row):
    img = cv2.imread(row["id"])
    max_size = 400
    h, w, _ = img.shape
    ratio = min(max_size/h, max_size/w)
    img = cv2.resize(img, None, fx=ratio, fy=ratio)
    retval, buffer = cv2.imencode('.jpg', img)
    jpg_as_text = base64.b64encode(buffer)
    return jpg_as_text


@app.route('/', methods=['GET'])
def serve_index():
    return app.send_static_file('../front/public/index.html')


@app.route('/annotations', methods=['GET', 'POST'])
def annotate():
    if request.method == 'GET':
        return get_annotations()
    else:
        return save_annotations()


def save_annotations():
    body = request.json
    annotator = body['annotator']
    df_annotated = pd.read_csv(get_annotated_csv_path())
    for idx, is_valid in body['annotations'].items():
        df_annotated.loc[df_annotated.id == idx, ANNOTATOR_COLUMN] = annotator
        df_annotated.loc[df_annotated.id == idx, ANNOTATION_COLUMN] = is_valid
    df_annotated.to_csv(get_annotated_csv_path(), index=False)
    return jsonify({})

def get_annotations():
    num_images = int(request.args.get('num_images', 10))
    offset = int(request.args.get('offset', 0))
    df_annotated = pd.read_csv(get_annotated_csv_path())
    filtered = df_annotated[df_annotated[ANNOTATION_COLUMN].isna()]
    selected_rows = filtered[offset: offset + num_images]
    images = []
    for i, row in selected_rows.iterrows():
        image = build_image_for_row(row)
        images.append({'id': row[ID_COLUMN],
                       'image': image})
    app.logger.warning('types {} {} {}'.format(type(len(df_annotated) - len(filtered)), type(len(df_annotated)), type(images)))
    return jsonify({'images': images,
                    'processed': len(df_annotated) - len(filtered),
                    'total': len(df_annotated)})

def get_annotated_csv_path():
    annotated_path = args.csv_path.replace('.csv', args.annotated_suffix + '.csv')
    return annotated_path


if __name__ == "__main__":
    args = parser.parse_args()
    df = pd.read_csv(args.csv_path)
    annotated_path = get_annotated_csv_path()
    if os.path.exists(annotated_path):
        print('Annotated csv exists, loading it from {}'.format(annotated_path))
        df_annotated = pd.read_csv(annotated_path)

        assert ANNOTATION_COLUMN in df_annotated.columns, "Annotated csv must contain {} column".format(ANNOTATION_COLUMN)

        assert ANNOTATOR_COLUMN in df_annotated.columns, "Annotated dataset must contain {} column".format(ANNOTATOR_COLUMN)

        assert df_annotated[ID_COLUMN].is_unique, "Annotated csv must contain unique values in 'id' column"
    else:
        assert ANNOTATION_COLUMN not in df.columns, "Original csv must not contain {} column".format(ANNOTATION_COLUMN)
        assert ANNOTATOR_COLUMN not in df.columns, "Original csv must not contain {} column".format(ANNOTATOR_COLUMN)
        assert ID_COLUMN in df.columns, "Original csv must contain {} column".format(ID_COLUMN)
        assert df[ID_COLUMN].is_unique, "Original csv must contain unique values in 'id' column"

        df[ANNOTATOR_COLUMN] = np.nan
        df[ANNOTATION_COLUMN] = np.nan
        print('Annotated csv does not exist, creating it in {}'.format(annotated_path))
        df.to_csv(annotated_path, index=False)

    app.run(debug=True, use_reloader=True, host='0.0.0.0')



