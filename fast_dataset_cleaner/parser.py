import argparse

parser = argparse.ArgumentParser()
parser.add_argument('--port', help='Port to run the app on.', default="1747")
args = parser.parse_args()
