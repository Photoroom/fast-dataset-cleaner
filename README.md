# Fast Dataset Cleaner by PhotoRoom - 🏃

## Installation

- Backend : run `pip install -r requirements.txt` in this directory.
- Frontend : run `sudo apt install npm` and `(sudo) npm install -g serve`.

## Launch the platform

Run `sh run.sh`. You can optionally add a specific port for your frontend: `sh run.sh _CUSTOM_PORT_` (default is 1747).
Open your navigator and go to _localhost:1747_ (or your custom port) to see the platform live.

## How it works

*This platform is built for doing binary classification on images.* This could be helpful *either for cleaning datasets* or adding a label to each image in order to learn some task afterwards.*

When launching the platform for the first time, you need to fill in inputs in the left menu - accessible with a _click on the banner_ or by typing on the _Space bar_. Once done, you can close the banner - by typing on the _space bar_ or _clicking on the PhotoRoom logo_.

Images to annotate are displayed with a digit on their left. Typing on the associated key or clicking on the card toggles the annotation of the image. By default, every picture has _true_ value. When all the images on a page are annotated, type *_Enter_* key to validate the annotations. You can then check in your files that a new csv was created with two new columns for the annotator and the annotation, and that these annotations were written down.

You can *change the pages with your keyboard arrows*, which enables you to navigate in your dataset and reannotate some images if necessary. BEWARE: ONLY _Enter_ button saves the annotations.

When refreshing the page, unlabeled images are shown. If after a refresh of the page the final screen is displayed, you're done with labeling your dataset! 🎉

## Shortcuts

For convenience and speed, we implemented a few keyboard shortcuts:

- Open/Close the menu: _m_ or _Space bar_.
- Navigate between images: Keyboard arrows.
- Annotate some image: Tap on the digit key associated to the image number.
- Validate annotations: _Enter_.
- Load images when the menu is open: _i_ or _g_.

## Customize the image loader

If you need to display different images (like concatenate several images for each card), you may modify *build_image_for_row* function in _back.api.utils_. This function takes a row of your DataFrame and the name of the id column as input and returns a base64 encoded image.
