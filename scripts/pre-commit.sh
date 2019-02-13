#! /bin/bash

cat test/*.js |tr "\n" "@"| sed "s/\*\//\*---/g"|sed "s/\/\*/---\/\*/g" |tr "\-\-\-" "\n"|grep "\/\*"| tr "@" "\n" > commentedText.txt
cat test/*.js | grep '\/\/' >> commentedText.txt
cat commentedText.txt
nyc mocha
nyc check-coverage --functions 100 --branches 100 --lines 100 2> coverageError.txt
cat coverageError.txt
coverageErrorCount=$(cat coverageError.txt | wc -l)
lines=$(cat commentedText.txt|wc -l)
if [ $lines != 0 -o $coverageErrorCount != 0 ]; then
  read -p "you have some commented code & coverage is less than threshold \n would you like to commit ? (y/n) : " confirmation
  if [ $confirmation == "y" ]; then
    git commit
  fi
  exit 1;
fi
git commit
rm commentedText.txt
rm coverageError.txt


