import base64
import cv2
import random as rd
import string
from hashlib import sha256
import numpy as np

MAX_SIZE_IMG = 600

# This function should be the only thing changing for each dataset
def build_image_for_row(row, id_column):
    img = cv2.imread(row[id_column])
    mask = cv2.imread(row['mask'])
    img = np.concatenate((img, mask), axis=1)
    max_size = MAX_SIZE_IMG
    h, w, _ = img.shape
    ratio = min(max_size/h, max_size/w)
    img = cv2.resize(img, None, fx=ratio, fy=ratio)

    _, buffer = cv2.imencode('.jpg', img)
    jpg_as_text = "data:image/jpg;base64," + base64.b64encode(buffer).decode('utf-8')

    return jpg_as_text


def get_annotated_csv_path(csv_path, suffix):
    return csv_path.replace('.csv', suffix + '.csv')


def sha_generator():
    word = "".join([rd.choice(string.ascii_letters) for i in range(10)])
    return sha256(word.encode('ascii')).hexdigest()


def print_important(message):
    dash_line = '-' * 20
    print("\n{}\n\n{}\n\n{}\n".format(dash_line, message, dash_line))