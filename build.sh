#!/bin/bash
cd /home/ubuntu/kanban-board
unzip frontend.zip

\. ~/.nvm/nvm.sh
\. ~/.profile
\. ~/.bashrc
nvm use 14.7.0
yarn install
yarn build