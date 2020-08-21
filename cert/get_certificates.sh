#!/bin/bash

# run this to get your first certificate (make sure nginx isn't currently running!)

email=$1

docker run --rm -p 443:443 -p 80:80 --name letsencrypt -v "/etc/letsencrypt:/etc/letsencrypt" \
    -v "/var/lib/letsencrypt:/var/lib/letsencrypt" certbot/certbot certonly -n \ -m "$name" -d example.com --standalone --agree-tos