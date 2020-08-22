#!/bin/sh
trap "exit" INT TERM ERR
trap "kill 0" EXIT
clear

FRONTEND_PORT=1747
if [ ! -z "$1" ]
then
    FRONTEND_PORT=$1
fi

python run_back.py &
serve -s front/build -l $FRONTEND_PORT &

wait
