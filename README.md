# Fast Dataset Cleaner by PhotoRoom - 🏃

## Installation

- Frontend : run `npm install` in _front_ directory.
- Backend : run `pip install -r requirements.txt` in this directory.

## Launch the platform

- Backend : run `sh run.sh` in a terminal. You can modify the `run.sh` script file in order to adjust the parameters.
- Frontend: run `npm start` in a terminal in _front_ folder.

Then, open your navigator and go to _localhost:3000_ to see the platform live.

## How it works

*This platform is built for doing binary classification on images.* This could be helpful *either for cleaning datasets* or adding a label to each image in order to learn some task afterwards.*

When launching the platform for the first time, you need to fill in inputs in the left menu - accessible with a _click on the banner_ or by typing on the _Space bar_. Once done, you can close the banner - by typing on the _space bar_ or _clicking on the PhotoRoom logo_.

Images to annotate are displayed with a digit on their left. Typing on the associated key or clicking on the card toggles the annotation of the image. By default, every picture has _true_ value. When all the images on a page are annotated, type *_Enter_* key to validate the annotations. You can then check in your files that a new csv was created with two new columns for the annotator and the annotation, and that these annotations were written down.

You can *change the pages with your keyboard arrows*, which enables you to navigate in your dataset and reannotate some images if necessary. BEWARE: ONLY _Enter_ button saves the annotations.

When refreshing the page, unlabeled images are shown. If after a refresh of the page the final screen is displayed, you're done with labeling your dataset! 🎉

## Parser arguments

You may need to change the parameters of `run.sh` script file. Here are the possible arguments:

- `--csv_path`: the path (relative or absolute) to the csv file you want to annotate.
- `--annotated_suffix`: the fragment to add in the name of your annotated csv. Default: _"_annotated"_.
- `--annotator_column_name`: the name of the annotator column to add. Default: _"annotator"_.
- `--annotation_column_name`: the name of the annotation column to add. Default: _"is_valid"_.
- `--id_column_name`: the name of the id column. This column should include the paths to images of your dataset (these should then be unique ids). Default: _"id"_.

## Customize the image loader

If you need to display different images (like concatenate several images for each card), you may modify *build_image_for_row* function in _back.api.utils_. This function takes a row of your DataFrame and the name of the id column as input and returns a base64 encoded image.
