import argparse

def get_parser():
    parser = argparse.ArgumentParser(description='Fast dataset cleaner')
    parser.add_argument("--csv_path", help="CSV containing the data to annotate", required=True)
    parser.add_argument("--annotated_suffix", help="CSV containing the data to annotate", default="_annotated")
    parser.add_argument("--annotator_column_name", help="Name of annotator column in the CSV", default="annotator")
    parser.add_argument("--annotation_column_name", help="Name of annotation column in the CSV", default="is_valid")
    parser.add_argument("--id_column_name", help="Name of id column in the CSV", default="id")
    
    return parser
