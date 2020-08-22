import numpy as np
import pandas as pd
import math
import os

from ..constants import ANNOTATED_SUFFIX, ANNOTATION_COLUMN, ANNOTATOR_COLUMN


class AnnotationService:
    def __init__(self):
        self.df = None
        self.id_column = None
        
        self.current_csv_path = ''
        self.csv_annotated = self.get_annotated_csv_path(self.current_csv_path)
        

    def get_annotated_csv_path(self, csv_path):
        return csv_path.replace('.csv', ANNOTATED_SUFFIX + '.csv')
        
    def create_annotated_csv(self):
        self.df = pd.read_csv(self.current_csv_path)
        self.df[ANNOTATOR_COLUMN] = np.nan
        self.df[ANNOTATION_COLUMN] = np.nan
        self.df.to_csv(self.csv_annotated, index=False)
    
    def load_annotated_csv(self):
        self.df = pd.read_csv(self.csv_annotated)


    def get_images_from_rows(self, selected_rows):
        images = []
        for ind, row in selected_rows.iterrows():
            images.append({
                'id': row[self.id_column],
                'index': ind,
                'value': row[ANNOTATION_COLUMN] if not math.isnan(row[ANNOTATION_COLUMN]) else 'None'
            })
        return images


    def get_first_index_not_fully_annotated_page(self, offset):
        df_not_annotated = self.df[self.df[ANNOTATION_COLUMN].isna()]
        
        if len(df_not_annotated) == 0:
            return len(self.df)
        
        first_not_annotated = df_not_annotated.iloc[0]
        first_index = self.df[self.df[self.id_column] == first_not_annotated[self.id_column]].index[0]
        start = int(offset * np.floor(first_index / offset))
        
        return start
    
    def get_n_annotations(self, first, offset):
        if first == -1:
            first = self.get_first_index_not_fully_annotated_page(offset)
        selected_rows = self.df[first: first + offset]
        images = self.get_images_from_rows(selected_rows)
        
        return images

    
    def get_annotations(self, csv_path, first, offset, id_column):
        if csv_path != self.current_csv_path:
            self.current_csv_path = csv_path
            self.csv_annotated = self.get_annotated_csv_path(csv_path)
            
            if os.path.exists(self.csv_annotated):
                self.load_annotated_csv()
            elif os.path.exists(self.current_csv_path):
                self.create_annotated_csv()
            else:
                return { 'error': f'CSVs not found: {csv_path} and {self.csv_annotated}' }, 200
            
        if id_column is None or id_column not in self.df:
            return { 'error': f'Column {id_column} not in the csv.' }, 200
        if id_column != self.id_column:
            self.id_column = id_column
            
        images = self.get_n_annotations(first, offset)
        
        return {
            'images': images,
            'processed': len(self.df[~self.df[ANNOTATION_COLUMN].isna()]),
            'total': len(self.df)
        }, 200


    def annotate(self, annotations, annotator):
        for idx, is_valid in annotations.items():
            self.df.loc[self.df[self.id_column] == idx, ANNOTATOR_COLUMN] = annotator
            self.df.loc[self.df[self.id_column] == idx, ANNOTATION_COLUMN] = is_valid
        self.df.to_csv(self.csv_annotated, index=False)
