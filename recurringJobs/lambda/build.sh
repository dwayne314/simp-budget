#!/bin/sh

rm function.zip
cd package/
zip -r9 ${OLDPWD}/function.zip .
cd $OLDPWD
cd opt/
zip -r9 ${OLDPWD}/function.zip .
cd $OLDPWD
zip -g function.zip lambda_function.py

