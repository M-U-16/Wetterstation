#!/bin/bash

npm install     # use node package manager to install javascript librarys used to build static js files
npm run build   # build project using Rollup.js (runs command specified in package.json)

source venv/bin/activate 
pip install -r requirements.txt # install all python packages using pip
pip install gunicorn
cd Server
export FLASK_APP=run:app
flask create-default # create database files and tables