#! /bin/bash

chmod +x ./scripts/pre-commit.sh

git config --local commit.template ./.github/git-commit-template

npm install