from .back import app
from .parser import args


def main():
    app.run(debug=True, use_reloader=True, host='0.0.0.0', port=args.port)
