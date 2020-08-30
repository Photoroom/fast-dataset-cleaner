import os

from ..image_builder import build_image


class ImageService:
    def __init__(self):
        self.img_dir = None
        self.mask_dir = None
        self.img_extension = ''
        self.mask_extension = ''
        self.use_masks = None

        
    def set_constants(self, img_folder, img_ext, mask_folder, mask_ext, with_masks):
        if img_ext is not None and img_ext != self.img_extension:
            self.img_extension = img_ext
    
        if mask_ext is not None and mask_ext != self.mask_extension:
            self.mask_extension = mask_ext
        
        if not os.path.exists(img_folder):
            return { 'error': f'Images folder not found: {img_folder}' }, 200
        if img_folder[-1] != '/':
            img_folder += '/'
        if img_folder != self.img_dir:
            self.img_dir = img_folder
            
        if with_masks:
            if mask_folder[-1] != '/':
                mask_folder += '/'
            if not os.path.exists(mask_folder):
                return { 'error': f'Masks folder not found: {mask_folder}' }, 200
            if mask_folder != self.mask_extension:
                self.mask_dir = mask_folder
                self.use_masks = with_masks


    def build_image(self, image_id):
        if image_id == '':
            return { 'error': 'Provide an image id' }, 200
        
        image_path = f'{self.img_dir}{image_id}{self.img_extension}'
        mask_path = f'{self.mask_dir}{image_id}{self.mask_extension}' if self.use_masks else None
        
        return build_image(image_path, mask_path)
