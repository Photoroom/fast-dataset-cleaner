CSV_PATH=/home/shared/datasets/graphic_v3/trainset_clean.csv
ANNOTATED_SUFFIX=_annotated
ANNOTATOR_COLUMN_NAME=annotator
ANNOTATION_COLUMN_NAME=is_valid
ID_COLUMN_NAME=image

python run_back.py \
    --csv_path $CSV_PATH \
    --annotated_suffix $ANNOTATED_SUFFIX \
    --annotator_column_name $ANNOTATOR_COLUMN_NAME \
    --annotation_column_name $ANNOTATION_COLUMN_NAME \
    --id_column_name $ID_COLUMN_NAME
