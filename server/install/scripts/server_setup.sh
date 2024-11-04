#!/bin/bash
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install git -y
sudo apt-get install vim -y
sudo apt install inetutils-ping -y
sudo apt-get install net-tools -y
sudo curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install nodejs -y
sudo setcap CAP_NET_BIND_SERVICE=+eip /usr/bin/node
sudo snap install --classic certbot
cd /home/ubuntu
sudo -i -u ubuntu git clone https://github.com/forsbergapp/app_portfolio.git app_portfolio
cd /home/ubuntu/app_portfolio
sudo -i -u ubuntu npm install --omit=dev
sudo npm install -g pm2
sudo -i -u ubuntu pm2 start /home/ubuntu/app_portfolio/server/init.js --cwd /home/ubuntu/app_portfolio --name app_portfolio -o "/dev/null" -e "/dev/null" --watch --ignore-watch=".git .vscode .well-known data node_modules microservice .gitignore .eslintignore .eslintrc.js jsdoc.json README.md tsconfig.json"
sudo -i -u ubuntu pm2 start /home/ubuntu/app_portfolio/microservice/batch/server.js --cwd /home/ubuntu/app_portfolio --name batch --watch="microservice" --ignore-watch="microservice/geolocation microservice/mail microservice/worldcities" --watch-delay 10 --no-autorestart --silent
sudo -i -u ubuntu pm2 start /home/ubuntu/app_portfolio/microservice/mail/server.js --cwd /home/ubuntu/app_portfolio --name mail --watch="microservice" --ignore-watch="microservice/batch microservice/geolocation microservice/worldcities" --no-autorestart --silent
sudo -i -u ubuntu pm2 start /home/ubuntu/app_portfolio/microservice/geolocation/server.js --cwd /home/ubuntu/app_portfolio --name geolocation --watch="microservice" --ignore-watch="microservice/batch microservice/mail microservice/worldcities"  --no-autorestart --silent
sudo -i -u ubuntu pm2 start /home/ubuntu/app_portfolio/microservice/worldcities/server.js --cwd /home/ubuntu/app_portfolio --name worldcities --watch="microservice" --ignore-watch="microservice/batch microservice/geolocation microservice/mail"
sudo -i -u ubuntu pm2 save
sudo -i -u ubuntu pm2 stop batch
sudo -i -u ubuntu pm2 stop geolocation
sudo -i -u ubuntu pm2 stop mail