#!/bin/bash
cd /home/kavia/workspace/code-generation/interactive-browser-tic-tac-toe-46129-46138/web_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

