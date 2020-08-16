import cv2
import numpy as np
from PIL import Image


MAX_SIZE_IMG = 600


# This function should be the only thing changing for each dataset
def build_image(img_path, mask_path=None):
    img = np.array(Image.open(img_path).convert('RGBA'))
    
    if mask_path is None:
        return resize_image(img)
    
    mask = np.array(Image.open(mask_path).convert('RGBA'))
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


def resize_image(img):
    h, w, _ = img.shape
    ratio = min(MAX_SIZE_IMG/h, MAX_SIZE_IMG/w)
    img = cv2.resize(img, None, fx=ratio, fy=ratio, interpolation=cv2.INTER_AREA)
    return img
