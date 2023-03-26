#!/bin/bash

# Install Node.js and npm
curl -sL https://rpm.nodesource.com/setup_14.x | sudo bash -
yum install -y nodejs

# Install Git


sudo amazon-linux-extras install docker
sudo usermod -a -G docker ec2-user
# Download and install
sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo service docker start

# Fix permissions
sudo chmod +x /usr/local/bin/docker-compose
sudo aws configure --region us-east-2 --output json --profile default