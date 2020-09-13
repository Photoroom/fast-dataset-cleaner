from back import app
from parser import args

if __name__ == "__main__":
    app.run(debug=False, use_reloader=True, host='0.0.0.0', port=args.port)
