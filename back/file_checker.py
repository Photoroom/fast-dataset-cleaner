import os
import pandas as pd
import numpy as np

from .api.routes import ANNOTATION_COLUMN, ID_COLUMN, ANNOTATOR_COLUMN, get_annotated_csv_path


def check_annot_columns(cols, df=None, annotation_exists=True):
    if annotation_exists:
        for col in cols:
            assert col in df.columns, "Annotated csv must contain {} column".format(col)
    else:
        for col in cols:
            assert col not in df.columns, "Original csv must not contain {} column".format(col)


def check_id_unicity(df, annotation_exists=True):
    if annotation_exists:
        assert df[ID_COLUMN].is_unique, "Annotated csv must contain unique values in 'id' column"
    else:
        assert ID_COLUMN in df.columns, "Original csv must contain {} column".format(ID_COLUMN)
        assert df[ID_COLUMN].is_unique, "Original csv must contain unique values in 'id' column"


def check_columns(df, annotation_exists=True):
    if annotation_exists:
        COLUMNS_TO_CHECK = [ID_COLUMN, ANNOTATOR_COLUMN, ANNOTATION_COLUMN]
    else:
        COLUMNS_TO_CHECK = [ANNOTATOR_COLUMN, ANNOTATION_COLUMN]
    check_annot_columns(COLUMNS_TO_CHECK, df=df, annotation_exists=annotation_exists)
    check_id_unicity(df, annotation_exists=annotation_exists)



def check_file(csv_path):
    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        print("File {} does not exist.".format(csv_path))
        print(e)

    annotated_path = get_annotated_csv_path(csv_path)

    if os.path.exists(annotated_path):
        print('Annotated csv exists, loading it from {}'.format(annotated_path))
        df_annotated = pd.read_csv(annotated_path)
        check_columns(df_annotated)
    else:
        check_columns(df, annotation_exists=False)        
        df[ANNOTATOR_COLUMN] = np.nan
        df[ANNOTATION_COLUMN] = np.nan
        print('Annotated csv does not exist, creating it in {}'.format(annotated_path))
        df.to_csv(annotated_path, index=False)
