#! /bin/bash

nyc mocha --recursive
nyc check-coverage --functions 100 --branches 100 --lines 100 2> coverageError.txt
cat coverageError.txt
coverageErrorCount=$(cat coverageError.txt | wc -l)
if [ $coverageErrorCount != 0 ]; then
  read -p "your coverage is less than threshold \n would you like to commit ? (y/n) : " confirmation
  if [ $confirmation == "y" ]; then
    git commit
  fi
	rm coverageError.txt
  exit 1;
fi
	rm coverageError.txt
git commit


