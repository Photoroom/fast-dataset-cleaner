import random as rd
import string
from hashlib import sha256

# rd.seed(0)    # For dev only
def sha_generator():
    word = "".join([rd.choice(string.ascii_letters) for i in range(10)])
    return sha256(word.encode('ascii')).hexdigest()


BOLD = '\033[1m'
END = '\033[0m'
UNDERLINE = '\033[4m'
GREEN = '\033[92m'
def print_important(message, important_msg=''):
    dash_line = '=' * 50
    message = UNDERLINE + GREEN + message + END
    important_msg = f'\n\n==>\t{BOLD}{important_msg}{END}' if important_msg != '' else ''
    print(f"\n{dash_line}\n\n{message}{important_msg}\n\n{dash_line}\n")
