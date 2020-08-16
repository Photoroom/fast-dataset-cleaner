import math

import pandas as pd
import numpy as np

from .constants import ANNOTATION_COLUMN, ANNOTATOR_COLUMN


def get_images_from_rows(selected_rows, ID_COLUMN):
    images = []
    for ind, row in selected_rows.iterrows():
        images.append({
            'id': row[ID_COLUMN],
            'index': ind,
            'value': row[ANNOTATION_COLUMN] if not math.isnan(row[ANNOTATION_COLUMN]) else 'None'
        })
    return images


def get_first_index_not_fully_annotated_page(df, offset, ID_COLUMN):
    df_not_annotated = df[df[ANNOTATION_COLUMN].isna()]
    
    if len(df_not_annotated) == 0:
        return len(df)
    
    first_not_annotated = df_not_annotated.iloc[0]
    first_index = df[df[ID_COLUMN] == first_not_annotated[ID_COLUMN]].index[0]
    start = int(offset * np.floor(first_index / offset))
    
    return start


def create_annotated_csv(csv_path, csv_annotated):
    df = pd.read_csv(csv_path)
    df[ANNOTATOR_COLUMN] = np.nan
    df[ANNOTATION_COLUMN] = np.nan
    df.to_csv(csv_annotated, index=False)
    
    return df


def annotate_df(df, annotations, annotator, ID_COLUMN, csv_name):
    for idx, is_valid in annotations.items():
        df.loc[df[ID_COLUMN] == idx, ANNOTATOR_COLUMN] = annotator
        df.loc[df[ID_COLUMN] == idx, ANNOTATION_COLUMN] = is_valid
    df.to_csv(csv_name, index=False)
    
    return df
