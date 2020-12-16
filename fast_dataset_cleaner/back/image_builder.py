import cv2
import numpy as np
from PIL import Image


MAX_SIZE_IMG = 600


"""
    ========== Functions to customize if necessary ==========
    Images are built and sent to frontend thanks to build_image function.
    
    Inputs: local paths to images and optionally masks.
    Output: numpy image
"""
def build_image(img_path, mask_path=None):
    img = open_image(img_path)
    
    if mask_path is None:
        return resize_image(img)
    
    mask = open_image(mask_path)
    composition = compose_img(img, mask)
    img = np.concatenate((img, composition), axis=1)
    
    return resize_image(img)


def compose_img(img, mask):    
    bg = np.zeros_like(img)
    bg[:,:,1] = 1.0

    mask = cv2.resize(mask, (img.shape[1], img.shape[0]), interpolation=cv2.INTER_CUBIC)
    mask, img = mask / 255, img / 255
    fg = mask * img
    bg = (1-mask) * bg
    cutout = np.array(255 * (fg + bg), dtype=np.uint8)
    
    return cutout


def open_image(path):
    return np.array(Image.open(path).convert('RGBA'))


def resize_image(img):
    h, w, _ = img.shape
    ratio = min(MAX_SIZE_IMG/h, MAX_SIZE_IMG/w)
    img = cv2.resize(img, None, fx=ratio, fy=ratio, interpolation=cv2.INTER_AREA)
    return img
